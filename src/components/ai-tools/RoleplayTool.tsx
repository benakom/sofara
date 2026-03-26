import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, User, Bot, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const scenarios = [
  { id: "skeptical", labelFr: "🤨 Investisseur sceptique", labelEn: "🤨 Skeptical investor", descFr: "Budget AED 2M, plein de doutes", descEn: "AED 2M budget, full of doubts" },
  { id: "busy_exec", labelFr: "👔 Cadre pressé", labelEn: "👔 Busy executive", descFr: "PDG, veut des chiffres, pas de temps", descEn: "CEO, wants numbers, no time" },
  { id: "first_buyer", labelFr: "🏠 Primo-accédant", labelEn: "🏠 First-time buyer", descFr: "Budget AED 600K-1M, anxieux mais excité", descEn: "AED 600K-1M budget, anxious but excited" },
  { id: "vip_client", labelFr: "💎 Client VIP", labelEn: "💎 VIP client", descFr: "Budget AED 20M+, ultra-exigeant", descEn: "AED 20M+ budget, ultra-demanding" },
];

const ROLEPLAY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-roleplay`;

export default function RoleplayTool() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const startRoleplay = async (scenarioId: string) => {
    setScenario(scenarioId);
    setMessages([]);
    setIsLoading(true);

    const firstMsg: Msg = {
      role: "user",
      content: lang === "fr"
        ? "Bonjour, je suis ambassadeur Sofara. Commençons le roleplay. Présentez-vous."
        : "Hello, I'm a Sofara ambassador. Let's start the roleplay. Please introduce yourself.",
    };
    setMessages([firstMsg]);
    await streamResponse([firstMsg], scenarioId);
  };

  const streamResponse = async (msgs: Msg[], sc?: string) => {
    setIsLoading(true);
    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
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

      const resp = await fetch(ROLEPLAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: msgs, scenario: sc || scenario, lang }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur" }));
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
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsertAssistant(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: "Connexion échouée." });
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await streamResponse(updated);
  };

  // Scenario selection
  if (!scenario) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-display font-bold dash-text mb-1">
            {lang === "fr" ? "🎭 Choisissez votre scénario" : "🎭 Choose your scenario"}
          </h2>
          <p className="text-xs dash-muted-text">
            {lang === "fr"
              ? "L'IA va jouer le rôle d'un client potentiel. Entraînez-vous à closer !"
              : "The AI will play a potential client. Practice your closing skills!"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => startRoleplay(s.id)}
              className="dash-card rounded-xl p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 border border-[hsl(var(--dash-border))] group"
            >
              <h3 className="text-sm font-semibold dash-text mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                {lang === "fr" ? s.labelFr : s.labelEn}
              </h3>
              <p className="text-xs dash-muted-text">{lang === "fr" ? s.descFr : s.descEn}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold dash-text">
              {lang === "fr" ? "Roleplay en cours" : "Roleplay in progress"}
            </h2>
            <p className="text-[10px] dash-muted-text">
              {scenarios.find(s => s.id === scenario)?.[lang === "fr" ? "labelFr" : "labelEn"]}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setScenario(null); setMessages([]); }}
          className="flex items-center gap-1.5 text-[11px] dash-muted-text hover:text-[hsl(var(--dash-fg))] transition-colors px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))]"
        >
          <RotateCcw className="w-3 h-3" />
          {lang === "fr" ? "Nouveau scénario" : "New scenario"}
        </button>
      </div>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl bg-[hsl(var(--dash-muted)/.3)] border border-[hsl(var(--dash-border))] p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-[hsl(var(--primary))] text-white rounded-br-md"
                : "bg-white border border-[hsl(var(--dash-border))] dash-text rounded-bl-md"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 dash-muted-text" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "fr" ? "Répondez au client…" : "Reply to the client…"}
          className="flex-1 h-10 px-4 rounded-full bg-white border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-violet-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Tip */}
      <p className="text-[10px] dash-muted-text mt-2 text-center">
        {lang === "fr"
          ? "💡 Tapez \"fin\" pour recevoir votre feedback de performance"
          : "💡 Type \"end\" to receive your performance feedback"}
      </p>
    </div>
  );
}
