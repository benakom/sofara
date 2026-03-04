import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bot, Building, HelpCircle, TrendingUp, Sparkles, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;

const suggestions = [
  { icon: Building, textFr: "Quels sont les avantages fiscaux à Dubai ?", textEn: "What are the tax advantages in Dubai?" },
  { icon: HelpCircle, textFr: "Comment gérer un lead qui hésite ?", textEn: "How to manage a hesitant lead?" },
  { icon: TrendingUp, textFr: "Quelles zones offrent le meilleur ROI ?", textEn: "Which areas offer the best ROI?" },
  { icon: Sparkles, textFr: "Comment bien closer un deal off-plan ?", textEn: "How to close an off-plan deal?" },
];

const SofarAI = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        toast({ variant: "destructive", title: "Erreur", description: err.error || "Erreur du service IA" });
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de contacter SofarAI" });
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold dash-text">SofarAI</h1>
          <p className="dash-muted-text text-sm">{lang === "fr" ? "Votre assistant IA pour l'immobilier Dubai" : "Your AI assistant for Dubai real estate"}</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 dash-card rounded-2xl p-4 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold dash-text mb-2">
              {lang === "fr" ? "Comment puis-je vous aider ?" : "How can I help you?"}
            </h2>
            <p className="text-sm dash-muted-text text-center max-w-md mb-8">
              {lang === "fr"
                ? "Posez-moi des questions sur l'immobilier Dubai, vos leads, ou les techniques de vente."
                : "Ask me questions about Dubai real estate, your leads, or sales techniques."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(lang === "fr" ? s.textFr : s.textEn)}
                  className="flex items-start gap-3 dash-muted-bg border dash-border-color rounded-xl p-3 text-left hover:bg-primary/5 transition-colors text-sm"
                >
                  <s.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="dash-text">{lang === "fr" ? s.textFr : s.textEn}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "dash-muted-bg dash-text"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="dash-muted-bg rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin dash-muted-text" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "fr" ? "Posez votre question sur l'immobilier Dubai, vos leads..." : "Ask about Dubai real estate, your leads..."}
          className="dash-card dash-border-color flex-1 dash-text"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  );
};

export default SofarAI;
