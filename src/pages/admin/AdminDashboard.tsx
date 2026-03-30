import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Users, Target, Handshake, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, ChevronRight, Check, X, Clock, AlertTriangle
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Stats {
  totalAmbassadors: number;
  activeAmbassadors: number;
  pendingAmbassadors: number;
  totalLeads: number;
  dealsClosed: number;
  totalGMV: number;
  pendingCommissions: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalAmbassadors: 0, activeAmbassadors: 0, pendingAmbassadors: 0,
    totalLeads: 0, dealsClosed: 0, totalGMV: 0, pendingCommissions: 0,
  });
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [actionLeads, setActionLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [profilesRes, leadsRes, commissionsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, status, created_at, country").order("created_at", { ascending: false }),
        supabase.from("leads").select("id, user_id, first_name, last_name, stage, created_at, score, updated_at").order("created_at", { ascending: false }),
        supabase.from("commissions").select("id, amount, status, user_id, deal_name, created_at").order("created_at", { ascending: false }),
        supabase.from("payments").select("amount, status"),
      ]);

      const profiles = profilesRes.data ?? [];
      const leads = leadsRes.data ?? [];
      const commissions = commissionsRes.data ?? [];

      const closedLeads = leads.filter(l => l.stage === "closing");
      const estimated = commissions.filter(c => c.status === "estimated");
      const confirmedAmount = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
      const paidAmount = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
      const pendingAmount = estimated.reduce((s, c) => s + Number(c.amount), 0);

      setStats({
        totalAmbassadors: profiles.length,
        activeAmbassadors: profiles.filter(p => p.status === "approved").length,
        pendingAmbassadors: profiles.filter(p => p.status === "pending" || p.status === "onboarding").length,
        totalLeads: leads.length,
        dealsClosed: closedLeads.length,
        totalGMV: confirmedAmount + paidAmount,
        pendingCommissions: pendingAmount,
      });

      setRecentSignups(profiles.slice(0, 8));

      const pendingComm = estimated.slice(0, 5).map(c => ({
        ...c,
        ambassadorName: profiles.find(p => p.id === c.user_id)?.full_name || "—",
      }));
      setPendingApprovals(pendingComm);

      const now = Date.now();
      const stuckLeads = leads
        .filter(l => l.stage !== "closing" && l.stage !== "perdu")
        .filter(l => (now - new Date(l.updated_at).getTime()) > 7 * 86400000)
        .slice(0, 5)
        .map(l => ({
          ...l,
          ambassadorName: profiles.find(p => p.id === l.user_id)?.full_name || "—",
          daysStuck: Math.floor((now - new Date(l.updated_at).getTime()) / 86400000),
        }));
      setActionLeads(stuckLeads);

      setLoading(false);
    };
    fetchAll();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const monthlyData = [
    { month: "Jul", gmv: 2400000, revenue: 72000 },
    { month: "Aug", gmv: 3100000, revenue: 93000 },
    { month: "Sep", gmv: 2800000, revenue: 84000 },
    { month: "Oct", gmv: 4200000, revenue: 126000 },
    { month: "Nov", gmv: 3800000, revenue: 114000 },
    { month: "Dec", gmv: 5100000, revenue: 153000 },
    { month: "Jan", gmv: 4500000, revenue: 135000 },
    { month: "Feb", gmv: 5800000, revenue: 174000 },
    { month: "Mar", gmv: 6200000, revenue: 186000 },
  ];

  const ambassadorGrowth = [
    { month: "Jul", count: 45 }, { month: "Aug", count: 78 }, { month: "Sep", count: 112 },
    { month: "Oct", count: 148 }, { month: "Nov", count: 180 }, { month: "Dec", count: 205 },
    { month: "Jan", count: 220 }, { month: "Feb", count: 235 }, { month: "Mar", count: stats.totalAmbassadors || 247 },
  ];

  const handleApproveCommission = async (id: string) => {
    await supabase.from("commissions").update({ status: "confirmed" }).eq("id", id);
    setPendingApprovals(prev => prev.filter(c => c.id !== id));
  };

  const handleRejectCommission = async (id: string) => {
    await supabase.from("commissions").update({ status: "rejected" }).eq("id", id);
    setPendingApprovals(prev => prev.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-[#154B3B] border-t-transparent animate-spin" />
      </div>
    );
  }

  const kpis = [
    { icon: Users, label: "Total Ambassadors", value: stats.totalAmbassadors, change: 12, accent: true },
    { icon: Target, label: "Active Leads", value: fmt(stats.totalLeads), change: 8 },
    { icon: Handshake, label: "Deals Closed", value: stats.dealsClosed, change: -3 },
    { icon: TrendingUp, label: "Total GMV", value: `AED ${fmt(stats.totalGMV)}`, change: 15 },
    { icon: DollarSign, label: "Commissions Pending", value: `AED ${fmt(stats.pendingCommissions)}`, change: 0, warn: stats.pendingCommissions > 500000 },
  ];

  const statusPill = (status: string) => {
    const map: Record<string, string> = {
      approved: "bg-[#22C55E]/10 text-[#22C55E]",
      pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
      onboarding: "bg-[#F59E0B]/10 text-[#F59E0B]",
      inactive: "bg-[#9CA3AF]/10 text-[#9CA3AF]",
      suspended: "bg-[#EF4444]/10 text-[#EF4444]",
    };
    const labels: Record<string, string> = {
      approved: "Active", pending: "Pending", onboarding: "Pending", inactive: "Inactive", suspended: "Suspended",
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] || map.inactive}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[#154B3B]/5">
                <kpi.icon className="w-4 h-4 text-[#154B3B]" />
              </div>
              {kpi.warn && (
                <span className="text-[9px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> HIGH
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-[#154B3B]">{kpi.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-[#6B7280] font-medium">{kpi.label}</p>
              {kpi.change !== 0 && (
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${kpi.change > 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                  {kpi.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(kpi.change)}%
                </span>
              )}
            </div>
            {kpi.accent && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D2F34C]" />}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-[#154B3B] mb-4">Revenue & GMV Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: "#154B3B", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }}
                formatter={(value: number) => [`AED ${fmt(value)}`, ""]}
              />
              <Bar dataKey="gmv" fill="#154B3B" radius={[4, 4, 0, 0]} name="GMV" />
              <Bar dataKey="revenue" fill="#D2F34C" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-[#154B3B] mb-4">Ambassador Growth</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ambassadorGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#154B3B", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="count" stroke="#D2F34C" strokeWidth={2.5} dot={{ fill: "#D2F34C", r: 3 }} name="Ambassadors" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#154B3B]">Recent Signups</h2>
            <button onClick={() => navigate("/admin/ambassadors")} className="text-[11px] font-semibold text-[#D2F34C] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {recentSignups.slice(0, 6).map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/admin/ambassadors/${p.id}`)}
                className={`flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[#F9FAFB] -mx-2 px-2 rounded-lg ${i < 5 ? "border-b border-[#F5F5F7]" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#154B3B]/10 flex items-center justify-center text-[10px] font-bold text-[#154B3B]">
                  {(p.full_name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#154B3B] truncate">{p.full_name || "—"}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{p.country || "—"} · {new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                </div>
                {statusPill(p.status)}
              </div>
            ))}
            {recentSignups.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-[#E5E7EB] mx-auto mb-2" />
                <p className="text-sm text-[#9CA3AF]">No ambassadors yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#154B3B]">Leads Requiring Action</h2>
            <button onClick={() => navigate("/admin/leads")} className="text-[11px] font-semibold text-[#D2F34C] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {actionLeads.map((l, i) => (
              <div key={l.id} className={`flex items-center gap-3 py-2.5 ${i < actionLeads.length - 1 ? "border-b border-[#F5F5F7]" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${l.daysStuck > 14 ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#154B3B] truncate">{l.first_name} {l.last_name}</p>
                  <p className="text-[10px] text-[#9CA3AF]">by {l.ambassadorName} · {l.daysStuck}d stuck</p>
                </div>
                <span className={`text-[10px] font-semibold ${l.daysStuck > 14 ? "text-[#EF4444]" : "text-[#F59E0B]"}`}>
                  {l.daysStuck}d
                </span>
              </div>
            ))}
            {actionLeads.length === 0 && (
              <div className="text-center py-8">
                <Check className="w-8 h-8 text-[#22C55E]/30 mx-auto mb-2" />
                <p className="text-sm text-[#9CA3AF]">All leads are on track</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#154B3B]">Pending Approvals</h2>
            <button onClick={() => navigate("/admin/commissions")} className="text-[11px] font-semibold text-[#D2F34C] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {pendingApprovals.map((c, i) => (
              <div key={c.id} className={`flex items-center gap-3 py-2.5 ${i < pendingApprovals.length - 1 ? "border-b border-[#F5F5F7]" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#154B3B] truncate">{c.ambassadorName}</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{c.deal_name}</p>
                </div>
                <span className="text-xs font-bold text-[#154B3B] mr-2">AED {fmt(c.amount)}</span>
                <button
                  onClick={() => handleApproveCommission(c.id)}
                  className="w-7 h-7 rounded-lg bg-[#D2F34C] flex items-center justify-center hover:bg-[#BDE040] transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-black" />
                </button>
                <button
                  onClick={() => handleRejectCommission(c.id)}
                  className="w-7 h-7 rounded-lg border border-[#EF4444]/30 flex items-center justify-center hover:bg-[#EF4444]/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[#EF4444]" />
                </button>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <div className="text-center py-8">
                <Check className="w-8 h-8 text-[#22C55E]/30 mx-auto mb-2" />
                <p className="text-sm text-[#9CA3AF]">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
