'use client';
import { useState, useEffect } from 'react';

interface Props {
  bookId: string;
  pageIndex: number;
  color: string;
  onClose: () => void;
}

export default function BookNotePanel({ bookId, pageIndex, color, onClose }: Props) {
  const storageKey = `notes_book_${bookId}`;
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<number, string>;
      setNotes(parsed);
      setText(parsed[pageIndex] || '');
    } else {
      setText('');
    }
  }, [storageKey, pageIndex]);

  const handleSave = () => {
    const updated = { ...notes, [pageIndex]: text };
    if (!text.trim()) {
      delete updated[pageIndex];
    }
    setNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleDelete = () => {
    const updated = { ...notes };
    delete updated[pageIndex];
    setNotes(updated);
    setText('');
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const allNotes = Object.entries(notes).filter(([, v]) => v.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
      <div
        className="h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
        style={{ borderLeft: '1px solid #f3f4f6' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${color}22` }}>
              <i className="ri-sticky-note-line text-base" style={{ color }}></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Ghi chú</h3>
              <p className="text-xs text-gray-400">Trang {pageIndex + 1}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer text-gray-400">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Ghi chú trang này</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Viết ghi chú của bạn ở đây..."
              maxLength={500}
              className="w-full h-36 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ background: '#f8faff', fontFamily: 'inherit', lineHeight: '1.7', outlineColor: color }}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{text.length}/500 ký tự</span>
              {notes[pageIndex] && (
                <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Xóa ghi chú</button>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            style={{ background: color }}
          >
            {saved ? <><i className="ri-check-line"></i> Đã lưu!</> : <><i className="ri-save-line"></i> Lưu ghi chú</>}
          </button>

          {allNotes.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Tất cả ghi chú ({allNotes.length})</label>
              <div className="space-y-2">
                {allNotes.map(([pg, note]) => (
                  <div key={pg} className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${Number(pg) === pageIndex ? 'bg-blue-50' : 'border-gray-100 bg-gray-50 hover:bg-blue-50'}`} style={Number(pg) === pageIndex ? { borderColor: color } : {}}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold" style={{ color }}>Trang {Number(pg) + 1}</span>
                      {Number(pg) === pageIndex && <span className="text-xs" style={{ color }}>Đang xem</span>}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
