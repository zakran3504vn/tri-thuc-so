'use client';
import { useState, useEffect } from 'react';
import { getContactSubmissions, markContactSubmissionAsRead, deleteContactSubmission, ContactSubmission } from '@/lib/api';

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getContactSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch contact submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markContactSubmissionAsRead(id);
      const updatedSubmissions = await getContactSubmissions();
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      return;
    }

    try {
      await deleteContactSubmission(id);
      const updatedSubmissions = await getContactSubmissions();
      setSubmissions(updatedSubmissions);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Failed to delete submission:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6">Tin nhắn liên hệ</h3>
        
        {submissions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có tin nhắn nào</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-start gap-4 py-4 px-4 rounded-xl border transition-all cursor-pointer ${item.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                onClick={() => setSelectedSubmission(item)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.is_read ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white'}`}>
                      {item.is_read ? 'Đã đọc' : 'Mới'}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                  </div>
                  <div className="font-medium text-gray-800 text-sm">{item.full_name}</div>
                  <div className="text-xs text-gray-500 mb-1">{item.email} {item.phone && `• ${item.phone}`}</div>
                  <div className="font-semibold text-gray-700 text-sm">{item.subject}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.message}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!item.is_read && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item.id); }}
                      className="w-7 h-7 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 cursor-pointer"
                      title="Đánh dấu đã đọc"
                    >
                      <i className="ri-check-line text-xs"></i>
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer"
                    title="Xóa"
                  >
                    <i className="ri-delete-bin-line text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Chi tiết tin nhắn</h3>
            <button 
              onClick={() => setSelectedSubmission(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Họ và tên</label>
              <div className="text-gray-800 font-medium">{selectedSubmission.full_name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Email</label>
                <div className="text-gray-800">{selectedSubmission.email || '-'}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Số điện thoại</label>
                <div className="text-gray-800">{selectedSubmission.phone || '-'}</div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Chủ đề</label>
              <div className="text-gray-800 font-medium">{selectedSubmission.subject}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Nội dung</label>
              <div className="text-gray-800 bg-gray-50 p-3 rounded-xl mt-1">{selectedSubmission.message}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Thời gian gửi</label>
              <div className="text-gray-800">{formatDate(selectedSubmission.created_at)}</div>
            </div>
            {!selectedSubmission.is_read && (
              <button 
                onClick={() => handleMarkAsRead(selectedSubmission.id)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
