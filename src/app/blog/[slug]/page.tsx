import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogViewBeacon } from "~/app/blog/_components/BlogViewBeacon";
import { PostReader } from "~/app/blog/_components/PostReader";
import { getAllBlogSlugs } from "~/lib/blog";
import { api } from "~/trpc/server";
import styles from "../blog.module.css";

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

/** Section headings, as rendered with ids by renderPostMarkdown. */
function contents(html: string) {
  return [...html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map(
    ([, level, id, inner]) => ({
      id: id!,
      level: Number(level),
      text: inner!.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"'),
    }),
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await api.blog.bySlug({ slug });
  if (!post) notFound();

  const all = await api.blog.list();
  const index = all.findIndex((p) => p.slug === post.slug);
  const next = all[index + 1] ?? all[0];
  const toc = contents(post.content);
  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main>
      <PostReader />
      <div className={styles.wrap}>
        <header className={styles.head}>
          <Link className={`${styles.mono} ${styles.backLink}`} href="/blog">
            ← all writing
          </Link>
          <h1>{post.title}</h1>
          {post.excerpt && <p className={styles.dek}>{post.excerpt}</p>}
          <div className={`${styles.metaRow} ${styles.mono}`}>
            <time dateTime={post.date}>{date}</time>
            <span>{post.readingTime}</span>
            <BlogViewBeacon slug={post.slug} initialViewCount={post.viewCount} />
            {(post.tags ?? []).map((t) => (
              <span key={t} className={styles.hash}>
                {t}
              </span>
            ))}
          </div>
        </header>
        {post.image && (
          <div className={styles.cover}>
            <Image src={post.image} alt="" fill priority sizes="(min-width: 1280px) 1240px, 100vw" style={{ objectFit: "cover" }} data-cover />
          </div>
        )}

        <div className={styles.layout}>
          {toc.length > 1 ? (
            <nav className={styles.toc} aria-label="On this page" data-toc>
              <span className={styles.mono}>on this page</span>
              {toc.map((h) => (
                <a key={h.id} href={`#${h.id}`} className={h.level === 3 ? styles.sub : ""}>
                  <i />
                  {h.text}
                </a>
              ))}
            </nav>
          ) : (
            <div />
          )}
          <div>
            <article className={styles.article} data-article dangerouslySetInnerHTML={{ __html: post.content }} />
            {next && next.slug !== post.slug && (
              <Link className={styles.next} href={`/blog/${next.slug}`}>
                <div>
                  <span className={styles.mono}>next up</span>
                  <b>{next.title}</b>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
