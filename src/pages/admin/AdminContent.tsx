import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Plus, Edit, Trash2, Eye, EyeOff, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const AdminContent = () => {
  const [tab, setTab] = useState<"courses" | "library">("courses");
  const [courses, setCourses] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [cRes, aRes] = await Promise.all([
        supabase.from("courses").select("*").order("sort_order"),
        supabase.from("lib_assets").select("id, title, asset_type, status, is_approved, created_at, file_format").order("created_at", { ascending: false }).limit(50),
      ]);
      setCourses(cRes.data ?? []);
      setAssets(aRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from("courses").update({ is_published: !current }).eq("id", id);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !current } : c));
    toast({ title: !current ? "Course published" : "Course unpublished" });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-[#1A1A1E] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] font-['Inter']">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A1A1E]">Content & Academy</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D2F34C] text-[#1A1A1E] rounded-lg text-xs font-bold hover:bg-[#BDE040]">
          <Plus className="w-3.5 h-3.5" /> {tab === "courses" ? "Add Course" : "Upload Content"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F5F7] p-1 rounded-lg w-fit">
        {(["courses", "library"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-xs font-medium ${tab === t ? "bg-white text-[#1A1A1E] shadow-sm" : "text-[#6B7280]"}`}>
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
                      <p className="text-sm font-medium text-[#1A1A1E]">{c.title_en}</p>
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
                        <button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Edit className="w-3.5 h-3.5 text-[#9CA3AF]" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-[#F5F5F7]"><Trash2 className="w-3.5 h-3.5 text-[#EF4444]" /></button>
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
              <h3 className="text-sm font-semibold text-[#1A1A1E]">No courses yet</h3>
              <p className="text-xs text-[#9CA3AF]">Create your first academy course.</p>
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
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase">Created</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a.id} className="border-b border-[#F5F5F7] hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-sm font-medium text-[#1A1A1E]">{a.title}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{a.asset_type}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{a.file_format || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.is_approved ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                        {a.is_approved ? "Approved" : "Pending"}
                      </span>
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
              <h3 className="text-sm font-semibold text-[#1A1A1E]">No content yet</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
