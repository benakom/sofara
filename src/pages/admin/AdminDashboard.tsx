import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Users, GitBranch, DollarSign, CreditCard, TrendingUp, Activity, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalAmbassadors: number;
  approvedAmbassadors: number;
  pendingAmbassadors: number;
  totalLeads: number;
  totalCommissions: number;
  totalPayments: number;
  pendingPayments: number;
  estimatedRevenue: number;
  confirmedRevenue: number;
  paidRevenue: number;
}

interface RecentAmbassador {
  id: string;
  full_name: string | null;
  status: string;
  created_at: string;
  country: string | null;
}

interface TopAmbassador {
  id: string;
  full_name: string | null;
  leadsCount: number;
  totalCommission: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalAmbassadors: 0, approvedAmbassadors: 0, pendingAmbassadors: 0,
    totalLeads: 0, totalCommissions: 0, totalPayments: 0,
    pendingPayments: 0, estimatedRevenue: 0, confirmedRevenue: 0, paidRevenue: 0,
  });
  const [recentAmbassadors, setRecentAmbassadors] = useState<RecentAmbassador[]>([]);
  const [topAmbassadors, setTopAmbassadors] = useState<TopAmbassador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, leadsRes, commissionsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, status, created_at, country").order("created_at", { ascending: false }),
        supabase.from("leads").select("id, user_id"),
        supabase.from("commissions").select("amount, status, user_id"),
        supabase.from("payments").select("amount, status"),
      ]);

      const profiles = profilesRes.data ?? [];
      const leads = leadsRes.data ?? [];
      const commissions = commissionsRes.data ?? [];
      const payments = paymentsRes.data ?? [];

      const estimated = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
      const confirmed = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
      const paid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
      const pendingCount = payments.filter(p => p.status === "pending").length;

      setStats({
        totalAmbassadors: profiles.length,
        approvedAmbassadors: profiles.filter(p => p.status === "approved").length,
        pendingAmbassadors: profiles.filter(p => p.status === "pending" || p.status === "onboarding").length,
        totalLeads: leads.length,
        totalCommissions: commissions.length,
        totalPayments: payments.length,
        pendingPayments: pendingCount,
        estimatedRevenue: estimated,
        confirmedRevenue: confirmed,
        paidRevenue: paid,
      });

      // Recent ambassadors
      setRecentAmbassadors(profiles.slice(0, 5).map(p => ({
        id: p.id,
        full_name: p.full_name,
        status: p.status,
        created_at: p.created_at,
        country: p.country,
      })));

      // Top ambassadors by leads
      const leadsPerUser: Record<string, number> = {};
      leads.forEach(l => { leadsPerUser[l.user_id] = (leadsPerUser[l.user_id] || 0) + 1; });
      const commPerUser: Record<string, number> = {};
      commissions.forEach(c => { commPerUser[c.user_id] = (commPerUser[c.user_id] || 0) + Number(c.amount); });

      const top = Object.entries(leadsPerUser)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([uid, count]) => ({
          id: uid,
          full_name: profiles.find(p => p.id === uid)?.full_name ?? uid.slice(0, 8),
          leadsCount: count,
          totalCommission: commPerUser[uid] ?? 0,
        }));
      setTopAmbassadors(top);

      setLoading(false);
    };
    fetchStats();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const cards = [
    { label: "Ambassadeurs", value: stats.totalAmbassadors, sub: `${stats.approvedAmbassadors} actifs · ${stats.pendingAmbassadors} en attente`, icon: Users, color: "hsl(var(--primary))", path: "/admin/ambassadors" },
    { label: "Leads totaux", value: stats.totalLeads, sub: `${stats.totalCommissions} commissions`, icon: GitBranch, color: "hsl(var(--accent))", path: "/admin/leads" },
    { label: "Revenus confirmés", value: `AED ${fmt(stats.confirmedRevenue)}`, sub: `Estimé: AED ${fmt(stats.estimatedRevenue)}`, icon: DollarSign, color: "hsl(45, 90%, 55%)", path: "/admin/leads" },
    { label: "Paiements", value: stats.totalPayments, sub: `${stats.pendingPayments} en attente`, icon: CreditCard, color: "hsl(160, 70%, 50%)", path: "/admin/payments" },
    { label: "Payé", value: `AED ${fmt(stats.paidRevenue)}`, sub: "Commissions versées", icon: TrendingUp, color: "hsl(var(--primary))", path: "/admin/payments" },
    { label: "Pipeline total", value: `AED ${fmt(stats.estimatedRevenue + stats.confirmedRevenue + stats.paidRevenue)}`, sub: "Toutes commissions", icon: Activity, color: "hsl(var(--destructive))", path: "/admin/leads" },
  ];

  const statusBadge = (s: string) => {
    if (s === "approved") return <Badge variant="default" className="text-[10px] gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Actif</Badge>;
    if (s === "pending" || s === "onboarding") return <Badge variant="secondary" className="text-[10px] gap-1"><Clock className="w-2.5 h-2.5" />En attente</Badge>;
    return <Badge variant="destructive" className="text-[10px]">{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Vue d'ensemble</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Statistiques globales de la plateforme Sofara</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 flex items-start gap-4 text-left hover:border-[hsl(var(--primary)/.3)] transition-all group"
          >
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${card.color}15` }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))] mt-1">
                {loading ? "—" : card.value}
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{card.sub}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
          </button>
        ))}
      </div>

      {/* Two columns: Recent ambassadors + Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent ambassadors */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Derniers inscrits</h2>
            <button onClick={() => navigate("/admin/ambassadors")} className="text-xs font-semibold text-[hsl(var(--primary))] hover:opacity-70 flex items-center gap-1">
              Voir tous <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {recentAmbassadors.map((a, i) => (
              <div key={a.id} className={`flex items-center justify-between py-3 ${i < recentAmbassadors.length - 1 ? "border-b border-[hsl(var(--border))]" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--primary))]">
                    {(a.full_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">{a.full_name || "—"}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{a.country || "—"} · {new Date(a.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
            {recentAmbassadors.length === 0 && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-6">Aucun ambassadeur</p>
            )}
          </div>
        </div>

        {/* Top performers */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Top Ambassadeurs</h2>
            <button onClick={() => navigate("/admin/leads")} className="text-xs font-semibold text-[hsl(var(--primary))] hover:opacity-70 flex items-center gap-1">
              Leads <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {topAmbassadors.map((a, i) => (
              <div key={a.id} className={`flex items-center justify-between py-3 ${i < topAmbassadors.length - 1 ? "border-b border-[hsl(var(--border))]" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(0,0%,7%)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--primary))]">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">{a.full_name}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{a.leadsCount} leads</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-[hsl(var(--foreground))]">AED {fmt(a.totalCommission)}</span>
              </div>
            ))}
            {topAmbassadors.length === 0 && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-6">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
