import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { TrendingUp, CheckCircle, DollarSign, Clock } from "lucide-react";

const stats = [
  { labelFr: "Estimées", labelEn: "Estimated", value: "AED 0", icon: TrendingUp, color: "text-purple-400" },
  { labelFr: "Validées", labelEn: "Validated", value: "AED 0", icon: CheckCircle, color: "text-muted-foreground" },
  { labelFr: "Payées", labelEn: "Paid", value: "AED 0", icon: DollarSign, color: "text-green-500" },
  { labelFr: "En attente", labelEn: "Pending", value: "AED 0", icon: Clock, color: "text-orange-400" },
];

const Commissions = () => {
  const { lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-foreground mb-1">Commissions</h1>
      <p className="text-muted-foreground text-sm mb-6">{lang === "fr" ? "Suivi de vos commissions sur chaque deal" : "Track your commissions on each deal"}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-secondary ${s.color}`}><s.icon className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Flow bar */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-5 mb-6">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Commissions — Flow</h2>
        <div className="h-10 rounded-full overflow-hidden flex bg-secondary">
          <div className="flex items-center justify-center text-xs text-muted-foreground/50 w-full">
            {lang === "fr" ? "Aucune commission" : "No commissions"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              {["LEAD", "DEAL", lang === "fr" ? "MONTANT" : "AMOUNT", lang === "fr" ? "STATUT" : "STATUS", "DATE"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="text-center py-16 text-muted-foreground text-sm">
              {lang === "fr" ? "Aucune commission pour le moment." : "No commissions yet."}
            </td></tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Commissions;
