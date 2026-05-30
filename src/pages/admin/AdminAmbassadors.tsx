import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, Download, Users, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Shield, ShieldOff, Trash2, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const AdminAmbassadors = () => {
  const navigate = useNavigate();
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const perPage = 25;

  useEffect(() => {
    const fetch = async () => {
      const [profilesRes, leadsRes, commissionsRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, country, status, profile_type, created_at").order("created_at", { ascending: false }),
        supabase.from("leads").select("user_id, stage"),
        supabase.from("commissions").select("user_id, amount, status"),
      ]);
      const profiles = profilesRes.data ?? [];
      const leads = leadsRes.data ?? [];
      const commissions = commissionsRes.data ?? [];
      const leadsMap: Record<string, { total: number; closed: number }> = {};
      leads.forEach(l => { if (!leadsMap[l.user_id]) leadsMap[l.user_id] = { total: 0, closed: 0 }; leadsMap[l.user_id].total++; if (l.stage === "closing") leadsMap[l.user_id].closed++; });
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

  const handleStatusChange = async (id: string, s: string) => { await supabase.from("profiles").update({ status: s }).eq("id", id); setAmbassadors(prev => prev.map(a => a.id === id ? { ...a, status: s } : a)); toast({ title: `Ambassador ${s}` }); };
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name || "this ambassador"}? This removes the account, leads, commissions and all related data. This cannot be undone.`)) return;
    const { error } = await supabase.functions.invoke("admin-delete-ambassador", { body: { user_id: id } });
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setAmbassadors(prev => prev.filter(a => a.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Ambassador deleted" });
  };
  const toggleSelect = (id: string) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const toggleAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(a => a.id))); };
  const exportCSV = () => { const h = ["Name","Country","Status","Leads","Deals","Commission","Joined"]; const r = filtered.map(a => [a.full_name||"",a.country||"",a.status,a.leadCount,a.dealsClosed,a.totalCommission,new Date(a.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="ambassadors.csv"; a.click(); toast({title:"CSV exported"}); };
  const statusPill = (status: string) => { const m: Record<string,string> = { approved:"bg-[#22C55E]/10 text-[#22C55E]", pending:"bg-[#F59E0B]/10 text-[#F59E0B]", onboarding:"bg-[#F59E0B]/10 text-[#F59E0B]", suspended:"bg-[#EF4444]/10 text-[#EF4444]" }; const l: Record<string,string> = { approved:"Active", pending:"Pending", onboarding:"Onboarding", suspended:"Suspended" }; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[status]||"bg-[#9CA3AF]/10 text-[#9CA3AF]"}`}>{l[status]||status}</span>; };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#154B3B] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#154B3B]">Ambassadors</h1>
          <span className="bg-[#D2F34C] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB]"><Download className="w-3.5 h-3.5" /> Export CSV</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040]"><UserPlus className="w-3.5 h-3.5" /> Add Ambassador</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:"Total",v:ambassadors.length},{l:"Active",v:ambassadors.filter(a=>a.status==="approved").length},{l:"Pending",v:ambassadors.filter(a=>a.status==="pending"||a.status==="onboarding").length},{l:"Suspended",v:ambassadors.filter(a=>a.status==="suspended").length}].map(s=>(
          <div key={s.l} className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"><p className="text-2xl font-bold text-[#154B3B]">{s.v}</p><p className="text-[11px] text-[#6B7280] mt-0.5">{s.l}</p></div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" /><input type="text" placeholder="Search by name..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#154B3B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50" /></div>
        {["all","approved","pending","suspended"].map(s=>(<button key={s} onClick={()=>{setStatusFilter(s);setPage(1)}} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter===s?"bg-[#154B3B] text-white":"bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"}`}>{s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)}</button>))}
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size===paginated.length&&paginated.length>0} onChange={toggleAll} className="rounded" /></th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Ambassador</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Country</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Leads</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Deals</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Commission</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Pending</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Joined</th>
              <th className="w-12 px-4 py-3"></th>
            </tr></thead>
            <tbody>{paginated.map(a=>(
              <tr key={a.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(a.id)} onChange={()=>toggleSelect(a.id)} className="rounded" /></td>
                <td className="px-4 py-3"><button onClick={()=>navigate(`/admin/ambassadors/${a.id}`)} className="flex items-center gap-3 text-left hover:underline"><div className="w-8 h-8 rounded-full bg-[#154B3B]/10 flex items-center justify-center text-[10px] font-bold text-[#154B3B]">{(a.full_name||"?")[0]}</div><div><p className="text-sm font-medium text-[#154B3B]">{a.full_name||"—"}</p><p className="text-[10px] text-[#9CA3AF]">{a.phone||"—"}</p></div></button></td>
                <td className="px-4 py-3 text-xs text-[#6B7280]">{a.country||"—"}</td>
                <td className="px-4 py-3">{statusPill(a.status)}</td>
                <td className="px-4 py-3 text-xs font-medium text-[#154B3B]">{a.leadCount}</td>
                <td className="px-4 py-3 text-xs font-medium text-[#154B3B]">{a.dealsClosed}</td>
                <td className="px-4 py-3 text-xs font-bold text-[#154B3B]">AED {fmt(a.totalCommission)}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{color:a.pendingCommission>0?"#F59E0B":"#9CA3AF"}}>{a.pendingCommission>0?`AED ${fmt(a.pendingCommission)}`:"—"}</td>
                <td className="px-4 py-3 text-[11px] text-[#9CA3AF]">{new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"})}</td>
                <td className="px-4 py-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={()=>navigate(`/admin/ambassadors/${a.id}`)}><Eye className="w-3.5 h-3.5 mr-2" /> View profile</DropdownMenuItem>{a.status!=="approved"&&<DropdownMenuItem onClick={()=>handleStatusChange(a.id,"approved")}><Shield className="w-3.5 h-3.5 mr-2" /> Activate</DropdownMenuItem>}{a.status==="approved"&&<DropdownMenuItem onClick={()=>handleStatusChange(a.id,"suspended")}><ShieldOff className="w-3.5 h-3.5 mr-2" /> Suspend</DropdownMenuItem>}<DropdownMenuItem onClick={()=>handleStatusChange(a.id,"suspended")} className="text-[#EF4444]"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><Users className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[#154B3B] mb-1">No ambassadors found</h3><p className="text-xs text-[#9CA3AF]">Adjust your filters or invite your first ambassador.</p></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]"><p className="text-xs text-[#9CA3AF]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex items-center gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-[#6B7280]" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronRight className="w-4 h-4 text-[#6B7280]" /></button></div></div>}
      </div>
      {selected.size>0&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#154B3B] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50"><span className="text-sm font-medium">{selected.size} selected</span><button onClick={()=>{selected.forEach(id=>handleStatusChange(id,"approved"));setSelected(new Set())}} className="text-xs font-semibold bg-[#D2F34C] text-black px-3 py-1.5 rounded-lg hover:bg-[#BDE040]">Activate</button><button onClick={()=>{selected.forEach(id=>handleStatusChange(id,"suspended"));setSelected(new Set())}} className="text-xs font-semibold bg-[#EF4444] text-white px-3 py-1.5 rounded-lg">Suspend</button></div>}
    </div>
  );
};

export default AdminAmbassadors;
