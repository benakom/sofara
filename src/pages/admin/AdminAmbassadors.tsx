import { useEffect, useMemo, useState } from "react";
import { stageByKey } from "@/lib/dashboard-data";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Download, Users, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Shield, ShieldOff, Trash2, UserPlus, Loader2, Check, X, Mail, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { STATUS_META, occupationLabel, validateAmbassador, rejectAmbassador, suspendAmbassador, reactivateAmbassador } from "@/lib/admin-ambassadors";

interface Row {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  occupation: string | null;
  country: string | null;
  status: string;
  profile_type: string | null;
  referred_by: string | null;
  created_at: string;
  reviewed_at: string | null;
  leadCount: number;
  dealsClosed: number;
  totalCommission: number;
  pendingCommission: number;
  sponsor: string | null;
}

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending validation" },
  { key: "approved", label: "Active" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

const AdminAmbassadors = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [ambassadors, setAmbassadors] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const statusFilter = params.get("status") ?? "all";
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [acting, setActing] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ full_name: "", email: "", password: "", phone: "", country: "" });
  const perPage = 25;

  const load = async () => {
    setLoading(true);
    const [profilesRes, leadsRes, commissionsRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, first_name, last_name, email, phone, occupation, country, status, profile_type, referred_by, created_at, reviewed_at").order("created_at", { ascending: false }),
      supabase.from("leads").select("user_id, stage"),
      supabase.from("commissions").select("user_id, amount, status"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const superAdminIds = new Set((rolesRes.data ?? []).filter((r) => r.role === "superadmin").map((r) => r.user_id));
    const all = profilesRes.data ?? [];
    const nameById = new Map(all.map((p) => [p.id, p.full_name]));
    const profiles = all.filter((p) => !superAdminIds.has(p.id));
    const leadsMap: Record<string, { total: number; closed: number }> = {};
    (leadsRes.data ?? []).forEach((l) => { leadsMap[l.user_id] ??= { total: 0, closed: 0 }; leadsMap[l.user_id].total++; if (stageByKey(l.stage).kind === "won") leadsMap[l.user_id].closed++; });
    const commMap: Record<string, { total: number; pending: number }> = {};
    (commissionsRes.data ?? []).forEach((c) => { commMap[c.user_id] ??= { total: 0, pending: 0 }; commMap[c.user_id].total += Number(c.amount); if (c.status === "estimated") commMap[c.user_id].pending += Number(c.amount); });
    setAmbassadors(profiles.map((p) => ({
      ...p,
      leadCount: leadsMap[p.id]?.total || 0,
      dealsClosed: leadsMap[p.id]?.closed || 0,
      totalCommission: commMap[p.id]?.total || 0,
      pendingCommission: commMap[p.id]?.pending || 0,
      sponsor: p.referred_by ? nameById.get(p.referred_by) ?? null : null,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setFilter = (key: string) => { setPage(1); setSelected(new Set()); const next = new URLSearchParams(params); if (key === "all") next.delete("status"); else next.set("status", key); setParams(next, { replace: true }); };

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const isPending = (s: string) => s === "pending" || s === "onboarding";
  const filtered = useMemo(() => ambassadors.filter((a) => {
    const q = search.trim().toLowerCase();
    const ms = !q || [a.full_name, a.email, a.phone, a.country, occupationLabel(a.occupation)].some((v) => (v || "").toLowerCase().includes(q));
    const mst = statusFilter === "all" || (statusFilter === "pending" ? isPending(a.status) : a.status === statusFilter);
    return ms && mst;
  }), [ambassadors, search, statusFilter]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const counts = {
    total: ambassadors.length,
    pending: ambassadors.filter((a) => isPending(a.status)).length,
    approved: ambassadors.filter((a) => a.status === "approved" || a.status === "pro_pending").length,
    rejected: ambassadors.filter((a) => a.status === "rejected").length,
    suspended: ambassadors.filter((a) => a.status === "suspended").length,
  };

  const callAdminFunction = async (name: string, body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload?.error || "Please try again.");
    return payload;
  };

  const patch = (id: string, status: string) => setAmbassadors((prev) => prev.map((a) => (a.id === id ? { ...a, status, reviewed_at: new Date().toISOString() } : a)));

  const doValidate = async (a: Row) => {
    setActing(a.id);
    try {
      const res = await validateAmbassador(a.id);
      patch(a.id, "approved");
      toast({ title: `${a.full_name || a.email} validated`, description: res.emailSent ? "Welcome email sent." : res.note });
    } catch (e) { toast({ title: "Validation failed", description: (e as Error).message, variant: "destructive" }); }
    finally { setActing(null); }
  };
  const doReject = async (a: Row) => {
    if (!confirm(`Reject ${a.full_name || a.email}? They will not be able to use the dashboard.`)) return;
    setActing(a.id);
    try { await rejectAmbassador(a.id); patch(a.id, "rejected"); toast({ title: "Application rejected" }); }
    catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    finally { setActing(null); }
  };
  const doSuspend = async (a: Row) => {
    setActing(a.id);
    try { await suspendAmbassador(a.id); patch(a.id, "suspended"); toast({ title: "Ambassador suspended" }); }
    catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    finally { setActing(null); }
  };
  const doReactivate = async (a: Row) => {
    setActing(a.id);
    try { await reactivateAmbassador(a.id); patch(a.id, "approved"); toast({ title: "Ambassador reactivated" }); }
    catch (e) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    finally { setActing(null); }
  };
  const handleDelete = async (a: Row) => {
    if (!confirm(`Permanently delete ${a.full_name || a.email || "this ambassador"}? This removes the account, leads, commissions and all related data. This cannot be undone.`)) return;
    try { await callAdminFunction("admin-delete-ambassador", { user_id: a.id }); }
    catch (error) { toast({ title: "Delete failed", description: (error as Error).message, variant: "destructive" }); return; }
    setAmbassadors((prev) => prev.filter((x) => x.id !== a.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(a.id); return n; });
    toast({ title: "Ambassador deleted" });
  };
  const bulkValidate = async () => {
    const targets = ambassadors.filter((a) => selected.has(a.id) && isPending(a.status));
    if (!targets.length) { toast({ title: "No pending application selected" }); return; }
    if (!confirm(`Validate ${targets.length} application(s) and send the welcome email?`)) return;
    for (const a of targets) await doValidate(a);
    setSelected(new Set());
  };
  const handleCreate = async () => {
    setCreateLoading(true);
    try {
      await callAdminFunction("admin-create-ambassador", createForm);
      setCreateForm({ full_name: "", email: "", password: "", phone: "", country: "" });
      setCreateOpen(false);
      toast({ title: "Ambassador created" });
      await load();
    } catch (error) { toast({ title: "Create failed", description: (error as Error).message, variant: "destructive" }); }
    finally { setCreateLoading(false); }
  };
  const toggleSelect = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => (selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map((a) => a.id))));
  const exportCSV = () => {
    const h = ["Name", "Email", "Phone", "Occupation", "Country", "Sponsor", "Status", "Leads", "Deals", "Commission", "Signed up", "Reviewed"];
    const r = filtered.map((a) => [a.full_name || "", a.email || "", a.phone || "", occupationLabel(a.occupation), a.country || "", a.sponsor || "", a.status, a.leadCount, a.dealsClosed, a.totalCommission, new Date(a.created_at).toLocaleDateString(), a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString() : ""]);
    const csv = [h, ...r].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const u = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const el = document.createElement("a"); el.href = u; el.download = "ambassadors.csv"; el.click(); toast({ title: "CSV exported" });
  };
  const statusPill = (status: string) => { const m = STATUS_META[status]; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${m?.className || "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"}`}>{m?.label || status}</span>; };
  const wa = (phone: string | null) => (phone ? `https://wa.me/${phone.replace(/[^\d]/g, "")}` : null);
  const btn = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold disabled:opacity-50";

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Ambassadors</h1>
          <span className="bg-[hsl(var(--dash-accent))] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
          {counts.pending > 0 && <button onClick={() => setFilter("pending")} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20">{counts.pending} to validate</button>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"><Download className="w-3.5 h-3.5" /> Export CSV</button>
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95"><UserPlus className="w-3.5 h-3.5" /> Add Ambassador</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[{ k: "all", l: "Total", v: counts.total }, { k: "pending", l: "Pending validation", v: counts.pending }, { k: "approved", l: "Active", v: counts.approved }, { k: "rejected", l: "Rejected", v: counts.rejected }, { k: "suspended", l: "Suspended", v: counts.suspended }].map((s) => (
          <button key={s.k} onClick={() => setFilter(s.k)} className={`text-left bg-[hsl(var(--dash-card))] rounded-xl border p-4 transition-colors ${statusFilter === s.k ? "border-[hsl(var(--dash-accent))]" : "border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.5)]"}`}>
            <p className={`text-2xl font-bold ${s.k === "pending" && s.v > 0 ? "text-[#F59E0B]" : "text-[hsl(var(--dash-fg))]"}`}>{s.v}</p>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5">{s.l}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /><input type="text" placeholder="Search name, email, phone, occupation..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
        {FILTERS.map((f) => (<button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === f.key ? "bg-[hsl(var(--dash-accent))] text-black" : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"}`}>{f.label}</button>))}
      </div>

      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
              {["Ambassador", "Contact", "Occupation", "Country", "Sponsor", "Status", "Leads", "Commission", "Signed up", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>{paginated.map((a) => (
              <tr key={a.id} className={`border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)] ${isPending(a.status) ? "bg-[#F59E0B]/[.03]" : ""}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" /></td>
                <td className="px-4 py-3"><button onClick={() => navigate(`/admin/ambassadors/${a.id}`)} className="flex items-center gap-3 text-left hover:underline"><div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent)/.12)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--dash-fg))]">{(a.full_name || a.email || "?")[0].toUpperCase()}</div><div><p className="text-sm font-medium text-[hsl(var(--dash-fg))]">{a.full_name || "—"}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{a.profile_type === "pro" ? "Pro" : "Lite"}</p></div></button></td>
                <td className="px-4 py-3"><p className="text-xs text-[hsl(var(--dash-fg))]">{a.email || "—"}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))] flex items-center gap-1.5">{a.phone || "—"}{wa(a.phone) && <a href={wa(a.phone)!} target="_blank" rel="noreferrer" title="WhatsApp" className="text-[#22C55E]"><MessageCircle className="w-3 h-3" /></a>}{a.email && <a href={`mailto:${a.email}`} title="Email" className="text-[hsl(var(--dash-muted-fg))]"><Mail className="w-3 h-3" /></a>}</p></td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{occupationLabel(a.occupation)}</td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{a.country || "—"}</td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{a.sponsor || "—"}</td>
                <td className="px-4 py-3">{statusPill(a.status)}</td>
                <td className="px-4 py-3 text-xs font-medium text-[hsl(var(--dash-fg))]">{a.leadCount}<span className="text-[hsl(var(--dash-muted-fg))]"> · {a.dealsClosed} won</span></td>
                <td className="px-4 py-3 text-xs font-bold text-[hsl(var(--dash-fg))]">AED {fmt(a.totalCommission)}{a.pendingCommission > 0 && <span className="block text-[10px] font-medium text-[#F59E0B]">AED {fmt(a.pendingCommission)} pending</span>}</td>
                <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))] whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {isPending(a.status) && (<>
                      <button onClick={() => doValidate(a)} disabled={acting !== null} className={`${btn} bg-[#22C55E] text-white hover:brightness-95`}>{acting === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Validate</button>
                      <button onClick={() => doReject(a)} disabled={acting !== null} className={`${btn} border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/5`}><X className="w-3 h-3" /> Reject</button>
                    </>)}
                    <DropdownMenu><DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><MoreHorizontal className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => navigate(`/admin/ambassadors/${a.id}`)}><Eye className="w-3.5 h-3.5 mr-2" /> View application</DropdownMenuItem>
                      {a.status === "rejected" && <DropdownMenuItem onClick={() => doValidate(a)}><Check className="w-3.5 h-3.5 mr-2" /> Validate anyway</DropdownMenuItem>}
                      {(a.status === "approved" || a.status === "pro_pending") && <DropdownMenuItem onClick={() => doSuspend(a)}><ShieldOff className="w-3.5 h-3.5 mr-2" /> Suspend</DropdownMenuItem>}
                      {a.status === "suspended" && <DropdownMenuItem onClick={() => doReactivate(a)}><Shield className="w-3.5 h-3.5 mr-2" /> Reactivate</DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => handleDelete(a)} className="text-[#EF4444]"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete permanently</DropdownMenuItem>
                    </DropdownMenuContent></DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length === 0 && <div className="text-center py-16"><Users className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">{statusFilter === "pending" ? "No application waiting" : "No ambassadors found"}</h3><p className="text-xs text-[hsl(var(--dash-muted-fg))]">{statusFilter === "pending" ? "New signups appear here as soon as they verify their email." : "Adjust your filters or invite your first ambassador."}</p></div>}
        {totalPages > 1 && <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]"><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p><div className="flex items-center gap-1"><button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button><button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button></div></div>}
      </div>

      {selected.size > 0 && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--dash-accent))] text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50"><span className="text-sm font-medium">{selected.size} selected</span><button onClick={bulkValidate} disabled={acting !== null} className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-lg disabled:opacity-60">Validate pending</button><button onClick={() => setSelected(new Set())} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-black/20">Clear</button></div>}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[hsl(var(--dash-fg))]">Add Ambassador</DialogTitle><DialogDescription>Create a validated ambassador account that can sign in immediately. No welcome email is sent; share the temporary password yourself.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            {([["full_name", "Full name", "text"], ["email", "Email", "email"], ["password", "Temporary password", "password"], ["phone", "Phone", "text"], ["country", "Country", "text"]] as const).map(([k, ph, t]) => (
              <input key={k} className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder={ph} type={t} value={createForm[k]} onChange={(e) => setCreateForm((f) => ({ ...f, [k]: e.target.value }))} />
            ))}
          </div>
          <DialogFooter><button onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-lg border border-[hsl(var(--dash-border))] text-xs font-semibold text-[hsl(var(--dash-muted-fg))]">Cancel</button><button onClick={handleCreate} disabled={createLoading} className="px-4 py-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-xs font-bold disabled:opacity-60">{createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAmbassadors;
