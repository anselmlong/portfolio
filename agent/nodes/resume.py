"""Resume node — LLM-tailored LaTeX resume compiled via tectonic."""
import os
import subprocess
import uuid
from pathlib import Path

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from state import AgentState

_TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
_PDF_DIR = Path("/tmp/resume_pdfs")

_PROJECTS = [
    {
        "title": "Freak-Cha",
        "position": "Frontend \\& Computer Vision Developer, HackHarvard 2025",
        "description": "CAPTCHA-inspired challenge distinguishing humans from AI via facial expression recognition; awarded Funniest Hack at HackHarvard 2025.",
        "tech": ["Next.js", "Tailwind CSS", "tRPC", "MediaPipe", "YOLOv8"],
    },
    {
        "title": "VBook",
        "position": "Team Lead, NUS",
        "description": "JavaFX-based CLI contact manager optimised for developers. Led a 4-person team to deliver on schedule.",
        "tech": ["Java", "JavaFX", "CLI"],
    },
    {
        "title": "MiccDrop",
        "position": "Team Lead, Hack \\& Roll, NUS",
        "description": "Karaoke app rewarding off-key singing with real-time pitch detection and Spotify API integration.",
        "tech": ["React Native", "Node.js", "Supabase", "Spotify API"],
    },
    {
        "title": "LinkedIn Shitpost Generator",
        "position": "Personal project",
        "description": "Satirical web app generating absurd LinkedIn-style posts via AI across six comedic personas.",
        "tech": ["Next.js", "React", "Google Gemini", "OpenRouter"],
    },
    {
        "title": "Canvas Scraper",
        "position": "Personal project",
        "description": "CLI tool syncing Canvas course files, filtering junk, and emailing daily assignment summaries.",
        "tech": ["Python", "SQLite", "Beautiful Soup"],
    },
]


class ResumeSelection(BaseModel):
    tailored_summary: str
    project_indices: list[int]
    skill_emphasis: str


def _latex_escape(s: str) -> str:
    for ch, esc in [
        ("\\", r"\textbackslash{}"),
        ("&", r"\&"),
        ("%", r"\%"),
        ("$", r"\$"),
        ("#", r"\#"),
        ("_", r"\_"),
        ("^", r"\^{}"),
        ("{", r"\{"),
        ("}", r"\}"),
        ("~", r"\textasciitilde{}"),
    ]:
        s = s.replace(ch, esc)
    return s


def _render_template(tailored_summary: str, featured_projects: list, skill_emphasis: str) -> str:
    from jinja2 import Environment, FileSystemLoader

    env = Environment(loader=FileSystemLoader(str(_TEMPLATE_DIR)), autoescape=False)
    env.filters["le"] = _latex_escape
    return env.get_template("resume.tex.j2").render(
        tailored_summary=tailored_summary,
        featured_projects=featured_projects,
        skill_emphasis=skill_emphasis,
    )


def _select(job_description: str) -> ResumeSelection:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3).with_structured_output(ResumeSelection)
    return llm.invoke(
        [
            SystemMessage(
                content="""\
Tailor Anselm Long's resume for the given job description.

Anselm's skills: Python, TypeScript, JavaScript, Java, SQL, Next.js, React, FastAPI,
LangChain, LangGraph, Docker, PostgreSQL, pgvector, Playwright, Machine Learning,
Computer Vision, Explainable AI, Data Engineering.

Available projects (0-indexed):
0. Freak-Cha — CV/hackathon, Next.js, MediaPipe, YOLOv8
1. VBook — CLI, Java, team leadership
2. MiccDrop — mobile, React Native, Spotify API
3. LinkedIn Shitpost Generator — AI web app, Gemini, OpenRouter
4. Canvas Scraper — Python, automation, SQLite

Output:
- tailored_summary: 2–3 sentence professional summary for this role (no LaTeX special chars)
- project_indices: 2–3 most relevant project indices
- skill_emphasis: 4–6 comma-separated skills most relevant to this role"""
            ),
            HumanMessage(content=f"Job description:\n{job_description}"),
        ]
    )


def _compile_tex(tex: str) -> bytes:
    import tempfile

    _PDF_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_path = Path(tmpdir) / "resume.tex"
        tex_path.write_text(tex, encoding="utf-8")
        result = subprocess.run(
            ["tectonic", "--only-cached", "--untrusted", str(tex_path)],
            cwd=tmpdir,
            capture_output=True,
            timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.decode())
        return (Path(tmpdir) / "resume.pdf").read_bytes()


def _save_pdf(pdf_bytes: bytes) -> str:
    _PDF_DIR.mkdir(parents=True, exist_ok=True)
    job_id = uuid.uuid4().hex[:8]
    (_PDF_DIR / f"{job_id}.pdf").write_bytes(pdf_bytes)
    return job_id


def _public_url(job_id: str) -> str:
    base = os.environ.get("AGENT_PUBLIC_URL", "")
    if not base:
        domain = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "localhost:8000")
        base = f"https://{domain}" if not domain.startswith("http") else domain
    return f"{base.rstrip('/')}/pdf/{job_id}"


def resume_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1].content if state["messages"] else ""

    try:
        selection = _select(last_msg)

        projects = [_PROJECTS[i] for i in selection.project_indices if 0 <= i < len(_PROJECTS)]
        if not projects:
            projects = [_PROJECTS[0], _PROJECTS[3]]

        tex = _render_template(
            tailored_summary=_latex_escape(selection.tailored_summary),
            featured_projects=projects,
            skill_emphasis=_latex_escape(selection.skill_emphasis),
        )

        pdf_bytes = _compile_tex(tex)
        job_id = _save_pdf(pdf_bytes)
        url = _public_url(job_id)

        reply = (
            f"Here's your tailored resume: {url}\n\n"
            "The PDF is ATS-optimised and highlights the skills most relevant to your role."
        )
    except Exception:
        reply = (
            "I wasn't able to generate the resume right now. "
            "Please reach out to Anselm directly at anselmpius@gmail.com."
        )

    return {"messages": [AIMessage(content=reply)]}
