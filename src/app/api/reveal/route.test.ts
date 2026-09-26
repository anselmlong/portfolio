// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function request(body: unknown, origin = "https://preview.example") {
  return new Request("https://preview.example/api/reveal", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
const valid = {
  messages: [{ role: "user", content: "Tell me about kopitype" }],
};
const decision = (intent: string, project: string, confidence = 0.9) =>
  Response.json({
    answers: {
      intent: { choice: intent, confidence },
      project: { choice: project, confidence },
    },
  });

beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("TYPESAFE_API_KEY", "test-only");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("preview reveal endpoint", () => {
  it("fails closed outside the preview and rejects foreign origins", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect((await POST(request(valid))).status).toBe(503);
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await POST(request(valid, "https://other.example"))).status).toBe(
      403,
    );
  });

  it("rejects malformed and oversized requests before calling Jev", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(request({ messages: [] }))).status).toBe(400);
    expect((await POST(request({ padding: "x".repeat(17000) }))).status).toBe(
      413,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns only a known intent and a known project, never text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => decision("work", "kopitype")),
    );
    const body = (await (await POST(request(valid))).json()) as object;
    expect(body).toEqual({ intent: "work", projects: ["kopitype"] });
  });

  it("drops unknown choices, low confidence, and project-less work reveals", async () => {
    for (const reply of [
      decision("<script>", "none"),
      decision("experience", "none", 0.3),
      decision("work", "an invented project"),
    ]) {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => reply),
      );
      expect(await (await POST(request(valid))).json()).toEqual({
        intent: "clarify",
        projects: [],
      });
    }
  });

  it("prefers a confidently named project over a split topic", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          answers: {
            intent: { choice: "photos", confidence: 0.9 },
            project: { choice: "route archiver", confidence: 0.88 },
          },
        }),
      ),
    );
    expect(await (await POST(request(valid))).json()).toEqual({
      intent: "work",
      projects: ["route archiver"],
    });
  });

  it("reports a Jev outage as 502", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    expect((await POST(request(valid))).status).toBe(502);
  });
});
