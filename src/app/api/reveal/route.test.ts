// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const budget = vi.hoisted(() => ({ reserve: vi.fn(async () => true) }));
vi.mock("~/server/pg", () => ({ pool: {} }));
vi.mock("~/server/reveal-budget", () => ({
  reserveRevealRequest: budget.reserve,
}));
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
  it("rejects foreign origins, and fails closed on an exhausted or unavailable budget", async () => {
    expect((await POST(request(valid, "https://other.example"))).status).toBe(
      403,
    );
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    budget.reserve.mockResolvedValueOnce(false);
    expect((await POST(request(valid))).status).toBe(429);
    budget.reserve.mockRejectedValueOnce(new Error("db down"));
    expect((await POST(request(valid))).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
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
      vi.fn(async () => decision("work", "Kopitype (Singlish typing test)")),
    );
    const body = (await (await POST(request(valid))).json()) as object;
    expect(body).toEqual({
      intent: "work",
      projects: ["Kopitype (Singlish typing test)"],
    });
  });

  it("gives Jev the start of the answer so the card matches it", async () => {
    const fetcher = vi.fn(async () => decision("photos", "none"));
    vi.stubGlobal("fetch", fetcher);
    await POST(request({ ...valid, answer: "i shoot on a fuji." }));
    const sent = JSON.parse(
      (fetcher.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string,
    ) as { state: { answer: string } };
    expect(sent.state.answer).toBe("i shoot on a fuji.");
    expect(
      (await POST(request({ ...valid, answer: "x".repeat(1201) }))).status,
    ).toBe(400);
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
            project: {
              choice: "Ava (Anselm's personal AI agent)",
              confidence: 0.88,
            },
          },
        }),
      ),
    );
    expect(await (await POST(request(valid))).json()).toEqual({
      intent: "work",
      projects: ["Ava (Anselm's personal AI agent)"],
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
