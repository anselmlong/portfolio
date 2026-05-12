# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence — without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Framework

**vitest** v4 + **@testing-library/react** + **@testing-library/jest-dom**

## Running Tests

```bash
npm test              # run all tests once
npm run test:watch    # watch mode (re-runs on file change)
npm run test:coverage # with coverage report
```

Tests live in `src/test/` and colocated `*.test.ts` / `*.test.tsx` files.

## Test Layers

| Layer | What | Where | When |
|-------|------|-------|------|
| Unit | Pure functions, utilities | `src/test/*.test.ts` | Every function |
| Integration | Components with state/context | `src/test/*.test.tsx` | Forms, interactive UI |
| Smoke | Critical paths work end-to-end | browser / playwright | Pre-deploy |

## Conventions

- Files: `ComponentName.test.tsx`, `util-name.test.ts`
- Imports: `import { describe, it, expect } from "vitest"`
- Setup: `@testing-library/jest-dom` matchers auto-imported via `src/test/setup.ts`
- Assertions: test what the code DOES, never `expect(x).toBeDefined()`
