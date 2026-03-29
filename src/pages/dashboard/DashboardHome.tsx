import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Users, ArrowUpRight, TrendingUp, Send, Eye, Sparkles, HelpCircle,
  Megaphone, Zap, ArrowRight, ChevronRight
} from "lucide-react";
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
  const inProgress = leads.filter((l: any) => ["contact", "visite", "negociation"].includes(l.stage)).length;
  const newLeads = leads.filter((l: any) => l.stage === "nouveau" || !l.stage).length;
  const accepted = leads.filter((l: any) => ["offre_acceptee", "booking", "dp_paye"].includes(l.stage)).length;

  const estComm = commissions.filter((c: any) => c.status === "estimated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const valComm = commissions.filter((c: any) => c.status === "validated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const paidComm = commissions.filter((c: any) => c.status === "paid").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const totalComm = estComm + valComm + paidComm;
  const convRate = totalLeads > 0 ? ((accepted / totalLeads) * 100).toFixed(1) : "0";
  const targetProgress = Math.min((totalComm / 200000) * 100, 100);

  const userName = user?.email?.split("@")[0] || "Ambassador";
  const recentLeads = leads.slice(0, 4);

  const stageLabel = (stage: string) => {
    if (stage === "qualifie") return { text: "QUALIFIED", cls: "dash-pill-qualified" };
    if (["contact", "visite", "negociation"].includes(stage)) return { text: "IN PROGRESS", cls: "dash-pill-progress" };
    if (["offre_acceptee", "booking", "dp_paye"].includes(stage)) return { text: "CLOSED", cls: "dash-pill-closed" };
    return { text: "NEW", cls: "dash-pill-new" };
  };

  // Recent activity from leads + commissions
  const recentActivity = [
    ...leads.slice(0, 3).map((l: any) => ({
      type: "lead" as const,
      text: lang === "ar"
        ? `عميل جديد — ${l.first_name} ${l.last_name?.charAt(0)}.`
        : `Lead submitted — ${l.first_name} ${l.last_name?.charAt(0)}.`,
      time: new Date(l.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      date: l.created_at,
    })),
    ...commissions.slice(0, 2).map((c: any) => ({
      type: "commission" as const,
      text: lang === "ar"
        ? `عمولة — ${c.deal_name}`
        : `Commission — ${c.deal_name}`,
      amount: c.amount,
      time: new Date(c.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      date: c.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] lg:text-[32px] font-bold tracking-[-0.02em] text-[hsl(var(--dash-fg))]">
          {lang === "ar" ? `مرحبا، ${userName}` : `Hello, ${userName}`}
        </h1>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ===== COLUMN 1: Dark Commission Card ===== */}
        <div className="lg:col-span-3">
          <div className="dash-card-dark p-5 h-full flex flex-col">
            {/* Total commissions */}
            <p className="text-sm text-[hsl(var(--dash-dark-muted))] mb-1">
              {lang === "ar" ? "إجمالي العمولات" : "Total commissions"}
            </p>
            <p className="text-[32px] font-bold text-white tracking-[-0.02em] leading-none mb-5">
              AED {totalComm.toLocaleString()}<span className="text-sm font-normal text-[hsl(var(--dash-dark-muted))]">.00</span>
            </p>

            {/* Quick action circles */}
            <div className="flex gap-3 mb-5">
              {[
                { icon: Send, label: lang === "ar" ? "إرسال" : "Submit", path: "/dashboard/pipeline" },
                { icon: Eye, label: lang === "ar" ? "عرض" : "View", path: "/dashboard/pipeline" },
                { icon: Sparkles, label: lang === "ar" ? "ذكاء" : "AI", path: "/dashboard/ai-hub" },
                { icon: HelpCircle, label: lang === "ar" ? "دعم" : "Help", path: "/dashboard/community" },
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-1.5 group">
                  <div className="dash-dark-action group-hover:bg-[hsl(var(--dash-dark-hover))]">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-[hsl(var(--dash-dark-muted))]">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Monthly target progress */}
            <p className="text-xs text-[hsl(var(--dash-dark-muted))] mb-2 font-medium">
              {lang === "ar" ? "نشاط هذا الشهر" : "Activity this month"}
            </p>
            <div className="dash-progress-track mb-2">
              <div className="h-full rounded-full flex overflow-hidden" style={{ width: `${Math.max(targetProgress, 5)}%` }}>
                <div className="flex-1 dash-progress-fill" />
                <div className="w-3 dash-progress-hatched" />
              </div>
            </div>
            <p className="text-xs text-[hsl(var(--dash-dark-muted))] mb-4">
              AED {totalComm.toLocaleString()} · {lang === "ar" ? "الهدف: AED 200,000" : "Target: AED 200,000"}
            </p>

            {/* Mini stat cards */}
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between bg-[hsl(var(--dash-dark-secondary))] rounded-xl px-3 py-2.5">
                <span className="text-xs text-[hsl(var(--dash-dark-muted))]">{lang === "ar" ? "عملاء مرسلون" : "Leads submitted"}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{totalLeads}</span>
                  <TrendingUp className="w-3 h-3 text-[hsl(var(--dash-success))]" />
                </div>
              </div>
              <div className="flex items-center justify-between bg-[hsl(var(--dash-dark-secondary))] rounded-xl px-3 py-2.5">
                <span className="text-xs text-[hsl(var(--dash-dark-muted))]">{lang === "ar" ? "معدل التحويل" : "Conversion rate"}</span>
                <span className="text-sm font-bold text-white">{convRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== COLUMN 2: Active Leads + Chart ===== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active leads card */}
          <div className="dash-card p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[hsl(var(--dash-fg))]">
                {lang === "ar" ? "العملاء النشطون" : "Active leads"}
              </h2>
              <button onClick={() => navigate("/dashboard/pipeline")} className="dash-arrow-circle">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {recentLeads.length === 0 ? (
              <div className="text-center py-10 text-[hsl(var(--dash-muted-fg))] text-sm">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                {lang === "ar" ? "لا يوجد عملاء بعد" : "No leads yet. Submit your first lead!"}
              </div>
            ) : (
              <div className="space-y-0">
                {recentLeads.map((lead: any, i: number) => {
                  const status = stageLabel(lead.stage || "nouveau");
                  return (
                    <div key={lead.id} className={`flex items-center justify-between py-3 ${i < recentLeads.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[11px] font-bold text-[hsl(var(--dash-fg))]">
                          {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                          <p className="text-[11px] text-[hsl(var(--dash-muted-fg))]">{lead.source || "Direct"}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${status.cls}`}>{status.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance card */}
          <div className="dash-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[hsl(var(--dash-fg))]">
                {lang === "ar" ? "أداؤك هذا العام" : "Your performance this year"}
              </h2>
              <button onClick={() => navigate("/dashboard/commissions")} className="dash-arrow-circle">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Simple stat row instead of chart for now */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: lang === "ar" ? "صفقات" : "Deals", value: accepted, color: "bg-[hsl(var(--dash-accent))]" },
                { label: lang === "ar" ? "عمولات" : "Commissions", value: `${(totalComm / 1000).toFixed(0)}K`, color: "bg-[hsl(var(--dash-dark))]" },
                { label: lang === "ar" ? "عملاء" : "Leads", value: totalLeads, color: "bg-[hsl(var(--dash-muted))]" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`h-16 ${stat.color} rounded-xl flex items-center justify-center mb-2`}>
                    <span className={`text-xl font-bold ${i === 0 ? "text-[hsl(var(--dash-accent-fg))]" : i === 1 ? "text-white" : "text-[hsl(var(--dash-fg))]"}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))] font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mt-4">
              {[
                lang === "ar" ? "صفقات" : "Deals",
                lang === "ar" ? "عمولات" : "Commissions",
                lang === "ar" ? "عملاء" : "Leads",
              ].map((tab, i) => (
                <span key={i} className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                  i === 0
                    ? "bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]"
                    : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-border))]"
                }`}>
                  {tab}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== COLUMN 3: Promo + Activity ===== */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Promo cards row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Referral program */}
            <button onClick={() => navigate("/dashboard/referrals")} className="dash-card-accent p-4 text-left group hover:brightness-95 transition-all">
              <Megaphone className="w-6 h-6 mb-2 text-[hsl(var(--dash-accent-fg))]" />
              <p className="text-sm font-bold text-[hsl(var(--dash-accent-fg))]">
                {lang === "ar" ? "برنامج الإحالة" : "Referral program"}
              </p>
              <p className="text-[11px] text-[hsl(var(--dash-accent-fg))] opacity-70 mt-0.5">
                {lang === "ar" ? "ادع واكسب" : "Invite & earn"}
              </p>
            </button>

            {/* Commission boost */}
            <button onClick={() => navigate("/dashboard/bonus")} className="dash-card-accent p-4 text-left group hover:brightness-95 transition-all">
              <Zap className="w-6 h-6 mb-2 text-[hsl(var(--dash-accent-fg))]" />
              <p className="text-sm font-bold text-[hsl(var(--dash-accent-fg))]">
                {lang === "ar" ? "زيادة العمولة" : "Commission boost"}
              </p>
              <p className="text-[11px] text-[hsl(var(--dash-accent-fg))] opacity-70 mt-0.5">20%</p>
            </button>
          </div>

          {/* PRO upgrade card */}
          <button onClick={() => navigate("/dashboard/ai-hub")} className="dash-card-dark p-4 text-left flex items-center gap-3 group hover:bg-[hsl(var(--dash-dark-hover))] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--dash-accent))] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[hsl(var(--dash-accent-fg))]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">{lang === "ar" ? "نسخة PRO" : "PRO version"}</p>
              <p className="text-[11px] text-[hsl(var(--dash-dark-muted))]">{lang === "ar" ? "أدوات ذكاء متقدمة" : "Advanced AI tools"}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[hsl(var(--dash-dark-muted))] group-hover:text-white transition-colors" />
          </button>

          {/* Recent Activity */}
          <div className="dash-card p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[hsl(var(--dash-fg))]">
                {lang === "ar" ? "النشاط الأخير" : "Recent Activity"}
              </h2>
              <button className="dash-arrow-circle">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <p className="text-sm text-[hsl(var(--dash-muted-fg))] text-center py-6">
                {lang === "ar" ? "لا يوجد نشاط بعد" : "No activity yet"}
              </p>
            ) : (
              <div className="space-y-0">
                {recentActivity.map((event, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 ${i < recentActivity.length - 1 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${event.type === "commission" ? "bg-[hsl(var(--dash-success))]" : "bg-[hsl(var(--dash-accent))]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[hsl(var(--dash-fg))]">{event.text}</p>
                      {event.type === "commission" && (
                        <p className="text-sm font-semibold text-[hsl(var(--dash-success))]">+AED {Number(event.amount).toLocaleString()}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0">{event.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
