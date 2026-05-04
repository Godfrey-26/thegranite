import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import API_Caller from "../src/api_caller";

function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

export default function TopStories() {
  const [topStories, setTopStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTopStories = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await API_Caller("GET", null, "/articles/top-stories/", null);

        const articles = Array.isArray(data)
          ? data.filter((item) => item?.article !== null).map((item) => item.article)
          : [];

        if (isMounted) setTopStories(articles);
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to fetch top stories");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopStories();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="px-3 pt-6 text-sm text-gray-500 animate-pulse">Loading top stories...</div>;
  if (error) return <div className="px-3 pt-6 text-red-500">Error: {error}</div>;
  if (topStories.length === 0) return <div className="px-3 pt-6">No top stories found.</div>;

  const [featured, ...rest] = topStories;

  return (
    <div>
      <div className="px-3 pt-6">
        <h2 className="text-xl">Top Stories</h2>
      </div>

      <div className="grouped-grid-arrangement">
        <div className="grid grid-cols-1 gap-4">

          {/* Featured story */}
          {featured && (
            <div className="card px-3 pt-6 grid grid-cols-2">
              <div className="card-context">
                <p className="px-3">
                  <Link href={`/articles/${featured.slug}`} className="card-title text-left text-xl">
                    {featured.title}
                  </Link>
                </p>
                <p className="card-briefing px-3 text-left">
                  {truncate(featured.excerpt || "", 250)}
                </p>
                <div className="time-line px-3 pt-6 pb-2 text-gray-500 text-sm">
                  <span className="time pr-4">{featured.time_ago || "Recent"}</span>
                  {featured.location && (
                    <> | <span className="location pl-4">{featured.location}</span></>
                  )}
                </div>
              </div>
              {featured.image_url && (
                <div className="card-image">
                  <Image
                    src={featured.image_url}
                    alt={featured.image_alt || featured.title}
                    width={500}
                    height={350}
                  />
                </div>
              )}
            </div>
          )}

          {/* Secondary stories row */}
          {rest.length > 0 && (
            <div className="flex flex-row">
              {rest.slice(0, 3).map((story) => (
                <div key={story.id} className="card px-3 pb-6 mb-3">
                  {story.image_url && (
                    <div className="card-image">
                      <Image
                        src={story.image_url}
                        alt={story.image_alt || story.title}
                        width={310}
                        height={200}
                      />
                    </div>
                  )}
                  <div className="card-context">
                    <p className="px-3">
                      <Link href={`/articles/${story.slug}`} className="card-title text-left text-base">
                        {story.title}
                      </Link>
                    </p>
                    <p className="card-briefing px-3 text-left text-xs">
                      {truncate(story.excerpt || "", 80)}
                    </p>
                    <div className="time-line px-3 pt-6 pb-2 text-gray-500 text-sm">
                      <span className="time pr-4">{story.time_ago || "Recent"}</span>
                      {story.location && (
                        <> | <span className="location pl-4">{story.location}</span></>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List stories */}
          {rest.length > 3 && (
            <div className="card px-3 flex flex-col grid-group-main-item divide-y divide-gray-500">
              {rest.slice(3).map((story) => (
                <div key={story.id} className="card-context pt-4">
                  <p className="px-3">
                    <Link href={`/articles/${story.slug}`} className="card-title text-left text-base">
                      {story.title}
                    </Link>
                  </p>
                  <p className="card-briefing px-3 text-left text-sm">
                    {truncate(story.excerpt || "", 150)}
                  </p>
                  <div className="time-line px-3 pt-6 pb-2 text-gray-500 text-sm">
                    <span className="time pr-4">{story.time_ago || "Recent"}</span>
                    {story.location && (
                      <> | <span className="location pl-4">{story.location}</span></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}