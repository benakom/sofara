import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter, AlertCircle, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import AdminLeadSheet from "@/components/admin/AdminLeadSheet";
import { STAGES, stageByKey, stageColor, relativeTime, daysAgo } from "@/lib/dashboard-data";
import { LEAD_PHASES } from "@/lib/lead-stages";
import { CONSENT_STATUS } from "@/lib/lead-intake";

interface Profile { id: string; full_name: string | null }

const AdminPipeline = () => {
  const [params, setParams] = useSearchParams();
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterAmbassador, setFilterAmbassador] = useState("all");
  const [onlyDue, setOnlyDue] = useState(false);
  const [openLead, setOpenLead] = useState<string | null>(null);

  const fetchData = async () => {
    const [leadsRes, profilesRes] = await Promise.all([
      supabase.from("leads").select("*").order("updated_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);
    setLeads(leadsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Deep link from admin notifications: /admin/pipeline?lead=<id>
  useEffect(() => {
    const id = params.get("lead");
    if (id) { setOpenLead(id); params.delete("lead"); setParams(params, { replace: true }); }
  }, [params, setParams]);

  const getName = (uid: string) => profiles.find((p) => p.id === uid)?.full_name || uid.slice(0, 8) + "…";

  const handleStageChange = async (leadId: string, newStage: string) => {
    const { error } = await supabase.rpc("admin_update_lead", { p_lead_id: leadId, p_stage: newStage });
    if (error) { toast.error(`Update failed: ${error.message}`); return; }
    toast.success(`Stage → ${stageByKey(newStage).en}. Ambassador notified.`);
    fetchData();
  };

  const ambassadorsWithLeads = [...new Set(leads.map((l) => l.user_id))];
  const isDue = (l: any) => l.next_action_at && new Date(l.next_action_at).getTime() <= Date.now() + 864e5;
  const isStale = (l: any) => stageByKey(l.stage).kind === "open" && daysAgo(l.updated_at) >= 5;

  const filtered = useMemo(() => leads
    .filter((l) => filterPhase === "all" || (filterPhase.startsWith("kind:") ? stageByKey(l.stage).kind === filterPhase.slice(5) : stageByKey(l.stage).phase === filterPhase))
    .filter((l) => filterAmbassador === "all" || l.user_id === filterAmbassador)
    .filter((l) => !onlyDue || isDue(l) || isStale(l))
    .filter((l) => `${l.first_name} ${l.last_name} ${l.email ?? ""} ${l.phone ?? ""} ${getName(l.user_id)}`.toLowerCase().includes(search.toLowerCase())), [leads, filterPhase, filterAmbassador, onlyDue, search, profiles]); // eslint-disable-line react-hooks/exhaustive-deps

  const phaseCounts = LEAD_PHASES.filter((p) => p.key !== "closed").map((p) => ({ ...p, count: leads.filter((l) => stageByKey(l.stage).phase === p.key).length }));
  const pausedCount = leads.filter((l) => stageByKey(l.stage).kind === "paused").length;
  const lostCount = leads.filter((l) => stageByKey(l.stage).kind === "lost").length;
  const dueCount = leads.filter((l) => isDue(l) || isStale(l)).length;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  const chip = (active: boolean) => `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? "bg-[hsl(var(--dash-accent))] text-black" : "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-muted-fg))] hover:text-white"}`;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Pipeline</h1>
          <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1">{leads.length} leads · {ambassadorsWithLeads.length} active ambassadors · every stage change and shared note notifies the ambassador in the app and by email.</p>
        </div>
        <button onClick={() => setOnlyDue((v) => !v)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${onlyDue ? "bg-[hsl(var(--dash-warning)/.15)] border-[hsl(var(--dash-warning)/.5)] text-[hsl(var(--dash-warning))]" : "bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))]"}`}>
          <AlertCircle className="w-3.5 h-3.5" /> Needs action ({dueCount})
        </button>
      </div>

      {/* Phase chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterPhase("all")} className={chip(filterPhase === "all")}>All ({leads.length})</button>
        {phaseCounts.map((p) => (
          <button key={p.key} onClick={() => setFilterPhase(p.key)} className={chip(filterPhase === p.key)}>{p.en} ({p.count})</button>
        ))}
        <button onClick={() => setFilterPhase("kind:paused")} className={chip(filterPhase === "kind:paused")}>On hold ({pausedCount})</button>
        <button onClick={() => setFilterPhase("kind:lost")} className={chip(filterPhase === "kind:lost")}>Lost ({lostCount})</button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
          <input
            type="text" placeholder="Search a lead, phone, email or ambassador..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-white placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/.5)]"
          />
        </div>
        <Select value={filterAmbassador} onValueChange={setFilterAmbassador}>
          <SelectTrigger className="w-[220px] bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] text-sm h-10 text-white">
            <Filter className="w-3.5 h-3.5 mr-2 text-[hsl(var(--dash-muted-fg))]" />
            <SelectValue placeholder="Ambassador" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))]">
            <SelectItem value="all">All ambassadors</SelectItem>
            {ambassadorsWithLeads.map((uid) => <SelectItem key={uid} value={uid}>{getName(uid)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--dash-border))] hover:bg-transparent">
              {["Lead", "Ambassador", "Stage", "Next step", "Last activity", "Score", "Handled by"].map((h) => (
                <TableHead key={h} className="text-[hsl(var(--dash-muted-fg))]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => {
              const st = stageByKey(l.stage);
              const due = isDue(l);
              const stale = isStale(l);
              return (
                <TableRow key={l.id} onClick={() => setOpenLead(l.id)} className="border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.4)] cursor-pointer">
                  <TableCell>
                    <p className="font-medium text-white flex items-center gap-2">{l.first_name} {l.last_name}
                      {l.consent_status !== "verified" && <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${CONSENT_STATUS[l.consent_status || "unverified"]?.className}`}>{l.consent_status === "disputed" ? "consent disputed" : "consent to verify"}</span>}
                    </p>
                    <p className="text-[11px] text-[hsl(var(--dash-muted-fg))]">{l.phone || l.email || "—"}</p>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getName(l.user_id)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={st.key} onValueChange={(v) => handleStageChange(l.id, v)}>
                      <SelectTrigger className="h-7 text-xs border-0 bg-[hsl(var(--dash-muted)/.5)] font-semibold w-[170px]">
                        <span className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ background: stageColor(st) }} />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] max-h-[360px]">
                        {LEAD_PHASES.map((p) => (
                          <div key={p.key}>
                            <p className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">{p.en}</p>
                            {STAGES.filter((s) => s.phase === p.key).map((s) => <SelectItem key={s.key} value={s.key}>{s.en}</SelectItem>)}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs max-w-[220px]">
                    {l.next_action ? (
                      <span className={`inline-flex items-start gap-1.5 ${due ? "text-[hsl(var(--dash-warning))]" : "text-[hsl(var(--dash-muted-fg))]"}`}><CalendarClock className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span className="truncate">{l.next_action}{l.next_action_at ? ` · ${new Date(l.next_action_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}` : ""}</span></span>
                    ) : <span className="text-[hsl(var(--dash-muted-fg))]">—</span>}
                  </TableCell>
                  <TableCell className={`text-xs ${stale ? "text-[hsl(var(--dash-warning))] font-medium" : "text-[hsl(var(--dash-muted-fg))]"}`}>{stale && <AlertCircle className="w-3 h-3 inline mr-1" />}{relativeTime(l.updated_at, "en")}</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] text-[10px]">{l.score ?? "—"}</Badge></TableCell>
                  <TableCell className="text-xs text-[hsl(var(--dash-muted-fg))]">{l.assigned_to ? getName(l.assigned_to) : "—"}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--dash-muted-fg))]">No lead matches these filters</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminLeadSheet leadId={openLead} open={!!openLead} onOpenChange={(o) => { if (!o) setOpenLead(null); }} onChanged={fetchData} />
    </div>
  );
};

export default AdminPipeline;
