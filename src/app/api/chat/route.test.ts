// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  initialize: vi.fn(),
  retrieve: vi.fn(),
  invoke: vi.fn(),
  stream: vi.fn(),
}));

vi.mock("~/server/pg", () => ({ pool: {} }));
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
const post = (messages: unknown[]) =>
  new Request("https://portfolio.example/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
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
