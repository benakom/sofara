type ChatBody = {
  model: string;
  messages: { role: string; content: string }[];
  stream: boolean;
  max_tokens?: number;
};

/** Keep the existing OpenAI-compatible stream contract on both providers. */
export function selectChatProvider(lovableKey?: string, geminiKey?: string) {
  if (lovableKey) return {
    url: "https://ai.gateway.lovable.dev/v1/chat/completions",
    key: lovableKey,
    model: undefined,
  };
  if (geminiKey) return {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    key: geminiKey,
    model: "gemini-3.1-flash-lite",
  };
  return undefined;
}

export function requestChat(
  provider: NonNullable<ReturnType<typeof selectChatProvider>>,
  body: ChatBody,
  fetcher: typeof fetch = fetch,
) {
  return fetcher(provider.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, model: provider.model ?? body.model }),
  });
}