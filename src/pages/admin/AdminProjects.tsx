import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Building2, Edit, Trash2, LayoutGrid, List } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const emptyProject = {
  name: "", developer_id: "", area_id: "", property_type: "apartment", status: "under_construction",
  price_from: "", price_to: "", handover_date: "", bedrooms: "", description: "", hero_image_url: "",
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyProject });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchData = async () => {
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

  useEffect(() => { fetchData(); }, []);

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

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProject });
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name || "", developer_id: p.developer_id || "", area_id: p.area_id || "",
      property_type: p.property_type || "apartment", status: p.status || "under_construction",
      price_from: p.price_from?.toString() || "", price_to: p.price_to?.toString() || "",
      handover_date: p.handover_date || "", bedrooms: p.bedrooms || "",
      description: p.description || "", hero_image_url: p.hero_image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.developer_id || !form.area_id) {
      toast({ title: "Please fill required fields (Name, Developer, Area)", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: any = {
      name: form.name, developer_id: form.developer_id, area_id: form.area_id,
      property_type: form.property_type, status: form.status,
      price_from: form.price_from ? Number(form.price_from) : null,
      price_to: form.price_to ? Number(form.price_to) : null,
      handover_date: form.handover_date || null, bedrooms: form.bedrooms || null,
      description: form.description || null, hero_image_url: form.hero_image_url || null,
    };

    if (editing) {
      const { error } = await supabase.from("lib_projects").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error updating project", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Project updated" }); }
    } else {
      const { error } = await supabase.from("lib_projects").insert(payload);
      if (error) { toast({ title: "Error creating project", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Project created" }); }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("lib_projects").delete().eq("id", deleteTarget.id);
    if (error) { toast({ title: "Error deleting project", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Project deleted" }); fetchData(); }
    setDeleteTarget(null);
  };

  const inputCls = "w-full h-9 px-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]";
  const selectCls = inputCls;
  const labelCls = "text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase mb-1";

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--dash-accent))] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Projects Database</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[hsl(var(--dash-muted)/.4)] p-1 rounded-lg">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-[hsl(var(--dash-card))] shadow-sm" : ""}`}><LayoutGrid className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button>
            <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-[hsl(var(--dash-card))] shadow-sm" : ""}`}><List className="w-4 h-4 text-[hsl(var(--dash-muted-fg))]" /></button>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95">
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)] focus:border-[hsl(var(--dash-accent)/.6)]" />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] overflow-hidden ">
              <div className="h-32 bg-gradient-to-br from-[#0d3a2b] to-[#154B3B] flex items-center justify-center">
                {p.hero_image_url ? <img src={p.hero_image_url} alt={p.name} className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 text-[#9CC5B5]" />}
              </div>
              <div className="p-4">
                <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] font-medium">{getDevName(p.developer_id)}</p>
                <h3 className="text-sm font-bold text-[hsl(var(--dash-fg))] mt-0.5">{p.name}</h3>
                <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5">{getAreaName(p.area_id)}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-[hsl(var(--dash-fg))]">
                    {p.price_from ? `AED ${fmt(p.price_from)}` : "—"} {p.price_to ? `- ${fmt(p.price_to)}` : ""}
                  </span>
                  {p.handover_date && <span className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{p.handover_date}</span>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[hsl(var(--dash-border))]">
                  <div className="flex items-center gap-2">
                    <Switch checked={p.status === "active" || p.status === "under_construction"} onCheckedChange={() => toggleStatus(p.id, p.status)} />
                    <span className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{p.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><Edit className="w-3.5 h-3.5 text-[hsl(var(--dash-muted-fg))]" /></button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><Trash2 className="w-3.5 h-3.5 text-[#EF4444]" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))]  overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Project</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Developer</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Zone</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase">Status</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.5)]">
                    <td className="px-4 py-3 text-sm font-medium text-[hsl(var(--dash-fg))]">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{getDevName(p.developer_id)}</td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--dash-muted-fg))]">{getAreaName(p.area_id)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[hsl(var(--dash-fg))]">{p.price_from ? `AED ${fmt(p.price_from)}` : "—"}</td>
                    <td className="px-4 py-3"><Switch checked={p.status === "active" || p.status === "under_construction"} onCheckedChange={() => toggleStatus(p.id, p.status)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><Edit className="w-3.5 h-3.5 text-[hsl(var(--dash-muted-fg))]" /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted)/.5)]"><Trash2 className="w-3.5 h-3.5 text-[#EF4444]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-10 h-10 text-[hsl(var(--dash-muted-fg))] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-1">No projects found</h3>
          <p className="text-xs text-[hsl(var(--dash-muted-fg))]">Add your first project to get started.</p>
          <button onClick={openAdd} className="mt-4 px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95">Add Project</button>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[hsl(var(--dash-fg))]">{editing ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription className="text-xs text-[hsl(var(--dash-muted-fg))]">
              {editing ? "Update the project details below." : "Fill in the project details to create a new listing."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><label className={labelCls}>Name *</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Developer *</label>
                <select className={selectCls} value={form.developer_id} onChange={e => setForm(f => ({ ...f, developer_id: e.target.value }))}>
                  <option value="">Select developer</option>
                  {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Area *</label>
                <select className={selectCls} value={form.area_id} onChange={e => setForm(f => ({ ...f, area_id: e.target.value }))}>
                  <option value="">Select area</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Property Type</label>
                <select className={selectCls} value={form.property_type} onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}>
                  {["apartment", "villa", "townhouse", "penthouse", "studio", "land"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {["under_construction", "active", "inactive", "sold_out", "completed"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Price From (AED)</label><input type="number" className={inputCls} value={form.price_from} onChange={e => setForm(f => ({ ...f, price_from: e.target.value }))} /></div>
              <div><label className={labelCls}>Price To (AED)</label><input type="number" className={inputCls} value={form.price_to} onChange={e => setForm(f => ({ ...f, price_to: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Handover Date</label><input className={inputCls} value={form.handover_date} onChange={e => setForm(f => ({ ...f, handover_date: e.target.value }))} placeholder="Q4 2026" /></div>
              <div><label className={labelCls}>Bedrooms</label><input className={inputCls} value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} placeholder="Studio, 1BR, 2BR" /></div>
            </div>
            <div><label className={labelCls}>Hero Image URL</label><input className={inputCls} value={form.hero_image_url} onChange={e => setForm(f => ({ ...f, hero_image_url: e.target.value }))} placeholder="https://..." /></div>
            <div><label className={labelCls}>Description</label><textarea className={inputCls + " h-20 resize-none"} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-xs text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)] rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[hsl(var(--dash-accent))] text-black rounded-lg text-xs font-bold hover:brightness-95 disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The project will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[#EF4444] hover:bg-[#DC2626]">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjects;
