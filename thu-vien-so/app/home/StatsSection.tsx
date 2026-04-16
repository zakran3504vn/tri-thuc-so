'use client';
import { useEffect, useRef, useState } from 'react';
import { getStats, Stat } from '@/lib/api';

const defaultStats = [
  { icon: 'ri-book-2-line', value: '1,200+', label: 'Bài giảng video', color: 'from-blue-500 to-blue-600' },
  { icon: 'ri-user-star-line', value: '50,000+', label: 'Học sinh đang học', color: 'from-green-500 to-green-600' },
  { icon: 'ri-file-text-line', value: '500+', label: 'Đầu sách & truyện', color: 'from-teal-500 to-teal-600' },
  { icon: 'ri-award-line', value: '120+', label: 'Giáo viên tham gia', color: 'from-indigo-500 to-indigo-600' },
];

// Icon-based color mapping for beautiful stats
const iconColorMap: Record<string, string> = {
  'ri-book-2-line': 'from-blue-500 to-cyan-400',
  'ri-book-open-line': 'from-blue-600 to-blue-400',
  'ri-user-star-line': 'from-green-500 to-emerald-400',
  'ri-user-line': 'from-green-600 to-teal-400',
  'ri-file-text-line': 'from-teal-500 to-cyan-400',
  'ri-award-line': 'from-indigo-500 to-purple-400',
  'ri-star-line': 'from-yellow-400 to-orange-400',
  'ri-heart-line': 'from-pink-500 to-rose-400',
  'ri-lightbulb-line': 'from-amber-400 to-yellow-300',
  'ri-calendar-line': 'from-orange-500 to-red-400',
  'ri-time-line': 'from-cyan-500 to-blue-400',
  'ri-eye-line': 'from-violet-500 to-purple-400',
  'ri-graduation-cap-line': 'from-blue-600 to-indigo-400',
  'ri-video-line': 'from-red-500 to-pink-400',
  'ri-building-line': 'from-slate-500 to-gray-400',
  'ri-global-line': 'from-sky-500 to-blue-400',
};

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.stat-card').forEach((el, i) => { setTimeout(() => el.classList.add('show'), i * 100); }); }),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const getIconColor = (icon: string) => {
    return iconColorMap[icon] || 'from-blue-500 to-cyan-400';
  };

  return (
    <section ref={ref} className="py-16 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((s, index) => {
            const icon = s.icon || defaultStats[index % defaultStats.length].icon;
            const colorClass = getIconColor(icon);
            return (
              <div key={s.label} className="stat-card opacity-0 translate-y-6 transition-all duration-500 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100/50 text-center group hover:-translate-y-2">
                <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${colorClass} rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20`}>
                  <i className={`${icon} text-2xl text-white`}></i>
                </div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">{s.value}</div>
                <div className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`.stat-card.show { opacity: 1; transform: translateY(0); }`}</style>
    </section>
  );
}
