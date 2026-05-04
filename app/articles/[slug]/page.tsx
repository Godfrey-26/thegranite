'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import API_Caller from "../../src/api_caller";
import { getUser } from "../../src/auth";

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
    return (
      <div className="w-full max-w-4xl mx-auto px-4 pt-10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="aspect-video bg-gray-200 rounded w-full" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 pt-10">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 pt-10">
        <p className="text-gray-500 text-sm">Article not found.</p>
      </div>
    );
  }

  return (
    /*
      KEY FIX: w-full + overflow-hidden on the outermost wrapper
      ensures nothing escapes the container on any screen size.
      max-w-4xl + mx-auto centers it on large screens.
      px-4 sm:px-6 lg:px-8 gives breathing room on each breakpoint.
    */
    <div className="w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* Breadcrumb — truncates on small screens */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 overflow-hidden">
          <Link href="/" className="hover:underline shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          {article.category?.name && (
            <>
              <Link
                href={`/category/${article.category.slug}`}
                className="hover:underline capitalize shrink-0"
              >
                {article.category.name}
              </Link>
              <span className="shrink-0">/</span>
            </>
          )}
          {/* min-w-0 allows truncate to work inside flex */}
          <span className="text-gray-400 truncate min-w-0">{article.title}</span>
        </nav>

        <article className="w-full">

          {/* Badges */}
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

          {/* Title — responsive size, breaks words if needed */}
          <header className="mb-6 w-full">
            <h1 className="
              w-full break-words
              text-2xl leading-snug
              sm:text-3xl sm:leading-tight
              lg:text-4xl lg:leading-tight
              font-bold mb-4 text-gray-900
            ">
              {article.title}
            </h1>

            {/* Meta row — wraps gracefully on small screens */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500 text-xs pb-4 border-b border-gray-200">
              {article.author_name && (
                <span className="font-medium text-gray-700">By {article.author_name}</span>
              )}
              {article.category?.name && (
                <>
                  <span>·</span>
                  <Link
                    href={`/category/${article.category.slug}`}
                    className="hover:underline capitalize"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
              {article.published_at && (
                <>
                  <span>·</span>
                  <time dateTime={article.published_at}>
                    {timeAgo(article.published_at)}
                  </time>
                </>
              )}
              {article.view_count != null && (
                <>
                  <span>·</span>
                  <span>{article.view_count.toLocaleString()} views</span>
                </>
              )}
            </div>

            {/* Tags */}
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

          {/* Hero Image — aspect ratio preserved on all screens */}
          {article.image_url && (
            <figure className="w-full mb-6 sm:mb-8">
              {/*
                aspect-video = 16:9 always.
                relative + overflow-hidden = image never bleeds outside.
                fill + object-cover = image scales to fit without distortion.
              */}
              <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                <Image
                  src={article.image_url}
                  alt={article.image_alt || article.title}
                  contain
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 800px"
                  className="object-cover"
                />
              </div>
              {(article.image_caption || article.image_credit) && (
                <figcaption className="text-xs text-gray-500 mt-2 px-1 break-words">
                  {article.image_caption}
                  {article.image_caption && article.image_credit && ' — '}
                  {article.image_credit && (
                    <span className="italic">{article.image_credit}</span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {/* Body or Paywall */}
          {hasAccess ? (
            <div className="w-full">
              {article.excerpt && (
                <p className="
                  text-base sm:text-lg
                  text-gray-700 font-medium leading-relaxed
                  mb-6 pb-6 border-b border-gray-100
                  break-words
                ">
                  {article.excerpt}
                </p>
              )}

              {/*
                prose handles typography.
                All media inside body HTML is forced responsive:
                - img: full width, auto height, never overflows
                - iframe/video: 16:9 aspect ratio, full width
                - tables: scrollable horizontally on small screens
                - pre/code: scrollable horizontally, never overflows
              */}
              <div
                className="
                  w-full
                  prose prose-sm sm:prose-base lg:prose-lg
                  max-w-none
                  text-gray-800 leading-relaxed
                  break-words

                  [&_img]:w-full
                  [&_img]:h-auto
                  [&_img]:rounded-lg
                  [&_img]:my-4
                  [&_img]:object-cover
                  [&_img]:block

                  [&_figure]:w-full
                  [&_figure]:my-4
                  [&_figure_img]:w-full
                  [&_figure_img]:h-auto

                  [&_iframe]:w-full
                  [&_iframe]:aspect-video
                  [&_iframe]:rounded-lg
                  [&_iframe]:my-4

                  [&_video]:w-full
                  [&_video]:h-auto
                  [&_video]:rounded-lg
                  [&_video]:my-4

                  [&_table]:w-full
                  [&_table]:block
                  [&_table]:overflow-x-auto

                  [&_pre]:overflow-x-auto
                  [&_pre]:max-w-full

                  [&_p]:break-words
                  [&_h1]:break-words
                  [&_h2]:break-words
                  [&_h3]:break-words
                "
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {article.updated_at && article.updated_at !== article.published_at && (
                <p className="text-xs text-gray-400 mt-10 pt-4 border-t border-gray-100">
                  Last updated: {timeAgo(article.updated_at)}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full">
              {article.excerpt && (
                <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-6 break-words">
                  {article.excerpt}
                </p>
              )}
              <div className="bg-gray-100 rounded-lg p-6 sm:p-8 text-center mt-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-4 inline-block">
                  Premium
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                  This is a Premium Article
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-sm mx-auto">
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
            </div>
          )}

        </article>
      </div>
    </div>
  );
}