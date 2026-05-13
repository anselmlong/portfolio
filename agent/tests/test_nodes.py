"""
Node integration tests — each test mocks external APIs.
Run: pytest agent/tests/ from repo root.
"""
from unittest.mock import MagicMock, patch

from langchain_core.messages import AIMessage, HumanMessage

from state import AgentState


def _make_state(**kwargs) -> AgentState:
    defaults: AgentState = {
        "messages": [HumanMessage(content="tell me about Anselm")],
        "intent": "",
        "tool_output": "",
        "visitor_name": "",
        "visitor_email": "",
    }
    return {**defaults, **kwargs}


class TestIntentRouter:
    def test_routes_general_question_to_rag(self):
        from pydantic import BaseModel
        from typing import Literal

        class FakeIntent(BaseModel):
            intent: Literal["rag"] = "rag"

        with patch("nodes.router._router_llm") as mock_llm:
            mock_llm.invoke.return_value = FakeIntent()
            from nodes.router import intent_router_node

            result = intent_router_node(_make_state())

        assert result["intent"] == "rag"

    def test_routes_scheduling_to_calendar(self):
        from pydantic import BaseModel
        from typing import Literal

        class FakeIntent(BaseModel):
            intent: Literal["calendar"] = "calendar"

        with patch("nodes.router._router_llm") as mock_llm:
            mock_llm.invoke.return_value = FakeIntent()
            from nodes.router import intent_router_node

            result = intent_router_node(
                _make_state(messages=[HumanMessage(content="when is Anselm free?")])
            )

        assert result["intent"] == "calendar"

    def test_routes_messaging_to_telegram(self):
        from pydantic import BaseModel
        from typing import Literal

        class FakeIntent(BaseModel):
            intent: Literal["telegram"] = "telegram"

        with patch("nodes.router._router_llm") as mock_llm:
            mock_llm.invoke.return_value = FakeIntent()
            from nodes.router import intent_router_node

            result = intent_router_node(
                _make_state(messages=[HumanMessage(content="text anselm")])
            )

        assert result["intent"] == "telegram"


class TestRagNode:
    def test_returns_ai_message_with_context(self):
        fake_doc = MagicMock()
        fake_doc.page_content = "Anselm is a software engineer."

        fake_response = AIMessage(content="Anselm is a software engineer with 5 years experience.")

        with (
            patch("nodes.rag._get_vectorstore") as mock_vs,
            patch("nodes.rag.ChatOpenAI") as mock_llm_cls,
        ):
            mock_vs.return_value.similarity_search.return_value = [fake_doc]
            mock_llm_cls.return_value.invoke.return_value = fake_response

            from nodes.rag import rag_node

            result = rag_node(_make_state())

        messages = result["messages"]
        assert len(messages) == 1
        assert isinstance(messages[0], AIMessage)
        assert "Anselm" in messages[0].content
