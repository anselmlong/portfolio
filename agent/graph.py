from langgraph.graph import END, StateGraph

from nodes.calendar import calendar_node
from nodes.github import github_node
from nodes.gmail import gmail_node
from nodes.mock_interview import mock_interview_node
from nodes.rag import rag_node
from nodes.resume import resume_node
from nodes.router import intent_router_node, route_by_intent
from nodes.skill_match import skill_match_node
from nodes.telegram import telegram_node
from state import AgentState

_STUB_NODES: list[str] = []


def _stub_node(node_name: str):
    def node(state: AgentState) -> dict:
        from langchain_core.messages import AIMessage

        return {
            "messages": [
                AIMessage(content=f"[{node_name}] feature is coming in a future update.")
            ]
        }

    node.__name__ = node_name
    return node


def build_graph() -> StateGraph:
    g = StateGraph(AgentState)

    g.add_node("intent_router", intent_router_node)
    g.add_node("rag", rag_node)
    g.add_node("telegram", telegram_node)
    g.add_node("calendar", calendar_node)
    g.add_node("gmail", gmail_node)
    g.add_node("resume", resume_node)
    g.add_node("github", github_node)
    g.add_node("skill_match", skill_match_node)
    g.add_node("mock_interview", mock_interview_node)
    for name in _STUB_NODES:
        g.add_node(name, _stub_node(name))

    g.set_entry_point("intent_router")

    routing_map = {
        "rag": "rag",
        "telegram": "telegram",
        "calendar": "calendar",
        "gmail": "gmail",
        "resume": "resume",
        "github": "github",
        "skill_match": "skill_match",
        "mock_interview": "mock_interview",
        **{n: n for n in _STUB_NODES},
    }
    g.add_conditional_edges("intent_router", route_by_intent, routing_map)

    for name in ["rag", "telegram", "calendar", "gmail", "resume", "github", "skill_match", "mock_interview", *_STUB_NODES]:
        g.add_edge(name, END)

    return g


compiled_graph = build_graph().compile()
