'use client';
import { useState, useEffect, useCallback } from 'react';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  order_index: number;
  is_active: boolean;
}

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

interface News {
  id: number;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  is_highlighted: boolean;
  order_index: number;
  is_active: boolean;
}

export default function AdminHomepage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'stats' | 'news'>('banners');

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    order_index: 0,
    is_active: true
  });

  // Stats state
  const [stats, setStats] = useState<Stat[]>([]);
  const [showStatForm, setShowStatForm] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [statForm, setStatForm] = useState({
    label: '',
    value: '',
    icon: '',
    order_index: 0,
    is_active: true
  });

  // News state
  const [news, setNews] = useState<News[]>([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newsForm, setNewsForm] = useState({
    category: '',
    date: '',
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_highlighted: false,
    order_index: 0,
    is_active: true
  });

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5931/api/banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5931/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5931/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchStats();
    fetchNews();
  }, [fetchBanners, fetchStats, fetchNews]);

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBanner
        ? `http://localhost:5931/api/banners/${editingBanner.id}`
        : 'http://localhost:5931/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm)
      });
      
      if (response.ok) {
        setShowBannerForm(false);
        setEditingBanner(null);
        setBannerForm({ title: '', description: '', image_url: '', link_url: '', order_index: 0, is_active: true });
        fetchBanners();
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStat
        ? `http://localhost:5931/api/stats/${editingStat.id}`
        : 'http://localhost:5931/api/stats';
      const method = editingStat ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statForm)
      });
      
      if (response.ok) {
        setShowStatForm(false);
        setEditingStat(null);
        setStatForm({ label: '', value: '', icon: '', order_index: 0, is_active: true });
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to save stat:', error);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNews
        ? `http://localhost:5931/api/news/${editingNews.id}`
        : 'http://localhost:5931/api/news';
      const method = editingNews ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsForm)
      });
      
      if (response.ok) {
        setShowNewsForm(false);
        setEditingNews(null);
        setNewsForm({ category: '', date: '', title: '', excerpt: '', content: '', image_url: '', is_highlighted: false, order_index: 0, is_active: true });
        fetchNews();
      }
    } catch (error) {
      console.error('Failed to save news:', error);
    }
  };

  const deleteBanner = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await fetch(`http://localhost:5931/api/banners/${id}`, { method: 'DELETE' });
        fetchBanners();
      } catch (error) {
        console.error('Failed to delete banner:', error);
      }
    }
  };

  const deleteStat = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa stat này?')) {
      try {
        await fetch(`http://localhost:5931/api/stats/${id}`, { method: 'DELETE' });
        fetchStats();
      } catch (error) {
        console.error('Failed to delete stat:', error);
      }
    }
  };

  const deleteNews = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      try {
        await fetch(`http://localhost:5931/api/news/${id}`, { method: 'DELETE' });
        fetchNews();
      } catch (error) {
        console.error('Failed to delete news:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản lý trang chủ</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'banners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Banners
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Thống kê
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 text-sm font-semibold cursor-pointer ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tin tức
            </button>
          </div>

          {/* Banners Tab */}
          {activeTab === 'banners' && (
            <>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setBannerForm({ title: '', description: '', image_url: '', link_url: '', order_index: 0, is_active: true });
                  setShowBannerForm(true);
                }}
                className="mb-6 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Thêm banner mới
              </button>

              {showBannerForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingBanner ? 'Cập nhật banner' : 'Thêm banner mới'}</h4>
                  <form onSubmit={handleBannerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={bannerForm.description}
                        onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh *</label>
                      <input
                        type="text"
                        value={bannerForm.image_url}
                        onChange={e => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="text"
                        value={bannerForm.link_url}
                        onChange={e => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                      <input
                        type="number"
                        value={bannerForm.order_index}
                        onChange={e => setBannerForm({ ...bannerForm, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={bannerForm.is_active}
                        onChange={e => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="text-sm text-gray-700">Hoạt động</label>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingBanner ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBannerForm(false);
                          setEditingBanner(null);
                          setBannerForm({ title: '', description: '', image_url: '', link_url: '', order_index: 0, is_active: true });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map(banner => (
                  <div key={banner.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-1">{banner.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{banner.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBanner(banner);
                          setBannerForm(banner);
                          setShowBannerForm(true);
                        }}
                        className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="flex-1 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <>
              <button
                onClick={() => {
                  setEditingStat(null);
                  setStatForm({ label: '', value: '', icon: '', order_index: 0, is_active: true });
                  setShowStatForm(true);
                }}
                className="mb-6 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Thêm thống kê mới
              </button>

              {showStatForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingStat ? 'Cập nhật thống kê' : 'Thêm thống kê mới'}</h4>
                  <form onSubmit={handleStatSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn *</label>
                      <input
                        type="text"
                        value={statForm.label}
                        onChange={e => setStatForm({ ...statForm, label: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị *</label>
                      <input
                        type="text"
                        value={statForm.value}
                        onChange={e => setStatForm({ ...statForm, value: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="text"
                        value={statForm.icon}
                        onChange={e => setStatForm({ ...statForm, icon: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ví dụ: ri-user-line"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                      <input
                        type="number"
                        value={statForm.order_index}
                        onChange={e => setStatForm({ ...statForm, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={statForm.is_active}
                        onChange={e => setStatForm({ ...statForm, is_active: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="text-sm text-gray-700">Hoạt động</label>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingStat ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowStatForm(false);
                          setEditingStat(null);
                          setStatForm({ label: '', value: '', icon: '', order_index: 0, is_active: true });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <div key={stat.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <i className={`${stat.icon} text-2xl text-blue-600`}></i>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingStat(stat);
                            setStatForm(stat);
                            setShowStatForm(true);
                          }}
                          className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer"
                        >
                          <i className="ri-edit-line text-sm"></i>
                        </button>
                        <button
                          onClick={() => deleteStat(stat.id)}
                          className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{stat.value}</h4>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsForm({ category: '', date: '', title: '', excerpt: '', content: '', image_url: '', is_highlighted: false, order_index: 0, is_active: true });
                  setShowNewsForm(true);
                }}
                className="mb-6 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Thêm tin tức mới
              </button>

              {showNewsForm && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">{editingNews ? 'Cập nhật tin tức' : 'Thêm tin tức mới'}</h4>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                        <input
                          type="text"
                          value={newsForm.category}
                          onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                        <input
                          type="text"
                          value={newsForm.date}
                          onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="DD/MM/YYYY"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={newsForm.title}
                        onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                      <textarea
                        value={newsForm.excerpt}
                        onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                      <textarea
                        value={newsForm.content}
                        onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh</label>
                      <input
                        type="text"
                        value={newsForm.image_url}
                        onChange={e => setNewsForm({ ...newsForm, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                      <input
                        type="number"
                        value={newsForm.order_index}
                        onChange={e => setNewsForm({ ...newsForm, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newsForm.is_highlighted}
                          onChange={e => setNewsForm({ ...newsForm, is_highlighted: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label className="text-sm text-gray-700">Nổi bật</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newsForm.is_active}
                          onChange={e => setNewsForm({ ...newsForm, is_active: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label className="text-sm text-gray-700">Hoạt động</label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer">
                        {editingNews ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewsForm(false);
                          setEditingNews(null);
                          setNewsForm({ category: '', date: '', title: '', excerpt: '', content: '', image_url: '', is_highlighted: false, order_index: 0, is_active: true });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map(item => (
                  <div key={item.id} className={`bg-gray-50 rounded-xl p-4 border ${item.is_highlighted ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{item.category}</span>
                      {item.is_highlighted && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Nổi bật</span>}
                    </div>
                    <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.excerpt}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setNewsForm(item);
                          setShowNewsForm(true);
                        }}
                        className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="flex-1 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
