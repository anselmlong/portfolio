import os

import httpx
from langchain_core.messages import AIMessage, HumanMessage

from state import AgentState


def _send(token: str, chat_id: str, text: str) -> None:
    resp = httpx.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={"chat_id": chat_id, "text": text},
        timeout=10.0,
    )
    resp.raise_for_status()


def telegram_node(state: AgentState) -> dict:
    last_msg = next(
        (m.content for m in reversed(state["messages"]) if isinstance(m, HumanMessage)),
        "",
    )
    sender = state.get("visitor_name") or "A visitor"
    telegram_text = f"\U0001f4ec {sender} via portfolio chatbot:\n\n{last_msg}"

    try:
        _send(
            os.environ["TELEGRAM_BOT_TOKEN"],
            os.environ["TELEGRAM_CHAT_ID"],
            telegram_text,
        )
        reply = "Done — Anselm has been notified. He'll get back to you soon."
    except Exception:
        reply = "Message couldn't be delivered right now. Try again or email anselmpius@gmail.com."

    return {"messages": [AIMessage(content=reply)]}
