import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Target, Trophy, DollarSign, ArrowUpRight, Check, X, AlertCircle, UserPlus, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StatTile from "@/components/dashboard/StatTile";
import FunnelBar from "@/components/dashboard/FunnelBar";
import { STAGES, stageByKey, stageLabel, STAGE_RAMP, dailySeries, weekDelta, isStale, daysAgo, relativeTime, aed, initials, normalizeCommissionStatus, type LeadLike } from "@/lib/dashboard-data";

interface Profile { id: string; full_name: string | null; status: string | null; created_at: string; country: string | null }
interface Commission { id: string; amount: number; status: string | null; user_id: string; deal_name: string; created_at: string }

const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: profiles = [] } = useQuery({ queryKey: ["admin", "profiles"], queryFn: async () => { const { data } = await supabase.from("profiles").select("id, full_name, status, created_at, country").order("created_at", { ascending: false }); return (data ?? []) as Profile[]; } });
  const { data: leads = [], isLoading } = useQuery({ queryKey: ["admin", "leads"], queryFn: async () => { const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); return (data ?? []) as (LeadLike & { user_id: string })[]; } });
  const { data: commissions = [] } = useQuery({ queryKey: ["admin", "commissions"], queryFn: async () => { const { data } = await supabase.from("commissions").select("id, amount, status, user_id, deal_name, created_at").order("created_at", { ascending: false }); return (data ?? []) as Commission[]; } });

  const setCommission = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "validated" | "rejected" }) => { const { error } = await supabase.from("commissions").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["admin", "commissions"] }); toast({ title: v.status === "validated" ? "Commission validated" : "Commission rejected" }); },
    onError: (e: Error) => toast({ variant: "destructive", title: "Error", description: e.message }),
  });

  const m = useMemo(() => {
    const name = (id: string) => profiles.find((p) => p.id === id)?.full_name || "—";
    const active = profiles.filter((p) => p.status === "approved");
    const counts: Record<string, number> = {}; for (const s of STAGES) counts[s.key] = 0;
    for (const l of leads) counts[stageByKey(l.stage).key] += 1;
    const won = leads.filter((l) => stageByKey(l.stage).kind === "won");
    const status = (c: Commission) => normalizeCommissionStatus(c.status);
    const sum = (st: string) => commissions.filter((c) => status(c) === st).reduce((a, c) => a + Number(c.amount), 0);
    const validated = sum("validated"), paid = sum("paid"), estimated = sum("estimated");
    // Leads per week, last 12 weeks
    const weeks = Array.from({ length: 12 }, (_, i) => { const end = 11 - i; return { label: `W-${end}`, count: 0, end }; });
    for (const l of leads) { const w = Math.floor(daysAgo(l.created_at) / 7); if (w >= 0 && w < 12) weeks[11 - w].count += 1; }
    const pending = commissions.filter((c) => status(c) === "estimated").slice(0, 6).map((c) => ({ ...c, ambassador: name(c.user_id) }));
    const stuck = leads.filter(isStale).sort((a, b) => daysAgo(b.updated_at) - daysAgo(a.updated_at)).slice(0, 6).map((l) => ({ ...l, ambassador: name(l.user_id), days: daysAgo(l.updated_at) }));
    const signups = profiles.slice(0, 6);
    // Top ambassadors by won deals then leads
    const per: Record<string, { leads: number; won: number; earned: number }> = {};
    for (const l of leads) { per[l.user_id] ??= { leads: 0, won: 0, earned: 0 }; per[l.user_id].leads += 1; if (stageByKey(l.stage).kind === "won") per[l.user_id].won += 1; }
    for (const c of commissions) { if (status(c) === "paid" || status(c) === "validated") { per[c.user_id] ??= { leads: 0, won: 0, earned: 0 }; per[c.user_id].earned += Number(c.amount); } }
    const top = Object.entries(per).map(([id, v]) => ({ id, name: name(id), ...v })).sort((a, b) => b.won - a.won || b.leads - a.leads).slice(0, 5);
    const conv = leads.length ? Math.round((won.length / leads.length) * 100) : 0;
    return { active, counts, won, validated, paid, estimated, weeks, pending, stuck, signups, top, conv, leadSeries: dailySeries(leads, 14), ambSeries: dailySeries(profiles, 14), wonSeries: dailySeries(won, 14), commSeries: dailySeries(commissions, 14) };
  }, [profiles, leads, commissions]);

  const Card = ({ title, action, children, className = "" }: { title: string; action?: { label: string; path: string }; children: React.ReactNode; className?: string }) => (
    <section className={`rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] ${className}`}>
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-[13px] font-semibold text-[hsl(var(--dash-fg))]">{title}</h2>
        {action && <button onClick={() => navigate(action.path)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-accent))]">{action.label} <ArrowUpRight className="w-3.5 h-3.5" /></button>}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const vs7 = "vs prev. 7d";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] capitalize">{today}</p>
          <h1 className="mt-1 text-[26px] leading-tight font-semibold tracking-tight">Command center</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/admin/applications")} className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--dash-border))] px-3.5 py-2 text-[13px] font-medium hover:border-[hsl(var(--dash-accent)/.5)]"><UserPlus className="w-4 h-4" /> Applications</button>
          <button onClick={() => navigate("/admin/pipeline")} className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black px-3.5 py-2 text-[13px] font-semibold hover:brightness-95 shadow-[var(--dash-accent-glow)]"><Target className="w-4 h-4" /> Pipeline</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatTile label="Active ambassadors" value={m.active.length} icon={Users} deltaPct={weekDelta(m.ambSeries).pct} deltaLabel={`new · ${vs7}`} trend={m.ambSeries} onClick={() => navigate("/admin/ambassadors")} />
        <StatTile label="Leads" value={leads.length} icon={Target} deltaPct={weekDelta(m.leadSeries).pct} deltaLabel={vs7} trend={m.leadSeries} onClick={() => navigate("/admin/leads")} />
        <StatTile label="Deals won" value={m.won.length} icon={Trophy} deltaPct={weekDelta(m.wonSeries).pct} deltaLabel={`${m.conv}% conversion`} trend={m.wonSeries} onClick={() => navigate("/admin/pipeline")} />
        <StatTile label="Commissions validated + paid" value={aed(m.validated + m.paid)} icon={DollarSign} deltaLabel={`${aed(m.estimated)} awaiting validation`} trend={m.commSeries} onClick={() => navigate("/admin/commissions")} emphasis />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-4">
        <Card title="New leads per week · last 12 weeks" action={{ label: "Analytics", path: "/admin/analytics" }} className="xl:col-span-3">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.weeks} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barCategoryGap={6}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#8a8a8a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, color: "#f2f2f2" }} formatter={(v: number) => [v, "leads"]} labelFormatter={(l) => `Week ${l}`} />
                <Bar dataKey="count" radius={[4, 4, 2, 2]}>
                  {m.weeks.map((w, i) => <Cell key={w.label} fill={i === m.weeks.length - 1 ? "hsl(68 88% 62%)" : "hsl(68 40% 40%)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Pipeline funnel · all ambassadors" action={{ label: "Pipeline", path: "/admin/pipeline" }} className="xl:col-span-2">
          {leads.length === 0 ? <p className="py-8 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">No leads yet.</p> : <FunnelBar counts={m.counts} lang="en" variant="bars" onSelect={(k) => navigate(`/admin/pipeline?stage=${k}`)} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card title="Commissions awaiting validation" action={{ label: "All", path: "/admin/commissions" }}>
          {m.pending.length === 0 ? <p className="py-6 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">Nothing to validate.</p> : (
            <ul className="divide-y divide-[hsl(var(--dash-border))]">
              {m.pending.map((c) => (
                <li key={c.id} className="py-2.5 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{c.deal_name}</p>
                    <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{c.ambassador} · AED {fmt(Number(c.amount))}</p>
                  </div>
                  <button onClick={() => setCommission.mutate({ id: c.id, status: "validated" })} title="Validate" className="w-7 h-7 rounded-md bg-[hsl(var(--dash-accent))] text-black flex items-center justify-center hover:brightness-95"><Check className="w-3.5 h-3.5" strokeWidth={3} /></button>
                  <button onClick={() => setCommission.mutate({ id: c.id, status: "rejected" })} title="Reject" className="w-7 h-7 rounded-md border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] flex items-center justify-center hover:text-[#EF4444] hover:border-[#EF4444]/50"><X className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Leads to move forward" action={{ label: "Leads", path: "/admin/leads" }}>
          {m.stuck.length === 0 ? <p className="py-6 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">No stale leads. Pipeline is moving.</p> : (
            <ul className="divide-y divide-[hsl(var(--dash-border))]">
              {m.stuck.map((l) => (
                <li key={l.id} className="py-2.5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[hsl(var(--dash-muted))] text-[11px] font-semibold flex items-center justify-center shrink-0">{initials(l.first_name, l.last_name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{l.first_name} {l.last_name} <span className="font-normal text-[hsl(var(--dash-muted-fg))]">· {stageLabel(l.stage, "en")}</span></p>
                    <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{l.ambassador}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--dash-warning))] shrink-0"><AlertCircle className="w-3 h-3" /> {l.days} d</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent sign-ups" action={{ label: "Ambassadors", path: "/admin/ambassadors" }}>
          {m.signups.length === 0 ? <p className="py-6 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">No sign-ups yet.</p> : (
            <ul className="divide-y divide-[hsl(var(--dash-border))]">
              {m.signups.map((p) => { const [f, l] = (p.full_name || "?").split(" "); return (
                <li key={p.id} className="py-2.5 flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/admin/ambassadors/${p.id}`)}>
                  <span className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent)/.15)] text-[hsl(var(--dash-accent))] text-[11px] font-semibold flex items-center justify-center shrink-0">{initials(f, l)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{p.full_name || "—"}</p>
                    <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{p.country || "—"} · <span className="capitalize">{p.status}</span></p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0"><Clock className="w-3 h-3" /> {relativeTime(p.created_at, "en")}</span>
                </li>
              ); })}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Top ambassadors" action={{ label: "All ambassadors", path: "/admin/ambassadors" }}>
        {m.top.length === 0 ? <p className="py-6 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">No activity yet.</p> : (
          <table className="w-full table-fixed">
            <colgroup><col className="w-[6%]" /><col className="w-[40%]" /><col className="w-[18%]" /><col className="w-[18%]" /><col className="w-[18%]" /></colgroup>
            <thead><tr className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))]">
              <th className="text-left py-2">#</th><th className="text-left py-2">Ambassador</th><th className="text-right py-2">Leads</th><th className="text-right py-2">Won</th><th className="text-right py-2">Earned</th>
            </tr></thead>
            <tbody>
              {m.top.map((a, i) => (
                <tr key={a.id} onClick={() => navigate(`/admin/ambassadors/${a.id}`)} className="border-t border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.35)] cursor-pointer text-[13px]">
                  <td className="py-2.5 text-[hsl(var(--dash-muted-fg))]">{i + 1}</td>
                  <td className="py-2.5 font-medium truncate">{a.name}</td>
                  <td className="py-2.5 text-right tabular-nums">{a.leads}</td>
                  <td className="py-2.5 text-right tabular-nums"><span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: STAGE_RAMP[5] }} />{a.won}</td>
                  <td className="py-2.5 text-right tabular-nums">AED {fmt(a.earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
