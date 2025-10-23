import Link from "next/link";
import { getAllBlogPosts } from "~/lib/blog";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              blog
            </h1>
            <p className="text-gray-400 text-lg">
              thoughts, projects, and experiences
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/50"
                >
                  <article>
                    {/* Date and tags */}
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <time className="text-gray-500" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.tags && post.tags.length > 0 && (
                        <>
                          <span className="text-gray-700">•</span>
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Read more indicator */}
                    <div className="mt-4 flex items-center text-gray-500 group-hover:text-gray-400 transition-colors">
                      <span className="text-sm font-medium">Read more</span>
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Back to home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
