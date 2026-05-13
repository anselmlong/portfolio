import json
import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from graph import compiled_graph

AGENT_TOKEN = os.environ.get("AGENT_TOKEN", "")

app = FastAPI()


class VisitorInfo(BaseModel):
    name: str | None = None
    email: str | None = None


class ChatRequest(BaseModel):
    messages: list[dict]
    visitor: VisitorInfo = VisitorInfo()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat")
async def chat(
    req: ChatRequest,
    x_agent_token: str = Header(None, alias="X-Agent-Token"),
):
    if not AGENT_TOKEN or x_agent_token != AGENT_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return StreamingResponse(
        _event_stream(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def _event_stream(req: ChatRequest):
    messages = []
    for m in req.messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))

    state = {
        "messages": messages,
        "intent": "",
        "tool_output": "",
        "visitor_name": req.visitor.name or "",
        "visitor_email": req.visitor.email or "",
    }

    try:
        async for event in compiled_graph.astream_events(state, version="v2"):
            if event["event"] == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    yield f"data: {json.dumps({'content': content})}\n\n"
    except Exception as exc:
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    yield "data: [DONE]\n\n"
