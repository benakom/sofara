import { useEffect, useState } from "react";
import { stageByKey } from "@/lib/dashboard-data";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, Download, Users, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Shield, ShieldOff, Trash2, UserPlus, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const AdminAmbassadors = () => {
  const navigate = useNavigate();
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ full_name: "", email: "", password: "", phone: "", country: "" });
  const perPage = 25;

  useEffect(() => {
    const fetch = async () => {
      const [profilesRes, leadsRes, commissionsRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, country, status, profile_type, created_at").order("created_at", { ascending: false }),
        supabase.from("leads").select("user_id, stage"),
        supabase.from("commissions").select("user_id, amount, status"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const superAdminIds = new Set((rolesRes.data ?? []).filter(r => r.role === "superadmin").map(r => r.user_id));
      const profiles = (profilesRes.data ?? []).filter(p => !superAdminIds.has(p.id));
      const leads = leadsRes.data ?? [];
      const commissions = commissionsRes.data ?? [];
      const leadsMap: Record<string, { total: number; closed: number }> = {};
      leads.forEach(l => { if (!leadsMap[l.user_id]) leadsMap[l.user_id] = { total: 0, closed: 0 }; leadsMap[l.user_id].total++; if (stageByKey(l.stage).kind === "won") leadsMap[l.user_id].closed++; });
      const commMap: Record<string, { total: number; pending: number }> = {};
      commissions.forEach(c => { if (!commMap[c.user_id]) commMap[c.user_id] = { total: 0, pending: 0 }; commMap[c.user_id].total += Number(c.amount); if (c.status === "estimated") commMap[c.user_id].pending += Number(c.amount); });
      setAmbassadors(profiles.map(p => ({ ...p, leadCount: leadsMap[p.id]?.total || 0, dealsClosed: leadsMap[p.id]?.closed || 0, totalCommission: commMap[p.id]?.total || 0, pendingCommission: commMap[p.id]?.pending || 0 })));
      setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const filtered = ambassadors.filter(a => { const ms = !search || (a.full_name || "").toLowerCase().includes(search.toLowerCase()); const mst = statusFilter === "all" || a.status === statusFilter; return ms && mst; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const callAdminFunction = async (name: string, body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload?.error || "Please try again.");
    return payload;
  };

  const handleStatusChange = async (id: string, s: string) => { await supabase.from("profiles").update({ status: s }).eq("id", id); setAmbassadors(prev => prev.map(a => a.id === id ? { ...a, status: s } : a)); toast({ title: `Ambassador ${s}` }); };
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name || "this ambassador"}? This removes the account, leads, commissions and all related data. This cannot be undone.`)) return;
    try { await callAdminFunction("admin-delete-ambassador", { user_id: id }); }
    catch (error) { toast({ title: "Delete failed", description: (error as Error).message, variant: "destructive" }); return; }
    setAmbassadors(prev => prev.filter(a => a.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Ambassador deleted" });
  };
  const handleCreate = async () => {
    setCreateLoading(true);
    try {
      const payload = await callAdminFunction("admin-create-ambassador", createForm);
      setAmbassadors(prev => [{ ...payload.ambassador, leadCount: 0, dealsClosed: 0, totalCommission: 0, pendingCommission: 0, created_at: new Date().toISOString() }, ...prev]);
      setCreateForm({ full_name: "", email: "", password: "", phone: "", country: "" });
      setCreateOpen(false);
      toast({ title: "Ambassador created" });
    } catch (error) { toast({ title: "Create failed", description: (error as Error).message, variant: "destructive" }); }
    finally { setCreateLoading(false); }
  };
  const toggleSelect = (id: string) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const toggleAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(a => a.id))); };
  const exportCSV = () => { const h = ["Name","Country","Status","Leads","Deals","Commission","Joined"]; const r = filtered.map(a => [a.full_name||"",a.country||"",a.status,a.leadCount,a.dealsClosed,a.totalCommission,new Date(a.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="ambassadors.csv"; a.click(); toast({title:"CSV exported"}); };
  const statusPill = (status: string) => { const m: Record<string,string> = { approved:"bg-[#22C55E]/10 text-[#22C55E]", pending:"bg-[#F59E0B]/10 text-[#F59E0B]", onboarding:"bg-[#F59E0B]/10 text-[#F59E0B]", suspended:"bg-[#EF4444]/10 text-[#EF4444]" }; const l: Record<string,string> = { approved:"Active", pending:"Pending", onboarding:"Onboarding", suspended:"Suspended" }; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[status]||"bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"}`}>{l[status]||status}</span>; };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Ambassadors</h1>
          <span className="bg-[hsl(var(--dash-accent))] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"><Download className="w-3.5 h-3.5" /> Export CSV</button>
          <button onClick={()=>setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95"><UserPlus className="w-3.5 h-3.5" /> Add Ambassador</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:"Total",v:ambassadors.length},{l:"Active",v:ambassadors.filter(a=>a.status==="approved").length},{l:"Pending",v:ambassadors.filter(a=>a.status==="pending"||a.status==="onboarding").length},{l:"Suspended",v:ambassadors.filter(a=>a.status==="suspended").length}].map(s=>(
          <div key={s.l} className="bg-[hsl(var(--dash-card))] rounded-xl border border-[hsl(var(--dash-border))] p-4 "><p className="text-2xl font-bold text-[hsl(var(--dash-fg))]">{s.v}</p><p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5">{s.l}</p></div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /><input type="text" placeholder="Search by name..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
        {["all","approved","pending","suspended"].map(s=>(<button key={s} onClick={()=>{setStatusFilter(s);setPage(1)}} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter===s?"bg-[hsl(var(--dash-accent))] text-black":"bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"}`}>{s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)}</button>))}
      </div>
      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size===paginated.length&&paginated.length>0} onChange={toggleAll} className="rounded" /></th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Ambassador</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Country</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Leads</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Deals</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Commission</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Pending</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">Joined</th>
              <th className="w-12 px-4 py-3"></th>
            </tr></thead>
            <tbody>{paginated.map(a=>(
              <tr key={a.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(a.id)} onChange={()=>toggleSelect(a.id)} className="rounded" /></td>
                <td className="px-4 py-3"><button onClick={()=>navigate(`/admin/ambassadors/${a.id}`)} className="flex items-center gap-3 text-left hover:underline"><div className="w-8 h-8 rounded-full bg-[hsl(var(--dash-accent)/.12)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--dash-fg))]">{(a.full_name||"?")[0]}</div><div><p className="text-sm font-medium text-[hsl(var(--dash-fg))]">{a.full_name||"—"}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{a.phone||"—"}</p></div></button></td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{a.country||"—"}</td>
                <td className="px-4 py-3">{statusPill(a.status)}</td>
                <td className="px-4 py-3 text-xs font-medium text-[hsl(var(--dash-fg))]">{a.leadCount}</td>
                <td className="px-4 py-3 text-xs font-medium text-[hsl(var(--dash-fg))]">{a.dealsClosed}</td>
                <td className="px-4 py-3 text-xs font-bold text-[hsl(var(--dash-fg))]">AED {fmt(a.totalCommission)}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{color:a.pendingCommission>0?"#F59E0B":"#8a8a8a"}}>{a.pendingCommission>0?`AED ${fmt(a.pendingCommission)}`:"—"}</td>
                <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">{new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"})}</td>
                <td className="px-4 py-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><MoreHorizontal className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={()=>navigate(`/admin/ambassadors/${a.id}`)}><Eye className="w-3.5 h-3.5 mr-2" /> View profile</DropdownMenuItem>{a.status!=="approved"&&<DropdownMenuItem onClick={()=>handleStatusChange(a.id,"approved")}><Shield className="w-3.5 h-3.5 mr-2" /> Activate</DropdownMenuItem>}{a.status==="approved"&&<DropdownMenuItem onClick={()=>handleStatusChange(a.id,"suspended")}><ShieldOff className="w-3.5 h-3.5 mr-2" /> Suspend</DropdownMenuItem>}<DropdownMenuItem onClick={()=>handleDelete(a.id,a.full_name)} className="text-[#EF4444]"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete permanently</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><Users className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">No ambassadors found</h3><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Adjust your filters or invite your first ambassador.</p></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]"><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex items-center gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button></div></div>}
      </div>
      {selected.size>0&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--dash-accent))] text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50"><span className="text-sm font-medium">{selected.size} selected</span><button onClick={()=>{selected.forEach(id=>handleStatusChange(id,"approved"));setSelected(new Set())}} className="text-xs font-semibold bg-[hsl(var(--dash-accent))] text-black px-3 py-1.5 rounded-lg hover:brightness-95">Activate</button><button onClick={()=>{selected.forEach(id=>handleStatusChange(id,"suspended"));setSelected(new Set())}} className="text-xs font-semibold bg-[#EF4444] text-white px-3 py-1.5 rounded-lg">Suspend</button></div>}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[hsl(var(--dash-fg))]">Add Ambassador</DialogTitle><DialogDescription>Create a verified ambassador account that can sign in immediately.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <input className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder="Full name" value={createForm.full_name} onChange={e=>setCreateForm(f=>({...f,full_name:e.target.value}))} />
            <input className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder="Email" type="email" value={createForm.email} onChange={e=>setCreateForm(f=>({...f,email:e.target.value}))} />
            <input className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder="Temporary password" type="password" value={createForm.password} onChange={e=>setCreateForm(f=>({...f,password:e.target.value}))} />
            <input className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder="Phone" value={createForm.phone} onChange={e=>setCreateForm(f=>({...f,phone:e.target.value}))} />
            <input className="w-full h-10 rounded-lg border border-[hsl(var(--dash-border))] px-3 text-sm text-[hsl(var(--dash-fg))]" placeholder="Country" value={createForm.country} onChange={e=>setCreateForm(f=>({...f,country:e.target.value}))} />
          </div>
          <DialogFooter><button onClick={()=>setCreateOpen(false)} className="px-4 py-2 rounded-lg border border-[hsl(var(--dash-border))] text-xs font-semibold text-[hsl(var(--dash-muted-fg))]">Cancel</button><button onClick={handleCreate} disabled={createLoading} className="px-4 py-2 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-xs font-bold disabled:opacity-60">{createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAmbassadors;
