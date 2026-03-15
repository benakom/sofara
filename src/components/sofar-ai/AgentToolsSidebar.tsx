import { useLanguage } from "@/i18n/LanguageContext";
import { Target, Mail, Phone, MessageCircle, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

export type AgentMode = "qualifier" | "email" | "script_appel" | "whatsapp" | "recommandation" | "kyc_check";

interface AgentToolsSidebarProps {
  activeMode: AgentMode | null;
  onSelectMode: (mode: AgentMode, prompt: string) => void;
  hasSelectedLead: boolean;
}

const tools: {
  mode: AgentMode;
  icon: typeof Target;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
  promptFr: string;
  promptEn: string;
  needsLead: boolean;
  color: string;
}[] = [
  {
    mode: "qualifier",
    icon: Target,
    labelFr: "Qualifier le lead",
    labelEn: "Qualify lead",
    descFr: "Analyse complète : score, profil, actions recommandées",
    descEn: "Full analysis: score, profile, recommended actions",
    promptFr: "Analyse et qualifie ce lead. Donne-moi un score recommandé (A/B/C/D), une analyse du profil, les lacunes à combler, et la prochaine action prioritaire.",
    promptEn: "Analyze and qualify this lead. Give me a recommended score (A/B/C/D), profile analysis, gaps to fill, and priority next action.",
    needsLead: true,
    color: "emerald",
  },
  {
    mode: "email",
    icon: Mail,
    labelFr: "Générer un email",
    labelEn: "Generate email",
    descFr: "Email professionnel personnalisé pour ce lead",
    descEn: "Personalized professional email for this lead",
    promptFr: "Génère un email professionnel personnalisé pour ce lead, adapté à son stage et son score. Inclus un objet accrocheur et un CTA clair.",
    promptEn: "Generate a personalized professional email for this lead, adapted to their stage and score. Include a catchy subject and clear CTA.",
    needsLead: true,
    color: "sky",
  },
  {
    mode: "script_appel",
    icon: Phone,
    labelFr: "Script d'appel",
    labelEn: "Call script",
    descFr: "Script structuré avec questions et objections",
    descEn: "Structured script with questions and objections",
    promptFr: "Génère un script d'appel complet pour ce lead : introduction, questions de découverte, réponses aux objections, et technique de closing adaptée.",
    promptEn: "Generate a complete call script for this lead: intro, discovery questions, objection handling, and adapted closing technique.",
    needsLead: true,
    color: "violet",
  },
  {
    mode: "whatsapp",
    icon: MessageCircle,
    labelFr: "Message WhatsApp",
    labelEn: "WhatsApp message",
    descFr: "Message court et percutant pour relancer",
    descEn: "Short, impactful follow-up message",
    promptFr: "Rédige un message WhatsApp court et professionnel pour relancer ce lead. Max 3-4 lignes, avec un CTA clair.",
    promptEn: "Write a short, professional WhatsApp message to follow up with this lead. Max 3-4 lines, with a clear CTA.",
    needsLead: true,
    color: "green",
  },
  {
    mode: "recommandation",
    icon: BarChart3,
    labelFr: "Analyse pipeline",
    labelEn: "Pipeline analysis",
    descFr: "Vue d'ensemble et recommandations sur tous vos leads",
    descEn: "Overview and recommendations on all your leads",
    promptFr: "Analyse mon pipeline complet. Identifie les leads prioritaires, les leads dormants à réactiver, et recommande des actions groupées optimales.",
    promptEn: "Analyze my full pipeline. Identify priority leads, dormant leads to reactivate, and recommend optimal grouped actions.",
    needsLead: false,
    color: "amber",
  },
  {
    mode: "kyc_check",
    icon: ShieldCheck,
    labelFr: "Check KYC/AML",
    labelEn: "KYC/AML check",
    descFr: "Checklist de conformité et documents requis",
    descEn: "Compliance checklist and required documents",
    promptFr: "Guide-moi sur les vérifications KYC/AML pour ce lead. Documents requis, points d'attention réglementaires UAE.",
    promptEn: "Guide me on KYC/AML checks for this lead. Required documents, UAE regulatory points of attention.",
    needsLead: true,
    color: "rose",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
  green: "bg-green-50 text-green-600 group-hover:bg-green-100",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
};

const activeBorderMap: Record<string, string> = {
  emerald: "border-emerald-300",
  sky: "border-sky-300",
  violet: "border-violet-300",
  green: "border-green-300",
  amber: "border-amber-300",
  rose: "border-rose-300",
};

export default function AgentToolsSidebar({ activeMode, onSelectMode, hasSelectedLead }: AgentToolsSidebarProps) {
  const { lang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="lg:w-64 shrink-0 space-y-2">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl dash-card"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
          <span className="text-xs font-semibold dash-text uppercase tracking-wider">
            {lang === "fr" ? "Outils Agent" : "Agent Tools"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 dash-muted-text transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-2 px-1 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
        <h3 className="text-xs font-semibold dash-text uppercase tracking-wider">
          {lang === "fr" ? "Outils Agent" : "Agent Tools"}
        </h3>
      </div>

      <div className={`space-y-2 ${mobileOpen ? "block" : "hidden"} lg:block`}>
      {tools.map((tool) => {
        const disabled = tool.needsLead && !hasSelectedLead;
        const isActive = activeMode === tool.mode;

        return (
          <button
            key={tool.mode}
            onClick={() => !disabled && onSelectMode(tool.mode, lang === "fr" ? tool.promptFr : tool.promptEn)}
            disabled={disabled}
            className={`w-full dash-card rounded-xl p-3 text-left transition-all group ${
              isActive ? `ring-2 ${activeBorderMap[tool.color]} shadow-sm` : ""
            } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-sm cursor-pointer"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg transition-colors ${colorMap[tool.color]}`}>
                <tool.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium dash-text">{lang === "fr" ? tool.labelFr : tool.labelEn}</span>
            </div>
            <p className="text-[10px] dash-muted-text leading-relaxed">
              {lang === "fr" ? tool.descFr : tool.descEn}
            </p>
            {disabled && (
              <p className="text-[9px] text-amber-500 mt-1 italic">
                {lang === "fr" ? "↑ Sélectionnez un lead d'abord" : "↑ Select a lead first"}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
