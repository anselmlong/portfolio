import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogViewBeacon } from "~/app/blog/_components/BlogViewBeacon";
import { getAllBlogSlugs } from "~/lib/blog";
import { api } from "~/trpc/server";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.blog.bySlug({ slug });

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      ...(post.image && {
        images: [
          { url: post.image, width: 1200, height: 630, alt: post.title },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await api.blog.bySlug({ slug });

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden">
      <main className="pt-28 pb-24 md:pt-36">
        <article className="container mx-auto px-6 md:px-12 lg:px-20">
          <nav className="mx-auto mb-16 max-w-4xl">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground group inline-flex items-center text-sm transition-colors duration-200"
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
              All posts
            </Link>
          </nav>

          <header className="blog-hero-enter relative mx-auto mb-14 max-w-4xl">
            <div className="text-muted-foreground mb-7 flex flex-wrap items-center gap-3 text-sm md:gap-4">
              <time dateTime={post.date}>{formattedDate}</time>
              <span
                className="bg-primary/60 size-1 rounded-full"
                aria-hidden="true"
              />
              <span>{post.readingTime}</span>
              <BlogViewBeacon
                slug={post.slug}
                initialViewCount={post.viewCount}
              />
              {post.author && (
                <>
                  <span
                    className="bg-primary/60 size-1 rounded-full"
                    aria-hidden="true"
                  />
                  <span>By {post.author}</span>
                </>
              )}
            </div>

            <h1
              className="text-foreground-high mb-8 max-w-4xl text-5xl leading-[1.02] font-light tracking-tight text-balance md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-muted-foreground max-w-3xl text-xl leading-9 text-pretty md:text-2xl md:leading-10">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-9 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-primary/25 bg-primary/8 text-primary inline-block rounded-full border px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.image && (
            <div className="blog-feature-enter mx-auto mb-16 max-w-5xl">
              <div className="border-border/70 bg-card relative aspect-[16/9] overflow-hidden border">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1280px) 64rem, (min-width: 768px) 80vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="mx-auto max-w-3xl">
            <div
              className="blog-content blog-copy-enter prose prose-invert prose-lg prose-headings:text-foreground-high prose-headings:font-normal prose-headings:tracking-tight prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-3xl prose-h2:leading-tight prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-2xl prose-p:mb-7 prose-p:text-foreground/90 prose-p:leading-[1.9] prose-p:font-light prose-p:text-pretty prose-a:border-b prose-a:border-primary/40 prose-a:text-primary prose-a:no-underline hover:prose-a:border-primary prose-strong:text-foreground-high prose-strong:font-medium prose-code:rounded prose-code:bg-card prose-code:px-2 prose-code:py-1 prose-code:font-mono prose-code:text-sm prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-pre:my-10 prose-pre:rounded-none prose-pre:border prose-pre:border-border/60 prose-pre:bg-card prose-li:text-foreground/90 prose-li:leading-[1.85] prose-li:font-light prose-blockquote:my-10 prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:font-light prose-img:my-10 prose-img:rounded-none prose-hr:my-14 prose-hr:border-border/30 prose-figure:my-10 max-w-none transition-colors"
              style={{ fontFamily: "var(--font-serif)" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <footer className="mx-auto mt-24 max-w-4xl">
            <div className="border-border/50 flex items-center justify-between border-t pt-8">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground group inline-flex items-center transition-colors duration-200"
              >
                <span className="mr-3 flex size-8 items-center justify-center rounded-full border border-current transition-all duration-200 group-hover:bg-white/5">
                  <svg
                    className="size-4"
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
                <div className="flex flex-col items-start">
                  <span className="text-sm">Back to blog</span>
                </div>
              </Link>

              <div className="text-right">
                <p className="text-muted-foreground mb-1 text-sm">Published</p>
                <time
                  dateTime={post.date}
                  className="text-foreground-high text-sm"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
