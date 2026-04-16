'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

interface SubMenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface MenuGroup {
  id: string;
  title: string;
  icon: string;
  items: SubMenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    id: 'dashboard',
    title: 'Tổng quan',
    icon: 'ri-dashboard-line',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin' }],
  },
  {
    id: 'home',
    title: 'Trang chủ',
    icon: 'ri-home-4-line',
    items: [
      { id: 'banners', label: 'Quản lý Banners', icon: 'ri-image-line', path: '/admin/banners' },
      { id: 'stats', label: 'Quản lý Thống kê', icon: 'ri-bar-chart-line', path: '/admin/stats' },
      { id: 'home-content', label: 'Nội dung trang chủ', icon: 'ri-home-4-line', path: '/admin/home' },
    ],
  },
  {
    id: 'subjects',
    title: 'Môn học',
    icon: 'ri-graduation-cap-line',
    items: [{ id: 'subjects', label: 'Quản lý môn học', icon: 'ri-graduation-cap-line', path: '/admin/subjects' }],
  },
  {
    id: 'activities',
    title: 'Hoạt động',
    icon: 'ri-calendar-event-line',
    items: [
      { id: 'users', label: 'Người dùng', icon: 'ri-team-line', path: '/admin/users' },
      { id: 'activities-list', label: 'Hoạt động', icon: 'ri-calendar-event-line', path: '/admin/activities' },
    ],
  },
  {
    id: 'stories',
    title: 'Truyện đọc',
    icon: 'ri-book-open-line',
    items: [{ id: 'stories', label: 'Quản lý truyện', icon: 'ri-book-open-line', path: '/admin/stories' }],
  },
  {
    id: 'books',
    title: 'Sách tham khảo',
    icon: 'ri-book-2-line',
    items: [
      { id: 'books-management', label: 'Quản lý sách', icon: 'ri-book-2-line', path: '/admin/books' },
      { id: 'reference-books', label: 'Sách tham khảo', icon: 'ri-file-list-3-line', path: '/admin/reference-books' },
    ],
  },
  {
    id: 'announcements',
    title: 'Thông báo',
    icon: 'ri-article-line',
    items: [
      { id: 'posts', label: 'Quản lý thông báo', icon: 'ri-article-line', path: '/admin/posts' },
      { id: 'announcement-categories', label: 'Quản lý danh mục', icon: 'ri-folder-line', path: '/admin/announcement-categories' },
    ],
  },
  {
    id: 'contact',
    title: 'Liên hệ',
    icon: 'ri-phone-line',
    items: [
      { id: 'contact-info', label: 'Thông tin liên hệ', icon: 'ri-phone-line', path: '/admin/contact' },
      { id: 'contact-messages', label: 'Tin nhắn liên hệ', icon: 'ri-message-3-line', path: '/admin/contact-submissions' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userData = await getCurrentUser(token);
        if (userData.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

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

  const findActiveItem = () => {
    for (const group of menuGroups) {
      const item = group.items.find(item => pathname === item.path);
      if (item) {
        return { groupId: group.id, itemId: item.id, label: item.label };
      }
    }
    return { groupId: 'dashboard', itemId: 'dashboard', label: 'Tổng quan' };
  };

  const { groupId: activeGroupId, label: activeLabel } = findActiveItem();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center gap-3 p-4 border-b border-white/10 h-16">
          <Image src="https://public.readdy.ai/ai/img_res/5c89a6d6-909a-40e6-978f-e8b034f7860d.png" alt="Logo" width={36} height={36} className="rounded-xl flex-shrink-0" />
          {sidebarOpen && <span className="font-bold text-sm whitespace-nowrap">Thư Viện Số</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuGroups.map(group => (
            <div key={group.id} className="mb-1">
              {group.items.length === 1 ? (
                // Single item - no dropdown
                <Link 
                  href={group.items[0].path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeGroupId === group.id ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${group.icon} text-base`}></i>
                  </span>
                  {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{group.title}</span>}
                </Link>
              ) : (
                // Multiple items - dropdown
                <div>
                  <button
                    onClick={() => sidebarOpen && toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeGroupId === group.id ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className={`${group.icon} text-base`}></i>
                      </span>
                      {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{group.title}</span>}
                    </div>
                    {sidebarOpen && (
                      <i className={`ri-arrow-down-s-line text-sm transition-transform ${expandedGroups.has(group.id) ? 'rotate-180' : ''}`}></i>
                    )}
                  </button>
                  {sidebarOpen && expandedGroups.has(group.id) && (
                    <div className="mt-1 ml-4 pl-3 border-l border-white/20 space-y-1">
                      {group.items.map(item => (
                        <Link
                          key={item.id}
                          href={item.path}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm ${pathname === item.path ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                        >
                          <i className={`${item.icon} text-sm`}></i>
                          <span className="whitespace-nowrap">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer`}>
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-home-line text-base"></i></span>
            {sidebarOpen && <span className="text-sm whitespace-nowrap">Về trang chủ</span>}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className="ri-menu-line text-gray-600"></i>
            </button>
            <h1 className="font-bold text-gray-800">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer relative">
              <i className="ri-notification-3-line text-gray-600"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-gray-700 block">{user?.full_name || 'Admin'}</span>
                <span className="text-xs text-gray-400">Đăng xuất</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
