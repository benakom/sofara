import { useState } from "react";
import { Globe, DollarSign, Users, Bell, Key, Database, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const tabs = [{id:"general",label:"General",icon:Globe},{id:"commissions",label:"Commission Rules",icon:DollarSign},{id:"tiers",label:"Tier Management",icon:Users},{id:"notifications",label:"Notifications",icon:Bell},{id:"integrations",label:"API & Integrations",icon:Key},{id:"data",label:"Data & Export",icon:Database}];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const renderContent = () => {
    switch(activeTab){
      case "general": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">General Settings</h2>{[{l:"Platform Name",v:"Sofara",t:"text"},{l:"Default Currency",v:"AED",t:"text"},{l:"Contact Email",v:"support@sofara.io",t:"email"},{l:"WhatsApp Number",v:"+971XXXXXXXXX",t:"tel"}].map(f=>(<div key={f.l}><label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">{f.l}</label><input type={f.t} defaultValue={f.v} className="w-full h-9 px-3 mt-1 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50" /></div>))}<button onClick={()=>toast({title:"Settings saved"})} className="px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040]">Save</button></div>;
      case "commissions": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">Commission Rules</h2><div><label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Default Rate (%)</label><input type="number" defaultValue={3} className="w-32 h-9 px-3 mt-1 rounded-lg border border-[#E5E7EB] text-sm" /></div><div><label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Cooptation Bonus (AED)</label><input type="number" defaultValue={2000} className="w-32 h-9 px-3 mt-1 rounded-lg border border-[#E5E7EB] text-sm" /></div><div className="flex items-center justify-between py-2"><span className="text-xs text-[#6B7280]">Auto-approve commissions</span><Switch defaultChecked={false} /></div><button onClick={()=>toast({title:"Saved"})} className="px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040]">Save</button></div>;
      case "tiers": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">Tier Management</h2>{["Lite","Pro"].map(tier=>(<div key={tier} className="bg-[#F9FAFB] rounded-xl p-4 space-y-3"><h3 className="text-sm font-bold text-[#154B3B]">{tier}</h3>{tier==="Pro"&&<div><label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Price ($/mo)</label><input type="number" defaultValue={49} className="w-24 h-8 px-2 mt-1 rounded border border-[#E5E7EB] text-xs" /></div>}{["Lead submission","Pipeline","AI Tools","WhatsApp Copilot","Referrals"].map(f=>(<div key={f} className="flex items-center justify-between"><span className="text-xs text-[#6B7280]">{f}</span><Switch defaultChecked={tier==="Pro"} /></div>))}</div>))}</div>;
      case "notifications": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">Notifications</h2>{["New signup","New lead","Deal closed","Commission pending","Inactive >7d"].map(n=>(<div key={n} className="flex items-center justify-between py-2 border-b border-[#F5F5F7]"><span className="text-xs text-[#6B7280]">{n}</span><div className="flex gap-3">{["Email","WhatsApp","Dashboard"].map(ch=>(<label key={ch} className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="rounded" /><span className="text-[10px] text-[#9CA3AF]">{ch}</span></label>))}</div></div>))}</div>;
      case "integrations": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">API & Integrations</h2>{[{l:"AI API Key",s:"Connected",c:true},{l:"WhatsApp API",s:"Not configured",c:false},{l:"Payment Gateway",s:"Not configured",c:false}].map(i=>(<div key={i.l} className="flex items-center justify-between py-3 border-b border-[#F5F5F7]"><div><p className="text-sm font-medium text-[#154B3B]">{i.l}</p><p className={`text-[10px] ${i.c?"text-[#22C55E]":"text-[#9CA3AF]"}`}>{i.s}</p></div><button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] hover:bg-[#F9FAFB]">{i.c?"Configure":"Connect"}</button></div>))}</div>;
      case "data": return <div className="space-y-5"><h2 className="text-sm font-bold text-[#154B3B]">Data & Export</h2>{["Export ambassadors (CSV)","Export leads (CSV)","Export commissions (CSV)","Full database backup"].map(e=>(<div key={e} className="flex items-center justify-between py-3 border-b border-[#F5F5F7]"><p className="text-sm font-medium text-[#154B3B]">{e}</p><button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] hover:bg-[#F9FAFB]"><Download className="w-3.5 h-3.5" /> Export</button></div>))}</div>;
      default: return null;
    }
  };
  return (
    <div className="max-w-[1400px] font-['Poppins']">
      <h1 className="text-xl font-bold text-[#154B3B] mb-6">Settings</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0 space-y-1">{tabs.map(t=>(<button key={t.id} onClick={()=>setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${activeTab===t.id?"bg-[#154B3B] text-white":"text-[#6B7280] hover:bg-[#F5F5F7]"}`}><t.icon className="w-4 h-4" />{t.label}</button>))}</div>
        <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminSettings;
