import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, GitBranch, DollarSign, CreditCard, TrendingUp, Activity } from "lucide-react";

interface Stats {
  totalAmbassadors: number;
  totalLeads: number;
  totalCommissions: number;
  totalPayments: number;
  pendingPayments: number;
  estimatedRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalAmbassadors: 0, totalLeads: 0, totalCommissions: 0,
    totalPayments: 0, pendingPayments: 0, estimatedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, leadsRes, commissionsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("commissions").select("amount"),
        supabase.from("payments").select("amount, status"),
      ]);

      const commissionTotal = commissionsRes.data?.reduce((s, c) => s + Number(c.amount), 0) ?? 0;
      const paymentTotal = paymentsRes.data?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
      const pendingCount = paymentsRes.data?.filter(p => p.status === "pending").length ?? 0;

      setStats({
        totalAmbassadors: profilesRes.count ?? 0,
        totalLeads: leadsRes.count ?? 0,
        totalCommissions: commissionsRes.data?.length ?? 0,
        totalPayments: paymentsRes.data?.length ?? 0,
        pendingPayments: pendingCount,
        estimatedRevenue: commissionTotal,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const cards = [
    { label: "Ambassadeurs", value: stats.totalAmbassadors, icon: Users, color: "hsl(var(--primary))" },
    { label: "Leads totaux", value: stats.totalLeads, icon: GitBranch, color: "hsl(var(--accent))" },
    { label: "Commissions", value: stats.totalCommissions, icon: DollarSign, color: "hsl(45, 90%, 55%)" },
    { label: "Paiements", value: stats.totalPayments, icon: CreditCard, color: "hsl(160, 70%, 50%)" },
    { label: "En attente", value: stats.pendingPayments, icon: Activity, color: "hsl(var(--destructive))" },
    { label: "Revenus estimés (AED)", value: fmt(stats.estimatedRevenue), icon: TrendingUp, color: "hsl(var(--primary))" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Vue d'ensemble</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Statistiques globales de la plateforme Sofara</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${card.color}15` }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))] mt-1">
                {loading ? "—" : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
