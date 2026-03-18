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
    { labelFr: "Leads", labelEn: "Leads", value: totalLeads, icon: Users, color: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-600", borderColor: "border-blue-100" },
    { labelFr: "Qualifiés", labelEn: "Qualified", value: qualified, icon: GitBranch, color: "from-violet-500/10 to-violet-500/5", iconColor: "text-violet-600", borderColor: "border-violet-100" },
    { labelFr: "Acceptés", labelEn: "Accepted", value: accepted, icon: CheckCircle, color: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-600", borderColor: "border-emerald-100" },
    { labelFr: "Bookings", labelEn: "Bookings", value: booked, icon: Target, color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-600", borderColor: "border-amber-100" },
    { labelFr: "Taux conv.", labelEn: "Conv. rate", value: `${convRate}%`, icon: TrendingUp, color: "from-rose-500/10 to-rose-500/5", iconColor: "text-rose-600", borderColor: "border-rose-100" },
    { labelFr: "Commissions", labelEn: "Commissions", value: `${totalComm.toLocaleString()}`, icon: DollarSign, color: "from-green-500/10 to-green-500/5", iconColor: "text-green-600", borderColor: "border-green-100", prefix: "AED " },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold dash-text tracking-tight">
          {lang === "fr" ? "Bienvenue" : "Welcome"}, {user?.email?.split("@")[0]} 👋
        </h1>
        <p className="dash-muted-text text-sm mt-1">
          {lang === "fr" ? "Voici le résumé de votre activité." : "Here's your activity overview."}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`dash-card rounded-xl p-4 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg bg-white/80 ${kpi.iconColor} shadow-sm`}>
                  <kpi.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold dash-text tracking-tight">{kpi.prefix || ""}{kpi.value}</p>
              <span className="text-[11px] font-medium dash-muted-text uppercase tracking-wider">{lang === "fr" ? kpi.labelFr : kpi.labelEn}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Commission breakdown */}
        <div className="lg:col-span-2 dash-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[hsl(var(--primary)/.08)]">
                <BarChart3 className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
              </div>
              Commissions
            </h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-xs font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/.8)] flex items-center gap-0.5 transition-colors">
              {lang === "fr" ? "Détails" : "Details"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: lang === "fr" ? "Estimées" : "Estimated", value: estComm, color: "bg-violet-500" },
              { label: lang === "fr" ? "Validées" : "Validated", value: valComm, color: "bg-blue-500" },
              { label: lang === "fr" ? "Payées" : "Paid", value: paidComm, color: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="dash-muted-text font-medium">{item.label}</span>
                  <span className="font-semibold dash-text">AED {item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${totalComm > 0 ? (item.value / totalComm) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dash-divider mt-4 mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-xs dash-muted-text font-medium">Total</span>
            <span className="text-lg font-bold font-display dash-text">AED {totalComm.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-3 dash-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
              {lang === "fr" ? "Leads récents" : "Recent Leads"}
            </h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-xs font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/.8)] flex items-center gap-0.5 transition-colors">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-10 dash-muted-text text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {lang === "fr" ? "Aucun lead. Importez vos premiers leads !" : "No leads yet. Import your first leads!"}
            </div>
          ) : (
            <div className="space-y-0">
              {recentLeads.map((lead: any, i: number) => (
                <div key={lead.id} className={`flex items-center justify-between py-2.5 ${i < recentLeads.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/.12)] to-[hsl(var(--primary)/.06)] flex items-center justify-center text-[11px] font-bold text-[hsl(var(--primary))]">
                      {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                      <p className="text-[11px] dash-muted-text">{lead.source}</p>
                    </div>
                  </div>
                  <span className="dash-badge bg-[hsl(var(--dash-muted))] dash-text capitalize">{lead.stage?.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelFr: "Ajouter un lead", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline", gradient: "from-blue-500/8 to-blue-600/4", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
          { labelFr: "Academy", labelEn: "Academy", icon: Zap, path: "/dashboard/academy", gradient: "from-amber-500/8 to-amber-600/4", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
          { labelFr: "SofarAI", labelEn: "SofarAI", icon: Trophy, path: "/dashboard/ai-hub", gradient: "from-violet-500/8 to-violet-600/4", iconBg: "bg-violet-50", iconColor: "text-violet-600" },
          { labelFr: "Bonus", labelEn: "Bonus", icon: DollarSign, path: "/dashboard/bonus", gradient: "from-green-500/8 to-green-600/4", iconBg: "bg-green-50", iconColor: "text-green-600" },
        ].map((action, i) => (
          <motion.button key={i} onClick={() => navigate(action.path)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="dash-card-interactive rounded-xl p-4 flex items-center gap-3 text-left group relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className={`relative p-2 rounded-lg ${action.iconBg} ${action.iconColor} shadow-sm`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="relative text-sm font-medium dash-text group-hover:text-[hsl(var(--primary))] transition-colors">
              {lang === "fr" ? action.labelFr : action.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
