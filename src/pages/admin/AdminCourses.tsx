import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Loader2, Save, X, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  category: string;
  level: string;
  duration: string;
  lessons_count: number;
  xp: number;
  thumbnail_url: string | null;
  youtube_url: string | null;
  sort_order: number;
  is_published: boolean;
}

const emptyCourse: Omit<Course, "id"> = {
  title_fr: "", title_en: "", description_fr: "", description_en: "",
  category: "dubai", level: "beginner", duration: "1h 00min",
  lessons_count: 1, xp: 100, thumbnail_url: "", youtube_url: "",
  sort_order: 0, is_published: false,
};

const categories = [
  { value: "dubai", label: "🏙️ Dubai Real Estate" },
  { value: "sales", label: "🎯 Techniques de vente" },
  { value: "compliance", label: "🛡️ Conformité" },
];

const levels = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<Course, "id"> & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setCourses(data as Course[]);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, ...rest } = editing as Course;

    if (id) {
      const { error } = await supabase.from("courses").update(rest).eq("id", id);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Cours mis à jour ✓" }); }
    } else {
      const { error } = await supabase.from("courses").insert(rest);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Cours créé ✓" }); }
    }
    setSaving(false);
    setEditing(null);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce cours ?")) return;
    await supabase.from("courses").delete().eq("id", id);
    toast({ title: "Cours supprimé" });
    fetchCourses();
  };

  const togglePublish = async (course: Course) => {
    await supabase.from("courses").update({ is_published: !course.is_published }).eq("id", course.id);
    fetchCourses();
  };

  const getYoutubeThumbnail = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[hsl(var(--foreground))]">🎓 Gestion Academy</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{courses.length} cours · Ajouter des vidéos YouTube pour alimenter l'Academy</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyCourse, sort_order: courses.length })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--destructive))] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Ajouter un cours
        </button>
      </div>

      {/* Course list */}
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] group">
            <GripVertical className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 opacity-40" />
            <div className="w-16 h-10 rounded-lg overflow-hidden bg-[hsl(var(--muted))] shrink-0">
              {(course.thumbnail_url || getYoutubeThumbnail(course.youtube_url)) && (
                <img src={course.thumbnail_url || getYoutubeThumbnail(course.youtube_url)!} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{course.title_fr}</span>
                {!course.is_published && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">Brouillon</span>
                )}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] flex gap-3">
                <span>{categories.find(c => c.value === course.category)?.label}</span>
                <span>{course.duration}</span>
                <span>{course.lessons_count} leçons</span>
                <span>{course.xp} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => togglePublish(course)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" title={course.is_published ? "Dépublier" : "Publier"}>
                {course.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditing(course)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-16 text-[hsl(var(--muted-foreground))]">
            <Youtube className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun cours pour l'instant</p>
            <p className="text-xs mt-1">Cliquez sur "Ajouter un cours" pour commencer</p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setEditing(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[640px] lg:max-h-[85vh] bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] z-50 flex flex-col overflow-hidden">
              
              <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
                <h2 className="font-display font-bold text-[hsl(var(--foreground))]">
                  {(editing as any).id ? "Modifier le cours" : "Nouveau cours"}
                </h2>
                <button onClick={() => setEditing(null)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Titre FR *</label>
                    <input value={editing.title_fr} onChange={e => setEditing({ ...editing, title_fr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Titre EN *</label>
                    <input value={editing.title_en} onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Description FR</label>
                    <textarea rows={3} value={editing.description_fr} onChange={e => setEditing({ ...editing, description_fr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Description EN</label>
                    <textarea rows={3} value={editing.description_en} onChange={e => setEditing({ ...editing, description_en: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] resize-none" />
                  </div>
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">🎬 URL YouTube (non listé)</label>
                  <input value={editing.youtube_url || ""} onChange={e => setEditing({ ...editing, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  {editing.youtube_url && getYoutubeThumbnail(editing.youtube_url) && (
                    <img src={getYoutubeThumbnail(editing.youtube_url)!} className="mt-2 rounded-lg w-full max-w-[240px] aspect-video object-cover" />
                  )}
                </div>

                {/* Thumbnail override */}
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">📷 URL miniature (optionnel, remplace la miniature YouTube)</label>
                  <input value={editing.thumbnail_url || ""} onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                </div>

                {/* Category, Level, Duration */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Catégorie</label>
                    <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]">
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Niveau</label>
                    <select value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]">
                      {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Durée</label>
                    <input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })}
                      placeholder="1h 30min"
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                </div>

                {/* Lessons, XP, Order */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Nb leçons</label>
                    <input type="number" min={0} value={editing.lessons_count} onChange={e => setEditing({ ...editing, lessons_count: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">XP gagné</label>
                    <input type="number" min={0} value={editing.xp} onChange={e => setEditing({ ...editing, xp: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Ordre</label>
                    <input type="number" min={0} value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]" />
                  </div>
                </div>

                {/* Published toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[hsl(var(--primary))]" />
                  <span className="text-sm text-[hsl(var(--foreground))]">Publier immédiatement (visible par les ambassadeurs)</span>
                </label>
              </div>

              <div className="p-4 border-t border-[hsl(var(--border))] flex justify-end gap-2">
                <button onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-lg text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving || !editing.title_fr || !editing.title_en}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--destructive))] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCourses;
