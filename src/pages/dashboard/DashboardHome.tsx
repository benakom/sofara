import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, DollarSign, Trophy, ArrowUpRight, Target, BarChart3, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardStatistics from "@/components/dashboard/DashboardStatistics";
import DashboardRecentLeads from "@/components/dashboard/DashboardRecentLeads";

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

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {/* Page title — Influency style */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-display font-extrabold text-[hsl(var(--dash-fg))] tracking-tight">
            {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-0.5">
            {lang === "ar" ? "نظرة عامة على نشاطك" : "See all your activity information here"}
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))] text-xs font-bold">
          {totalLeads} {lang === "ar" ? "جديد" : "New"}
        </span>
      </div>

      {/* KPI Cards */}
      <DashboardKPICards
        totalLeads={totalLeads}
        convRate={convRate}
        qualified={qualified}
        totalComm={totalComm}
        lang={lang}
      />

      {/* Statistics + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-3">
          <DashboardStatistics estComm={estComm} valComm={valComm} paidComm={paidComm} totalComm={totalComm} lang={lang} />
        </div>
        <div className="lg:col-span-2">
          <DashboardRecentLeads leads={leads.slice(0, 5)} lang={lang} />
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
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
            className="dash-card rounded-2xl p-4 flex items-center gap-3 text-start group cursor-pointer hover:border-[hsl(var(--dash-accent)/.3)] transition-all">
            <div className="p-2.5 rounded-xl bg-[hsl(var(--dash-muted))]">
              <action.icon className="w-4 h-4 text-[hsl(var(--dash-muted-fg))] group-hover:text-[hsl(var(--dash-accent))] transition-colors" />
            </div>
            <span className="text-sm font-semibold text-[hsl(var(--dash-fg))] group-hover:text-[hsl(var(--dash-accent))] transition-colors">
              {lang === "ar" ? action.labelAr : action.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
