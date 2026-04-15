'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAnnouncements, Announcement } from '@/lib/api';

const categories = ['Tất cả', 'general', 'urgent', 'event'];
const catMapping: Record<string, string> = { 
  'general': 'Thông báo', 
  'urgent': 'Khẩn cấp', 
  'event': 'Sự kiện',
  'Tất cả': 'Tất cả'
};
const catColor: Record<string, string> = { 
  'general': 'bg-blue-100 text-blue-700', 
  'urgent': 'bg-red-100 text-red-700', 
  'event': 'bg-green-100 text-green-700',
  'Tất cả': 'bg-gray-100 text-gray-600'
};

const typeToCategory: Record<string, string> = {
  'general': 'Thông báo',
  'urgent': 'Khẩn cấp',
  'event': 'Sự kiện'
};

export default function ThongBaoPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const type = selectedCategory === 'Tất cả' ? undefined : selectedCategory;
        const data = await getAnnouncements(type, true);
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [selectedCategory]);

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
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${selectedCategory === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
              >
                {catMapping[c]}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map(item => (
                <Link key={item.id} href={`/thong-bao/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block border border-gray-100">
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-green-100">
                    {item.image_url ? (
                      <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:3001${item.image_url}`} 
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
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${catColor[item.announcement_type] || 'bg-gray-100 text-gray-600'}`}>
                        {typeToCategory[item.announcement_type] || item.announcement_type}
                      </span>
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
