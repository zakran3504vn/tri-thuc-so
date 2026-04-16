'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  order_index: number;
  is_active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.khotrithucso.vn/api';

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '/mon-hoc',
    order_index: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingBanner ? `${API_URL}/banners/${editingBanner.id}` : `${API_URL}/banners`;
    const method = editingBanner ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await fetch(`${API_URL}/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
      link_url: banner.link_url,
      order_index: banner.order_index,
      is_active: banner.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '/mon-hoc',
      order_index: 0,
      is_active: true
    });
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    resetForm();
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file ảnh (jpg, png, gif...)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File ảnh không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Banners</h1>
            <p className="text-gray-500 mt-1">Chỉnh sửa banner hiển thị ở Hero Section</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              ← Quay lại Dashboard
            </Link>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Thêm Banner
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={e => setFormData({...formData, link_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh Banner</label>
                
                {/* Preview */}
                {formData.image_url && (
                  <div className="mb-3 relative">
                    <img 
                      src={formData.image_url.startsWith('http') ? formData.image_url : `https://backend.khotrithucso.vn${formData.image_url}`} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* File Upload */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                      <span className="text-blue-600 font-medium">
                        {uploading ? 'Đang tải lên...' : '📷 Chọn ảnh từ máy tính'}
                      </span>
                    </div>
                  </label>
                </div>
                
                {/* Or URL Input */}
                <div className="mt-3">
                  <span className="text-xs text-gray-500">Hoặc nhập URL:</span>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Hiển thị</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có banner nào</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-40 bg-gray-100">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{banner.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Link: {banner.link_url}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
