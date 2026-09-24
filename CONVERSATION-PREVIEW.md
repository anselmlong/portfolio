# Conversation-first portfolio preview

Replaces the rejected copper homepage with a neutral, ChatGPT-like conversation and a separate charcoal project showcase. The live domain must not be changed until Anselm approves this preview.

## Changed

- An accumulating conversation: selected replies become user messages, followed by animated guide responses and inline project cards, experience details, photography, or a local typing round.
- Free-text questions use the existing `/api/chat` RAG: it retrieves from the `portfolio_docs_v2` pgvector collection and streams an OpenAI answer. Suggested choices remain instant and deterministic; no Jev call or model-generated UI.
- Explicit close/reopen, new chat, browse-work exit, responsive catalog filters, and redesigned about/contact sections.
- Shared project/experience data drives the catalog and AI context. OGP Maps: Software Engineer Intern, August 2026–present. Excludes govML, Betaview, BCE vote and resiwash.
- Existing blog/photo routes and old chat APIs are preserved, not redesigned in this preview. Existing standalone photo website is untouched.

## Configuration and safety

- Uses the site's existing server-side `OPENAI_API_KEY`, `CHAT_MODEL`, database connection, and pgvector store. Retrieved project notes are reference data; the guide must say when it does not know, and raw visitor prompts are not logged.
- This reuses the existing RAG route rather than adding another model/API layer. The route streams plain text; all clickable project links remain trusted, static portfolio UI.
- The existing `/api/chat` route is also used by the old site. Production remains on the old deployment until the preview is reviewed and explicitly released.
- The preview deployment remains Vercel-protected. The old preview-only TypeSafe credential is no longer needed and should be removed from Preview environment variables.

## Verification

- The RAG path requires the existing OpenAI and database configuration. If those are unavailable, the guide reports an error and preserves the visitor's draft.
- The preview branch should be redeployed and reviewed before any production release.
