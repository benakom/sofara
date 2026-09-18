import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stageByKey, stageLabel } from "@/lib/dashboard-data";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, ShieldOff, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AdminAmbassadorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [pRes, lRes, cRes, refRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("leads").select("*").eq("user_id", id).order("created_at", { ascending: false }),
        supabase.from("commissions").select("*").eq("user_id", id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, created_at, status").eq("referred_by", id),
      ]);
      setProfile(pRes.data); setLeads(lRes.data ?? []); setCommissions(cRes.data ?? []); setReferrals(refRes.data ?? []); setLoading(false);
    };
    fetch();
  }, [id]);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const handleStatusChange = async (s: string) => { await supabase.from("profiles").update({ status: s }).eq("id", id); setProfile((p: any) => ({ ...p, status: s })); toast({ title: `Status → ${s}` }); };
  const handleSave = async () => { if (!profile) return; await supabase.from("profiles").update({ full_name: profile.full_name, phone: profile.phone, country: profile.country }).eq("id", id); toast({ title: "Saved" }); };

  if (loading || !profile) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  const totalComm = commissions.reduce((s, c) => s + Number(c.amount), 0);
  const qualifiedLeads = leads.filter(l => ["qualifie", "offre_envoyee", "offre_acceptee", "booking", "dp_paye"].includes(stageByKey(l.stage).key));
  const qualifiedRate = leads.length > 0 ? Math.round(qualifiedLeads.length / leads.length * 100) : 0;
  const closedDeals = leads.filter(l => stageByKey(l.stage).kind === "won").length;
  const monthlyLeads: Record<string, number> = {};
  leads.forEach(l => { const m = new Date(l.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" }); monthlyLeads[m] = (monthlyLeads[m] || 0) + 1; });
  const leadsChart = Object.entries(monthlyLeads).reverse().slice(-8).map(([month, count]) => ({ month, count }));
  const statusPill = (s: string) => { const m: Record<string,string> = { approved:"bg-[#22C55E]/10 text-[#22C55E]", pending:"bg-[#F59E0B]/10 text-[#F59E0B]", suspended:"bg-[#EF4444]/10 text-[#EF4444]" }; return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${m[s]||"bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"}`}>{s}</span>; };
  const stagePill = (s: string) => { const st = stageByKey(s); const c = st.kind === "lost" ? "bg-[hsl(38,92%,50%/.12)] text-[hsl(38,92%,60%)]" : st.kind === "won" ? "bg-[hsl(var(--dash-accent)/.2)] text-[hsl(var(--dash-accent-ink))]" : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))]"; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c}`}>{stageLabel(s, "en")}</span>; };

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/ambassadors")} className="p-2 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><ArrowLeft className="w-5 h-5 text-[hsl(var(--dash-muted-fg))]" /></button>
          <div><div className="flex items-center gap-3"><h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">{profile.full_name || "—"}</h1>{statusPill(profile.status)}</div><p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5">Joined {new Date(profile.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95"><Save className="w-3.5 h-3.5" /> Save</button>
          {profile.status === "approved" ? <button onClick={() => handleStatusChange("suspended")} className="flex items-center gap-2 px-3 py-2 border border-[#EF4444]/30 text-[#EF4444] rounded-lg text-xs font-medium hover:bg-[#EF4444]/5"><ShieldOff className="w-3.5 h-3.5" /> Suspend</button> : <button onClick={() => handleStatusChange("approved")} className="px-3 py-2 bg-[#22C55E] text-white rounded-lg text-xs font-bold">Activate</button>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-6 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-4">Profile Information</h2>
            <div className="flex items-start gap-5 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D2F34C] to-[#BDE040] flex items-center justify-center text-2xl font-bold text-black">{(profile.full_name||"?")[0]}</div>
              <div className="flex-1 space-y-3">
                <div><label className="text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Full Name</label><input value={profile.full_name||""} onChange={e=>setProfile({...profile,full_name:e.target.value})} className="w-full h-9 px-3 mt-1 rounded-lg border border-[hsl(var(--dash-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Phone</label><input value={profile.phone||""} onChange={e=>setProfile({...profile,phone:e.target.value})} className="w-full h-9 px-3 mt-1 rounded-lg border border-[hsl(var(--dash-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
                  <div><label className="text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Country</label><input value={profile.country||""} onChange={e=>setProfile({...profile,country:e.target.value})} className="w-full h-9 px-3 mt-1 rounded-lg border border-[hsl(var(--dash-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" /></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[hsl(var(--dash-muted)/.4)] rounded-lg p-3 flex items-center gap-2"><span className="text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))]">Referral Code:</span><span className="text-xs font-mono font-bold text-[hsl(var(--dash-fg))]">{profile.referral_code||"—"}</span>{profile.referral_code&&<button onClick={()=>{navigator.clipboard.writeText(profile.referral_code);toast({title:"Copied!"})}}><Copy className="w-3 h-3 text-[hsl(var(--dash-muted-fg))]" /></button>}</div>
              <div className="bg-[hsl(var(--dash-muted)/.4)] rounded-lg p-3"><span className="text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))]">Type: </span><span className="text-xs font-bold text-[hsl(var(--dash-fg))]">{profile.profile_type||"—"}</span></div>
            </div>
          </div>
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-6 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {[{l:"Total Leads",v:leads.length},{l:"Qualified",v:`${qualifiedLeads.length} (${qualifiedRate}%)`},{l:"Deals Closed",v:closedDeals},{l:"Commission",v:`AED ${fmt(totalComm)}`}].map(m=>(<div key={m.l} className="bg-[hsl(var(--dash-muted)/.4)] rounded-xl p-3"><p className="text-lg font-bold text-[hsl(var(--dash-fg))]">{m.v}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{m.l}</p></div>))}
            </div>
            {leadsChart.length>0&&<ResponsiveContainer width="100%" height={160}><LineChart data={leadsChart}><CartesianGrid strokeDasharray="3 3" stroke="#E3E8E4" /><XAxis dataKey="month" tick={{fontSize:10,fill:"#8a8a8a"}} axisLine={false} tickLine={false} /><YAxis tick={{fontSize:10,fill:"#8a8a8a"}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{background:"#0d3a2b",border:"none",borderRadius:8,fontSize:11,color:"#fff"}} /><Line type="monotone" dataKey="count" stroke="#6B8F1F" strokeWidth={2} dot={{fill:"#6B8F1F",r:3}} /></LineChart></ResponsiveContainer>}
          </div>
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-6 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-4">Commission History</h2>
            {commissions.length>0?<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-[hsl(var(--dash-border))]"><th className="text-left py-2 text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Date</th><th className="text-left py-2 text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Deal</th><th className="text-left py-2 text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Amount</th><th className="text-left py-2 text-[10px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Status</th></tr></thead><tbody>{commissions.map(c=>(<tr key={c.id} className="border-b border-[hsl(var(--dash-border))]"><td className="py-2 text-xs text-[hsl(var(--dash-muted-fg))]">{new Date(c.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td><td className="py-2 text-xs font-medium text-[hsl(var(--dash-fg))]">{c.deal_name}</td><td className="py-2 text-xs font-bold text-[hsl(var(--dash-fg))]">AED {fmt(c.amount)}</td><td className="py-2">{statusPill(c.status)}</td></tr>))}</tbody></table></div>:<p className="text-xs text-[hsl(var(--dash-muted-fg))] text-center py-6">No commissions yet</p>}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-3">Lead Activity</h2>
            <div className="space-y-0">{leads.slice(0,15).map((l,i)=>(<div key={l.id} className={`flex items-center gap-3 py-2.5 ${i<leads.length-1?"border-b border-[hsl(var(--dash-border))]":""}`}><div className="flex-1 min-w-0"><p className="text-xs font-medium text-[hsl(var(--dash-fg))] truncate">{l.first_name} {l.last_name}</p><p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{new Date(l.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</p></div>{stagePill(l.stage||"nouveau")}</div>))}{leads.length===0&&<p className="text-xs text-[hsl(var(--dash-muted-fg))] text-center py-6">No leads yet</p>}</div>
          </div>
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-3">Referrals ({referrals.length})</h2>
            <div className="space-y-0">{referrals.map((r,i)=>(<div key={r.id} className={`flex items-center gap-3 py-2.5 ${i<referrals.length-1?"border-b border-[hsl(var(--dash-border))]":""}`}><div className="w-7 h-7 rounded-full bg-[hsl(var(--dash-accent)/.12)] flex items-center justify-center text-[9px] font-bold text-[hsl(var(--dash-fg))]">{(r.full_name||"?")[0]}</div><div className="flex-1 min-w-0"><p className="text-xs font-medium text-[hsl(var(--dash-fg))] truncate">{r.full_name||"—"}</p></div>{statusPill(r.status)}</div>))}{referrals.length===0&&<p className="text-xs text-[hsl(var(--dash-muted-fg))] text-center py-6">No referrals</p>}</div>
          </div>
          <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5 ">
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-4">Admin Controls</h2>
            <div className="space-y-3">{["Can Submit Leads","Commission Payouts","WhatsApp AI Copilot","Qualify Lead AI","Project Matching AI","Scripts & Objections AI","Referral Program"].map(label=>(<div key={label} className="flex items-center justify-between py-1"><span className="text-xs text-[hsl(var(--dash-muted-fg))]">{label}</span><Switch defaultChecked={profile.status==="approved"} onCheckedChange={checked=>toast({title:`${label} ${checked?"enabled":"disabled"}`})} /></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAmbassadorDetail;
