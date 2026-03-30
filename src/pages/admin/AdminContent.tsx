import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Plus, Edit, Trash2, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const emptyCourse = {
  title_en: "", title_fr: "", description_en: "", description_fr: "",
  category: "dubai", level: "beginner", duration: "0h 00min", xp: "100",
  youtube_url: "", thumbnail_url: "", is_published: false,
};

const AdminContent = () => {
  const [tab, setTab] = useState<"courses" | "library">("courses");
  const [courses, setCourses] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyCourse });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchData = async () => {
    const [cRes, aRes] = await Promise.all([
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("lib_assets").select("id, title, asset_type, status, is_approved, created_at, file_format").order("created_at", { ascending: false }).limit(50),
    ]);
    setCourses(cRes.data ?? []);
    setAssets(aRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from("courses").update({ is_published: !current }).eq("id", id);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !current } : c));
    toast({ title: !current ? "Course published" : "Course unpublished" });
  };

  const openAddCourse = () => {
    setEditing(null);
    setForm({ ...emptyCourse });
    setDialogOpen(true);
  };

  const openEditCourse = (c: any) => {
    setEditing(c);
    setForm({
      title_en: c.title_en || "", title_fr: c.title_fr || "",
      description_en: c.description_en || "", description_fr: c.description_fr || "",
      category: c.category || "dubai", level: c.level || "beginner",
      duration: c.duration || "0h 00min", xp: c.xp?.toString() || "100",
      youtube_url: c.youtube_url || "", thumbnail_url: c.thumbnail_url || "",
      is_published: c.is_published || false,
    });
    setDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!form.title_en || !form.title_fr) {
      toast({ title: "Please fill title (EN and FR)", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: any = {
      title_en: form.title_en, title_fr: form.title_fr,
      description_en: form.description_en, description_fr: form.description_fr,
      category: form.category, level: form.level, duration: form.duration,
      xp: Number(form.xp) || 100, youtube_url: form.youtube_url || null,
      thumbnail_url: form.thumbnail_url || null, is_published: form.is_published,
    };

    if (editing) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error updating course", description: error.message, variant: "destructive" });
      else toast({ title: "Course updated" });
    } else {
      const { error } = await supabase.from("courses").insert(payload);
      if (error) toast({ title: "Error creating course", description: error.message, variant: "destructive" });
      else toast({ title: "Course created" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("courses").delete().eq("id", deleteTarget.id);
    if (error) toast({ title: "Error deleting course", description: error.message, variant: "destructive" });
    else { toast({ title: "Course deleted" }); fetchData(); }
    setDeleteTarget(null);
  };

  const toggleAssetApproval = async (id: string, current: boolean) => {
    await supabase.from("lib_assets").update({ is_approved: !current }).eq("id", id);
    setAssets(prev => prev.map(a => a.id === id ? { ...a, is_approved: !current } : a));
    toast({ title: !current ? "Asset approved" : "Asset unapproved" });
  };

  const inputCls = "w-full h-9 px-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#154B3B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D2F34C]/50";
  const labelCls = "text-[11px] font-semibold text-[#6B7280] uppercase mb-1";

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#154B3B] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Poppins']">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#154B3B]">Content & Academy</h1>
        {tab === "courses" && (
          <button onClick={openAddCourse} className="flex items-center gap-2 px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040]">
            <Plus className="w-3.5 h-3.5" /> Add Course
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-[#F5F5F7] p-1 rounded-lg w-fit">
        {(["courses", "library"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-xs font-medium ${tab === t ? "bg-white text-[#154B3B] shadow-sm" : "text-[#6B7280]"}`}>
            {t === "courses" ? "Academy Courses" : "Content Library"}
          </button>
        ))}
      </div>

      {tab === "courses" ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Course</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Level</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Duration</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">XP</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Published</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#154B3B]">{c.title_en}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{c.title_fr}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{c.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.level === "beginner" ? "bg-[#22C55E]/10 text-[#22C55E]" : c.level === "intermediate" ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                        {c.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{c.duration}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[#D2F34C]">{c.xp} XP</td>
                    <td className="px-4 py-3"><Switch checked={c.is_published} onCheckedChange={() => togglePublished(c.id, c.is_published)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditCourse(c)} className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Edit className="w-3.5 h-3.5 text-[#9CA3AF]" /></button>
                        <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Trash2 className="w-3.5 h-3.5 text-[#EF4444]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {courses.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#154B3B]">No courses yet</h3>
              <p className="text-xs text-[#9CA3AF]">Create your first academy course.</p>
              <button onClick={openAddCourse} className="mt-3 px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040]">Add Course</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Format</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Approved</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Created</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-sm font-medium text-[#154B3B]">{a.title}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{a.asset_type}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{a.file_format || "—"}</td>
                    <td className="px-4 py-3">
                      <Switch checked={a.is_approved} onCheckedChange={() => toggleAssetApproval(a.id, a.is_approved)} />
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#9CA3AF]">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Edit className="w-3.5 h-3.5 text-[#9CA3AF]" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {assets.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#154B3B]">No content yet</h3>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Course Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#154B3B]">{editing ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogDescription className="text-xs text-[#9CA3AF]">
              {editing ? "Update the course details." : "Create a new academy course."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><label className={labelCls}>Title (EN) *</label><input className={inputCls} value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} /></div>
            <div><label className={labelCls}>Title (FR) *</label><input className={inputCls} value={form.title_fr} onChange={e => setForm(f => ({ ...f, title_fr: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {["dubai", "sales", "compliance", "marketing", "legal"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Level</label>
                <select className={inputCls} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                  {["beginner", "intermediate", "advanced"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>XP</label><input type="number" className={inputCls} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: e.target.value }))} /></div>
            </div>
            <div><label className={labelCls}>Duration</label><input className={inputCls} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="1h 30min" /></div>
            <div><label className={labelCls}>Description (EN)</label><textarea className={inputCls + " h-16 resize-none"} value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} /></div>
            <div><label className={labelCls}>Description (FR)</label><textarea className={inputCls + " h-16 resize-none"} value={form.description_fr} onChange={e => setForm(f => ({ ...f, description_fr: e.target.value }))} /></div>
            <div><label className={labelCls}>YouTube URL</label><input className={inputCls} value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} /></div>
            <div><label className={labelCls}>Thumbnail URL</label><input className={inputCls} value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
              <span className="text-xs text-[#6B7280]">Published</span>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-xs text-[#6B7280] hover:bg-[#F5F5F7] rounded-lg">Cancel</button>
            <button onClick={handleSaveCourse} disabled={saving} className="px-4 py-2 bg-[#D2F34C] text-black rounded-lg text-xs font-bold hover:bg-[#BDE040] disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title_en}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-[#EF4444] hover:bg-[#DC2626]">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContent;
