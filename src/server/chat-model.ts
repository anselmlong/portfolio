/**
 * An OpenRouter model id (e.g. "deepseek/deepseek-v4.1-flash") plus a key routes
 * chat through OpenRouter. Requests are pinned to US-hosted providers, never
 * stored for training, and skip the model's thinking step for speed. Embeddings
 * stay on OpenAI, since the index was built with OpenAI's embedding model.
 */
export function openRouterOptions() {
  const model = process.env.CHAT_MODEL ?? "";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || !model.includes("/")) return {};
  return {
    openAIApiKey: key,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://anselmlong.com",
        "X-Title": "anselmlong.com",
      },
    },
    modelKwargs: {
      provider: {
        order: ["deepinfra", "together", "fireworks"],
        allow_fallbacks: false,
        data_collection: "deny",
      },
      reasoning: { enabled: false },
    },
  };
}
