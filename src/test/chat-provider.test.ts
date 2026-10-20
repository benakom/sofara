import { describe, expect, it, vi } from "vitest";
import { requestChat, selectChatProvider } from "../../supabase/functions/_shared/chat-provider";

describe("migration chat provider", () => {
  it("keeps Lovable when both keys exist", async () => {
    const provider = selectChatProvider("test-lovable", "test-google");
    if (!provider) throw new Error("Missing provider");
    const fetcher = vi.fn().mockResolvedValue(new Response("data: [DONE]\n\n"));
    const body = { model: "google/gemini-3-flash-preview", messages: [{ role: "user", content: "hello" }], stream: true, max_tokens: 500 };
    await requestChat(provider, body, fetcher);
    expect(fetcher.mock.calls[0][0]).toBe("https://ai.gateway.lovable.dev/v1/chat/completions");
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual(body);
  });
  it("uses gemini-3.1-flash-lite only when Lovable key is absent", async () => {
    const provider = selectChatProvider(undefined, "test-google");
    if (!provider) throw new Error("Missing provider");
    const fetcher = vi.fn().mockResolvedValue(new Response("data: [DONE]\n\n"));
    await requestChat(provider, { model: "google/gemini-3-flash-preview", messages: [{ role: "user", content: "hello" }], stream: true }, fetcher);
    expect(fetcher.mock.calls[0][0]).toBe("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions");
    expect(JSON.parse(fetcher.mock.calls[0][1].body).model).toBe("gemini-3.1-flash-lite");
    expect(JSON.parse(fetcher.mock.calls[0][1].body).stream).toBe(true);
  });
  it("does not call a provider without a configured key", () => {
    expect(selectChatProvider()).toBeUndefined();
  });
});