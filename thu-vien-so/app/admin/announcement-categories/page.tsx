'use client';
import { useState, useEffect } from 'react';
import { 
  getAnnouncementCategories, 
  createAnnouncementCategory, 
  updateAnnouncementCategory, 
  deleteAnnouncementCategory,
  AnnouncementCategory 
} from '@/lib/api';

const colorOptions = [
  { value: 'blue', label: 'Xanh dương', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'red', label: 'Đỏ', bg: 'bg-red-100', text: 'text-red-700' },
  { value: 'green', label: 'Xanh lá', bg: 'bg-green-100', text: 'text-green-700' },
  { value: 'purple', label: 'Tím', bg: 'bg-purple-100', text: 'text-purple-700' },
  { value: 'orange', label: 'Cam', bg: 'bg-orange-100', text: 'text-orange-700' },
  { value: 'gray', label: 'Xám', bg: 'bg-gray-100', text: 'text-gray-700' },
];

export default function AnnouncementCategoriesPage() {
  const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('blue');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncementCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setColor('blue');
    setDescription('');
    setIsActive(true);
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleEdit = (category: AnnouncementCategory) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setColor(category.color || 'blue');
    setDescription(category.description || '');
    setIsActive(category.is_active !== false);
    setSubmitMessage('');
    setShowForm(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingId && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setSubmitMessage('Vui lòng nhập tên và slug');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      const categoryData = {
        name,
        slug,
        color,
        description: description || undefined,
        is_active: isActive,
      };

      if (editingId) {
        await updateAnnouncementCategory(editingId, categoryData, token);
        setSubmitMessage('Cập nhật danh mục thành công!');
      } else {
        await createAnnouncementCategory(categoryData, token);
        setSubmitMessage('Tạo danh mục thành công!');
      }

      // Reset and refresh
      setTimeout(() => {
        setShowForm(false);
        fetchCategories();
      }, 1500);
    } catch (error: any) {
      setSubmitMessage(error.message || 'Lỗi khi lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Các thông báo thuộc danh mục này sẽ không bị xóa nhưng sẽ không có danh mục.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      await deleteAnnouncementCategory(id, token);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Lỗi khi xóa danh mục');
    }
  };

  const getColorClasses = (colorValue: string) => {
    const option = colorOptions.find(c => c.value === colorValue);
    return option || colorOptions[0];
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">
              {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>

          {submitMessage && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${submitMessage.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input 
                  value={name} 
                  onChange={e => handleNameChange(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ví dụ: Thông báo chung"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                  placeholder="thong-bao-chung"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Dùng cho URL, không dấu, không khoảng trắng</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Màu sắc</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      color === c.value 
                        ? `${c.bg} ${c.text} ring-2 ring-offset-1 ring-gray-300` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${c.bg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Hiển thị danh mục
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm danh mục')}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Danh sách danh mục thông báo</h3>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Thêm danh mục
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Đang tải...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-folder-line text-3xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
              <button 
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Thêm danh mục đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => {
                const colorClasses = getColorClasses(category.color || 'blue');
                return (
                  <div 
                    key={category.id} 
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.bg}`}>
                      <i className="ri-folder-line text-xl"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses.bg} ${colorClasses.text}`}>
                          {colorClasses.label}
                        </span>
                        {category.is_active === false && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            Ẩn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">/{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Sửa"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
