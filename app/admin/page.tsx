'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API_Caller from "../src/api_caller";
import { clearToken, getToken, getUser } from '@src/auth';

interface Stats {
  totalUsers: number;
  totalArticles: number;
  totalSubscriptions: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.push('/auth/signin');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await API_Caller('GET', null, '/admin/stats', null);
      setStats(res.stats || res);
    } catch (fetchError) {
      console.error('Failed to fetch stats:', fetchError);
      setError('Unable to load dashboard statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearToken();
    router.push('/auth/signin');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">No statistics available yet.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor site performance, user growth, and subscription metrics.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Total Users</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Total Articles</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{stats.totalArticles}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Active Subscriptions</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{stats.totalSubscriptions}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Revenue</p>
          <p className="mt-3 text-3xl font-bold text-green-600">${stats.revenue}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              Create New Article
            </button>
            <button className="w-full rounded-2xl bg-gray-600 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700">
              Manage Users
            </button>
            <button className="w-full rounded-2xl bg-gray-600 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700">
              View Reports
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <p className="mt-3 text-gray-600">This section can display incoming article approvals, subscription changes, and moderation alerts from the backend.</p>
        </div>
      </div>
    </div>
  );
}
