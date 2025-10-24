'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSiteSettings, NavigationItem } from '@/hooks/useSiteSettings';

// Fallback navigation items if CMS data fails to load
const fallbackNavigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  {
    name: 'Industries',
    href: '/industries',
    dropdown: [
      { name: 'Healthcare & Life Sciences', href: '/industries/healthcare' },
      { name: 'Financial Services', href: '/industries/financial' },
      { name: 'Manufacturing', href: '/industries/manufacturing' },
      { name: 'Retail & E-commerce', href: '/industries/retail' },
      { name: 'Technology & Software', href: '/industries/technology' },
      { name: 'Energy & Utilities', href: '/industries/energy' },
      { name: 'Government & Public Sector', href: '/industries/government' },
    ]
  },
  { name: 'Research Insights', href: '/research-insights' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { settings, loading } = useSiteSettings();

  // Use CMS navigation items, or fallback only if loading failed AND no settings
  const navigation = settings?.navigation_items && settings.navigation_items.length > 0
    ? settings.navigation_items
    : (!loading ? fallbackNavigation : []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Resnovate.ai</span>
            <div className="text-2xl font-bold text-blue-900">
              Resnovate<span className="text-amber-500">.ai</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-600"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {loading ? (
            // Loading skeleton - reserve space to prevent layout shift
            <div className="flex gap-x-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 w-20 bg-slate-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            navigation.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="relative">
                  <button
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    className={`flex items-center text-sm font-semibold leading-6 transition-colors duration-200 ${
                      pathname.startsWith('/industries')
                        ? 'text-blue-900'
                        : 'text-slate-600 hover:text-blue-900'
                    }`}
                  >
                    {item.name}
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-2 w-64 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors duration-200"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-blue-900'
                      : 'text-slate-600 hover:text-blue-900'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/contact"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Resnovate.ai</span>
                <div className="text-2xl font-bold text-blue-900">
                  Resnovate<span className="text-amber-500">.ai</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-slate-500/10">
                <div className="space-y-2 py-6">
                  {loading ? (
                    // Loading skeleton for mobile menu
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    navigation.map((item) => (
                      item.dropdown ? (
                        <div key={item.name} className="space-y-1">
                          <div className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900">
                            {item.name}
                          </div>
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="ml-4 -mx-3 block rounded-lg px-3 py-2 text-sm leading-7 text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors duration-200 ${
                            pathname === item.href
                              ? 'bg-slate-50 text-blue-900'
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))
                  )}
                </div>
                <div className="py-6">
                  <Link
                    href="/contact"
                    className="block rounded-md bg-amber-500 px-4 py-2 text-center text-base font-semibold text-white shadow-sm hover:bg-amber-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}