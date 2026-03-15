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
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/.1)] to-[hsl(var(--accent)/.08)] mb-4">
          <Sparkles className="w-8 h-8 text-[hsl(var(--primary))]" />
        </div>
        <h2 className="text-base font-display font-bold dash-text mb-1">
          {lang === "fr" ? "Agent de Qualification" : "Lead Qualification Agent"}
        </h2>
        <p className="text-xs dash-muted-text text-center max-w-sm mb-2">
          {lang === "fr"
            ? "Sélectionnez un lead et utilisez les outils à droite pour le qualifier automatiquement, générer des messages, ou analyser votre pipeline."
            : "Select a lead and use the tools on the right to auto-qualify, generate messages, or analyze your pipeline."}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] dash-muted-text">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            {lang === "fr" ? "Scoring IA" : "AI Scoring"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] dash-muted-text">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            {lang === "fr" ? "Messages auto" : "Auto messages"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] dash-muted-text">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            {lang === "fr" ? "Analyse pipeline" : "Pipeline analysis"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "assistant" && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center mr-2 mt-1 shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm overflow-hidden ${
            msg.role === "user"
              ? "bg-[hsl(var(--primary))] text-white rounded-br-md"
              : "bg-white border border-[hsl(var(--dash-border))] dash-text rounded-bl-md"
          }`}>
            {msg.role === "assistant" ? (
              <div className="prose prose-sm max-w-none break-words overflow-x-auto prose-headings:text-[hsl(var(--dash-fg))] prose-headings:font-display prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-li:my-0.5 prose-strong:text-[hsl(var(--primary))] [&_pre]:overflow-x-auto [&_table]:text-xs [&_code]:break-all">
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
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center mr-2 mt-1 shrink-0">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="bg-white border border-[hsl(var(--dash-border))] rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--primary))]" />
              <span className="text-xs dash-muted-text">
                {lang === "fr" ? "Analyse en cours…" : "Analyzing…"}
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
