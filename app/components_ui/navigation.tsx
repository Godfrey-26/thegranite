'use client';

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { clearToken, getSearchHistory, saveSearchQuery, getUser } from "../src/auth";

const staticNav = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'news', label: 'News', href: '/articles?category=news' },
  { key: 'sport', label: 'Sport', href: '/articles?category=sport' },
  { key: 'business', label: 'Business', href: '/articles?category=business' },
  { key: 'entertainment', label: 'Entertainment', href: '/articles?category=entertainment' }
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setRecentSearches(getSearchHistory());
    setUser(getUser());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    saveSearchQuery(trimmed);
    window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
  };

  const handleSignOut = () => {
    clearToken();
    window.location.href = '/auth/signin';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top row */}
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">

          {/* Logo */}
          <Link href="/" className="shrink-0 text-xl font-bold text-slate-900 sm:text-2xl">
            The Granite
          </Link>

          {/* Search — desktop inline */}
          <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-2xl mx-4 md:flex">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headlines, topics or authors"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </form>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Search icon — mobile only */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 md:hidden"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 text-slate-700" />
            </button>

            {/* Auth — desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <span className="hidden md:inline">{(user.name as string) || (user.email as string) || 'Member'}</span>
                  <button onClick={handleSignOut} className="rounded-full bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger toggle — mobile, with dropdown */}
            <div className="relative lg:hidden" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
              </button>

              {/* Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl">

                  {/* Nav links */}
                  <div className="px-2 py-3">
                    <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Browse</p>
                    {staticNav.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="border-t border-slate-100 px-4 py-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Recent</p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.slice(0, 4).map((query) => (
                          <Link
                            key={query}
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                          >
                            {query}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auth — mobile only */}
                  <div className="border-t border-slate-100 px-4 py-3 sm:hidden">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {(user.name as string) || (user.email as string) || 'Member'}
                        </p>
                        <button
                          onClick={handleSignOut}
                          className="w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          Sign out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/auth/signin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full rounded-full border border-slate-300 px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable search — mobile only */}
        {isSearchOpen && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, topics or authors"
                autoFocus
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </form>
          </div>
        )}

        {/* Desktop nav bar */}
        <nav className="hidden lg:flex flex-wrap items-center gap-1 pb-3 text-sm font-medium text-slate-700">
          {staticNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-full px-4 py-2 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          {recentSearches.length > 0 && (
            <div className="ml-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Recent:</span>
              {recentSearches.slice(0, 4).map((query) => (
                <Link
                  key={query}
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100"
                >
                  {query}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}