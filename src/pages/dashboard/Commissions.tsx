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
    { labelFr: "Estimées", labelEn: "Estimated", value: sumOf(byStatus("estimated")), icon: TrendingUp, accent: "bg-violet-50 text-violet-600" },
    { labelFr: "Validées", labelEn: "Validated", value: sumOf(byStatus("validated")), icon: CheckCircle, accent: "bg-blue-50 text-blue-600" },
    { labelFr: "Payées", labelEn: "Paid", value: sumOf(byStatus("paid")), icon: DollarSign, accent: "bg-emerald-50 text-emerald-600" },
    { labelFr: "En attente", labelEn: "Pending", value: sumOf(byStatus("pending")), icon: Clock, accent: "bg-amber-50 text-amber-600" },
  ];

  const statusConfig: Record<string, { badge: string; labelFr: string }> = {
    estimated: { badge: "bg-violet-100 text-violet-700", labelFr: "Estimée" },
    validated: { badge: "bg-blue-100 text-blue-700", labelFr: "Validée" },
    paid: { badge: "bg-emerald-100 text-emerald-700", labelFr: "Payée" },
    pending: { badge: "bg-amber-100 text-amber-700", labelFr: "En attente" },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-bold dash-text mb-0.5">Commissions</h1>
      <p className="dash-muted-text text-base sm:text-sm mb-5">{lang === "fr" ? "Suivi détaillé de vos commissions." : "Detailed tracking of your commissions."}</p>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-[11px] font-medium dash-muted-text uppercase tracking-wider">{lang === "fr" ? s.labelFr : s.labelEn}</span>
            </div>
            <p className="text-lg font-display font-bold dash-text">AED {s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 dash-card rounded-xl p-4">
          <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2 mb-3"><BarChart3 className="w-4 h-4" /> {lang === "fr" ? "Progression des paiements" : "Payment Progress"}</h2>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="dash-muted-text">{lang === "fr" ? s.labelFr : s.labelEn}</span>
                  <span className="font-medium dash-text">AED {s.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    i === 0 ? "bg-violet-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-emerald-500" : "bg-amber-400"
                  }`} style={{ width: `${total > 0 ? (s.value / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold dash-muted-text uppercase tracking-wider mb-1">{lang === "fr" ? "Total commissions" : "Total Commissions"}</h3>
            <p className="text-2xl font-display font-bold dash-text">AED {total.toLocaleString()}</p>
          </div>
          <div className="mt-3 pt-3 border-t dash-border-color">
            <div className="flex items-center justify-between text-xs">
              <span className="dash-muted-text">{lang === "fr" ? "Taux encaissé" : "Collection rate"}</span>
              <span className="font-bold text-emerald-600">{paidPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 dash-muted-text" />
            <span className="text-xs dash-muted-text">{commissions.length} {lang === "fr" ? "transactions" : "transactions"}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="dash-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b dash-border-color">
              {["LEAD", "DEAL", lang === "fr" ? "MONTANT" : "AMOUNT", lang === "fr" ? "STATUT" : "STATUS", "DATE"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold dash-muted-text uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-14 dash-muted-text text-sm">
                {lang === "fr" ? "Aucune commission pour le moment." : "No commissions yet."}
              </td></tr>
            ) : (
              commissions.map((c: any) => {
                const cfg = statusConfig[c.status] || statusConfig.estimated;
                return (
                  <tr key={c.id} className="border-b dash-border-color last:border-0 hover:bg-[hsl(var(--dash-muted)/.5)] transition-colors">
                    <td className="px-4 py-3 text-sm dash-text font-medium">{c.leads?.first_name || "—"} {c.leads?.last_name?.charAt(0) || ""}.</td>
                    <td className="px-4 py-3 text-sm dash-muted-text">{c.deal_name}</td>
                    <td className="px-4 py-3 text-sm font-semibold dash-text">AED {Number(c.amount).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{lang === "fr" ? cfg.labelFr : c.status}</span></td>
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
