# Handoff: familytree.anselmlong.com

**What:** Single-file, zero-build family tree site (Kapitan Yap Kwan Seng genealogy). Code is done, not deployed to the custom domain yet.

**Where:** `anselmlong/portfolio`, branch `claude/pending-task-mv4d0m`, path `familytree/` (`index.html` + `README.md` with full deploy options). Branch is pushed but not merged to main.

**To deploy — pick one (both documented in `familytree/README.md`):**
- **Vercel:** new project from this repo, Root Directory = `familytree`, Framework = Other. Add domain `familytree.anselmlong.com` in project settings, then point DNS at the CNAME Vercel gives you.
- **OVH VPS / nginx:** `scp -r familytree/ user@vps:/var/www/tree`, nginx server block + certbot, steps are in the README.

**Loose ends:**
- No portrait image bundled — `yap-kwan-seng.jpg` (Wikipedia, public domain) was never fetched, so the Kapitan's card falls back to a monogram. Cosmetic only, site works fine without it. Drop the jpg beside `index.html` if wanted later.
- A Vercel token got pasted into this chat earlier and was never used (this sandbox couldn't reach `api.vercel.com`). Rotate it before/instead of reusing it for this deploy.
- A live preview also exists as a private Claude artifact (not a real deploy target, just for eyeballing): https://claude.ai/code/artifact/578cc6e0-df63-48ce-bfe6-fdd57d8b9757
