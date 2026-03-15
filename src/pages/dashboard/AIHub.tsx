import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";
import {
  Target, Zap, Mic, ArrowLeft, Sparkles,
  MessageSquare
} from "lucide-react";
import RoleplayTool from "@/components/ai-tools/RoleplayTool";
import SequencesTool from "@/components/ai-tools/SequencesTool";
import VoiceAgentTool from "@/components/ai-tools/VoiceAgentTool";
import AutoScoreTool from "@/components/ai-tools/AutoScoreTool";
import PhoneChat from "@/components/sofar-ai/PhoneChat";

type Tool = "roleplay" | "sequences" | "voice" | "autoscore";

const AIHub = () => {
  const { lang } = useLanguage();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

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
    { id: "roleplay", icon: MessageSquare, labelFr: "Roleplay Vente", labelEn: "Sales Roleplay", descFr: "Entraînement avec client virtuel IA", descEn: "Practice with AI virtual client", gradient: "from-violet-500 to-purple-600", badge: "NEW" },
    { id: "sequences", icon: Zap, labelFr: "Séquences", labelEn: "Sequences", descFr: "Plans de relance personnalisés", descEn: "Personalized follow-up plans", gradient: "from-amber-500 to-orange-600" },
    { id: "voice", icon: Mic, labelFr: "Voice Agent", labelEn: "Voice Agent", descFr: "Parlez à SofarAI vocalement", descEn: "Speak to SofarAI by voice", gradient: "from-sky-500 to-blue-600", badge: "BETA" },
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left: Phone chat — hero element */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <PhoneChat />
        </motion.div>
        <p className="text-[11px] dash-muted-text mt-3 text-center max-w-[300px]">
          {lang === "fr"
            ? "💬 Posez n'importe quelle question sur l'immobilier Dubai"
            : "💬 Ask any question about Dubai real estate"}
        </p>
      </div>

      {/* Right: Tools grid */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
            <h1 className="text-lg font-display font-bold dash-text">SofarAI</h1>
          </div>
          <p className="text-xs dash-muted-text">
            {lang === "fr"
              ? "Votre expert IA immobilier + outils de vente intelligents"
              : "Your AI real estate expert + smart sales tools"}
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => setActiveTool(tool.id)}
              className="group dash-card rounded-xl p-4 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-[hsl(var(--dash-border))]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[13px] font-semibold dash-text">{lang === "fr" ? tool.labelFr : tool.labelEn}</h3>
                    {tool.badge && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        tool.badge === "NEW" ? "bg-violet-100 text-violet-700"
                        : tool.badge === "BETA" ? "bg-sky-100 text-sky-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}>{tool.badge}</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[11px] dash-muted-text leading-relaxed">
                {lang === "fr" ? tool.descFr : tool.descEn}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AIHub;
