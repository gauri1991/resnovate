'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  PhotoIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  BookOpenIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import authService from '@/lib/auth';

interface AdminNavItem {
  name: string;
  href: string;
  icon: any;
  children?: AdminNavItem[];
}

const adminNavigation: AdminNavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  {
    name: 'Content',
    href: '/admin/content',
    icon: DocumentTextIcon,
    children: [
      { name: 'Blog Posts', href: '/admin/blog', icon: PencilSquareIcon },
      { name: 'Case Studies', href: '/admin/content/case-studies', icon: BriefcaseIcon },
      { name: 'Services', href: '/admin/content/services', icon: BookOpenIcon },
    ],
  },
  { name: 'Leads', href: '/admin/leads', icon: UsersIcon },
  { name: 'Consultations', href: '/admin/consultations', icon: CalendarIcon },
  { name: 'Marketing', href: '/admin/marketing', icon: MegaphoneIcon },
  { name: 'Media', href: '/admin/media', icon: PhotoIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    // Development mode - bypass authentication
    if (process.env.NODE_ENV === 'development') {
      setUser({ username: 'Admin', email: 'admin@resnovate.ai' });
      setLoading(false);
      return;
    }

    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Admin Navigation */}
            <nav className="hidden md:flex space-x-8">
              {adminNavigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <div className="relative group">
                      <button
                        className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                          isActive(item.href)
                            ? 'text-blue-900 border-b-2 border-blue-900'
                            : 'text-gray-600 hover:text-blue-900'
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      </button>
                      
                      {/* Dropdown */}
                      <div className="absolute left-0 top-full mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                              isActive(child.href)
                                ? 'bg-blue-50 text-blue-900'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
                            }`}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-blue-900 border-b-2 border-blue-900'
                          : 'text-gray-600 hover:text-blue-900'
                      }`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setExpandedItems(prev => prev.includes('mobile') ? [] : ['mobile'])}
                className="text-gray-600 hover:text-blue-900 p-2"
              >
                <DocumentTextIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Admin User Section */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                View Site
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-medium text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'Admin'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {expandedItems.includes('mobile') && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {adminNavigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </div>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform ${
                              expandedItems.includes(item.name) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {expandedItems.includes(item.name) && (
                          <div className="ml-6 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                              >
                                <child.icon className="mr-2 h-4 w-4" />
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}