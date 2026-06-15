## Resume-Ready Points

### Software Engineering Internship at Visa

**Role:** Software Engineering Intern
**Period:** May 2026 - Present

**Key Achievements:**

- Currently interning as a software engineering intern at Visa.
- Building production-minded software in the payments space.
- Applying full-stack engineering, testing, and delivery practices from prior AI, RAG, and platform projects.

### Project Aegis (National Cybersecurity Olympiad)

**Role:** Lead Developer
**Period:** January 2026 - March 2026

**Key Achievements:**

- Led development of a controlled AI-access platform for 80 CTF participants.
- Built guardrails, LLM middleware, and a RAG system so participants could use AI without turning the competition into a model benchmark.
- Introduced a token budget so teams had to prompt carefully and use AI surgically.
- Helped ship the platform over 2 months with 316 PRs across the team.

### AI-Powered Portfolio Website (Personal Project)

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, tRPC, LangChain.js, OpenAI API, PGVector, PostgreSQL, Bun

**Key Achievements:**

- Built a full-stack AI-powered portfolio featuring streaming RAG (Retrieval-Augmented Generation) chat, responsive GSAP animations, and a polished UI using LangChain.js and OpenAI API.
- Implemented a low-latency server pipeline (LangChain.js + OpenAI + pgvector) with connection-pooled Postgres and reusable LLM/embedding clients to support interactive, context-aware Q&A about my work and experience.
- Implemented vector search with PGVector and PostgreSQL for context-aware question answering across ~65 portfolio documents
- Optimized RAG pipeline latency by 70% (10s → 3s) through:
  - Singleton pattern for database connection pooling and LLM client reuse
  - Conditional question rewriting using NLP heuristics to skip unnecessary LLM calls
  - Limited conversation history window (5 messages) to reduce prompt token usage
- Designed and implemented streaming API endpoint with real-time response delivery using ReadableStream and TextEncoder

**Technical Highlights:**

- Prompt engineering: history-aware question rewriting and context-grounded response generation
- Database optimization: connection pool tuning
- Modern React patterns: custom hooks, context providers, and controlled/uncontrolled component dual-mode support
- Full TypeScript type safety across frontend and backend with strict mode enabled
