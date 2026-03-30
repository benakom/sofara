import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

const COLORS = ["#D2F34C", "#154B3B", "#22C55E", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"];

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ ambassadors: 0, leads: 0, deals: 0, gmv: 0, activeRate: 0, qualifiedRate: 0, conversionRate: 0 });
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [leadsByCountry, setLeadsByCountry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    const fetch = async () => {
      const [pRes, lRes, cRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, status, country"),
        supabase.from("leads").select("id, user_id, stage, score, created_at"),
        supabase.from("commissions").select("user_id, amount, status"),
      ]);
      const profiles = pRes.data ?? [];
      const leads = lRes.data ?? [];
      const commissions = cRes.data ?? [];

      const active = profiles.filter(p => p.status === "approved").length;
      const qualified = leads.filter(l => ["qualifié", "négociation", "closing"].includes(l.stage || "")).length;
      const closed = leads.filter(l => l.stage === "closing").length;
      const gmv = commissions.filter(c => c.status === "confirmed" || c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);

      setStats({
        ambassadors: profiles.length, leads: leads.length, deals: closed, gmv,
        activeRate: profiles.length > 0 ? Math.round(active / profiles.length * 100) : 0,
        qualifiedRate: leads.length > 0 ? Math.round(qualified / leads.length * 100) : 0,
        conversionRate: leads.length > 0 ? Math.round(closed / leads.length * 100) : 0,
      });

      const leadsPerUser: Record<string, number> = {};
      leads.forEach(l => { leadsPerUser[l.user_id] = (leadsPerUser[l.user_id] || 0) + 1; });
      const commPerUser: Record<string, number> = {};
      commissions.forEach(c => { commPerUser[c.user_id] = (commPerUser[c.user_id] || 0) + Number(c.amount); });
      const top = Object.entries(leadsPerUser).sort(([, a], [, b]) => b - a).slice(0, 10).map(([uid, count], i) => ({
        rank: i + 1, name: profiles.find(p => p.id === uid)?.full_name || "—", leads: count,
        deals: leads.filter(l => l.user_id === uid && l.stage === "closing").length,
        commission: commPerUser[uid] || 0,
      }));
      setTopPerformers(top);

      const countryMap: Record<string, number> = {};
      leads.forEach(l => {
        const country = profiles.find(p => p.id === l.user_id)?.country || "Unknown";
        countryMap[country] = (countryMap[country] || 0) + 1;
      });
      setLeadsByCountry(Object.entries(countryMap).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value]) => ({ name, value })));

      setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const funnelData = [
    { name: "New", value: stats.leads, fill: "#154B3B" },
    { name: "Qualified", value: Math.round(stats.leads * stats.qualifiedRate / 100), fill: "#D2F34C" },
    { name: "Negotiation", value: Math.round(stats.leads * 0.15), fill: "#F59E0B" },
    { name: "Closed", value: stats.deals, fill: "#22C55E" },
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#154B3B] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#154B3B]">Analytics</h1>
        <div className="flex items-center gap-2">
          {["7", "30", "90", "365"].map(d => (
            <button key={d} onClick={() => setDateRange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${dateRange === d ? "bg-[#154B3B] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280]"}`}>
              {d === "7" ? "7d" : d === "30" ? "30d" : d === "90" ? "90d" : "1y"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Ambassadors", value: stats.ambassadors, sub: `${stats.activeRate}% active` },
          { label: "Leads", value: fmt(stats.leads), sub: `${stats.qualifiedRate}% qualified` },
          { label: "Deals", value: stats.deals, sub: `${stats.conversionRate}% conv. rate` },
          { label: "GMV", value: `AED ${fmt(stats.gmv)}`, sub: "confirmed + paid" },
          { label: "Revenue", value: `AED ${fmt(Math.round(stats.gmv * 0.03))}`, sub: "3% commission" },
          { label: "NPS", value: "72", sub: "ambassador sat." },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-lg font-bold text-[#154B3B]">{k.value}</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">{k.label}</p>
            <p className="text-[9px] text-[#9CA3AF]">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-[#154B3B] mb-4">Lead Funnel</h2>
          <div className="space-y-3">
            {funnelData.map((d, i) => {
              const maxVal = funnelData[0].value || 1;
              const pct = (d.value / maxVal) * 100;
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs text-[#6B7280] w-24 shrink-0">{d.name}</span>
                  <div className="flex-1 h-8 bg-[#F5F5F7] rounded-lg overflow-hidden relative">
                    <div className="h-full rounded-lg transition-all duration-700" style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: d.fill }} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-[#6B7280]">{d.value}</span>
                  </div>
                  {i < funnelData.length - 1 && (
                    <span className="text-[10px] text-[#9CA3AF] w-10 text-right">
                      {funnelData[i + 1].value > 0 ? Math.round(funnelData[i + 1].value / d.value * 100) : 0}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-[#154B3B] mb-4">Leads by Country</h2>
          <div className="space-y-2">
            {leadsByCountry.map((c, i) => {
              const maxVal = leadsByCountry[0]?.value || 1;
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-xs text-[#6B7280] w-24 shrink-0 truncate">{c.name}</span>
                  <div className="flex-1 h-6 bg-[#F5F5F7] rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${(c.value / maxVal) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs font-bold text-[#154B3B] w-8 text-right">{c.value}</span>
                </div>
              );
            })}
            {leadsByCountry.length === 0 && <p className="text-xs text-[#9CA3AF] text-center py-4">No data</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#154B3B]">Top 10 Ambassadors</h2>
          <button className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#154B3B]"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase w-10">#</th>
                <th className="text-left py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase">Name</th>
                <th className="text-left py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase">Leads</th>
                <th className="text-left py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase">Deals</th>
                <th className="text-left py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase">Commission</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map(p => (
                <tr key={p.rank} className="border-b border-[#F5F5F7]">
                  <td className="py-2">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${p.rank <= 3 ? "bg-[#D2F34C] text-black" : "bg-[#F5F5F7] text-[#6B7280]"}`}>{p.rank}</span>
                  </td>
                  <td className="py-2 text-sm font-medium text-[#154B3B]">{p.name}</td>
                  <td className="py-2 text-xs text-[#6B7280]">{p.leads}</td>
                  <td className="py-2 text-xs text-[#6B7280]">{p.deals}</td>
                  <td className="py-2 text-xs font-bold text-[#154B3B]">AED {fmt(p.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
