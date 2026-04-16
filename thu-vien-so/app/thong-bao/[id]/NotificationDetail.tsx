'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAnnouncementBySlug, getAnnouncements, Announcement } from '@/lib/api';

interface Props { newsId: string; }


export default function NotificationDetail({ newsId }: Props) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncementBySlug(newsId);
        setAnnouncement(data);

        // Fetch related announcements (same category, excluding current)
        const allAnnouncements = await getAnnouncements(undefined, data.category_id ?? undefined, false);
        const related = allAnnouncements
          .filter(a => a.id !== data.id)
          .slice(0, 3);
        setRelatedAnnouncements(related);
      } catch (err) {
        setError('Không tìm thấy thông báo');
        console.error('Failed to fetch announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [newsId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <i className="ri-error-warning-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">{error || 'Không tìm thấy thông báo'}</p>
              <Link href="/thong-bao" className="mt-4 text-blue-600 hover:underline">
                ← Quay lại danh sách thông báo
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Split content into paragraphs
  const contentParagraphs = announcement.content.split('\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="relative h-80 overflow-hidden">
          <img 
            src={announcement.image_url 
              ? (announcement.image_url.startsWith('http') ? announcement.image_url : `http://localhost:5931${announcement.image_url}`)
              : 'https://readdy.ai/api/search-image?query=education%20news%20banner%20blue%20gradient%20abstract%20modern%20clean&width=1200&height=500&seq=default&orientation=landscape'} 
            alt={announcement.title} 
            className="w-full h-full object-cover object-top" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                {announcement.category_name && (
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: announcement.category_color === 'blue' ? '#dbeafe' :
                                      announcement.category_color === 'red' ? '#fee2e2' :
                                      announcement.category_color === 'green' ? '#dcfce7' :
                                      announcement.category_color === 'purple' ? '#f3e8ff' :
                                      announcement.category_color === 'orange' ? '#ffedd5' : '#f3f4f6',
                      color: announcement.category_color === 'blue' ? '#1d4ed8' :
                             announcement.category_color === 'red' ? '#b91c1c' :
                             announcement.category_color === 'green' ? '#15803d' :
                             announcement.category_color === 'purple' ? '#7c3aed' :
                             announcement.category_color === 'orange' ? '#c2410c' : '#374151'
                    }}
                  >
                    {announcement.category_name}
                  </span>
                )}
                <span className="text-white/70 text-sm">{formatDate(announcement.publish_date)}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white leading-tight">{announcement.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-10">
          <article className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 rounded-full">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{announcement.created_by_name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{formatDate(announcement.publish_date)}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer text-gray-500 hover:text-blue-600">
                  <i className="ri-share-line text-sm"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer text-gray-500 hover:text-red-500">
                  <i className="ri-heart-line text-sm"></i>
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              {contentParagraphs.map((para: string, i: number) => (
                <p key={i} className="text-gray-700 text-base leading-relaxed mb-5">{para}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">#thong-bao</span>
                {announcement.category_name && (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">#{announcement.category_slug}</span>
                )}
              </div>
            </div>

            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex-shrink-0">
                <i className="ri-notification-3-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">Đăng ký nhận thông báo mới</p>
                <p className="text-xs text-gray-500 mt-0.5">Nhận ngay các thông báo quan trọng qua email</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs font-semibold rounded-full hover:shadow-md transition-all cursor-pointer whitespace-nowrap">Đăng ký</button>
            </div>
          </article>

          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center"><i className="ri-newspaper-line text-blue-500"></i></span>
                  Tin liên quan
                </h3>
                <div className="space-y-4">
                  {relatedAnnouncements.map((r: Announcement) => (
                    <Link key={r.id} href={`/thong-bao/${r.slug}`} className="flex gap-3 group cursor-pointer">
                      <img 
                        src={r.image_url 
                          ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5931${r.image_url}`)
                          : 'https://readdy.ai/api/search-image?query=education%20news%20thumbnail%20blue%20gradient&width=400&height=260&seq=default&orientation=landscape'} 
                        alt={r.title} 
                        className="w-16 h-12 object-cover object-top rounded-lg flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(r.publish_date)}</p>
                      </div>
                    </Link>
                  ))}
                  {relatedAnnouncements.length === 0 && (
                    <p className="text-xs text-gray-400">Không có tin liên quan</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl p-5 text-white">
                <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl mb-3">
                  <i className="ri-book-open-line text-xl"></i>
                </div>
                <h3 className="font-bold text-base mb-1">Khám phá Thư Viện Số</h3>
                <p className="text-white/80 text-xs mb-4">Hàng nghìn tài liệu, sách và bài giảng chờ bạn khám phá</p>
                <Link href="/mon-hoc" className="block text-center py-2 bg-white text-blue-600 font-semibold text-xs rounded-full hover:shadow-md transition-all cursor-pointer">Vào học ngay</Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tin tức khác</h2>
            <Link href="/thong-bao" className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedAnnouncements.map((r: Announcement) => (
              <Link key={r.id} href={`/thong-bao/${r.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block border border-gray-100">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={r.image_url 
                      ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5931${r.image_url}`)
                      : 'https://readdy.ai/api/search-image?query=education%20news%20thumbnail%20blue%20gradient&width=400&height=260&seq=default&orientation=landscape'} 
                    alt={r.title} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{formatDate(r.publish_date)}</p>
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
          {relatedAnnouncements.length === 0 && (
            <p className="text-center text-gray-400">Không có tin tức khác</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
