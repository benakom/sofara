import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAssets, useProjects } from "@/hooks/useLibrary";
import { ChevronLeft, Building2, Globe, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryView } from "@/pages/dashboard/Library";

interface Props {
  developerId: string;
  navigate: (v: LibraryView) => void;
  onPreviewAsset: (id: string) => void;
}

const DeveloperDetail = ({ developerId, navigate, onPreviewAsset }: Props) => {
  const { lang } = useLanguage();
  const { data: developer, isLoading } = useQuery({
    queryKey: ["lib-developer", developerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lib_developers").select("*").eq("id", developerId).single();
      if (error) throw error;
      return data;
    },
  });
  const { data: projects } = useProjects({ developerId });
  const { data: assets } = useAssets({ developerId });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 rounded-2xl" /><Skeleton className="h-8 w-48" /></div>;
  if (!developer) return null;

  const trustPoints = Array.isArray(developer.trust_points) ? developer.trust_points : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--dash-muted-fg))]">
        <button onClick={() => navigate({ type: "home" })} className="hover:text-[hsl(var(--primary))]">Library</button>
        <span>/</span>
        <button onClick={() => navigate({ type: "browse", tab: "developers" })} className="hover:text-[hsl(var(--primary))]">{lang === "fr" ? "Développeurs" : "Developers"}</button>
        <span>/</span>
        <span className="text-[hsl(var(--dash-fg))] font-medium">{developer.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-5 p-6 rounded-2xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
        <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--dash-muted))] flex items-center justify-center text-3xl font-bold text-[hsl(var(--dash-muted-fg))] shrink-0">
          {developer.logo_url ? <img src={developer.logo_url} alt={developer.name} className="w-full h-full rounded-2xl object-cover" /> : developer.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-bold text-[hsl(var(--dash-fg))]">{developer.name}</h1>
          {developer.description && <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1 line-clamp-2">{developer.description}</p>}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-[hsl(var(--dash-muted-fg))]">{projects?.length || 0} {lang === "fr" ? "projets" : "projects"}</span>
            <span className="text-xs text-[hsl(var(--dash-muted-fg))]">{assets?.length || 0} {lang === "fr" ? "documents" : "assets"}</span>
            {developer.website && (
              <a href={developer.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline">
                <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Trust Points */}
      {trustPoints.length > 0 && (
        <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">🏆 Trust Points</h3>
          <div className="flex flex-wrap gap-2">
            {trustPoints.map((tp: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-medium">{tp}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div>
        <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">{lang === "fr" ? "Projets" : "Projects"}</h3>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p: any) => (
              <button key={p.id} onClick={() => navigate({ type: "project", id: p.id })} className="group text-left rounded-xl overflow-hidden bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-lg transition-all">
                <div className="h-28 bg-[hsl(var(--dash-muted))] overflow-hidden">
                  {p.hero_image_url ? <img src={p.hero_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-[hsl(var(--dash-muted-fg))]" /></div>}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{p.name}</h4>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{p.area?.name} · <span className="capitalize">{p.status?.replace("_", " ")}</span></p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[hsl(var(--dash-muted-fg))] py-8 text-center">{lang === "fr" ? "Aucun projet" : "No projects yet"}</p>
        )}
      </div>

      {/* Assets */}
      {assets && assets.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">{lang === "fr" ? "Documents & Médias" : "Assets & Media"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assets.map((a: any) => (
              <button key={a.id} onClick={() => onPreviewAsset(a.id)} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/20 transition-all text-left w-full">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">{a.category?.icon || "📄"}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{a.title}</p>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{a.file_format?.toUpperCase()} · v{a.version}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDetail;
