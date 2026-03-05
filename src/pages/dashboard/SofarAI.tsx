import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bot, Building, HelpCircle, TrendingUp, Sparkles, Send, Loader2, BookOpen, Target, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;

const suggestions = [
  { icon: Building, textFr: "Avantages fiscaux à Dubai ?", textEn: "Tax advantages in Dubai?" },
  { icon: HelpCircle, textFr: "Comment gérer un lead hésitant ?", textEn: "How to manage a hesitant lead?" },
  { icon: TrendingUp, textFr: "Zones avec le meilleur ROI ?", textEn: "Areas with the best ROI?" },
  { icon: Sparkles, textFr: "Comment closer un deal off-plan ?", textEn: "How to close an off-plan deal?" },
];

const aiTools = [
  { icon: BookOpen, labelFr: "Générateur d'email", labelEn: "Email generator", descFr: "Rédigez un email professionnel pour vos leads.", descEn: "Draft a professional email for your leads." },
  { icon: Target, labelFr: "Script d'appel", labelEn: "Call script", descFr: "Générez un script de suivi ou de closing.", descEn: "Generate a follow-up or closing script." },
  { icon: Lightbulb, labelFr: "Analyse de marché", labelEn: "Market analysis", descFr: "Obtenez une analyse rapide d'une zone.", descEn: "Get a quick analysis of an area." },
];

const SofarAI = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowTools(false);

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
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de contacter SofarAI." });
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {/* Chat area - WhatsApp style */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold dash-text">SofarAI</h1>
            <p className="text-[11px] dash-muted-text">{lang === "fr" ? "En ligne • Assistant immobilier" : "Online • Real estate assistant"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 rounded-xl bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] p-3 overflow-y-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="p-3 rounded-2xl bg-[hsl(var(--primary)/.08)] mb-4">
                <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <p className="text-sm font-medium dash-text mb-1">
                {lang === "fr" ? "Comment puis-je vous aider ?" : "How can I help you?"}
              </p>
              <p className="text-xs dash-muted-text text-center max-w-xs mb-5">
                {lang === "fr" ? "Posez une question sur Dubai, vos leads ou les techniques de vente." : "Ask about Dubai, your leads or sales techniques."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(lang === "fr" ? s.textFr : s.textEn)}
                    className="flex items-center gap-2 bg-white border border-[hsl(var(--dash-border))] rounded-lg px-3 py-2 text-left hover:shadow-sm transition-shadow text-xs">
                    <s.icon className="w-3.5 h-3.5 text-[hsl(var(--primary))] shrink-0" />
                    <span className="dash-text">{lang === "fr" ? s.textFr : s.textEn}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[hsl(var(--primary))] text-white rounded-br-md"
                      : "bg-white border border-[hsl(var(--dash-border))] dash-text rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input - WhatsApp style */}
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Écrivez votre message..." : "Type your message..."}
            className="flex-1 h-10 px-4 rounded-full bg-white border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* AI Tools sidebar */}
      {showTools && (
        <div className="lg:w-60 shrink-0 space-y-3">
          <h3 className="text-xs font-semibold dash-text uppercase tracking-wider px-1">{lang === "fr" ? "Outils IA" : "AI Tools"}</h3>
          {aiTools.map((tool, i) => (
            <button key={i} onClick={() => sendMessage(lang === "fr" ? tool.descFr : tool.descEn)}
              className="w-full dash-card rounded-xl p-3.5 text-left hover:shadow-sm transition-shadow group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--primary)/.08)]">
                  <tool.icon className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                </div>
                <span className="text-xs font-medium dash-text group-hover:text-[hsl(var(--primary))] transition-colors">{lang === "fr" ? tool.labelFr : tool.labelEn}</span>
              </div>
              <p className="text-[11px] dash-muted-text">{lang === "fr" ? tool.descFr : tool.descEn}</p>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SofarAI;
