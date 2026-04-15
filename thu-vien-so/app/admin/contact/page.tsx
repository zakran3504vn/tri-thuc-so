'use client';
import { useState, useEffect } from 'react';
import { getContactInfo, createContactInfo, updateContactInfo, ContactInfo } from '@/lib/api';

export default function AdminContact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: null,
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    map_iframe: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      if (contactInfo.id) {
        await updateContactInfo(contactInfo.id, contactInfo);
        setMessage('Cập nhật thông tin liên hệ thành công!');
      } else {
        const data = await createContactInfo(contactInfo);
        setContactInfo(data);
        setMessage('Tạo thông tin liên hệ thành công!');
      }
    } catch (error: any) {
      setMessage(error.message || 'Lỗi khi lưu thông tin liên hệ');
    } finally {
      setSaving(false);
    }
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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-3xl">
        <h3 className="font-bold text-gray-900 mb-6">Quản lý thông tin liên hệ</h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
            <textarea
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nhập địa chỉ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Điện thoại</label>
            <input
              type="text"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giờ làm việc</label>
            <textarea
              value={contactInfo.working_hours}
              onChange={(e) => setContactInfo({ ...contactInfo, working_hours: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nhập giờ làm việc..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Map (iframe)</label>
            <textarea
              value={contactInfo.map_iframe}
              onChange={(e) => setContactInfo({ ...contactInfo, map_iframe: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
              placeholder="Dán iframe Google Map vào đây..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Ví dụ: &lt;iframe src=&quot;https://www.google.com/maps/embed?...&quot;&gt;&lt;/iframe&gt;
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
