import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { type BlogPostMetadata } from "~/lib/blog";

export const metadata: Metadata = {
  title: "blog",
  description:
    "Writing on machine learning, side projects, and software engineering by Anselm Long.",
  openGraph: {
    title: "blog — anselm long",
    description:
      "Writing on machine learning, side projects, and software engineering by Anselm Long.",
    type: "website",
  },
};

function formatPostDate(date: string, style: "short" | "long" = "short") {
  return new Date(date).toLocaleDateString("en-US", {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });
}

function PostMeta({
  post,
  showReadingTime = true,
}: {
  post: BlogPostMetadata;
  showReadingTime?: boolean;
}) {
  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      {showReadingTime && (
        <>
          <span
            className="bg-primary/60 size-1 rounded-full"
            aria-hidden="true"
          />
          <span>{post.readingTime}</span>
        </>
      )}
      {post.viewCount !== null && post.viewCount !== undefined && (
        <>
          <span
            className="bg-primary/60 size-1 rounded-full"
            aria-hidden="true"
          />
          <span>{formatViewCount(post.viewCount)} views</span>
        </>
      )}
    </div>
  );
}

function formatViewCount(viewCount: number) {
  return new Intl.NumberFormat("en-US", {
    notation: viewCount >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(viewCount);
}

function TagList({
  tags,
  limit,
  compact = false,
}: {
  tags: string[] | undefined;
  limit?: number;
  compact?: boolean;
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, limit).map((tag) => (
        <span
          key={tag}
          className={
            compact
              ? "border-border/70 text-muted-foreground rounded-full border px-2.5 py-1 text-xs"
              : "border-primary/25 bg-primary/8 text-primary rounded-full border px-3 py-1 text-sm"
          }
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  const posts = await api.blog.list();
  const [featuredPost, ...archivePosts] = posts;

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden">
      <main className="pt-28 pb-24 md:pt-36">
        <header className="blog-hero-enter container mx-auto mb-14 px-6 md:mb-20 md:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground group mb-12 inline-flex items-center text-sm transition-colors duration-200"
            >
              <span className="mr-3 flex size-8 items-center justify-center rounded-full border border-current transition-colors duration-200 group-hover:bg-white/5">
                <svg
                  className="size-3.5"
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
              Home
            </Link>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div>
                <p className="text-primary mb-5 text-sm">
                  Notes from projects, internships, hackathons, and experiments.
                </p>
                <h1
                  className="text-foreground-high max-w-4xl text-6xl leading-[0.9] font-light tracking-tight text-balance md:text-8xl lg:text-9xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Blog
                </h1>
                <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-8 text-pretty md:text-xl">
                  Build logs, project writeups, and the occasional honest note
                  on learning in public.
                </p>
              </div>
              <div className="border-border/70 grid grid-cols-2 gap-4 border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                <div>
                  <p className="text-foreground-high text-3xl font-light">
                    {posts.length}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">entries</p>
                </div>
                <div>
                  <p className="text-foreground-high text-3xl font-light">
                    {featuredPost
                      ? formatPostDate(featuredPost.date, "long").split(" ")[0]
                      : "Soon"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    latest month
                  </p>
                </div>
                <div className="border-border/60 col-span-2 border-t pt-4">
                  <p className="text-foreground-high text-3xl font-light">
                    {featuredPost?.tags?.[0] ?? "notes"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    latest thread
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            {!featuredPost ? (
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
              <div className="space-y-16">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block"
                >
                  <article className="blog-feature-card blog-feature-enter border-border/70 bg-card/30 hover:border-primary/50 grid overflow-hidden border transition-colors duration-300 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="flex min-h-[25rem] flex-col p-6 md:p-10">
                      <div className="mb-10 flex items-start justify-between gap-6">
                        <div>
                          <p className="text-primary mb-3 text-sm">
                            Latest entry
                          </p>
                          <PostMeta post={featuredPost} />
                        </div>
                        <span className="text-primary hidden items-center gap-2 text-sm transition-transform duration-300 group-hover:translate-x-1 sm:flex">
                          Read
                          <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                            />
                          </svg>
                        </span>
                      </div>
                      <h2
                        className="text-foreground-high group-hover:text-primary max-w-3xl text-4xl leading-tight font-light tracking-tight text-balance transition-colors duration-300 md:text-5xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty">
                        {featuredPost.excerpt}
                      </p>
                      <div className="mt-8">
                        <TagList tags={featuredPost.tags} limit={5} />
                      </div>
                      <div className="mt-auto flex flex-wrap items-center gap-3 pt-12">
                        {featuredPost.viewCount !== null &&
                          featuredPost.viewCount !== undefined && (
                            <span className="text-muted-foreground text-sm">
                              {formatViewCount(featuredPost.viewCount)} views
                            </span>
                          )}
                        <div className="bg-primary/50 group-hover:bg-primary h-px min-w-20 flex-1 transition-all duration-300" />
                      </div>
                    </div>
                    {featuredPost.image ? (
                      <div className="bg-muted border-border/70 relative min-h-72 overflow-hidden border-t lg:border-t-0 lg:border-l">
                        <Image
                          src={featuredPost.image}
                          alt=""
                          fill
                          priority
                          sizes="(min-width: 1024px) 24rem, 100vw"
                          className="object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="from-background/55 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="border-border/70 bg-primary/10 hidden border-l lg:block" />
                    )}
                  </article>
                </Link>

                {archivePosts.length > 0 && (
                  <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                      <p className="text-foreground-high text-2xl font-light">
                        Archive
                      </p>
                      <p className="text-muted-foreground mt-3 text-sm leading-6">
                        More notes, sorted from newest to oldest.
                      </p>
                    </div>

                    <div className="border-border/70 divide-border/70 divide-y border-y">
                      {archivePosts.map((post, index) => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="blog-archive-row group hover:bg-card/30 grid gap-5 py-6 transition-colors duration-200 sm:grid-cols-[11rem_minmax(0,1fr)] sm:px-4 md:grid-cols-[12rem_minmax(0,1fr)_8rem]"
                          style={{
                            animationDelay: `${Math.min(index, 8) * 45}ms`,
                          }}
                        >
                          <div className="blog-archive-thumb bg-muted border-border/70 relative aspect-[16/10] overflow-hidden border">
                            {post.image ? (
                              <Image
                                src={post.image}
                                alt=""
                                fill
                                sizes="(min-width: 768px) 12rem, (min-width: 640px) 11rem, 100vw"
                                className="object-cover transition duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="bg-primary/10 h-full w-full" />
                            )}
                          </div>
                          <div>
                            <PostMeta post={post} showReadingTime={false} />
                            <h2
                              className="text-foreground-high group-hover:text-primary mt-3 text-2xl leading-snug font-light tracking-tight text-balance transition-colors duration-200"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground mt-3 line-clamp-2 max-w-3xl leading-7 text-pretty">
                              {post.excerpt}
                            </p>
                            <div className="mt-4">
                              <TagList tags={post.tags} limit={3} compact />
                            </div>
                          </div>
                          <div className="text-primary hidden items-start justify-end pt-2 text-sm md:flex">
                            <span className="translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                              Read
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto mt-24 px-6 md:px-12 lg:px-20">
          <div className="text-muted-foreground mx-auto flex max-w-6xl items-center justify-between text-sm">
            <span>
              {posts.length} {posts.length === 1 ? "entry" : "entries"}
            </span>
            <Link
              href="/"
              className="hover:text-foreground transition-colors duration-200"
            >
              Back to portfolio
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
