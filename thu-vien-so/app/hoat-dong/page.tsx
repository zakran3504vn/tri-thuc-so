'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Lightbox from './Lightbox';

const topics = ['Tất cả', 'Văn nghệ', 'Thể thao', 'Tham quan', 'Học tập', 'Lễ hội'];
const photos = [
  { id: 1, topic: 'Văn nghệ', title: 'Hội diễn văn nghệ 20/11', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20school%20cultural%20performance%20students%20singing%20dancing%20colorful%20stage%20warm%20light%20celebration&width=400&height=300&seq=hd001&orientation=landscape' },
  { id: 2, topic: 'Thể thao', title: 'Giải thể thao học sinh 2026', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20school%20sports%20day%20students%20running%20playing%20outdoor%20sunny%20colorful%20cheerful&width=400&height=300&seq=hd002&orientation=landscape' },
  { id: 3, topic: 'Tham quan', title: 'Tham quan Bảo tàng Lịch sử', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20students%20museum%20field%20trip%20history%20learning%20group%20photo%20colorful%20educational&width=400&height=300&seq=hd003&orientation=landscape' },
  { id: 4, topic: 'Học tập', title: 'Ngày hội đọc sách 2026', img: 'https://readdy.ai/api/search-image?query=reading%20day%20event%20children%20books%20library%20colorful%20warm%20atmosphere%20Vietnamese%20school&width=400&height=300&seq=hd004&orientation=landscape' },
  { id: 5, topic: 'Lễ hội', title: 'Tết Trung Thu tại trường', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20Mid-Autumn%20Festival%20school%20lanterns%20children%20celebration%20colorful%20warm%20night&width=400&height=300&seq=hd005&orientation=landscape' },
  { id: 6, topic: 'Văn nghệ', title: 'Khai giảng năm học 2026-2027', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20school%20opening%20ceremony%20students%20teachers%20colorful%20flags%20celebration%20outdoor&width=400&height=300&seq=hd006&orientation=landscape' },
  { id: 7, topic: 'Thể thao', title: 'Hội khỏe Phù Đổng cấp trường', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20school%20sports%20competition%20students%20athletes%20outdoor%20sunny%20colorful%20cheerful&width=400&height=300&seq=hd007&orientation=landscape' },
  { id: 8, topic: 'Tham quan', title: 'Dã ngoại Vườn Quốc gia Cúc Phương', img: 'https://readdy.ai/api/search-image?query=Vietnamese%20students%20nature%20trip%20forest%20national%20park%20green%20trees%20learning%20outdoor%20group&width=400&height=300&seq=hd008&orientation=landscape' },
  { id: 9, topic: 'Học tập', title: 'Cuộc thi Khoa học kỹ thuật', img: 'https://readdy.ai/api/search-image?query=science%20fair%20competition%20Vietnamese%20students%20projects%20experiments%20colorful%20modern%20school&width=400&height=300&seq=hd009&orientation=landscape' },
];

export default function HoatDongPage() {
  const [activeTopic, setActiveTopic] = useState('Tất cả');
  const [lightbox, setLightbox] = useState<null | typeof photos[0]>(null);
  const filtered = activeTopic === 'Tất cả' ? photos : photos.filter(p => p.topic === activeTopic);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-teal-700 to-blue-600 py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">Hoạt động trải nghiệm</h1>
          <p className="text-teal-100 text-lg">Album ảnh các hoạt động nổi bật của nhà trường</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
          <aside className="w-52 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lọc theo chủ đề</h3>
              <div className="space-y-1">
                {topics.map(t => (
                  <button key={t} onClick={() => setActiveTopic(t)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${activeTopic === t ? 'bg-teal-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-2">
              {topics.map(t => (
                <button key={t} onClick={() => setActiveTopic(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${activeTopic === t ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(photo => (
                <div key={photo.id} onClick={() => setLightbox(photo)} className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden h-52">
                    <img src={photo.img} alt={photo.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-white/90 rounded-full"><i className="ri-zoom-in-line text-gray-800 text-xl"></i></div>
                    </div>
                    <span className="absolute top-3 left-3 px-2 py-1 bg-teal-600/90 text-white text-xs font-semibold rounded-full">{photo.topic}</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 border-t-0">
                    <h4 className="font-semibold text-gray-800 text-sm">{photo.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {lightbox && (
        <Lightbox
          photo={lightbox}
          photos={photos}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
