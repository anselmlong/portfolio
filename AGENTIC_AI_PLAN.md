# Agentic AI Portfolio Chat – Implementation Plan (Rough)

## Goal
Add a public portfolio chatbox powered by LangGraph that can:
- build role‑specific resume bullets
- perform skills gap analysis vs a target job
- run behavioural interview prep
- (optionally) pull proof‑of‑work from GitHub
- send contact messages to Gmail

---

## Phase 0 – Foundations (1–2 days)
- [ ] Add **chat UI** to portfolio homepage
- [ ] Create **/api/chat** endpoint (Next.js)
- [ ] Add basic **rate‑limit** and abuse protection
- [ ] Define **allowlist** for repos and sources

---

## Phase 1 – Core Agent Flows (3–5 days)
### 1) Resume Builder
- Inputs: role title, target skills, seniority
- Outputs: 4–6 bullet points, tailored to role
- Uses: project summaries + GitHub activity

### 2) Skills Gap Analyzer
- Inputs: job description (paste)
- Outputs: missing skills, suggested projects to highlight, roadmap

### 3) Behavioural Interview Prep
- Inputs: role + seniority
- Outputs: behavioural questions + STAR structure feedback

---

## Phase 2 – Proof‑of‑Work + Inspector (2–3 days)
- Pull GitHub PRs/commits (allowlist)
- Summarize weekly activity
- “Show me proof” → link to repo/PR

---

## Phase 3 – Contact Me Agent (1–2 days)
- Minimal form: **email + message**
- Gmail send integration (OAuth)
- Confirmation step before send

---

## Technical Architecture
```
UI (Next.js)
  -> /api/chat (LangGraph)
      -> Intent Router
      -> Retrieval (blog + repos)
      -> Reasoner (LLM)
      -> Action (email / link)
```

### Suggested Stack
- Frontend: **Next.js + Vercel AI SDK**
- Orchestration: **LangGraph**
- Retrieval: **local blog posts + GitHub API**
- Storage (optional): **SQLite / Supabase**
- Email: **Gmail API** (OAuth)

---

## Milestones (Suggested)
- **Week 1:** UI + Chat API + Resume Builder MVP
- **Week 2:** Gap Analyzer + Behavioural Prep
- **Week 3:** GitHub Inspector + Contact‑Me Agent

---

## Open Decisions
- Final allowlist of repos
- Gmail recipient address
- Whether to store chat logs
- Deployment: Vercel vs custom server

