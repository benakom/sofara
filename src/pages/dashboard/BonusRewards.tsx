import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Trophy, DollarSign, TrendingUp, Target, Star, Gift, Zap, ChevronRight, Crown, Medal } from "lucide-react";

const tiers = [
  { level: 1, name: "Bronze", emoji: "🥉", conditionFr: "≥ 1M AED", conditionEn: "≥ 1M AED", bonus: 1000 },
  { level: 2, name: "Silver", emoji: "🥈", conditionFr: "≥ 3M AED", conditionEn: "≥ 3M AED", bonus: 3000 },
  { level: 3, name: "Gold", emoji: "🥇", conditionFr: "≥ 5M AED", conditionEn: "≥ 5M AED", bonus: 6000 },
  { level: 4, name: "Platinum", emoji: "💎", conditionFr: "≥ 10M AED", conditionEn: "≥ 10M AED", bonus: 15000 },
];

const perks = [
  { icon: "🎟️", titleFr: "Events VIP", titleEn: "VIP Events", descFr: "Invitations aux événements exclusifs", descEn: "Invitations to exclusive events", tier: 2 },
  { icon: "✈️", titleFr: "Trip Dubai", titleEn: "Dubai Trip", descFr: "Voyage offert à Dubai", descEn: "Free trip to Dubai", tier: 3 },
  { icon: "👑", titleFr: "Commission boost", titleEn: "Commission Boost", descFr: "+2% sur toutes vos commissions", descEn: "+2% on all your commissions", tier: 4 },
];

const challenges = [
  { titleFr: "Closez 3 deals ce mois", titleEn: "Close 3 deals this month", reward: "AED 2,000", progress: 0, target: 3, icon: Target },
  { titleFr: "Ajoutez 10 leads qualifiés", titleEn: "Add 10 qualified leads", reward: "500 XP", progress: 0, target: 10, icon: Zap },
];

const BonusRewards = () => {
  const { lang } = useLanguage();
  const currentTier = 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-extrabold dash-text tracking-tight mb-0.5">🏆 {lang === "ar" ? "المكافآت والجوائز" : "Bonus & Rewards"}</h1>
      <p className="dash-muted-text text-xs mt-0.5 mb-5">{lang === "ar" ? "برنامج الولاء والمكافآت." : "Loyalty program and rewards."}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { labelAr: "Bonus gagnés", labelEn: "Bonuses Earned", value: "AED 0", icon: DollarSign },
          { labelAr: "Solde coins", labelEn: "Coin Balance", value: "0", icon: Gift },
          { labelAr: "Tier actuel", labelEn: "Current Tier", value: "—", icon: Crown },
          { labelAr: "Deals closés", labelEn: "Closed Deals", value: "0", icon: Target },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[hsl(var(--dash-accent)/.12)] text-[hsl(var(--dash-accent))]"><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "ar" ? s.labelAr : s.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Tier progression */}
        <div className="lg:col-span-2 dash-card rounded-2xl p-5">
          <h2 className="text-sm font-display font-bold dash-text mb-3 flex items-center gap-2"><Medal className="w-4 h-4" /> {lang === "ar" ? "مستويات الولاء" : "Loyalty Tiers"}</h2>
          <div className="space-y-2.5">
            {tiers.map((tier) => (
              <div key={tier.level} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--dash-muted)/.4)] border border-[hsl(var(--dash-border))]">
                <span className="text-2xl">{tier.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold dash-text">{tier.name}</span>
                    <span className="text-[11px] dash-muted-text">{lang === "ar" ? tier.conditionFr : tier.conditionEn}</span>
                  </div>
                  <div className="h-1 bg-[hsl(var(--dash-muted))] rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[hsl(var(--dash-accent)/.3)] rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-[hsl(var(--dash-accent))]">AED {tier.bonus.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="dash-card rounded-2xl p-5">
          <h2 className="text-sm font-display font-bold dash-text mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[hsl(var(--dash-accent))]" /> {lang === "ar" ? "التحديات النشطة" : "Active Challenges"}</h2>
          <div className="space-y-3">
            {challenges.map((ch, i) => (
              <div key={i} className="p-3 rounded-lg bg-[hsl(var(--dash-muted)/.3)] border border-[hsl(var(--dash-border))]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ch.icon className="w-3.5 h-3.5 text-[hsl(var(--dash-accent))]" />
                  <span className="text-xs font-medium dash-text">{lang === "ar" ? ch.titleFr : ch.titleEn}</span>
                </div>
                <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[hsl(var(--dash-accent))] rounded-full" style={{ width: `${(ch.progress / ch.target) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="dash-muted-text">{ch.progress}/{ch.target}</span>
                  <span className="font-medium text-[hsl(var(--dash-accent))]">{ch.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="dash-card rounded-2xl p-5">
        <h2 className="text-sm font-display font-bold dash-text mb-3 flex items-center gap-2"><Gift className="w-4 h-4" /> {lang === "ar" ? "المزايا حسب المستوى" : "Perks by Tier"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {perks.map((perk, i) => (
            <div key={i} className={`p-3 rounded-xl border transition-all ${currentTier >= perk.tier ? "bg-[hsl(var(--dash-accent)/.1)] border-[hsl(var(--dash-accent)/.3)]" : "bg-[hsl(var(--dash-muted)/.3)] border-[hsl(var(--dash-border))] opacity-60"}`}>
              <span className="text-2xl">{perk.icon}</span>
              <p className="text-sm font-medium dash-text mt-2">{lang === "ar" ? perk.titleFr : perk.titleEn}</p>
              <p className="text-[11px] dash-muted-text mt-0.5">{lang === "ar" ? perk.descFr : perk.descEn}</p>
              <p className="text-[10px] font-medium mt-2 text-[hsl(var(--dash-accent))]">Tier {perk.tier}+</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BonusRewards;
