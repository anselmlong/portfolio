"""Google Calendar node — free/busy lookup and slot booking."""
import os
import re
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from langchain_core.messages import AIMessage

from state import AgentState

_SCOPES = ["https://www.googleapis.com/auth/calendar"]
_CALENDAR_ID = os.environ.get("GOOGLE_CALENDAR_ID", "primary")
_TZ = ZoneInfo(os.environ.get("CALENDAR_TIMEZONE", "America/New_York"))


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
    return build("calendar", "v3", credentials=creds, cache_discovery=False)


def _find_slots(service, days_ahead: int = 7, max_slots: int = 5) -> list[dict]:
    now = datetime.now(timezone.utc)
    time_max = now + timedelta(days=days_ahead)

    result = (
        service.freebusy()
        .query(
            body={
                "timeMin": now.isoformat(),
                "timeMax": time_max.isoformat(),
                "items": [{"id": _CALENDAR_ID}],
            }
        )
        .execute()
    )

    busy_ranges = [
        (
            datetime.fromisoformat(b["start"]),
            datetime.fromisoformat(b["end"]),
        )
        for b in result["calendars"][_CALENDAR_ID]["busy"]
    ]

    slots: list[dict] = []
    cursor = (now + timedelta(days=1)).astimezone(_TZ).replace(
        hour=9, minute=0, second=0, microsecond=0
    )

    while cursor.astimezone(timezone.utc) < time_max and len(slots) < max_slots:
        end = cursor + timedelta(minutes=30)
        cursor_utc = cursor.astimezone(timezone.utc)
        end_utc = end.astimezone(timezone.utc)

        is_weekday = cursor.weekday() < 5
        within_hours = 9 <= cursor.hour < 17
        overlaps = any(s < end_utc and e > cursor_utc for s, e in busy_ranges)

        if is_weekday and within_hours and not overlaps:
            slots.append({"start": cursor, "end": end})

        cursor += timedelta(minutes=30)
        if cursor.hour >= 17:
            cursor = (cursor + timedelta(days=1)).replace(hour=9, minute=0)

    return slots


def _format_slots(slots: list[dict]) -> str:
    if not slots:
        return "There are no open 30-minute windows in the next 7 days."
    return "\n".join(
        f"{i}. {s['start'].strftime('%A, %B %-d at %-I:%M %p %Z')}"
        for i, s in enumerate(slots, 1)
    )


def _book(service, slot: dict, visitor_name: str, visitor_email: str) -> str:
    event = {
        "summary": f"Portfolio Chat — {visitor_name}",
        "start": {"dateTime": slot["start"].isoformat()},
        "end": {"dateTime": slot["end"].isoformat()},
        "attendees": [{"email": visitor_email}] if visitor_email else [],
    }
    created = (
        service.events()
        .insert(calendarId=_CALENDAR_ID, body=event, sendUpdates="all")
        .execute()
    )
    return created.get("htmlLink", "")


def calendar_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1].content if state["messages"] else ""
    visitor_name = state.get("visitor_name", "")
    visitor_email = state.get("visitor_email", "")

    try:
        service = _get_service()
        slots = _find_slots(service)

        match = re.search(r"\b([1-5])\b", last_msg)
        if match and visitor_name and visitor_email and slots:
            idx = int(match.group(1)) - 1
            slot = slots[idx] if 0 <= idx < len(slots) else slots[0]
            link = _book(service, slot, visitor_name, visitor_email)
            when = slot["start"].strftime("%A, %B %-d at %-I:%M %p %Z")
            link_text = f"\n\nView event: {link}" if link else ""
            reply = (
                f"Done! I've booked a 30-minute call for {when} and sent a calendar invite to {visitor_email}."
                f"{link_text}\n\nLooking forward to it, {visitor_name.split()[0]}!"
            )
        elif visitor_name and not match:
            slot_text = _format_slots(slots)
            reply = (
                f"Here are Anselm's next available 30-minute slots:\n\n{slot_text}\n\n"
                f"Reply with the number (e.g. \"1\") to confirm the booking for {visitor_name}."
            )
        else:
            slot_text = _format_slots(slots)
            reply = (
                f"Here are Anselm's next available 30-minute slots:\n\n{slot_text}\n\n"
                "To book one, reply with the number along with your name and email address."
            )
    except Exception:
        reply = (
            "I couldn't check the calendar right now. "
            "Please reach out to Anselm directly at anselmpius@gmail.com to schedule a time."
        )

    return {"messages": [AIMessage(content=reply)]}
