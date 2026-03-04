import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

const stats = [
  { labelFr: "Total reçu", labelEn: "Total Received", value: "AED 0", icon: CheckCircle, color: "text-green-500", sub: null },
  { labelFr: "En attente", labelEn: "Pending", value: "AED 0", icon: Clock, color: "text-orange-400", sub: null },
  { labelFr: "Prochain paiement", labelEn: "Next Payment", value: "—", icon: CreditCard, color: "text-muted-foreground", sub: null },
];

const Payments = () => {
  const { lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-foreground mb-1">{lang === "fr" ? "Paiements" : "Payments"}</h1>
      <p className="text-muted-foreground text-sm mb-6">{lang === "fr" ? "Suivi de tous vos paiements" : "Track all your payments"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-card/50 border border-border/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-secondary ${s.color}`}><s.icon className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">{lang === "fr" ? "Historique des paiements" : "Payment History"}</h2>
        <div className="text-center py-16 text-muted-foreground text-sm">
          {lang === "fr" ? "Aucun paiement pour le moment." : "No payments yet."}
        </div>
      </div>
    </motion.div>
  );
};

export default Payments;
