import { type NextRequest } from "next/server";
import { z } from "zod";
import { detectIntent } from "~/server/agents/intent";

const intentRequestSchema = z.object({
  query: z.string().trim().min(1, "Query is required"),
});

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const json = (await req.json()) as unknown;
    const parsed = intentRequestSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const decision = await detectIntent(parsed.data.query);
    return Response.json(decision, { status: 200 });
  } catch (error) {
    console.error("Error in intent route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
