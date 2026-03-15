import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useRef, useEffect } from "react";
import {
  Target, Zap, Mic, ArrowLeft, Sparkles,
  MessageSquare, Send
} from "lucide-react";
import RoleplayTool from "@/components/ai-tools/RoleplayTool";
import SequencesTool from "@/components/ai-tools/SequencesTool";
import VoiceAgentTool from "@/components/ai-tools/VoiceAgentTool";
import AutoScoreTool from "@/components/ai-tools/AutoScoreTool";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import sofaraAvatar from "@/assets/sofara-ai-avatar.png";

type Tool = "roleplay" | "sequences" | "voice" | "autoscore";
type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;

const AIHub = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
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

  const quickPrompts = lang === "fr" ? [
    "💰 Prix moyens par zone",
    "📊 Évalue un projet",
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

  const tools: {
    id: Tool;
    icon: typeof Target;
    labelFr: string;
    labelEn: string;
    descFr: string;
    descEn: string;
    gradient: string;
    badge?: string;
  }[] = [
    { id: "autoscore", icon: Target, labelFr: "Smart Scoring", labelEn: "Smart Scoring", descFr: "Scoring prédictif de vos leads", descEn: "Predictive lead scoring", gradient: "from-emerald-500 to-teal-600", badge: "AI" },
    { id: "roleplay", icon: MessageSquare, labelFr: "Roleplay Vente", labelEn: "Sales Roleplay", descFr: "Entraînement IA", descEn: "AI training", gradient: "from-violet-500 to-purple-600", badge: "NEW" },
    { id: "sequences", icon: Zap, labelFr: "Séquences", labelEn: "Sequences", descFr: "Plans de relance", descEn: "Follow-up plans", gradient: "from-amber-500 to-orange-600" },
    { id: "voice", icon: Mic, labelFr: "Voice Agent", labelEn: "Voice Agent", descFr: "Parlez vocalement", descEn: "Speak by voice", gradient: "from-sky-500 to-blue-600", badge: "BETA" },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case "roleplay": return <RoleplayTool />;
      case "sequences": return <SequencesTool />;
      case "voice": return <VoiceAgentTool />;
      case "autoscore": return <AutoScoreTool />;
      default: return null;
    }
  };

  if (activeTool) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-7rem)] flex flex-col">
        <button onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-sm dash-muted-text hover:text-[hsl(var(--dash-fg))] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          {lang === "fr" ? "Retour à SofarAI" : "Back to SofarAI"}
        </button>
        <div className="flex-1 min-h-0">{renderTool()}</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Main chat area */}
      <div className="flex-1 min-h-0 flex flex-col dash-card rounded-2xl border border-[hsl(var(--dash-border))] overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--dash-border))] bg-gradient-to-r from-[hsl(var(--primary)/.06)] to-transparent">
          <div className="relative">
            <img src={sofaraAvatar} alt="SofarAI" className="w-10 h-10 rounded-full object-cover border-2 border-[hsl(var(--primary)/.3)] shadow-md" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[hsl(var(--card))]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-display font-bold dash-text">SofarAI</h1>
              <span className="text-[9px] font-bold bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] px-2 py-0.5 rounded-full">EXPERT</span>
            </div>
            <p className="text-[11px] dash-muted-text">
              {lang === "fr" ? "Expert immobilier Dubai & EAU • En ligne" : "Dubai & UAE Real Estate Expert • Online"}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-[hsl(var(--primary)/.4)]" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="relative mb-4">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[hsl(var(--primary)/.1)] to-[hsl(var(--accent)/.1)] blur-2xl animate-pulse" />
                <img src={sofaraAvatar} alt="SofarAI" className="relative w-20 h-20 rounded-full object-cover shadow-xl border-2 border-[hsl(var(--border))]" />
              </div>
              <h2 className="text-lg font-display font-bold dash-text mb-1">
                {lang === "fr" ? "Bienvenue 👋" : "Welcome 👋"}
              </h2>
              <p className="text-sm dash-muted-text leading-relaxed mb-5 max-w-md">
                {lang === "fr"
                  ? "Je suis votre expert IA immobilier Dubai. Prix, scoring, ROI, objections… posez-moi tout !"
                  : "I'm your Dubai real estate AI expert. Prices, scoring, ROI, objections… ask me anything!"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
                {quickPrompts.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-2.5 rounded-xl border border-[hsl(var(--dash-border))] dash-muted-text hover:bg-[hsl(var(--primary)/.06)] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary)/.25)] transition-all text-left">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-1 duration-150`}>
              {msg.role === "assistant" && (
                <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow-sm border border-[hsl(var(--border))]" />
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm shadow-md"
                  : "bg-[hsl(var(--muted)/.5)] dash-text rounded-bl-sm border border-[hsl(var(--dash-border))]"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-[hsl(var(--primary))] [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1">
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
              <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0" />
              <div className="bg-[hsl(var(--muted)/.5)] border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs dash-muted-text">{lang === "fr" ? "Analyse…" : "Analyzing…"}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-[hsl(var(--dash-border))]">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === "fr" ? "Posez votre question immobilier…" : "Ask your real estate question…"}
              className="flex-1 h-10 px-4 rounded-xl bg-[hsl(var(--muted)/.4)] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shrink-0 shadow-md">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Tools strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => setActiveTool(tool.id)}
            className="group flex items-center gap-2 dash-card rounded-xl px-3 py-2.5 hover:shadow-md transition-all border border-[hsl(var(--dash-border))] whitespace-nowrap shrink-0"
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold dash-text">{lang === "fr" ? tool.labelFr : tool.labelEn}</span>
                {tool.badge && (
                  <span className={`text-[7px] font-bold px-1 py-0.5 rounded-full ${
                    tool.badge === "NEW" ? "bg-violet-100 text-violet-700"
                    : tool.badge === "BETA" ? "bg-sky-100 text-sky-700"
                    : "bg-emerald-100 text-emerald-700"
                  }`}>{tool.badge}</span>
                )}
              </div>
              <p className="text-[10px] dash-muted-text hidden sm:block">{lang === "fr" ? tool.descFr : tool.descEn}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default AIHub;
