# Anselm Long Portfolio Website

A modern, fast, AI-powered portfolio built with Next.js, TypeScript, Bun, and LangChain. Features a streaming RAG (Retrieval-Augmented Generation) chat, dynamic hero animations, and a clean, neutral design.

## Features

- **AI Chat (RAG):**
  - Ask questions about Anselm's experience, education, and projects.
  - Uses LangChain.js, OpenAI, and PGVector for context-aware answers.
  - Streams responses for instant feedback.
- **Animated Hero Section:**
  - Typing effect with dynamic "a/an" grammar.
  - Gradient text and animated orbs.
- **Polished UI:**
  - Neutral color scheme, subtle scrollbars, and responsive layout.
  - SVG icons for contact and resume download.
- **Blog & Gallery Placeholders:**
  - Ready for future content expansion.
- **Optimized Backend:**
  - Fast, connection-pooled Postgres.
  - Caching and prompt/token optimizations for low latency.

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** LangChain.js, OpenAI API, PGVector, Prisma
- **Database:** PostgreSQL (vector search via pgvector)
- **Build:** Bun

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```
2. **Set environment variables:**
   - `OPENAI_API_KEY` (required)
   - `DATABASE_URL` (Postgres connection string)
   - Optional: `CHAT_MODEL`, `EMBED_MODEL`
3. **Run locally:**
   ```bash
   bun run dev
   ```
4. **Build for production:**
   ```bash
   bun run build
   bun run start
   ```

## Project Structure

- `src/app/api/chat/route.ts` — RAG chat API (streaming, optimized)
- `src/app/_components/ChatInterface.tsx` — Chat UI
- `src/app/_components/Typing.tsx`, `TypingLine.tsx` — Typing animation
- `src/app/_components/topnav.tsx` — Top navigation bar
- `src/components/ai-elements/` — Custom UI primitives
- `src/server/pg.ts` — Singleton Postgres pool
- `public/resume.pdf` — Downloadable resume

## Optimizations

- Reused DB and LLM clients for speed
- Limited prompt history and retrieval size
- Conditional question rewrite to avoid extra LLM calls
- In-memory cache for repeat queries
- Initial time of about 10s per query -> 3s per query

## Customization

- Add blog posts to `public/blogs/` (see [Adding Blog Posts](#adding-blog-posts) below)
- Add photos to `/photos`
- Update hero text and roles in `page.tsx`
- Replace resume in `public/resume.pdf`

## Adding Blog Posts

Blog posts are Markdown files in `public/blogs/` with YAML frontmatter.

### Frontmatter format

```yaml
---
title: "Your Post Title"
date: "2026-01-15"
author: "Anselm Long"
image: "/blogs/images/your-cover.png" # optional, for cover + og:image
tags:
  - tag-one
  - tag-two
excerpt: "A one-line summary of your post."
---
```

**Required fields:** `title`, `date`, `excerpt`
**Optional fields:** `author`, `image`, `tags`

- **Reading time** is auto-computed from word count — no need to add it
- **Cover images** go in `public/blogs/images/` and are referenced as `/blogs/images/filename.png`
- **Image paths in body** should use relative paths (`/blogs/images/...`) — they get converted to absolute URLs on export
- Use **kebab-case** for filenames (e.g., `my-cool-project.md`)
- Posts are sorted by date (newest first)

### Cross-posting to Substack / Medium

```bash
# Export all posts (markdown/html files for manual import)
bun run cross-post

# Export a single post
bun run cross-post --post my-cool-project

# Export for one platform only
bun run cross-post --format substack
bun run cross-post --format medium

# Publish all posts to Substack (direct)
bun run cross-post --publish

# Publish a single post to Substack
bun run cross-post --publish --post my-cool-project

# Create draft on Substack (don't publish)
bun run cross-post --publish --draft --post my-cool-project
```

Output goes to `cross-post-output/`:

- **Substack:** Publish directly with `--publish`, or manually import the `.md` files via Dashboard → Settings → Import
- **Medium:** Use the `.meta.json` files with the [Medium API](https://medium.com/developers/documentation)

#### Substack Direct Publishing

The script converts your blog posts to Substack's ProseMirror format and publishes them via the API. It handles paragraphs, headings, images, bold, italic, links, code, blockquotes, and lists. Non-newsletter content (videos, complex embeds) should be reviewed in the Substack editor after publishing.

**Setup:**

1. `SUBSTACK_SID` is already configured in `.env`
2. Your publication is set to `anselmlong.substack.com`
3. Run `bun run cross-post --publish` to verify the connection

## References

- Wang, X., Wang, Z., Gao, X., Zhang, F., Wu, Y., Xu, Z., Shi, T., Wang, Z., Li, S., Qian, Q., Yin, R., Lv, C., Zheng, X., Xuanjing Huang, School of Computer Science, Fudan University, Shanghai, China, & Shanghai Key Laboratory of Intelligent Information Processing. (2024). Searching for best practices in Retrieval-Augmented Generation [Preprint]. arXiv. https://arxiv.org/abs/2407.01219v1

## License

MIT
