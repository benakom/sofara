import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Send, Loader2, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import sofaraAvatar from "@/assets/sofara-ai-avatar.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;

export default function AvatarChat() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant")
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({ variant: "destructive", title: "Erreur", description: lang === "fr" ? "Connectez-vous d'abord." : "Please log in first." });
        setIsLoading(false);
        return;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: updated }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Error" }));
        toast({ variant: "destructive", title: "Erreur", description: err.error });
        setIsLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch { break; }
        }
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de contacter SofarAI." });
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
          <img
            src={sofaraAvatar}
            alt="SofarAI Assistant"
            className="relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-2xl group-hover:scale-110 transition-transform"
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
        </div>
        <span className="absolute -top-8 right-0 bg-[hsl(var(--dash-card))] text-xs dash-text px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[hsl(var(--dash-border))]">
          {lang === "fr" ? "Parler à SofarAI" : "Talk to SofarAI"}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] flex flex-col rounded-2xl shadow-2xl border border-[hsl(var(--dash-border))] overflow-hidden bg-[hsl(var(--dash-card))]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-3 flex items-center gap-3">
        <img src={sofaraAvatar} alt="SofarAI" className="w-10 h-10 rounded-full object-cover border-2 border-white/30" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-display font-bold text-white">SofarAI</h3>
          <p className="text-[10px] text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {lang === "fr" ? "En ligne — Experte immobilier Dubai" : "Online — Dubai real estate expert"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <img src={sofaraAvatar} alt="SofarAI" className="w-20 h-20 rounded-full object-cover mb-3 shadow-lg" />
            <h3 className="text-sm font-display font-semibold dash-text mb-1">
              {lang === "fr" ? "Bonjour ! Je suis SofarAI 👋" : "Hi! I'm SofarAI 👋"}
            </h3>
            <p className="text-xs dash-muted-text leading-relaxed mb-4">
              {lang === "fr"
                ? "Votre assistante IA experte en immobilier Dubai. Posez-moi vos questions sur la qualification des leads, le closing, les objections, la fiscalité, les zones…"
                : "Your AI assistant for Dubai real estate. Ask me about lead qualification, closing, objections, taxation, areas…"}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {(lang === "fr"
                ? ["Qualifier un lead", "Gérer les objections", "Zones à investir", "Techniques de closing"]
                : ["Qualify a lead", "Handle objections", "Best areas to invest", "Closing techniques"]
              ).map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] px-2.5 py-1.5 rounded-full border border-[hsl(var(--dash-border))] dash-muted-text hover:bg-[hsl(var(--primary)/.08)] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary)/.3)] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow" />
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-[13px] ${
              msg.role === "user"
                ? "bg-[hsl(var(--primary))] text-white rounded-br-md"
                : "bg-[hsl(var(--dash-muted))] dash-text rounded-bl-md border border-[hsl(var(--dash-border))]"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-[hsl(var(--primary))]">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow" />
            <div className="bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-[hsl(var(--primary))]" />
                <span className="text-[11px] dash-muted-text">{lang === "fr" ? "Réflexion…" : "Thinking…"}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-[hsl(var(--dash-border))]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Posez votre question…" : "Ask your question…"}
            className="flex-1 h-9 px-3 rounded-full bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
