// /content/schema.ts
import { z } from "zod";

export const Project = z.object({
  title: z.string(),
  description: z.string(),
  tech: z.array(z.string()),
  href: z.string().url(),
  repo: z.string().url().optional(),
  highlight: z.boolean().default(false),
});
export type Project = z.infer<typeof Project>;
