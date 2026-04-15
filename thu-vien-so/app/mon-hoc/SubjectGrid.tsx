'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSubjects, getLessons, getExercises, getTests, Subject } from '@/lib/api';

const subjectData: Record<string, { icon: string; color: string; img: string }> = {
  'toán học': { icon: 'ri-calculator-line', color: 'from-blue-500 to-blue-700', img: 'https://readdy.ai/api/search-image?query=mathematics%20education%20colorful%20numbers%20formulas%20blue%20background%20geometric%20shapes%20modern%20minimal%20clean&width=400&height=260&seq=sg001&orientation=landscape' },
  'ngữ văn': { icon: 'ri-quill-pen-line', color: 'from-green-500 to-green-700', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20literature%20open%20book%20flowers%20soft%20green%20background%20elegant%20writing%20warm%20light%20minimal&width=400&height=260&seq=sg002&orientation=landscape' },
  'tiếng anh': { icon: 'ri-global-line', color: 'from-teal-500 to-teal-700', img: 'https://readdy.ai/api/search-image?query=English%20language%20learning%20alphabet%20globe%20world%20map%20teal%20background%20modern%20education%20concept%20clean&width=400&height=260&seq=sg003&orientation=landscape' },
  'khoa học': { icon: 'ri-flask-line', color: 'from-indigo-500 to-indigo-700', img: 'https://readdy.ai/api/search-image?query=science%20experiment%20chemistry%20biology%20physics%20laboratory%20indigo%20blue%20modern%20education%20clean%20minimal&width=400&height=260&seq=sg004&orientation=landscape' },
  'lịch sử': { icon: 'ri-ancient-gate-line', color: 'from-amber-500 to-amber-700', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20history%20ancient%20temple%20cultural%20heritage%20amber%20golden%20background%20education%20clean%20minimal&width=400&height=260&seq=sg005&orientation=landscape' },
  'địa lý': { icon: 'ri-map-2-line', color: 'from-cyan-500 to-cyan-700', img: 'https://readdy.ai/api/search-image?query=geography%20world%20map%20Vietnam%20landscape%20mountains%20rivers%20cyan%20blue%20background%20education%20modern%20minimal&width=400&height=260&seq=sg006&orientation=landscape' },
  'tin học': { icon: 'ri-computer-line', color: 'from-violet-500 to-violet-700', img: 'https://readdy.ai/api/search-image?query=computer%20science%20coding%20programming%20technology%20violet%20purple%20background%20modern%20education%20clean%20minimal&width=400&height=260&seq=sg007&orientation=landscape' },
  'âm nhạc': { icon: 'ri-music-2-line', color: 'from-pink-500 to-pink-700', img: 'https://readdy.ai/api/search-image?query=music%20education%20musical%20notes%20instruments%20pink%20background%20children%20learning%20colorful%20clean%20minimal&width=400&height=260&seq=sg008&orientation=landscape' },
  'mỹ thuật': { icon: 'ri-palette-line', color: 'from-orange-500 to-orange-700', img: 'https://readdy.ai/api/search-image?query=art%20education%20painting%20drawing%20colorful%20palette%20orange%20background%20children%20creative%20clean%20minimal&width=400&height=260&seq=sg009&orientation=landscape' },
};

export default function SubjectGrid() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<Record<number, { lessons: number; exercises: number; tests: number }>>({});
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
        
        // Fetch counts for each subject
        const counts: Record<number, { lessons: number; exercises: number; tests: number }> = {};
        for (const subject of subjectsData) {
          const [lessons, exercises, tests] = await Promise.all([
            fetch(`http://localhost:3001/api/lessons?subject_id=${subject.id}`).then(res => res.json()),
            fetch(`http://localhost:3001/api/exercises?subject_id=${subject.id}`).then(res => res.json()),
            fetch(`http://localhost:3001/api/tests?subject_id=${subject.id}`).then(res => res.json()),
          ]);
          counts[subject.id] = {
            lessons: lessons.length || 0,
            exercises: exercises.length || 0,
            tests: tests.length || 0,
          };
        }
        setSubjectCounts(counts);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Đang tải môn học...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getSubjectInfo = (title: string) => {
    const lowerTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(subjectData)) {
      if (lowerTitle.includes(key)) {
        return value;
      }
    }
    return { icon: 'ri-book-line', color: 'from-blue-500 to-blue-700', img: 'https://readdy.ai/api/search-image?query=education%20books%20learning%20blue%20background%20clean%20modern&width=400&height=260&seq=default&orientation=landscape' };
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <i className="ri-book-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Chưa có môn học nào</p>
            </div>
          ) : (
            subjects.map((s) => {
              const info = getSubjectInfo(s.title);
              const counts = subjectCounts[s.id] || { lessons: 0, exercises: 0, tests: 0 };
              const slug = s.title.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Link key={s.id} href={`/mon-hoc/${slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block">
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={!imageErrors[s.id] && s.thumbnail 
                        ? (s.thumbnail.startsWith('http') ? s.thumbnail : `http://localhost:3001${s.thumbnail}`)
                        : info.img
                      } 
                      alt={s.title} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, [s.id]: true }))}
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                        <i className={`${info.icon} text-lg text-gray-700`}></i>
                      </div>
                      {s.grade_level && (
                        <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">{s.grade_level}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">{s.title}</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-xl py-2">
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mb-1"><i className="ri-book-line text-blue-500 text-sm"></i></div>
                        <div className="font-bold text-gray-800 text-sm">{counts.lessons}</div>
                        <div className="text-gray-400 text-xs">Bài học</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl py-2">
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mb-1"><i className="ri-file-list-line text-green-500 text-sm"></i></div>
                        <div className="font-bold text-gray-800 text-sm">{counts.exercises}</div>
                        <div className="text-gray-400 text-xs">Bài tập</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl py-2">
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mb-1"><i className="ri-file-paper-2-line text-orange-500 text-sm"></i></div>
                        <div className="font-bold text-gray-800 text-sm">{counts.tests}</div>
                        <div className="text-gray-400 text-xs">Đề kiểm tra</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-green-400 border-2 border-white"></div>)}
                        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">+</div>
                      </div>
                      <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Vào học <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
