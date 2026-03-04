import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, GitBranch, CheckCircle, DollarSign, Trophy, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const pipelineStages = [
  { key: "nouveau", labelFr: "Nouveau", labelEn: "New", color: "bg-gray-400" },
  { key: "prequalifie", labelFr: "Préqualifié", labelEn: "Prequalified", color: "bg-green-500" },
  { key: "qualifie", labelFr: "Qualifié", labelEn: "Qualified", color: "bg-gray-700" },
  { key: "injoignable", labelFr: "Injoignable", labelEn: "Unreachable", color: "bg-red-500" },
  { key: "offre_envoyee", labelFr: "Offre envoyée", labelEn: "Offer Sent", color: "bg-purple-500" },
  { key: "offre_acceptee", labelFr: "Offre acceptée", labelEn: "Offer Accepted", color: "bg-green-500" },
  { key: "booking", labelFr: "Booking payé", labelEn: "Booking Paid", color: "bg-green-600" },
  { key: "dp_paye", labelFr: "DP payé", labelEn: "DP Paid", color: "bg-green-700" },
];

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

  const estCommissions = commissions.filter((c: any) => c.status === "estimated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const validatedCommissions = commissions.filter((c: any) => c.status === "validated").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const paidCommissions = commissions.filter((c: any) => c.status === "paid").reduce((a: number, c: any) => a + Number(c.amount), 0);
  const totalCommissions = estCommissions + validatedCommissions + paidCommissions;
  const paidPct = totalCommissions > 0 ? Math.round((paidCommissions / totalCommissions) * 100) : 0;

  const stageCounts = pipelineStages.map(s => ({
    ...s,
    count: leads.filter((l: any) => l.stage === s.key).length,
  }));
  const pct = (count: number) => totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;

  const stats = [
    { labelFr: "Leads total", labelEn: "Total Leads", value: String(totalLeads), icon: Users, color: "text-gray-500" },
    { labelFr: "Qualifiés", labelEn: "Qualified", value: String(qualified), icon: GitBranch, color: "text-primary" },
    { labelFr: "Offres acceptées", labelEn: "Accepted Offers", value: String(accepted), icon: CheckCircle, color: "text-green-500" },
    { labelFr: "Booking / DP payé", labelEn: "Booking / DP paid", value: String(booked), icon: DollarSign, color: "text-green-600" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Welcome banner */}
      <div className="dash-card rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold dash-text flex items-center gap-2">
            👋 {lang === "fr" ? "Tableau de bord" : "Dashboard"}
          </h1>
          <p className="dash-muted-text text-sm mt-1">
            {lang === "fr" ? "Bienvenue ! Voici le résumé de votre activité" : "Welcome! Here's your activity summary"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 dash-card rounded-full px-4 py-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-semibold dash-text text-sm">AED 0</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="dash-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm dash-muted-text">{lang === "fr" ? s.labelFr : s.labelEn}</span>
              <div className={`p-2 rounded-xl bg-gray-100 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            </div>
            <p className="text-3xl font-display font-bold dash-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline + Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 dash-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-semibold dash-text">Pipeline snapshot</h2>
            <button onClick={() => navigate("/dashboard/pipeline")} className="text-sm dash-muted-text hover:text-primary flex items-center gap-1 transition-colors">
              {lang === "fr" ? "Voir tout" : "View all"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stageCounts.map((stage, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm dash-muted-text w-28 shrink-0">{lang === "fr" ? stage.labelFr : stage.labelEn}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex items-center">
                  {stage.count > 0 && (
                    <div className={`h-full ${stage.color} rounded-full flex items-center justify-center min-w-[28px]`} style={{ width: `${Math.max(pct(stage.count), 8)}%` }}>
                      <span className="text-xs font-bold text-white px-2">{stage.count}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs dash-muted-text w-8 text-right">{pct(stage.count)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="dash-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold dash-text flex items-center gap-2 mb-4"><DollarSign className="w-4 h-4" /> Commissions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="dash-muted-text">{lang === "fr" ? "Estimées" : "Estimated"}</span><span className="dash-text font-medium">AED {estCommissions.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="dash-muted-text">{lang === "fr" ? "Validées" : "Validated"}</span><span className="text-green-500 font-medium">AED {validatedCommissions.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="dash-muted-text">{lang === "fr" ? "Payées" : "Paid"}</span><span className="text-green-600 font-bold">AED {paidCommissions.toLocaleString()}</span></div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
            </div>
            <p className="text-xs dash-muted-text mt-1.5">{paidPct}% collected</p>
          </div>
          <div className="dash-card rounded-2xl p-5" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
            <h3 className="text-sm font-semibold dash-text flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-primary" /> Bonus Performance</h3>
            <p className="text-2xl font-display font-bold dash-text">AED 0</p>
            <p className="text-xs dash-muted-text mt-1">Total gagné: AED 0</p>
            <p className="text-xs dash-muted-text mt-0.5">0 deals • 1 coin = 1 AED</p>
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="dash-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold dash-text">{lang === "fr" ? "Leads récents" : "Recent Leads"}</h2>
          <button onClick={() => navigate("/dashboard/import-leads")} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            + {lang === "fr" ? "Nouveau lead" : "New lead"}
          </button>
        </div>
        {leads.length === 0 ? (
          <div className="text-center py-10 dash-muted-text text-sm">
            {lang === "fr" ? "Aucun lead pour le moment. Importez vos premiers leads !" : "No leads yet. Import your first leads!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dash-border-color">
                  <th className="text-left text-xs font-semibold dash-muted-text uppercase px-3 py-3">Lead</th>
                  <th className="text-left text-xs font-semibold dash-muted-text uppercase px-3 py-3">Source</th>
                  <th className="text-left text-xs font-semibold dash-muted-text uppercase px-3 py-3">Stage</th>
                  <th className="text-left text-xs font-semibold dash-muted-text uppercase px-3 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead: any) => (
                  <tr key={lead.id} className="border-b dash-border-color last:border-0">
                    <td className="px-3 py-3 text-sm dash-text font-medium">{lead.first_name} {lead.last_name?.charAt(0)}.</td>
                    <td className="px-3 py-3 text-sm dash-muted-text">{lead.source}</td>
                    <td className="px-3 py-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-100 dash-text capitalize">{lead.stage?.replace(/_/g, " ")}</span></td>
                    <td className="px-3 py-3 text-sm dash-muted-text">{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHome;
