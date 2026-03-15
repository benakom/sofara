import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useRef, useEffect } from "react";
import {
  Target, Zap, Mic, ArrowLeft, Sparkles,
  MessageSquare, Send, Scale
} from "lucide-react";
import RoleplayTool from "@/components/ai-tools/RoleplayTool";
import SequencesTool from "@/components/ai-tools/SequencesTool";
import VoiceAgentTool from "@/components/ai-tools/VoiceAgentTool";
import AutoScoreTool from "@/components/ai-tools/AutoScoreTool";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import sofaraAvatar from "@/assets/sofara-ai-avatar.png";

type Tool = "roleplay" | "sequences" | "voice" | "autoscore" | "legalai";
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
    { id: "autoscore", icon: Target, labelFr: "Smart Scoring", labelEn: "Smart Scoring", descFr: "Scoring prédictif", descEn: "Predictive scoring", gradient: "from-emerald-500 to-teal-600", badge: "AI" },
    { id: "legalai", icon: Scale, labelFr: "LegalAI", labelEn: "LegalAI", descFr: "Analyse de contrats", descEn: "Contract analysis", gradient: "from-amber-500 to-yellow-600", badge: "PRO" },
    { id: "roleplay", icon: MessageSquare, labelFr: "Roleplay", labelEn: "Roleplay", descFr: "Entraînement vente", descEn: "Sales training", gradient: "from-violet-500 to-purple-600" },
    { id: "sequences", icon: Zap, labelFr: "Séquences", labelEn: "Sequences", descFr: "Plans de relance", descEn: "Follow-up plans", gradient: "from-sky-500 to-blue-600" },
    { id: "voice", icon: Mic, labelFr: "Voice", labelEn: "Voice", descFr: "Agent vocal", descEn: "Voice agent", gradient: "from-rose-500 to-pink-600", badge: "BETA" },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case "roleplay": return <RoleplayTool />;
      case "sequences": return <SequencesTool />;
      case "voice": return <VoiceAgentTool />;
      case "autoscore": return <AutoScoreTool />;
      case "legalai": return <LegalAIGate />;
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-7rem)] flex flex-col gap-3"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Main chat */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(180deg, hsl(250, 25%, 14%), hsl(230, 20%, 10%))", border: "1px solid hsl(250, 15%, 22%)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(252, 55%, 50%), hsl(200, 75%, 48%))", borderBottom: "1px solid hsl(252, 40%, 45%)" }}>
          <div className="relative">
            <img src={sofaraAvatar} alt="SofarAI" className="w-10 h-10 rounded-full object-cover border-2 border-white/25 shadow-lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[hsl(252,55%,50%)]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">SofarAI</h1>
              <span className="text-[9px] font-bold bg-white/15 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm">EXPERT</span>
            </div>
            <p className="text-[11px] text-white/60">
              {lang === "fr" ? "Expert immobilier Dubai • En ligne" : "Dubai Property Expert • Online"}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-white/30" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="relative mb-5">
                <div className="absolute -inset-6 rounded-full opacity-40 blur-3xl animate-pulse"
                  style={{ background: "radial-gradient(circle, hsl(252, 60%, 55%) 0%, hsl(200, 70%, 50%) 100%)" }} />
                <img src={sofaraAvatar} alt="SofarAI" className="relative w-20 h-20 rounded-full object-cover shadow-2xl border-2 border-violet-400/30" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                {lang === "fr" ? "Bienvenue 👋" : "Welcome 👋"}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                {lang === "fr"
                  ? "Expert IA immobilier Dubai. Prix, scoring, ROI, objections… posez tout !"
                  : "Dubai real estate AI expert. Prices, scoring, ROI, objections… ask anything!"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
                {quickPrompts.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-[12px] sm:text-[13px] px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:border-violet-400/40 transition-all text-left"
                    style={{ background: "hsl(250, 18%, 18%)", border: "1px solid hsl(250, 12%, 26%)" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-1 duration-150`}>
              {msg.role === "assistant" && (
                <img src={sofaraAvatar} alt="AI" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0 shadow-sm border border-violet-400/30" />
              )}
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-[13px] sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm text-white shadow-lg"
                  : "rounded-bl-sm text-slate-200"
              }`} style={msg.role === "user"
                ? { background: "linear-gradient(135deg, hsl(252, 55%, 52%), hsl(200, 70%, 48%))" }
                : { background: "hsl(250, 16%, 18%)", border: "1px solid hsl(250, 10%, 26%)" }
              }>
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-violet-300 prose-headings:text-white [&_p]:text-slate-200 [&_li]:text-slate-200 [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1 [&_hr]:border-violet-800/40">
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
              <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "hsl(250, 16%, 18%)", border: "1px solid hsl(250, 10%, 26%)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-slate-500">{lang === "fr" ? "Analyse…" : "Analyzing…"}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="p-3 shrink-0" style={{ borderTop: "1px solid hsl(250, 12%, 20%)" }}>
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === "fr" ? "Posez votre question immobilier…" : "Ask your real estate question…"}
              className="flex-1 h-11 px-4 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              style={{ background: "hsl(250, 16%, 16%)", border: "1px solid hsl(250, 10%, 24%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}
              className="w-11 h-11 rounded-xl text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30 shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(252, 55%, 52%), hsl(200, 70%, 48%))" }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Tools strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 snap-x" style={{ scrollbarWidth: "none" }}>
        {tools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => setActiveTool(tool.id)}
            className="group flex items-center gap-2 rounded-xl px-3 py-2.5 hover:shadow-md transition-all whitespace-nowrap shrink-0 snap-start dash-card"
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold dash-text">{lang === "fr" ? tool.labelFr : tool.labelEn}</span>
                {tool.badge && (
                  <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                    tool.badge === "PRO" ? "bg-amber-100 text-amber-700"
                    : tool.badge === "BETA" ? "bg-rose-100 text-rose-700"
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

/* LegalAI gate – paywall placeholder */
const LegalAIGate = () => {
  const { lang } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mb-5 shadow-lg">
        <Scale className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-bold dash-text mb-2">LegalAI</h2>
      <p className="text-sm dash-muted-text mb-4 max-w-md leading-relaxed">
        {lang === "fr"
          ? "Analysez vos SPA, contrats de réservation et documents juridiques avec l'IA. Obtenez des points d'attention, clauses à négocier et un résumé clair."
          : "Analyze your SPAs, reservation contracts and legal documents with AI. Get key points, negotiation clauses and a clear summary."}
      </p>
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-lg"
        style={{ background: "linear-gradient(135deg, hsl(40, 90%, 50%), hsl(35, 85%, 45%))" }}>
        ⚡ {lang === "fr" ? "Bientôt disponible — Plan Pro" : "Coming soon — Pro Plan"}
      </div>
      <p className="text-[11px] dash-muted-text mt-4 max-w-sm italic">
        ⚖️ {lang === "fr"
          ? "Disclaimer : LegalAI fournit une analyse informative. Il ne remplace pas un avocat. Consultez toujours un professionnel du droit pour vos décisions juridiques."
          : "Disclaimer: LegalAI provides informational analysis. It does not replace a lawyer. Always consult a legal professional for legal decisions."}
      </p>
    </div>
  );
};

export default AIHub;
