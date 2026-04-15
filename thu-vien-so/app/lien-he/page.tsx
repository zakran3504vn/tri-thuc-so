'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContactInfo, ContactInfo, createContactSubmission } from '@/lib/api';

export default function LienHePage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: null,
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    map_iframe: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setSubmitting(true);
      setSubmitMessage('');

      const data = {
        full_name: formData.get('ho_ten') as string,
        email: formData.get('email') as string,
        phone: formData.get('so_dien_thoai') as string,
        subject: formData.get('chu_de') as string,
        message: formData.get('noi_dung') as string,
      };

      await createContactSubmission(data);
      setSubmitMessage('Gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
      form.reset();
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-700 to-green-600 py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">Liên hệ</h1>
          <p className="text-blue-100 text-lg">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
            {submitMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${submitMessage.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {submitMessage}
              </div>
            )}
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input name="ho_ten" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input name="so_dien_thoai" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0901 234 567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                <input name="chu_de" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tiêu đề tin nhắn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea name="noi_dung" required maxLength={500} rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Nội dung tin nhắn..."></textarea>
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {contactInfo.address && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0"><i className="ri-map-pin-line text-white"></i></div>
                      <div><div className="text-xs text-gray-500 font-medium">Địa chỉ</div><div className="text-gray-800 font-semibold text-sm mt-0.5">{contactInfo.address}</div></div>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0"><i className="ri-phone-line text-white"></i></div>
                      <div><div className="text-xs text-gray-500 font-medium">Điện thoại</div><div className="text-gray-800 font-semibold text-sm mt-0.5">{contactInfo.phone}</div></div>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0"><i className="ri-mail-line text-white"></i></div>
                      <div><div className="text-xs text-gray-500 font-medium">Email</div><div className="text-gray-800 font-semibold text-sm mt-0.5">{contactInfo.email}</div></div>
                    </div>
                  )}
                  {contactInfo.working_hours && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0"><i className="ri-time-line text-white"></i></div>
                      <div><div className="text-xs text-gray-500 font-medium">Giờ làm việc</div><div className="text-gray-800 font-semibold text-sm mt-0.5">{contactInfo.working_hours}</div></div>
                    </div>
                  )}
                </>
              )}
            </div>
            {contactInfo.map_iframe && (
              <div className="rounded-2xl overflow-hidden h-64 shadow-sm" dangerouslySetInnerHTML={{ __html: contactInfo.map_iframe }} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
