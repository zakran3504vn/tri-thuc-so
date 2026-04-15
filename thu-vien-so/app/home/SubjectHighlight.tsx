'use client';
import Link from 'next/link';

const subjects = [
  { id: 'toan', name: 'Toán học', icon: 'ri-calculator-line', color: 'from-blue-500 to-blue-700', lessons: 48, img: 'https://readdy.ai/api/search-image?query=mathematics%20education%20colorful%20numbers%20formulas%20on%20clean%20white%20background%20with%20blue%20accents%20geometric%20shapes%20modern%20minimal&width=400&height=280&seq=sub001&orientation=landscape' },
  { id: 'van', name: 'Ngữ văn', icon: 'ri-quill-pen-line', color: 'from-green-500 to-green-700', lessons: 36, img: 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20open%20book%20with%20flowers%20soft%20green%20background%20elegant%20writing%20pen%20warm%20light%20minimal%20clean&width=400&height=280&seq=sub002&orientation=landscape' },
  { id: 'anh', name: 'Tiếng Anh', icon: 'ri-global-line', color: 'from-teal-500 to-teal-700', lessons: 52, img: 'https://readdy.ai/api/search-image?query=English%20language%20learning%20alphabet%20letters%20globe%20world%20map%20clean%20teal%20background%20modern%20education%20concept&width=400&height=280&seq=sub003&orientation=landscape' },
  { id: 'khoa-hoc', name: 'Khoa học', icon: 'ri-flask-line', color: 'from-indigo-500 to-indigo-700', lessons: 30, img: 'https://readdy.ai/api/search-image?query=science%20experiment%20colorful%20chemistry%20biology%20physics%20clean%20laboratory%20background%20indigo%20blue%20modern%20education&width=400&height=280&seq=sub004&orientation=landscape' },
  { id: 'lich-su', name: 'Lịch sử', icon: 'ri-ancient-gate-line', color: 'from-amber-500 to-amber-700', lessons: 24, img: 'https://readdy.ai/api/search-image?query=Vietnamese%20history%20ancient%20temple%20cultural%20heritage%20warm%20amber%20golden%20background%20education%20concept%20clean%20minimal&width=400&height=280&seq=sub005&orientation=landscape' },
  { id: 'dia-ly', name: 'Địa lý', icon: 'ri-map-2-line', color: 'from-cyan-500 to-cyan-700', lessons: 22, img: 'https://readdy.ai/api/search-image?query=geography%20world%20map%20Vietnam%20landscape%20mountains%20rivers%20clean%20cyan%20blue%20background%20education%20modern%20minimal&width=400&height=280&seq=sub006&orientation=landscape' },
];

export default function SubjectHighlight() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-3">Môn học nổi bật</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">Khám phá các môn học</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Hệ thống bài giảng đa dạng, phong phú theo chương trình chuẩn quốc gia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <Link key={s.id} href={`/mon-hoc/${s.id}`} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block">
              <div className="relative h-44 overflow-hidden">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-60`}></div>
                <div className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl">
                  <i className={`${s.icon} text-xl text-white`}></i>
                </div>
              </div>
              <div className="p-5 bg-white border border-gray-100 border-t-0 rounded-b-2xl">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{s.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="w-4 h-4 flex items-center justify-center"><i className="ri-play-circle-line text-blue-500"></i></span>
                    {s.lessons} bài học
                  </span>
                  <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem ngay <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/mon-hoc" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer">
            Xem tất cả môn học
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
