import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects, useAssets } from "@/hooks/useLibrary";
import { MapPin, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryView } from "@/pages/dashboard/Library";

interface Props {
  areaId: string;
  navigate: (v: LibraryView) => void;
  onPreviewAsset: (id: string) => void;
}

const AreaDetail = ({ areaId, navigate, onPreviewAsset }: Props) => {
  const { lang } = useLanguage();
  const { data: area, isLoading } = useQuery({
    queryKey: ["lib-area", areaId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lib_areas").select("*, city:lib_cities(*)").eq("id", areaId).single();
      if (error) throw error;
      return data;
    },
  });
  const { data: projects } = useProjects({ areaId });
  const { data: assets } = useAssets({ areaId });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 rounded-2xl" /><Skeleton className="h-8 w-48" /></div>;
  if (!area) return null;

  const highlights = Array.isArray(area.highlights) ? area.highlights : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--dash-muted-fg))]">
        <button onClick={() => navigate({ type: "home" })} className="hover:text-[hsl(var(--primary))]">Library</button>
        <span>/</span>
        <button onClick={() => navigate({ type: "browse", tab: "areas" })} className="hover:text-[hsl(var(--primary))]">{lang === "fr" ? "Zones" : "Areas"}</button>
        <span>/</span>
        <span className="text-[hsl(var(--dash-fg))] font-medium">{area.name}</span>
      </div>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--dash-muted))]">
        {area.image_url ? (
          <img src={area.image_url} alt={area.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-[hsl(var(--primary))]/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-xs text-white/60 mb-1">{(area as any).city?.name}</p>
          <h1 className="text-2xl font-display font-bold text-white">{area.name}</h1>
        </div>
      </div>

      {area.description && (
        <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
          <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed">{area.description}</p>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">✨ Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {highlights.map((h: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-medium">{h}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects in area */}
      <div>
        <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">{lang === "fr" ? "Projets dans cette zone" : "Projects in this area"}</h3>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p: any) => (
              <button key={p.id} onClick={() => navigate({ type: "project", id: p.id })} className="group text-left rounded-xl overflow-hidden bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-lg transition-all">
                <div className="h-28 bg-[hsl(var(--dash-muted))] overflow-hidden">
                  {p.hero_image_url ? <img src={p.hero_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-[hsl(var(--dash-muted-fg))]" /></div>}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{p.name}</h4>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{p.developer?.name} · <span className="capitalize">{p.status?.replace("_", " ")}</span></p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[hsl(var(--dash-muted-fg))] py-8 text-center">{lang === "fr" ? "Aucun projet dans cette zone" : "No projects in this area yet"}</p>
        )}
      </div>
    </div>
  );
};

export default AreaDetail;
