"""Skill match node — assesses Anselm's fit for a job description."""
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from state import AgentState

_ANSELM_PROFILE = """\
Anselm Long — Computer Science student at National University of Singapore
(First Class Honours, 2023–2027). Exchange at Tulane University (Fall 2025).

EXPERIENCE
- Lead Developer & PM, Project Aegis (Jan–Mar 2026): Full-stack AI-access
  platform for ~90 CTF participants. LLM-guard middleware, Docker Compose,
  130-test Playwright E2E suite, reviewed ~200 of 316 PRs.
- Machine Learning Intern, IMDA (May–Aug 2025): Modular ML pipeline; Isolation
  Forest, One-Class SVM, Random Forest, GCNs, LLM embeddings for SSL/TLS
  certificate classification (0.994 F1). LIME explainability.
- Strategic Digital Projects Intern, IMDA (May–Jul 2024): Microsoft/AWS content
  collaboration, Salesforce data consolidation (35% time saving).
- Freelance Photographer (2019–present): 300% revenue growth over 6 years.

PROJECTS
- Freak-Cha: CV hackathon project (Next.js, MediaPipe, YOLOv8) — Funniest Hack
  at HackHarvard 2025.
- VBook: JavaFX CLI contact manager, 4-person team lead.
- MiccDrop: React Native karaoke app with Spotify API, pitch detection.
- LinkedIn Shitpost Generator: AI web app (Next.js, Gemini, OpenRouter).
- Canvas Scraper: Python CLI, SQLite, Beautiful Soup.

SKILLS
Languages: Python, TypeScript, JavaScript, Java, SQL
Frameworks: Next.js, React, FastAPI, LangChain, LangGraph, Playwright
AI/ML: Scikit-learn, LLM fine-tuning, pgvector, LIME, Computer Vision
Tools: Docker, PostgreSQL, Git, Vercel, Railway, Supabase"""


class SkillMatchReport(BaseModel):
    match_score: int  # 1–10
    recommendation: str  # "Strong fit" | "Good fit" | "Partial fit" | "Weak fit"
    strengths: list[str]
    gaps: list[str]
    summary: str


_SYSTEM = f"""\
You are an expert technical recruiter evaluating a candidate for a role.
Assess the candidate's fit honestly and specifically based only on the profile below.

CANDIDATE PROFILE
{_ANSELM_PROFILE}

Output a structured report with:
- match_score: integer 1–10 (10 = perfect match)
- recommendation: one of "Strong fit", "Good fit", "Partial fit", "Weak fit"
- strengths: 3–5 specific bullet points where the candidate excels for this role
- gaps: 1–3 honest gaps or areas the candidate would need to grow into (empty list if none)
- summary: 2–3 sentence overall assessment"""


def _assess(job_description: str) -> SkillMatchReport:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0).with_structured_output(SkillMatchReport)
    return llm.invoke(
        [
            SystemMessage(content=_SYSTEM),
            HumanMessage(content=f"Job description:\n{job_description}"),
        ]
    )


def _format_report(r: SkillMatchReport) -> str:
    score_bar = "█" * r.match_score + "░" * (10 - r.match_score)
    strengths = "\n".join(f"  ✓ {s}" for s in r.strengths)
    gaps = "\n".join(f"  △ {g}" for g in r.gaps) if r.gaps else "  (none identified)"
    return (
        f"**Skill Match Report**\n\n"
        f"Match score: {r.match_score}/10  {score_bar}\n"
        f"Verdict: **{r.recommendation}**\n\n"
        f"**Strengths**\n{strengths}\n\n"
        f"**Areas to grow into**\n{gaps}\n\n"
        f"{r.summary}"
    )


def skill_match_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1].content if state["messages"] else ""

    try:
        report = _assess(last_msg)
        reply = _format_report(report)
    except Exception:
        reply = (
            "I wasn't able to run the skill match right now. "
            "Feel free to send Anselm the JD directly at anselmpius@gmail.com!"
        )

    return {"messages": [AIMessage(content=reply)]}
