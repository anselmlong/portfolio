import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogSlugs } from '~/lib/blog';
import { Geist } from 'next/font/google';
import { api } from '~/trpc/server';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

function computeReadingTime(html: string) {
  // Strip HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = (text.match(/\w+/g) || []).length;
  const wpm = 200;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} min read`;
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

  return (
    <div className={`min-h-screen bg-background text-foreground ${geist.variable} font-sans`}>
      <main className="container mx-auto px-4 pt-28 pb-16 md:pt-36">
        <article className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 font-light tracking-widest uppercase text-sm"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            back to blog
          </Link>

          {/* Header */}
          <header className="mb-12 pb-8 border-b border-border">
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-foreground-high tracking-tight leading-snug">
              {post.title}
            </h1>
            {/* Excerpt (lead) */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground max-w-prose mb-6 font-light leading-relaxed">{post.excerpt}</p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-light tracking-wider uppercase">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {/* reading time */}
              <span>•</span>
              <span>{computeReadingTime(post.content)}</span>

              {post.author && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}

              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
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
          </header>

          {/* Content */}
          <div
            className="blog-content prose prose-invert prose-lg max-w-none
              prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground-high
              prose-p:text-foreground prose-p:leading-loose prose-p:mb-6 prose-p:font-light
              prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 hover:prose-a:text-primary-foreground hover:prose-a:bg-primary transition-all
              prose-strong:text-foreground-high prose-strong:font-medium
              prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm
              prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-none
              prose-li:text-foreground prose-li:font-light
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
              prose-img:rounded-none prose-img:shadow-sm prose-img:border prose-img:border-border
              "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-border">
            <Link
              href="/blog"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              back to blog
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
