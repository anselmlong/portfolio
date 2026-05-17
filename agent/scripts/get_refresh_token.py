"""
One-time OAuth2 helper — run locally to generate GOOGLE_REFRESH_TOKEN.

Usage:
    python agent/scripts/get_refresh_token.py

Prerequisites:
    1. Go to Google Cloud Console → APIs & Services → Credentials
    2. Create an OAuth 2.0 Client ID with type "Desktop app"
    3. Enable Google Calendar API and Gmail API in your project
    4. OAuth consent screen → publish the app (not "Testing") to avoid 7-day expiry
    5. Set env vars GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
       (or paste the path to the downloaded credentials JSON when prompted)

Output: prints GOOGLE_REFRESH_TOKEN + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
        → copy these into Railway environment variables
"""

import json
import os
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

from google_auth_oauthlib.flow import Flow

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
]
REDIRECT_URI = "http://localhost:8080"


def main() -> None:
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "")
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", "")

    if not client_id or not client_secret:
        path = input(
            "GOOGLE_CLIENT_ID/SECRET not set.\n"
            "Enter path to downloaded credentials.json: "
        ).strip()
        with open(path) as f:
            data = json.load(f)
        block = data.get("installed") or data.get("web", {})
        client_id = block["client_id"]
        client_secret = block["client_secret"]

    flow = Flow.from_client_config(
        {
            "installed": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [REDIRECT_URI],
            }
        },
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )

    auth_url, _ = flow.authorization_url(access_type="offline", prompt="consent")
    print(f"\nOpening browser — authorize the app then return here.\n\n{auth_url}\n")
    webbrowser.open(auth_url)

    auth_code: str | None = None

    class _Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            nonlocal auth_code
            params = parse_qs(urlparse(self.path).query)
            auth_code = (params.get("code") or [None])[0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"All done — you can close this tab.")

        def log_message(self, *_) -> None:  # silence access logs
            pass

    print("Waiting for OAuth callback on http://localhost:8080 …")
    HTTPServer(("localhost", 8080), _Handler).handle_request()

    if not auth_code:
        print("ERROR: no auth code received.")
        return

    flow.fetch_token(code=auth_code)
    creds = flow.credentials

    sep = "=" * 60
    print(f"\n{sep}")
    print("SUCCESS — copy these into Railway environment variables:")
    print(sep)
    print(f"GOOGLE_CLIENT_ID={client_id}")
    print(f"GOOGLE_CLIENT_SECRET={client_secret}")
    print(f"GOOGLE_REFRESH_TOKEN={creds.refresh_token}")
    print(sep)


if __name__ == "__main__":
    main()
