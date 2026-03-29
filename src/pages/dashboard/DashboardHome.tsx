import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight, TrendingUp, Zap, Target, BarChart3, CalendarDays, Send } from "lucide-react";
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

  const today = new Date();
  const dateStr = lang === "ar"
    ? today.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : today.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const kpis = [
    {
      labelAr: "إجمالي العملاء", labelEn: "Total Leads",
      subAr: `+0 ${lang === "ar" ? "اليوم" : "today"}`, subEn: `+0 today · ${totalLeads} this week`,
      value: totalLeads, icon: Users, path: "/dashboard/pipeline",
      gradient: "from-[hsl(262,84%,60%)] to-[hsl(286,76%,60%)]",
    },
    {
      labelAr: "عملاء مؤهلون", labelEn: "Hot Leads",
      subAr: `${qualified} في خط الأنابيب`, subEn: `${qualified} warm leads in pipeline`,
      value: qualified, icon: Zap, path: "/dashboard/pipeline",
      gradient: "from-[hsl(275,80%,58%)] to-[hsl(298,72%,62%)]",
    },
    {
      labelAr: "قيمة خط الأنابيب", labelEn: "Pipeline Value",
      subAr: `${accepted} صفقات مغلقة`, subEn: `${accepted} won deals closed`,
      value: `AED ${totalComm > 0 ? (totalComm / 1000).toFixed(0) + "K" : "0"}`, icon: DollarSign, path: "/dashboard/commissions",
      gradient: "from-[hsl(257,82%,58%)] to-[hsl(279,78%,62%)]",
    },
    {
      labelAr: "نقاط العميل", labelEn: "Lead Score",
      subAr: `${convRate}% معدل التحويل`, subEn: `${convRate}% conversion rate`,
      value: `${convRate}/100`, icon: Target, path: "/dashboard/pipeline",
      gradient: "from-[hsl(285,78%,57%)] to-[hsl(310,68%,61%)]",
    },
  ];

  const secondaryKpis = [
    {
      labelAr: "مؤهلون بالكامل", labelEn: "Fully Qualified",
      value: accepted, subAr: `${totalLeads > 0 ? Math.round((accepted / totalLeads) * 100) : 0}% من إجمالي العملاء`, subEn: `${totalLeads > 0 ? Math.round((accepted / totalLeads) * 100) : 0}% of total leads`,
      icon: CheckCircle, path: "/dashboard/pipeline",
    },
    {
      labelAr: "الحجوزات", labelEn: "Bookings",
      value: booked, subAr: "حجوزات مؤكدة", subEn: "Confirmed bookings",
      icon: CalendarDays, path: "/dashboard/pipeline",
    },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[hsl(262,72%,56%)] to-[hsl(290,60%,52%)] shadow-lg">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold dash-text tracking-tight">
              {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="dash-muted-text text-xs mt-0.5 flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> {dateStr}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/pipeline")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(262,72%,56%)] to-[hsl(290,60%,52%)] text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {lang === "ar" ? "عرض كل العملاء" : "View All Leads"} <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpis.map((kpi, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(kpi.path)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer border-0 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 bg-gradient-to-br ${kpi.gradient}`}
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none rounded-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-sm">
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-4xl font-display font-black text-white tracking-tight drop-shadow-sm leading-none mb-1">
                {kpi.value}
              </p>
              <p className="text-sm font-semibold text-white/90 mt-1">{lang === "ar" ? kpi.labelAr : kpi.labelEn}</p>
              <p className="text-xs text-white/55 mt-0.5">{lang === "ar" ? kpi.subAr : kpi.subEn}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {secondaryKpis.map((kpi, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(kpi.path)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
            className="dash-card rounded-2xl p-5 flex items-center gap-4 text-left hover:shadow-lg hover:border-[hsl(var(--dash-accent)/.2)] transition-all group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl dash-icon-b shadow-sm">
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest dash-muted-text">{lang === "ar" ? kpi.labelAr : kpi.labelEn}</p>
              <p className="text-3xl font-display font-black dash-text tracking-tight leading-none mt-1">{kpi.value}</p>
              <p className="text-xs dash-muted-text mt-0.5">{lang === "ar" ? kpi.subAr : kpi.subEn}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Commission breakdown */}
        <div className="lg:col-span-2 dash-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-display font-bold dash-text flex items-center gap-2.5">
              <div className="p-2 rounded-xl dash-icon-b shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              {lang === "ar" ? "العمولات" : "Commissions"}
            </h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-xs font-semibold text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent)/.7)] flex items-center gap-1 transition-colors">
              {lang === "ar" ? "التفاصيل" : "Details"} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: lang === "ar" ? "تقديرية" : "Estimated", value: estComm, color: "dash-bar-b" },
              { label: lang === "ar" ? "مؤكدة" : "Validated", value: valComm, color: "dash-bar-a" },
              { label: lang === "ar" ? "مدفوعة" : "Paid", value: paidComm, color: "dash-bar-c" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="dash-muted-text font-medium">{item.label}</span>
                  <span className="font-bold dash-text">AED {item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${totalComm > 0 ? (item.value / totalComm) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dash-divider mt-5 mb-4" />
          <div className="flex items-center justify-between">
            <span className="text-xs dash-muted-text font-medium">Total</span>
            <span className="text-xl font-black font-display dash-text tracking-tight">AED {totalComm.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-3 dash-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-display font-bold dash-text flex items-center gap-2.5">
              <div className="p-2 rounded-xl dash-icon-a shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              {lang === "ar" ? "العملاء الأخيرون" : "Recent Leads"}
            </h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-xs font-semibold text-[hsl(var(--dash-accent))] hover:text-[hsl(var(--dash-accent)/.7)] flex items-center gap-1 transition-colors">
              Pipeline <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-12 dash-muted-text text-sm">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
              {lang === "ar" ? "لا يوجد عملاء بعد. قم باستيراد عملائك الأوائل!" : "No leads yet. Import your first leads!"}
            </div>
          ) : (
            <div className="space-y-0">
              {recentLeads.map((lead: any, i: number) => (
                <div key={lead.id} className={`flex items-center justify-between py-3 ${i < recentLeads.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(262,72%,56%)] to-[hsl(290,60%,52%)] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                      {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold dash-text">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                      <p className="text-[11px] dash-muted-text">{lead.source}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[hsl(var(--dash-muted))] dash-text capitalize">{lead.stage?.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelAr: "إضافة عميل", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline", iconClass: "dash-icon-a" },
          { labelAr: "الأكاديمية", labelEn: "Academy", icon: Zap, path: "/dashboard/academy", iconClass: "dash-icon-d" },
          { labelAr: "SofarAI", labelEn: "SofarAI", icon: Trophy, path: "/dashboard/ai-hub", iconClass: "dash-icon-b" },
          { labelAr: "المكافآت", labelEn: "Bonus", icon: DollarSign, path: "/dashboard/bonus", iconClass: "dash-icon-c" },
        ].map((action, i) => (
          <motion.button key={i} onClick={() => navigate(action.path)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
            className="dash-card rounded-2xl p-4 flex items-center gap-3 text-left group cursor-pointer hover:shadow-lg hover:border-[hsl(var(--dash-accent)/.2)] transition-all">
            <div className={`p-2.5 rounded-xl ${action.iconClass} shadow-sm`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold dash-text group-hover:text-[hsl(var(--dash-accent))] transition-colors">
              {lang === "ar" ? action.labelAr : action.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
