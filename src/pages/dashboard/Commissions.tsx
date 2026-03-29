import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { TrendingUp, CheckCircle, DollarSign, Clock, ArrowUpRight, BarChart3, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Commissions = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("commissions").select("*, leads(first_name, last_name)").order("date", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const byStatus = (s: string) => commissions.filter((c: any) => c.status === s);
  const sumOf = (arr: any[]) => arr.reduce((a, c) => a + Number(c.amount), 0);
  const total = sumOf(commissions);
  const paidTotal = sumOf(byStatus("paid"));
  const paidPct = total > 0 ? Math.round((paidTotal / total) * 100) : 0;

  const stats = [
    { labelAr: "Estimées", labelEn: "Estimated", value: sumOf(byStatus("estimated")), icon: TrendingUp, accent: "bg-violet-100 text-violet-600" },
    { labelAr: "Validées", labelEn: "Validated", value: sumOf(byStatus("validated")), icon: CheckCircle, accent: "bg-blue-100 text-blue-600" },
    { labelAr: "Payées", labelEn: "Paid", value: sumOf(byStatus("paid")), icon: DollarSign, accent: "bg-emerald-100 text-emerald-600" },
    { labelAr: "En attente", labelEn: "Pending", value: sumOf(byStatus("pending")), icon: Clock, accent: "bg-amber-100 text-amber-600" },
  ];

  const statusConfig: Record<string, { badge: string; labelAr: string }> = {
    estimated: { badge: "bg-violet-100 text-violet-700", labelAr: "Estimée" },
    validated: { badge: "bg-blue-100 text-blue-700", labelAr: "Validée" },
    paid: { badge: "bg-emerald-100 text-emerald-700", labelAr: "Payée" },
    pending: { badge: "bg-amber-100 text-amber-700", labelAr: "En attente" },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[22px] font-semibold text-[hsl(var(--dash-fg))] tracking-[-0.02em] mb-0.5">{lang === "ar" ? "العمولات" : "Commissions"}</h1>
      <p className="text-[hsl(var(--dash-muted-fg))] text-xs mt-0.5 mb-1">{lang === "ar" ? "تتبع مفصل لعمولاتك." : "Detailed tracking of your commissions."}</p>
      <p className="text-[32px] font-bold text-[hsl(var(--dash-fg))] tracking-[-0.02em] mb-5">AED {total.toLocaleString()}<span className="text-sm font-normal text-[hsl(var(--dash-muted-fg))]">.00</span></p>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "ar" ? s.labelAr : s.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">AED {s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 dash-card rounded-2xl p-5">
          <h2 className="text-base sm:text-sm font-display font-semibold dash-text flex items-center gap-2 mb-3"><BarChart3 className="w-4 h-4" /> {lang === "ar" ? "Progression des paiements" : "Payment Progress"}</h2>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm sm:text-xs mb-1">
                  <span className="dash-muted-text">{lang === "ar" ? s.labelAr : s.labelEn}</span>
                  <span className="font-medium dash-text">AED {s.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    i === 0 ? "bg-violet-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-emerald-500" : "bg-amber-400"
                  }`} style={{ width: `${total > 0 ? (s.value / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-xs font-semibold dash-muted-text uppercase tracking-wider mb-1">{lang === "ar" ? "Total commissions" : "Total Commissions"}</h3>
            <p className="text-3xl sm:text-2xl font-display font-bold dash-text">AED {total.toLocaleString()}</p>
          </div>
          <div className="mt-3 pt-3 border-t dash-border-color">
            <div className="flex items-center justify-between text-sm sm:text-xs">
              <span className="dash-muted-text">{lang === "ar" ? "Taux encaissé" : "Collection rate"}</span>
              <span className="font-bold text-emerald-600">{paidPct}%</span>
            </div>
            <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 dash-muted-text" />
            <span className="text-sm sm:text-xs dash-muted-text">{commissions.length} {lang === "ar" ? "transactions" : "transactions"}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="dash-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b dash-border-color">
              {["LEAD", "DEAL", lang === "ar" ? "MONTANT" : "AMOUNT", lang === "ar" ? "STATUT" : "STATUS", "DATE"].map((h) => (
                <th key={h} className="text-left text-xs sm:text-[11px] font-semibold dash-muted-text uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-14 dash-muted-text text-sm">
                {lang === "ar" ? "Aucune commission pour le moment." : "No commissions yet."}
              </td></tr>
            ) : (
              commissions.map((c: any) => {
                const cfg = statusConfig[c.status] || statusConfig.estimated;
                return (
                  <tr key={c.id} className="border-b dash-border-color last:border-0 hover:bg-[hsl(var(--dash-muted)/.5)] transition-colors">
                    <td className="px-4 py-3 text-sm dash-text font-medium">{c.leads?.first_name || "—"} {c.leads?.last_name?.charAt(0) || ""}.</td>
                    <td className="px-4 py-3 text-sm dash-muted-text">{c.deal_name}</td>
                    <td className="px-4 py-3 text-sm font-semibold dash-text">AED {Number(c.amount).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{lang === "ar" ? cfg.labelAr : c.status}</span></td>
                    <td className="px-4 py-3 text-sm dash-muted-text">{new Date(c.date).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Commissions;
