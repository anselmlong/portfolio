from typing import Literal

from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from state import AgentState

Intent = Literal[
    "rag",
    "calendar",
    "gmail",
    "telegram",
    "github",
    "resume",
    "skill_match",
    "mock_interview",
]

ROUTER_SYSTEM = """\
Classify the visitor's intent in a portfolio chatbot for Anselm Long, a software engineer.

- rag: general questions about Anselm (skills, experience, projects, background, bio)
- calendar: scheduling, checking availability, booking a call or interview
- gmail: sending an email to Anselm
- telegram: texting or directly messaging Anselm
- github: questions about Anselm's current work, recent commits, or active projects
- resume: requesting a tailored resume for a specific job description
- skill_match: checking if Anselm is a good fit for a role or job description
- mock_interview: conducting a mock behavioral or technical interview

Return the single most appropriate intent."""


class IntentOutput(BaseModel):
    intent: Intent


_router_llm = None


def intent_router_node(state: AgentState) -> dict:
    global _router_llm
    if _router_llm is None:
        _router_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0).with_structured_output(
            IntentOutput
        )
    result = _router_llm.invoke(
        [SystemMessage(content=ROUTER_SYSTEM), *state["messages"][-5:]]
    )
    return {"intent": result.intent}


def route_by_intent(state: AgentState) -> str:
    return state.get("intent") or "rag"
