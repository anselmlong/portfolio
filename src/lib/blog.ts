import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const blogsDirectory = path.join(process.cwd(), "public/blogs");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  tags?: string[];
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
}

interface MatterData {
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  [key: string]: unknown;
}

function safeData(data: unknown): MatterData {
  return data as MatterData;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getAllBlogPosts(): BlogPostMetadata[] {
  const slugs = getAllBlogSlugs();

  const posts = slugs.map((slug) => {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
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
    } as BlogPostMetadata;
  });

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const d = safeData(data);

    const htmlContent = enhanceHtmlContent(await marked.parse(content));

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
    } as BlogPost;
  } catch {
    return null;
  }
}

function extractTitleFromContent(content: string, fallback: string): string {
  const match = /^#\s+(.+)$/m.exec(content);
  return match?.[1] ?? fallback.replace(/-/g, " ");
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
