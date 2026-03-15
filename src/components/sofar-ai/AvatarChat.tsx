import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Send, X } from "lucide-react";
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
    // Delay to avoid immediate close on open click
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

  // Minimized state: just avatar bubble
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-40 blur-lg group-hover:opacity-80 transition-opacity animate-pulse" />
          <img src={sofaraAvatar} alt="SofarAI" className="relative w-14 h-14 rounded-full object-cover border-2 border-[hsl(var(--border))] shadow-2xl group-hover:scale-110 transition-transform" />
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[hsl(var(--background))]" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[hsl(var(--background))]">
              {messages.filter(m => m.role === "assistant").length}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] flex flex-col rounded-2xl shadow-2xl border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--card))]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] px-3 py-2.5 flex items-center gap-2.5">
        <img src={sofaraAvatar} alt="SofarAI" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-display font-bold text-white">SofarAI Expert</h3>
          <p className="text-[9px] text-white/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {lang === "fr" ? "En ligne" : "Online"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img src={sofaraAvatar} alt="SofarAI" className="w-14 h-14 rounded-full object-cover shadow-lg mb-3 border border-[hsl(var(--border))]" />
            <p className="text-xs dash-muted-text mb-3">
              {lang === "fr" ? "💬 Posez-moi n'importe quelle question" : "💬 Ask me anything"}
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {(lang === "fr" ? ["💰 Prix JVC", "📊 Scoring projet", "🏆 Top ROI"] : ["💰 JVC Prices", "📊 Project scoring", "🏆 Top ROI"]).map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-[10px] px-2 py-1.5 rounded-lg border border-[hsl(var(--border))] dash-muted-text hover:bg-[hsl(var(--primary)/.06)] hover:text-[hsl(var(--primary))] transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-1.5 mt-1 shrink-0 border border-[hsl(var(--border))]" />
            )}
            <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm"
                : "bg-[hsl(var(--muted)/.5)] dash-text rounded-bl-sm border border-[hsl(var(--border))]"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-xs max-w-none prose-p:my-0.5 prose-li:my-0 prose-strong:text-[hsl(var(--primary))] [&_p]:text-xs [&_li]:text-xs">
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
            <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-1.5 mt-1 shrink-0" />
            <div className="bg-[hsl(var(--muted)/.5)] border border-[hsl(var(--border))] rounded-2xl rounded-bl-sm px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-2 border-t border-[hsl(var(--border))]">
        <div className="flex gap-1.5 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Votre question…" : "Your question…"}
            className="flex-1 h-8 px-3 rounded-lg bg-[hsl(var(--muted)/.4)] border border-[hsl(var(--border))] text-xs dash-text placeholder:dash-muted-text focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/.3)]"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white flex items-center justify-center disabled:opacity-40 shrink-0">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
