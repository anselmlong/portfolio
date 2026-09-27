import { z } from "zod";
import { addClicks, readClicks } from "~/server/clicks";
import { pool } from "~/server/pg";

export const runtime = "nodejs";

// The browser batches presses and sends at most one small batch a second or so.
const maxBatch = 40;
const bodySchema = z.object({ n: z.number().int().min(1).max(maxBatch) });

// Per-instance brake per address: generous for a human mashing the button,
// useless for a script trying to inflate the count.
const windowMs = 60 * 1000;
const perWindow = 600;
const seen = new Map<string, { start: number; n: number }>();
function allow(ip: string, n: number) {
  const now = Date.now();
  if (seen.size > 5000)
    for (const [k, v] of seen) if (now - v.start > windowMs) seen.delete(k);
  const entry = seen.get(ip);
  if (!entry || now - entry.start > windowMs) {
    seen.set(ip, { start: now, n });
    return true;
  }
  if (entry.n + n > perWindow) return false;
  entry.n += n;
  return true;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  try {
    return json({ total: await readClicks(pool) });
  } catch (error) {
    console.error("[clicks] read failed", error);
    return json({ error: "Counter unavailable." }, 503);
  }
}

export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return json({ error: "Invalid request origin." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json"))
    return json({ error: "JSON required." }, 415);
  let n: number;
  try {
    const text = await req.text();
    if (text.length > 200) return json({ error: "Too large." }, 413);
    n = bodySchema.parse(JSON.parse(text)).n;
  } catch {
    return json({ error: "Invalid count." }, 400);
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip, n)) return json({ error: "Easy on the shutter." }, 429);
  try {
    return json({ total: await addClicks(pool, n) });
  } catch (error) {
    console.error("[clicks] write failed", error);
    return json({ error: "Counter unavailable." }, 503);
  }
}
