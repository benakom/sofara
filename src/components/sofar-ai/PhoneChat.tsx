import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Send, Wifi, Battery, Signal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import sofaraAvatar from "@/assets/sofara-ai-avatar.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;

export default function PhoneChat() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const quickPrompts = lang === "ar" ? [
    "💰 Prix moyens par zone",
    "📊 Évaluer un projet",
    "🏆 Top ROI 2025",
    "🎯 Gérer une objection",
    "🏗️ Comparer développeurs",
    "🪪 Golden Visa",
  ] : [
    "💰 Average prices by area",
    "📊 Evaluate a project",
    "🏆 Top ROI 2025",
    "🎯 Handle an objection",
    "🏗️ Compare developers",
    "🪪 Golden Visa",
  ];

  return (
    <div className="relative mx-auto" style={{ width: 380, height: 760 }}>
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-[0_0_60px_rgba(0,0,0,0.4)] p-[3px]">
        <div className="w-full h-full rounded-[2.8rem] bg-gradient-to-b from-zinc-700 to-zinc-800 p-[3px]">
          <div className="w-full h-full rounded-[2.6rem] overflow-hidden bg-[hsl(var(--dash-bg))] flex flex-col">

            {/* Notch & status bar */}
            <div className="bg-[hsl(var(--dash-bg))] pt-2 pb-1 px-6 flex items-center justify-between relative">
              <span className="text-[10px] text-[hsl(var(--dash-muted-fg))] font-medium">{timeStr}</span>
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-28 h-6 bg-black rounded-b-2xl flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600" />
              </div>
              <div className="flex items-center gap-1 text-[hsl(var(--dash-muted-fg))]">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* App header */}
            <div className="bg-[hsl(var(--dash-accent))] px-4 py-3 flex items-center gap-3">
              <div className="relative">
                <img src={sofaraAvatar} alt="SofarAI" className="w-10 h-10 rounded-full object-cover border-2 border-black/20 shadow-lg" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-[hsl(var(--dash-accent))]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-display font-bold text-[hsl(var(--dash-accent-fg))]">SofarAI</h3>
                <p className="text-[9px] text-[hsl(var(--dash-accent-fg)/.6)]">
                  {lang === "ar" ? "Expert immobilier Dubai • En ligne" : "Dubai Real Estate Expert • Online"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] bg-black/20 text-[hsl(var(--dash-accent-fg))] px-2 py-0.5 rounded-full font-semibold">PRO</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[hsl(var(--dash-muted)/.3)]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-2">
                  <div className="relative mb-3">
                    <div className="absolute -inset-4 rounded-full bg-[hsl(var(--dash-accent)/.15)] blur-xl animate-pulse" />
                    <img src={sofaraAvatar} alt="SofarAI" className="relative w-16 h-16 rounded-full object-cover shadow-xl border-2 border-[hsl(var(--dash-border))]" />
                  </div>
                  <h3 className="text-[13px] font-display font-bold text-[hsl(var(--dash-fg))] mb-0.5">
                    {lang === "ar" ? "Bienvenue 👋" : "Welcome 👋"}
                  </h3>
                  <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] leading-relaxed mb-3 max-w-[250px]">
                    {lang === "ar"
                      ? "Expert IA immobilier Dubai. Prix, scoring, ROI, objections… posez-moi tout !"
                      : "Dubai real estate AI expert. Prices, scoring, ROI, objections… ask anything!"}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    {quickPrompts.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-[10px] px-2 py-2 rounded-xl border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-accent)/.08)] hover:text-[hsl(var(--dash-accent))] hover:border-[hsl(var(--dash-accent)/.3)] transition-all leading-tight text-left">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-1 duration-150`}>
                  {msg.role === "assistant" && (
                    <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-1.5 mt-1 shrink-0 shadow-sm border border-[hsl(var(--dash-border))]" />
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] rounded-br-sm shadow-md"
                      : "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-fg))] rounded-bl-sm border border-[hsl(var(--dash-border))] shadow-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-0.5 prose-li:my-0 prose-headings:mt-1.5 prose-headings:mb-0.5 prose-strong:text-[hsl(var(--dash-accent))] prose-table:text-[10px] [&_p]:text-[12px] [&_li]:text-[12px]">
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
                  <img src={sofaraAvatar} alt="AI" className="w-6 h-6 rounded-full object-cover mr-1.5 mt-1 shrink-0" />
                  <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-sm px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent))] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent)/.6)] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--dash-accent))] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[10px] text-[hsl(var(--dash-muted-fg))]">
                        {lang === "ar" ? "Analyse…" : "Analyzing…"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-2.5 border-t border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
              <div className="flex gap-1.5 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(input); }}}
                  placeholder={lang === "ar" ? "Message SofarAI…" : "Message SofarAI…"}
                  className="flex-1 h-9 px-3 rounded-full bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] text-[12px] text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)]"
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shrink-0 shadow-md">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-1 bg-[hsl(var(--dash-card))]">
              <div className="w-24 h-1 rounded-full bg-[hsl(var(--dash-muted-fg)/.3)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
