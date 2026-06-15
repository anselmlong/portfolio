# Second Brain — LLM Wiki User Manual

This project has a persistent Obsidian wiki ("second brain") that any LLM can query instead of re-reading source code.

## Location

`C:/Users/ansel/OneDrive/Documents/Obsidian Vault/Portfolio Website/`

## Day-to-Day Workflows

### Answering Questions
1. Open `index.md` → use the Semantic Lookup table
2. Follow wikilinks to drill into details
3. If info is missing → check source code → file a gap in `log.md`

### After Editing Code
1. Mark affected wiki pages stale:
   ```bash
   grep -rl "source_file: src/path/to/file" "Wiki/"
   ```
2. Set `status: stale` in the matched page's frontmatter

### After a Milestone or Merge
1. Run `scripts/sync-vault.sh` (copies project docs → Sources/)
2. Run `/wiki-ingest` in Claude Code (updates Wiki/ from Sources/)

## Slash Commands

| Command | Description |
|---------|-------------|
| `/wiki-ingest` | Diff-based update of Wiki/ pages from changed sources |

## Maintenance Schedule

- **Every session:** Check `log.md` for open gaps; resolve if possible
- **After every merge:** Run sync + ingest
- **Weekly:** Open `Wiki/_Health.md` in Obsidian to check for stale/orphan pages

## Health Check

Open `Wiki/_Health.md` in Obsidian (requires Dataview plugin) to see:
- Stale pages needing updates
- Old pages (>30 days without update)
- Orphan pages (no inbound links)
- Schema violations (missing frontmatter)

## Navigation Cheat Sheet

| I want to know... | Go to... |
|---|---|
| Project overview | `Wiki/Architecture/Architecture Overview.md` |
| How the chat works | `Wiki/RAG-Chat/RAG Chat Overview.md` |
| Database models | `Wiki/Database/Prisma Schema.md` |
| All env vars | `Wiki/Infrastructure/Environment Variables.md` |
| What's planned | `Wiki/Agents/Planned Features Roadmap.md` |
| Anselm's skills | `Wiki/Resume & Skills Summary.md` |
| Every source file | `Wiki/Architecture/Project File Map.md` |
| Blog post catalog | `Wiki/Blog/Blog Post Index.md` |
