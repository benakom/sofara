import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle, Clock, CreditCard, ArrowDownRight, ArrowUpRight, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Payments = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("payments").select("*").order("date", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const paid = payments.filter((p: any) => p.status === "paid");
  const pending = payments.filter((p: any) => p.status === "pending");
  const totalPaid = paid.reduce((a: number, p: any) => a + Number(p.amount), 0);
  const totalPending = pending.reduce((a: number, p: any) => a + Number(p.amount), 0);
  const totalAll = totalPaid + totalPending;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-bold dash-text mb-0.5">{lang === "fr" ? "Paiements" : "Payments"}</h1>
      <p className="dash-muted-text text-base sm:text-sm mb-5">{lang === "fr" ? "Suivi de vos paiements." : "Track your payments."}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { labelFr: "Total reçu", labelEn: "Total Received", value: totalPaid, icon: CheckCircle, accent: "bg-emerald-50 text-emerald-600" },
          { labelFr: "En attente", labelEn: "Pending", value: totalPending, icon: Clock, accent: "bg-amber-50 text-amber-600" },
          { labelFr: "Total global", labelEn: "Total Overall", value: totalAll, icon: BarChart3, accent: "bg-blue-50 text-blue-600" },
          { labelFr: "Transactions", labelEn: "Transactions", value: payments.length, icon: CreditCard, accent: "bg-violet-50 text-violet-600", noPrefix: true },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "fr" ? s.labelFr : s.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">{(s as any).noPrefix ? s.value : `AED ${s.value.toLocaleString()}`}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment progress */}
      <div className="dash-card rounded-xl p-4 mb-5">
        <h2 className="text-base sm:text-sm font-display font-semibold dash-text mb-3">{lang === "fr" ? "Répartition" : "Breakdown"}</h2>
        <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
          {totalPaid > 0 && <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalAll > 0 ? (totalPaid / totalAll) * 100 : 0}%` }} />}
          {totalPending > 0 && <div className="h-full bg-amber-400 rounded-full" style={{ width: `${totalAll > 0 ? (totalPending / totalAll) * 100 : 0}%` }} />}
        </div>
        <div className="flex gap-4 mt-2 text-xs dash-muted-text">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {lang === "fr" ? "Reçu" : "Received"}: AED {totalPaid.toLocaleString()}</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> {lang === "fr" ? "En attente" : "Pending"}: AED {totalPending.toLocaleString()}</span>
        </div>
      </div>

      {/* History */}
      <div className="dash-card rounded-xl p-4">
        <h2 className="text-sm font-display font-semibold dash-text mb-3">{lang === "fr" ? "Historique" : "History"}</h2>
        {payments.length === 0 ? (
          <div className="text-center py-12 dash-muted-text text-sm">{lang === "fr" ? "Aucun paiement." : "No payments."}</div>
        ) : (
          <div className="space-y-2">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b dash-border-color last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${p.status === "paid" ? "bg-emerald-50" : "bg-amber-50"}`}>
                    {p.status === "paid" ? <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium dash-text">{p.reference}</p>
                    <p className="text-[11px] dash-muted-text flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(p.date).toLocaleDateString()} • {p.deal_name || "—"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold dash-text">AED {Number(p.amount).toLocaleString()}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.status === "paid" ? (lang === "fr" ? "Reçu" : "Received") : (lang === "fr" ? "En attente" : "Pending")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Payments;
