import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import API_Caller from "../src/api_caller";

function truncate(text: string, length: number) {
  return text && text.length > length ? text.slice(0, length) + "..." : text || "";
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "Recent";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url?: string;
  image_alt?: string;
  published_at: string;
  category?: { name: string };
}

export default function BreakingNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakingNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API_Caller(
        "GET",
        null,
        "/articles/?is_breaking=true&page_size=4",
        null
      );

      const results: Article[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setArticles(results);
    } catch (err: any) {
      console.error("BreakingNews fetch error:", err);
      setError(err?.message || "Failed to fetch breaking news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreakingNews();
  }, [fetchBreakingNews]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-3 pt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 pt-6 text-red-500 flex flex-col gap-2">
        <p>Error: {error}</p>
        <button
          onClick={fetchBreakingNews}
          className="text-sm underline text-blue-500 w-fit"
        >
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return <div className="px-3 pt-6">No breaking news at the moment.</div>;
  }

  // Layout: [0,1] = two small left cards | [2] = large center card | [3,4,5] = text-only right cards
  const leftCards = articles.slice(0, 2);
  const featuredCard = articles[2] ?? articles[0]; // fallback to first if less than 3
  const textCards = articles.slice(3);

  return (
    <div className="breaking-news grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* ── Column 1: Two small cards ── */}
      <div className="flex flex-col divide-y divide-gray-300">
        {leftCards.map((article) => (
          <div key={article.id} className="card px-3 py-4">
            {article.image_url && (
              <div className="mb-2">
                <Image
                  src={article.image_url}
                  alt={article.image_alt || article.title}
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
            )}
            <Link
              href={`/articles/${article.slug}`}
              className="card-title text-left text-base font-semibold hover:underline"
            >
              {article.title}
            </Link>
            <p className="card-briefing text-left text-xs text-gray-600 mt-1">
              {truncate(article.excerpt, 80)}
            </p>
            <div className="time-line pt-2 text-gray-500 text-xs">
              <span>{timeAgo(article.published_at)}</span>
              {article.category?.name && (
                <span className="ml-2 pl-2 border-l border-gray-400">
                  {article.category.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Column 2: Featured large card ── */}
      <div className="card px-3 py-4">
        {featuredCard.image_url && (
          <div className="mb-3">
            <Image
              src={featuredCard.image_url}
              alt={featuredCard.image_alt || featuredCard.title}
              width={620}
              height={400}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        )}
        <Link
          href={`/articles/${featuredCard.slug}`}
          className="card-title text-left text-xl font-bold hover:underline"
        >
          {featuredCard.title}
        </Link>
        <p className="card-briefing text-left text-sm text-gray-600 mt-2">
          {truncate(featuredCard.excerpt, 250)}
        </p>
        <div className="time-line pt-4 text-gray-500 text-xs">
          <span>{timeAgo(featuredCard.published_at)}</span>
          {featuredCard.category?.name && (
            <span className="ml-2 pl-2 border-l border-gray-400">
              {featuredCard.category.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Column 3: Text-only list cards ── */}
        {textCards.length > 0 && (
          <div className="flex flex-col divide-y divide-gray-300">
            {textCards.map((article) => (
              <div key={article.id} className="card-context py-4 px-3">
                <Link
                  href={`/articles/${article.slug}`}
                  className="card-title text-left text-base font-semibold hover:underline"
                >
                  {article.title}
                </Link>
                <p className="card-briefing text-left text-sm text-gray-600 mt-1">
                  {truncate(article.excerpt, 150)}
                </p>
                <div className="time-line pt-3 text-gray-500 text-xs">
                  <span>{timeAgo(article.published_at)}</span>
                  {article.category?.name && (
                    <span className="ml-2 pl-2 border-l border-gray-400">
                      {article.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

    </div>
  );
}