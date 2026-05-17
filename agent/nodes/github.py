"""GitHub node — surfaces Anselm's recent public activity via GitHub REST API."""
import os

import httpx
from langchain_core.messages import AIMessage

from state import AgentState

_USERNAME = "anselmlong"
_PROFILE_URL = f"https://github.com/{_USERNAME}"


def _fetch_events() -> list[dict]:
    token = os.environ.get("GITHUB_TOKEN", "")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    resp = httpx.get(
        f"https://api.github.com/users/{_USERNAME}/events/public",
        headers=headers,
        params={"per_page": 30},
        timeout=10.0,
    )
    resp.raise_for_status()
    return resp.json()


def _format_events(events: list[dict]) -> str:
    lines: list[str] = []
    seen: set[str] = set()

    for event in events:
        etype = event.get("type", "")
        repo = event.get("repo", {}).get("name", "").replace(f"{_USERNAME}/", "")
        date = event.get("created_at", "")[:10]
        payload = event.get("payload", {})
        key = line = None

        if etype == "PushEvent":
            commits = payload.get("commits", [])
            if commits:
                msg = commits[-1].get("message", "").split("\n")[0][:72]
                key = f"push:{repo}:{msg}"
                line = f"- Pushed to **{repo}** ({date}): {msg}"

        elif etype == "PullRequestEvent":
            pr = payload.get("pull_request", {})
            action = payload.get("action", "")
            if action in ("opened", "merged", "closed"):
                title = pr.get("title", "")[:72]
                key = f"pr:{repo}:{title}"
                line = f"- PR {action} in **{repo}** ({date}): {title}"

        elif etype == "CreateEvent":
            ref_type = payload.get("ref_type", "")
            ref = payload.get("ref", "")
            if ref_type == "repository":
                key = f"create:{repo}"
                line = f"- Created new repo **{repo}** ({date})"

        if key and key not in seen and line:
            seen.add(key)
            lines.append(line)

        if len(lines) >= 8:
            break

    return "\n".join(lines) if lines else "No recent public activity found."


def github_node(state: AgentState) -> dict:
    try:
        events = _fetch_events()
        activity = _format_events(events)
        reply = (
            f"Here's what Anselm has been working on recently:\n\n{activity}"
            f"\n\nFull history at {_PROFILE_URL}"
        )
    except Exception:
        reply = (
            f"I couldn't fetch GitHub activity right now. "
            f"Check out {_PROFILE_URL} directly!"
        )

    return {"messages": [AIMessage(content=reply)]}
