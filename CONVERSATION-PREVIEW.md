# Conversation-first portfolio preview

Replaces the rejected copper homepage with a neutral, ChatGPT-like conversation and a separate charcoal project showcase. The live domain must not be changed until Anselm approves this preview.

## Changed

- An accumulating conversation: selected replies become user messages, followed by animated guide responses and inline project cards, experience details, photography, or a local typing round.
- Free-text questions go through server-side Jev intent/project choices and an OpenAI text response. Closed-set UI components and trusted project links—not model-generated HTML.
- Explicit close/reopen, new chat, browse-work exit, responsive catalog filters, and redesigned about/contact sections.
- Shared project/experience data drives the catalog and AI context. OGP Maps: Software Engineer Intern, August 2026–present. Excludes govML, Betaview, BCE vote and resiwash.
- Existing blog/photo routes and old chat APIs are preserved, not redesigned in this preview. Existing standalone photo website is untouched.

## Configuration and safety

- `TYPESAFE_API_KEY` is a Vercel Preview-only Secret; never use a `NEXT_PUBLIC_` name. The key is not pulled into this checkout.
- Uses `jev-latest` via https://api.typesafe.ai/v1/systemone. Intent and project decisions are confidence-gated at 0.65; this initial threshold needs evaluation, not a promise of calibrated product accuracy.
- Uses existing server-side `OPENAI_API_KEY` and `CHAT_MODEL`. No provider calls for suggested replies.
- Request byte/message limits, bounded output, timeouts, no automatic provider retries, no prompt or credential logging, and graceful errors/curated fallback.
- The new endpoint rejects every environment except Vercel Preview. Vercel project protection was verified as `all_except_custom_domains`. Do not alias this branch to a public custom domain.
- The 40 requests/10-minute counter is per process and can reset/scale; it is only an additional brake inside the protected preview, NOT a durable spend cap.
- Before public release: install distributed rate/spend limits, audit existing chat endpoints, configure production key, evaluate Jev decisions, then deliberately remove the preview-only gate. Do not merge this preview as production-ready AI.

## Verification

- Unit/component/API tests cover curated flows, accumulated history, filters, repeated game IDs, AI success/error recovery, draft preservation, reset races, invalid payloads/origins, confidence fallback, and the production gate.
- Desktop/mobile browser checks exercise inline games, project reveals, close/reopen, filters, mocked AI success and failure, overflow and browser errors.
- Production build and independent finish review are part of preview handoff. Live provider smoke testing is recorded in the PR, not inferred from mocked tests.

Provider documentation: https://docs.typesafe.ai/api and https://docs.typesafe.ai/introduction.
