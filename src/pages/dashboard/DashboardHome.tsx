import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight, TrendingUp, Zap, Target, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardHome = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: leads = [] } = useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("commissions").select("*");
      return data || [];
    },
    enabled: !!user,
  });

  const totalLeads = leads.length;
  const qualified = leads.filter((l: any) => l.stage === "qualifie").length;
  const accepted = leads.filter((l: any) => ["offre_acceptee", "booking", "dp_paye"].includes(l.stage)).length;
  const booked = leads.filter((l: any) => ["booking", "dp_paye"].includes(l.stage)).length;

  const estComm = commissions.filter((c: any) => c.status === "estimated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const valComm = commissions.filter((c: any) => c.status === "validated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const paidComm = commissions.filter((c: any) => c.status === "paid").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const totalComm = estComm + valComm + paidComm;
  const convRate = totalLeads > 0 ? Math.round((accepted / totalLeads) * 100) : 0;

  const kpis = [
    { labelFr: "Leads", labelEn: "Leads", value: totalLeads, icon: Users, accent: "bg-blue-50 text-blue-600" },
    { labelFr: "Qualifiés", labelEn: "Qualified", value: qualified, icon: GitBranch, accent: "bg-violet-50 text-violet-600" },
    { labelFr: "Acceptés", labelEn: "Accepted", value: accepted, icon: CheckCircle, accent: "bg-emerald-50 text-emerald-600" },
    { labelFr: "Bookings", labelEn: "Bookings", value: booked, icon: Target, accent: "bg-amber-50 text-amber-600" },
    { labelFr: "Taux conv.", labelEn: "Conv. rate", value: `${convRate}%`, icon: TrendingUp, accent: "bg-rose-50 text-rose-600" },
    { labelFr: "Commissions", labelEn: "Commissions", value: `${totalComm.toLocaleString()}`, icon: DollarSign, accent: "bg-green-50 text-green-600", prefix: "AED " },
  ];

  const recentLeads = leads.slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-xl font-display font-bold dash-text">
          👋 {lang === "fr" ? "Bienvenue" : "Welcome"}, {user?.email?.split("@")[0]}
        </h1>
        <p className="dash-muted-text text-base sm:text-sm mt-0.5">
          {lang === "fr" ? "Voici le résumé de votre activité." : "Here's your activity summary."}
        </p>
      </div>

      {/* KPI Grid - compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="dash-card rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${kpi.accent}`}><kpi.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "fr" ? kpi.labelFr : kpi.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">{kpi.prefix || ""}{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Commission breakdown */}
        <div className="lg:col-span-2 dash-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-sm font-display font-semibold dash-text flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Commissions</h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-sm sm:text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5">
              {lang === "fr" ? "Détails" : "Details"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { label: lang === "fr" ? "Estimées" : "Estimated", value: estComm, color: "bg-violet-500" },
              { label: lang === "fr" ? "Validées" : "Validated", value: valComm, color: "bg-blue-500" },
              { label: lang === "fr" ? "Payées" : "Paid", value: paidComm, color: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm sm:text-xs mb-1">
                  <span className="dash-muted-text">{item.label}</span>
                  <span className="font-medium dash-text">AED {item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${totalComm > 0 ? (item.value / totalComm) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t dash-border-color flex items-center justify-between">
            <span className="text-sm sm:text-xs dash-muted-text">Total</span>
            <span className="text-base sm:text-sm font-bold dash-text">AED {totalComm.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-3 dash-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-sm font-display font-semibold dash-text">{lang === "fr" ? "Leads récents" : "Recent Leads"}</h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-sm sm:text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8 dash-muted-text text-base sm:text-sm">
              {lang === "fr" ? "Aucun lead. Importez vos premiers leads !" : "No leads. Import your first leads!"}
            </div>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b dash-border-color last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[hsl(var(--primary)/.08)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--primary))]">
                      {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base sm:text-sm font-medium dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                      <p className="text-xs sm:text-[11px] dash-muted-text">{lead.source}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dash-text capitalize">{lead.stage?.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelFr: "Ajouter un lead", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline", accent: "bg-blue-50 text-blue-600" },
          { labelFr: "Academy", labelEn: "Academy", icon: Zap, path: "/dashboard/academy", accent: "bg-amber-50 text-amber-600" },
          { labelFr: "SofarAI", labelEn: "SofarAI", icon: Trophy, path: "/dashboard/sofar-ai", accent: "bg-violet-50 text-violet-600" },
          { labelFr: "Bonus", labelEn: "Bonus", icon: DollarSign, path: "/dashboard/bonus", accent: "bg-green-50 text-green-600" },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)}
            className="dash-card rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow text-left group">
            <div className={`p-2 rounded-lg ${action.accent}`}><action.icon className="w-4 h-4" /></div>
            <span className="text-sm font-medium dash-text group-hover:text-[hsl(var(--primary))] transition-colors">{lang === "fr" ? action.labelFr : action.labelEn}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
