import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Trophy, DollarSign, TrendingUp, Target } from "lucide-react";

const tiers = [
  { level: 1, conditionFr: "Valeur du deal ≥ 1M AED", conditionEn: "Deal value ≥ 1M AED", bonus: "AED 1,000", perDeal: true },
  { level: 2, conditionFr: "Valeur du deal ≥ 3M AED", conditionEn: "Deal value ≥ 3M AED", bonus: "AED 3,000", perDeal: true },
  { level: 3, conditionFr: "Valeur du deal ≥ 5M AED", conditionEn: "Deal value ≥ 5M AED", bonus: "AED 6,000", perDeal: true },
  { level: 4, conditionFr: "Valeur du deal ≥ 10M AED", conditionEn: "Deal value ≥ 10M AED", bonus: "AED 15,000", perDeal: true },
];

const howItWorks = [
  { fr: "Vous closez un deal immobilier via la plateforme Sofara.", en: "You close a real estate deal via the Sofara platform." },
  { fr: "Le bonus est automatiquement calculé selon la valeur du deal.", en: "The bonus is automatically calculated based on the deal value." },
  { fr: "Vos coins s'accumulent — 1 coin = 1 AED.", en: "Your coins accumulate — 1 coin = 1 AED." },
  { fr: "Demandez le versement quand vous voulez.", en: "Request payout whenever you want." },
];

const BonusRewards = () => {
  const { lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/5 to-primary/5 border border-border/50 rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          🏆 Bonus Performance
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{lang === "fr" ? "Gagnez des bonus AED sur chaque deal closé selon sa valeur" : "Earn AED bonuses on each closed deal based on its value"}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { labelFr: "Total bonus gagnés", labelEn: "Total bonuses earned", value: "AED 0", icon: DollarSign, color: "text-green-500" },
          { labelFr: "Solde disponible", labelEn: "Available balance", value: "AED 0", icon: Trophy, color: "text-orange-400" },
          { labelFr: "Volume de ventes", labelEn: "Sales Volume", value: "AED 0", icon: TrendingUp, color: "text-muted-foreground" },
          { labelFr: "Deals closés", labelEn: "Closed Deals", value: "0", icon: Target, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="bg-card/50 border border-border/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-secondary ${s.color}`}><s.icon className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tiers */}
        <div className="lg:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-2">📊 {lang === "fr" ? "Paliers de bonus" : "Bonus Tiers"}</h2>
          <p className="text-sm text-muted-foreground mb-5">{lang === "fr" ? "Chaque deal closé vous rapporte un bonus AED selon la valeur du bien vendu." : "Each closed deal earns you an AED bonus based on the property value sold."}</p>
          <div className="space-y-3">
            {tiers.map((tier) => (
              <div key={tier.level} className="flex items-center justify-between bg-secondary/30 border border-border/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center text-sm font-bold text-green-500">{tier.level}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lang === "fr" ? tier.conditionFr : tier.conditionEn}</p>
                    <p className="text-xs text-muted-foreground">{lang === "fr" ? "Par deal individuel" : "Per individual deal"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-500">{tier.bonus}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BONUS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-4">💡 {lang === "fr" ? "Comment ça marche" : "How it works"}</h2>
          <div className="space-y-4">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-sm font-bold text-primary">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{lang === "fr" ? step.fr : step.en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BonusRewards;
