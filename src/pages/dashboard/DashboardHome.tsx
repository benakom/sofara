import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Phone, ArrowUpRight, TrendingUp } from "lucide-react";

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
  const estComm = commissions.filter((c: any) => c.status === "estimated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const valComm = commissions.filter((c: any) => c.status === "validated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const paidComm = commissions.filter((c: any) => c.status === "paid").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const totalComm = estComm + valComm + paidComm;
  const convRate = totalLeads > 0 ? Math.round((accepted / totalLeads) * 100) : 0;
  const userName = user?.email?.split("@")[0] || "User";

  const months = ["may", "jun", "jul", "aug", "sep", "oct"];
  const barHeights = [40, 55, 80, 60, 45, 70];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto">

      {/* ===== HERO SECTION — greeting + icons ===== */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--dash-dark))] flex items-center justify-center text-sm font-bold text-[hsl(var(--dash-lime))]">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          {/* Desktop lang toggle */}
          <div className="hidden lg:flex items-center gap-1">
            {[{ code: "en" as const, flag: "🇬🇧" }, { code: "ar" as const, flag: "🇦🇪" }].map((l) => (
              <button key={l.code} onClick={() => {
                const { setLang } = useLanguage();
              }}
                className="px-2 py-1 rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity">
                {l.flag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-border))] transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-border))] transition-colors">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Greeting text */}
      <div className="mb-6 mt-4">
        <h1 className="text-[28px] sm:text-[34px] font-display font-extrabold text-[hsl(var(--dash-fg))] leading-tight tracking-tight">
          {lang === "ar" ? `مرحباً ${userName}،` : `Hi ${userName},`}{" "}
          <span className="italic font-light text-[hsl(var(--dash-muted-fg))]">
            {lang === "ar" ? "إليك ما يحدث" : "here's"}
          </span>
          <br />
          {lang === "ar" ? "في حسابك." : "what's happening\nin your account."}
        </h1>
      </div>

      {/* ===== MINI BAR CHART ===== */}
      <div className="flex items-end gap-2 mb-2 h-16">
        {barHeights.map((h, i) => (
          <motion.div key={i}
            initial={{ height: 0 }} animate={{ height: `${h}%` }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: "easeOut" }}
            className={`flex-1 rounded-md ${i === months.length - 1 ? "bg-[hsl(var(--dash-lime))]" : "bg-[hsl(var(--dash-dark)/.15)]"}`}
            style={{ maxHeight: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {months.map((m, i) => (
          <span key={m} className={`flex-1 text-center text-[10px] font-medium ${
            i === months.length - 1
              ? "bg-[hsl(var(--dash-dark))] text-white rounded-full py-0.5"
              : "text-[hsl(var(--dash-muted-fg))]"
          }`}>{m}</span>
        ))}
      </div>

      {/* ===== REVENUE LINE ===== */}
      <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-1">
        {lang === "ar" ? "هذا الشهر حسابك حقق" : "This month your account has earned"}
      </p>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[32px] sm:text-[38px] font-display font-black text-[hsl(var(--dash-fg))] tracking-tight leading-none">
          AED {totalComm.toLocaleString() || "0"}
        </span>
        {totalComm > 0 && (
          <span className="text-xs text-[hsl(var(--dash-muted-fg))]">
            {lang === "ar" ? "أكثر من الشهر الماضي" : "more than last month"}
          </span>
        )}
      </div>

      {/* ===== SALES TARGETS — lime progress bar ===== */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-3">
          {lang === "ar" ? "أهداف المبيعات" : "Your Sales Targets"}
        </h3>
        <div className="dash-card rounded-2xl p-5">
          {/* Progress */}
          <div className="mb-3">
            <div className="dash-progress-track h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(convRate, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="dash-progress-lime h-full relative"
              >
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[hsl(var(--dash-lime))] border-4 border-white shadow-md" />
              </motion.div>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-display font-black text-[hsl(var(--dash-fg))]">
              AED {(valComm + paidComm).toLocaleString() || "0"}
            </span>
            <span className="text-xs text-[hsl(var(--dash-muted-fg))]">
              {convRate}% {lang === "ar" ? "من الهدف" : "of target"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== TWO DARK ACTION CARDS ===== */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button onClick={() => navigate("/dashboard/pipeline")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="dash-card-dark rounded-2xl p-5 text-start group">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-[hsl(var(--dash-dark-fg))]">
              {lang === "ar" ? "تحليل العملاء" : "Lead Analysis"}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[hsl(var(--dash-lime))] group-hover:text-[hsl(var(--dash-lime-fg))] transition-colors">
              <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[hsl(var(--dash-lime-fg))]" />
            </div>
          </div>
          <span className="text-3xl font-display font-black text-[hsl(var(--dash-lime))]">{convRate}%</span>
        </motion.button>

        <motion.button onClick={() => navigate("/dashboard/commissions")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="dash-card-dark rounded-2xl p-5 text-start group">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-[hsl(var(--dash-dark-fg))]">
              {lang === "ar" ? "العمولات" : "Commissions"}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[hsl(var(--dash-lime))] transition-colors">
              <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[hsl(var(--dash-lime-fg))]" />
            </div>
          </div>
          <span className="text-2xl font-display font-black text-white">{commissions.length}<sup className="text-xs font-normal text-white/50 ml-0.5">deals</sup></span>
        </motion.button>
      </div>

      {/* ===== LIME CARD — Gross Profit / Estimated ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="dash-card-lime rounded-2xl p-6 mb-4 cursor-pointer"
        onClick={() => navigate("/dashboard/commissions")}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[hsl(var(--dash-lime-fg))]">
            {lang === "ar" ? "العمولات المقدرة" : "Estimated Commissions"}
          </h3>
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-dark))] flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-[hsl(var(--dash-lime))]" />
          </div>
        </div>
        <p className="text-[32px] font-display font-black text-[hsl(var(--dash-lime-fg))] tracking-tight leading-none mb-2">
          AED {estComm.toLocaleString() || "0"}
        </p>
        <p className="text-xs text-[hsl(var(--dash-lime-fg)/.6)]">
          {lang === "ar" ? "في انتظار التأكيد" : "Pending validation"}
        </p>
      </motion.div>

      {/* ===== DARK CARD — Net / Validated ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="dash-card-dark rounded-2xl p-6 mb-6 cursor-pointer"
        onClick={() => navigate("/dashboard/payments")}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[hsl(var(--dash-dark-fg))]">
            {lang === "ar" ? "العمولات المدفوعة" : "Paid Commissions"}
          </h3>
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
        <p className="text-[32px] font-display font-black text-white tracking-tight leading-none mb-2">
          AED {paidComm.toLocaleString() || "0"}
        </p>
        <p className="text-xs text-white/50">
          {lang === "ar" ? "تم الدفع بنجاح" : `${commissions.filter((c: any) => c.status === "paid").length} payments completed`}
        </p>
      </motion.div>

      {/* ===== RECENT LEADS ===== */}
      {leads.length > 0 && (
        <div className="dash-card rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[hsl(var(--dash-fg))]">
              {lang === "ar" ? "العملاء الأخيرون" : "Recent Leads"}
            </h3>
            <button onClick={() => navigate("/dashboard/pipeline")}
              className="text-xs font-semibold text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors">
              {lang === "ar" ? "عرض الكل" : "View all"} →
            </button>
          </div>
          <div className="space-y-0">
            {leads.slice(0, 4).map((lead: any, i: number) => (
              <div key={lead.id} className={`flex items-center justify-between py-3 ${i < 3 ? "border-b border-[hsl(var(--dash-border))]" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[11px] font-bold text-[hsl(var(--dash-fg))]">
                    {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                    <p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{lead.source}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  lead.stage === "qualifie" ? "bg-[hsl(var(--dash-lime))] text-[hsl(var(--dash-lime-fg))]"
                  : lead.stage === "booking" || lead.stage === "dp_paye" ? "bg-[hsl(var(--dash-dark))] text-white"
                  : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))]"
                }`}>{lead.stage?.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardHome;
