'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import API_Caller from "../src/api_caller";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  premium: boolean;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API_Caller('GET', null, '/articles', null)
      .then((res) => {
        setArticles(res.articles || []);
      })
      .catch(() => {
        setError('Unable to load articles. Check your backend API URL in .env.local.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold mb-6">Latest Articles</h1>

      {loading ? (
        <p className="text-gray-600">Loading articles...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-600">No articles available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-[0.2em]">
                  {article.category}
                </span>
                {article.premium && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Premium
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h2>
              <p className="text-gray-600 leading-relaxed">{article.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
