import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Send, Loader2, X, Sparkles } from "lucide-react";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickPrompts = lang === "fr" ? [
    "Prix moyens JVC vs Business Bay",
    "Évalue : Emaar, Downtown, 2BR, 2400 AED/sqft, 70/30",
    "Top 3 zones ROI locatif 2025",
    "Golden Visa : conditions",
  ] : [
    "Average prices JVC vs Business Bay",
    "Evaluate: Emaar, Downtown, 2BR, 2400 AED/sqft, 70/30",
    "Top 3 areas for rental ROI 2025",
    "Golden Visa: conditions",
  ];

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-50 blur-lg group-hover:opacity-100 transition-opacity animate-pulse" />
          <img src={sofaraAvatar} alt="SofarAI" className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-2xl group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[hsl(var(--background))]" />
        </div>
        <span className="absolute -top-10 right-0 bg-[hsl(var(--card))] text-xs text-[hsl(var(--foreground))] px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[hsl(var(--border))] font-medium">
          🏗️ {lang === "fr" ? "Expert Immobilier Dubai" : "Dubai Real Estate Expert"}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[620px] flex flex-col rounded-2xl shadow-2xl border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--card))]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-3.5 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M10%200v20M0%2010h20%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.06)%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        <img src={sofaraAvatar} alt="SofarAI" className="relative w-11 h-11 rounded-full object-cover border-2 border-white/30 shadow-lg" />
        <div className="flex-1 min-w-0 relative">
          <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
            SofarAI
            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">PRO</span>
          </h3>
          <p className="text-[10px] text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            {lang === "fr" ? "Expert immobilier Dubai & EAU" : "Dubai & UAE Real Estate Expert"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="relative text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-3">
            <div className="relative mb-4">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[hsl(var(--primary)/.15)] to-[hsl(var(--accent)/.15)] blur-xl" />
              <img src={sofaraAvatar} alt="SofarAI" className="relative w-20 h-20 rounded-full object-cover shadow-xl border-2 border-[hsl(var(--border))]" />
            </div>
            <h3 className="text-sm font-display font-bold text-[hsl(var(--foreground))] mb-1">
              {lang === "fr" ? "🏗️ Expert Immobilier Dubai" : "🏗️ Dubai Real Estate Expert"}
            </h3>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 max-w-[280px]">
              {lang === "fr"
                ? "Prix, évaluation, ROI, objections, scoring… Je suis votre directeur commercial IA."
                : "Prices, evaluation, ROI, objections, scoring… I'm your AI sales director."}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {quickPrompts.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-[10px] px-2.5 py-1.5 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)/.08)] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary)/.3)] transition-all leading-tight">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-200`}>
            {msg.role === "assistant" && (
              <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow-md border border-[hsl(var(--border))]" />
            )}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
              msg.role === "user"
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-md shadow-md"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-md border border-[hsl(var(--border))]"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-[hsl(var(--primary))] prose-table:text-[11px]">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow-md" />
            <div className="bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl rounded-bl-md px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  {lang === "fr" ? "Analyse en cours…" : "Analyzing…"}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === "fr" ? "Posez votre question immobilier…" : "Ask your real estate question…"}
            rows={1}
            className="flex-1 min-h-[36px] max-h-[80px] px-3.5 py-2 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] resize-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shrink-0 shadow-md">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
