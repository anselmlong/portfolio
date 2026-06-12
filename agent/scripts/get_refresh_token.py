"""
One-time OAuth2 helper — run locally to generate GOOGLE_REFRESH_TOKEN.
Stdlib-only, no PKCE, uses v2 auth endpoint.
"""

import json
import os
import secrets
import sys
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI = "http://localhost:8080"
SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send"

if not CLIENT_ID or not CLIENT_SECRET:
    print("ERROR: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET", file=sys.stderr)
    sys.exit(1)

state = secrets.token_urlsafe(16)
auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
    "response_type": "code",
    "client_id": CLIENT_ID,
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPES,
    "state": state,
    "access_type": "offline",
    "prompt": "consent",
})

print(f"\nOpen this URL in your browser:\n\n{auth_url}\n", flush=True)
print("Waiting for callback on http://localhost:8080 ...", flush=True)

auth_code = None

class _Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        auth_code = (params.get("code") or [None])[0]
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"All done - you can close this tab.")

    def log_message(self, *_):
        pass

HTTPServer(("", 8080), _Handler).handle_request()

if not auth_code:
    print("ERROR: no auth code received.", file=sys.stderr)
    sys.exit(1)

token_data = urllib.parse.urlencode({
    "code": auth_code,
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri": REDIRECT_URI,
    "grant_type": "authorization_code",
}).encode()

resp = urllib.request.urlopen("https://oauth2.googleapis.com/token", token_data)
tokens = json.loads(resp.read())

sep = "=" * 60
print(f"\n{sep}", flush=True)
print("SUCCESS - copy these into Railway:", flush=True)
print(sep, flush=True)
print(f"GOOGLE_CLIENT_ID={CLIENT_ID}", flush=True)
print(f"GOOGLE_CLIENT_SECRET={CLIENT_SECRET}", flush=True)
print(f"GOOGLE_REFRESH_TOKEN={tokens['refresh_token']}", flush=True)
print(sep, flush=True)
