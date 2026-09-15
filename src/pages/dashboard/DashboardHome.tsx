import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight, TrendingUp, Zap, Target, BarChart3, CalendarDays, Send, ShieldCheck, Link2, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PRO_BENEFITS } from "@/components/dashboard/ProBenefits";

const DashboardHome = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPro, loading: subLoading } = useSubscription();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
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
      variant: "lime" as const,
    },
    {
      labelAr: "عملاء مؤهلون", labelEn: "Hot Leads",
      subAr: `${qualified} في خط الأنابيب`, subEn: `${qualified} warm leads in pipeline`,
      value: qualified, icon: Zap, path: "/dashboard/pipeline",
      variant: "dark" as const,
    },
    {
      labelAr: "قيمة خط الأنابيب", labelEn: "Pipeline Value",
      subAr: `${accepted} صفقات مغلقة`, subEn: `${accepted} won deals closed`,
      value: `AED ${totalComm > 0 ? (totalComm / 1000).toFixed(0) + "K" : "0"}`, icon: DollarSign, path: "/dashboard/commissions",
      variant: "lime" as const,
    },
    {
      labelAr: "نقاط العميل", labelEn: "Lead Score",
      subAr: `${convRate}% معدل التحويل`, subEn: `${convRate}% conversion rate`,
      value: `${convRate}/100`, icon: Target, path: "/dashboard/pipeline",
      variant: "dark" as const,
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

  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const firstName =
    (typeof meta.first_name === "string" && meta.first_name.trim()) ||
    (typeof meta.full_name === "string" && meta.full_name.trim().split(" ")[0]) ||
    "";
  const isNewAmbassador = !leadsLoading && totalLeads === 0;

  const onboardingSteps = [
    { labelAr: "Soumettez votre premier lead", labelEn: "Submit your first lead", descAr: "Un client intéressé par Dubai ? Envoyez-le, on s'occupe du reste.", descEn: "Know someone interested in Dubai? Send them, we handle the rest.", icon: Send, path: "/dashboard/import-leads" },
    { labelAr: "Vérifiez votre identité", labelEn: "Verify your identity", descAr: "KYC requis pour recevoir vos commissions.", descEn: "KYC is required to receive your commissions.", icon: ShieldCheck, path: "/dashboard/kyc" },
    { labelAr: "Partagez votre lien", labelEn: "Share your referral link", descAr: "Invitez d'autres ambassadeurs et gagnez des bonus.", descEn: "Invite other ambassadors and earn bonuses.", icon: Link2, path: "/dashboard/referrals" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[hsl(0,0%,7%)] shadow-lg">
            <Send className="w-5 h-5 text-[#D2F34C]" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-[hsl(var(--dash-fg))] tracking-tight">
              {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="text-[hsl(var(--dash-muted-fg))] text-xs mt-0.5 flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> {dateStr}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/pipeline")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(0,0%,7%)] text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {lang === "ar" ? "عرض كل العملاء" : "View All Leads"} <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Welcome panel — shown until the first lead is submitted */}
      {isNewAmbassador && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl bg-[hsl(0,0%,7%)] p-6 sm:p-8 mb-5 shadow-lg"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D2F34C]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2F34C]/15 border border-[#D2F34C]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D2F34C]" />
              <span className="text-[#D2F34C] text-[11px] font-semibold uppercase tracking-wider">
                {lang === "ar" ? "Espace activé" : "Space activated"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-2">
              {lang === "ar" ? `Bienvenue${firstName ? ` ${firstName}` : ""} !` : `Welcome${firstName ? `, ${firstName}` : ""}!`}
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-6">
              {lang === "ar"
                ? "Votre espace ambassadeur Sofara est prêt. Voici les 3 étapes pour commencer à gagner des commissions."
                : "Your Sofara ambassador space is ready. Here are the 3 steps to start earning commissions."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {onboardingSteps.map((step, i) => (
                <button
                  key={step.path}
                  onClick={() => navigate(step.path)}
                  className="group text-left rounded-2xl bg-white/5 border border-white/10 hover:border-[#D2F34C]/50 hover:bg-white/[0.08] p-4 transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#D2F34C] text-black text-[11px] font-black flex items-center justify-center">{i + 1}</span>
                    <step.icon className="w-4 h-4 text-[#D2F34C]" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{lang === "ar" ? step.labelAr : step.labelEn}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{lang === "ar" ? step.descAr : step.descEn}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#D2F34C] opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === "ar" ? "Commencer" : "Start"} <ArrowUpRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sofara Pro upsell — basic members only */}
      {!subLoading && !isPro && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl bg-[#D2F34C] p-6 sm:p-7 mb-5 shadow-lg"
        >
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 mb-3">
                <Crown className="w-3.5 h-3.5 text-black" />
                <span className="text-black text-[11px] font-bold uppercase tracking-wider">Sofara Pro</span>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-black tracking-tight mb-2">
                {lang === "ar" ? "Qualifiez vos leads, présentez les projets, gagnez plus." : "Qualify your leads, present projects, earn more."}
              </h2>
              <p className="text-sm text-black/70 mb-4 max-w-xl">
                {lang === "ar"
                  ? "CRM Oleadoo, WhatsApp AI, campagnes marketing IA, agent IA et commission majorée. 99 $ / mois, ou 990 $ / an avec 2 mois offerts."
                  : "Oleadoo CRM, WhatsApp AI, AI marketing campaigns, AI agent and boosted commission. $99 / month, or $990 / year with 2 months free."}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {PRO_BENEFITS.slice(0, 6).map((b) => (
                  <span key={b.titleEn} className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/80">
                    <b.icon className="w-3.5 h-3.5" /> {lang === "ar" ? b.titleAr : b.titleEn}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/pro")}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[hsl(0,0%,7%)] text-white text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {lang === "ar" ? "Découvrir Sofara Pro" : "Discover Sofara Pro"} <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpis.map((kpi, i) => {
          const isLime = kpi.variant === "lime";
          return (
            <motion.button
              key={i}
              onClick={() => navigate(kpi.path)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className={`relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 ${
                isLime
                  ? "bg-[#D2F34C]"
                  : "bg-[hsl(0,0%,7%)]"
              }`}
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-2.5 rounded-2xl ${isLime ? "bg-black/10" : "bg-white/10"}`}>
                    <kpi.icon className={`w-5 h-5 ${isLime ? "text-black" : "text-white"}`} />
                  </div>
                  <TrendingUp className={`w-4 h-4 ${isLime ? "text-black/30" : "text-white/30"}`} />
                </div>
                <p className={`text-4xl font-display font-black tracking-tight leading-none mb-1 ${isLime ? "text-black" : "text-white"}`}>
                  {kpi.value}
                </p>
                <p className={`text-sm font-semibold mt-1 ${isLime ? "text-black/80" : "text-white/80"}`}>{lang === "ar" ? kpi.labelAr : kpi.labelEn}</p>
                <p className={`text-xs mt-0.5 ${isLime ? "text-black/50" : "text-white/50"}`}>{lang === "ar" ? kpi.subAr : kpi.subEn}</p>
              </div>
            </motion.button>
          );
        })}
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
            className="dash-card rounded-3xl p-5 flex items-center gap-4 text-left hover:shadow-lg transition-all group cursor-pointer"
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
        <div className="lg:col-span-2 dash-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-display font-bold dash-text flex items-center gap-2.5">
              <div className="p-2 rounded-xl dash-icon-b shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              {lang === "ar" ? "العمولات" : "Commissions"}
            </h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-xs font-semibold text-[hsl(var(--dash-accent))] hover:opacity-70 flex items-center gap-1 transition-colors">
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
        <div className="lg:col-span-3 dash-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-display font-bold dash-text flex items-center gap-2.5">
              <div className="p-2 rounded-xl dash-icon-a shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              {lang === "ar" ? "العملاء الأخيرون" : "Recent Leads"}
            </h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-xs font-semibold text-[hsl(var(--dash-accent))] hover:opacity-70 flex items-center gap-1 transition-colors">
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
                    <div className="w-9 h-9 rounded-full bg-[hsl(0,0%,7%)] flex items-center justify-center text-[11px] font-bold text-[#D2F34C] shadow-sm">
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
          { labelAr: "إضافة عميل", labelEn: "Submit a Lead", icon: Users, path: "/dashboard/import-leads", iconClass: "dash-icon-a" },
          { labelAr: "العملاء", labelEn: "My Leads", icon: Zap, path: "/dashboard/pipeline", iconClass: "dash-icon-d" },
          { labelAr: "العمولات", labelEn: "Commissions", icon: Trophy, path: "/dashboard/commissions", iconClass: "dash-icon-b" },
          { labelAr: "المدفوعات", labelEn: "Payments", icon: DollarSign, path: "/dashboard/payments", iconClass: "dash-icon-c" },
        ].map((action, i) => (
          <motion.button key={i} onClick={() => navigate(action.path)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
            className="dash-card rounded-2xl p-4 flex items-center gap-3 text-left group cursor-pointer hover:shadow-lg transition-all">
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
