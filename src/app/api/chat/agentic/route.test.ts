// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("~/server/pg", () => ({ pool: {} }));
vi.mock("~/server/chat-budget", () => ({ reserveChatRequest: vi.fn() }));
import { reserveChatRequest } from "~/server/chat-budget";
import * as chatBudget from "~/server/chat-budget";
import { POST } from "./route";
const initialAgentUrl = process.env.AGENT_SERVICE_URL;
const initialAgentToken = process.env.AGENT_TOKEN;

const request = (
  messages: unknown = [
    { role: "user", parts: [{ type: "text", text: "hello" }] },
  ],
) =>
  new Request("https://portfolio.example/api/chat/agentic", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });

describe("agentic public entrypoint", () => {
  afterEach(() => {
    if (initialAgentUrl === undefined) delete process.env.AGENT_SERVICE_URL;
    else process.env.AGENT_SERVICE_URL = initialAgentUrl;
    if (initialAgentToken === undefined) delete process.env.AGENT_TOKEN;
    else process.env.AGENT_TOKEN = initialAgentToken;
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });
  it("rejects malformed inputs before contacting the agent", async () => {
    const fetcher = vi.fn();
    vi.spyOn(globalThis, "fetch").mockImplementation(fetcher);
    expect((await POST(request(null))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("blocks exhausted and unavailable budgets before contacting the agent", async () => {
    process.env.AGENT_SERVICE_URL = "https://agent.example";
    process.env.AGENT_TOKEN = "test-only";
    const fetcher = vi.fn();
    vi.spyOn(globalThis, "fetch").mockImplementation(fetcher);
    vi.spyOn(chatBudget, "reserveChatRequest")
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error("offline"));
    expect((await POST(request())).status).toBe(429);
    expect((await POST(request())).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("lets the guarded fallback count the request only once", async () => {
    process.env.AGENT_SERVICE_URL = "";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("limited", {
        status: 429,
        headers: { "Retry-After": "3600" },
      }),
    );
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(reserveChatRequest).not.toHaveBeenCalled();
  });
});
