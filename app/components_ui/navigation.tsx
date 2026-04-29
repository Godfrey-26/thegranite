'use client';

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setRecentSearches(getSearchHistory());
    setUser(getUser());
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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

        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
          </button>

          <Link href="/" className="shrink-0 text-xl font-bold text-slate-900 sm:text-2xl">
            The Granite
          </Link>

          <form
            onSubmit={handleSearch}
            className="relative hidden flex-1 max-w-2xl sm:mx-4 md:flex"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headlines, topics or authors"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </form>

          <div className="flex shrink-0 items-center gap-2">

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 md:hidden"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 text-slate-700" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <span className="hidden md:inline">{(user.name as string) || (user.email as string) || 'Member'}</span>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

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