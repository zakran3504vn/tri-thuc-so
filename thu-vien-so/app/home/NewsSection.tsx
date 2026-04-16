'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAnnouncements, Announcement } from '@/lib/api';

export default function NewsSection() {
  const [news, setNews] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAnnouncements();
        // Sort by created_at descending and take first 3
        const sortedData = data
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        setNews(sortedData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-3">Tin tức & Thông báo</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Tin tức mới nhất</h2>
          </div>
          <Link href="/thong-bao" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all cursor-pointer whitespace-nowrap">
            Xem tất cả <span className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có tin tức nào</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Link href={`/thong-bao/${news[0].slug}`} className="group block cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl h-64">
                  <img 
                    src={news[0].image_url ? (news[0].image_url.startsWith('http') ? news[0].image_url : `http://localhost:5931${news[0].image_url}`) : 'https://readdy.ai/api/search-image?query=education%20news%20banner%20blue%20gradient%20abstract%20modern%20clean&width=800&height=400&seq=news&orientation=landscape'} 
                    alt={news[0].title} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  {news[0].priority === 1 && <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">NỔI BẬT</span>}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">{news[0].category_name || 'Thông báo'}</span>
                    <h3 className="text-white font-bold text-xl mt-1 leading-snug group-hover:text-green-200 transition-colors">{news[0].title}</h3>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{news[0].content?.replace(/<[^>]*>/g, '').slice(0, 120) || ''}</p>
                    <span className="text-gray-400 text-xs mt-3 block">{new Date(news[0].created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            </div>

          <div className="flex flex-col gap-4">
            {news.slice(1).map((item) => (
              <Link key={item.id} href={`/thong-bao/${item.slug}`} className="group flex gap-4 bg-gray-50 hover:bg-blue-50 rounded-2xl p-4 transition-colors duration-200 cursor-pointer">
                <img 
                  src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5931${item.image_url}`) : 'https://readdy.ai/api/search-image?query=education%20icon%20blue%20simple%20minimal&width=96&height=80&seq=newsicon&orientation=landscape'} 
                  alt={item.title} 
                  className="w-24 h-20 object-cover object-top rounded-xl flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-blue-600 text-xs font-semibold">{item.category_name || 'Thông báo'}</span>
                  <h4 className="font-semibold text-gray-800 text-sm mt-1 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{item.title}</h4>
                  <span className="text-gray-400 text-xs mt-2 block">{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </Link>
            ))}
            <Link href="/thong-bao" className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-200 text-blue-500 text-sm font-medium rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer whitespace-nowrap">
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Xem thêm tin tức
            </Link>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
