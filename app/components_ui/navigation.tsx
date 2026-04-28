'use client';

import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setRecentSearches(getSearchHistory());
    setUser(getUser());
  }, []);

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
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            The Granite
          </Link>

          <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] max-w-2xl">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headlines, topics or authors"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </form>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                <span>{(user.name as string) || (user.email as string) || 'Member'}</span>
                <button onClick={handleSignOut} className="rounded-full bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
          {staticNav.map((item) => (
            <Link key={item.key} href={item.href} className="rounded-full px-4 py-2 hover:bg-slate-100 hover:text-slate-900">
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
