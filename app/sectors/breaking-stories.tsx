import { useEffect, useState } from "react";
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

export default function BreakingNews() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBreakingNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await API_Caller("GET", null, "/articles/?is_breaking=true&page_size=6", null);

        // Handle paginated response shape: { results: [...] }
        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        if (isMounted) setArticles(results);
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to fetch breaking news");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBreakingNews();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="px-3 pt-6">Loading breaking news...</div>;
  if (error) return <div className="px-3 pt-6 text-red-500">Error: {error}</div>;
  if (articles.length === 0) return <div className="px-3 pt-6">No breaking news at the moment.</div>;

  const [featured, second, third, ...rest] = articles;

  return (
    <div className="breaking-news grid-group-main">

      {/* ── Top row: two small cards ── */}
      <div className="grid-group-main-item pt-6 divide-y divide-gray-500">

        {[featured, second].filter(Boolean).map((article) => (
          <div key={article.id} className="card px-3 pb-6 mb-3">
            {article.image_url && (
              <div className="card-image">
                <Image
                  src={article.image_url}
                  alt={article.image_alt || article.title}
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="card-context">
              <p className="px-3">
                <Link href={`/articles/${article.slug}`} className="card-title text-left text-base">
                  {article.title}
                </Link>
              </p>
              <p className="card-briefing px-3 text-left text-xs">
                {truncate(article.excerpt, 80)}
              </p>
              <div className="time-line px-3 pt-3 pb-2 text-gray-500 text-xs">
                <span className="time pr-4">{timeAgo(article.published_at)}</span>
                {article.category?.name && (
                  <> | <span className="location pl-4">{article.category.name}</span></>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* ── Featured large card ── */}
      {third && (
        <div className="card px-3 pt-6 grid-group-main-item">
          {third.image_url && (
            <div className="card-image px-3">
              <Image
                src={third.image_url}
                alt={third.image_alt || third.title}
                width={620}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div className="card-context px-3">
            <p className="px-3">
              <Link href={`/articles/${third.slug}`} className="card-title text-left text-xl">
                {third.title}
              </Link>
            </p>
            <p className="card-briefing px-3 text-left">
              {truncate(third.excerpt, 250)}
            </p>
            <div className="time-line px-3 pt-4 pb-2 text-gray-500 text-xs">
              <span className="time pr-4">{timeAgo(third.published_at)}</span>
              {third.category?.name && (
                <> | <span className="location pl-4">{third.category.name}</span></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Text-only list cards */}
      {rest.length > 0 && (
        <div className="card px-3 flex flex-col grid-group-main-item divide-y divide-gray-500">
          {rest.slice(0, 3).map((article) => (
            <div key={article.id} className="card-context pt-4">
              <p className="px-3">
                <Link href={`/articles/${article.slug}`} className="card-title text-left text-base">
                  {article.title}
                </Link>
              </p>
              <p className="card-briefing px-3 text-left text-sm">
                {truncate(article.excerpt, 150)}
              </p>
              <div className="time-line px-3 pt-4 pb-2 text-gray-500 text-xs">
                <span className="time pr-4">{timeAgo(article.published_at)}</span>
                {article.category?.name && (
                  <> | <span className="location pl-4">{article.category.name}</span></>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}