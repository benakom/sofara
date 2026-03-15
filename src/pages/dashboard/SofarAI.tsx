import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bot, Send } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LeadSelector from "@/components/sofar-ai/LeadSelector";
import AgentToolsSidebar, { type AgentMode } from "@/components/sofar-ai/AgentToolsSidebar";
import ChatArea, { type Msg } from "@/components/sofar-ai/ChatArea";

const QUALIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-qualify`;

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  score: string | null;
  stage: string | null;
  source: string | null;
}

const SofarAI = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeMode, setActiveMode] = useState<AgentMode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async (text: string, mode?: AgentMode) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
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
        toast({ variant: "destructive", title: "Erreur", description: lang === "fr" ? "Vous devez être connecté." : "You must be logged in." });
        setIsLoading(false);
        return;
      }

      const resp = await fetch(QUALIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: updatedMessages,
          mode: mode || activeMode || undefined,
          leadId: selectedLead?.id || undefined,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        toast({ variant: "destructive", title: "Erreur", description: err.error || "Erreur du service IA" });
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de contacter SofarAI." });
    }

    setIsLoading(false);
  };

  const handleToolSelect = (mode: AgentMode, prompt: string) => {
    setActiveMode(mode);
    sendMessage(prompt, mode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setActiveMode(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)] overflow-hidden max-w-full">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-display font-bold dash-text">SofarAI Qualifier</h1>
            <p className="text-[11px] dash-muted-text">
              {lang === "fr" ? "Agent de qualification de leads" : "Lead qualification agent"}
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewConversation}
              className="text-[11px] px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))] dash-muted-text hover:bg-[hsl(var(--dash-muted))] transition-colors"
            >
              {lang === "fr" ? "Nouvelle conversation" : "New conversation"}
            </button>
          )}
        </div>

        {/* Lead selector */}
        <div className="mb-3">
          <LeadSelector selectedLead={selectedLead} onSelectLead={setSelectedLead} />
        </div>

        {/* Messages */}
        <div className="flex-1 rounded-xl bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))] p-3 overflow-y-auto flex flex-col">
          <ChatArea messages={messages} isLoading={isLoading} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Posez une question sur ce lead…" : "Ask about this lead…"}
            className="flex-1 h-10 px-4 rounded-full bg-white border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Tools sidebar */}
      <AgentToolsSidebar
        activeMode={activeMode}
        onSelectMode={handleToolSelect}
        hasSelectedLead={!!selectedLead}
      />
    </motion.div>
  );
};

export default SofarAI;
