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
      <button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-50 group">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 opacity-50 blur-xl group-hover:opacity-80 transition-opacity animate-pulse" />
          <img src={sofaraAvatar} alt="SofarAI" className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-2xl group-hover:scale-110 transition-transform" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[hsl(var(--dash-bg))]" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[hsl(var(--dash-bg))]">
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
      className="fixed bottom-3 left-2 right-2 sm:bottom-5 sm:left-auto sm:right-5 z-50 w-auto sm:w-[380px] sm:max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100dvh-5.5rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden overflow-x-hidden"
      style={{ background: "linear-gradient(145deg, hsl(250, 30%, 16%), hsl(230, 25%, 12%))", border: "1px solid hsl(250, 20%, 24%)" }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, hsl(252, 60%, 55%), hsl(200, 80%, 50%))" }}>
        <img src={sofaraAvatar} alt="SofarAI" className="w-9 h-9 rounded-full object-cover border-2 border-white/30 shadow-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SofarAI</h3>
          <p className="text-[10px] text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {lang === "fr" ? "Expert immobilier" : "Property expert"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2 min-w-0">
            <img src={sofaraAvatar} alt="SofarAI" className="w-16 h-16 rounded-full object-cover shadow-lg mb-3 border-2 border-violet-400/30" />
            <p className="text-xs text-slate-300 mb-4 break-words" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === "fr" ? "💬 Posez-moi n'importe quelle question !" : "💬 Ask me anything!"}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {(lang === "fr" ? ["💰 Prix JVC", "📊 Évalue un projet", "🏆 Top ROI"] : ["💰 JVC Prices", "📊 Evaluate a project", "🏆 Top ROI"]).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-2 rounded-xl text-slate-300 hover:text-white transition-all break-words"
                  style={{ background: "hsl(250, 20%, 22%)", border: "1px solid hsl(250, 15%, 30%)" }}
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
              <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0 border border-violet-400/30" />
            )}
            <div
              className={`max-w-[88%] sm:max-w-[82%] min-w-0 overflow-hidden rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === "user" ? "rounded-br-sm text-white shadow-md" : "rounded-bl-sm text-slate-200"
              }`}
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg, hsl(252, 60%, 55%), hsl(200, 70%, 50%))" }
                : { background: "hsl(250, 18%, 20%)", border: "1px solid hsl(250, 12%, 28%)" }}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-invert prose-xs max-w-none break-words overflow-x-auto prose-p:my-0.5 prose-li:my-0 prose-strong:text-violet-300 prose-headings:text-white [&_p]:text-[13px] [&_li]:text-[13px] [&_p]:text-slate-200 [&_li]:text-slate-200 [&_pre]:overflow-x-auto [&_code]:break-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap break-words" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0" />
            <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "hsl(250, 18%, 20%)", border: "1px solid hsl(250, 12%, 28%)" }}>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-2.5" style={{ borderTop: "1px solid hsl(250, 12%, 22%)" }}>
        <div className="flex gap-2 items-center min-w-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Votre question…" : "Your question…"}
            className="flex-1 min-w-0 h-9 px-3.5 rounded-xl text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            style={{ background: "hsl(250, 18%, 18%)", border: "1px solid hsl(250, 12%, 26%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-xl text-white flex items-center justify-center disabled:opacity-30 shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(252, 60%, 55%), hsl(200, 70%, 50%))" }}>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
