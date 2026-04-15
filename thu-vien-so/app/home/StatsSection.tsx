'use client';
import { useEffect, useRef } from 'react';

const stats = [
  { icon: 'ri-book-2-line', value: '1,200+', label: 'Bài giảng video', color: 'from-blue-500 to-blue-600' },
  { icon: 'ri-user-star-line', value: '50,000+', label: 'Học sinh đang học', color: 'from-green-500 to-green-600' },
  { icon: 'ri-file-text-line', value: '500+', label: 'Đầu sách & truyện', color: 'from-teal-500 to-teal-600' },
  { icon: 'ri-award-line', value: '120+', label: 'Giáo viên tham gia', color: 'from-indigo-500 to-indigo-600' },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.stat-card').forEach((el, i) => { setTimeout(() => el.classList.add('show'), i * 100); }); }),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="stat-card opacity-0 translate-y-6 transition-all duration-500 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 text-center group hover:-translate-y-1">
              <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${s.color} rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${s.icon} text-2xl text-white`}></i>
              </div>
              <div className="text-3xl font-extrabold text-gray-800 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`.stat-card.show { opacity: 1; transform: translateY(0); }`}</style>
    </section>
  );
}
