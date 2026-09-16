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
  const tabs = ["all", "estimated", "validated", "paid", "rejected"];
  const filtered = commissions.filter(c => { const mt = tab === "all" || c.status === tab; const ms = !search || c.deal_name.toLowerCase().includes(search.toLowerCase()) || getName(c.user_id).toLowerCase().includes(search.toLowerCase()); return mt && ms; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const handleStatus = async (id: string, status: string) => { await supabase.from("commissions").update({ status }).eq("id", id); setCommissions(prev => prev.map(c => c.id === id ? { ...c, status } : c)); toast({ title: `Commission ${status}` }); };
  const totalPaid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
  const totalPending = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
  const totalApproved = commissions.filter(c => c.status === "validated").reduce((s, c) => s + Number(c.amount), 0);
  const thisMonth = commissions.filter(c => { const d = new Date(c.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).reduce((s, c) => s + Number(c.amount), 0);
  const statusPill = (s: string) => { const m: Record<string,string> = { estimated:"bg-[#F59E0B]/10 text-[#F59E0B]", validated:"bg-[#3B82F6]/10 text-[#3B82F6]", paid:"bg-[#22C55E]/10 text-[#22C55E]", rejected:"bg-[#EF4444]/10 text-[#EF4444]" }; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[s]||"bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"}`}>{s}</span>; };
  const exportCSV = () => { const h = ["Ambassador","Deal","Amount","Status","Date"]; const r = filtered.map(c => [getName(c.user_id),c.deal_name,c.amount,c.status,new Date(c.created_at).toLocaleDateString()]); const csv = [h,...r].map(r=>r.join(",")).join("\n"); const b = new Blob([csv],{type:"text/csv"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="commissions.csv"; a.click(); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Commissions</h1><button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"><Download className="w-3.5 h-3.5" /> Export</button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:"Total Paid",v:`AED ${fmt(totalPaid)}`,c:"#22C55E"},{l:"Pending Approval",v:`AED ${fmt(totalPending)}`,c:"#F59E0B"},{l:"Approved",v:`AED ${fmt(totalApproved)}`,c:"#3B82F6"},{l:"This Month",v:`AED ${fmt(thisMonth)}`,c:"#D2F34C"}].map(s=>(<div key={s.l} className="bg-[hsl(var(--dash-card))] rounded-xl border border-[hsl(var(--dash-border))] p-4 "><p className="text-lg font-bold text-[hsl(var(--dash-fg))]">{s.v}</p><p className="text-[11px] font-medium mt-0.5" style={{color:s.c}}>{s.l}</p></div>))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-[hsl(var(--dash-muted)/.4)] p-1 rounded-lg">{tabs.map(t=>(<button key={t} onClick={()=>{setTab(t);setPage(1)}} className={`px-3 py-1.5 rounded-md text-xs font-medium ${tab===t?"bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-fg))] shadow-sm":"text-[hsl(var(--dash-muted-fg))]"}`}>{t==="all"?"All":t.charAt(0).toUpperCase()+t.slice(1)}</button>))}</div>
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /><input type="text" placeholder="Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
      </div>
      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]"><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Ambassador</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Deal</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Amount</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Status</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Date</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Actions</th></tr></thead>
            <tbody>{paginated.map(c=>(
              <tr key={c.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                <td className="px-4 py-3 text-sm font-medium text-[hsl(var(--dash-fg))]">{getName(c.user_id)}</td>
                <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{c.deal_name}</td>
                <td className="px-4 py-3 text-sm font-bold text-[hsl(var(--dash-fg))]">AED {fmt(c.amount)}</td>
                <td className="px-4 py-3">{statusPill(c.status)}</td>
                <td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">{new Date(c.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1">
                  {c.status==="estimated"&&<><button onClick={()=>handleStatus(c.id,"validated")} className="px-2.5 py-1 rounded-md bg-[hsl(var(--dash-accent))] text-[10px] font-bold text-black hover:brightness-95">Approve</button><button onClick={()=>handleStatus(c.id,"rejected")} className="px-2.5 py-1 rounded-md border border-[#EF4444]/30 text-[10px] font-bold text-[#EF4444]">Reject</button></>}
                  {c.status==="validated"&&<button onClick={()=>handleStatus(c.id,"paid")} className="px-2.5 py-1 rounded-md bg-[#22C55E] text-[10px] font-bold text-white">Mark Paid</button>}
                  {c.status==="rejected"&&<button onClick={()=>handleStatus(c.id,"estimated")} className="px-2.5 py-1 rounded-md border border-[hsl(var(--dash-border))] text-[10px] text-[hsl(var(--dash-muted-fg))] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reopen</button>}
                  {c.status==="paid"&&<span className="text-[10px] text-[hsl(var(--dash-muted-fg))]">Done</span>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><DollarSign className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">No commissions found</h3></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]"><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
      </div>
    </div>
  );
};

export default AdminCommissions;
