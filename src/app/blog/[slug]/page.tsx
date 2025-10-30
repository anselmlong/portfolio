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
    <div className={`min-h-screen bg-black text-white ${geist.variable}`}>
      <main className="container mx-auto px-4 pt-28 pb-16 md:pt-36">
        <article className="max-w-3xl mx-auto font-mono">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-8"
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
            back to blog
          </Link>

          {/* Header */}
          <header className="mb-8 pb-8 border-b border-gray-800">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              {post.title}
            </h1>
            {/* Excerpt (lead) */}
            {post.excerpt && (
              <p className="text-lg text-gray-400 max-w-prose mb-4">{post.excerpt}</p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                        className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
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
            className="blog-content prose prose-invert prose-lg max-w-prose mx-auto
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-4 prose-h1:bg-gradient-to-b prose-h1:from-[#FE4E00]/30 prose-h1:to-[#55433F]/30 prose-h1:bg-clip-text prose-h1:text-transparent
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:bg-gradient-to-b prose-h2:from-[#FE4E00]/30 prose-h2:to-[#55433F]/30 prose-h2:bg-clip-text prose-h2:text-transparent prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:bg-gradient-to-b prose-h3:from-[#FE4E00]/30 prose-h3:to-[#55433F]/30 prose-h3:bg-clip-text prose-h3:text-transparent
                prose-h1:bg-gradient-to-b prose-h1:from-[#FF9900]/70 prose-h1:to-[#FFD700]/70 prose-h1:bg-clip-text prose-h1:text-transparent
                prose-h2:bg-gradient-to-b prose-h2:from-[#FF9900]/70 prose-h2:to-[#FFD700]/70 prose-h2:bg-clip-text prose-h2:text-transparent prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2
                prose-h3:bg-gradient-to-b prose-h3:from-[#FF9900]/70 prose-h3:to-[#FFD700]/70 prose-h3:bg-clip-text prose-h3:text-transparent
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-gray-400 prose-a:underline prose-a:decoration-gray-600 hover:prose-a:text-gray-300 hover:prose-a:decoration-gray-500
              prose-strong:text-gray-200 prose-strong:font-semibold
              prose-code:text-gray-300 prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg
              prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-300
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-gray-300
              prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
              prose-img:rounded-lg prose-img:shadow-lg
              prose-figure:my-8 prose-figure:flex prose-figure:flex-col prose-figure:items-center
              prose-figcaption:mt-2 prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:text-center"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800">
            <Link
              href="/blog"
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
              back to blog
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
