import { useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export type Msg = { role: "user" | "assistant"; content: string };

interface ChatAreaProps {
  messages: Msg[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const { lang } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-[hsl(var(--dash-accent)/.1)] mb-4">
          <Sparkles className="w-8 h-8 text-[hsl(var(--dash-accent))]" />
        </div>
        <h2 className="text-base font-display font-bold text-[hsl(var(--dash-fg))] mb-1">
          {lang === "ar" ? "Agent de Qualification" : "Lead Qualification Agent"}
        </h2>
        <p className="text-xs text-[hsl(var(--dash-muted-fg))] text-center max-w-sm mb-2">
          {lang === "ar"
            ? "Sélectionnez un lead et utilisez les outils à droite pour le qualifier automatiquement, générer des messages, ou analyser votre pipeline."
            : "Select a lead and use the tools on the right to auto-qualify, generate messages, or analyze your pipeline."}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--dash-muted-fg))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--dash-accent))]" />
            {lang === "ar" ? "Scoring IA" : "AI Scoring"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--dash-muted-fg))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--dash-accent)/.6)]" />
            {lang === "ar" ? "Messages auto" : "Auto messages"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--dash-muted-fg))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--dash-accent)/.3)]" />
            {lang === "ar" ? "Analyse pipeline" : "Pipeline analysis"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 space-y-3 overflow-y-auto overflow-x-hidden">
      {messages.map((msg, i) => (
        <div key={i} className={`flex min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "assistant" && (
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center mr-2 mt-1 shrink-0">
              <Bot className="w-3.5 h-3.5 text-[hsl(var(--dash-accent-fg))]" />
            </div>
          )}
          <div className={`max-w-[85%] sm:max-w-[80%] min-w-0 rounded-2xl px-4 py-3 text-sm overflow-hidden ${
            msg.role === "user"
              ? "bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] rounded-br-md"
              : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-fg))] rounded-bl-md"
          }`}>
            {msg.role === "assistant" ? (
              <div className="prose prose-sm prose-invert max-w-none break-words overflow-x-auto prose-headings:text-[hsl(var(--dash-fg))] prose-headings:font-display prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-li:my-0.5 prose-strong:text-[hsl(var(--dash-accent))] [&_pre]:overflow-x-auto [&_table]:text-xs [&_code]:break-all">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <span className="whitespace-pre-wrap break-words">{msg.content}</span>
            )}
          </div>
        </div>
      ))}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex justify-start">
          <div className="w-6 h-6 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center mr-2 mt-1 shrink-0">
            <Bot className="w-3.5 h-3.5 text-[hsl(var(--dash-accent-fg))]" />
          </div>
          <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--dash-accent))]" />
              <span className="text-xs text-[hsl(var(--dash-muted-fg))]">
                {lang === "ar" ? "Analyse en cours…" : "Analyzing…"}
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
