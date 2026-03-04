import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { labelFr: "Leads total", labelEn: "Total Leads", value: "0", icon: Users, trend: null, color: "text-muted-foreground" },
  { labelFr: "Qualifiés", labelEn: "Qualified", value: "0", icon: GitBranch, trend: null, color: "text-primary" },
  { labelFr: "Offres acceptées", labelEn: "Accepted Offers", value: "0", icon: CheckCircle, trend: null, color: "text-green-500" },
  { labelFr: "Booking / DP payé", labelEn: "Booking / DP paid", value: "0", icon: DollarSign, trend: null, color: "text-green-500" },
];

const pipelineStages = [
  { labelFr: "Nouveau", labelEn: "New", count: 0, pct: 0, color: "bg-muted-foreground" },
  { labelFr: "Préqualifié", labelEn: "Prequalified", count: 0, pct: 0, color: "bg-green-500" },
  { labelFr: "Qualifié", labelEn: "Qualified", count: 0, pct: 0, color: "bg-foreground" },
  { labelFr: "Injoignable", labelEn: "Unreachable", count: 0, pct: 0, color: "bg-destructive" },
  { labelFr: "Offre envoyée", labelEn: "Offer Sent", count: 0, pct: 0, color: "bg-purple-500" },
  { labelFr: "Offre acceptée", labelEn: "Offer Accepted", count: 0, pct: 0, color: "bg-green-500" },
  { labelFr: "Booking payé", labelEn: "Booking Paid", count: 0, pct: 0, color: "bg-green-600" },
  { labelFr: "DP payé", labelEn: "DP Paid", count: 0, pct: 0, color: "bg-green-700" },
];

const DashboardHome = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Welcome banner */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            👋 {lang === "fr" ? "Tableau de bord" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "fr" ? "Bienvenue ! Voici le résumé de votre activité" : "Welcome! Here's your activity summary"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-card border border-border/50 rounded-full px-4 py-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">AED 0</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-secondary ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline + Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pipeline snapshot */}
        <div className="lg:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-semibold text-foreground">Pipeline snapshot</h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              {lang === "fr" ? "Voir tout" : "View all"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {pipelineStages.map((stage, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-28 shrink-0">{lang === "fr" ? stage.labelFr : stage.labelEn}</span>
                <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden flex items-center">
                  {stage.count > 0 && (
                    <div className={`h-full ${stage.color} rounded-full flex items-center justify-center min-w-[28px]`} style={{ width: `${Math.max(stage.pct, 8)}%` }}>
                      <span className="text-xs font-bold text-white px-2">{stage.count}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{stage.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Commissions card */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4" /> Commissions
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Estimées" : "Estimated"}</span><span className="text-foreground font-medium">AED 0</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Validées" : "Validated"}</span><span className="text-green-500 font-medium">AED 0</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Payées" : "Paid"}</span><span className="text-green-500 font-bold">AED 0</span></div>
            </div>
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">0% collected</p>
          </div>

          {/* Bonus card */}
          <div className="bg-card/50 border border-primary/20 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-primary" /> Bonus Performance
            </h3>
            <p className="text-2xl font-display font-bold text-foreground">AED 0</p>
            <p className="text-xs text-muted-foreground mt-1">Total gagné: AED 0</p>
            <p className="text-xs text-muted-foreground mt-0.5">0 deals • 1 coin = 1 AED</p>
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">
            {lang === "fr" ? "Leads récents" : "Recent Leads"}
          </h2>
          <button
            onClick={() => navigate("/dashboard/import-leads")}
            className="text-sm bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            + {lang === "fr" ? "Nouveau lead" : "New lead"}
          </button>
        </div>
        <div className="text-center py-10 text-muted-foreground text-sm">
          {lang === "fr" ? "Aucun lead pour le moment. Importez vos premiers leads !" : "No leads yet. Import your first leads!"}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
