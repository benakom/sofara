import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
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

  const statusBadge: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold dash-text mb-1">{lang === "fr" ? "Paiements" : "Payments"}</h1>
      <p className="dash-muted-text text-sm mb-6">{lang === "fr" ? "Suivi de tous vos paiements" : "Track all your payments"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm dash-muted-text">{lang === "fr" ? "Total reçu" : "Total Received"}</span>
            <div className="p-2 rounded-xl bg-green-100 text-green-500"><CheckCircle className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-display font-bold dash-text">AED {totalPaid.toLocaleString()}</p>
          {paid.length > 0 && <p className="text-xs text-green-500 mt-1">↑ {paid.length} deals</p>}
        </div>
        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm dash-muted-text">{lang === "fr" ? "En attente" : "Pending"}</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-400"><Clock className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-display font-bold dash-text">AED {totalPending.toLocaleString()}</p>
          {pending.length > 0 && <p className="text-xs dash-muted-text mt-1">{pending.length} deal{pending.length > 1 ? "s" : ""}</p>}
        </div>
        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm dash-muted-text">{lang === "fr" ? "Prochain paiement" : "Next Payment"}</span>
            <div className="p-2 rounded-xl bg-gray-100 text-gray-500"><CreditCard className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-display font-bold dash-text">—</p>
        </div>
      </div>

      <div className="dash-card rounded-2xl p-6">
        <h2 className="text-lg font-display font-semibold dash-text mb-4">{lang === "fr" ? "Historique des paiements" : "Payment History"}</h2>
        {payments.length === 0 ? (
          <div className="text-center py-16 dash-muted-text text-sm">{lang === "fr" ? "Aucun paiement pour le moment." : "No payments yet."}</div>
        ) : (
          <div className="space-y-3">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b dash-border-color last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${p.status === "paid" ? "bg-green-100" : "bg-orange-100"}`}>
                    {p.status === "paid" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium dash-text">{p.reference} <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${statusBadge[p.status] || ""}`}>{p.status === "paid" ? "Paid" : "Pending"}</span></p>
                    <p className="text-xs dash-muted-text">{p.deal_name || "—"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold dash-text">AED {Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs dash-muted-text">{new Date(p.date).toLocaleDateString()}</p>
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
