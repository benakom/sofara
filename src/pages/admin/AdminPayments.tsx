import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    const fetch = async () => {
      const [payRes, pRes] = await Promise.all([
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name"),
      ]);
      setPayments(payRes.data ?? []); setProfiles(pRes.data ?? []); setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const getName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || "—";
  const filtered = payments.filter(p => { const ms = !search || (p.deal_name||"").toLowerCase().includes(search.toLowerCase()) || getName(p.user_id).toLowerCase().includes(search.toLowerCase()); const mst = statusFilter === "all" || p.status === statusFilter; return ms && mst; });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const handleStatus = async (id: string, s: string) => { await supabase.from("payments").update({ status: s }).eq("id", id); setPayments(prev => prev.map(p => p.id === id ? { ...p, status: s } : p)); toast({ title: `Payment ${s}` }); };
  const pending = payments.filter(p => p.status === "pending");
  const processing = payments.filter(p => p.status === "processing");
  const paid = payments.filter(p => p.status === "paid");
  const statusPill = (s: string) => { const m: Record<string,string> = { pending:"bg-[#F59E0B]/10 text-[#F59E0B]", processing:"bg-[#3B82F6]/10 text-[#3B82F6]", paid:"bg-[#22C55E]/10 text-[#22C55E]" }; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m[s]||"bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"}`}>{s}</span>; };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Payments</h1><button className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--dash-border))] rounded-lg text-xs font-medium text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"><Download className="w-3.5 h-3.5" /> Export</button></div>
      <div className="grid grid-cols-3 gap-3">
        {[{l:"Pending",v:`AED ${fmt(pending.reduce((s,p)=>s+Number(p.amount),0))}`,n:pending.length,c:"#F59E0B"},{l:"Processing",v:`AED ${fmt(processing.reduce((s,p)=>s+Number(p.amount),0))}`,n:processing.length,c:"#3B82F6"},{l:"Paid",v:`AED ${fmt(paid.reduce((s,p)=>s+Number(p.amount),0))}`,n:paid.length,c:"#22C55E"}].map(s=>(<div key={s.l} className="bg-[hsl(var(--dash-card))] rounded-xl border border-[hsl(var(--dash-border))] p-4 "><p className="text-lg font-bold text-[hsl(var(--dash-fg))]">{s.v}</p><p className="text-[11px] font-medium mt-0.5" style={{color:s.c}}>{s.l} ({s.n})</p></div>))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /><input type="text" placeholder="Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
        {["all","pending","processing","paid"].map(s=>(<button key={s} onClick={()=>{setStatusFilter(s);setPage(1)}} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter===s?"bg-[hsl(var(--dash-accent))] text-black":"bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))]"}`}>{s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)}</button>))}
      </div>
      <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]"><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Ambassador</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Reference</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Deal</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Amount</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Status</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Date</th><th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Actions</th></tr></thead>
            <tbody>{paginated.map(p=>(<tr key={p.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]"><td className="px-4 py-3 text-sm font-medium text-[hsl(var(--dash-fg))]">{getName(p.user_id)}</td><td className="px-4 py-3 text-xs font-mono text-[hsl(var(--dash-muted-fg))]">{p.reference}</td><td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{p.deal_name||"—"}</td><td className="px-4 py-3 text-sm font-bold text-[hsl(var(--dash-fg))]">AED {fmt(p.amount)}</td><td className="px-4 py-3">{statusPill(p.status)}</td><td className="px-4 py-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">{new Date(p.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td><td className="px-4 py-3">{p.status==="pending"&&<button onClick={()=>handleStatus(p.id,"paid")} className="px-2.5 py-1 rounded-md bg-[#22C55E] text-[10px] font-bold text-white">Pay</button>}{p.status==="processing"&&<button onClick={()=>handleStatus(p.id,"paid")} className="px-2.5 py-1 rounded-md bg-[#22C55E] text-[10px] font-bold text-white">Complete</button>}{p.status==="paid"&&<span className="text-[10px] text-[hsl(var(--dash-muted-fg))]">Done</span>}</td></tr>))}</tbody>
          </table>
        </div>
        {paginated.length===0&&<div className="text-center py-16"><CreditCard className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" /><h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">No payments found</h3></div>}
        {totalPages>1&&<div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dash-border))]"><p className="text-xs text-[hsl(var(--dash-muted-fg))]">Showing {((page-1)*perPage)+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length}</p><div className="flex gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
      </div>
    </div>
  );
};

export default AdminPayments;
