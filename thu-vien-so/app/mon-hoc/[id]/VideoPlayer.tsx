'use client';
import { useState } from 'react';

interface Video {
  id: number;
  title: string;
  duration: string;
  views: string;
  thumb: string;
  week: number;
  weekTitle: string;
  description: string;
}

interface Props {
  videos: Video[];
  color: string;
}

export default function VideoPlayer({ videos, color }: Props) {
  const [activeVideo, setActiveVideo] = useState<Video>(videos[0]);
  const [playing, setPlaying] = useState(false);
  const [activeWeek, setActiveWeek] = useState<number | null>(null);

  const weeks = Array.from(new Set(videos.map(v => v.week)));
  const filteredVideos = activeWeek ? videos.filter(v => v.week === activeWeek) : videos;

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      <div className="flex-1 min-w-0">
        <div
          className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
          style={{ aspectRatio: '16/9', background: '#0f172a' }}
          onClick={() => setPlaying(!playing)}
        >
          <img
            src={activeVideo.thumb}
            alt={activeVideo.title}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            style={{ opacity: playing ? 0.3 : 1 }}
          />
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-white/90 rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                <i className="ri-play-fill text-4xl" style={{ color }}></i>
              </div>
            </div>
          )}
          {playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full mb-4">
                <i className="ri-pause-fill text-3xl text-white"></i>
              </div>
              <p className="text-white/80 text-sm">Đang phát...</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-semibold text-sm">{activeVideo.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-3 h-3 flex items-center justify-center"><i className="ri-time-line"></i></span>
                {activeVideo.duration}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-3 h-3 flex items-center justify-center"><i className="ri-eye-line"></i></span>
                {activeVideo.views} lượt xem
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">{activeVideo.title}</h3>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{activeVideo.description}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer whitespace-nowrap" style={{ background: color }}>
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line"></i></span>
              Tải về
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-share-line"></i></span>
              Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-bookmark-line"></i></span>
              Lưu lại
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Lọc theo tuần</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveWeek(null)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                style={activeWeek === null ? { background: color, color: 'white' } : { background: '#f3f4f6', color: '#6b7280' }}
              >
                Tất cả
              </button>
              {weeks.map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWeek(w)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  style={activeWeek === w ? { background: color, color: 'white' } : { background: '#f3f4f6', color: '#6b7280' }}
                >
                  Tuần {w}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
            {filteredVideos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => { setActiveVideo(v); setPlaying(false); }}
                className={`w-full flex gap-3 p-3 text-left transition-all cursor-pointer border-b border-gray-50 last:border-0 ${activeVideo.id === v.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="relative flex-shrink-0 w-24 h-14 rounded-xl overflow-hidden">
                  <img src={v.thumb} alt={v.title} className="w-full h-full object-cover object-top" />
                  {activeVideo.id === v.id && playing ? (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${color}99` }}>
                      <i className="ri-pause-fill text-white text-lg"></i>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <i className="ri-play-fill text-white text-lg"></i>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">{v.duration}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug line-clamp-2 ${activeVideo.id === v.id ? 'text-blue-700' : 'text-gray-800'}`}>{v.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Tuần {v.week} · {v.views} lượt xem</p>
                </div>
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white mt-1" style={{ background: activeVideo.id === v.id ? color : '#e5e7eb', color: activeVideo.id === v.id ? 'white' : '#9ca3af' }}>
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
