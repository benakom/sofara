import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Send, X, Minus } from "lucide-react";
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Click outside to minimize
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
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
        toast({ variant: "destructive", title: "Erreur", description: lang === "ar" ? "Connectez-vous d'abord." : "Please log in first." });
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
      <button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-50 group">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-[hsl(var(--dash-accent))] opacity-30 blur-xl group-hover:opacity-60 transition-opacity animate-pulse" />
          <img src={sofaraAvatar} alt="SofarAI" className="relative w-14 h-14 rounded-full object-cover border-2 border-[hsl(var(--dash-accent)/.4)] shadow-2xl group-hover:scale-110 transition-transform" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[hsl(var(--dash-bg))]" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] text-[9px] font-bold flex items-center justify-center border-2 border-[hsl(var(--dash-bg))]">
              {messages.filter(m => m.role === "assistant").length}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed bottom-3 left-2 right-2 sm:bottom-5 sm:left-auto sm:right-5 z-50 w-auto sm:w-[380px] sm:max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100dvh-5.5rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden overflow-x-hidden bg-[hsl(var(--dash-bg))] border border-[hsl(var(--dash-border))]"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 bg-[hsl(var(--dash-accent))]">
        <img src={sofaraAvatar} alt="SofarAI" className="w-9 h-9 rounded-full object-cover border-2 border-black/20 shadow-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[hsl(var(--dash-accent-fg))] font-display">SofarAI</h3>
          <p className="text-[10px] text-[hsl(var(--dash-accent-fg)/.7)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            {lang === "ar" ? "Expert immobilier" : "Property expert"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[hsl(var(--dash-accent-fg)/.6)] hover:text-[hsl(var(--dash-accent-fg))] p-1.5 hover:bg-black/10 rounded-lg transition-colors">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 space-y-3 bg-[hsl(var(--dash-muted)/.3)]" style={{ scrollbarWidth: "thin" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2 min-w-0">
            <img src={sofaraAvatar} alt="SofarAI" className="w-16 h-16 rounded-full object-cover shadow-lg mb-3 border-2 border-[hsl(var(--dash-accent)/.3)]" />
            <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-4 break-words font-display">
              {lang === "ar" ? "💬 Posez-moi n'importe quelle question !" : "💬 Ask me anything!"}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {(lang === "ar" ? ["💰 Prix JVC", "📊 Évalue un projet", "🏆 Top ROI"] : ["💰 JVC Prices", "📊 Evaluate a project", "🏆 Top ROI"]).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-2 rounded-xl text-[hsl(var(--dash-fg))] hover:text-[hsl(var(--dash-accent))] transition-all break-words bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.4)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0 border border-[hsl(var(--dash-accent)/.3)]" />
            )}
            <div
              className={`max-w-[88%] sm:max-w-[82%] min-w-0 overflow-hidden rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm text-[hsl(var(--dash-accent-fg))] shadow-md bg-[hsl(var(--dash-accent))]"
                  : "rounded-bl-sm text-[hsl(var(--dash-fg))] bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-xs max-w-none break-words overflow-x-auto prose-p:my-0.5 prose-li:my-0 prose-strong:text-[hsl(var(--dash-accent))] prose-headings:text-[hsl(var(--dash-fg))] [&_p]:text-[13px] [&_li]:text-[13px] [&_p]:text-[hsl(var(--dash-fg))] [&_li]:text-[hsl(var(--dash-fg))] [&_pre]:overflow-x-auto [&_code]:break-all">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap break-words font-display">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0" />
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent))] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent)/.6)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent))] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-2.5 border-t border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
        <div className="flex gap-2 items-center min-w-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "ar" ? "Votre question…" : "Your question…"}
            className="flex-1 min-w-0 h-9 px-3.5 rounded-xl text-[13px] text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.4)] bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] font-display"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] flex items-center justify-center disabled:opacity-30 shrink-0 hover:opacity-90 transition-opacity">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
