
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

- Add blog posts to `/blog`
- Add photos to `/photos`
- Update hero text and roles in `page.tsx`
- Replace resume in `public/resume.pdf`


## References

- Wang, X., Wang, Z., Gao, X., Zhang, F., Wu, Y., Xu, Z., Shi, T., Wang, Z., Li, S., Qian, Q., Yin, R., Lv, C., Zheng, X., Xuanjing Huang, School of Computer Science, Fudan University, Shanghai, China, & Shanghai Key Laboratory of Intelligent Information Processing. (2024). Searching for best practices in Retrieval-Augmented Generation [Preprint]. arXiv. https://arxiv.org/abs/2407.01219v1

## License

MIT
