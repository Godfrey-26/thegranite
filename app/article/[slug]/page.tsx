'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import API_Caller from '@/src/api_caller';
import { getUser } from '@/src/auth';

/* ─── Types ─────────────────────────────────────────────────── */
interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  og_image_url: string;
}

interface ArticleTag {
  id: number;
  name: string;
  slug: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  author_name: string;
  category: ArticleCategory;
  tags: ArticleTag[];
  is_breaking: boolean;
  is_premium: boolean;
  is_top_story: boolean;
  is_featured: boolean;
  is_live: boolean;
  needs_banner: boolean;
  image_url: string;
  image_alt: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  body: string;
  image_caption: string;
  image_credit: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  seo_title: string;
  seo_description: string;
  resolved_og_image: string;
  related_articles: string[];
  latest_articles: string[];
  more_from_author: string[];
}

/* ─── Helpers ────────────────────────────────────────────────── */
function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ─── Component ─────────────────────────────────────────────── */
export default function ArticlePage() {
  const params = useParams();
  const [user, setUser] = useState<any | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    let isMounted = true;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await API_Caller('GET', null, `/articles/${params.slug}/`, null);
        const result = data?.article ?? data;
        if (isMounted) setArticle(result);
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to load article.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();
    setUser(getUser());

    return () => { isMounted = false; };
  }, [params.slug]);

  useEffect(() => {
    if (!article) return;
    const access =
      !article.is_premium ||
      user?.subscription?.status === 'active' ||
      user?.role === 'admin';
    setHasAccess(access);
  }, [article, user]);

  if (loading) {
    return <div className="px-3 pt-10 text-gray-500 text-sm">Loading article...</div>;
  }

  if (error) {
    return <div className="px-3 pt-10 text-red-500 text-sm">Error: {error}</div>;
  }

  if (!article) {
    return <div className="px-3 pt-10 text-gray-500 text-sm">Article not found.</div>;
  }

  return (
    <div className="article-page max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        {article.category?.name && (
          <>
            <Link href={`/category/${article.category.slug}`} className="hover:underline capitalize">
              {article.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-400 truncate">{article.title}</span>
      </nav>

      <article>

        {/* ── Badges ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.is_breaking && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Breaking
            </span>
          )}
          {article.is_top_story && (
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Top Story
            </span>
          )}
          {article.is_featured && (
            <span className="bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Featured
            </span>
          )}
          {article.is_premium && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Premium
            </span>
          )}
        </div>

        {/* ── Header ── */}
        <header className="mb-6">
          <h1 className="card-title text-left text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          <div className="time-line flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-xs pb-4 border-b border-gray-200">
            {article.author_name && (
              <span className="font-medium text-gray-700">By {article.author_name}</span>
            )}
            {article.category?.name && (
              <>
                <span>|</span>
                <Link href={`/category/${article.category.slug}`} className="location hover:underline capitalize">
                  {article.category.name}
                </Link>
              </>
            )}
            {article.published_at && (
              <>
                <span>|</span>
                <time className="time" dateTime={article.published_at}>
                  {timeAgo(article.published_at)}
                </time>
              </>
            )}
            {article.view_count != null && (
              <>
                <span>|</span>
                <span>{article.view_count.toLocaleString()} views</span>
              </>
            )}
          </div>

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* ── Hero Image ── */}
        {article.image_url && (
          <figure className="mb-8">
            <Image
              src={article.image_url}
              alt={article.image_alt || article.title}
              width={900}
              height={500}
              className="w-full h-auto object-cover rounded"
              priority
            />
            {(article.image_caption || article.image_credit) && (
              <figcaption className="card-briefing text-xs text-gray-500 mt-2 px-1">
                {article.image_caption}
                {article.image_caption && article.image_credit && ' — '}
                {article.image_credit && <span className="italic">{article.image_credit}</span>}
              </figcaption>
            )}
          </figure>
        )}

        {/* ── Body or Paywall ── */}
        {hasAccess ? (
          <div className="article-body">
            {article.excerpt && (
              <p className="card-briefing text-lg text-gray-700 font-medium leading-relaxed mb-6 pb-6 border-b border-gray-100">
                {article.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {article.updated_at && article.updated_at !== article.published_at && (
              <p className="time-line text-xs text-gray-400 mt-10 pt-4 border-t border-gray-100">
                Last updated: {timeAgo(article.updated_at)}
              </p>
            )}
          </div>
        ) : (
          <>
            {article.excerpt && (
              <p className="card-briefing text-lg text-gray-700 font-medium leading-relaxed mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="bg-gray-100 rounded-lg p-8 text-center mt-4">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-4 inline-block">
                Premium
              </span>
              <h2 className="card-title text-2xl font-bold mb-3">This is a Premium Article</h2>
              <p className="card-briefing text-gray-600 mb-6 max-w-sm mx-auto">
                Subscribe to read the full story and get unlimited access to all premium content.
              </p>
              {user ? (
                <Link
                  href="/subscribe"
                  className="inline-block bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upgrade to Premium
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/auth/signin"
                    className="inline-block bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/subscribe"
                    className="inline-block border border-indigo-600 text-indigo-600 text-sm font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Subscribe
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

      </article>
    </div>
  );
}