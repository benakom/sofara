import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Trophy, DollarSign, TrendingUp, Target, Star, Gift, Zap, ChevronRight, Crown, Medal } from "lucide-react";

const tiers = [
  { level: 1, name: "Bronze", emoji: "🥉", conditionFr: "≥ 1M AED", conditionEn: "≥ 1M AED", bonus: 1000, color: "from-amber-100 to-orange-50 border-amber-200" },
  { level: 2, name: "Silver", emoji: "🥈", conditionFr: "≥ 3M AED", conditionEn: "≥ 3M AED", bonus: 3000, color: "from-slate-100 to-gray-50 border-slate-200" },
  { level: 3, name: "Gold", emoji: "🥇", conditionFr: "≥ 5M AED", conditionEn: "≥ 5M AED", bonus: 6000, color: "from-yellow-100 to-amber-50 border-yellow-200" },
  { level: 4, name: "Platinum", emoji: "💎", conditionFr: "≥ 10M AED", conditionEn: "≥ 10M AED", bonus: 15000, color: "from-violet-100 to-purple-50 border-violet-200" },
];

const perks = [
  { icon: "🎓", titleFr: "Academy Premium", titleEn: "Premium Academy", descFr: "Accès aux cours avancés", descEn: "Access to advanced courses", tier: 1 },
  { icon: "🎟️", titleFr: "Events VIP", titleEn: "VIP Events", descFr: "Invitations aux événements exclusifs", descEn: "Invitations to exclusive events", tier: 2 },
  { icon: "✈️", titleFr: "Trip Dubai", titleEn: "Dubai Trip", descFr: "Voyage offert à Dubai", descEn: "Free trip to Dubai", tier: 3 },
  { icon: "👑", titleFr: "Commission boost", titleEn: "Commission Boost", descFr: "+2% sur toutes vos commissions", descEn: "+2% on all your commissions", tier: 4 },
];

const challenges = [
  { titleFr: "Closez 3 deals ce mois", titleEn: "Close 3 deals this month", reward: "AED 2,000", progress: 0, target: 3, icon: Target },
  { titleFr: "Ajoutez 10 leads qualifiés", titleEn: "Add 10 qualified leads", reward: "500 XP", progress: 0, target: 10, icon: Zap },
  { titleFr: "Complétez l'Academy AML", titleEn: "Complete AML Academy", reward: "Badge 🛡️", progress: 0, target: 1, icon: Star },
];

const BonusRewards = () => {
  const { lang } = useLanguage();
  const currentTier = 0; // 0 = not yet

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-bold dash-text mb-0.5">🏆 Bonus & Rewards</h1>
      <p className="dash-muted-text text-base sm:text-sm mb-5">{lang === "fr" ? "Programme de fidélité et récompenses." : "Loyalty program and rewards."}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { labelFr: "Bonus gagnés", labelEn: "Bonuses Earned", value: "AED 0", icon: DollarSign, accent: "bg-emerald-50 text-emerald-600" },
          { labelFr: "Solde coins", labelEn: "Coin Balance", value: "0", icon: Gift, accent: "bg-amber-50 text-amber-600" },
          { labelFr: "Tier actuel", labelEn: "Current Tier", value: "—", icon: Crown, accent: "bg-violet-50 text-violet-600" },
          { labelFr: "Deals closés", labelEn: "Closed Deals", value: "0", icon: Target, accent: "bg-blue-50 text-blue-600" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-[11px] font-medium dash-muted-text uppercase tracking-wider">{lang === "fr" ? s.labelFr : s.labelEn}</span>
            </div>
            <p className="text-lg font-display font-bold dash-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Tier progression */}
        <div className="lg:col-span-2 dash-card rounded-xl p-4">
          <h2 className="text-sm font-display font-semibold dash-text mb-3 flex items-center gap-2"><Medal className="w-4 h-4" /> {lang === "fr" ? "Niveaux de fidélité" : "Loyalty Tiers"}</h2>
          <div className="space-y-2.5">
            {tiers.map((tier) => (
              <div key={tier.level} className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${tier.color} border`}>
                <span className="text-2xl">{tier.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold dash-text">{tier.name}</span>
                    <span className="text-[11px] dash-muted-text">{lang === "fr" ? tier.conditionFr : tier.conditionEn}</span>
                  </div>
                  <div className="h-1 bg-white/60 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-current rounded-full opacity-30" style={{ width: "0%" }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">AED {tier.bonus.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="dash-card rounded-xl p-4">
          <h2 className="text-sm font-display font-semibold dash-text mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> {lang === "fr" ? "Challenges actifs" : "Active Challenges"}</h2>
          <div className="space-y-3">
            {challenges.map((ch, i) => (
              <div key={i} className="p-3 rounded-lg bg-[hsl(var(--dash-muted)/.3)] border border-[hsl(var(--dash-border))]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ch.icon className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-medium dash-text">{lang === "fr" ? ch.titleFr : ch.titleEn}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(ch.progress / ch.target) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="dash-muted-text">{ch.progress}/{ch.target}</span>
                  <span className="font-medium text-amber-600">{ch.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="dash-card rounded-xl p-4">
        <h2 className="text-sm font-display font-semibold dash-text mb-3 flex items-center gap-2"><Gift className="w-4 h-4" /> {lang === "fr" ? "Avantages par niveau" : "Perks by Tier"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {perks.map((perk, i) => (
            <div key={i} className={`p-3 rounded-xl border transition-all ${currentTier >= perk.tier ? "bg-emerald-50 border-emerald-200" : "bg-[hsl(var(--dash-muted)/.3)] border-[hsl(var(--dash-border))] opacity-60"}`}>
              <span className="text-2xl">{perk.icon}</span>
              <p className="text-sm font-medium dash-text mt-2">{lang === "fr" ? perk.titleFr : perk.titleEn}</p>
              <p className="text-[11px] dash-muted-text mt-0.5">{lang === "fr" ? perk.descFr : perk.descEn}</p>
              <p className="text-[10px] font-medium mt-2 text-amber-600">Tier {perk.tier}+</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BonusRewards;
