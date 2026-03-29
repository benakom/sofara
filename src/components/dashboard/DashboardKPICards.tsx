import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DollarSign, Users, Target, TrendingUp, ArrowUpRight } from "lucide-react";

interface Props {
  totalLeads: number;
  convRate: number;
  qualified: number;
  totalComm: number;
  lang: string;
}

const DashboardKPICards = ({ totalLeads, convRate, qualified, totalComm, lang }: Props) => {
  const navigate = useNavigate();
  const fmt = (n: number) => n > 999 ? `${(n / 1000).toFixed(1)}K` : n.toString();

  const cards = [
    {
      value: `AED ${totalComm > 0 ? fmt(totalComm) : "0"}`,
      sub: lang === "ar" ? "هذا الشهر" : "In this month",
      icon: DollarSign,
      path: "/dashboard/commissions",
      isAccent: true,
    },
    {
      value: `${convRate}%`,
      sub: lang === "ar" ? "معدل التحويل" : "Conversion Rate",
      icon: Target,
      path: "/dashboard/pipeline",
      isAccent: false,
    },
    {
      value: totalLeads.toString(),
      badge: qualified > 0 ? `+${qualified}` : undefined,
      sub: lang === "ar" ? "هذا الشهر" : "In this month",
      icon: Users,
      path: "/dashboard/pipeline",
      isAccent: false,
    },
    {
      value: `AED ${totalComm > 0 ? totalComm.toLocaleString() : "0"}`,
      sub: lang === "ar" ? "الإجمالي" : "For all time",
      icon: TrendingUp,
      path: "/dashboard/commissions",
      isAccent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((card, i) => (
        <motion.button
          key={i}
          onClick={() => navigate(card.path)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          className={`relative rounded-3xl p-5 text-start cursor-pointer transition-all duration-200 hover:shadow-lg group ${
            card.isAccent
              ? "text-[hsl(var(--dash-accent-fg))]"
              : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.3)]"
          }`}
          style={card.isAccent ? { background: "var(--dash-accent-gradient)" } : undefined}
        >
          {/* Top icons row */}
          <div className="flex items-center justify-between mb-6">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              card.isAccent
                ? "bg-white/20"
                : "bg-[hsl(var(--dash-muted))]"
            }`}>
              <card.icon className={`w-4 h-4 ${card.isAccent ? "text-[hsl(var(--dash-accent-fg))]" : "text-[hsl(var(--dash-muted-fg))]"}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              card.isAccent
                ? "border-white/20 text-[hsl(var(--dash-accent-fg))]"
                : "border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))]"
            } group-hover:scale-110 transition-transform`}>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight leading-none ${
              card.isAccent ? "" : "text-[hsl(var(--dash-fg))]"
            }`}>
              {card.value}
            </p>
            {card.badge && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">
                {card.badge}
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p className={`text-xs mt-1.5 ${
            card.isAccent ? "opacity-70" : "text-[hsl(var(--dash-muted-fg))]"
          }`}>
            {card.sub}
          </p>
        </motion.button>
      ))}
    </div>
  );
};

export default DashboardKPICards;
