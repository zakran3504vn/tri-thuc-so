'use client';
import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getReferenceBooks, ReferenceBook } from '@/lib/api';

const categories = ['Tất cả', 'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Khoa học', 'Lịch sử', 'Địa lý'];
const grades = ['3', '4', '5', '6', '7', '8', '9'];
const pageRanges = [
  { label: 'Tất cả', min: 0, max: Infinity },
  { label: 'Dưới 150 trang', min: 0, max: 149 },
  { label: '150 – 200 trang', min: 150, max: 200 },
  { label: '200 – 250 trang', min: 201, max: 250 },
  { label: 'Trên 250 trang', min: 251, max: Infinity },
];
const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'pages-asc', label: 'Ít trang nhất' },
  { value: 'pages-desc', label: 'Nhiều trang nhất' },
  { value: 'grade-asc', label: 'Lớp thấp nhất' },
  { value: 'grade-desc', label: 'Lớp cao nhất' },
  { value: 'title-asc', label: 'Tên A → Z' },
];

export default function SachThamKhaoPage() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [pageRange, setPageRange] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getReferenceBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch reference books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const toggleGrade = (g: string) => {
    setSelectedGrades(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const clearAll = () => {
    setSearch('');
    setActiveCat('Tất cả');
    setSelectedGrades([]);
    setPageRange(0);
    setSortBy('default');
  };

  const activeFilterCount = (activeCat !== 'Tất cả' ? 1 : 0) + selectedGrades.length + (pageRange !== 0 ? 1 : 0);

  const filtered = useMemo(() => {
    let result = books.filter(b => {
      const matchSearch = !search.trim() || b.title.toLowerCase().includes(search.toLowerCase()) || (b.author && b.author.toLowerCase().includes(search.toLowerCase())) || (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
      const matchCat = activeCat === 'Tất cả' || b.category === activeCat;
      const matchGrade = selectedGrades.length === 0 || (b.grade && selectedGrades.includes(b.grade));
      const range = pageRanges[pageRange];
      const matchPages = !b.number_of_pages || (b.number_of_pages >= range.min && b.number_of_pages <= range.max);
      return matchSearch && matchCat && matchGrade && matchPages;
    });

    if (sortBy === 'pages-asc') result = [...result].sort((a, b) => (a.number_of_pages || 0) - (b.number_of_pages || 0));
    else if (sortBy === 'pages-desc') result = [...result].sort((a, b) => (b.number_of_pages || 0) - (a.number_of_pages || 0));
    else if (sortBy === 'grade-asc') result = [...result].sort((a, b) => {
      const gradeA = a.grade ? parseInt(a.grade) : 0;
      const gradeB = b.grade ? parseInt(b.grade) : 0;
      return gradeA - gradeB;
    });
    else if (sortBy === 'grade-desc') result = [...result].sort((a, b) => {
      const gradeA = a.grade ? parseInt(a.grade) : 0;
      const gradeB = b.grade ? parseInt(b.grade) : 0;
      return gradeB - gradeA;
    });
    else if (sortBy === 'title-asc') result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));

    return result;
  }, [search, activeCat, selectedGrades, pageRange, sortBy, books]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3">Sách tham khảo</h1>
            <p className="text-indigo-100 text-lg mb-8">Kho sách tham khảo chất lượng cao theo chương trình chuẩn</p>
            <div className="max-w-xl mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                <i className="ri-search-line text-lg"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm sách theo tên, tác giả, môn học..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 md:sticky md:top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Bộ lọc</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium">Xóa tất cả</button>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Môn học</p>
                  <div className="space-y-1">
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setActiveCat(c)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-between"
                        style={activeCat === c ? { background: '#4f46e5', color: 'white', fontWeight: 600 } : { color: '#6b7280' }}
                      >
                        <span>{c}</span>
                        <span className="text-xs opacity-60">{c === 'Tất cả' ? books.length : books.filter(b => b.category === c).length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Lớp</p>
                  <div className="flex flex-wrap gap-2">
                    {grades.map(g => (
                      <button
                        key={g}
                        onClick={() => toggleGrade(g)}
                        className="px-3 py-2 flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer"
                        style={selectedGrades.includes(g) ? { background: '#4f46e5', color: 'white' } : { background: '#f3f4f6', color: '#6b7280' }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Số trang</p>
                  <div className="space-y-1">
                    {pageRanges.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => setPageRange(i)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all cursor-pointer"
                        style={pageRange === i ? { background: '#4f46e5', color: 'white', fontWeight: 600 } : { color: '#6b7280' }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Tìm thấy <span className="font-bold text-gray-900">{filtered.length}</span> cuốn sách
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">{activeFilterCount} bộ lọc</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Sắp xếp:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                    >
                      {sortOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <i className="ri-arrow-down-s-line"></i>
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">Đang tải sách...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
                    <i className="ri-search-line text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="font-bold text-gray-700 text-lg mb-2">Không tìm thấy sách</h3>
                  <p className="text-gray-400 text-sm mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  <button onClick={clearAll} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap">
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.map(book => (
                    <Link key={book.id} href={`/sach-tham-khao/${book.id}`} className="group cursor-pointer block">
                      <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                        {book.cover_image ? (
                          <img 
                            src={book.cover_image.startsWith('http') ? book.cover_image : `https://backend.khotrithucso.vn${book.cover_image}`} 
                            alt={book.title} 
                            className="w-full h-56 object-cover object-top" 
                          />
                        ) : (
                          <div className="w-full h-56 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                            <i className="ri-book-2-line text-5xl text-indigo-300"></i>
                          </div>
                        )}
                        {book.grade && (
                          <div className="absolute top-2 left-2">
                            <span className="text-xs bg-white/90 text-indigo-700 font-bold px-2 py-0.5 rounded-full shadow-sm">Lớp {book.grade}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-xs font-semibold flex items-center gap-1">
                            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-book-open-line"></i></span>
                            Xem sách
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        {book.category && <span className="text-xs text-indigo-600 font-medium">{book.category}</span>}
                        <h4 className="font-semibold text-gray-800 text-sm mt-0.5 line-clamp-2">{book.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{book.author || ''} {book.number_of_pages && `· ${book.number_of_pages} trang`}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
