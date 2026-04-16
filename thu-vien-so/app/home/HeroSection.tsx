'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getBanners, Banner } from '@/lib/api';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); }),
      { threshold: 0.1 }
    );
    heroRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        goToSlide((currentBannerIndex + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length, currentBannerIndex]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentBannerIndex) return;
    setIsTransitioning(true);
    setCurrentBannerIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    const newIndex = currentBannerIndex === 0 ? banners.length - 1 : currentBannerIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentBannerIndex + 1) % banners.length;
    goToSlide(newIndex);
  };

  const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;
  const hasMultipleBanners = banners.length > 1;

  return (
    <section ref={heroRef} className="relative min-h-[600px] lg:min-h-screen flex items-center overflow-hidden">
      {/* Slideshow Images - No overlay */}
      <div className="absolute inset-0 z-0">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image_url?.startsWith('http') ? banner.image_url : `https://backend.khotrithucso.vn${banner.image_url}`}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <img
            src="https://readdy.ai/api/search-image?query=beautiful%20modern%20digital%20library%20education%20platform%20with%20glowing%20blue%20and%20green%20gradient%20background%2C%20floating%20books%2C%20soft%20light%20rays%2C%20knowledge%20concept%2C%20clean%20minimalist%20aesthetic%2C%20Vietnamese%20school%20children%20reading%2C%20warm%20inviting%20atmosphere%2C%20bokeh%20background%2C%20high%20quality%20photography&width=1440&height=900&seq=hero001&orientation=landscape"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {hasMultipleBanners && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <i className="ri-arrow-left-s-line text-2xl text-gray-800"></i>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <i className="ri-arrow-right-s-line text-2xl text-gray-800"></i>
          </button>
        </>
      )}

      {/* Content - Positioned at bottom with dark text for visibility */}
      <div className="relative z-10 w-full mt-auto">
        <div className="bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">Nền tảng học tập số hàng đầu</span>
              </div>

              <h1 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                {currentBanner?.title || 'Thư Viện Số'}
                <span className="block text-green-300 mt-1 drop-shadow-lg">
                  {currentBanner?.description || 'Tri Thức Không Giới Hạn'}
                </span>
              </h1>

              <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-300 flex flex-wrap gap-4">
                <Link href={currentBanner?.link_url || '/mon-hoc'} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg">
                  <span className="w-5 h-5 flex items-center justify-center"><i className="ri-book-open-line"></i></span>
                  Khám phá ngay
                </Link>
                {/* <Link href="/truyen-doc" className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg">
                  <span className="w-5 h-5 flex items-center justify-center"><i className="ri-play-circle-line"></i></span>
                  Đọc truyện
                </Link> */}
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation Dots */}
        {hasMultipleBanners && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBannerIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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
