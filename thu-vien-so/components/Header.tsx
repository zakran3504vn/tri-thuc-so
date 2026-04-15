'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/mon-hoc', label: 'Môn học' },
  { href: '/hoat-dong', label: 'Hoạt động' },
  { href: '/truyen-doc', label: 'Truyện đọc' },
  { href: '/sach-tham-khao', label: 'Sách tham khảo' },
  { href: '/thong-bao', label: 'Thông báo' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo Thư viện số" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-lg text-blue-800 whitespace-nowrap hidden sm:block">Thư Viện Số</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-600">
                <i className="ri-search-line text-lg"></i>
              </button>
              <Link href="/login" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap cursor-pointer">
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line text-sm"></i></span>
                Đăng nhập
              </Link>
              <button onClick={() => setMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <i className="ri-menu-3-line text-xl text-gray-700"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <i className="ri-search-line text-gray-400 text-xl"></i>
              </div>
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Tìm kiếm sách, truyện, môn học..."
                className="flex-1 py-4 text-gray-800 text-base outline-none bg-transparent"
              />
              <button type="submit" className="m-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-xl text-sm cursor-pointer whitespace-nowrap">Tìm</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer mr-1">
                <i className="ri-close-line text-xl"></i>
              </button>
            </form>
            <div className="mt-3 flex gap-2 flex-wrap">
              {['Toán học', 'Dế Mèn', 'Tiếng Anh', 'Lịch sử', 'Hoàng Tử Bé'].map(s => (
                <button key={s} onClick={() => { setSearchVal(s); router.push(`/tim-kiem?q=${encodeURIComponent(s)}`); setSearchOpen(false); }} className="px-3 py-1.5 bg-white/90 text-gray-600 text-xs rounded-full hover:bg-white transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className={`absolute top-0 right-0 h-full w-2/3 bg-white shadow-2xl flex flex-col transition-transform duration-300`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo" width={36} height={36} className="rounded-lg" />
                <span className="font-bold text-blue-800">Thư Viện Số</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-xl cursor-pointer">
                <span className="w-5 h-5 flex items-center justify-center"><i className="ri-user-line"></i></span>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
