import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import ReactMarkdown from "react-markdown";
const avatarImg = "/favicon.png";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/landing-chat`;
const MAX_QUESTIONS = 8;

type Msg = { role: "user" | "assistant"; content: string };

const i18n: Record<string, Record<Lang, string>> = {
  welcome: {
    en: "Hi! I'm Sara, your Sofara assistant 👋 Ask me anything about investing in Dubai or the ambassador program.",
    ar: "مرحباً! أنا سارة، مساعدة Sofara 👋 اسألني عن الاستثمار في دبي أو برنامج السفراء.",
  },
  placeholder: {
    en: "Ask your question…",
    ar: "اطرح سؤالك…",
  },
  limitReached: {
    en: "You've reached the question limit for this session. Contact us at hello@sofara.io to continue the conversation!",
    ar: "لقد وصلت إلى حد الأسئلة لهذه الجلسة. تواصل معنا على hello@sofara.io!",
  },
  online: {
    en: "Online",
    ar: "متصل",
  },
};

export default function LandingChatbot() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [welcomed, setWelcomed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && !welcomed) {
      setWelcomed(true);
      setTimeout(() => {
        setMessages([{ role: "assistant", content: i18n.welcome[lang] }]);
      }, 400);
    }
  }, [isOpen, welcomed, lang]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (questionCount >= MAX_QUESTIONS) {
      setMessages(prev => [...prev, { role: "user", content: text.trim() }, { role: "assistant", content: i18n.limitReached[lang] }]);
      setInput("");
      return;
    }

    const userMsg: Msg = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    setQuestionCount(prev => prev + 1);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user")
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: updated }),
      });

      if (!resp.ok) {
        upsert("Sorry, something went wrong. Please try again.");
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
          } catch { /* skip */ }
        }
      }
    } catch {
      upsert("Connection error. Please try again.");
    }
    setIsLoading(false);
  };

  const limitReached = questionCount >= MAX_QUESTIONS;

  /* ── Collapsed bubble ── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute -inset-2 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" style={{ background: "radial-gradient(circle, #CCFF00 0%, transparent 70%)" }} />
          {/* Ping ring animation */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: "2px solid #CCFF00" }} />
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
            style={{ background: "#134830", border: "2px solid #CCFF00", boxShadow: "0 0 16px #CCFF0040, 0 0 4px #CCFF0060 inset" }}
          >
            <img src={avatarImg} alt="Sofara" className="w-9 h-9 object-contain" />
          </div>
          {/* Green online dot with ping */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </div>
      </button>
    );
  }

  /* ── Expanded chat window ── */
  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 w-[90vw] sm:w-[360px] h-[500px] max-h-[calc(100dvh-5rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "hsl(228, 12%, 6%)", border: "1px solid hsl(228, 8%, 16%)" }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: "hsl(228, 12%, 4%)", borderBottom: "1px solid hsl(228, 8%, 14%)" }}>
          <img src={avatarImg} alt="Sara" className="w-9 h-9 rounded-full object-cover border border-foreground/10" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Sara</h3>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {i18n.online[lang]}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <img src={avatarImg} alt="Sara" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0 border border-foreground/10" />
              )}
              <div
                className={`max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm text-primary-foreground"
                    : "rounded-bl-sm text-foreground/90"
                }`}
                style={msg.role === "user"
                  ? { background: "var(--gradient-primary)" }
                  : { background: "hsl(228, 8%, 12%)", border: "1px solid hsl(228, 8%, 18%)" }}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-xs max-w-none break-words [&_p]:text-[13px] [&_p]:my-0.5 [&_li]:text-[13px] [&_li]:my-0 prose-strong:text-primary [&_p]:text-foreground/90 [&_li]:text-foreground/90"
                    style={{ fontFamily: "var(--font-body)" }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap break-words" style={{ fontFamily: "var(--font-body)" }}>{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <img src={avatarImg} alt="Sara" className="w-6 h-6 rounded-full object-cover mr-2 mt-1 shrink-0" />
              <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "hsl(228, 8%, 12%)", border: "1px solid hsl(228, 8%, 18%)" }}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="p-2.5 shrink-0"
          style={{ borderTop: "1px solid hsl(228, 8%, 14%)" }}
        >
          {limitReached ? (
            <p className="text-[11px] text-muted-foreground text-center py-1">
              {i18n.limitReached[lang]}
            </p>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={i18n.placeholder[lang]}
                className="flex-1 min-w-0 h-9 px-3.5 rounded-xl text-[13px] text-foreground placeholder:text-muted-foreground/60 bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                style={{ fontFamily: "var(--font-body)" }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-xl text-primary-foreground flex items-center justify-center disabled:opacity-30 shrink-0 hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-[9px] text-muted-foreground/40 text-center mt-1.5">Powered by Sofara</p>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
