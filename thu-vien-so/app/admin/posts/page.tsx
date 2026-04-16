'use client';
import { useState, useEffect } from 'react';
import { createAnnouncement, getAnnouncements, updateAnnouncement, uploadImage, getAnnouncementCategories, Announcement, AnnouncementCategory } from '@/lib/api';

export default function AdminPosts() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategoryId, setPostCategoryId] = useState<number | null>(null);
  const [postPriority, setPostPriority] = useState(1);
  const [postPublishDate, setPostPublishDate] = useState('');
  const [postExpiryDate, setPostExpiryDate] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const [announcementsData, categoriesData] = await Promise.all([
            getAnnouncements(undefined, undefined, true),
            getAnnouncementCategories()
          ]);
          setAnnouncements(announcementsData);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setPostTitle('');
    setPostSlug('');
    setPostContent('');
    setPostCategoryId(null);
    setPostPriority(1);
    setPostPublishDate('');
    setPostExpiryDate('');
    setPostImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleEdit = (item: Announcement) => {
    setEditingId(item.id);
    setPostTitle(item.title);
    setPostSlug(item.slug);
    setPostContent(item.content);
    setPostCategoryId(item.category_id);
    setPostPriority(item.priority);
    setPostPublishDate(item.publish_date ? item.publish_date.slice(0, 16) : '');
    setPostExpiryDate(item.expiry_date ? item.expiry_date.slice(0, 16) : '');
    setPostImageUrl(item.image_url || '');
    setPreviewUrl(item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `https://backend.khotrithucso.vn${item.image_url}`) : '');
    setSelectedFile(null);
    setSubmitMessage('');
    setShowForm(true);
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      setSubmitMessage('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      // Upload ảnh nếu có chọn file mới
      let finalImageUrl = postImageUrl;
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile);
        finalImageUrl = uploadResult.imageUrl;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const announcementData = {
        title: postTitle,
        slug: postSlug || undefined,
        content: postContent,
        category_id: postCategoryId ?? undefined,
        priority: postPriority,
        publish_date: postPublishDate || new Date().toISOString(),
        expiry_date: postExpiryDate || undefined,
        image_url: finalImageUrl || undefined,
        created_by: user.id,
      };

      if (editingId) {
        await updateAnnouncement(editingId, announcementData, token);
        setSubmitMessage('Cập nhật thông báo thành công!');
      } else {
        await createAnnouncement(announcementData, token);
        setSubmitMessage('Đăng thông báo thành công!');
      }

      // Reset form and close
      setPostTitle('');
      setPostSlug('');
      setPostContent('');
      setPostCategoryId(null);
      setPostPriority(1);
      setPostPublishDate('');
      setPostExpiryDate('');
      setPostImageUrl('');
      setSelectedFile(null);
      setPreviewUrl('');
      setEditingId(null);
      setTimeout(() => setShowForm(false), 1500);

      // Reload announcements
      const updatedAnnouncements = await getAnnouncements(undefined, undefined, true);
      setAnnouncements(updatedAnnouncements);
    } catch (error: any) {
      setSubmitMessage(error.message || 'Lỗi khi lưu thông báo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.khotrithucso.vn/api'}/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reload announcements
      const refreshedAnnouncements = await getAnnouncements(undefined, undefined, true);
      setAnnouncements(refreshedAnnouncements);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleView = (announcement: Announcement) => {
    window.open(`/thong-bao/${announcement.slug}`, '_blank');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setPostImageUrl('');
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
            <h3 className="font-bold text-gray-900">{editingId ? 'Cập nhật thông báo' : 'Đăng thông báo mới'}</h3>
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
          <form onSubmit={handleSubmitAnnouncement} className="space-y-5">
            {/* === THÔNG TIN CƠ BẢN === */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <i className="ri-article-line text-blue-500"></i>
                Thông tin cơ bản
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input 
                  value={postTitle} 
                  onChange={e => setPostTitle(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nhập tiêu đề thông báo..." 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
                  <input 
                    value={postSlug} 
                    onChange={e => setPostSlug(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                    placeholder="tu-dong-tao-tu-tieu-de..." 
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={postCategoryId || ''} 
                    onChange={e => setPostCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* === CÀI ĐẶT HIỂN THỊ === */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <i className="ri-settings-3-line text-green-500"></i>
                Cài đặt hiển thị
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Độ ưu tiên</label>
                  <select 
                    value={postPriority} 
                    onChange={e => setPostPriority(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Thấp</option>
                    <option value="2">Trung bình</option>
                    <option value="3">Cao</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày đăng</label>
                  <input 
                    type="datetime-local"
                    value={postPublishDate}
                    onChange={e => setPostPublishDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày hết hạn</label>
                  <input 
                    type="datetime-local"
                    value={postExpiryDate}
                    onChange={e => setPostExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* === ẢNH BÌA === */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <i className="ri-image-line text-purple-500"></i>
                Ảnh bìa (tùy chọn)
              </h4>
              
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white">
                  <input 
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-image-add-line text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">Nhấp để chọn ảnh</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (tối đa 5MB)</p>
                  </label>
                </div>
              )}
            </div>

            {/* === NỘI DUNG === */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <i className="ri-file-text-line text-orange-500"></i>
                Nội dung chi tiết <span className="text-red-500">*</span>
              </h4>
              
              <textarea 
                value={postContent} 
                onChange={e => setPostContent(e.target.value)} 
                rows={10} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white" 
                placeholder="Nhập nội dung thông báo chi tiết..."
                required
              ></textarea>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Đăng thông báo')}
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
            <h3 className="font-bold text-gray-900">Danh sách thông báo</h3>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Thêm thông báo
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Đang tải...</p>
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có thông báo nào</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  {item.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image_url.startsWith('http') ? item.image_url : `https://backend.khotrithucso.vn${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.category_name && (
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: item.category_color ? `var(--${item.category_color}-100, #dbeafe)` : '#dbeafe',
                            color: item.category_color ? `var(--${item.category_color}-700, #1d4ed8)` : '#1d4ed8'
                          }}
                        >
                          {item.category_name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(item.publish_date)}</span>
                    </div>
                    <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.content}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(item)}
                      className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
                      title="Xem"
                    >
                      <i className="ri-eye-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="w-7 h-7 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 cursor-pointer"
                      title="Sửa"
                    >
                      <i className="ri-edit-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteAnnouncement(item.id)}
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
