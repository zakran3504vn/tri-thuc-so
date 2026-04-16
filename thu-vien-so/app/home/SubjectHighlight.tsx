'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSubjects, Subject } from '@/lib/api';

const subjectIcons: Record<string, string> = {
  'toan': 'ri-calculator-line',
  'van': 'ri-quill-pen-line',
  'anh': 'ri-global-line',
  'khoa-hoc': 'ri-flask-line',
  'lich-su': 'ri-ancient-gate-line',
  'dia-ly': 'ri-map-2-line',
  'vat-ly': 'ri-flashlight-line',
  'hoa-hoc': 'ri-flask-line',
  'sinh-hoc': 'ri-seedling-line',
  'gdcd': 'ri-user-heart-line',
  'tin-hoc': 'ri-computer-line',
  'the-duc': 'ri-run-line',
  'am-nhac': 'ri-music-2-line',
  'my-thuat': 'ri-palette-line',
};

const subjectColors: Record<string, string> = {
  'toan': 'from-blue-500 to-blue-700',
  'van': 'from-green-500 to-green-700',
  'anh': 'from-teal-500 to-teal-700',
  'khoa-hoc': 'from-indigo-500 to-indigo-700',
  'lich-su': 'from-amber-500 to-amber-700',
  'dia-ly': 'from-cyan-500 to-cyan-700',
  'vat-ly': 'from-purple-500 to-purple-700',
  'hoa-hoc': 'from-pink-500 to-pink-700',
  'sinh-hoc': 'from-emerald-500 to-emerald-700',
  'gdcd': 'from-red-500 to-red-700',
  'tin-hoc': 'from-sky-500 to-sky-700',
  'the-duc': 'from-orange-500 to-orange-700',
  'am-nhac': 'from-violet-500 to-violet-700',
  'my-thuat': 'from-fuchsia-500 to-fuchsia-700',
};

const defaultIcon = 'ri-book-line';
const defaultColor = 'from-blue-500 to-blue-700';
const defaultImage = 'https://readdy.ai/api/search-image?query=education%20subject%20classroom%20colorful%20abstract%20learning%20modern%20clean%20minimal&width=400&height=280&seq=subject&orientation=landscape';

export default function SubjectHighlight() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        // Sort by created_at descending and take first 6
        const sortedData = data
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        setSubjects(sortedData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-3">Môn học nổi bật</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">Khám phá các môn học</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Hệ thống bài giảng đa dạng, phong phú theo chương trình chuẩn quốc gia</p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có môn học nào</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s) => {
              const icon = subjectIcons[s.slug] || defaultIcon;
              const color = subjectColors[s.slug] || defaultColor;
              return (
                <Link key={s.id} href={`/mon-hoc/${s.slug}`} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block bg-white border border-gray-100">
                  <div className="relative h-44 overflow-hidden rounded-t-2xl">
                    <img 
                      src={s.thumbnail ? (s.thumbnail.startsWith('http') ? s.thumbnail : `http://localhost:5931${s.thumbnail}`) : defaultImage} 
                      alt={s.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                        <i className={`${icon} text-xl text-white`}></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="w-4 h-4 flex items-center justify-center"><i className="ri-book-open-line text-blue-500"></i></span>
                        {s.grade_level || 'Đa cấp'}
                      </span>
                      <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Xem ngay <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

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
