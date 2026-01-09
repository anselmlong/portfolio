import Link from "next/link";
import { api } from "~/trpc/server";

export default async function BlogPage() {
  const posts = await api.blog.list();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="container mx-auto px-6 pt-28 pb-16 md:pt-36">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-5xl md:text-6xl font-light mb-4 text-foreground-high tracking-tight">
              blog
            </h1>
            <p className="text-muted-foreground text-lg font-light">
              thoughts, projects, and experiences
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg font-light">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-8 rounded-none border-b border-border hover:bg-card/30 transition-all duration-500"
                >
                  <article>
                    {/* Date and tags */}
                    <div className="flex items-center gap-3 mb-4 text-sm font-light tracking-wider uppercase text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.tags && post.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-primary font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed font-light text-lg">
                      {post.excerpt}
                    </p>

                    {/* Read more indicator */}
                    <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium uppercase tracking-widest">Read Article</span>
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Back to home */}
          <div className="mt-20 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-light tracking-widest uppercase text-sm"
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
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
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
