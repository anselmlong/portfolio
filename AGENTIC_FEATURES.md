# Agentic Portfolio Chatbot — Feature Plan

An AI-powered chatbot embedded in the portfolio site, acting as a recruitment portal and interactive assistant for visitors.

---

## Core Features

### 1. Agentic Chatbot with RAG
- LangGraph-based conversational agent with retrieval-augmented generation
- Corpus: blog posts, project READMEs, resume, experience docs
- Visitors can ask natural language questions about Anselm's work, skills, and experience

### 2. Calendar Integration
- Google Calendar API integration (via GoG)
- Visitors can see Anselm's free time slots
- Schedule an interview directly through the chatbot
- Sends email confirmation to both parties

### 3. Email Integration
- Gmail API integration (via GoG)
- Confirmation emails for scheduled interviews
- Follow-up emails after recruiter interactions (with approval)

### 4. Text Anselm
- Direct Telegram integration
- Visitors send a message through the chatbot → delivered straight to Anselm's Telegram
- Supports back-and-forth if Anselm replies

### 5. Tailored Resume (LaTeX)
- Visitor provides a job description
- Agent generates a tailored resume using LaTeX templates
- Adjusts emphasis, ordering, and highlights based on JD requirements
- Downloadable as PDF

### 6. GitHub Integration
- "What's Anselm working on right now?"
- Pulls recent commits, PRs, and activity from GitHub
- Summarizes current projects and tech stack in use

### 7. Project Deep-Dive Agent
- Visitor asks about a specific project (e.g., "tell me about Optifiner")
- Agent pulls README, recent commits, tech stack, and architecture
- Generates a structured walkthrough — not just a listing, but an explanation
- Links to live demos, repos, and related blog posts where available

### 8. Skill Matching
- Visitor pastes a job description
- Agent maps Anselm's skills and projects to the JD requirements
- Highlights strengths, relevant experience, and any gaps
- Generates a fit score with reasoning

### 9. Mock Interview
- Separate system prompt mode
- Conducts a mock behavioral/technical interview based on Anselm's experience
- Can be used by visitors as a demo, or by Anselm for practice

---

## Priority

| Feature | Priority |
|---|---|
| Agentic Chatbot (RAG) | Core |
| Calendar Integration | Core |
| Email Integration | Core |
| Text Anselm | Core |
| Tailored Resume (LaTeX) | v1 |
| GitHub Integration | v1 |
| Project Deep-Dive Agent | v1 |
| Skill Matching | v1 |
| Mock Interview | v2 |

---

## Architecture (TBD)
- **Agent framework:** LangGraph
- **Vector store:** Pinecone / Chroma (TBD)
- **LLM:** OpenAI GPT-4o / Claude (TBD)
- **Frontend:** Embedded chat widget on portfolio site
- **Backend:** Python API (FastAPI or similar)
- **Integrations:** Google Calendar, Gmail, Telegram Bot API, GitHub API

---

*Created: 2026-02-04*
*Status: Planning*
