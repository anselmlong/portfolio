from langgraph.graph import END, StateGraph

from nodes.rag import rag_node
from nodes.router import intent_router_node, route_by_intent
from nodes.telegram import telegram_node
from state import AgentState

_STUB_NODES = [
    "calendar",
    "gmail",
    "github",
    "resume",
    "skill_match",
    "mock_interview",
]


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
    for name in _STUB_NODES:
        g.add_node(name, _stub_node(name))

    g.set_entry_point("intent_router")

    routing_map = {"rag": "rag", "telegram": "telegram", **{n: n for n in _STUB_NODES}}
    g.add_conditional_edges("intent_router", route_by_intent, routing_map)

    for name in ["rag", "telegram", *_STUB_NODES]:
        g.add_edge(name, END)

    return g


compiled_graph = build_graph().compile()
