# Wiki Ingest — Diff-Based Update

Update the Obsidian wiki from changed project files. This is the primary maintenance workflow.

## Vault Location

`C:/Users/ansel/OneDrive/Documents/Obsidian Vault/Portfolio Website/`

## Steps

### 1. Identify changed files

```bash
git diff HEAD~1 --name-only
```

If no recent commit, use `git status --short` to find modified files.

### 2. Map to Sources/ equivalents

For each changed file, determine if it maps to a `Sources/` file:
- `AGENTS.md` → `Sources/Docs/AGENTS.md`
- `AGENTIC_FEATURES.md` → `Sources/Docs/AGENTIC_FEATURES.md`
- `.claude/memory/*.md` → `Sources/Memory/*.md`
- `.claude/rules/*.md` → `Sources/Rules/*.md`
- Root docs → `Sources/Docs/`

Run `sync-vault.sh` if any source files changed.

### 3. Find affected wiki pages

For each changed source file, find wiki pages that reference it:

```bash
grep -rl "source_file: <changed-path>" "Wiki/"
```

Also check for pages that reference the file in their `sources:` frontmatter.

### 4. Update wiki pages

For each affected wiki page:
1. Read the changed source file
2. Read the current wiki page
3. Update only the sections that changed (signatures, schemas, logic descriptions)
4. Bump `updated:` to today's date
5. Set `status: current`

For new source files with no wiki page:
1. Determine the appropriate domain and page type
2. Create a new page using the correct template from `Templates/`
3. Fill in all frontmatter and content sections
4. Add wikilinks from related existing pages

### 5. Resolve open gaps

Check `log.md` for entries tagged `gap`:

```bash
grep -n "\[gap\]" "Portfolio Website/log.md"
```

For each open gap, check if the changed files provide enough information to create or update the missing wiki page. If so, resolve the gap and remove the `[gap]` tag.

### 6. Create new entity pages

For any new files introduced by the changes (new components, routes, utilities):
- Create an entity page in the appropriate `Wiki/<domain>/` directory
- Add the page to `index.md`
- Add wikilinks from the domain overview page

### 7. Append to log

```markdown
## [YYYY-MM-DD HH:MM] ingest | <summary> | <N> pages affected

**Operation:** Diff-based ingest from <commit or change description>
**Changes:** - `Wiki/path` — what changed
**Result:** <N> pages updated, <N> pages created.
```

## Dry-Run Mode

To preview what would change without editing:
1. Run steps 1–3 only
2. Print the list of wiki pages that would be updated
3. Print any new pages that would be created
4. Do not edit any files
