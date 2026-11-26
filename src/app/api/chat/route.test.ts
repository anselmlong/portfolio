// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  initialize: vi.fn(),
  retrieve: vi.fn(),
  invoke: vi.fn(),
  stream: vi.fn(),
}));

vi.mock("~/server/pg", () => ({ pool: {} }));
vi.mock("~/server/chat-budget", () => ({
  reserveChatRequest: vi.fn(async () => true),
}));
vi.mock("@langchain/community/vectorstores/pgvector", () => ({
  PGVectorStore: { initialize: mocks.initialize },
}));
vi.mock("@langchain/openai", () => ({
  ChatOpenAI: vi.fn(),
  OpenAIEmbeddings: vi.fn(),
}));
// Collapse prompt.pipe(llm).pipe(parser) into one chain with invoke/stream.
vi.mock("@langchain/core/prompts", () => {
  const chain = {
    pipe: () => chain,
    invoke: mocks.invoke,
    stream: mocks.stream,
  };
  return {
    ChatPromptTemplate: { fromMessages: () => chain },
    MessagesPlaceholder: vi.fn(),
  };
});

const text = (role: "user" | "assistant", value: string) => ({
  id: crypto.randomUUID(),
  role,
  parts: [{ type: "text", text: value }],
});
const post = (
  messages: unknown[],
  headers: Record<string, string> = {
    origin: "https://portfolio.example",
    "content-type": "application/json",
  },
  signal?: AbortSignal,
) =>
  new Request("https://portfolio.example/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({ messages }),
    signal,
  });
async function* tokens(...chunks: string[]) {
  for (const chunk of chunks) yield chunk;
}
async function* broken() {
  yield "partial";
  throw new Error("provider dropped");
}

// A fresh module per test so the vector store singleton starts empty.
async function route() {
  vi.resetModules();
  return (await import("./route")).POST;
}

describe("chat route failure phases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mocks.initialize.mockResolvedValue({
      asRetriever: () => ({ invoke: mocks.retrieve }),
    });
    mocks.retrieve.mockResolvedValue([{ pageContent: "notes" }]);
    mocks.stream.mockResolvedValue(tokens("hi ", "there"));
  });

  it("streams an answer when every phase succeeds", async () => {
    const response = await (
      await route()
    )(post([text("user", "hello")]) as never);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("hi there");
  });

  it("reports a vector store init failure as 503 init", async () => {
    mocks.initialize.mockRejectedValue(new Error("db down"));
    const response = await (
      await route()
    )(post([text("user", "hello")]) as never);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "init" });
  });

  it("reports a follow-up rewrite failure as 502 rewrite", async () => {
    mocks.invoke.mockRejectedValue(new Error("rate limited"));
    const response = await (
      await route()
    )(
      post([
        text("user", "Tell me about kopitype"),
        text("assistant", "It is a typing test."),
        text("user", "Why did you build it?"),
      ]) as never,
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ code: "rewrite" });
  });

  it("reports a retrieval failure as 502 retrieval instead of streaming an apology", async () => {
    mocks.retrieve.mockRejectedValue(new Error("embedding failed"));
    const response = await (
      await route()
    )(post([text("user", "hello")]) as never);
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ code: "retrieval" });
    expect(mocks.stream).not.toHaveBeenCalled();
  });

  it("errors the stream when the model fails mid-answer", async () => {
    mocks.stream.mockResolvedValue(broken());
    const response = await (
      await route()
    )(post([text("user", "hello")]) as never);
    expect(response.status).toBe(200);
    await expect(response.text()).rejects.toThrow();
  });
});

describe("chat route request guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mocks.initialize.mockResolvedValue({
      asRetriever: () => ({ invoke: mocks.retrieve }),
    });
    mocks.retrieve.mockResolvedValue([{ pageContent: "notes" }]);
  });

  it.each([
    ["missing", { "content-type": "application/json" }],
    [
      "cross-site",
      { origin: "https://evil.example", "content-type": "application/json" },
    ],
  ])("rejects a %s Origin before spending budget", async (_, headers) => {
    const { reserveChatRequest } = await import("~/server/chat-budget");
    const response = await (
      await route()
    )(post([text("user", "hello")], headers) as never);
    expect(response.status).toBe(403);
    expect(reserveChatRequest).not.toHaveBeenCalled();
  });

  it("accepts an Origin matching the forwarded host", async () => {
    mocks.stream.mockResolvedValue(tokens("ok"));
    const response = await (
      await route()
    )(
      post([text("user", "hello")], {
        origin: "https://anselmlong.com",
        "x-forwarded-host": "anselmlong.com",
        "content-type": "application/json",
      }) as never,
    );
    expect(response.status).toBe(200);
  });

  it("rejects non-JSON bodies with 415", async () => {
    const response = await (
      await route()
    )(
      post([text("user", "hello")], {
        origin: "https://portfolio.example",
        "content-type": "text/plain",
      }) as never,
    );
    expect(response.status).toBe(415);
  });

  it("aborts generation when the client cancels the stream", async () => {
    let signal: AbortSignal | undefined;
    mocks.stream.mockImplementation(
      async (_input: unknown, options: { signal: AbortSignal }) => {
        signal = options.signal;
        return (async function* () {
          yield "first";
          await new Promise((resolve) =>
            options.signal.addEventListener("abort", resolve),
          );
          throw new Error("aborted");
        })();
      },
    );
    const response = await (
      await route()
    )(post([text("user", "hello")]) as never);
    const reader = response.body!.getReader();
    await reader.read();
    await reader.cancel();
    expect(signal?.aborted).toBe(true);
  });

  it("aborts generation when the request signal fires", async () => {
    let signal: AbortSignal | undefined;
    mocks.stream.mockImplementation(
      async (_input: unknown, options: { signal: AbortSignal }) => {
        signal = options.signal;
        return (async function* () {
          await new Promise((resolve) =>
            options.signal.addEventListener("abort", resolve),
          );
          yield "late";
        })();
      },
    );
    const client = new AbortController();
    const response = await (
      await route()
    )(
      post(
        [text("user", "hello")],
        {
          origin: "https://portfolio.example",
          "content-type": "application/json",
        },
        client.signal,
      ) as never,
    );
    expect(response.status).toBe(200);
    await vi.waitFor(() => expect(signal).toBeDefined());
    client.abort();
    expect(signal?.aborted).toBe(true);
  });
});

describe("OpenRouter routing", () => {
  it("stays on OpenAI unless an OpenRouter model id and key are both set", async () => {
    const { openRouterOptions } = await import("~/server/chat-model");
    vi.stubEnv("CHAT_MODEL", "gpt-4.1");
    vi.stubEnv("OPENROUTER_API_KEY", "test-only");
    expect(openRouterOptions()).toEqual({});
    vi.stubEnv("CHAT_MODEL", "deepseek/deepseek-v4.1-flash");
    vi.stubEnv("OPENROUTER_API_KEY", "");
    expect(openRouterOptions()).toEqual({});
    vi.unstubAllEnvs();
  });

  it("pins OpenRouter to US providers that don't store data", async () => {
    const { openRouterOptions } = await import("~/server/chat-model");
    vi.stubEnv("CHAT_MODEL", "deepseek/deepseek-v4.1-flash");
    vi.stubEnv("OPENROUTER_API_KEY", "test-only");
    expect(openRouterOptions()).toMatchObject({
      openAIApiKey: "test-only",
      configuration: { baseURL: "https://openrouter.ai/api/v1" },
      modelKwargs: {
        provider: { allow_fallbacks: false, data_collection: "deny" },
      },
    });
    vi.unstubAllEnvs();
  });
});
