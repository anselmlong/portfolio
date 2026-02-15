# AGENTS.md - AI Coding Agent Guidelines

> Portfolio website with AI-powered RAG chat, built with Next.js 15, React 19, TypeScript, and LangChain.

## Quick Reference

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun run dev`          | Start development server                 |
| `bun run build`        | Production build                         |
| `bun run check`        | Lint + typecheck (run before committing) |
| `bun run lint`         | ESLint only                              |
| `bun run lint:fix`     | ESLint with auto-fix                     |
| `bun run typecheck`    | TypeScript type checking                 |
| `bun run format:write` | Format with Prettier                     |
| `bun run format:check` | Check formatting                         |

### Database Commands

| Command               | Description               |
| --------------------- | ------------------------- |
| `bun run db:push`     | Push schema changes (dev) |
| `bun run db:generate` | Generate migration        |
| `bun run db:migrate`  | Deploy migrations         |
| `bun run db:studio`   | Open Prisma Studio        |

### Testing

No test framework configured. Verify changes manually or add tests as needed.

---

## Tech Stack

- **Runtime**: Bun 1.2+
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4, Radix UI primitives
- **Language**: TypeScript 5.8 (strict mode)
- **Database**: PostgreSQL + Prisma ORM + pgvector
- **API**: tRPC 11 for type-safe endpoints
- **AI/RAG**: LangChain.js, OpenAI embeddings, PGVectorStore

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── _components/        # Page-specific components
│   ├── api/                # API routes (including /api/chat for RAG)
│   └── (routes)/           # Page routes (blog, photos, etc.)
├── components/             # Shared/reusable UI components
│   └── ai-elements/        # Chat UI primitives
├── lib/                    # Utility functions
├── server/                 # Server-side code
│   ├── api/                # tRPC routers and procedures
│   ├── auth/               # NextAuth configuration
│   ├── db.ts               # Prisma client singleton
│   └── pg.ts               # Raw pg Pool for vector operations
├── trpc/                   # tRPC client setup
├── constants/              # App constants
├── styles/                 # Global CSS
└── env.js                  # Environment variable validation
```

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** with `noUncheckedIndexedAccess`
- Prefer `type` over `interface` for type definitions
- Use type composition with `&` and utility types (`Omit`, `Pick`, etc.)
- Unused variables: prefix with `_` (e.g., `_unused`)

```typescript
// GOOD: Type imports (enforced by ESLint)
import { type ReactNode } from "react";
import type { UIMessage } from "ai";

// GOOD: Type composition
type ButtonProps = ComponentProps<"button"> & {
  variant?: "default" | "ghost";
};

// BAD: Suppressing types
const x = something as any; // Never do this
// @ts-ignore  // Never use this
```

### Imports

1. External libraries first (React, Next.js, third-party)
2. Internal imports with `~/` alias second
3. Type imports use inline syntax

```typescript
// External
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Internal (use ~/ alias, NOT relative paths)
import { cn } from "~/lib/utils";
import { type AppRouter } from "~/server/api/root";
```

### Path Alias

Always use `~/` for imports from `src/`:

```typescript
// GOOD
import { db } from "~/server/db";

// BAD
import { db } from "../../../server/db";
```

### Naming Conventions

| Type                | Convention      | Example                     |
| ------------------- | --------------- | --------------------------- |
| Components          | PascalCase      | `ChatInterface.tsx`         |
| Functions/variables | camelCase       | `handleSubmit`, `isLoading` |
| Files (components)  | PascalCase      | `TypingLine.tsx`            |
| Files (utilities)   | kebab-case      | `query-client.ts`           |
| Folders             | kebab-case      | `ai-elements/`              |
| Types               | PascalCase      | `ChatRequest`               |
| Constants           | SCREAMING_SNAKE | `EXAMPLE_PROMPTS`           |

### React Components

```typescript
"use client"; // Required for client components

import { useState } from "react";
import { cn } from "~/lib/utils";

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className={cn("base-styles", className)}>
      {title}
    </div>
  );
}
```

### Server Components & Data Fetching

```typescript
// Server component (default in App Router)
import "server-only"; // Prevents client import
import { api } from "~/trpc/server";

export default async function Page() {
  const data = await api.post.getAll();
  return <div>{/* render */}</div>;
}
```

### tRPC Procedures

```typescript
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.text}` };
    }),

  secret: protectedProcedure.query(({ ctx }) => {
    // ctx.session.user is guaranteed non-null
    return { user: ctx.session.user };
  }),
});
```

### Error Handling

- Use `TRPCError` for API errors with appropriate codes
- Use Zod for input validation (errors auto-propagate to client)
- Wrap async operations in try/catch with meaningful error messages

```typescript
import { TRPCError } from "@trpc/server";

if (!resource) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Resource not found",
  });
}
```

### Styling with Tailwind

- Use `cn()` utility for conditional classes (from `~/lib/utils`)
- Tailwind classes are auto-sorted by Prettier plugin
- Prefer Tailwind utilities over custom CSS

```typescript
import { cn } from "~/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

---

## Environment Variables

Defined in `src/env.js` with Zod validation. Required variables:

| Variable              | Description                    |
| --------------------- | ------------------------------ |
| `DATABASE_URL`        | PostgreSQL connection (pooled) |
| `DIRECT_DATABASE_URL` | PostgreSQL direct connection   |
| `OPENAI_API_KEY`      | OpenAI API key for RAG         |
| `AUTH_SECRET`         | NextAuth secret                |
| `AUTH_DISCORD_ID`     | Discord OAuth ID               |
| `AUTH_DISCORD_SECRET` | Discord OAuth secret           |

Optional: `CHAT_MODEL`, `EMBED_MODEL`, `SKIP_ENV_VALIDATION`

---

## Database Patterns

### Prisma (ORM)

```typescript
import { db } from "~/server/db";

const posts = await db.post.findMany({
  where: { createdById: userId },
});
```

### Raw PostgreSQL (for pgvector)

```typescript
import { pool } from "~/server/pg";

const result = await pool.query(
  "SELECT * FROM langchain_pg_embedding WHERE ...",
);
```

---

## Common Gotchas

1. **Client vs Server Components**: Add `"use client"` directive for components using hooks, event handlers, or browser APIs.

2. **Environment Variables**: Client-side env vars must be prefixed with `NEXT_PUBLIC_`.

3. **Type Imports**: ESLint enforces inline type imports. Use `import { type X }` not `import type { X }`.

4. **Singleton Pattern**: DB clients use `globalThis` caching to avoid connection exhaustion in dev.

5. **Vercel Deployment**: Update environment variables in Vercel dashboard after changing `.env`.
