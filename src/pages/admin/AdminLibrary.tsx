import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCities, useAreas, useDevelopers, useProjects, useAssets, useAssetCategories } from "@/hooks/useLibrary";
import { Plus, Building2, MapPin, Folder, FileText, Trash2, Pencil, Upload, X, Image, ChevronDown, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type Tab = "projects" | "developers" | "areas" | "assets";

const AdminLibrary = () => {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[hsl(var(--foreground))]">📚 Project Intelligence Library</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Gérez les projets, développeurs, zones et assets de la bibliothèque</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[hsl(var(--muted))] w-fit">
        {([
          { id: "projects" as Tab, icon: Folder, label: "Projets" },
          { id: "developers" as Tab, icon: Building2, label: "Développeurs" },
          { id: "areas" as Tab, icon: MapPin, label: "Zones" },
          { id: "assets" as Tab, icon: FileText, label: "Assets" },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "projects" && <ProjectsTab />}
      {tab === "developers" && <DevelopersTab />}
      {tab === "areas" && <AreasTab />}
      {tab === "assets" && <AssetsTab />}
    </div>
  );
};

// ─── PROJECTS TAB ───────────────────────────────────────
const ProjectsTab = () => {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useProjects();
  const { data: developers } = useDevelopers();
  const { data: areas } = useAreas();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", developer_id: "", area_id: "", status: "under_construction",
    property_type: "apartment", handover_date: "", price_from: "", price_to: "",
    bedrooms: "", description: "", hero_image_url: "", ai_summary: "",
    quick_pitch: "", whatsapp_summary: "", target_buyer: "", is_featured: false,
    selling_points_text: "", faq_text: "", objections_text: "", social_captions_text: "",
  });

  const resetForm = () => {
    setForm({ name: "", developer_id: "", area_id: "", status: "under_construction", property_type: "apartment", handover_date: "", price_from: "", price_to: "", bedrooms: "", description: "", hero_image_url: "", ai_summary: "", quick_pitch: "", whatsapp_summary: "", target_buyer: "", is_featured: false, selling_points_text: "", faq_text: "", objections_text: "", social_captions_text: "" });
    setEditId(null);
    setShowForm(false);
  };

  const editProject = (p: any) => {
    setForm({
      name: p.name || "", developer_id: p.developer_id || "", area_id: p.area_id || "",
      status: p.status || "under_construction", property_type: p.property_type || "apartment",
      handover_date: p.handover_date || "", price_from: p.price_from?.toString() || "",
      price_to: p.price_to?.toString() || "", bedrooms: p.bedrooms || "",
      description: p.description || "", hero_image_url: p.hero_image_url || "",
      ai_summary: p.ai_summary || "", quick_pitch: p.quick_pitch || "",
      whatsapp_summary: p.whatsapp_summary || "", target_buyer: p.target_buyer || "",
      is_featured: p.is_featured || false,
      selling_points_text: Array.isArray(p.selling_points) ? p.selling_points.join("\n") : "",
      faq_text: Array.isArray(p.faq) ? p.faq.map((f: any) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") : "",
      objections_text: Array.isArray(p.objection_handling) ? p.objection_handling.map((o: any) => `O: ${o.objection}\nR: ${o.answer}`).join("\n\n") : "",
      social_captions_text: Array.isArray(p.social_captions) ? p.social_captions.join("\n---\n") : "",
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: form.name, developer_id: form.developer_id, area_id: form.area_id,
        status: form.status, property_type: form.property_type,
        handover_date: form.handover_date || null,
        price_from: form.price_from ? Number(form.price_from) : null,
        price_to: form.price_to ? Number(form.price_to) : null,
        bedrooms: form.bedrooms || null, description: form.description || null,
        hero_image_url: form.hero_image_url || null, ai_summary: form.ai_summary || null,
        quick_pitch: form.quick_pitch || null, whatsapp_summary: form.whatsapp_summary || null,
        target_buyer: form.target_buyer || null, is_featured: form.is_featured,
        selling_points: form.selling_points_text ? form.selling_points_text.split("\n").filter(Boolean) : [],
        social_captions: form.social_captions_text ? form.social_captions_text.split("\n---\n").filter(Boolean) : [],
        faq: form.faq_text ? parseFaq(form.faq_text) : [],
        objection_handling: form.objections_text ? parseObjections(form.objections_text) : [],
      };
      if (editId) {
        const { error } = await supabase.from("lib_projects").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lib_projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lib-projects"] });
      toast({ title: editId ? "Projet mis à jour" : "Projet créé" });
      resetForm();
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lib_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lib-projects"] });
      toast({ title: "Projet supprimé" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{projects?.length || 0} projets</span>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter un projet
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{editId ? "Modifier le projet" : "Nouveau projet"}</h3>
            <button onClick={resetForm} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Nom du projet *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <FormSelect label="Développeur *" value={form.developer_id} onChange={(v) => setForm({ ...form, developer_id: v })} options={(developers || []).map((d: any) => ({ value: d.id, label: d.name }))} />
            <FormSelect label="Zone *" value={form.area_id} onChange={(v) => setForm({ ...form, area_id: v })} options={(areas || []).map((a: any) => ({ value: a.id, label: `${a.name} (${a.city?.name || "Dubai"})` }))} />
            <FormSelect label="Statut" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[
              { value: "new_launch", label: "New Launch" }, { value: "under_construction", label: "Under Construction" }, { value: "ready", label: "Ready" }, { value: "sold_out", label: "Sold Out" },
            ]} />
            <FormSelect label="Type de propriété" value={form.property_type} onChange={(v) => setForm({ ...form, property_type: v })} options={[
              { value: "apartment", label: "Apartment" }, { value: "villa", label: "Villa" }, { value: "townhouse", label: "Townhouse" }, { value: "penthouse", label: "Penthouse" }, { value: "plot", label: "Plot" }, { value: "mixed", label: "Mixed" },
            ]} />
            <FormField label="Date livraison" value={form.handover_date} onChange={(v) => setForm({ ...form, handover_date: v })} placeholder="Q4 2026" />
            <FormField label="Prix min (AED)" value={form.price_from} onChange={(v) => setForm({ ...form, price_from: v })} type="number" />
            <FormField label="Prix max (AED)" value={form.price_to} onChange={(v) => setForm({ ...form, price_to: v })} type="number" />
            <FormField label="Chambres" value={form.bedrooms} onChange={(v) => setForm({ ...form, bedrooms: v })} placeholder="Studio, 1BR, 2BR, 3BR" />
            <FormField label="Hero Image URL" value={form.hero_image_url} onChange={(v) => setForm({ ...form, hero_image_url: v })} placeholder="https://..." />
          </div>

          <FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
          <FormTextarea label="AI Summary" value={form.ai_summary} onChange={(v) => setForm({ ...form, ai_summary: v })} rows={2} />
          <FormTextarea label="Quick Pitch" value={form.quick_pitch} onChange={(v) => setForm({ ...form, quick_pitch: v })} rows={2} />
          <FormTextarea label="WhatsApp Summary" value={form.whatsapp_summary} onChange={(v) => setForm({ ...form, whatsapp_summary: v })} rows={2} />
          <FormField label="Target Buyer" value={form.target_buyer} onChange={(v) => setForm({ ...form, target_buyer: v })} />
          <FormTextarea label="Selling Points (1 par ligne)" value={form.selling_points_text} onChange={(v) => setForm({ ...form, selling_points_text: v })} rows={3} placeholder="ROI de 8-12%\nEmplacement premium\n..." />
          <FormTextarea label="FAQ (Q: question\nA: answer)" value={form.faq_text} onChange={(v) => setForm({ ...form, faq_text: v })} rows={3} placeholder="Q: Quel est le ROI estimé ?\nA: 8-12% annuel" />
          <FormTextarea label="Objections (O: objection\nR: réponse)" value={form.objections_text} onChange={(v) => setForm({ ...form, objections_text: v })} rows={3} placeholder="O: Le prix est trop élevé\nR: Comparé à..." />
          <FormTextarea label="Captions Social Media (séparés par ---)" value={form.social_captions_text} onChange={(v) => setForm({ ...form, social_captions_text: v })} rows={3} />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))] cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
              Projet vedette
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={() => saveMutation.mutate()} disabled={!form.name || !form.developer_id || !form.area_id || saveMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {editId ? "Mettre à jour" : "Créer"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 rounded-lg border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">Annuler</button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-2">
          {projects?.map((p: any) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--muted))] shrink-0 overflow-hidden">
                {p.hero_image_url ? <img src={p.hero_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-5 h-5 text-[hsl(var(--muted-foreground))]" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{p.name}</h4>
                  {p.is_featured && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] font-bold">★</span>}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{p.developer?.name} · {p.area?.name} · <span className="capitalize">{p.status?.replace("_", " ")}</span></p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => editProject(p)} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Supprimer ce projet ?")) deleteMutation.mutate(p.id); }} className="p-2 rounded-lg hover:bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── DEVELOPERS TAB ─────────────────────────────────────
const DevelopersTab = () => {
  const qc = useQueryClient();
  const { data: developers, isLoading } = useDevelopers();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", logo_url: "", description: "", website: "", trust_points_text: "" });

  const resetForm = () => { setForm({ name: "", logo_url: "", description: "", website: "", trust_points_text: "" }); setEditId(null); setShowForm(false); };

  const edit = (d: any) => {
    setForm({ name: d.name, logo_url: d.logo_url || "", description: d.description || "", website: d.website || "", trust_points_text: Array.isArray(d.trust_points) ? d.trust_points.join("\n") : "" });
    setEditId(d.id); setShowForm(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = { name: form.name, logo_url: form.logo_url || null, description: form.description || null, website: form.website || null, trust_points: form.trust_points_text ? form.trust_points_text.split("\n").filter(Boolean) : [] };
      if (editId) { const { error } = await supabase.from("lib_developers").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("lib_developers").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-developers"] }); toast({ title: editId ? "Développeur mis à jour" : "Développeur créé" }); resetForm(); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("lib_developers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-developers"] }); toast({ title: "Développeur supprimé" }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{developers?.length || 0} développeurs</span>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{editId ? "Modifier" : "Nouveau développeur"}</h3>
            <button onClick={resetForm}><X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nom *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <FormField label="Logo URL" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} placeholder="https://..." />
            <FormField label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://..." />
          </div>
          <FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <FormTextarea label="Trust Points (1 par ligne)" value={form.trust_points_text} onChange={(v) => setForm({ ...form, trust_points_text: v })} rows={2} placeholder="50+ projets livrés\n#1 Developer UAE\n..." />
          <div className="flex gap-2">
            <button onClick={() => save.mutate()} disabled={!form.name || save.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {editId ? "Mettre à jour" : "Créer"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 rounded-lg border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">Annuler</button>
          </div>
        </div>
      )}

      {isLoading ? <Skeleton className="h-24" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {developers?.map((d: any) => (
            <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-lg font-bold text-[hsl(var(--muted-foreground))] shrink-0">
                {d.logo_url ? <img src={d.logo_url} className="w-full h-full rounded-full object-cover" /> : d.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{d.name}</h4>
                {d.website && <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{d.website}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(d)} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]"><Pencil className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                <button onClick={() => { if (confirm("Supprimer ?")) del.mutate(d.id); }} className="p-2 rounded-lg hover:bg-[hsl(var(--destructive))]/10"><Trash2 className="w-4 h-4 text-[hsl(var(--destructive))]" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── AREAS TAB ──────────────────────────────────────────
const AreasTab = () => {
  const qc = useQueryClient();
  const { data: areas, isLoading } = useAreas();
  const { data: cities } = useCities();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", city_id: "", description: "", image_url: "", highlights_text: "" });

  const resetForm = () => { setForm({ name: "", city_id: "", description: "", image_url: "", highlights_text: "" }); setEditId(null); setShowForm(false); };

  const edit = (a: any) => {
    setForm({ name: a.name, city_id: a.city_id, description: a.description || "", image_url: a.image_url || "", highlights_text: Array.isArray(a.highlights) ? a.highlights.join("\n") : "" });
    setEditId(a.id); setShowForm(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = { name: form.name, city_id: form.city_id, description: form.description || null, image_url: form.image_url || null, highlights: form.highlights_text ? form.highlights_text.split("\n").filter(Boolean) : [] };
      if (editId) { const { error } = await supabase.from("lib_areas").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("lib_areas").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-areas"] }); toast({ title: editId ? "Zone mise à jour" : "Zone créée" }); resetForm(); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("lib_areas").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-areas"] }); toast({ title: "Zone supprimée" }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{areas?.length || 0} zones</span>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{editId ? "Modifier" : "Nouvelle zone"}</h3>
            <button onClick={resetForm}><X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nom *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <FormSelect label="Ville *" value={form.city_id} onChange={(v) => setForm({ ...form, city_id: v })} options={(cities || []).map((c: any) => ({ value: c.id, label: c.name }))} />
            <FormField label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
          </div>
          <FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <FormTextarea label="Highlights (1 par ligne)" value={form.highlights_text} onChange={(v) => setForm({ ...form, highlights_text: v })} rows={2} />
          <div className="flex gap-2">
            <button onClick={() => save.mutate()} disabled={!form.name || !form.city_id || save.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {editId ? "Mettre à jour" : "Créer"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 rounded-lg border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">Annuler</button>
          </div>
        </div>
      )}

      {isLoading ? <Skeleton className="h-24" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {areas?.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <MapPin className="w-5 h-5 text-[hsl(var(--primary))] shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{a.name}</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{a.city?.name || "Dubai"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(a)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Pencil className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" /></button>
                <button onClick={() => { if (confirm("Supprimer ?")) del.mutate(a.id); }} className="p-1.5 rounded-lg hover:bg-[hsl(var(--destructive))]/10"><Trash2 className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ASSETS TAB ─────────────────────────────────────────
const AssetsTab = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: assets, isLoading } = useAssets();
  const { data: categories } = useAssetCategories();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const { data: areas } = useAreas();
  const { data: cities } = useCities();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", asset_type: "document", category_id: "",
    project_id: "", developer_id: "", area_id: "", city_id: "",
    file_url: "", file_format: "", file_size: "", thumbnail_url: "",
    language: "en", tags_text: "", is_featured: false, is_approved: true,
    status: "current", visibility: "all",
  });

  const resetForm = () => {
    setForm({ title: "", description: "", asset_type: "document", category_id: "", project_id: "", developer_id: "", area_id: "", city_id: "", file_url: "", file_format: "", file_size: "", thumbnail_url: "", language: "en", tags_text: "", is_featured: false, is_approved: true, status: "current", visibility: "all" });
    setEditId(null); setShowForm(false);
  };

  const edit = (a: any) => {
    setForm({
      title: a.title, description: a.description || "", asset_type: a.asset_type, category_id: a.category_id || "",
      project_id: a.project_id || "", developer_id: a.developer_id || "", area_id: a.area_id || "", city_id: a.city_id || "",
      file_url: a.file_url || "", file_format: a.file_format || "", file_size: a.file_size?.toString() || "",
      thumbnail_url: a.thumbnail_url || "", language: a.language || "en",
      tags_text: a.tags?.join(", ") || "", is_featured: a.is_featured, is_approved: a.is_approved,
      status: a.status, visibility: a.visibility,
    });
    setEditId(a.id); setShowForm(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: form.title, description: form.description || null, asset_type: form.asset_type,
        category_id: form.category_id || null, project_id: form.project_id || null,
        developer_id: form.developer_id || null, area_id: form.area_id || null, city_id: form.city_id || null,
        file_url: form.file_url || null, file_format: form.file_format || null,
        file_size: form.file_size ? Number(form.file_size) : null,
        thumbnail_url: form.thumbnail_url || null, language: form.language,
        tags: form.tags_text ? form.tags_text.split(",").map(t => t.trim()).filter(Boolean) : [],
        is_featured: form.is_featured, is_approved: form.is_approved,
        status: form.status, visibility: form.visibility,
        uploaded_by: user?.id,
      };
      if (editId) { const { error } = await supabase.from("lib_assets").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("lib_assets").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-assets"] }); toast({ title: editId ? "Asset mis à jour" : "Asset créé" }); resetForm(); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("lib_assets").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lib-assets"] }); toast({ title: "Asset supprimé" }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{assets?.length || 0} assets</span>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter un asset
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{editId ? "Modifier l'asset" : "Nouvel asset"}</h3>
            <button onClick={resetForm}><X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Titre *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <FormSelect label="Type" value={form.asset_type} onChange={(v) => setForm({ ...form, asset_type: v })} options={[
              { value: "document", label: "Document" }, { value: "pdf", label: "PDF" }, { value: "image", label: "Image" },
              { value: "video", label: "Video" }, { value: "render", label: "Render" }, { value: "spreadsheet", label: "Spreadsheet" },
              { value: "link", label: "Link" }, { value: "zip", label: "ZIP" },
            ]} />
            <FormSelect label="Catégorie" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })} options={(categories || []).map((c: any) => ({ value: c.id, label: `${c.icon} ${c.name}` }))} />
            <FormSelect label="Projet" value={form.project_id} onChange={(v) => setForm({ ...form, project_id: v })} options={[{ value: "", label: "— Aucun —" }, ...(projects || []).map((p: any) => ({ value: p.id, label: p.name }))]} />
            <FormSelect label="Développeur" value={form.developer_id} onChange={(v) => setForm({ ...form, developer_id: v })} options={[{ value: "", label: "— Aucun —" }, ...(developers || []).map((d: any) => ({ value: d.id, label: d.name }))]} />
            <FormSelect label="Zone" value={form.area_id} onChange={(v) => setForm({ ...form, area_id: v })} options={[{ value: "", label: "— Aucune —" }, ...(areas || []).map((a: any) => ({ value: a.id, label: a.name }))]} />
            <FormField label="File URL" value={form.file_url} onChange={(v) => setForm({ ...form, file_url: v })} placeholder="https://..." />
            <FormField label="Format" value={form.file_format} onChange={(v) => setForm({ ...form, file_format: v })} placeholder="pdf, jpg, mp4..." />
            <FormField label="Taille (bytes)" value={form.file_size} onChange={(v) => setForm({ ...form, file_size: v })} type="number" />
            <FormField label="Thumbnail URL" value={form.thumbnail_url} onChange={(v) => setForm({ ...form, thumbnail_url: v })} />
            <FormSelect label="Langue" value={form.language} onChange={(v) => setForm({ ...form, language: v })} options={[
              { value: "en", label: "English" }, { value: "fr", label: "Français" }, { value: "ar", label: "العربية" }, { value: "ru", label: "Русский" },
            ]} />
            <FormSelect label="Statut" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[
              { value: "current", label: "Actuel" }, { value: "outdated", label: "Obsolète" }, { value: "archived", label: "Archivé" },
            ]} />
          </div>
          <FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
          <FormField label="Tags (séparés par virgule)" value={form.tags_text} onChange={(v) => setForm({ ...form, tags_text: v })} placeholder="brochure, emaar, 2024..." />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))] cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
              Mis en avant
            </label>
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))] cursor-pointer">
              <input type="checkbox" checked={form.is_approved} onChange={(e) => setForm({ ...form, is_approved: e.target.checked })} className="rounded" />
              Approuvé
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => save.mutate()} disabled={!form.title || save.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {editId ? "Mettre à jour" : "Créer"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 rounded-lg border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">Annuler</button>
          </div>
        </div>
      )}

      {isLoading ? <Skeleton className="h-24" /> : (
        <div className="space-y-2">
          {assets?.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center text-base shrink-0">{a.category?.icon || "📄"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{a.title}</h4>
                  {!a.is_approved && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 font-bold">En attente</span>}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{a.asset_type} · {a.file_format?.toUpperCase()} · {a.project?.name || a.developer?.name || "—"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(a)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Pencil className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" /></button>
                <button onClick={() => { if (confirm("Supprimer ?")) del.mutate(a.id); }} className="p-1.5 rounded-lg hover:bg-[hsl(var(--destructive))]/10"><Trash2 className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SHARED FORM COMPONENTS ─────────────────────────────
const FormField = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <div>
    <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full h-9 px-3 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/30" />
  </div>
);

const FormSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <div>
    <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/30">
      <option value="">— Sélectionner —</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const FormTextarea = ({ label, value, onChange, rows = 3, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <div>
    <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/30 resize-none" />
  </div>
);

// ─── HELPERS ────────────────────────────────────────────
const parseFaq = (text: string) => {
  const blocks = text.split("\n\n").filter(Boolean);
  return blocks.map((b) => {
    const lines = b.split("\n");
    const q = lines.find(l => l.startsWith("Q:"))?.replace("Q:", "").trim() || "";
    const a = lines.find(l => l.startsWith("A:"))?.replace("A:", "").trim() || "";
    return { q, a };
  }).filter(f => f.q);
};

const parseObjections = (text: string) => {
  const blocks = text.split("\n\n").filter(Boolean);
  return blocks.map((b) => {
    const lines = b.split("\n");
    const objection = lines.find(l => l.startsWith("O:"))?.replace("O:", "").trim() || "";
    const answer = lines.find(l => l.startsWith("R:"))?.replace("R:", "").trim() || "";
    return { objection, answer };
  }).filter(o => o.objection);
};

export default AdminLibrary;
