'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getReferenceBook, ReferenceBook } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function SachThamKhaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<ReferenceBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getReferenceBook(resolvedParams.id);
        setBook(data);
      } catch (err) {
        setError('Không thể tải tài liệu');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-500"></i>
          </div>
          <h3 className="font-bold text-gray-700 text-lg mb-2">Lỗi</h3>
          <p className="text-gray-500 text-sm mb-4">{error || 'Không tìm thấy tài liệu'}</p>
          <Link href="/sach-tham-khao" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const fileUrl = book.file_url.startsWith('http') ? book.file_url : `http://localhost:3001${book.file_url}`;
  const coverUrl = book.cover_image ? (book.cover_image.startsWith('http') ? book.cover_image : `http://localhost:3001${book.cover_image}`) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/sach-tham-khao" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer text-gray-600">
            <i className="ri-arrow-left-line text-lg"></i>
          </Link>
          <div className="flex items-center gap-3">
            {coverUrl && (
              <img src={coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow-sm" />
            )}
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">{book.title}</h1>
              <p className="text-xs text-gray-400">
                {book.author && `${book.author} · `}
                {book.category && `${book.category}`}
              </p>
            </div>
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <i className="ri-download-line"></i>
          Tải xuống
        </a>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
          {book.file_type === 'pdf' || book.file_url?.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title="PDF Viewer"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                <i className="ri-file-text-line text-4xl text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{book.title}</h3>
              <p className="text-gray-500 text-sm mb-4 text-center max-w-md">
                {book.description || 'Không có mô tả'}
              </p>
              {book.author && (
                <p className="text-sm text-gray-400 mb-2">Tác giả: {book.author}</p>
              )}
              {book.number_of_pages && (
                <p className="text-sm text-gray-400 mb-4">Số trang: {book.number_of_pages}</p>
              )}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <i className="ri-download-line"></i>
                Mở tài liệu
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
