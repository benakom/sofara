import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";
import {
  Bot, Target, Phone, Zap, Mic, ArrowLeft, Sparkles, Brain,
  MessageSquare, BarChart3, Volume2
} from "lucide-react";
import RoleplayTool from "@/components/ai-tools/RoleplayTool";
import SequencesTool from "@/components/ai-tools/SequencesTool";
import VoiceAgentTool from "@/components/ai-tools/VoiceAgentTool";
import AutoScoreTool from "@/components/ai-tools/AutoScoreTool";

type Tool = "roleplay" | "sequences" | "voice" | "autoscore" | "qualifier";

const AIHub = () => {
  const { lang } = useLanguage();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const tools: {
    id: Tool;
    icon: typeof Bot;
    labelFr: string;
    labelEn: string;
    descFr: string;
    descEn: string;
    gradient: string;
    badge?: string;
  }[] = [
    {
      id: "autoscore",
      icon: Target,
      labelFr: "Smart Scoring",
      labelEn: "Smart Scoring",
      descFr: "Scoring prédictif intelligent — Analyse vos leads et attribue un score de probabilité de closing automatiquement",
      descEn: "Intelligent predictive scoring — Analyze your leads and automatically assign a closing probability score",
      gradient: "from-emerald-500 to-teal-600",
      badge: "AI",
    },
    {
      id: "roleplay",
      icon: MessageSquare,
      labelFr: "Roleplay de Vente",
      labelEn: "Sales Roleplay",
      descFr: "Entraînez-vous avec un client virtuel IA — Investisseur sceptique, cadre pressé, primo-accédant ou client VIP",
      descEn: "Practice with an AI virtual client — Skeptical investor, busy executive, first-time buyer or VIP client",
      gradient: "from-violet-500 to-purple-600",
      badge: "NEW",
    },
    {
      id: "sequences",
      icon: Zap,
      labelFr: "Séquences Follow-up",
      labelEn: "Follow-up Sequences",
      descFr: "Générez des séquences de relance personnalisées email/WhatsApp/appel adaptées à chaque lead",
      descEn: "Generate personalized follow-up sequences via email/WhatsApp/call adapted to each lead",
      gradient: "from-amber-500 to-orange-600",
      badge: "AI",
    },
    {
      id: "voice",
      icon: Mic,
      labelFr: "Voice Agent",
      labelEn: "Voice Agent",
      descFr: "Parlez directement avec SofarAI — Assistant vocal propulsé par ElevenLabs pour une interaction naturelle",
      descEn: "Speak directly with SofarAI — Voice assistant powered by ElevenLabs for natural interaction",
      gradient: "from-sky-500 to-blue-600",
      badge: "BETA",
    },
    {
      id: "qualifier",
      icon: Brain,
      labelFr: "Lead Qualifier",
      labelEn: "Lead Qualifier",
      descFr: "Agent IA complet — Qualifiez, générez des emails, scripts d'appel et messages WhatsApp",
      descEn: "Complete AI agent — Qualify, generate emails, call scripts and WhatsApp messages",
      gradient: "from-rose-500 to-pink-600",
      badge: "AI",
    },
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

  if (activeTool && activeTool !== "qualifier") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-7rem)] flex flex-col"
      >
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-sm dash-muted-text hover:text-[hsl(var(--dash-fg))] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "fr" ? "Retour aux outils AI" : "Back to AI tools"}
        </button>
        <div className="flex-1 min-h-0">
          {renderTool()}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-6 sm:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                SofarAI Suite
              </h1>
              <p className="text-xs text-white/70">
                {lang === "fr" ? "Vos outils d'intelligence artificielle" : "Your AI-powered tools"}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/80 max-w-lg leading-relaxed">
            {lang === "fr"
              ? "5 outils IA pour qualifier, closer et scaler votre business immobilier à Dubai. Chaque outil est conçu pour vous donner un avantage compétitif."
              : "5 AI tools to qualify, close and scale your Dubai real estate business. Each tool is designed to give you a competitive edge."}
          </p>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => {
              if (tool.id === "qualifier") {
                window.location.href = "/dashboard/sofar-ai";
              } else {
                setActiveTool(tool.id);
              }
            }}
            className="group dash-card rounded-xl p-5 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-[hsl(var(--dash-border))]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              {tool.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tool.badge === "NEW" 
                    ? "bg-violet-100 text-violet-700" 
                    : tool.badge === "BETA"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {tool.badge}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold dash-text mb-1.5">
              {lang === "fr" ? tool.labelFr : tool.labelEn}
            </h3>
            <p className="text-xs dash-muted-text leading-relaxed">
              {lang === "fr" ? tool.descFr : tool.descEn}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelFr: "Modèle IA", labelEn: "AI Model", value: "Gemini 3", icon: Brain },
          { labelFr: "Voix IA", labelEn: "AI Voice", value: "ElevenLabs", icon: Volume2 },
          { labelFr: "Scénarios", labelEn: "Scenarios", value: "4+", icon: MessageSquare },
          { labelFr: "Précision", labelEn: "Accuracy", value: "95%+", icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="dash-card rounded-xl p-4 border border-[hsl(var(--dash-border))]">
            <stat.icon className="w-4 h-4 dash-muted-text mb-2" />
            <p className="text-lg font-bold dash-text">{stat.value}</p>
            <p className="text-[11px] dash-muted-text">{lang === "fr" ? stat.labelFr : stat.labelEn}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIHub;
