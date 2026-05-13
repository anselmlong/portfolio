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


class TestTelegramNode:
    def test_sends_message_and_confirms(self):
        with patch("nodes.telegram.httpx.post") as mock_post:
            mock_post.return_value.raise_for_status = MagicMock()

            from nodes.telegram import telegram_node

            state = _make_state(
                messages=[HumanMessage(content="hey, I'd love to connect")],
                visitor_name="Jane Recruiter",
            )

            with (
                patch.dict(
                    "os.environ",
                    {"TELEGRAM_BOT_TOKEN": "fake-token", "TELEGRAM_CHAT_ID": "12345"},
                )
            ):
                result = telegram_node(state)

        # Verify the Telegram API was called with the correct chat_id
        call_kwargs = mock_post.call_args
        assert "12345" in str(call_kwargs)
        assert "Jane Recruiter" in str(call_kwargs)

        # Verify a confirmation message is returned
        assert len(result["messages"]) == 1
        assert isinstance(result["messages"][0], AIMessage)
        assert "Anselm" in result["messages"][0].content

    def test_returns_fallback_on_api_failure(self):
        with patch("nodes.telegram.httpx.post") as mock_post:
            mock_post.side_effect = Exception("network error")

            from nodes.telegram import telegram_node

            with patch.dict(
                "os.environ",
                {"TELEGRAM_BOT_TOKEN": "bad-token", "TELEGRAM_CHAT_ID": "12345"},
            ):
                result = telegram_node(_make_state())

        assert isinstance(result["messages"][0], AIMessage)
        assert "couldn't be delivered" in result["messages"][0].content
