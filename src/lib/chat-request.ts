import { z } from "zod";

const schema = z
  .object({
    visitor: z
      .object({
        name: z.string().max(100).optional(),
        email: z.string().email().max(254).optional(),
      })
      .optional(),
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          parts: z
            .array(
              z.object({ type: z.literal("text"), text: z.string().max(4000) }),
            )
            .min(1)
            .max(8),
        }),
      )
      .min(1)
      .max(50),
  })
  .refine(
    ({ messages }) => messages.at(-1)?.role === "user",
    "Last message must be from the user",
  )
  .refine(
    ({ messages }) =>
      messages.reduce(
        (total, message) =>
          total +
          message.parts.reduce((sum, part) => sum + part.text.length, 0),
        0,
      ) <= 12000,
    "Conversation is too long",
  )
  .refine(
    ({ messages }) => messages.at(-1)?.parts.some((part) => part.text.trim()),
    "Question is required",
  );

export class ChatInputError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function readChatRequest(req: Request) {
  if (!req.body) throw new ChatInputError(400, "Messages are required");
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32 * 1024) {
        await reader.cancel();
        throw new ChatInputError(413, "Conversation is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return schema.parse(JSON.parse(new TextDecoder().decode(buffer)));
  } catch {
    throw new ChatInputError(400, "Invalid or oversized chat messages");
  }
}
