'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getStories, Story } from '@/lib/api';

const categories = ['Tất cả', 'Cổ tích', 'Phiêu lưu', 'Khoa học', 'Lịch sử', 'Thiếu nhi'];

export default function TruyenDocPage() {
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [books, setBooks] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories(activeCat);
  }, [activeCat]);

  const loadStories = async (category: string) => {
    try {
      setLoading(true);
      const data = await getStories(category);
      setBooks(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-green-700 to-teal-600 py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">Truyện đọc</h1>
          <p className="text-green-100 text-lg">Kho truyện phong phú dành cho thiếu nhi</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lọc theo thể loại</h3>
              <div className="space-y-1">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCat(c)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${activeCat === c ? 'bg-green-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>{c}</button>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-2">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeCat === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{c}</button>
              ))}
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-500">Đang tải...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {books.map((book: Story) => (
                  <Link key={book.id} href={`/truyen-doc/${book.id}`} className="group cursor-pointer block">
                    <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1" style={{ paddingBottom: '140%' }}>
                      <img src={book.cover_image ? (book.cover_image.startsWith('http') ? book.cover_image : `https://backend.khotrithucso.vn${book.cover_image}`) : '/placeholder.jpg'} alt={book.title} className="absolute inset-0 w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-xs font-semibold flex items-center gap-1"><span className="w-4 h-4 flex items-center justify-center"><i className="ri-book-open-line"></i></span>Đọc ngay</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs text-green-600 font-medium">{book.category}</span>
                      <h4 className="font-semibold text-gray-800 text-sm mt-0.5 line-clamp-2">{book.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{book.author} · {book.total_pages} trang</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
