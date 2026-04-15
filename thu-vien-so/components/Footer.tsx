import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo" width={44} height={44} className="rounded-xl" />
              <span className="font-bold text-xl">Thư Viện Số</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">Mang tri thức số ươm mầm tương lai. Nền tảng học tập số hiện đại dành cho học sinh và giáo viên.</p>
            <div className="flex gap-3 mt-4">
              {['ri-facebook-fill','ri-youtube-fill','ri-tiktok-fill','ri-mail-line'].map((icon) => (
                <a key={icon} href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer">
                  <i className={`${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 uppercase text-xs tracking-wider mb-4">Tài nguyên</h4>
            <ul className="space-y-2">
              {[['Môn học','/mon-hoc'],['Truyện đọc','/truyen-doc'],['Sách tham khảo','/sach-tham-khao'],['Hoạt động trải nghiệm','/hoat-dong']].map(([label,href]) => (
                <li key={href}><Link href={href} className="text-blue-100 hover:text-white text-sm transition-colors cursor-pointer">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 uppercase text-xs tracking-wider mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {[['Thông báo','/thong-bao'],['Liên hệ','/lien-he'],['Đăng nhập','/login'],['Quản trị','/admin']].map(([label,href]) => (
                <li key={href}><Link href={href} className="text-blue-100 hover:text-white text-sm transition-colors cursor-pointer">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 uppercase text-xs tracking-wider mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-2"><span className="w-4 h-4 flex items-center justify-center mt-0.5"><i className="ri-map-pin-line text-green-400"></i></span><span>123 Đường Tri Thức, Q.1, TP.HCM</span></li>
              <li className="flex items-center gap-2"><span className="w-4 h-4 flex items-center justify-center"><i className="ri-phone-line text-green-400"></i></span><span>(028) 1234 5678</span></li>
              <li className="flex items-center gap-2"><span className="w-4 h-4 flex items-center justify-center"><i className="ri-mail-line text-green-400"></i></span><span>info@thuvienso.edu.vn</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-blue-300 text-xs">© 2026 Thư Viện Số. Bảo lưu mọi quyền.</p>
          <p className="text-blue-300 text-xs">Mang tri thức số ươm mầm tương lai</p>
        </div>
      </div>
    </footer>
  );
}
