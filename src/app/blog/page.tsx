import Link from "next/link";
import { api } from "~/trpc/server";

export default async function BlogPage() {
  const posts = await api.blog.list();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-32 pb-24 md:pt-40">
        {/* Editorial Header */}
        <header className="container mx-auto px-6 md:px-12 lg:px-20 mb-20">
          <div className="max-w-6xl mx-auto">
            {/* Back link - subtle */}
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 mb-12 group"
            >
              <span className="size-6 border border-current rounded-full flex items-center justify-center mr-3 group-hover:border-foreground transition-colors duration-200">
                <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </span>
              <span className="text-xs tracking-[0.2em] uppercase">Home</span>
            </Link>

            {/* Main title with decorative elements */}
            <div className="relative">
              {/* Issue number - decorative */}
              <span className="absolute -left-4 md:-left-16 top-0 text-[8rem] md:text-[12rem] font-thin text-foreground/[0.03] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
                №
              </span>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-foreground-high text-balance leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Journal
              </h1>

              <div className="mt-6 flex items-center gap-6">
                <div className="h-px bg-primary/40 w-16" />
                <p className="text-muted-foreground text-sm tracking-[0.15em] uppercase text-pretty">
                  Thoughts, projects & experiences
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Posts Section */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              /* Empty State */
              <div className="py-32 text-center">
                <p className="text-6xl mb-8 text-muted-foreground/20" style={{ fontFamily: 'var(--font-display)' }}>∅</p>
                <p className="text-muted-foreground text-lg font-light text-pretty mb-8">
                  No entries yet. The first chapter awaits.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-4 border border-primary text-primary text-sm tracking-[0.15em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Return Home
                </Link>
              </div>
            ) : (
              /* Posts Grid */
              <div className="space-y-0">
                {posts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <article className="grid grid-cols-12 gap-4 md:gap-8 py-12 md:py-16 border-t border-border/50 hover:border-primary/30 transition-colors duration-200">
                      {/* Post Number */}
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-4xl md:text-5xl font-light text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-200 tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="col-span-10 md:col-span-11 flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-4 text-foreground group-hover:text-primary transition-colors duration-200 tracking-tight text-balance leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-muted-foreground line-clamp-2 leading-relaxed font-light text-base md:text-lg text-pretty max-w-2xl">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-5">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs tracking-[0.1em] uppercase text-primary/70 border-b border-primary/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Metadata Column */}
                        <div className="md:w-40 flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-right">
                          <time
                            dateTime={post.date}
                            className="text-xs tracking-[0.1em] uppercase text-muted-foreground/70"
                          >
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>

                          {/* Read indicator */}
                          <span className="text-xs tracking-[0.15em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                            Read
                            <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}

                {/* End marker */}
                <div className="border-t border-border/50 pt-12 flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground/20" style={{ fontFamily: 'var(--font-display)' }}>※</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground/50 tracking-[0.1em] uppercase">
            <span>{posts.length} {posts.length === 1 ? 'Entry' : 'Entries'}</span>
            <Link href="/" className="hover:text-muted-foreground transition-colors duration-200">
              Back to Portfolio
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
