TODOs:
- [ ] Optimise RAG pipeline - cache common prompts (semantic caching?)
- [X] Prettify landing page
- [X] Add blog posts (need more)
- [ ] Add photography gallery (disabled for now)
- [X] Add example prompts
- [X] Add text switching feature to show my different roles.

bugs
- [X] blog doesn't show up on phone
- [X] landing page

---

## Resume-Ready Points

### AI-Powered Portfolio Website (Personal Project)
**Tech Stack:** Next.js, TypeScript, React 19, LangChain.js, OpenAI API, PGVector, PostgreSQL, Bun

**Key Achievements:**
- Built a full-stack AI-powered portfolio with streaming RAG (Retrieval-Augmented Generation) chatbot using LangChain.js and OpenAI GPT-4o-mini
- Implemented vector search with PGVector and PostgreSQL for context-aware question answering across ~65 portfolio documents
- Optimized RAG pipeline latency by 70% (10s → 3s) through:
  - Singleton pattern for database connection pooling and LLM client reuse
  - LRU cache for retrieval results (100-entry in-memory store)
  - Conditional question rewriting using NLP heuristics to skip unnecessary LLM calls
  - Limited conversation history window (6 messages) to reduce prompt token usage
- Designed and implemented streaming API endpoint with real-time response delivery using ReadableStream and TextEncoder
- Created responsive UI with custom AI-elements component library and dynamic typing animations with grammatical awareness ("a/an" article selection)
- Added comprehensive performance instrumentation: phase-level timing logs for init, retrieval, rewrite, and LLM operations
- Integrated T3 stack (tRPC, Prisma, NextAuth) for type-safe API calls and database management

**Technical Highlights:**
- Server-side streaming with chunked transfer encoding for low TTFB (time to first byte)
- Prompt engineering: history-aware question rewriting and context-grounded response generation
- Database optimization: connection pool tuning
- Modern React patterns: custom hooks, context providers, and controlled/uncontrolled component dual-mode support
- Full TypeScript type safety across frontend and backend with strict mode enabled