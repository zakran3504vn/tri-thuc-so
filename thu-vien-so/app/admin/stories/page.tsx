'use client';
import { useState, useEffect } from 'react';
import {
  Story,
  getStories,
  createStory,
  updateStory,
  deleteStory,
  uploadImage
} from '@/lib/api';

export default function AdminStories() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Cổ tích', 'Phiêu lưu', 'Khoa học', 'Lịch sử', 'Thiếu nhi'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setCategory('');
    setTotalPages(null);
    setDescription('');
    setCoverImage('');
    setSelectedCoverFile(null);
    setPreviewUrl('');
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleEdit = (item: Story) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAuthor(item.author);
    setCategory(item.category);
    setTotalPages(item.total_pages);
    setDescription(item.description || '');
    setCoverImage(item.cover_image || '');
    setPreviewUrl(item.cover_image ? (item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:3001${item.cover_image}`) : '');
    setSelectedCoverFile(null);
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !category || !totalPages) {
      setSubmitMessage('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');

      // Upload cover image if selected
      let finalCoverImage = coverImage;
      if (selectedCoverFile) {
        const uploadResult = await uploadImage(selectedCoverFile);
        finalCoverImage = uploadResult.imageUrl;
      }

      const token = localStorage.getItem('token');
      const storyData = {
        title,
        author,
        category,
        total_pages: totalPages,
        description: description || undefined,
        cover_image: finalCoverImage || undefined,
      };

      if (editingId) {
        await updateStory(editingId, storyData, token || undefined);
        setSubmitMessage('Cập nhật truyện thành công!');
      } else {
        await createStory(storyData, token || undefined);
        setSubmitMessage('Thêm truyện thành công!');
      }

      // Reset form and close
      setTitle('');
      setAuthor('');
      setCategory('');
      setTotalPages(null);
      setDescription('');
      setCoverImage('');
      setSelectedCoverFile(null);
      setPreviewUrl('');
      setEditingId(null);
      setTimeout(() => setShowForm(false), 1500);

      // Reload data
      await fetchData();
    } catch (error: any) {
      setSubmitMessage(error.message || 'Lỗi khi lưu truyện');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await deleteStory(id, token || undefined);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    setSelectedCoverFile(null);
    setPreviewUrl('');
    setCoverImage('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{editingId ? 'Cập nhật truyện' : 'Thêm truyện mới'}</h3>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề truyện *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nhập tiêu đề..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tác giả *</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nhập tên tác giả..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thể loại *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Chọn thể loại</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số trang *</label>
              <input
                type="number"
                value={totalPages || ''}
                onChange={e => setTotalPages(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nhập số trang..."
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Nhập mô tả..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa</label>
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleCoverFileSelect}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-image-add-line text-green-600 text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">Nhấp để chọn ảnh bìa</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (tối đa 5MB)</p>
                  </label>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm truyện')}
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
            <h3 className="font-bold text-gray-900">Danh sách truyện</h3>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Thêm truyện
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Đang tải...</p>
            </div>
          ) : stories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có truyện nào</p>
          ) : (
            <div className="space-y-3">
              {stories.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  {item.cover_image && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:3001${item.cover_image}`} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400">{item.total_pages} trang</span>
                    </div>
                    <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.author}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-7 h-7 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 cursor-pointer"
                      title="Sửa"
                    >
                      <i className="ri-edit-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer"
                      title="Xóa"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
