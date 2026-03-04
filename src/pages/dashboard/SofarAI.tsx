import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bot, Building, HelpCircle, TrendingUp, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const suggestions = [
  { icon: Building, textFr: "Quels sont les avantages fiscaux à Dubai ?", textEn: "What are the tax advantages in Dubai?" },
  { icon: HelpCircle, textFr: "Comment gérer un lead qui hésite ?", textEn: "How to manage a hesitant lead?" },
  { icon: TrendingUp, textFr: "Quelles zones offrent le meilleur ROI ?", textEn: "Which areas offer the best ROI?" },
  { icon: Sparkles, textFr: "Où en sont mes leads qualifiés ?", textEn: "What's the status of my qualified leads?" },
];

const SofarAI = () => {
  const { lang } = useLanguage();
  const [message, setMessage] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">SofarAI</h1>
          <p className="text-muted-foreground text-sm">{lang === "fr" ? "Votre assistant IA pour l'immobilier Dubai" : "Your AI assistant for Dubai real estate"}</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-card/50 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-primary/10 mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-display font-semibold text-foreground mb-2">
          {lang === "fr" ? "Comment puis-je vous aider ?" : "How can I help you?"}
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
          {lang === "fr"
            ? "Posez-moi des questions sur l'immobilier Dubai, vos leads, ou les techniques de vente."
            : "Ask me questions about Dubai real estate, your leads, or sales techniques."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setMessage(lang === "fr" ? s.textFr : s.textEn)}
              className="flex items-start gap-3 bg-secondary/30 border border-border/30 rounded-xl p-3 text-left hover:bg-secondary/50 transition-colors text-sm"
            >
              <s.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground">{lang === "fr" ? s.textFr : s.textEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={lang === "fr" ? "Posez votre question sur l'immobilier Dubai, vos leads..." : "Ask your question about Dubai real estate, your leads..."}
          className="bg-card/50 border-border/50 flex-1"
        />
        <button className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default SofarAI;
