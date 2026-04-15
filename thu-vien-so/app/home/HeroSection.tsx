'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); }),
      { threshold: 0.1 }
    );
    heroRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <img src="https://readdy.ai/api/search-image?query=beautiful%20modern%20digital%20library%20education%20platform%20with%20glowing%20blue%20and%20green%20gradient%20background%2C%20floating%20books%2C%20soft%20light%20rays%2C%20knowledge%20concept%2C%20clean%20minimalist%20aesthetic%2C%20Vietnamese%20school%20children%20reading%2C%20warm%20inviting%20atmosphere%2C%20bokeh%20background%2C%20high%20quality%20photography&width=1440&height=900&seq=hero001&orientation=landscape" alt="Hero background" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-medium">Nền tảng học tập số hàng đầu</span>
          </div>

          <h1 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Thư Viện Số
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mt-1">Tri Thức Không Giới Hạn</span>
          </h1>

          <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
            Mang tri thức số ươm mầm tương lai. Kho tài nguyên học tập phong phú với hàng nghìn bài giảng, sách điện tử và hoạt động trải nghiệm sáng tạo.
          </p>

          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-300 flex flex-wrap gap-4">
            <Link href="/mon-hoc" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer">
              <span className="w-5 h-5 flex items-center justify-center"><i className="ri-book-open-line"></i></span>
              Khám phá ngay
            </Link>
            <Link href="/truyen-doc" className="flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/40 text-white font-semibold rounded-full hover:bg-white/25 transition-all duration-300 whitespace-nowrap cursor-pointer">
              <span className="w-5 h-5 flex items-center justify-center"><i className="ri-play-circle-line"></i></span>
              Đọc truyện
            </Link>
          </div>

          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-400 flex items-center gap-6 mt-10">
            {[['1,200+','Bài giảng'],['500+','Đầu sách'],['50,000+','Học sinh']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{num}</div>
                <div className="text-blue-200 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
      `}</style>
    </section>
  );
}
