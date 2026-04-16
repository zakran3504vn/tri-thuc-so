'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFeaturedBooks, ReferenceBook } from '@/lib/api';

const defaultBooks = [
  { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', type: 'Truyện đọc', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20children%20story%20book%20cover%20cricket%20adventure%20colorful%20illustration%20warm%20background%20simple%20clean&width=200&height=280&seq=book001&orientation=portrait', href: '/truyen-doc' },
  { title: 'Toán Nâng Cao Lớp 5', author: 'NXB Giáo Dục', type: 'Sách tham khảo', img: 'https://readdy.ai/api/search-image?query=mathematics%20textbook%20cover%20grade%205%20blue%20clean%20modern%20design%20numbers%20geometric%20shapes%20simple&width=200&height=280&seq=book002&orientation=portrait', href: '/sach-tham-khao' },
  { title: 'Cô Bé Bán Diêm', author: 'H.C. Andersen', type: 'Truyện đọc', img: 'https://readdy.ai/api/search-image?query=fairy%20tale%20book%20cover%20little%20match%20girl%20illustration%20warm%20golden%20light%20snow%20winter%20simple%20clean&width=200&height=280&seq=book003&orientation=portrait', href: '/truyen-doc' },
  { title: 'Tiếng Anh Giao Tiếp', author: 'NXB Trẻ', type: 'Sách tham khảo', img: 'https://readdy.ai/api/search-image?query=English%20communication%20book%20cover%20teal%20green%20modern%20design%20speech%20bubbles%20clean%20minimal&width=200&height=280&seq=book004&orientation=portrait', href: '/sach-tham-khao' },
  { title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', type: 'Truyện đọc', img: 'https://readdy.ai/api/search-image?query=The%20Little%20Prince%20book%20cover%20illustration%20planet%20stars%20night%20sky%20blue%20purple%20simple%20clean%20children&width=200&height=280&seq=book005&orientation=portrait', href: '/truyen-doc' },
];

export default function FeaturedBooks() {
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getFeaturedBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch featured books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const displayBooks = books.length > 0 ? books.map(book => ({
    title: book.title,
    author: book.author || '',
    type: book.category || 'Sách tham khảo',
    img: book.cover_image || '',
    href: '/sach-tham-khao'
  })) : defaultBooks;

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-sm font-semibold rounded-full mb-3">Tủ sách nổi bật</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Sách & Truyện tiêu biểu</h2>
          </div>
          <Link href="/truyen-doc" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all cursor-pointer whitespace-nowrap">
            Xem tất cả <span className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : displayBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có sách nổi bật nào</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {displayBooks.map((book, index) => (
              <Link key={book.title} href={book.href} className="flex-shrink-0 w-44 group cursor-pointer block">
                <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <img src={book.img} alt={book.title} className="w-full h-60 object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-semibold">Đọc ngay</span>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <span className="text-xs text-blue-600 font-medium">{book.type}</span>
                  <h4 className="font-semibold text-gray-800 text-sm mt-0.5 line-clamp-2 leading-snug">{book.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
