'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAnnouncements, getAnnouncementCategories, Announcement, AnnouncementCategory } from '@/lib/api';


export default function ThongBaoPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [announcementsData, categoriesData] = await Promise.all([
          getAnnouncements(undefined, selectedCategoryId ?? undefined, false),
          getAnnouncementCategories()
        ]);
        setAnnouncements(announcementsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategoryId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getExcerpt = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-700 to-green-600 py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">Thông báo</h1>
          <p className="text-blue-100 text-lg">Cập nhật tin tức và thông báo mới nhất</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-2 mb-8 flex-wrap">
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${selectedCategoryId === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${selectedCategoryId === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-3xl text-red-600"></i>
              </div>
              <p className="text-red-600 font-medium mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có thông báo nào</p>
              <p className="text-gray-400 text-sm mt-2">Hãy tạo thông báo mới từ trang Admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map(item => (
                <Link key={item.id} href={`/thong-bao/${item.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block border border-gray-100">
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-green-100">
                    {item.image_url ? (
                      <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `https://backend.khotrithucso.vn${item.image_url}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-notification-3-line text-6xl text-blue-300"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.category_name && (
                          <span 
                            className="text-xs font-semibold px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: item.category_color === 'blue' ? '#dbeafe' :
                                              item.category_color === 'red' ? '#fee2e2' :
                                              item.category_color === 'green' ? '#dcfce7' :
                                              item.category_color === 'purple' ? '#f3e8ff' :
                                              item.category_color === 'orange' ? '#ffedd5' : '#f3f4f6',
                              color: item.category_color === 'blue' ? '#1d4ed8' :
                                     item.category_color === 'red' ? '#b91c1c' :
                                     item.category_color === 'green' ? '#15803d' :
                                     item.category_color === 'purple' ? '#7c3aed' :
                                     item.category_color === 'orange' ? '#c2410c' : '#374151'
                            }}
                          >
                            {item.category_name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(item.publish_date)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{getExcerpt(item.content)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
