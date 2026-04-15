'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const allData = [
  { id: 'toan', type: 'monhoc', title: 'Toán học', desc: 'Kho bài giảng Toán học từ lớp 1 đến lớp 9, 48 bài học, 36 video', href: '/mon-hoc/toan', img: 'https://readdy.ai/api/search-image?query=mathematics%20education%20colorful%20numbers%20formulas%20blue%20background%20geometric%20shapes%20modern%20minimal%20clean&width=300&height=200&seq=sr001&orientation=landscape', tags: ['Lớp 1-9', '48 bài học'] },
  { id: 'van', type: 'monhoc', title: 'Ngữ văn', desc: 'Bài giảng Ngữ văn phong phú, 36 bài học, 28 video bài giảng chất lượng cao', href: '/mon-hoc/van', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20open%20book%20flowers%20soft%20green%20background%20elegant%20writing%20warm%20light%20minimal&width=300&height=200&seq=sr002&orientation=landscape', tags: ['Lớp 1-9', '36 bài học'] },
  { id: 'anh', type: 'monhoc', title: 'Tiếng Anh', desc: 'Học Tiếng Anh giao tiếp và ngữ pháp, 52 bài học, 44 video', href: '/mon-hoc/anh', img: 'https://readdy.ai/api/search-image?query=English%20language%20learning%20alphabet%20globe%20world%20map%20teal%20background%20modern%20education%20concept%20clean&width=300&height=200&seq=sr003&orientation=landscape', tags: ['Lớp 3-9', '52 bài học'] },
  { id: 'khoa-hoc', type: 'monhoc', title: 'Khoa học', desc: 'Khoa học tự nhiên thú vị với thí nghiệm và video minh họa sinh động', href: '/mon-hoc/khoa-hoc', img: 'https://readdy.ai/api/search-image?query=science%20experiment%20chemistry%20biology%20physics%20laboratory%20indigo%20blue%20modern%20education%20clean%20minimal&width=300&height=200&seq=sr004&orientation=landscape', tags: ['Lớp 4-9', '30 bài học'] },
  { id: 'lich-su', type: 'monhoc', title: 'Lịch sử', desc: 'Lịch sử Việt Nam và thế giới qua các bài giảng sinh động, dễ hiểu', href: '/mon-hoc/lich-su', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20history%20ancient%20temple%20cultural%20heritage%20amber%20golden%20background%20education%20clean%20minimal&width=300&height=200&seq=sr005&orientation=landscape', tags: ['Lớp 4-9', '24 bài học'] },
  { id: 'tin-hoc', type: 'monhoc', title: 'Tin học', desc: 'Lập trình và công nghệ thông tin cho học sinh, 28 bài học thực hành', href: '/mon-hoc/tin-hoc', img: 'https://readdy.ai/api/search-image?query=computer%20science%20coding%20programming%20technology%20violet%20purple%20background%20modern%20education%20clean%20minimal&width=300&height=200&seq=sr006&orientation=landscape', tags: ['Lớp 3-9', '28 bài học'] },
  { id: 'tr1', type: 'truyen', title: 'Dế Mèn Phiêu Lưu Ký', desc: 'Tô Hoài · Phiêu lưu · 120 trang — Câu chuyện phiêu lưu của chú dế mèn dũng cảm', href: '/truyen-doc/1', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20children%20story%20book%20cover%20cricket%20adventure%20colorful%20illustration%20warm%20background%20simple%20clean&width=300&height=200&seq=sr007&orientation=landscape', tags: ['Phiêu lưu', '120 trang'] },
  { id: 'tr2', type: 'truyen', title: 'Cô Bé Bán Diêm', desc: 'H.C. Andersen · Cổ tích · 48 trang — Câu chuyện cảm động về cô bé bán diêm', href: '/truyen-doc/2', img: 'https://readdy.ai/api/search-image?query=fairy%20tale%20book%20cover%20little%20match%20girl%20illustration%20warm%20golden%20light%20snow%20winter%20simple%20clean&width=300&height=200&seq=sr008&orientation=landscape', tags: ['Cổ tích', '48 trang'] },
  { id: 'tr3', type: 'truyen', title: 'Hoàng Tử Bé', desc: 'Antoine de Saint-Exupéry · Thiếu nhi · 96 trang — Hành trình của hoàng tử bé trên các hành tinh', href: '/truyen-doc/3', img: 'https://readdy.ai/api/search-image?query=The%20Little%20Prince%20book%20cover%20illustration%20planet%20stars%20night%20sky%20blue%20purple%20simple%20clean%20children&width=300&height=200&seq=sr009&orientation=landscape', tags: ['Thiếu nhi', '96 trang'] },
  { id: 'tr4', type: 'truyen', title: 'Cuộc Phiêu Lưu Của Tom Sawyer', desc: 'Mark Twain · Phiêu lưu · 200 trang — Những cuộc phiêu lưu kỳ thú của cậu bé Tom', href: '/truyen-doc/4', img: 'https://readdy.ai/api/search-image?query=Tom%20Sawyer%20adventure%20book%20cover%20river%20boy%20illustration%20warm%20colors%20simple%20clean%20children&width=300&height=200&seq=sr010&orientation=landscape', tags: ['Phiêu lưu', '200 trang'] },
  { id: 'tr5', type: 'truyen', title: 'Truyện Cổ Tích Việt Nam', desc: 'Nhiều tác giả · Cổ tích · 150 trang — Tuyển tập truyện cổ tích Việt Nam hay nhất', href: '/truyen-doc/5', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20folk%20tales%20book%20cover%20traditional%20illustration%20colorful%20warm%20background%20simple%20clean&width=300&height=200&seq=sr011&orientation=landscape', tags: ['Cổ tích', '150 trang'] },
  { id: 'tr6', type: 'truyen', title: 'Khoa Học Vui', desc: 'NXB Kim Đồng · Khoa học · 80 trang — Khám phá khoa học qua những câu chuyện thú vị', href: '/truyen-doc/6', img: 'https://readdy.ai/api/search-image?query=science%20fun%20book%20cover%20children%20experiments%20colorful%20illustration%20clean%20background%20simple&width=300&height=200&seq=sr012&orientation=landscape', tags: ['Khoa học', '80 trang'] },
  { id: 'sk1', type: 'sach', title: 'Toán Nâng Cao Lớp 5', desc: 'NXB Giáo Dục · Toán học · 180 trang — Bài tập toán nâng cao bám sát chương trình', href: '/sach-tham-khao/1', img: 'https://readdy.ai/api/search-image?query=mathematics%20textbook%20cover%20grade%205%20blue%20clean%20modern%20design%20numbers%20geometric%20shapes%20simple&width=300&height=200&seq=sr013&orientation=landscape', tags: ['Toán học', 'Lớp 5'] },
  { id: 'sk2', type: 'sach', title: 'Tiếng Anh Giao Tiếp Cơ Bản', desc: 'NXB Trẻ · Tiếng Anh · 220 trang — Học tiếng Anh giao tiếp từ cơ bản đến nâng cao', href: '/sach-tham-khao/2', img: 'https://readdy.ai/api/search-image?query=English%20communication%20book%20cover%20teal%20green%20modern%20design%20speech%20bubbles%20clean%20minimal&width=300&height=200&seq=sr014&orientation=landscape', tags: ['Tiếng Anh', '220 trang'] },
  { id: 'sk3', type: 'sach', title: 'Ngữ Văn Nâng Cao Lớp 6', desc: 'NXB Giáo Dục · Ngữ văn · 160 trang — Tài liệu tham khảo Ngữ văn lớp 6 đầy đủ', href: '/sach-tham-khao/3', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20textbook%20cover%20green%20elegant%20design%20writing%20pen%20clean%20minimal&width=300&height=200&seq=sr015&orientation=landscape', tags: ['Ngữ văn', 'Lớp 6'] },
  { id: 'sk4', type: 'sach', title: 'Khoa Học Tự Nhiên Lớp 7', desc: 'NXB Giáo Dục · Khoa học · 200 trang — Sách tham khảo Khoa học tự nhiên lớp 7', href: '/sach-tham-khao/4', img: 'https://readdy.ai/api/search-image?query=natural%20science%20textbook%20cover%20indigo%20blue%20modern%20design%20atoms%20molecules%20clean%20minimal&width=300&height=200&seq=sr016&orientation=landscape', tags: ['Khoa học', 'Lớp 7'] },
  { id: 'sk5', type: 'sach', title: 'Lịch Sử Việt Nam Cận Đại', desc: 'NXB Giáo Dục · Lịch sử · 240 trang — Lịch sử Việt Nam từ thế kỷ XIX đến nay', href: '/sach-tham-khao/5', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20history%20textbook%20cover%20amber%20golden%20design%20traditional%20clean%20minimal%20education&width=300&height=200&seq=sr017&orientation=landscape', tags: ['Lịch sử', '240 trang'] },
  { id: 'sk6', type: 'sach', title: 'Toán Tư Duy Lớp 4', desc: 'NXB Kim Đồng · Toán học · 140 trang — Phát triển tư duy toán học cho học sinh lớp 4', href: '/sach-tham-khao/6', img: 'https://readdy.ai/api/search-image?query=math%20thinking%20book%20cover%20grade%204%20colorful%20blue%20puzzle%20shapes%20clean%20children%20education&width=300&height=200&seq=sr018&orientation=landscape', tags: ['Toán học', 'Lớp 4'] },
];

const typeLabels: Record<string, string> = { monhoc: 'Môn học', truyen: 'Truyện đọc', sach: 'Sách tham khảo' };
const typeColors: Record<string, string> = { monhoc: 'bg-blue-100 text-blue-700', truyen: 'bg-green-100 text-green-700', sach: 'bg-indigo-100 text-indigo-700' };
const typeIcons: Record<string, string> = { monhoc: 'ri-book-2-line', truyen: 'ri-book-open-line', sach: 'ri-file-text-line' };

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [inputVal, setInputVal] = useState(initialQ);
  const [activeType, setActiveType] = useState('all');

  const filtered = allData.filter(item => {
    const matchType = activeType === 'all' || item.type === activeType;
    const q = query.toLowerCase().trim();
    const matchQ = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q));
    return matchType && matchQ;
  });

  const counts = {
    all: allData.filter(item => { const q = query.toLowerCase().trim(); return !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q)); }).length,
    monhoc: allData.filter(item => item.type === 'monhoc' && (!query || item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))).length,
    truyen: allData.filter(item => item.type === 'truyen' && (!query || item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))).length,
    sach: allData.filter(item => item.type === 'sach' && (!query || item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))).length,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputVal);
    router.push(`/tim-kiem?q=${encodeURIComponent(inputVal)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-700 to-green-600 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-white mb-2">Tìm kiếm</h1>
            <p className="text-blue-100 text-sm mb-6">Tìm kiếm sách, truyện và môn học trong Thư Viện Số</p>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 pl-1">
                  <i className="ri-search-line text-gray-400 text-xl"></i>
                </div>
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Nhập tên sách, truyện, môn học..."
                  className="flex-1 py-4 px-2 text-gray-800 text-base outline-none bg-transparent"
                />
                <button type="submit" className="m-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-xl hover:shadow-md transition-all cursor-pointer whitespace-nowrap text-sm">
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {[
              { key: 'all', label: 'Tất cả', count: counts.all },
              { key: 'monhoc', label: 'Môn học', count: counts.monhoc },
              { key: 'truyen', label: 'Truyện đọc', count: counts.truyen },
              { key: 'sach', label: 'Sách tham khảo', count: counts.sach },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveType(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeType === tab.key ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeType === tab.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}>{tab.count}</span>
              </button>
            ))}
            {query && (
              <p className="ml-auto text-sm text-gray-500">
                Kết quả cho <span className="font-semibold text-gray-800">"{query}"</span>: {filtered.length} mục
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
                <i className="ri-search-line text-4xl text-gray-300"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác hoặc duyệt theo danh mục</p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/mon-hoc" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">Môn học</Link>
                <Link href="/truyen-doc" className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors cursor-pointer">Truyện đọc</Link>
                <Link href="/sach-tham-khao" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer">Sách tham khảo</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(item => (
                <Link key={item.id} href={item.href} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block border border-gray-100">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${typeColors[item.type]}`}>
                        <span className="w-3 h-3 flex items-center justify-center"><i className={`${typeIcons[item.type]} text-xs`}></i></span>
                        {typeLabels[item.type]}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{tag}</span>
                      ))}
                    </div>
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

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Đang tải...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
