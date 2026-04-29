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
    window.location.href = `/search