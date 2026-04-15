'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const newsData: Record<string, {
  id: number; category: string; date: string; title: string; author: string; readTime: string;
  img: string; content: string[]; tags: string[]; related: { id: number; title: string; date: string; img: string }[];
}> = {
  '1': {
    id: 1, category: 'Thông báo', date: '10/04/2026', title: 'Khai giảng năm học mới 2026-2027: Nhiều điểm mới đáng chú ý',
    author: 'Ban Giám Hiệu', readTime: '5 phút đọc',
    img: 'https://readdy.ai/api/search-image?query=school%20opening%20ceremony%20Vietnamese%20students%20happy%20colorful%20classroom%20modern%20education%20warm%20light%20wide%20banner&width=1200&height=500&seq=nd001&orientation=landscape',
    content: [
      'Năm học mới 2026-2027 chính thức khai giảng vào ngày 05/09/2026 với nhiều điểm mới đáng chú ý trong chương trình giảng dạy và phương pháp học tập số hóa hiện đại.',
      'Theo thông báo từ Bộ Giáo dục và Đào tạo, năm học này sẽ triển khai toàn diện chương trình giáo dục phổ thông 2018 ở tất cả các cấp học. Đây là bước tiến quan trọng trong việc đổi mới căn bản và toàn diện giáo dục Việt Nam.',
      'Điểm nổi bật nhất của năm học mới là việc tích hợp công nghệ số vào quá trình dạy và học. Thư viện số sẽ cung cấp hơn 500 bài giảng video chất lượng cao, 200+ đề kiểm tra trực tuyến và kho tài liệu tham khảo phong phú cho học sinh toàn trường.',
      'Về lịch học, năm học 2026-2027 bắt đầu từ ngày 05/09/2026 và kết thúc vào ngày 31/05/2027. Học kỳ I kéo dài từ tháng 9 đến tháng 1, học kỳ II từ tháng 2 đến tháng 5.',
      'Nhà trường cũng thông báo về việc trang bị thêm thiết bị học tập hiện đại cho các phòng học, bao gồm màn hình tương tác thông minh, hệ thống âm thanh chất lượng cao và kết nối internet tốc độ cao phục vụ học tập trực tuyến.',
      'Phụ huynh và học sinh có thể theo dõi lịch học, bài tập và thông báo của nhà trường thông qua ứng dụng Thư Viện Số. Mọi thắc mắc xin liên hệ văn phòng nhà trường trong giờ hành chính.',
    ],
    tags: ['Khai giảng', 'Năm học mới', 'Thông báo', 'Giáo dục số'],
    related: [
      { id: 2, title: 'Cuộc thi Đọc sách hay - Chia sẻ tri thức lần thứ 5', date: '08/04/2026', img: 'https://readdy.ai/api/search-image?query=reading%20competition%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school%20event&width=400&height=260&seq=nd002r&orientation=landscape' },
      { id: 3, title: 'Ra mắt bộ sách tham khảo Toán - Văn - Anh lớp 6 mới nhất', date: '05/04/2026', img: 'https://readdy.ai/api/search-image?query=new%20textbooks%20stack%20colorful%20covers%20education%20clean%20background%20modern%20Vietnamese%20school%20books&width=400&height=260&seq=nd003r&orientation=landscape' },
      { id: 4, title: 'Lịch nghỉ lễ 30/4 và 1/5 năm 2026', date: '01/04/2026', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20holiday%20celebration%20flag%20flowers%20festive%20warm%20colors%20clean%20background&width=400&height=260&seq=nd004r&orientation=landscape' },
    ]
  },
  '2': {
    id: 2, category: 'Hoạt động', date: '08/04/2026', title: 'Cuộc thi Đọc sách hay - Chia sẻ tri thức lần thứ 5',
    author: 'Thư Viện Số', readTime: '4 phút đọc',
    img: 'https://readdy.ai/api/search-image?query=reading%20competition%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school%20event%20wide%20banner&width=1200&height=500&seq=nd002&orientation=landscape',
    content: [
      'Thư viện số trân trọng thông báo tổ chức Cuộc thi "Đọc sách hay - Chia sẻ tri thức" lần thứ 5 năm 2026, dành cho tất cả học sinh từ lớp 1 đến lớp 9 trên toàn quốc.',
      'Cuộc thi nhằm khuyến khích văn hóa đọc sách trong học sinh, giúp các em phát triển tư duy phản biện, khả năng diễn đạt và tình yêu với tri thức. Đây là sân chơi bổ ích và ý nghĩa cho thế hệ trẻ.',
      'Thể lệ tham gia: Học sinh đọc ít nhất 3 cuốn sách trong danh sách đề xuất của ban tổ chức, sau đó viết bài cảm nhận hoặc làm video review ngắn (3-5 phút) chia sẻ về cuốn sách yêu thích nhất.',
      'Giải thưởng hấp dẫn: Giải Nhất trị giá 5.000.000 đồng + bộ sách quý, Giải Nhì 3.000.000 đồng, Giải Ba 2.000.000 đồng và 10 giải Khuyến khích mỗi giải 500.000 đồng.',
      'Thời gian nhận bài: từ ngày 15/04/2026 đến 15/05/2026. Kết quả sẽ được công bố vào ngày 01/06/2026 trên website Thư Viện Số.',
      'Để đăng ký tham gia, học sinh truy cập vào mục "Hoạt động" trên website Thư Viện Số và điền đầy đủ thông tin theo mẫu. Mọi thắc mắc xin liên hệ email: thuvienso@edu.vn.',
    ],
    tags: ['Cuộc thi', 'Đọc sách', 'Học sinh', 'Hoạt động'],
    related: [
      { id: 1, title: 'Khai giảng năm học mới 2026-2027: Nhiều điểm mới đáng chú ý', date: '10/04/2026', img: 'https://readdy.ai/api/search-image?query=school%20opening%20ceremony%20Vietnamese%20students%20happy%20colorful%20classroom%20modern%20education%20warm%20light&width=400&height=260&seq=nd001r&orientation=landscape' },
      { id: 5, title: 'Hội thảo "Ứng dụng công nghệ trong dạy học" tháng 4/2026', date: '28/03/2026', img: 'https://readdy.ai/api/search-image?query=education%20technology%20workshop%20teachers%20conference%20modern%20classroom%20digital%20learning%20clean&width=400&height=260&seq=nd005r&orientation=landscape' },
      { id: 6, title: 'Cập nhật 200+ video bài giảng mới cho học kỳ II', date: '20/03/2026', img: 'https://readdy.ai/api/search-image?query=video%20lecture%20education%20online%20learning%20modern%20technology%20blue%20clean%20background&width=400&height=260&seq=nd006r&orientation=landscape' },
    ]
  },
};

const defaultNews = {
  id: 3, category: 'Tài nguyên', date: '05/04/2026', title: 'Ra mắt bộ sách tham khảo Toán - Văn - Anh lớp 6 mới nhất',
  author: 'Nhóm Biên Soạn', readTime: '3 phút đọc',
  img: 'https://readdy.ai/api/search-image?query=new%20textbooks%20stack%20colorful%20covers%20education%20clean%20background%20modern%20Vietnamese%20school%20books%20wide%20banner&width=1200&height=500&seq=nd003&orientation=landscape',
  content: [
    'Thư Viện Số vừa chính thức ra mắt bộ sách tham khảo mới dành cho học sinh lớp 6, bao gồm 3 môn học chính: Toán học, Ngữ văn và Tiếng Anh.',
    'Bộ sách được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm, bám sát chương trình giáo dục phổ thông 2018 và đặc biệt phù hợp với học sinh lớp 6 đang bước vào cấp THCS.',
    'Mỗi cuốn sách được thiết kế khoa học với phần lý thuyết ngắn gọn, súc tích, kèm theo nhiều bài tập từ cơ bản đến nâng cao, giúp học sinh nắm vững kiến thức và phát triển tư duy.',
    'Điểm đặc biệt của bộ sách là có kèm theo mã QR để truy cập video bài giảng minh họa trực tuyến, giúp học sinh có thể tự học hiệu quả tại nhà.',
    'Bộ sách hiện đã có mặt trên Thư Viện Số dưới dạng ebook miễn phí. Học sinh và phụ huynh có thể tải về hoặc đọc trực tuyến tại mục Sách tham khảo.',
  ],
  tags: ['Sách tham khảo', 'Lớp 6', 'Toán học', 'Ngữ văn', 'Tiếng Anh'],
  related: [
    { id: 1, title: 'Khai giảng năm học mới 2026-2027: Nhiều điểm mới đáng chú ý', date: '10/04/2026', img: 'https://readdy.ai/api/search-image?query=school%20opening%20ceremony%20Vietnamese%20students%20happy%20colorful%20classroom%20modern%20education%20warm%20light&width=400&height=260&seq=nd001r2&orientation=landscape' },
    { id: 2, title: 'Cuộc thi Đọc sách hay - Chia sẻ tri thức lần thứ 5', date: '08/04/2026', img: 'https://readdy.ai/api/search-image?query=reading%20competition%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school%20event&width=400&height=260&seq=nd002r2&orientation=landscape' },
    { id: 6, title: 'Cập nhật 200+ video bài giảng mới cho học kỳ II', date: '20/03/2026', img: 'https://readdy.ai/api/search-image?query=video%20lecture%20education%20online%20learning%20modern%20technology%20blue%20clean%20background&width=400&height=260&seq=nd006r2&orientation=landscape' },
  ]
};

const catColor: Record<string, string> = {
  'Thông báo': 'bg-blue-100 text-blue-700',
  'Hoạt động': 'bg-green-100 text-green-700',
  'Tài nguyên': 'bg-purple-100 text-purple-700'
};

interface Props { newsId: string; }

export default function NotificationDetail({ newsId }: Props) {
  const item = newsData[newsId] || defaultNews;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="relative h-80 overflow-hidden">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${catColor[item.category] || 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                <span className="text-white/70 text-sm">{item.date}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white leading-tight">{item.title}</h1>
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
                <p className="font-semibold text-gray-800 text-sm">{item.author}</p>
                <p className="text-xs text-gray-400">{item.date} · {item.readTime}</p>
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
              {item.content.map((para, i) => (
                <p key={i} className="text-gray-700 text-base leading-relaxed mb-5">{para}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">#{tag}</span>
                ))}
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
                  {item.related.map(r => (
                    <Link key={r.id} href={`/thong-bao/${r.id}`} className="flex gap-3 group cursor-pointer">
                      <img src={r.img} alt={r.title} className="w-16 h-12 object-cover object-top rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                      </div>
                    </Link>
                  ))}
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
            {item.related.map(r => (
              <Link key={r.id} href={`/thong-bao/${r.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block border border-gray-100">
                <div className="h-40 overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{r.date}</p>
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
