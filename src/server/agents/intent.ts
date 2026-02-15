import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod";

// IntentSchema for what the intent detector returns
const IntentSchema = z.object({
  intent: z.enum(["calendar", "general"]),
})

export type DetectedIntent = z.infer<typeof IntentSchema>;

export async function detectIntent (query:string):
Promise<DetectedIntent> {
  // we want to detect the intent with this model
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY!,

  });


  // structured output
  const structuredModel = model.withStructuredOutput(IntentSchema);

  const response = await structuredModel.invoke([
    {
      role: "system",
      content: `You are an intent analyzer. Analyze if the user is asking about scheduling, availability, or calendar.
        Return "calendar" if they're asking about:
        - When someone is free
        - Booking a meeting
        - Schedule/availability
        - Setting up a call
        
        Return "general" for everything else. Return only either one of those 2 words`,
    },
    {
      role: "user",
      content: query,
    },
  ]);

  return response;

}
