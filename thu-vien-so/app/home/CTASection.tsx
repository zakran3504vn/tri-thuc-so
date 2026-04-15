'use client';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Bắt đầu hành trình học tập ngay hôm nay!</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Tham gia cùng hơn 50,000 học sinh đang học tập trên nền tảng Thư Viện Số</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/mon-hoc" className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Khám phá môn học
              </Link>
              <Link href="/lien-he" className="px-8 py-3 bg-white/20 border border-white/40 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
