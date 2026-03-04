import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { TrendingUp, CheckCircle, DollarSign, Clock } from "lucide-react";
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

  const stats = [
    { labelFr: "Estimées", labelEn: "Estimated", value: `AED ${sumOf(byStatus("estimated")).toLocaleString()}`, icon: TrendingUp, color: "text-purple-500" },
    { labelFr: "Validées", labelEn: "Validated", value: `AED ${sumOf(byStatus("validated")).toLocaleString()}`, icon: CheckCircle, color: "text-gray-600" },
    { labelFr: "Payées", labelEn: "Paid", value: `AED ${sumOf(byStatus("paid")).toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { labelFr: "En attente", labelEn: "Pending", value: `AED ${sumOf(byStatus("pending")).toLocaleString()}`, icon: Clock, color: "text-orange-400" },
  ];

  const statusBadge: Record<string, string> = {
    estimated: "bg-purple-100 text-purple-700",
    validated: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold dash-text mb-1">Commissions</h1>
      <p className="dash-muted-text text-sm mb-6">{lang === "fr" ? "Suivi de vos commissions sur chaque deal" : "Track your commissions on each deal"}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="dash-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm dash-muted-text">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-gray-100 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-display font-bold dash-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="dash-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b dash-border-color">
              {["LEAD", "DEAL", lang === "fr" ? "MONTANT" : "AMOUNT", lang === "fr" ? "STATUT" : "STATUS", "DATE"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold dash-muted-text uppercase tracking-wider px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 dash-muted-text text-sm">
                {lang === "fr" ? "Aucune commission pour le moment." : "No commissions yet."}
              </td></tr>
            ) : (
              commissions.map((c: any) => (
                <tr key={c.id} className="border-b dash-border-color last:border-0">
                  <td className="px-5 py-4 text-sm dash-text font-medium">{c.leads?.first_name || "—"} {c.leads?.last_name?.charAt(0) || ""}.</td>
                  <td className="px-5 py-4 text-sm dash-muted-text">{c.deal_name}</td>
                  <td className="px-5 py-4 text-sm font-semibold dash-text">AED {Number(c.amount).toLocaleString()}</td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[c.status] || "bg-gray-100"}`}>{lang === "fr" ? (c.status === "paid" ? "Payée" : c.status === "validated" ? "Validée" : c.status === "pending" ? "En attente" : "Estimée") : c.status}</span></td>
                  <td className="px-5 py-4 text-sm dash-muted-text">{new Date(c.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Commissions;
