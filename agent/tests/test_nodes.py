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
        with (
            patch("nodes.rag.httpx.post") as mock_post,
            patch.dict("os.environ", {"NEXTJS_URL": "http://localhost:3000"}),
        ):
            mock_post.return_value.raise_for_status = MagicMock()
            mock_post.return_value.text = "Anselm is a software engineer with 5 years experience."

            from nodes.rag import rag_node

            result = rag_node(_make_state())

        messages = result["messages"]
        assert len(messages) == 1
        assert isinstance(messages[0], AIMessage)
        assert "Anselm" in messages[0].content

    def test_returns_fallback_on_api_failure(self):
        with (
            patch("nodes.rag.httpx.post") as mock_post,
            patch.dict("os.environ", {"NEXTJS_URL": "http://localhost:3000"}),
        ):
            mock_post.side_effect = Exception("connection refused")

            from nodes.rag import rag_node

            result = rag_node(_make_state())

        assert isinstance(result["messages"][0], AIMessage)
        assert "try again" in result["messages"][0].content.lower()


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


class TestCalendarNode:
    _GOOGLE_ENV = {
        "GOOGLE_CLIENT_ID": "fake-id",
        "GOOGLE_CLIENT_SECRET": "fake-secret",
        "GOOGLE_REFRESH_TOKEN": "fake-refresh",
    }

    def _make_mock_service(self, busy: list | None = None):
        mock_svc = MagicMock()
        mock_svc.freebusy.return_value.query.return_value.execute.return_value = {
            "calendars": {"primary": {"busy": busy or []}}
        }
        mock_svc.events.return_value.insert.return_value.execute.return_value = {
            "htmlLink": "https://calendar.google.com/event/fake"
        }
        return mock_svc

    def test_returns_available_slots(self):
        with (
            patch("nodes.calendar._get_service") as mock_get_svc,
            patch.dict("os.environ", self._GOOGLE_ENV),
        ):
            mock_get_svc.return_value = self._make_mock_service()
            from nodes.calendar import calendar_node

            result = calendar_node(_make_state())

        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "slot" in msg.content.lower() or any(
            day in msg.content for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        )

    def test_books_slot_when_visitor_info_present(self):
        with (
            patch("nodes.calendar._get_service") as mock_get_svc,
            patch.dict("os.environ", self._GOOGLE_ENV),
        ):
            mock_svc = self._make_mock_service()
            mock_get_svc.return_value = mock_svc
            from nodes.calendar import calendar_node

            state = _make_state(
                messages=[HumanMessage(content="I'd like slot 1 please")],
                visitor_name="Jane Recruiter",
                visitor_email="jane@example.com",
            )
            result = calendar_node(state)

        assert mock_svc.events.return_value.insert.called
        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "booked" in msg.content.lower() or "Done" in msg.content

    def test_returns_fallback_on_api_failure(self):
        with (
            patch("nodes.calendar._get_service") as mock_get_svc,
            patch.dict("os.environ", self._GOOGLE_ENV),
        ):
            mock_get_svc.side_effect = Exception("auth error")
            from nodes.calendar import calendar_node

            result = calendar_node(_make_state())

        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "anselmpius@gmail.com" in msg.content


class TestGmailNode:
    _GOOGLE_ENV = {
        "GOOGLE_CLIENT_ID": "fake-id",
        "GOOGLE_CLIENT_SECRET": "fake-secret",
        "GOOGLE_REFRESH_TOKEN": "fake-refresh",
    }

    def test_sends_email_and_confirms(self):
        with (
            patch("nodes.gmail._get_service") as mock_get_svc,
            patch.dict("os.environ", self._GOOGLE_ENV),
        ):
            mock_svc = MagicMock()
            mock_svc.users.return_value.messages.return_value.send.return_value.execute.return_value = {}
            mock_get_svc.return_value = mock_svc

            from nodes.gmail import gmail_node

            state = _make_state(
                messages=[HumanMessage(content="Hi Anselm, I'd love to connect!")],
                visitor_name="Jane Recruiter",
                visitor_email="jane@example.com",
            )
            result = gmail_node(state)

        assert mock_svc.users.return_value.messages.return_value.send.called
        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "Anselm" in msg.content

    def test_returns_fallback_on_api_failure(self):
        with (
            patch("nodes.gmail._get_service") as mock_get_svc,
            patch.dict("os.environ", self._GOOGLE_ENV),
        ):
            mock_get_svc.side_effect = Exception("network error")
            from nodes.gmail import gmail_node

            result = gmail_node(_make_state())

        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "anselmpius@gmail.com" in msg.content


class TestResumeNode:
    _mock_selection = None

    def _make_selection(self):
        sel = MagicMock()
        sel.tailored_summary = "Anselm is a skilled ML engineer with experience in Python and LangChain."
        sel.project_indices = [0, 3]
        sel.skill_emphasis = "Python, Machine Learning, LangChain"
        return sel

    def test_compiles_and_returns_pdf_url(self):
        with (
            patch("nodes.resume._select") as mock_select,
            patch("nodes.resume._render_template") as mock_render,
            patch("nodes.resume._compile_tex") as mock_compile,
            patch("nodes.resume._save_pdf") as mock_save,
            patch.dict("os.environ", {"AGENT_PUBLIC_URL": "https://agent.test"}),
        ):
            mock_select.return_value = self._make_selection()
            mock_compile.return_value = b"%PDF-1.4 fake"
            mock_save.return_value = "abc12345"

            from nodes.resume import resume_node

            state = _make_state(
                messages=[HumanMessage(content="Generate a resume for an ML engineer role at Google")]
            )
            result = resume_node(state)

        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "https://agent.test/pdf/abc12345" in msg.content

    def test_returns_fallback_on_compile_failure(self):
        with (
            patch("nodes.resume._select") as mock_select,
            patch("nodes.resume._compile_tex") as mock_compile,
        ):
            mock_select.return_value = self._make_selection()
            mock_compile.side_effect = RuntimeError("tectonic: command not found")

            from nodes.resume import resume_node

            result = resume_node(_make_state())

        msg = result["messages"][0]
        assert isinstance(msg, AIMessage)
        assert "anselmpius@gmail.com" in msg.content
