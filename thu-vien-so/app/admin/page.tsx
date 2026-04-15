'use client';
import { useEffect, useState } from 'react';
import { getAnnouncements, Announcement } from '@/lib/api';

const stats = [
  { label: 'Tổng học sinh', value: '52,340', icon: 'ri-user-line', color: 'from-blue-500 to-blue-600', change: '+12%' },
  { label: 'Bài giảng', value: '1,248', icon: 'ri-video-line', color: 'from-green-500 to-green-600', change: '+8%' },
  { label: 'Đầu sách', value: '524', icon: 'ri-book-2-line', color: 'from-teal-500 to-teal-600', change: '+5%' },
  { label: 'Lượt truy cập', value: '128K', icon: 'ri-eye-line', color: 'from-indigo-500 to-indigo-600', change: '+23%' },
];

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.slice(0, 5)); // Lấy 5 thông báo gần nhất
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${s.color} rounded-xl`}>
                <i className={`${s.icon} text-white text-lg`}></i>
              </div>
              <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className="text-2xl font-extrabold text-gray-800">{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Thông báo gần đây</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải...</p>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có thông báo nào</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.announcement_type === 'urgent' ? 'bg-red-100 text-red-700' :
                      item.announcement_type === 'event' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.announcement_type === 'urgent' ? 'Khẩn cấp' :
                       item.announcement_type === 'event' ? 'Sự kiện' : 'Thông báo chung'}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(item.publish_date)}</span>
                  </div>
                  <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
