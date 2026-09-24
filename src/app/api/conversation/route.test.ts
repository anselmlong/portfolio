// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create: mocks.create } };
  },
}));
import { POST } from "./route";
import { isReply } from "~/lib/conversation";
async function readReply(response: Response) {
  const data: unknown = await response.json();
  if (!isReply(data)) throw new Error("Invalid reply");
  return data;
}
function request(body: unknown, origin = "https://preview.example") {
  return new Request("https://preview.example/api/conversation", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
const valid = {
  messages: [{ role: "user", content: "Tell me about Kopitype" }],
};
beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("TYPESAFE_API_KEY", "test-only");
  vi.stubEnv("OPENAI_API_KEY", "test-only");
  mocks.create.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("preview conversation endpoint", () => {
  it("fails closed in production and rejects foreign origins", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect((await POST(request(valid))).status).toBe(503);
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await POST(request(valid, "https://other.example"))).status).toBe(
      403,
    );
  });
  it("rejects malformed and oversized requests before providers", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(request({ messages: [] }))).status).toBe(400);
    expect((await POST(request({ padding: "x".repeat(17000) }))).status).toBe(
      413,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("only returns allowlisted projects and falls back when writing fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            intent: { choice: "work", confidence: 0.9 },
            project: { choice: "kopitype", confidence: 0.9 },
          },
        }),
      }),
    );
    mocks.create.mockRejectedValue(new Error("offline"));
    const response = await POST(request(valid));
    const reply = await readReply(response);
    expect(reply.projects).toEqual(["kopitype"]);
    expect(reply.note).toContain("curated");
    expect(reply.text).not.toContain("test-only");
  });
  it("asks for clarification on low confidence without calling the writer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            intent: { choice: "work", confidence: 0.2 },
            project: { choice: "https://evil.example", confidence: 1 },
          },
        }),
      }),
    );
    const reply = await readReply(await POST(request(valid)));
    expect(reply.intent).toBe("clarify");
    expect(reply.projects).toEqual([]);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("returns a generated reply with a valid structured reveal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            intent: { choice: "experience", confidence: 0.9 },
            project: { choice: "none", confidence: 0.9 },
          },
        }),
      }),
    );
    mocks.create.mockResolvedValue({
      choices: [{ message: { content: "Anselm works on the OGP Maps team." } }],
    });
    const reply = await readReply(await POST(request(valid)));
    expect(reply.text).toContain("OGP Maps");
    expect(reply.intent).toBe("experience");
  });
});
