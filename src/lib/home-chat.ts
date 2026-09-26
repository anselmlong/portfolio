import { isIntent } from "~/lib/conversation";
import {
  intentTopics,
  projectTopics,
  type TopicKey,
} from "~/lib/home-content";

export type Turn = { role: "user" | "assistant"; content: string };

export class ChatFailure extends Error {
  constructor(
    public status: number,
    public code: string | undefined,
    public requestId: string | null,
  ) {
    super(`Chat request failed: ${status} ${code ?? ""} ${requestId ?? ""}`);
  }
}

export function chatErrorMessage(failure: unknown, timedOut: boolean) {
  const keep = "Your question is back in the box.";
  if (timedOut) return `That took too long, so I stopped waiting. ${keep}`;
  if (failure instanceof ChatFailure) {
    if (failure.status === 429)
      return `Chat has hit its limit for now. Try later, or pick a question below. ${keep}`;
    if (failure.status === 400 || failure.status === 413)
      return `That message couldn't be sent. Try a shorter question. ${keep}`;
    return `Something broke on my end (${failure.code ?? failure.status}). Try again in a moment. ${keep}`;
  }
  return `The connection dropped before I could answer. ${keep}`;
}

/** The last few turns, in the shape /api/chat expects. */
function toMessages(history: Turn[], question: string) {
  return [...history.slice(-8), { role: "user" as const, content: question }]
    .filter((m) => m.content.trim())
    .map((m) => ({
      id: crypto.randomUUID(),
      role: m.role,
      parts: [{ type: "text", text: m.content.slice(0, 1200) }],
    }));
}

/**
 * Streams the RAG answer. Only the wait for the first byte is timed out, so a
 * long answer is never cut off. Avoids AbortSignal.any, which older iOS in-app
 * browsers (Instagram, LinkedIn) lack.
 */
export async function streamAnswer(
  history: Turn[],
  question: string,
  signal: AbortSignal,
  onText: (text: string) => void,
  firstByteMs = 25000,
): Promise<string> {
  const request = new AbortController();
  const forward = () => request.abort(signal.reason);
  signal.addEventListener("abort", forward);
  const timer = setTimeout(() => request.abort("timeout"), firstByteMs);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      signal: request.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toMessages(history, question) }),
    });
    if (!response.ok || !response.body) {
      const detail = (await response.json().catch(() => null)) as {
        code?: string;
      } | null;
      throw new ChatFailure(
        response.status,
        detail?.code,
        response.headers.get("x-vercel-id"),
      );
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let answer = "";
    while (true) {
      const { done, value } = await reader.read();
      clearTimeout(timer);
      if (done) break;
      answer += decoder.decode(value, { stream: true });
      onText(answer);
    }
    answer += decoder.decode();
    onText(answer);
    return answer;
  } catch (failure) {
    if (request.signal.reason === "timeout") throw new TimeoutError();
    throw failure;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", forward);
  }
}

export class TimeoutError extends Error {}

/**
 * Asks Jev which trusted card to show beside the answer. It returns only a
 * known intent and project name, never text; a failure just means no card.
 */
export async function pickTopic(
  history: Turn[],
  question: string,
  signal: AbortSignal,
): Promise<TopicKey | null> {
  try {
    const response = await fetch("/api/reveal", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...history.slice(-8), { role: "user", content: question }]
          .filter((m) => m.content.trim())
          .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) })),
      }),
    });
    if (!response.ok) {
      console.warn("[reveal] unavailable", response.status);
      return null;
    }
    const reveal = (await response.json()) as {
      intent?: unknown;
      projects?: unknown;
    };
    if (!isIntent(reveal.intent) || reveal.intent === "clarify") return null;
    const project = Array.isArray(reveal.projects)
      ? (reveal.projects[0] as unknown)
      : undefined;
    if (typeof project === "string" && projectTopics[project])
      return projectTopics[project];
    return intentTopics[reveal.intent] ?? null;
  } catch (failure) {
    if (!signal.aborted) console.warn("[reveal] failed", failure);
    return null;
  }
}
