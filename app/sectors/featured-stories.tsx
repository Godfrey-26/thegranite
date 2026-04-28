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

export default function Featured() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await API_Caller("GET", null, "/articles/featured/", null);

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        const sorted = [...results].sort(
          (a, b) => (a.featured_rank ?? 999) - (b.featured_rank ?? 999)
        );

        if (isMounted) setArticles(sorted);
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to fetch featured stories");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  if (loading) return (
    <div className="px-3 pt-6 text-sm text-gray-500 animate-pulse">
      Loading featured stories...
    </div>
  );

  if (error) return (
    <div className="px-3 pt-6 text-red-500 text-sm">Error: {error}</div>
  );

  if (articles.length === 0) return (
    <div className="px-3 pt-6 text-gray-500 text-sm">No featured stories available.</div>
  );

  return (
    <div className="featured pb-6">

      {/* Section header */}
      <div className="px-3 pt-6">
        <h2 className="text-xl font-semibold">Featured</h2>
      </div>

      {/* ── Tile grid ──
           Mobile:  1 column (stacked)
           sm+:     2 columns (matches your original design)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 px-3">
        {articles.map((article) => (
          <div key={article.id} className="card">

            {/* Image */}
            {article.image_url && (
              <div className="card-image">
                <Image
                  src={article.image_url}
                  alt={article.image_alt || article.title}
                  width={610}
                  height={350}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded"
                />
              </div>
            )}

            {/* Content */}
            <div className="card-context mt-2 px-3">

              {/* Category label */}
              {article.category?.name && (
                <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  {article.category.name}
                </span>
              )}

              {/* Title */}
              <p className="mt-1">
                <Link
                  href={`/articles/${article.slug}`}
                  className="card-title text-left text-base sm:text-lg md:text-xl font-semibold leading-snug hover:underline line-clamp-3"
                >
                  {article.title}
                </Link>
              </p>

              {/* Excerpt — hidden on mobile to save space */}
              <p className="card-briefing mt-2 text-left text-sm text-gray-600 leading-relaxed hidden sm:block">
                {truncate(article.excerpt || "", 250)}
              </p>

              {/* Meta row */}
              <div className="mt-2 pb-3 flex flex-wrap gap-2 items-center text-xs text-gray-500">
                {article.author_name && (
                  <>
                    <span className="font-medium">{article.author_name}</span>
                    <span>·</span>
                  </>
                )}
                <span>{timeAgo(article.published_at)}</span>
                {article.is_premium && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded">
                    Premium
                  </span>
                )}
                {article.is_breaking && (
                  <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    Breaking
                  </span>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}