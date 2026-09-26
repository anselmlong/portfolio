export const runtime = "nodejs";
export const maxDuration = 30;

import { ChatInputError, readChatRequest } from "~/lib/chat-request";
import { reserveChatRequest } from "~/server/chat-budget";
import { pool } from "~/server/pg";

type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatMessage = Awaited<
  ReturnType<typeof readChatRequest>
>["messages"][number];

const extractText = (message: ChatMessage) =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

const toAgentMessages = (messages: ChatMessage[] = []): AgentMessage[] =>
  messages.flatMap((message) => {
    if (message.role !== "user" && message.role !== "assistant") return [];

    const content = extractText(message);
    if (!content.trim()) return [];

    return [{ role: message.role, content }];
  });

const streamAgentEventsAsText = (body: ReadableStream<Uint8Array>) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.slice("data:".length).trimStart();
          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data) as {
              content?: unknown;
              error?: unknown;
            };
            if (typeof parsed.content === "string") {
              controller.enqueue(encoder.encode(parsed.content));
            } else if (typeof parsed.error === "string") {
              controller.enqueue(encoder.encode(parsed.error));
            }
          } catch {
            controller.enqueue(encoder.encode(data));
          }
        }
      },
      flush(controller) {
        const trailing = buffer.trim();
        if (trailing.startsWith("data:")) {
          const data = trailing.slice("data:".length).trimStart();
          if (data && data !== "[DONE]") {
            controller.enqueue(encoder.encode(data));
          }
        }
      },
    }),
  );
};

export async function POST(req: Request) {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  const agentToken = process.env.AGENT_TOKEN;
  let body: Awaited<ReturnType<typeof readChatRequest>>;
  try {
    body = await readChatRequest(req);
  } catch (error) {
    return Response.json(
      { error: "Invalid chat request" },
      { status: error instanceof ChatInputError ? error.status : 400 },
    );
  }

  if (!agentUrl || !agentToken) {
    const fallback = await fetch(new URL("/api/chat", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return new Response(fallback.body, {
      status: fallback.status,
      headers: {
        "Content-Type": fallback.headers.get("Content-Type") ?? "text/plain",
        ...(fallback.headers.has("Retry-After")
          ? { "Retry-After": fallback.headers.get("Retry-After")! }
          : {}),
      },
    });
  }

  try {
    if (!(await reserveChatRequest(pool))) {
      return Response.json(
        { error: "Chat has reached its daily allowance" },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }
  } catch {
    return Response.json(
      { error: "Chat is temporarily unavailable" },
      { status: 503 },
    );
  }

  const upstream = await fetch(`${agentUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Agent-Token": agentToken,
    },
    body: JSON.stringify({
      messages: toAgentMessages(body.messages),
      visitor: body.visitor ?? {},
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!upstream.ok) {
    return new Response("Agent service error", { status: upstream.status });
  }

  if (!upstream.body) {
    return new Response("Agent service returned an empty response", {
      status: 502,
    });
  }

  return new Response(streamAgentEventsAsText(upstream.body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
