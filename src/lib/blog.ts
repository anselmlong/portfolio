import fs from "fs";
import path from "path";
import matter from "gray-matter";
import hljs from "highlight.js";
import { Marked } from "marked";

const blogsDirectory = path.join(process.cwd(), "public/blogs");

function getBlogMarkdownPath(slug: string): string {
  const folderPath = path.join(blogsDirectory, slug, `${slug}.md`);
  if (fs.existsSync(folderPath)) {
    return folderPath;
  }

  return path.join(blogsDirectory, `${slug}.md`);
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  tags?: string[];
  readingTime: string;
  image?: string;
  viewCount?: number | null;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
  readingTime: string;
  image?: string;
  viewCount?: number | null;
}

interface MatterData {
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  image?: string;
  [key: string]: unknown;
}

function computeReadingTime(markdown: string): string {
  const text = markdown
    .replace(/^---[\s\S]*?---\n?/, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_`~>\[\]()|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function safeData(data: unknown): MatterData {
  return data as MatterData;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(blogsDirectory, { withFileTypes: true });
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      slugs.add(entry.name.replace(/\.md$/, ""));
    }

    if (entry.isDirectory()) {
      const markdownPath = path.join(
        blogsDirectory,
        entry.name,
        `${entry.name}.md`,
      );
      if (fs.existsSync(markdownPath)) {
        slugs.add(entry.name);
      }
    }
  }

  return [...slugs];
}

export function getAllBlogPosts(): BlogPostMetadata[] {
  const slugs = getAllBlogSlugs();

  const posts = slugs.map((slug) => {
    const fullPath = getBlogMarkdownPath(slug);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const d = safeData(data);

    const excerpt =
      d.excerpt ?? content.split("\n\n")[0]?.substring(0, 200) ?? "";

    const date = d.date ?? new Date().toISOString().split("T")[0];

    return {
      slug,
      title: d.title ?? extractTitleFromContent(content, slug),
      date,
      excerpt: excerpt.replace(/^#+ /, "").trim(),
      author: d.author,
      tags: d.tags ?? [],
      readingTime: computeReadingTime(fileContents),
      image: d.image,
    } as BlogPostMetadata;
  });

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = getBlogMarkdownPath(slug);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const d = safeData(data);

    const normalizedContent = rewriteRelativeImagePaths(content, slug);
    const htmlContent = enhanceHtmlContent(
      await renderPostMarkdown(normalizedContent),
    );

    const excerpt =
      d.excerpt ?? content.split("\n\n")[0]?.substring(0, 200) ?? "";

    const date = d.date ?? new Date().toISOString().split("T")[0];

    return {
      slug,
      title: d.title ?? extractTitleFromContent(content, slug),
      date,
      excerpt: excerpt.replace(/^#+ /, "").trim(),
      content: htmlContent,
      author: d.author,
      tags: d.tags ?? [],
      readingTime: computeReadingTime(fileContents),
      image: d.image,
    } as BlogPost;
  } catch {
    return null;
  }
}

function extractTitleFromContent(content: string, fallback: string): string {
  const match = /^#\s+(.+)$/m.exec(content);
  return match?.[1] ?? fallback.replace(/-/g, " ");
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * Posts open their sections with "#" or "##", so headings shift until the
 * shallowest one sits at h2 under the page title, and each gets an id the
 * contents rail can link to. Fenced code with
 * a known language is highlighted on the server.
 */
export async function renderPostMarkdown(markdown: string): Promise<string> {
  const depths = new Marked()
    .lexer(markdown)
    .flatMap((t) => (t.type === "heading" ? [t.depth as number] : []));
  const shift = 2 - (depths.length ? Math.min(...depths) : 1);
  const used = new Map<string, number>();
  const idFor = (text: string) => {
    const base =
      text
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/&[a-z]+;/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "section";
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  const renderer = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const level = Math.min(6, depth + shift);
        return `<h${level} id="${idFor(html)}">${html}</h${level}>\n`;
      },
      code({ text, lang }) {
        const language = lang && hljs.getLanguage(lang) ? lang : undefined;
        const body = language
          ? hljs.highlight(text, { language, ignoreIllegals: true }).value
          : escapeHtml(text);
        return `<pre><code class="hljs${language ? ` language-${language}` : ""}">${body}</code></pre>\n`;
      },
    },
  });
  return renderer.parse(markdown);
}

function enhanceHtmlContent(html: string): string {
  const wrappedTables = html
    .replace(/<table(\s[^>]*)?>/g, (_match: string, attrs?: string) => {
      const normalizedAttrs = attrs ?? "";
      return `<div class="blog-table-wrapper" role="region" aria-label="Scrollable table"><table${normalizedAttrs}>`;
    })
    .replace(/<\/table>/g, "</table></div>");

  return wrappedTables;
}

function rewriteRelativeImagePaths(markdown: string, slug: string): string {
  return markdown.replace(
    /!\[([^\]]*?)\]\(([^)]+)\)/g,
    (match, altText: string, rawUrl: string) => {
      const trimmedUrl = rawUrl.trim();

      if (
        trimmedUrl.startsWith("/") ||
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://") ||
        trimmedUrl.startsWith("data:")
      ) {
        return match;
      }

      const resolvedUrl = path.posix.normalize(
        path.posix.join("/blogs", slug, trimmedUrl),
      );

      return `![${altText}](${resolvedUrl})`;
    },
  );
}
