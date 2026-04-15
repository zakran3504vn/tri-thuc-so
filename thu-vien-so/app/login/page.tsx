'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login'|'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập username và password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login(username, password);
      
      // Lưu token và user info vào localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Chuyển hướng dựa trên role
      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=beautiful%20digital%20library%20education%20concept%20glowing%20books%20floating%20blue%20green%20gradient%20background%20knowledge%20learning%20modern%20inspiring&width=800&height=1000&seq=login001&orientation=portrait" alt="Login visual" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-green-800/60 flex flex-col items-center justify-center p-12 text-center">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo" width={56} height={56} className="rounded-2xl" />
            <span className="text-white font-extrabold text-2xl">Thư Viện Số</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-4">Mang tri thức số<br/>ươm mầm tương lai</h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">Nền tảng học tập số với hơn 1,200 bài giảng, 500 đầu sách và hàng nghìn bài tập phong phú.</p>
          <div className="flex gap-6 mt-10">
            {[['1,200+','Bài giảng'],['500+','Đầu sách'],['50K+','Học sinh']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-extrabold text-white">{v}</div>
                <div className="text-blue-300 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo" width={40} height={40} className="rounded-xl" />
            <span className="font-extrabold text-blue-800 text-xl">Thư Viện Số</span>
          </div>

          <div className="flex bg-white rounded-2xl p-1 mb-8 shadow-sm border border-gray-100">
            {(['login','register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${tab === t ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Chào mừng trở lại!</h2>
              <p className="text-gray-500 text-sm mb-6">Đăng nhập để tiếp tục học tập</p>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"><i className="ri-user-line text-sm"></i></span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="username" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"><i className="ri-lock-line text-sm"></i></span>
                    <input 
                      type={showPass ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 cursor-pointer">
                      <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline cursor-pointer">Quên mật khẩu?</a>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
              <div className="mt-4 text-center text-xs text-gray-400">
                <p>Admin demo: admin / password123</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Tạo tài khoản mới</h2>
              <p className="text-gray-500 text-sm mb-6">Tham gia cộng đồng học tập ngay hôm nay</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nguyễn" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Văn A" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                  <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tối thiểu 8 ký tự" />
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap">Đăng ký ngay</button>
              </div>
            </div>
          )}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/" className="text-blue-600 hover:underline cursor-pointer">← Quay về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
