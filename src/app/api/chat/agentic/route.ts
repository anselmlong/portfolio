export const runtime = "edge";

import type { UIMessage } from "ai";

type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgenticChatRequest = {
  messages?: UIMessage[];
  visitor?: {
    name?: string;
    email?: string;
  };
};

const extractText = (message: UIMessage) =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

const toAgentMessages = (messages: UIMessage[] = []): AgentMessage[] =>
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
  const body = (await req.json()) as AgenticChatRequest;

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
      },
    });
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
