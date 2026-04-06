import Link from "next/link";
import { api } from "~/trpc/server";

export default async function BlogPage() {
  const posts = await api.blog.list();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="pt-32 pb-24 md:pt-40">
        {/* Editorial Header */}
        <header className="container mx-auto mb-20 px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            {/* Back link - subtle */}
            <Link
              href="/"
              className="text-muted-foreground/60 hover:text-muted-foreground group mb-12 inline-flex items-center transition-colors duration-200"
            >
              <span className="group-hover:border-foreground mr-3 flex size-6 items-center justify-center rounded-full border border-current transition-colors duration-200">
                <svg
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
              <span className="text-xs tracking-[0.2em] uppercase">Home</span>
            </Link>

            {/* Main title with decorative elements */}
            <div className="relative">
              {/* Issue number - decorative */}
              <span
                className="text-foreground/[0.03] pointer-events-none absolute top-0 -left-4 text-[8rem] leading-none font-thin select-none md:-left-16 md:text-[12rem]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                №
              </span>

              <h1
                className="text-foreground-high text-6xl leading-[0.9] font-light tracking-tight text-balance md:text-8xl lg:text-9xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Journal
              </h1>

              <div className="mt-6 flex items-center gap-6">
                <div className="bg-primary/40 h-px w-16" />
                <p className="text-muted-foreground text-sm tracking-[0.15em] text-pretty uppercase">
                  Thoughts, projects & experiences
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Posts Section */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            {posts.length === 0 ? (
              /* Empty State */
              <div className="py-32 text-center">
                <p
                  className="text-muted-foreground/20 mb-8 text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ∅
                </p>
                <p className="text-muted-foreground mb-8 text-lg font-light text-pretty">
                  No entries yet. The first chapter awaits.
                </p>
                <Link
                  href="/"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center border px-8 py-4 text-sm tracking-[0.15em] uppercase transition-colors duration-200"
                >
                  Return Home
                </Link>
              </div>
            ) : (
              /* Posts Grid (cards) */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="border-border/50 bg-card/20 hover:bg-card/30 hover:border-primary/40 hover:shadow-primary/5 flex h-full flex-col border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:p-7">
                      {/* Meta */}
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <time
                          dateTime={post.date}
                          className="text-muted-foreground/70 text-xs tracking-[0.12em] uppercase"
                        >
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>

                        <span className="text-primary flex translate-x-2 items-center gap-2 text-xs tracking-[0.15em] uppercase opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                          Read
                          <svg
                            className="size-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                            />
                          </svg>
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-foreground group-hover:text-primary mb-3 text-2xl leading-snug font-normal tracking-tight text-balance transition-colors duration-200 md:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed font-light text-pretty">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-primary/70 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary -mx-1 inline-block cursor-default rounded border-b px-1 text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:scale-105"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Bottom flourish */}
                      <div className="border-border/40 text-muted-foreground/40 mt-6 border-t pt-4 text-xs tracking-[0.2em] uppercase">
                        Open
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto mt-24 px-6 md:px-12 lg:px-20">
          <div className="text-muted-foreground/50 mx-auto flex max-w-6xl items-center justify-between text-xs tracking-[0.1em] uppercase">
            <span>
              {posts.length} {posts.length === 1 ? "Entry" : "Entries"}
            </span>
            <Link
              href="/"
              className="hover:text-muted-foreground transition-colors duration-200"
            >
              Back to Portfolio
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
