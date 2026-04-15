'use client';
import { useState, useEffect } from 'react';
import { createAnnouncement, getAnnouncements, updateAnnouncement, uploadImage, Announcement } from '@/lib/api';

export default function AdminPosts() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('general');
  const [postPriority, setPostPriority] = useState(1);
  const [postPublishDate, setPostPublishDate] = useState('');
  const [postExpiryDate, setPostExpiryDate] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await getAnnouncements(undefined, true);
          setAnnouncements(data);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setPostTitle('');
    setPostContent('');
    setPostCategory('general');
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
    setPostContent(item.content);
    setPostCategory(item.announcement_type);
    setPostPriority(item.priority);
    setPostPublishDate(item.publish_date ? item.publish_date.slice(0, 16) : '');
    setPostExpiryDate(item.expiry_date ? item.expiry_date.slice(0, 16) : '');
    setPostImageUrl(item.image_url || '');
    setPreviewUrl(item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:3001${item.image_url}`) : '');
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
        content: postContent,
        announcement_type: postCategory,
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
      setPostContent('');
      setPostCategory('general');
      setPostPriority(1);
      setPostPublishDate('');
      setPostExpiryDate('');
      setPostImageUrl('');
      setSelectedFile(null);
      setPreviewUrl('');
      setEditingId(null);
      setTimeout(() => setShowForm(false), 1500);

      // Reload announcements
      const updatedAnnouncements = await getAnnouncements(undefined, true);
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

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reload announcements
      const refreshedAnnouncements = await getAnnouncements(undefined, true);
      setAnnouncements(refreshedAnnouncements);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleView = (id: number) => {
    window.open(`/thong-bao/${id}`, '_blank');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề thông báo</label>
              <input 
                value={postTitle} 
                onChange={e => setPostTitle(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập tiêu đề..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại thông báo</label>
              <div className="flex gap-2">
                {[
                  { value: 'general', label: 'Thông báo chung' },
                  { value: 'urgent', label: 'Khẩn cấp' },
                  { value: 'event', label: 'Sự kiện' }
                ].map(c => (
                  <button 
                    key={c.value} 
                    type="button"
                    onClick={() => setPostCategory(c.value)} 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${postCategory === c.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày hết hạn (tùy chọn)</label>
              <input 
                type="datetime-local"
                value={postExpiryDate}
                onChange={e => setPostExpiryDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa</label>
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
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung</label>
              <textarea 
                value={postContent} 
                onChange={e => setPostContent(e.target.value)} 
                rows={8} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Nhập nội dung thông báo..."
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
                      <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:3001${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.announcement_type === 'urgent' ? 'bg-red-100 text-red-700' :
                        item.announcement_type === 'event' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.announcement_type === 'urgent' ? 'Khẩn cấp' :
                         item.announcement_type === 'event' ? 'Sự kiện' : 'Thông báo chung'}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(item.publish_date)}</span>
                    </div>
                    <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.content}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(item.id)}
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
