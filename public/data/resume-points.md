

## Resume-Ready Points

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