import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Building2, Edit, Trash2, ToggleLeft, ToggleRight, LayoutGrid, List } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    const fetch = async () => {
      const [pRes, dRes, aRes] = await Promise.all([
        supabase.from("lib_projects").select("*").order("sort_order"),
        supabase.from("lib_developers").select("id, name, logo_url"),
        supabase.from("lib_areas").select("id, name"),
      ]);
      setProjects(pRes.data ?? []);
      setDevelopers(dRes.data ?? []);
      setAreas(aRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const getDevName = (id: string) => developers.find(d => d.id === id)?.name || "—";
  const getAreaName = (id: string) => areas.find(a => a.id === id)?.name || "—";

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("lib_projects").update({ status: newStatus }).eq("id", id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast({ title: `Project ${newStatus}` });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#1A1A1E] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1A1A1E]">Projects Database</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#F5F5F7] p-1 rounded-lg">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}><LayoutGrid className="w-4 h-4 text-[#6B7280]" /></button>
            <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-white shadow-sm" : ""}`}><List className="w-4 h-4 text-[#6B7280]" /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D2F34C] text-[#1A1A1E] rounded-lg text-xs font-bold hover:bg-[#BDE040]">
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#1A1A1E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50" />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="h-32 bg-gradient-to-br from-[#1A1A1E] to-[#2C2C2E] flex items-center justify-center">
                {p.hero_image_url ? (
                  <img src={p.hero_image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-[#6B7280]" />
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] text-[#9CA3AF] font-medium">{getDevName(p.developer_id)}</p>
                <h3 className="text-sm font-bold text-[#1A1A1E] mt-0.5">{p.name}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{getAreaName(p.area_id)}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-[#1A1A1E]">
                    {p.price_from ? `AED ${fmt(p.price_from)}` : "—"} {p.price_to ? `- ${fmt(p.price_to)}` : ""}
                  </span>
                  {p.handover_date && <span className="text-[10px] text-[#9CA3AF]">{p.handover_date}</span>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F7]">
                  <div className="flex items-center gap-2">
                    <Switch checked={p.status === "active" || p.status === "under_construction"} onCheckedChange={() => toggleStatus(p.id, p.status)} />
                    <span className="text-[10px] text-[#9CA3AF]">{p.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Edit className="w-3.5 h-3.5 text-[#9CA3AF]" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Trash2 className="w-3.5 h-3.5 text-[#EF4444]" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Project</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Developer</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Zone</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Status</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-sm font-medium text-[#1A1A1E]">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{getDevName(p.developer_id)}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{getAreaName(p.area_id)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[#1A1A1E]">{p.price_from ? `AED ${fmt(p.price_from)}` : "—"}</td>
                    <td className="px-4 py-3"><Switch checked={p.status === "active" || p.status === "under_construction"} onCheckedChange={() => toggleStatus(p.id, p.status)} /></td>
                    <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Edit className="w-3.5 h-3.5 text-[#9CA3AF]" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#1A1A1E] mb-1">No projects found</h3>
          <p className="text-xs text-[#9CA3AF]">Add your first project to get started.</p>
          <button className="mt-4 px-4 py-2 bg-[#D2F34C] text-[#1A1A1E] rounded-lg text-xs font-bold hover:bg-[#BDE040]">Add Project</button>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
