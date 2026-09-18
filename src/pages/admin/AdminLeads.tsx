import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, Download, Target, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

import { STAGES as CANON, stageByKey, stageLabel } from "@/lib/dashboard-data";
const stages = CANON.map((s) => s.key);

const AdminLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [ambassadorFilter, setAmbassadorFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    const fetch = async () => {
      const [lRes, pRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name"),
      ]);
      setLeads(lRes.data ?? []); setProfiles(pRes.data ?? []); setLoading(false);
    };
    fetch();
  }, []);

  const getAmbName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || "—";
  const filtered = leads.filter(l => { const ms = !search || `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()); const mst = stageFilter === "all" || stageByKey(l.stage).key === stageFilter; const ma = ambassadorFilter === "all" || l.user_id === ambassadorFilter; return ms && mst && ma; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const handleStageChange = async (id: string, stage: string) => { await supabase.from("leads").update({ stage }).eq("id", id); setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l)); toast({ title: `Lead → ${stage}` }); };
  const exportCSV = () => { const h = ["Name","Ambassador","Stage","Score","Email","Phone","Source","Created"]; const r = filtered.map(l => [`${l.first_name} ${l.last_name}`,getAmbName(l.user_id),l.stage,l.score,l.email,l.phone,l.source,new Date(l.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="leads.csv"; a.click(); };
  const scoreBadge = (s: string|null) => { const c: Record<string,string> = {A:"#22C55E",B:"#6B8F1F",C:"#F59E0B",D:"#EF4444"}; const color = c[s||"C"]||"#8a8a8a"; return <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{borderColor:color,color}}>{s||"C"}</div>; };
  const uniqueAmbs = Array.from(new Set(leads.map(l => l.user_id))).map(uid => ({ id: uid, name: getAmbName(uid) }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3"><h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">All Leads</h1><span className="bg-[hsl(var(--dash-accent))] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span></div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"><Download className="w-3.5 h-3.5" /> Export CSV</button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /><input type="text" placeholder="Search leads..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
        <select value={stageFilter} onChange={e=>{setStageFilter(e.target.value);setPage(1)}} className="h-9 px-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-muted-fg))]"><option value="all">All Stages</option>{stages.map(s=><option key={s} value={s}>{stageLabel(s, "en")}</option>)}</select>
        <select value={ambassadorFilter} onChange={e=>{setAmbassadorFilter(e.target.value);setPage(1)}} className="h-9 px-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-muted-fg))]"><option value="all">All Ambassadors</option>{uniqueAmbs.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>
      </div>
      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Lead</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Ambassador</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Stage</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Score</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Contact</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Source</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Created</th>
              <th className="w-12"></th>
            </tr></thead>
            <tbody>{paginated.map(l=>(
              <tr key={l.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                <td className="px-4 py-3 text-sm font-medium text-[hsl(var(--dash-fg))]">{l.first_name} {l.last_name}</td>
                <td className="px-4 py-3"><button onClick={()=>navigate(`/admin/ambassadors/${l.user_id}`)} className="text-xs text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-accent-ink))] hover:underline">{getAmbName(l.user_id)}</button></td>
                <td className="px-4 py-3"><select value={stageByKey(l.stage).key} onChange={e=>handleStageChange(l.id,e.target.value)} className="text-[10px] font-semibold border-none bg-transparent cursor-pointer">{stages.map(s=><option key={s} value={s}>{stageLabel(s, "en")}</option>)}</select></td>
                <td className="px-4 py-3">{scoreBadge(l.score)}</td>
                <td className="px-4 py-3"><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{l.email||"—"}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{l.phone||"—"}</p></td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{l.source||"—"}</td>
                <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">{new Date(l.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td>
                <td className="px-4 py-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><MoreHorizontal className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View</DropdownMenuItem><DropdownMenuItem onClick={()=>handleStageChange(l.id,"injoignable")} className="text-[#EF4444]"><Trash2 className="w-3.5 h-3.5 mr-2" /> Mark unreachable</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><Target className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">No leads found</h3></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]"><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
      </div>
    </div>
  );
};

export default AdminLeads;
