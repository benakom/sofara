import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight, TrendingUp, Zap, Target, BarChart3, CalendarDays, Send, GraduationCap, Sparkles } from "lucide-react";
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

  const userName = user?.email?.split("@")[0] || "User";

  const kpis = [
    {
      labelAr: "إجمالي العملاء", labelEn: "Total Leads",
      value: totalLeads, icon: Users, path: "/dashboard/pipeline",
      bg: "bg-[hsl(17,90%,55%)]",
    },
    {
      labelAr: "عملاء مؤهلون", labelEn: "Hot Leads",
      value: qualified, icon: Zap, path: "/dashboard/pipeline",
      bg: "bg-[hsl(0,0%,14%)]",
    },
    {
      labelAr: "قيمة خط الأنابيب", labelEn: "Pipeline Value",
      value: `AED ${totalComm > 0 ? (totalComm / 1000).toFixed(0) + "K" : "0"}`, icon: DollarSign, path: "/dashboard/commissions",
      bg: "bg-[hsl(160,60%,45%)]",
    },
    {
      labelAr: "نقاط العميل", labelEn: "Conversion",
      value: `${convRate}%`, icon: Target, path: "/dashboard/pipeline",
      bg: "bg-[hsl(262,60%,55%)]",
    },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold dash-text">
            {lang === "ar" ? `مرحباً، ${userName}` : `Hello, ${userName}`}
          </h1>
          <p className="dash-muted-text text-sm mt-0.5">
            {lang === "ar" ? "تحكم في استثماراتك ودخلك" : "Control your investments, income and invoices"}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/pipeline")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--dash-border))] text-sm font-medium dash-text hover:bg-[hsl(var(--dash-muted))] transition-colors"
        >
          {lang === "ar" ? "عرض التفاصيل" : "See details"} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards — Vestox style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(kpi.path)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className={`relative rounded-2xl p-5 text-start cursor-pointer ${kpi.bg} hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className="w-5 h-5 text-white/70" />
              <TrendingUp className="w-3.5 h-3.5 text-white/30" />
            </div>
            <p className="text-3xl font-display font-bold text-white tracking-tight leading-none mb-1">
              {kpi.value}
            </p>
            <p className="text-xs font-medium text-white/70 mt-1">{lang === "ar" ? kpi.labelAr : kpi.labelEn}</p>
            {/* Decorative bar */}
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full" style={{ width: `${Math.min(60 + i * 10, 90)}%` }} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        {/* Commission breakdown */}
        <div className="lg:col-span-2 dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
              {lang === "ar" ? "العمولات" : "Commissions"}
            </h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-xs font-medium text-[hsl(var(--dash-accent))] hover:underline flex items-center gap-1">
              {lang === "ar" ? "التفاصيل" : "Details"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: lang === "ar" ? "تقديرية" : "Estimated", value: estComm, color: "bg-[hsl(17,90%,55%)]" },
              { label: lang === "ar" ? "مؤكدة" : "Validated", value: valComm, color: "bg-[hsl(0,0%,20%)]" },
              { label: lang === "ar" ? "مدفوعة" : "Paid", value: paidComm, color: "bg-[hsl(160,60%,45%)]" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="dash-muted-text">{item.label}</span>
                  <span className="font-semibold dash-text">AED {item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${totalComm > 0 ? (item.value / totalComm) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="h-px bg-[hsl(var(--dash-border))] my-4" />
          <div className="flex items-center justify-between">
            <span className="text-xs dash-muted-text">Total</span>
            <span className="text-lg font-bold font-display dash-text">AED {totalComm.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-3 dash-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold dash-text flex items-center gap-2">
              <Users className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
              {lang === "ar" ? "العملاء الأخيرون" : "Recent Leads"}
            </h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-xs font-medium text-[hsl(var(--dash-accent))] hover:underline flex items-center gap-1">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-10 dash-muted-text text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
              {lang === "ar" ? "لا يوجد عملاء بعد" : "No leads yet"}
            </div>
          ) : (
            <div className="space-y-0">
              {recentLeads.map((lead: any, i: number) => (
                <div key={lead.id} className={`flex items-center justify-between py-2.5 ${i < recentLeads.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[11px] font-semibold dash-text">
                      {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                      <p className="text-[11px] dash-muted-text">{lead.source}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[hsl(var(--dash-muted))] dash-text capitalize">{lead.stage?.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelAr: "إضافة عميل", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline" },
          { labelAr: "الأكاديمية", labelEn: "Academy", icon: GraduationCap, path: "/dashboard/academy" },
          { labelAr: "SofarAI", labelEn: "SofarAI", icon: Sparkles, path: "/dashboard/ai-hub" },
          { labelAr: "المكافآت", labelEn: "Bonus", icon: Trophy, path: "/dashboard/bonus" },
        ].map((action, i) => (
          <motion.button key={i} onClick={() => navigate(action.path)}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
            className="dash-card rounded-xl p-4 flex items-center gap-3 text-start group cursor-pointer hover:border-[hsl(var(--dash-accent)/.3)] transition-all">
            <div className="p-2 rounded-lg bg-[hsl(var(--dash-muted))]">
              <action.icon className="w-4 h-4 dash-muted-text group-hover:text-[hsl(var(--dash-accent))] transition-colors" />
            </div>
            <span className="text-sm font-medium dash-text group-hover:text-[hsl(var(--dash-accent))] transition-colors">
              {lang === "ar" ? action.labelAr : action.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
