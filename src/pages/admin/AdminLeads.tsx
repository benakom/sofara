import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, Download, Target, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const stages = ["nouveau", "contacté", "qualifié", "négociation", "closing", "perdu"];

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
  const filtered = leads.filter(l => { const ms = !search || `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()); const mst = stageFilter === "all" || l.stage === stageFilter; const ma = ambassadorFilter === "all" || l.user_id === ambassadorFilter; return ms && mst && ma; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const handleStageChange = async (id: string, stage: string) => { await supabase.from("leads").update({ stage }).eq("id", id); setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l)); toast({ title: `Lead → ${stage}` }); };
  const exportCSV = () => { const h = ["Name","Ambassador","Stage","Score","Email","Phone","Source","Created"]; const r = filtered.map(l => [`${l.first_name} ${l.last_name}`,getAmbName(l.user_id),l.stage,l.score,l.email,l.phone,l.source,new Date(l.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="leads.csv"; a.click(); };
  const scoreBadge = (s: string|null) => { const c: Record<string,string> = {A:"#22C55E",B:"#D2F34C",C:"#F59E0B",D:"#EF4444"}; const color = c[s||"C"]||"#9CA3AF"; return <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{borderColor:color,color}}>{s||"C"}</div>; };
  const uniqueAmbs = Array.from(new Set(leads.map(l => l.user_id))).map(uid => ({ id: uid, name: getAmbName(uid) }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#1A1A1E] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3"><h1 className="text-xl font-bold text-[#1A1A1E]">All Leads</h1><span className="bg-[#D2F34C] text-[#1A1A1E] text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span></div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB]"><Download className="w-3.5 h-3.5" /> Export CSV</button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" /><input type="text" placeholder="Search leads..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50" /></div>
        <select value={stageFilter} onChange={e=>{setStageFilter(e.target.value);setPage(1)}} className="h-9 px-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#6B7280]"><option value="all">All Stages</option>{stages.map(s=><option key={s} value={s}>{s}</option>)}</select>
        <select value={ambassadorFilter} onChange={e=>{setAmbassadorFilter(e.target.value);setPage(1)}} className="h-9 px-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#6B7280]"><option value="all">All Ambassadors</option>{uniqueAmbs.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Lead</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Ambassador</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Stage</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Score</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Contact</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Source</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Created</th>
              <th className="w-12"></th>
            </tr></thead>
            <tbody>{paginated.map(l=>(
              <tr key={l.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1A1E]">{l.first_name} {l.last_name}</td>
                <td className="px-4 py-3"><button onClick={()=>navigate(`/admin/ambassadors/${l.user_id}`)} className="text-xs text-[#6B7280] hover:text-[#D2F34C] hover:underline">{getAmbName(l.user_id)}</button></td>
                <td className="px-4 py-3"><select value={l.stage||"nouveau"} onChange={e=>handleStageChange(l.id,e.target.value)} className="text-[10px] font-semibold border-none bg-transparent cursor-pointer">{stages.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
                <td className="px-4 py-3">{scoreBadge(l.score)}</td>
                <td className="px-4 py-3"><p className="text-[10px] text-[#6B7280]">{l.email||"—"}</p><p className="text-[10px] text-[#9CA3AF]">{l.phone||"—"}</p></td>
                <td className="px-4 py-3 text-xs text-[#9CA3AF]">{l.source||"—"}</td>
                <td className="px-4 py-3 text-[11px] text-[#9CA3AF]">{new Date(l.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td>
                <td className="px-4 py-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" /></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View</DropdownMenuItem><DropdownMenuItem onClick={()=>handleStageChange(l.id,"perdu")} className="text-[#EF4444]"><Trash2 className="w-3.5 h-3.5 mr-2" /> Mark Lost</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><Target className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[#1A1A1E] mb-1">No leads found</h3></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]"><p className="text-xs text-[#9CA3AF]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
      </div>
    </div>
  );
};

export default AdminLeads;
