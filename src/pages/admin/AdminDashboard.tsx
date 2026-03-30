import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Users, GitBranch, DollarSign, CreditCard, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalAmbassadors: number;
  approvedAmbassadors: number;
  pendingAmbassadors: number;
  totalLeads: number;
  leadsByStage: Record<string, number>;
  estimatedRevenue: number;
  confirmedRevenue: number;
  paidRevenue: number;
  pendingPayments: number;
  totalPaymentsAmount: number;
}

interface RecentActivity {
  type: "lead" | "ambassador" | "commission";
  label: string;
  detail: string;
  date: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalAmbassadors: 0, approvedAmbassadors: 0, pendingAmbassadors: 0,
    totalLeads: 0, leadsByStage: {}, estimatedRevenue: 0,
    confirmedRevenue: 0, paidRevenue: 0, pendingPayments: 0, totalPaymentsAmount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topPerformers, setTopPerformers] = useState<{ name: string; leads: number; revenue: number }[]>([]);
  const [pendingActions, setPendingActions] = useState<{ type: string; label: string; count: number; path: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [profilesRes, leadsRes, commissionsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, status, created_at, country").order("created_at", { ascending: false }),
        supabase.from("leads").select("id, user_id, first_name, last_name, stage, created_at").order("created_at", { ascending: false }),
        supabase.from("commissions").select("amount, status, user_id, deal_name, created_at").order("created_at", { ascending: false }),
        supabase.from("payments").select("amount, status").order("created_at", { ascending: false }),
      ]);

      const profiles = profilesRes.data ?? [];
      const leads = leadsRes.data ?? [];
      const commissions = commissionsRes.data ?? [];
      const payments = paymentsRes.data ?? [];

      // Stage breakdown
      const leadsByStage: Record<string, number> = {};
      leads.forEach(l => { leadsByStage[l.stage ?? "nouveau"] = (leadsByStage[l.stage ?? "nouveau"] || 0) + 1; });

      const estimated = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
      const confirmed = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
      const paid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
      const pendingPay = payments.filter(p => p.status === "pending");
      const pendingPayAmount = pendingPay.reduce((s, p) => s + Number(p.amount), 0);

      setStats({
        totalAmbassadors: profiles.length,
        approvedAmbassadors: profiles.filter(p => p.status === "approved").length,
        pendingAmbassadors: profiles.filter(p => p.status === "pending" || p.status === "onboarding").length,
        totalLeads: leads.length,
        leadsByStage,
        estimatedRevenue: estimated,
        confirmedRevenue: confirmed,
        paidRevenue: paid,
        pendingPayments: pendingPay.length,
        totalPaymentsAmount: pendingPayAmount,
      });

      // Pending actions
      const actions = [];
      const pendingAmb = profiles.filter(p => p.status === "pending" || p.status === "onboarding").length;
      if (pendingAmb > 0) actions.push({ type: "ambassador", label: "Ambassadeurs à valider", count: pendingAmb, path: "/admin/ambassadors" });
      const estComm = commissions.filter(c => c.status === "estimated").length;
      if (estComm > 0) actions.push({ type: "commission", label: "Commissions à confirmer", count: estComm, path: "/admin/commissions" });
      if (pendingPay.length > 0) actions.push({ type: "payment", label: "Paiements en attente", count: pendingPay.length, path: "/admin/payments" });
      setPendingActions(actions);

      // Recent activities (merge & sort)
      const activities: RecentActivity[] = [];
      profiles.slice(0, 3).forEach(p => activities.push({
        type: "ambassador", label: p.full_name || "Nouveau", detail: `Inscrit · ${p.country || "—"}`, date: p.created_at
      }));
      leads.slice(0, 3).forEach(l => {
        const amb = profiles.find(p => p.id === l.user_id);
        activities.push({ type: "lead", label: `${l.first_name} ${l.last_name}`, detail: `Lead par ${amb?.full_name || "—"}`, date: l.created_at });
      });
      commissions.slice(0, 2).forEach(c => activities.push({
        type: "commission", label: c.deal_name, detail: `AED ${fmt(c.amount)}`, date: c.created_at
      }));
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 8));

      // Top performers
      const leadsPerUser: Record<string, number> = {};
      leads.forEach(l => { leadsPerUser[l.user_id] = (leadsPerUser[l.user_id] || 0) + 1; });
      const commPerUser: Record<string, number> = {};
      commissions.forEach(c => { commPerUser[c.user_id] = (commPerUser[c.user_id] || 0) + Number(c.amount); });

      const top = Object.entries(leadsPerUser)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([uid, count]) => ({
          name: profiles.find(p => p.id === uid)?.full_name ?? "—",
          leads: count,
          revenue: commPerUser[uid] ?? 0,
        }));
      setTopPerformers(top);

      setLoading(false);
    };
    fetchAll();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const stageLabels: Record<string, string> = {
    nouveau: "Nouveau", contacté: "Contacté", qualifié: "Qualifié",
    négociation: "Négociation", closing: "Closing", perdu: "Perdu",
  };
  const stageColors: Record<string, string> = {
    nouveau: "hsl(var(--primary))", contacté: "hsl(45,90%,55%)", qualifié: "hsl(80,70%,55%)",
    négociation: "hsl(280,70%,60%)", closing: "hsl(160,70%,50%)", perdu: "hsl(var(--destructive))",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalPipeline = stats.estimatedRevenue + stats.confirmedRevenue + stats.paidRevenue;
  const conversionRate = stats.totalLeads > 0 ? Math.round((stats.leadsByStage["closing"] || 0) / stats.totalLeads * 100) : 0;

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">
          Vue d'ensemble de votre business · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Pending actions banner */}
      {pendingActions.length > 0 && (
        <div className="bg-[hsl(45,90%,55%/.08)] border border-[hsl(45,90%,55%/.2)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <AlertCircle className="w-4.5 h-4.5 text-[hsl(45,90%,55%)] shrink-0" />
          <span className="text-sm font-medium text-[hsl(45,90%,55%)]">Actions requises :</span>
          {pendingActions.map((a) => (
            <button
              key={a.type}
              onClick={() => navigate(a.path)}
              className="text-xs font-semibold bg-[hsl(45,90%,55%/.12)] text-[hsl(45,90%,55%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(45,90%,55%/.2)] transition-colors flex items-center gap-1.5"
            >
              {a.label}
              <Badge variant="secondary" className="bg-[hsl(45,90%,55%/.2)] text-[hsl(45,90%,55%)] text-[10px] px-1.5 py-0">{a.count}</Badge>
            </button>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Ambassadeurs" value={stats.totalAmbassadors} sub={`${stats.approvedAmbassadors} actifs`} color="hsl(var(--primary))" onClick={() => navigate("/admin/ambassadors")} />
        <KpiCard icon={GitBranch} label="Pipeline Leads" value={stats.totalLeads} sub={`${conversionRate}% closing rate`} color="hsl(80,70%,55%)" onClick={() => navigate("/admin/pipeline")} />
        <KpiCard icon={DollarSign} label="Revenu confirmé" value={`AED ${fmt(stats.confirmedRevenue)}`} sub={`Pipeline: AED ${fmt(totalPipeline)}`} color="hsl(45,90%,55%)" onClick={() => navigate("/admin/commissions")} />
        <KpiCard icon={CreditCard} label="À payer" value={`AED ${fmt(stats.totalPaymentsAmount)}`} sub={`${stats.pendingPayments} en attente`} color="hsl(160,70%,50%)" onClick={() => navigate("/admin/payments")} />
      </div>

      {/* Pipeline funnel + Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pipeline funnel */}
        <div className="lg:col-span-3 bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">Funnel Pipeline</h2>
            <button onClick={() => navigate("/admin/pipeline")} className="text-xs font-semibold text-[hsl(var(--primary))] hover:opacity-70 flex items-center gap-1">
              Voir tout <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {["nouveau", "contacté", "qualifié", "négociation", "closing", "perdu"].map((stage) => {
              const count = stats.leadsByStage[stage] || 0;
              const pct = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-xs text-[hsl(228,10%,55%)] w-24 shrink-0">{stageLabels[stage]}</span>
                  <div className="flex-1 h-7 bg-[hsl(228,18%,14%)] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: stageColors[stage] + "30" }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono font-semibold text-[hsl(228,10%,60%)]">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top performers */}
        <div className="lg:col-span-2 bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Top Ambassadeurs</h2>
            <TrendingUp className="w-4 h-4 text-[hsl(var(--primary)/.5)]" />
          </div>
          <div className="space-y-0">
            {topPerformers.map((a, i) => (
              <div key={i} className={`flex items-center justify-between py-3 ${i < topPerformers.length - 1 ? "border-b border-[hsl(228,18%,14%)]" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? "bg-[hsl(var(--primary)/.15)] text-[hsl(var(--primary))]" : "bg-[hsl(228,18%,14%)] text-[hsl(228,10%,50%)]"
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{a.name}</p>
                    <p className="text-[10px] text-[hsl(228,10%,45%)]">{a.leads} leads</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-[hsl(228,10%,65%)]">AED {fmt(a.revenue)}</span>
              </div>
            ))}
            {topPerformers.length === 0 && (
              <p className="text-sm text-[hsl(228,10%,40%)] text-center py-6">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue breakdown + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue breakdown */}
        <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Revenus</h2>
          <div className="space-y-4">
            <RevenueRow label="Estimé" amount={stats.estimatedRevenue} total={totalPipeline} color="hsl(45,90%,55%)" fmt={fmt} />
            <RevenueRow label="Confirmé" amount={stats.confirmedRevenue} total={totalPipeline} color="hsl(80,70%,55%)" fmt={fmt} />
            <RevenueRow label="Payé" amount={stats.paidRevenue} total={totalPipeline} color="hsl(var(--primary))" fmt={fmt} />
          </div>
          <div className="mt-5 pt-4 border-t border-[hsl(228,18%,14%)] flex items-center justify-between">
            <span className="text-xs font-medium text-[hsl(228,10%,50%)]">Pipeline total</span>
            <span className="text-lg font-bold font-mono text-white">AED {fmt(totalPipeline)}</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Activité récente</h2>
            <Activity className="w-4 h-4 text-[hsl(228,10%,35%)]" />
          </div>
          <div className="space-y-0">
            {recentActivities.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 py-2.5 ${i < recentActivities.length - 1 ? "border-b border-[hsl(228,18%,12%)]" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  a.type === "ambassador" ? "bg-[hsl(var(--primary)/.1)]" :
                  a.type === "lead" ? "bg-[hsl(80,70%,55%,.1)]" :
                  "bg-[hsl(45,90%,55%,.1)]"
                }`}>
                  {a.type === "ambassador" ? <Users className="w-3 h-3 text-[hsl(var(--primary))]" /> :
                   a.type === "lead" ? <GitBranch className="w-3 h-3 text-[hsl(80,70%,55%)]" /> :
                   <DollarSign className="w-3 h-3 text-[hsl(45,90%,55%)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{a.label}</p>
                  <p className="text-[10px] text-[hsl(228,10%,40%)]">{a.detail}</p>
                </div>
                <span className="text-[10px] text-[hsl(228,10%,35%)] shrink-0">
                  {new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-sm text-[hsl(228,10%,40%)] text-center py-6">Aucune activité</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const KpiCard = ({ icon: Icon, label, value, sub, color, onClick }: {
  icon: any; label: string; value: string | number; sub: string; color: string; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-5 text-left hover:border-[hsl(228,18%,22%)] transition-all group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: color + "12" }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-[hsl(228,10%,30%)] group-hover:text-[hsl(228,10%,50%)] transition-colors" />
    </div>
    <p className="text-2xl font-bold text-white font-mono">{value}</p>
    <p className="text-[11px] text-[hsl(228,10%,45%)] mt-1">{sub}</p>
    <p className="text-[10px] font-medium text-[hsl(228,10%,35%)] mt-0.5 uppercase tracking-wider">{label}</p>
  </button>
);

const RevenueRow = ({ label, amount, total, color, fmt }: {
  label: string; amount: number; total: number; color: string; fmt: (n: number) => string;
}) => {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[hsl(228,10%,55%)]">{label}</span>
        <span className="text-sm font-mono font-semibold text-white">AED {fmt(amount)}</span>
      </div>
      <div className="h-2 bg-[hsl(228,18%,14%)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
