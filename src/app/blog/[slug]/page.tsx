import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogSlugs } from '~/lib/blog';
import { api } from '~/trpc/server';

function computeReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = (text.match(/\w+/g) || []).length;
  const wpm = 200;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} min`;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
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

  const readingTime = computeReadingTime(post.content);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-28 pb-24 md:pt-36">
        <article className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Navigation */}
          <nav className="max-w-4xl mx-auto mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 group"
            >
              <span className="size-6 border border-current rounded-full flex items-center justify-center mr-3 group-hover:border-foreground transition-colors duration-200">
                <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </span>
              <span className="text-xs tracking-[0.2em] uppercase">Journal</span>
            </Link>
          </nav>

          {/* Header */}
          <header className="max-w-4xl mx-auto mb-16 relative">
            {/* Decorative large letter */}
            <span className="absolute -left-8 md:-left-24 -top-8 text-[10rem] md:text-[14rem] font-light text-foreground/[0.02] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
              {post.title.charAt(0).toUpperCase()}
            </span>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs tracking-[0.15em] uppercase text-muted-foreground/70 mb-8 relative">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
              <span>{readingTime} read</span>
              {post.author && (
                <>
                  <span className="size-1 rounded-full bg-muted-foreground/30" />
                  <span>By {post.author}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground-high text-balance leading-[1.1] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              {post.title}
            </h1>

            {/* Excerpt / Lead */}
            {post.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed text-pretty max-w-3xl border-l-2 border-primary/30 pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-10">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs tracking-[0.15em] uppercase text-primary/80 border border-primary/20 px-4 py-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="mt-16 flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-muted-foreground/30 text-lg" style={{ fontFamily: 'var(--font-display)' }}>❧</span>
              <div className="h-px bg-border flex-1" />
            </div>
          </header>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div
              className="blog-content prose prose-invert prose-lg max-w-none
                prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-foreground-high
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-4
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                prose-p:text-foreground/90 prose-p:leading-[1.85] prose-p:mb-6 prose-p:font-light prose-p:text-pretty
                prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/40 hover:prose-a:border-primary hover:prose-a:text-primary transition-colors
                prose-strong:text-foreground-high prose-strong:font-medium
                prose-code:text-primary prose-code:bg-card prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-none prose-pre:my-8
                prose-li:text-foreground/90 prose-li:font-light prose-li:leading-[1.85]
                prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:font-light
                prose-img:rounded-none prose-img:my-10
                prose-hr:border-border/30 prose-hr:my-12
                prose-figure:my-10
                "
              style={{ fontFamily: 'var(--font-serif)' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Footer */}
          <footer className="max-w-4xl mx-auto mt-24">
            {/* End flourish */}
            <div className="flex items-center justify-center mb-16">
              <span className="text-3xl text-muted-foreground/20" style={{ fontFamily: 'var(--font-display)' }}>∎</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-border/50 pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 group"
              >
                <span className="size-8 border border-current rounded-full flex items-center justify-center mr-3 group-hover:border-foreground group-hover:bg-foreground/5 transition-all duration-200">
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Back to</span>
                  <span className="text-sm tracking-wide">Journal</span>
                </div>
              </Link>

              <div className="text-right">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mb-1">Published</p>
                <time dateTime={post.date} className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
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
