'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import NotePanel from './NotePanel';
import { getStory, getStoryPages, Story, Page } from '@/lib/api';

interface Props { storyId: string; }

function PageContent({ page, pageNum, total, cat }: { page: { content: string; img?: string }; pageNum: number; total: number; cat: string }) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #fefdf8 0%, #fdf8f0 100%)' }}>
      {page.img && (
        <div className="relative flex-shrink-0" style={{ height: '42%' }}>
          <img src={page.img} alt={`Trang ${pageNum}`} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #fdf8f0 100%)' }}></div>
        </div>
      )}
      <div className="flex-1 px-7 py-5 flex flex-col justify-between overflow-hidden">
        <p className="text-gray-700 leading-relaxed overflow-hidden" style={{ fontFamily: '"Georgia", "Times New Roman", serif', fontSize: '0.92rem', lineHeight: '1.85', display: '-webkit-box', WebkitLineClamp: page.img ? 7 : 12, WebkitBoxOrient: 'vertical' as const }}>
          {page.content}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100">
          <span className="text-xs text-amber-400 font-medium">{cat}</span>
          <span className="text-xs text-gray-400">{pageNum} / {total}</span>
        </div>
      </div>
    </div>
  );
}

export default function FlipbookReader({ storyId }: Props) {
  const [story, setStory] = useState<Story | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSide, setDragSide] = useState<'left' | 'right'>('right');
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [bookmarkPage, setBookmarkPage] = useState<number | null>(null);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [bookmarkToastMsg, setBookmarkToastMsg] = useState('');
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [storyData, pagesData] = await Promise.all([
          getStory(storyId),
          getStoryPages(storyId)
        ]);
        setStory(storyData);
        setPages(pagesData);
      } catch (error) {
        console.error('Failed to load story:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [storyId]);

  if (loading || !story || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 40%, #3d2b1f 100%)' }}>
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  const totalPages = pages.length;
  const storyData = {
    title: story.title,
    author: story.author,
    cat: story.category,
    pages: pages.map(p => ({ content: p.content, img: p.image_url || undefined }))
  };

  const dragStartX = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const storageKey = `bookmark_story_${storyId}`;
  const notesKey = `notes_story_${storyId}`;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setBookmarkPage(parseInt(saved, 10));
    }
  }, [storageKey]);

  useEffect(() => {
    const raw = localStorage.getItem(notesKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<number, string>;
      setNoteCount(Object.values(parsed).filter(v => v.trim()).length);
    }
  }, [notesKey, showNotePanel]);

  const showToast = (msg: string) => {
    setBookmarkToastMsg(msg);
    setShowBookmarkToast(true);
    setTimeout(() => setShowBookmarkToast(false), 2500);
  };

  const currentPageNum = isMobile ? mobilePage : spreadIndex * 2;
  const isBookmarkedCurrentPage = bookmarkPage === currentPageNum;

  const handleBookmark = () => {
    if (isBookmarkedCurrentPage) {
      localStorage.removeItem(storageKey);
      setBookmarkPage(null);
      showToast('Đã xóa đánh dấu trang');
    } else {
      localStorage.setItem(storageKey, String(currentPageNum));
      setBookmarkPage(currentPageNum);
      showToast(`Đã đánh dấu trang ${currentPageNum + 1}`);
    }
  };

  const handleGoToBookmark = () => {
    if (bookmarkPage === null) return;
    if (isMobile) {
      setMobilePage(bookmarkPage);
    } else {
      const spread = Math.floor(bookmarkPage / 2);
      setSpreadIndex(spread);
      setSliderVal(spread);
    }
    showToast('Đã chuyển đến trang đã đánh dấu');
  };

  const leftPageIndex = spreadIndex * 2;
  const rightPageIndex = spreadIndex * 2 + 1;
  const totalSpreads = Math.ceil(totalPages / 2);
  const canNext = spreadIndex < totalSpreads - 1;
  const canPrev = spreadIndex > 0;

  const playPageSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 28) * 0.35;
        if (i % 3 === 0) data[i] *= 1.4;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2800;
      filter.Q.value = 0.7;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.9, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();
    } catch {}
  }, []);

  const goToSpread = useCallback((dir: 'next' | 'prev') => {
    if (isFlipping) return;
    if (dir === 'next' && !canNext) return;
    if (dir === 'prev' && !canPrev) return;
    setFlipDir(dir);
    setIsFlipping(true);
    playPageSound();
    setTimeout(() => {
      setSpreadIndex(s => dir === 'next' ? s + 1 : s - 1);
      setSliderVal(dir === 'next' ? spreadIndex + 1 : spreadIndex - 1);
      setIsFlipping(false);
      setDragX(0);
    }, 600);
  }, [isFlipping, canNext, canPrev, spreadIndex, playPageSound]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSpread('next');
      if (e.key === 'ArrowLeft') goToSpread('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToSpread]);

  const getClientX = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) return e.touches[0]?.clientX ?? 0;
    return e.clientX;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, side: 'left' | 'right') => {
    if (isFlipping) return;
    if (side === 'right' && !canNext) return;
    if (side === 'left' && !canPrev) return;
    setIsDragging(true);
    setDragSide(side);
    dragStartX.current = getClientX(e);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isFlipping) return;
    const cx = getClientX(e);
    const delta = cx - dragStartX.current;
    const bookW = bookRef.current?.offsetWidth ?? 800;
    const halfW = bookW / 2;
    if (dragSide === 'right') {
      const clamped = Math.min(0, Math.max(-halfW, delta));
      setDragX(clamped);
    } else {
      const clamped = Math.max(0, Math.min(halfW, delta));
      setDragX(clamped);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const bookW = bookRef.current?.offsetWidth ?? 800;
    const halfW = bookW / 2;
    const threshold = halfW * 0.5;
    if (dragSide === 'right' && Math.abs(dragX) > threshold) {
      goToSpread('next');
    } else if (dragSide === 'left' && dragX > threshold) {
      goToSpread('prev');
    } else {
      setDragX(0);
    }
  };

  const getFlipAngle = () => {
    if (isFlipping) return flipDir === 'next' ? -180 : 180;
    if (isDragging) {
      const bookW = bookRef.current?.offsetWidth ?? 800;
      const halfW = bookW / 2;
      if (dragSide === 'right') return (dragX / halfW) * 180;
      return (dragX / halfW) * 180;
    }
    return 0;
  };

  const flipAngle = getFlipAngle();
  const flipProgress = Math.abs(flipAngle) / 180;
  const shadowOpacity = flipProgress * 0.5;

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fef9f0 0%, #fdf4e3 100%)' }}>
        {showNotePanel && (
          <NotePanel storyId={storyId} pageIndex={currentPageNum} onClose={() => setShowNotePanel(false)} />
        )}
        {showBookmarkToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {bookmarkToastMsg}
          </div>
        )}
        <div className="bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Link href="/truyen-doc" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer text-gray-600">
              <i className="ri-arrow-left-line text-lg"></i>
            </Link>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">{storyData.title}</h1>
              <p className="text-xs text-gray-400">{storyData.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {bookmarkPage !== null && (
              <button onClick={handleGoToBookmark} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 cursor-pointer" title="Đến trang đã đánh dấu">
                <i className="ri-bookmark-fill text-amber-500 text-base"></i>
              </button>
            )}
            <button onClick={handleBookmark} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className={`${isBookmarkedCurrentPage ? 'ri-bookmark-fill text-amber-500' : 'ri-bookmark-line text-gray-400'} text-base`}></i>
            </button>
            <span className="text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded-full ml-1">{mobilePage + 1}/{totalPages}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 py-6">
          <div className="flex-1 rounded-2xl shadow-xl overflow-hidden border border-amber-100" style={{ background: 'linear-gradient(135deg, #fefdf8 0%, #fdf8f0 100%)', minHeight: 480 }}>
            <PageContent page={storyData.pages[mobilePage]} pageNum={mobilePage + 1} total={totalPages} cat={storyData.cat} />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={() => { if (mobilePage > 0) { setMobilePage(p => p - 1); playPageSound(); } }} disabled={mobilePage === 0} className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-md border border-amber-100 hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
            </button>
            <input type="range" min={0} max={totalPages - 1} value={mobilePage} onChange={e => { setMobilePage(Number(e.target.value)); playPageSound(); }} className="flex-1 accent-amber-500 cursor-pointer" />
            <button onClick={() => { if (mobilePage < totalPages - 1) { setMobilePage(p => p + 1); playPageSound(); } }} disabled={mobilePage === totalPages - 1} className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <i className="ri-arrow-right-s-line text-xl text-white"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 40%, #3d2b1f 100%)' }}>
      {showNotePanel && (
        <NotePanel storyId={storyId} pageIndex={currentPageNum} onClose={() => setShowNotePanel(false)} />
      )}
      {showBookmarkToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-xl">
          {bookmarkToastMsg}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/truyen-doc" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white">
            <i className="ri-arrow-left-line text-lg"></i>
          </Link>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">{storyData.title}</h1>
            <p className="text-white/60 text-xs">{storyData.author} · {storyData.cat}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs hidden sm:block">Trang {spreadIndex * 2 + 1}–{Math.min(spreadIndex * 2 + 2, totalPages)} / {totalPages}</span>
          {bookmarkPage !== null && (
            <button onClick={handleGoToBookmark} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-xs transition-all cursor-pointer whitespace-nowrap">
              <i className="ri-bookmark-fill text-amber-300 text-sm"></i>
              <span>Trang {bookmarkPage + 1}</span>
            </button>
          )}
          <button onClick={handleBookmark} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer" title={isBookmarkedCurrentPage ? 'Xóa đánh dấu' : 'Đánh dấu trang này'}>
            <i className={`${isBookmarkedCurrentPage ? 'ri-bookmark-fill text-amber-300' : 'ri-bookmark-line text-white'} text-lg`}></i>
          </button>
          <button onClick={() => setShowNotePanel(true)} className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white" title="Ghi chú trang này">
            <i className="ri-sticky-note-line text-lg"></i>
            {noteCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-amber-400 text-white text-xs rounded-full font-bold">{noteCount}</span>}
          </button>
          <button onClick={() => setShowTOC(!showTOC)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-white">
            <i className="ri-list-unordered text-lg"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        {showTOC && (
          <div className="absolute left-6 top-4 z-50 w-48 bg-white rounded-2xl shadow-2xl border border-amber-100 p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Mục lục</h3>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {Array.from({ length: totalSpreads }).map((_, i) => (
                <button key={i} onClick={() => { setSpreadIndex(i); setSliderVal(i); setShowTOC(false); playPageSound(); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${spreadIndex === i ? 'bg-amber-500 text-white font-semibold' : 'text-gray-600 hover:bg-amber-50'}`}>
                  Trang {i * 2 + 1}{i * 2 + 1 < totalPages ? `–${Math.min(i * 2 + 2, totalPages)}` : ''}
                  {bookmarkPage !== null && (bookmarkPage === i * 2 || bookmarkPage === i * 2 + 1) && (
                    <i className="ri-bookmark-fill text-amber-400 ml-1 text-xs"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => goToSpread('prev')}
          disabled={!canPrev || isFlipping}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed border border-white/20"
        >
          <i className="ri-arrow-left-s-line text-2xl text-white"></i>
        </button>

        <div className="relative" style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}>
          <div
            ref={bookRef}
            className="relative flex select-none"
            style={{ width: 'min(900px, 90vw)', height: 'min(560px, 60vw)', minHeight: 420 }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4)' }}></div>

            <div
              className="relative flex-1 rounded-l-2xl overflow-hidden cursor-w-resize"
              style={{ background: 'linear-gradient(135deg, #fefdf8 0%, #fdf8f0 100%)' }}
              onMouseDown={e => handleDragStart(e, 'left')}
              onTouchStart={e => handleDragStart(e, 'left')}
            >
              {leftPageIndex < totalPages ? (
                <PageContent page={storyData.pages[leftPageIndex]} pageNum={leftPageIndex + 1} total={totalPages} cat={storyData.cat} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fefdf8 0%, #fdf8f0 100%)' }}>
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-3">
                      <i className="ri-book-open-line text-3xl text-amber-400"></i>
                    </div>
                    <p className="text-amber-300 text-sm font-medium">Hết truyện</p>
                  </div>
                </div>
              )}
              {bookmarkPage === leftPageIndex && (
                <div className="absolute top-0 right-4 z-10">
                  <div className="w-6 h-10 flex items-start justify-center pt-1" style={{ background: '#f59e0b', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <i className="ri-bookmark-fill text-white text-xs"></i>
                  </div>
                </div>
              )}
              <div className="absolute inset-y-0 right-0 w-8" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.06))' }}></div>
              {isDragging && dragSide === 'left' && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `rgba(0,0,0,${shadowOpacity * 0.15})` }}></div>
              )}
            </div>

            <div className="w-px flex-shrink-0 relative z-10" style={{ background: 'linear-gradient(to bottom, #c8a96e, #8b6914, #c8a96e)', boxShadow: '0 0 12px rgba(0,0,0,0.4), -2px 0 8px rgba(0,0,0,0.2), 2px 0 8px rgba(0,0,0,0.2)' }}></div>

            <div
              className="relative flex-1 rounded-r-2xl overflow-hidden cursor-e-resize"
              style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fefdf8 100%)' }}
              onMouseDown={e => handleDragStart(e, 'right')}
              onTouchStart={e => handleDragStart(e, 'right')}
            >
              {rightPageIndex < totalPages ? (
                <PageContent page={storyData.pages[rightPageIndex]} pageNum={rightPageIndex + 1} total={totalPages} cat={storyData.cat} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fefdf8 100%)' }}>
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-3">
                      <i className="ri-book-open-line text-3xl text-amber-400"></i>
                    </div>
                    <p className="text-amber-300 text-sm font-medium">Hết truyện</p>
                  </div>
                </div>
              )}
              {bookmarkPage === rightPageIndex && (
                <div className="absolute top-0 right-4 z-10">
                  <div className="w-6 h-10 flex items-start justify-center pt-1" style={{ background: '#f59e0b', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <i className="ri-bookmark-fill text-white text-xs"></i>
                  </div>
                </div>
              )}
              <div className="absolute inset-y-0 left-0 w-8" style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.06))' }}></div>
              {isDragging && dragSide === 'right' && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `rgba(0,0,0,${shadowOpacity * 0.15})` }}></div>
              )}
            </div>

            {(isFlipping || (isDragging && Math.abs(dragX) > 5)) && (
              <div
                className="absolute top-0 bottom-0 z-20 overflow-hidden"
                style={{
                  width: '50%',
                  left: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? '50%' : '0%',
                  transformOrigin: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? 'left center' : 'right center',
                  transform: `perspective(2000px) rotateY(${flipAngle}deg)`,
                  transition: isFlipping ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
                  borderRadius: (isFlipping ? flipDir === 'next' : dragSide === 'right') ? '0 12px 12px 0' : '12px 0 0 12px',
                  boxShadow: `${flipAngle < 0 ? '-' : ''}${Math.abs(flipAngle) * 0.3}px 0 ${Math.abs(flipAngle) * 0.5}px rgba(0,0,0,${shadowOpacity * 0.6})`,
                  background: 'linear-gradient(135deg, #fefdf8 0%, #fdf8f0 100%)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {flipAngle > -90 && flipAngle < 90 ? (
                  (isFlipping ? flipDir === 'next' : dragSide === 'right') && rightPageIndex < totalPages ? (
                    <PageContent page={storyData.pages[rightPageIndex]} pageNum={rightPageIndex + 1} total={totalPages} cat={storyData.cat} />
                  ) : leftPageIndex < totalPages ? (
                    <PageContent page={storyData.pages[leftPageIndex]} pageNum={leftPageIndex + 1} total={totalPages} cat={storyData.cat} />
                  ) : null
                ) : (
                  (isFlipping ? flipDir === 'next' : dragSide === 'right') ? (
                    rightPageIndex + 2 < totalPages ? <PageContent page={storyData.pages[rightPageIndex + 2]} pageNum={rightPageIndex + 3} total={totalPages} cat={storyData.cat} /> : null
                  ) : (
                    leftPageIndex - 2 >= 0 ? <PageContent page={storyData.pages[leftPageIndex - 2]} pageNum={leftPageIndex - 1} total={totalPages} cat={storyData.cat} /> : null
                  )
                )}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(${(isFlipping ? flipDir === 'next' : dragSide === 'right') ? 'to right' : 'to left'}, rgba(0,0,0,${shadowOpacity * 0.25}), transparent 60%)`,
                  }}
                ></div>
              </div>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 h-6 rounded-b-2xl pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)', zIndex: 5 }}
            ></div>
          </div>

          <div className="mt-6 flex items-center gap-4 px-2">
            <span className="text-white/50 text-xs whitespace-nowrap">Trang 1</span>
            <input
              type="range"
              min={0}
              max={totalSpreads - 1}
              value={sliderVal}
              onChange={e => {
                const v = Number(e.target.value);
                setSliderVal(v);
                setSpreadIndex(v);
                playPageSound();
              }}
              className="flex-1 cursor-pointer"
              style={{ accentColor: '#f59e0b' }}
            />
            <span className="text-white/50 text-xs whitespace-nowrap">Trang {totalPages}</span>
          </div>
          <p className="text-center text-white/40 text-xs mt-2">Kéo góc trang hoặc dùng phím ← → để lật · Nhấn <i className="ri-bookmark-line"></i> để đánh dấu trang</p>
        </div>

        <button
          onClick={() => goToSpread('next')}
          disabled={!canNext || isFlipping}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed border border-white/20"
        >
          <i className="ri-arrow-right-s-line text-2xl text-white"></i>
        </button>
      </div>
    </div>
  );
}
