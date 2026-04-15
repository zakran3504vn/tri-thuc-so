'use client';
import { useEffect, useState, useCallback } from 'react';

interface Photo {
  id: number;
  topic: string;
  title: string;
  img: string;
}

interface LightboxProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
}

export default function Lightbox({ photo, photos, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(photo);
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const currentIndex = photos.findIndex(p => p.id === current.id);

  const navigate = useCallback((dir: 'prev' | 'next') => {
    if (isAnimating) return;
    const newIndex = dir === 'next'
      ? (currentIndex + 1) % photos.length
      : (currentIndex - 1 + photos.length) % photos.length;
    setSlideDir(dir === 'next' ? 'left' : 'right');
    setIsAnimating(true);
    setZoomed(false);
    setScale(1);
    setTimeout(() => {
      setCurrent(photos[newIndex]);
      setSlideDir(null);
      setIsAnimating(false);
    }, 300);
  }, [currentIndex, photos, isAnimating]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, onClose]);

  const handleZoom = () => {
    if (zoomed) {
      setZoomed(false);
      setScale(1);
    } else {
      setZoomed(true);
      setScale(2);
    }
  };

  const getSlideClass = () => {
    if (!slideDir) return 'translate-x-0 opacity-100';
    if (slideDir === 'left') return '-translate-x-8 opacity-0';
    return 'translate-x-8 opacity-0';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: `rgba(0,0,0,${visible ? 0.92 : 0})`,
        transition: 'background 0.3s ease',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 flex flex-col items-center"
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'rgba(13,148,136,0.8)' }}>{current.topic}</span>
            <span className="text-white/50 text-xs">{currentIndex + 1} / {photos.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoom}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20"
              title={zoomed ? 'Thu nhỏ' : 'Phóng to'}
            >
              <i className={`${zoomed ? 'ri-zoom-out-line' : 'ri-zoom-in-line'} text-white text-base`}></i>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20"
            >
              <i className="ri-close-line text-white text-lg"></i>
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl" style={{ maxHeight: '70vh' }}>
          <div
            className={`transition-all duration-300 ${getSlideClass()}`}
            style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
            onClick={handleZoom}
          >
            <img
              src={current.img}
              alt={current.title}
              className="w-full object-contain rounded-2xl"
              style={{
                maxHeight: '70vh',
                transform: `scale(${scale})`,
                transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                transformOrigin: 'center center',
              }}
            />
          </div>

          <button
            onClick={e => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-all cursor-pointer border border-white/20 backdrop-blur-sm"
          >
            <i className="ri-arrow-left-s-line text-white text-2xl"></i>
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-all cursor-pointer border border-white/20 backdrop-blur-sm"
          >
            <i className="ri-arrow-right-s-line text-white text-2xl"></i>
          </button>
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-white font-bold text-lg">{current.title}</h3>
          <p className="text-white/50 text-xs mt-1">Nhấn ← → để điều hướng · Nhấn ảnh để phóng to · ESC để đóng</p>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 max-w-full px-2">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { if (p.id !== current.id) { setCurrent(p); setZoomed(false); setScale(1); } }}
              className="flex-shrink-0 cursor-pointer"
              style={{
                width: 56,
                height: 40,
                borderRadius: 8,
                overflow: 'hidden',
                border: p.id === current.id ? '2px solid #0d9488' : '2px solid transparent',
                opacity: p.id === current.id ? 1 : 0.55,
                transition: 'all 0.2s ease',
              }}
            >
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
