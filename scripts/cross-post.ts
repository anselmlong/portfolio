/**
 * Cross-post script — export blog posts + publish to Substack & Medium.
 *
 * Substack publishing: creates a draft, publishes it to your publication.
 * Medium: exports HTML for manual use (requires MEDIUM_ACCESS_TOKEN for auto-publish).
 *
 * Usage:
 *   bun run cross-post                           export all posts (substack + medium md/html files)
 *   bun run cross-post --post slug               export single post
 *   bun run cross-post --format substack         export for substack only
 *   bun run cross-post --publish                 publish all posts to Substack
 *   bun run cross-post --publish --post slug     publish single post
 *   bun run cross-post --publish --draft         create drafts without publishing
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOGS_DIR = path.join(process.cwd(), "public/blogs");
const OUTPUT_DIR = path.join(process.cwd(), "cross-post-output");
const SITE_URL = "https://anselmlong.com";
const SUBSTACK_PUB = "https://anselmlong.substack.com/api/v1";

interface MatterData {
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  image?: string;
  [key: string]: unknown;
}

function safeData(data: unknown): MatterData {
  return data as MatterData;
}

function substackHeaders() {
  const sid = process.env.SUBSTACK_SID;
  if (!sid) throw new Error("SUBSTACK_SID not set in .env");
  return {
    Cookie: `substack.sid=${sid}`,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function resolveImage(src: string): string {
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src}`;
}

function getSlugs(): string[] {
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

function readPost(
  slug: string,
): { data: MatterData; content: string; raw: string } | null {
  const fp = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, "utf8");
  const { data, content } = matter(raw);
  return { data: safeData(data), content, raw };
}

/**
 * Convert markdown to Substack's ProseMirror JSON (as a JSON string).
 * Handles: paragraphs, headings, images, bold, italic, links, code, blockquotes, lists, horizontal rules.
 */
function mdToProseMirror(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  const nodes: unknown[] = [];

  const blockTagRe =
    /<(p|h[1-6]|blockquote|pre|hr|ul|ol|li|figure|img)[^>]*>[\s\S]*?<\/\1>|<img[^>]+\/?>|<hr\s*\/?>/gi;
  let match: RegExpExecArray | null;
  while ((match = blockTagRe.exec(html)) !== null) {
    const block = match[0];
    nodes.push(htmlBlockToProseMirror(block));
  }

  return JSON.stringify({
    type: "doc",
    content: nodes.filter(Boolean),
  });
}

function htmlBlockToProseMirror(html: string): unknown {
  const nameMatch = html.match(/<\/?(\w+)/);
  const name = nameMatch?.[1] ?? "";

  if (name === "hr") {
    return { type: "horizontalRule" };
  }

  if (name === "img") {
    const src = html.match(/src="([^"]+)"/)?.[1] ?? "";
    const alt = html.match(/alt="([^"]+)"/)?.[1] ?? "";
    return { type: "image", attrs: { src: resolveImage(src), alt } };
  }

  if (name === "blockquote") {
    const inner = html.replace(/<\/?blockquote[^>]*>/gi, "").trim();
    const parsedInner = htmlToProseMirrorContent(inner);
    return {
      type: "blockquote",
      content: parsedInner.length ? parsedInner : undefined,
    };
  }

  if (name === "pre") {
    const code = html
      .replace(/<\/?pre[^>]*>/gi, "")
      .replace(/<\/?code[^>]*>/gi, "")
      .trim();
    return { type: "codeBlock", content: [{ type: "text", text: code }] };
  }

  if (name === "ul" || name === "ol") {
    return parseList(html, name);
  }

  if (
    name === "h1" ||
    name === "h2" ||
    name === "h3" ||
    name === "h4" ||
    name === "h5" ||
    name === "h6"
  ) {
    const level = parseInt(name.charAt(1));
    const inner = html
      .replace(new RegExp(`<\/?${name}[^>]*>`, "gi"), "")
      .trim();
    return {
      type: "heading",
      attrs: { level },
      content: htmlToProseMirrorContent(inner),
    };
  }

  if (name === "p" || name === "figure") {
    const inner = html.replace(/<\/?(?:p|figure)[^>]*>/gi, "").trim();
    if (!inner) return null;
    const content = htmlToProseMirrorContent(inner);
    return content.length ? { type: "paragraph", content } : null;
  }

  const text = html.trim();
  if (text) {
    const content = htmlToProseMirrorContent(text);
    return content.length ? { type: "paragraph", content } : null;
  }

  return null;
}

function parseList(html: string, type: string): unknown {
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const items: unknown[] = [];
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(html)) !== null) {
    const inner = (m[1] ?? "").trim();
    const content = htmlToProseMirrorContent(inner);
    items.push({
      type: "listItem",
      content: content.length ? [{ type: "paragraph", content }] : undefined,
    });
  }
  return { type: type === "ul" ? "bulletList" : "orderedList", content: items };
}

function decodeEntities(text: string): string {
  if (!text.includes("&")) return text;
  return text
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#34;|&#x22;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

interface ProseMark {
  type: string;
  attrs?: Record<string, string>;
}

function htmlToProseMirrorContent(
  html: string,
): Array<{ type: string; text?: string; marks?: ProseMark[] }> {
  const result: Array<{ type: string; text?: string; marks?: ProseMark[] }> =
    [];

  html = html.replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, "");

  const inlineRe = /(<[^>]+>[^<]*<\/[^>]+>|[^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = inlineRe.exec(html)) !== null) {
    const seg = m[1] ?? "";
    if (!seg) continue;

    if (seg.startsWith("<")) {
      const text = decodeEntities(seg.replace(/<[^>]+>/g, ""));
      if (!text) continue;
      const marks: ProseMark[] = [];
      if (/<strong|<b>/i.test(seg)) marks.push({ type: "bold" });
      if (/<em|<i>/i.test(seg)) marks.push({ type: "italic" });
      if (/<code>/i.test(seg)) marks.push({ type: "code" });
      if (/<a\s/.test(seg)) {
        const href = seg.match(/href="([^"]+)"/)?.[1] ?? "";
        marks.push({ type: "link", attrs: { href } });
      }
      if (/<s>|<strike>|<del>/i.test(seg)) marks.push({ type: "strike" });
      result.push({ type: "text", text, ...(marks.length ? { marks } : {}) });
    } else {
      const t = decodeEntities(seg.trim());
      if (t) result.push({ type: "text", text: t });
    }
  }

  return result;
}

async function verifySubstackConnection(): Promise<{
  ok: boolean;
  name?: string;
}> {
  const sid = process.env.SUBSTACK_SID;
  if (!sid) return { ok: false };
  try {
    const h = substackHeaders();
    const r = await fetch(`${SUBSTACK_PUB}/handle/options`, { headers: h });
    if (!r.ok) return { ok: false };
    const d = (await r.json()) as {
      potentialHandles?: Array<{ type: string; handle: string }>;
    };
    const existing = d.potentialHandles?.find((h) => h.type === "existing");
    if (!existing?.handle) return { ok: false };
    const r2 = await fetch(
      `${SUBSTACK_PUB}/user/${existing.handle}/public_profile`,
      { headers: h },
    );
    if (!r2.ok) return { ok: false };
    const p = (await r2.json()) as { name?: string };
    return { ok: true, name: p.name ?? existing.handle };
  } catch {
    return { ok: false };
  }
}

async function publishSubstackArticle(
  title: string,
  markdown: string,
  coverImage?: string,
  tags?: string[],
  draftOnly = false,
): Promise<string | null> {
  const h = substackHeaders();

  // Strip frontmatter
  let body = markdown.replace(/^---[\s\S]*?---\n?/, "");

  // Resolve relative image/video URLs
  body = body.replace(
    /!\[([^\]]*)\]\((\/[^)]+)\)/g,
    (_, alt, src) => `![${alt}](${SITE_URL}${src})`,
  );
  body = body.replace(
    /(<source\s+src=")(\/[^"]+)/g,
    (_, pre, src) => `${pre}${SITE_URL}${src}`,
  );

  const proseMirrorBody = mdToProseMirror(body);

  const payload: Record<string, unknown> = {
    draft_title: title,
    draft_body: proseMirrorBody,
    type: "newsletter",
    draft_bylines: [],
    audience: "everyone",
    write_comment_permissions: "everyone",
  };

  if (coverImage) {
    payload.cover_image = resolveImage(coverImage);
  }
  if (tags && tags.length > 0) {
    payload.postTags = tags;
  }

  // Create draft
  const r = await fetch(`${SUBSTACK_PUB}/drafts`, {
    method: "POST",
    headers: h,
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(
      `Draft creation failed [${r.status}]: ${t.substring(0, 200)}`,
    );
  }
  const draft = (await r.json()) as { id: number };

  if (draftOnly) {
    const url = `https://anselmlong.substack.com/p/editor?draft=${draft.id}`;
    return url; // Return editor URL for manual publishing
  }

  // Publish the draft
  const r2 = await fetch(`${SUBSTACK_PUB}/drafts/${draft.id}/publish`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      send_email: false,
      write_comment_permissions: "everyone",
    }),
  });
  if (!r2.ok) {
    const t = await r2.text();
    throw new Error(`Publish failed [${r2.status}]: ${t.substring(0, 200)}`);
  }
  const published = (await r2.json()) as { slug?: string };
  return published.slug
    ? `https://anselmlong.substack.com/p/${published.slug}`
    : null;
}

async function verifyAndReadPost(slug: string) {
  const post = readPost(slug);
  if (!post) {
    console.error(`  ✗ Not found: ${slug}`);
    return null;
  }
  return post;
}

async function main() {
  const args = process.argv.slice(2);
  const publishMode = args.includes("--publish");
  const draftOnly = args.includes("--draft");
  const postIdx = args.indexOf("--post");
  const singlePost = postIdx !== -1 ? args[postIdx + 1] : null;
  const formatIdx = args.indexOf("--format");
  const format = (formatIdx !== -1 ? args[formatIdx + 1] : "both") as
    | "substack"
    | "medium"
    | "both";

  const slugs = singlePost ? [singlePost] : getSlugs();
  if (!slugs.length) {
    console.log("No blog posts found in public/blogs/");
    process.exit(0);
  }

  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }

  // ── Export Mode ──────────────────────────────────────────────
  if (!publishMode) {
    if (!["substack", "medium", "both"].includes(format)) {
      console.error(`Invalid format: ${format}`);
      process.exit(1);
    }
    console.log(`\nExporting ${slugs.length} posts (${format})\n`);
    for (const slug of slugs) {
      const post = await verifyAndReadPost(slug);
      if (!post) continue;
      const title = post.data.title ?? slug.replace(/-/g, " ");
      console.log(`  → ${title}`);

      if (format === "substack" || format === "both") {
        const dir = path.join(OUTPUT_DIR, "substack");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, `${slug}.md`),
          markdownToSubstackMarkdown(post.content, post.data),
          "utf8",
        );
      }

      if (format === "medium" || format === "both") {
        const dir = path.join(OUTPUT_DIR, "medium");
        fs.mkdirSync(dir, { recursive: true });
        const html = markdownToMediumHTML(post.content, post.data);
        fs.writeFileSync(path.join(dir, `${slug}.html`), html, "utf8");
        const meta = {
          title,
          contentFormat: "html",
          content: html,
          tags: post.data.tags ?? [],
          publishStatus: "draft",
        };
        fs.writeFileSync(
          path.join(dir, `${slug}.meta.json`),
          JSON.stringify(meta, null, 2),
          "utf8",
        );
      }
    }
    console.log(`\n✓ Exported to ${OUTPUT_DIR}/`);
    console.log(
      "\nSubstack: Upload .md files from cross-post-output/substack/ via Dashboard → Settings → Import",
    );
    console.log(
      "Medium:   Use .meta.json with Medium API (set MEDIUM_ACCESS_TOKEN env var)",
    );
    return;
  }

  // ── Substack Publish Mode ────────────────────────────────────
  console.log("\n═══════════════════════════════════════");
  console.log("  Substack Publish Mode");
  console.log("═══════════════════════════════════════\n");

  const conn = await verifySubstackConnection();
  if (!conn.ok) {
    console.error(
      "✗ Could not connect to Substack. Check SUBSTACK_SID in .env",
    );
    process.exit(1);
  }
  console.log(`  ✓ Connected: ${conn.name}\n`);

  let published = 0;
  let failed = 0;

  for (const slug of slugs) {
    const post = await verifyAndReadPost(slug);
    if (!post) {
      failed++;
      continue;
    }

    const title = post.data.title ?? slug.replace(/-/g, " ");
    process.stdout.write(`  Publishing: ${title} ... `);

    try {
      const url = await publishSubstackArticle(
        title,
        post.raw,
        post.data.image,
        post.data.tags,
        draftOnly,
      );
      if (url) {
        console.log(`✓`);
        console.log(`    ${url}`);
      } else {
        console.log(`✓ (no URL returned)`);
      }
      published++;
    } catch (err) {
      const error = err as Error;
      console.log(`✗`);
      console.log(`    ${error.message}`);
      failed++;
    }
  }

  console.log(`\n  Published: ${published}  Failed: ${failed}`);
  if (draftOnly) {
    console.log("  (drafts only — publish from Substack editor)\n");
  }
}

// ── Export helpers (for non-publish mode) ──────────────────────

function markdownToSubstackMarkdown(content: string, data: MatterData): string {
  let c = content.replace(/^---[\s\S]*?---\n?/, "");
  c = c.replace(
    /!\[([^\]]*)\]\((\/[^)]+)\)/g,
    (_, alt, src) => `![${alt}](${SITE_URL}${src})`,
  );
  c = c.replace(
    /(<source\s+src=")(\/[^"]+)/g,
    (_, pre, src) => `${pre}${SITE_URL}${src}`,
  );
  const h: string[] = [];
  if (data.image) h.push(`![Cover](${resolveImage(data.image)})\n`);
  if (data.tags?.length) h.push(`*Tags: ${data.tags.join(", ")}*\n`);
  return h.join("\n") + c;
}

function markdownToMediumHTML(content: string, data: MatterData): string {
  let c = content.replace(/^---[\s\S]*?---\n?/, "");
  c = c.replace(
    /!\[([^\]]*)\]\((\/[^)]+)\)/g,
    (_, alt, src) => `<img src="${SITE_URL}${src}" alt="${alt}">`,
  );
  c = c.replace(
    /(<source\s+src=")(\/[^"]+)/g,
    (_, pre, src) => `${pre}${SITE_URL}${src}`,
  );
  let html = marked.parse(c, { async: false }) as string;
  if (data.image) {
    html =
      `<p><img src="${resolveImage(data.image)}" alt="${data.title}"></p>\n` +
      html;
  }
  return html;
}

main().catch(console.error);
