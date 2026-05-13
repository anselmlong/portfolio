export const runtime = "edge";

export async function POST(req: Request) {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  const agentToken = process.env.AGENT_TOKEN;

  if (!agentUrl || !agentToken) {
    return new Response("Agent service not configured", { status: 500 });
  }

  const body = await req.json() as unknown;

  const upstream = await fetch(`${agentUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Agent-Token": agentToken,
    },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    return new Response("Agent service error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
