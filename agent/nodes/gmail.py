"""Gmail node — forward visitor messages to Anselm via Gmail API."""
import base64
import email.mime.text
import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from langchain_core.messages import AIMessage

from state import AgentState

_SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
_TO = "anselmpius@gmail.com"


def _get_service():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["GOOGLE_REFRESH_TOKEN"],
        client_id=os.environ["GOOGLE_CLIENT_ID"],
        client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
        token_uri="https://oauth2.googleapis.com/token",
        scopes=_SCOPES,
    )
    creds.refresh(Request())
    return build("gmail", "v1", credentials=creds, cache_discovery=False)


def _encode(to: str, subject: str, body: str) -> dict:
    msg = email.mime.text.MIMEText(body)
    msg["to"] = to
    msg["subject"] = subject
    return {"raw": base64.urlsafe_b64encode(msg.as_bytes()).decode()}


def gmail_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1].content if state["messages"] else ""
    visitor_name = state.get("visitor_name", "") or "a portfolio visitor"
    visitor_email = state.get("visitor_email", "")

    try:
        service = _get_service()

        sender_line = f"{visitor_name} ({visitor_email})" if visitor_email else visitor_name
        body = f"New message from {sender_line}:\n\n{last_msg}"
        subject = f"Portfolio Chatbot — {visitor_name}"

        service.users().messages().send(
            userId="me",
            body=_encode(_TO, subject, body),
        ).execute()

        reply_to = visitor_email if visitor_email else "you"
        reply = (
            f"Your message has been sent to Anselm. "
            f"He'll follow up with {reply_to} soon!"
        )
    except Exception:
        reply = (
            "I wasn't able to send that email right now. "
            "You can reach Anselm directly at anselmpius@gmail.com."
        )

    return {"messages": [AIMessage(content=reply)]}
