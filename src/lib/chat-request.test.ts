// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readChatRequest } from "./chat-request";

const message = (text: string, role = "user") => ({
  role,
  parts: [{ type: "text", text }],
});
const request = (body: unknown) =>
  new Request("https://example.com/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });

describe("public chat input boundary", () => {
  it("accepts a normal conversation", async () => {
    expect(
      (await readChatRequest(request({ messages: [message("hello")] })))
        .messages,
    ).toHaveLength(1);
  });
  it.each([
    null,
    {},
    { messages: [] },
    { messages: [message("hello", "system")] },
    { messages: [message(" ")] },
    { messages: [message("a".repeat(4001))] },
    {
      messages: [
        message("a".repeat(4000)),
        message("b".repeat(4000)),
        message("c".repeat(4000)),
        message("d"),
      ],
    },
  ])("rejects malformed or oversized messages", async (body) => {
    await expect(readChatRequest(request(body))).rejects.toMatchObject({
      status: 400,
    });
  });
  it("bounds actual bytes even without Content-Length", async () => {
    await expect(
      readChatRequest(request({ messages: [message("a".repeat(40000))] })),
    ).rejects.toMatchObject({ status: 413 });
  });
});
