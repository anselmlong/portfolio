# Conversation-first portfolio preview

Preview only. The live domain must not change until Anselm approves this preview.

## How a free-text message is answered

Two requests run in parallel:

- **`/api/chat`** writes the answer. It is the existing portfolio RAG: pgvector retrieval from `portfolio_docs_v2`, then a streamed OpenAI reply in Anselm's own first-person voice. The system prompt is unchanged from `main`; keep it that way.
- **`/api/reveal`** asks Jev (TypeSafe `jev-latest`) to choose one trusted card to show beside the answer: a project, experience, photos, the typing game, contact, or nothing. Jev returns only an intent and a known project name. It never writes text, HTML or code, and the page renders its own components. If Jev is unavailable the answer still appears, just without a card.

Suggested reply chips stay instant and deterministic, with no API calls.

A small line under the composer says replies are AI-generated.

## Configuration

- `/api/chat` uses the existing server-side `OPENAI_API_KEY`, `CHAT_MODEL`, `EMBED_MODEL` and `DATABASE_URL`.
- `/api/reveal` needs `TYPESAFE_API_KEY`, which the owner set in Vercel as a Sensitive variable. **Do not remove it.** `vercel env pull` only returns a placeholder for it, so Jev can only be exercised on a deployed preview.
- `/api/reveal` only runs when `VERCEL_ENV=preview`, and it enforces a same-origin check plus a per-instance request brake. It needs a durable budget before any production release.

## Chat failures

`/api/chat` does init, question rewrite and retrieval before it starts streaming. If any of those fail, it returns a JSON error with `code: "init" | "rewrite" | "retrieval"` (503 or 502) and logs `[RAG] <phase> failed`. A model failure mid-answer errors the stream rather than streaming an apology as if it were the answer.

The page shows a message that names the failure class, keeps the visitor's draft, and logs the status and `x-vercel-id`. Its timeout covers only the wait for the first byte, and it doesn't rely on `AbortSignal.any`, which older iOS in-app browsers lack.

To investigate a report, run `vercel logs --environment preview --status-code 5xx` and look for `[RAG]` lines.
