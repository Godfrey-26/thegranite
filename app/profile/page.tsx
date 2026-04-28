'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearToken, getToken, getUser } from '../src/auth';

interface User {
  name?: string;
  email?: string;
  role?: string;
  subscription?: { status: string };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    setUser(getUser());
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    clearToken();
    router.push('/');
  };

  if (loading) {
    return <div className="text-center py-12">Checking profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span>{' '}
            {`${user?.name || user?.email || 'Unknown'}`}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{' '}
            {`${user?.email && typeof user.email === 'string' ? user.email : 'Not provided'}`}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{' '}
            {`${user?.role && typeof user.role === 'string' ? user.role : 'reader'}`}
          </p>
          <p>
            <span className="font-semibold">Token stored:</span>{' '}
            {getToken() ? 'Yes' : 'No'}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Manage subscription
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
