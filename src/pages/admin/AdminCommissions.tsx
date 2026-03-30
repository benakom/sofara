import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, DollarSign, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminCommissions = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    const fetch = async () => {
      const [cRes, pRes] = await Promise.all([
        supabase.from("commissions").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name"),
      ]);
      setCommissions(cRes.data ?? []); setProfiles(pRes.data ?? []); setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const getName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || "—";
  const tabs = ["all", "estimated", "confirmed", "paid", "rejected"];
  const filtered = commissions.filter(c => { const mt = tab === "all" || c.status === tab; const ms = !search || c.deal_name.toLowerCase().includes(search.toLowerCase()) || getName(c.user_id).toLowerCase().includes(search.toLowerCase()); return mt && ms; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const handleStatus = async (id: string, status: string) => { await supabase.from("commissions").update({ status }).eq("id", id); setCommissions(prev => prev.map(c => c.id === id ? { ...c, status } : c)); toast({ title: `Commission ${status}` }); };
  const totalPaid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
  const totalPending = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
  const totalApproved = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
  const thisMonth = commissions.filter(c => { const d = new Date(c.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).reduce((s, c) => s + Number(c.amount), 0);
  const statusPill = (s: string) => { const m: Record<string,string> = { estimated:"bg-[#F59E0B]/10 text-[#F59E0B]", confirmed:"bg-[#3B82F6]/10 text-[#3B82F6]", paid:"bg-[#22C55E]/10 text-[#22C55E]", rejected:"bg-[#EF4444]/10 text-[#EF4444]" }; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[s]||"bg-[#9CA3AF]/10 text-[#9CA3AF]"}`}>{s}</span>; };
  const exportCSV = () => { const h = ["Ambassador","Deal","Amount","Status","Date"]; const r = filtered.map(c => [getName(c.user_id),c.deal_name,c.amount,c.status,new Date(c.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="commissions.csv"; a.click(); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#154B3B] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-[#154B3B]">Commissions</h1><button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB]"><Download className="w-3.5 h-3.5" /> Export</button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:"Total Paid",v:`AED ${fmt(totalPaid)}`,c:"#22C55E"},{l:"Pending Approval",v:`AED ${fmt(totalPending)}`,c:"#F59E0B"},{l:"Approved",v:`AED ${fmt(totalApproved)}`,c:"#3B82F6"},{l:"This Month",v:`AED ${fmt(thisMonth)}`,c:"#154B3B"}].map(s=>(<div key={s.l} className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"><p className="text-lg font-bold text-[#154B3B]">{s.v}</p><p className="text-[11px] font-medium mt-0.5" style={{color:s.c}}>{s.l}</p></div>))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-[#F5F5F7] p-1 rounded-lg">{tabs.map(t=>(<button key={t} onClick={()=>{setTab(t);setPage(1)}} className={`px-3 py-1.5 rounded-md text-xs font-medium ${tab===t?"bg-white text-[#154B3B] shadow-sm":"text-[#6B7280]"}`}>{t==="all"?"All":t.charAt(0).toUpperCase()+t.slice(1)}</button>))}</div>
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" /><input type="text" placeholder="Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50" /></div>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]"><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Ambassador</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Deal</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Amount</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Status</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Date</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Actions</th></tr></thead>
            <tbody>{paginated.map(c=>(
              <tr key={c.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-sm font-medium text-[#154B3B]">{getName(c.user_id)}</td>
                <td className="px-4 py-3 text-xs text-[#6B7280]">{c.deal_name}</td>
                <td className="px-4 py-3 text-sm font-bold text-[#154B3B]">AED {fmt(c.amount)}</td>
                <td className="px-4 py-3">{statusPill(c.status)}</td>
                <td className="px-4 py-3 text-[11px] text-[#9CA3AF]">{new Date(c.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1">
                  {c.status==="estimated"&&<><button onClick={()=>handleStatus(c.id,"confirmed")} className="px-2.5 py-1 rounded-md bg-[#D2F34C] text-[10px] font-bold text-black hover:bg-[#BDE040]">Approve</button><button onClick={()=>handleStatus(c.id,"rejected")} className="px-2.5 py-1 rounded-md border border-[#EF4444]/30 text-[10px] font-bold text-[#EF4444]">Reject</button></>}
                  {c.status==="confirmed"&&<button onClick={()=>handleStatus(c.id,"paid")} className="px-2.5 py-1 rounded-md bg-[#22C55E] text-[10px] font-bold text-white">Mark Paid</button>}
                  {c.status==="rejected"&&<button onClick={()=>handleStatus(c.id,"estimated")} className="px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[10px] text-[#6B7280] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reopen</button>}
                  {c.status==="paid"&&<span className="text-[10px] text-[#9CA3AF]">Done</span>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><DollarSign className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[#154B3B]">No commissions found</h3></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]"><p className="text-xs text-[#9CA3AF]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
      </div>
    </div>
  );
};

export default AdminCommissions;
