import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogsDirectory = path.join(process.cwd(), 'public/blogs');

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

/**
 * Get all blog post slugs
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get metadata for all blog posts (for listing page)
 */
export function getAllBlogPosts(): BlogPostMetadata[] {
  const slugs = getAllBlogSlugs();
  
  const posts = slugs.map((slug) => {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Extract first paragraph as excerpt if not provided
    const excerpt = data.excerpt || content.split('\n\n')[0]?.substring(0, 200) || '';
    
    return {
      slug,
      title: data.title || extractTitleFromContent(content, slug),
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: excerpt.replace(/^#+ /, '').trim(),
      author: data.author,
      tags: data.tags || [],
    };
  });
  
  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get full blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
    const htmlContent = enhanceHtmlContent(await marked(content));
    
    const excerpt = data.excerpt || content.split('\n\n')[0]?.substring(0, 200) || '';
    
    return {
      slug,
      title: data.title || extractTitleFromContent(content, slug),
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: excerpt.replace(/^#+ /, '').trim(),
      content: htmlContent,
      author: data.author,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Extract title from markdown content (first H1)
 */
function extractTitleFromContent(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1] ?? fallback.replace(/-/g, ' ');
}

function enhanceHtmlContent(html: string): string {
  const wrappedTables = html
    .replace(/<table(\s[^>]*)?>/g, (_match, attrs = '') => {
      const normalizedAttrs = attrs || '';
      return `<div class="blog-table-wrapper" role="region" aria-label="Scrollable table"><table${normalizedAttrs}>`;
    })
    .replace(/<\/table>/g, '</table></div>');

  return wrappedTables;
}
