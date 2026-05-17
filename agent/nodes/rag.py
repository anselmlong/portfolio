"""RAG node — proxies to the existing Next.js RAG endpoint."""
import os

import httpx
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.messages import BaseMessage

from state import AgentState


def _to_ui_messages(messages: list[BaseMessage]) -> list[dict]:
    result = []
    for msg in messages:
        role = "user" if isinstance(msg, HumanMessage) else "assistant"
        result.append({
            "id": str(id(msg)),
            "role": role,
            "content": msg.content,
            "parts": [{"type": "text", "text": msg.content}],
        })
    return result


def rag_node(state: AgentState) -> dict:
    base_url = os.environ.get("NEXTJS_URL", "").rstrip("/")
    try:
        resp = httpx.post(
            f"{base_url}/api/chat",
            json={"messages": _to_ui_messages(state["messages"])},
            timeout=30.0,
        )
        resp.raise_for_status()
        content = resp.text
    except Exception:
        content = "I'm having trouble connecting right now. Please try again in a moment."

    return {"messages": [AIMessage(content=content)]}
