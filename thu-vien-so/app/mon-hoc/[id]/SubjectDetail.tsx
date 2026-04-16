'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import VideoPlayer from './VideoPlayer';
import { getSubject, getLessons, getExercises, getTests, getSoftBooks, Subject, Lesson, Exercise, Test, SoftBook } from '@/lib/api';

const subjectData: Record<string, { name: string; icon: string; color: string; bgGradient: string; description: string }> = {
  'toan': { name: 'Toán học', icon: 'ri-calculator-line', color: '#2563eb', bgGradient: 'from-blue-600 to-blue-800', description: 'Chương trình Toán học chuẩn quốc gia từ lớp 1 đến lớp 9' },
  'van': { name: 'Ngữ văn', icon: 'ri-quill-pen-line', color: '#16a34a', bgGradient: 'from-green-600 to-green-800', description: 'Chương trình Ngữ văn chuẩn quốc gia từ lớp 1 đến lớp 9' },
  'anh': { name: 'Tiếng Anh', icon: 'ri-global-line', color: '#0d9488', bgGradient: 'from-teal-600 to-teal-800', description: 'Chương trình Tiếng Anh chuẩn quốc gia từ lớp 1 đến lớp 9' },
  'khoa-hoc': { name: 'Khoa học', icon: 'ri-flask-line', color: '#4f46e5', bgGradient: 'from-indigo-600 to-indigo-800', description: 'Chương trình Khoa học tự nhiên chuẩn quốc gia' },
  'lich-su': { name: 'Lịch sử', icon: 'ri-ancient-gate-line', color: '#d97706', bgGradient: 'from-amber-600 to-amber-800', description: 'Chương trình Lịch sử Việt Nam và thế giới' },
  'dia-ly': { name: 'Địa lý', icon: 'ri-map-2-line', color: '#0891b2', bgGradient: 'from-cyan-600 to-cyan-800', description: 'Chương trình Địa lý chuẩn quốc gia' },
  'tin-hoc': { name: 'Tin học', icon: 'ri-computer-line', color: '#7c3aed', bgGradient: 'from-violet-600 to-violet-800', description: 'Chương trình Tin học chuẩn quốc gia' },
  'am-nhac': { name: 'Âm nhạc', icon: 'ri-music-2-line', color: '#db2777', bgGradient: 'from-pink-600 to-pink-800', description: 'Chương trình Âm nhạc chuẩn quốc gia' },
  'my-thuat': { name: 'Mỹ thuật', icon: 'ri-palette-line', color: '#ea580c', bgGradient: 'from-orange-600 to-orange-800', description: 'Chương trình Mỹ thuật chuẩn quốc gia' },
};

const tabs = [
  { id: 'video', label: 'Video bài giảng', icon: 'ri-video-line' },
  { id: 'bai-hoc', label: 'Bài học theo tuần', icon: 'ri-book-open-line' },
  { id: 'bai-tap', label: 'Bài tập bổ trợ', icon: 'ri-file-list-3-line' },
  { id: 'de-kiem-tra', label: 'Đề kiểm tra', icon: 'ri-file-paper-2-line' },
  { id: 'sach-mem', label: 'Sách mềm', icon: 'ri-book-2-line' },
];

const levelColor: Record<string, string> = {
  'easy': 'bg-green-100 text-green-700',
  'medium': 'bg-yellow-100 text-yellow-700',
  'hard': 'bg-red-100 text-red-700',
};

export default function SubjectDetail({ subjectId }: { subjectId: string }) {
  const [activeTab, setActiveTab] = useState('video');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [softBooks, setSoftBooks] = useState<SoftBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Use subject data from API when available, otherwise use fallback
  const subjectInfo = subject
    ? {
        name: subject.title,
        icon: 'ri-book-line',
        color: '#2563eb',
        bgGradient: 'from-blue-600 to-blue-800',
        description: subject.description || 'Chương trình học chuẩn quốc gia'
      }
    : { name: 'Môn học', icon: 'ri-book-line', color: '#2563eb', bgGradient: 'from-blue-600 to-blue-800', description: 'Chương trình học chuẩn quốc gia' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch subject by slug
        const response = await fetch(`https://backend.khotrithucso.vn/api/subjects/slug/${subjectId}`);
        if (response.ok) {
          const matchedSubject = await response.json();
          setSubject(matchedSubject);
          // Fetch lessons, exercises, tests, and soft books for this subject
          const [lessonsData, exercisesData, testsData, softBooksData] = await Promise.all([
            fetch(`https://backend.khotrithucso.vn/api/lessons?subject_id=${matchedSubject.id}`).then(res => res.json()),
            fetch(`https://backend.khotrithucso.vn/api/exercises?subject_id=${matchedSubject.id}`).then(res => res.json()),
            fetch(`https://backend.khotrithucso.vn/api/tests?subject_id=${matchedSubject.id}`).then(res => res.json()),
            fetch(`https://backend.khotrithucso.vn/api/soft-books?subject_id=${matchedSubject.id}`).then(res => res.json()),
          ]);
          setLessons(lessonsData);
          setExercises(exercisesData);
          setTests(testsData);
          setSoftBooks(softBooksData);
        }
      } catch (error) {
        console.error('Failed to fetch subject data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  // Group lessons by week number
  const lessonsByWeek: Record<number, Lesson[]> = {};
  lessons.forEach(lesson => {
    if (lesson.week_number) {
      if (!lessonsByWeek[lesson.week_number]) {
        lessonsByWeek[lesson.week_number] = [];
      }
      lessonsByWeek[lesson.week_number].push(lesson);
    }
  });

  const weeks = Object.keys(lessonsByWeek).map(Number).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Đang tải...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <div className={`bg-gradient-to-r ${subjectInfo.bgGradient} py-12 px-4`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white cursor-pointer">Trang chủ</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link href="/mon-hoc" className="hover:text-white cursor-pointer">Môn học</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-white">{subjectInfo.name}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
                <i className={`${subjectInfo.icon} text-3xl text-white`}></i>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">{subject ? subject.title : subjectInfo.name}</h1>
                <p className="text-white/70 mt-1 text-sm">{subject ? subject.description : subjectInfo.description}</p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-white">{lessons.length}</p>
                  <p className="text-white/60 text-xs">Bài giảng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-white">{weeks.length}</p>
                  <p className="text-white/60 text-xs">Tuần học</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-white">{exercises.length}</p>
                  <p className="text-white/60 text-xs">Bài tập</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer"
                style={activeTab === tab.id
                  ? { background: subjectInfo.color, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                  : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}
              >
                <span className="w-4 h-4 flex items-center justify-center"><i className={tab.icon}></i></span>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'video' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <i className="ri-video-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Chưa có bài giảng nào</p>
                </div>
              ) : (
                lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      {lesson.thumbnail ? (
                        <img 
                          src={lesson.thumbnail.startsWith('http') ? lesson.thumbnail : `https://backend.khotrithucso.vn${lesson.thumbnail}`} 
                          alt={lesson.title} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : lesson.video_url ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full group-hover:scale-110 transition-transform duration-300">
                            <i className="ri-play-fill text-3xl text-white"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <i className="ri-video-line text-5xl text-gray-300"></i>
                        </div>
                      )}
                      {lesson.week_number && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold" style={{ color: subjectInfo.color }}>
                          Tuần {lesson.week_number}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <i className="ri-time-line"></i>
                          {lesson.video_duration ? `${lesson.video_duration} phút` : 'Không giới hạn'}
                        </span>
                        <button className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap" style={{ background: `${subjectInfo.color}15`, color: subjectInfo.color }}>
                          Xem ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bai-hoc' && (
            <div className="space-y-4">
              {weeks.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <i className="ri-book-open-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Chưa có bài học theo tuần nào</p>
                </div>
              ) : (
                weeks.map((week) => (
                  <div key={week} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-white flex-shrink-0" style={{ background: subjectInfo.color }}>
                          <span className="text-sm">{week}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Tuần {week}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${subjectInfo.color}15`, color: subjectInfo.color }}>
                            {lessonsByWeek[week].length} bài học
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {lessonsByWeek[week].map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
                          <span className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${subjectInfo.color}22` }}>
                            <i className="ri-play-circle-line text-sm" style={{ color: subjectInfo.color }}></i>
                          </span>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bai-tap' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exercises.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center col-span-full">
                  <i className="ri-file-list-3-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Chưa có bài tập nào</p>
                </div>
              ) : (
                exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${subjectInfo.color}15` }}>
                        <i className="ri-file-list-3-line text-xl" style={{ color: subjectInfo.color }}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{exercise.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColor[exercise.difficulty]}`}>
                            {exercise.difficulty === 'easy' ? 'Dễ' : exercise.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                          </span>
                          {exercise.description && (
                            <span className="text-xs text-gray-400 line-clamp-1">{exercise.description}</span>
                          )}
                        </div>
                        {exercise.file_url && (
                          <a
                            href={exercise.file_url.startsWith('http') ? exercise.file_url : `https://backend.khotrithucso.vn${exercise.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                          >
                            <i className="ri-download-line"></i>
                            Tải file bài tập
                          </a>
                        )}
                      </div>
                    </div>
                    {exercise.file_url ? (
                      <a
                        href={exercise.file_url.startsWith('http') ? exercise.file_url : `https://backend.khotrithucso.vn${exercise.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer hover:opacity-90"
                        style={{ background: subjectInfo.color }}
                      >
                        Tải file
                      </a>
                    ) : (
                      <button className="px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer" style={{ background: subjectInfo.color }}>
                        Làm bài
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'de-kiem-tra' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center col-span-full">
                  <i className="ri-file-paper-2-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Chưa có đề kiểm tra nào</p>
                </div>
              ) : (
                tests.map((test) => (
                  <div key={test.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-xl flex-shrink-0">
                        <i className="ri-file-paper-2-line text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{test.title}</h4>
                        {test.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{test.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          {test.duration && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${subjectInfo.color}15`, color: subjectInfo.color }}>
                              {test.duration} phút
                            </span>
                          )}
                          {test.total_questions && (
                            <span className="text-xs text-gray-400">{test.total_questions} câu</span>
                          )}
                          {test.passing_score && (
                            <span className="text-xs text-gray-400">Đạt: {test.passing_score}</span>
                          )}
                        </div>
                        {test.file_url && (
                          <a
                            href={test.file_url.startsWith('http') ? test.file_url : `https://backend.khotrithucso.vn${test.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                          >
                            <i className="ri-download-line"></i>
                            Tải file đề kiểm tra
                          </a>
                        )}
                      </div>
                    </div>
                    {test.file_url ? (
                      <a
                        href={test.file_url.startsWith('http') ? test.file_url : `https://backend.khotrithucso.vn${test.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer hover:opacity-90"
                        style={{ background: '#16a34a' }}
                      >
                        Tải file
                      </a>
                    ) : (
                      <button className="px-3 py-2 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer" style={{ background: '#16a34a' }}>
                        Làm bài
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sach-mem' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {softBooks.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <i className="ri-book-2-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Chưa có sách mềm nào</p>
                </div>
              ) : (
                softBooks.map((softBook) => (
                  <div key={softBook.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      {softBook.cover_image ? (
                        <img
                          src={softBook.cover_image.startsWith('http') ? softBook.cover_image : `https://backend.khotrithucso.vn${softBook.cover_image}`}
                          alt={softBook.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <i className="ri-book-2-line text-6xl text-blue-200"></i>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <a
                          href={softBook.file_url.startsWith('http') ? softBook.file_url : `https://backend.khotrithucso.vn${softBook.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        >
                          Tải sách
                        </a>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-1">{softBook.title}</h4>
                      {softBook.author && (
                        <p className="text-xs text-gray-500 mb-2">Tác giả: {softBook.author}</p>
                      )}
                      {softBook.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{softBook.description}</p>
                      )}
                      <a
                        href={softBook.file_url.startsWith('http') ? softBook.file_url : `https://backend.khotrithucso.vn${softBook.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <i className="ri-download-line"></i>
                        Tải file
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
