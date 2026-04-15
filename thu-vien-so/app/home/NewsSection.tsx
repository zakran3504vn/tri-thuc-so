'use client';
import Link from 'next/link';

const news = [
  {
    id: 1, category: 'Thông báo', date: '10/04/2026',
    title: 'Khai giảng năm học mới 2026-2027: Nhiều điểm mới đáng chú ý',
    excerpt: 'Năm học mới 2026-2027 sẽ có nhiều thay đổi tích cực trong chương trình giảng dạy và phương pháp học tập số hóa...',
    img: 'https://readdy.ai/api/search-image?query=school%20opening%20ceremony%20Vietnamese%20students%20happy%20colorful%20classroom%20modern%20education%20warm%20light&width=600&height=400&seq=news001&orientation=landscape',
    hot: true,
  },
  {
    id: 2, category: 'Hoạt động', date: '08/04/2026',
    title: 'Cuộc thi Đọc sách hay - Chia sẻ tri thức lần thứ 5',
    excerpt: 'Thư viện số tổ chức cuộc thi đọc sách với nhiều phần thưởng hấp dẫn dành cho học sinh toàn quốc...',
    img: 'https://readdy.ai/api/search-image?query=reading%20competition%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school%20event&width=600&height=400&seq=news002&orientation=landscape',
    hot: false,
  },
  {
    id: 3, category: 'Tài nguyên', date: '05/04/2026',
    title: 'Ra mắt bộ sách tham khảo Toán - Văn - Anh lớp 6 mới nhất',
    excerpt: 'Bộ sách tham khảo mới được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm, bám sát chương trình 2025...',
    img: 'https://readdy.ai/api/search-image?query=new%20textbooks%20stack%20colorful%20covers%20education%20clean%20background%20modern%20Vietnamese%20school%20books&width=600&height=400&seq=news003&orientation=landscape',
    hot: false,
  },
];

export default function NewsSection() {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Link href={`/thong-bao/${news[0].id}`} className="group block cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={news[0].img} alt={news[0].title} className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                {news[0].hot && <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">HOT</span>}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">{news[0].category}</span>
                  <h3 className="text-white font-bold text-xl mt-1 leading-snug group-hover:text-green-200 transition-colors">{news[0].title}</h3>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">{news[0].excerpt}</p>
                  <span className="text-gray-400 text-xs mt-3 block">{news[0].date}</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {news.slice(1).map((item) => (
              <Link key={item.id} href={`/thong-bao/${item.id}`} className="group flex gap-4 bg-gray-50 hover:bg-blue-50 rounded-2xl p-4 transition-colors duration-200 cursor-pointer">
                <img src={item.img} alt={item.title} className="w-24 h-20 object-cover object-top rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-blue-600 text-xs font-semibold">{item.category}</span>
                  <h4 className="font-semibold text-gray-800 text-sm mt-1 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{item.title}</h4>
                  <span className="text-gray-400 text-xs mt-2 block">{item.date}</span>
                </div>
              </Link>
            ))}
            <Link href="/thong-bao" className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-200 text-blue-500 text-sm font-medium rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer whitespace-nowrap">
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></span>
              Xem thêm tin tức
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
