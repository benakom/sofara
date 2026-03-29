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
    { labelAr: "Leads", labelEn: "Leads", value: totalLeads, icon: Users, blockClass: "dash-block-a", iconClass: "dash-icon-a" },
    { labelAr: "Qualifiés", labelEn: "Qualified", value: qualified, icon: GitBranch, blockClass: "dash-block-b", iconClass: "dash-icon-b" },
    { labelAr: "Acceptés", labelEn: "Accepted", value: accepted, icon: CheckCircle, blockClass: "dash-block-c", iconClass: "dash-icon-c" },
    { labelAr: "Bookings", labelEn: "Bookings", value: booked, icon: Target, blockClass: "dash-block-d", iconClass: "dash-icon-d" },
    { labelAr: "Taux conv.", labelEn: "Conv. rate", value: `${convRate}%`, icon: TrendingUp, blockClass: "dash-block-e", iconClass: "dash-icon-e" },
    { labelAr: "Commissions", labelEn: "Commissions", value: `${totalComm.toLocaleString()}`, icon: DollarSign, blockClass: "dash-block-f", iconClass: "dash-icon-f", prefix: "AED " },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold dash-text tracking-tight">
          {lang === "ar" ? "مرحباً" : "Welcome"}, {user?.email?.split("@")[0]} 👋
        </h1>
        <p className="dash-muted-text text-sm mt-1">
          {lang === "ar" ? "إليك ملخص نشاطك." : "Here's your activity overview."}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`dash-card rounded-xl p-4 relative overflow-hidden ${kpi.blockClass}`}>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${kpi.iconClass}`}>
                  <kpi.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold dash-text tracking-tight">{kpi.prefix || ""}{kpi.value}</p>
              <span className="text-[11px] font-medium dash-muted-text uppercase tracking-wider">{lang === "ar" ? kpi.labelAr : kpi.labelEn}</span>
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
              <div className="p-1.5 rounded-lg dash-icon-b">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              Commissions
            </h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-xs font-medium text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent)/.8)] flex items-center gap-0.5 transition-colors">
              {lang === "ar" ? "التفاصيل" : "Details"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: lang === "ar" ? "تقديرية" : "Estimated", value: estComm, color: "dash-bar-b" },
              { label: lang === "ar" ? "مؤكدة" : "Validated", value: valComm, color: "dash-bar-a" },
              { label: lang === "ar" ? "مدفوعة" : "Paid", value: paidComm, color: "dash-bar-c" },
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
              <div className="p-1.5 rounded-lg dash-icon-a">
                <Users className="w-3.5 h-3.5" />
              </div>
              {lang === "ar" ? "العملاء الأخيرون" : "Recent Leads"}
            </h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-xs font-medium text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent)/.8)] flex items-center gap-0.5 transition-colors">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-10 dash-muted-text text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {lang === "ar" ? "لا يوجد عملاء بعد. قم باستيراد عملائك الأوائل!" : "No leads yet. Import your first leads!"}
            </div>
          ) : (
            <div className="space-y-0">
              {recentLeads.map((lead: any, i: number) => (
                <div key={lead.id} className={`flex items-center justify-between py-2.5 ${i < recentLeads.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full dash-icon-b flex items-center justify-center text-[11px] font-bold">
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
          { labelAr: "Ajouter un lead", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline", blockClass: "dash-block-a", iconClass: "dash-icon-a" },
          { labelAr: "Academy", labelEn: "Academy", icon: Zap, path: "/dashboard/academy", blockClass: "dash-block-d", iconClass: "dash-icon-d" },
          { labelAr: "SofarAI", labelEn: "SofarAI", icon: Trophy, path: "/dashboard/ai-hub", blockClass: "dash-block-b", iconClass: "dash-icon-b" },
          { labelAr: "Bonus", labelEn: "Bonus", icon: DollarSign, path: "/dashboard/bonus", blockClass: "dash-block-c", iconClass: "dash-icon-c" },
        ].map((action, i) => (
          <motion.button key={i} onClick={() => navigate(action.path)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className={`dash-card-interactive rounded-xl p-4 flex items-center gap-3 text-left group relative overflow-hidden ${action.blockClass}`}>
            <div className={`relative p-2 rounded-lg ${action.iconClass} shadow-sm`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="relative text-sm font-medium dash-text group-hover:text-[hsl(var(--dash-accent))] transition-colors">
              {lang === "ar" ? action.labelAr : action.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
