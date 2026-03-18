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
    { labelFr: "Leads", labelEn: "Leads", value: totalLeads, icon: Users, color: "hsl(var(--blue))" },
    { labelFr: "Qualifiés", labelEn: "Qualified", value: qualified, icon: GitBranch, color: "hsl(var(--accent))" },
    { labelFr: "Acceptés", labelEn: "Accepted", value: accepted, icon: CheckCircle, color: "hsl(var(--green))" },
    { labelFr: "Bookings", labelEn: "Bookings", value: booked, icon: Target, color: "hsl(var(--amber))" },
    { labelFr: "Taux conv.", labelEn: "Conv. rate", value: `${convRate}%`, icon: TrendingUp, color: "hsl(var(--red))" },
    { labelFr: "Commissions", labelEn: "Commissions", value: `${totalComm.toLocaleString()}`, icon: DollarSign, color: "hsl(var(--green))", prefix: "AED " },
  ];

  const recentLeads = leads.slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-[15px] font-semibold text-foreground">
          👋 {lang === "fr" ? "Bienvenue" : "Welcome"}, {user?.email?.split("@")[0]}
        </h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {lang === "fr" ? "Voici le résumé de votre activité." : "Here's your activity summary."}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-stripe bg-surface border border-border rounded-[10px] p-4 shadow-card" style={{ "--stripe-color": kpi.color } as any}>
            <div className="label-uppercase mb-2">{lang === "fr" ? kpi.labelFr : kpi.labelEn}</div>
            <p className="text-[22px] font-semibold text-foreground">{kpi.prefix || ""}{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Commission breakdown */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[10px] p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> Commissions</h2>
            <button onClick={() => navigate("/dashboard/commissions")} className="text-[11px] text-accent hover:underline flex items-center gap-0.5 font-medium">
              {lang === "fr" ? "Détails" : "Details"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: lang === "fr" ? "Estimées" : "Estimated", value: estComm, color: "bg-accent" },
              { label: lang === "fr" ? "Validées" : "Validated", value: valComm, color: "bg-[hsl(var(--blue))]" },
              { label: lang === "fr" ? "Payées" : "Paid", value: paidComm, color: "bg-[hsl(var(--green))]" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">AED {item.value.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${totalComm > 0 ? (item.value / totalComm) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Total</span>
            <span className="text-[15px] font-semibold text-foreground">AED {totalComm.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-[10px] p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-foreground">{lang === "fr" ? "Leads récents" : "Recent Leads"}</h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-[11px] text-accent hover:underline flex items-center gap-0.5 font-medium">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-[13px]">
              {lang === "fr" ? "Aucun lead. Importez vos premiers leads !" : "No leads. Import your first leads!"}
            </div>
          ) : (
            <div className="space-y-0">
              {recentLeads.map((lead: any, idx: number) => (
                <div key={lead.id} className={`flex items-center justify-between py-2.5 ${idx < recentLeads.length - 1 ? "border-b border-border-subtle" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] rounded-full bg-accent-pale flex items-center justify-center text-[10px] font-semibold text-accent border border-accent-border">
                      {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{lead.first_name} {lead.last_name?.charAt(0)}.</p>
                      <p className="text-[10.5px] text-muted-foreground">{lead.source}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-muted text-muted-foreground border border-border capitalize">{lead.stage?.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { labelFr: "Ajouter un lead", labelEn: "Add a lead", icon: Users, path: "/dashboard/pipeline" },
          { labelFr: "Academy", labelEn: "Academy", icon: Zap, path: "/dashboard/academy" },
          { labelFr: "SofarAI", labelEn: "SofarAI", icon: Trophy, path: "/dashboard/sofar-ai" },
          { labelFr: "Bonus", labelEn: "Bonus", icon: DollarSign, path: "/dashboard/bonus" },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)}
            className="bg-surface border border-border rounded-[10px] p-3 flex items-center gap-3 hover:border-accent transition-colors text-left group shadow-card">
            <div className="p-2 rounded-lg bg-muted">
              <action.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[12.5px] font-medium text-foreground group-hover:text-accent transition-colors">{lang === "fr" ? action.labelFr : action.labelEn}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
