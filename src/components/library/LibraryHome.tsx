import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDevelopers, useProjects, useAssets, useAreas } from "@/hooks/useLibrary";
import { Search, Building2, MapPin, Folder, Star, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryView } from "@/pages/dashboard/Library";

interface Props {
  navigate: (v: LibraryView) => void;
  onPreviewAsset: (id: string) => void;
}

const LibraryHome = ({ navigate, onPreviewAsset }: Props) => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const { data: developers, isLoading: devLoading } = useDevelopers();
  const { data: projects, isLoading: projLoading } = useProjects({ featured: true });
  const { data: areas } = useAreas();
  const { data: assets, isLoading: assetLoading } = useAssets({ search: search || undefined });

  const t = {
    title: lang === "fr" ? "Project Intelligence Library" : "Project Intelligence Library",
    subtitle: lang === "fr" ? "Accédez à tous les documents, médias et données projets en un seul endroit" : "Access all project documents, media and data in one place",
    search: lang === "fr" ? "Rechercher un projet, développeur, document..." : "Search project, developer, document...",
    featured: lang === "fr" ? "Projets vedettes" : "Featured Projects",
    developers: lang === "fr" ? "Développeurs" : "Top Developers",
    areas: lang === "fr" ? "Zones populaires" : "Popular Areas",
    recent: lang === "fr" ? "Derniers documents" : "Latest Uploads",
    browseAll: lang === "fr" ? "Tout explorer" : "Browse All",
    noResults: lang === "fr" ? "Aucun résultat" : "No results found",
    viewAll: lang === "fr" ? "Voir tout" : "View All",
  };

  const showSearchResults = search.length > 2;

  return (
    <div className="space-y-8">
      {/* Hero Search */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--dash-sidebar-bg))] to-[hsl(225,15%,18%)] p-8 md:p-12">
        <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-mesh)" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{t.title}</h1>
          <p className="text-sm text-white/60">{t.subtitle}</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
            />
          </div>
        </div>
      </div>

      {/* Search results overlay */}
      {showSearchResults && (
        <div className="bg-[hsl(var(--dash-card))] rounded-xl border border-[hsl(var(--dash-border))] p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {assets?.length || 0} {lang === "fr" ? "résultats" : "results"}
          </h3>
          {assetLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
            </div>
          ) : assets && assets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {assets.slice(0, 9).map((a: any) => (
                <button
                  key={a.id}
                  onClick={() => onPreviewAsset(a.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-lg">
                    {a.category?.icon || "📄"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{a.title}</p>
                    <p className="text-xs text-[hsl(var(--dash-muted-fg))] truncate">{a.project?.name || a.developer?.name || ""}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[hsl(var(--dash-muted-fg))]">{t.noResults}</p>
          )}
        </div>
      )}

      {!showSearchResults && (
        <>
          {/* Quick browse buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Building2, label: lang === "fr" ? "Développeurs" : "Developers", tab: "developers" },
              { icon: MapPin, label: lang === "fr" ? "Zones" : "Areas", tab: "areas" },
              { icon: Folder, label: lang === "fr" ? "Projets" : "Projects", tab: "projects" },
              { icon: Star, label: lang === "fr" ? "Favoris" : "Favorites", tab: "favorites" },
            ].map((btn) => (
              <button
                key={btn.tab}
                onClick={() => navigate({ type: "browse", tab: btn.tab })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm font-medium text-[hsl(var(--dash-fg))] hover:border-[hsl(var(--primary))]/30 hover:shadow-sm transition-all"
              >
                <btn.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                {btn.label}
              </button>
            ))}
          </div>

          {/* Featured Projects */}
          <Section title={t.featured} icon={<TrendingUp className="w-4 h-4" />} onViewAll={() => navigate({ type: "browse", tab: "projects" })}>
            {projLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((p: any) => (
                  <ProjectCard key={p.id} project={p} onClick={() => navigate({ type: "project", id: p.id })} />
                ))}
              </div>
            ) : (
              <EmptyState text={lang === "fr" ? "Aucun projet vedette pour le moment" : "No featured projects yet"} />
            )}
          </Section>

          {/* Top Developers */}
          <Section title={t.developers} icon={<Building2 className="w-4 h-4" />} onViewAll={() => navigate({ type: "browse", tab: "developers" })}>
            {devLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
            ) : developers && developers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {developers.slice(0, 12).map((d: any) => (
                  <button
                    key={d.id}
                    onClick={() => navigate({ type: "developer", id: d.id })}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-lg font-bold text-[hsl(var(--dash-muted-fg))] group-hover:bg-[hsl(var(--primary))]/10 group-hover:text-[hsl(var(--primary))] transition-colors">
                      {d.logo_url ? <img src={d.logo_url} alt={d.name} className="w-full h-full rounded-full object-cover" /> : d.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-[hsl(var(--dash-fg))] text-center leading-tight">{d.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState text={lang === "fr" ? "Aucun développeur ajouté" : "No developers added yet"} />
            )}
          </Section>

          {/* Popular Areas */}
          <Section title={t.areas} icon={<MapPin className="w-4 h-4" />} onViewAll={() => navigate({ type: "browse", tab: "areas" })}>
            {areas && areas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {areas.slice(0, 15).map((a: any) => (
                  <button
                    key={a.id}
                    onClick={() => navigate({ type: "area", id: a.id })}
                    className="px-4 py-2 rounded-full bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--primary))]/5 transition-all"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState text={lang === "fr" ? "Aucune zone ajoutée" : "No areas added yet"} />
            )}
          </Section>

          {/* Latest Assets */}
          <Section title={t.recent} icon={<Clock className="w-4 h-4" />}>
            {assetLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : assets && assets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {assets.slice(0, 8).map((a: any) => (
                  <button
                    key={a.id}
                    onClick={() => onPreviewAsset(a.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/20 hover:shadow-sm transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-base shrink-0">
                      {a.category?.icon || "📄"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{a.title}</p>
                      <p className="text-xs text-[hsl(var(--dash-muted-fg))] truncate">{a.file_format?.toUpperCase()} · v{a.version}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState text={lang === "fr" ? "Aucun document uploadé" : "No assets uploaded yet"} />
            )}
          </Section>
        </>
      )}
    </div>
  );
};

const Section = ({ title, icon, children, onViewAll }: { title: string; icon: React.ReactNode; children: React.ReactNode; onViewAll?: () => void }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[hsl(var(--primary))]">{icon}</span>
        <h2 className="text-base font-semibold text-[hsl(var(--dash-fg))]">{title}</h2>
      </div>
      {onViewAll && (
        <button onClick={onViewAll} className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline font-medium">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
    {children}
  </section>
);

const ProjectCard = ({ project, onClick }: { project: any; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group text-left rounded-xl overflow-hidden bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-lg transition-all"
  >
    <div className="h-32 bg-[hsl(var(--dash-muted))] relative overflow-hidden">
      {project.hero_image_url ? (
        <img src={project.hero_image_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[hsl(var(--dash-muted-fg))]">
          <Building2 className="w-8 h-8" />
        </div>
      )}
      {project.is_featured && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-bold">Featured</span>
      )}
    </div>
    <div className="p-4 space-y-1">
      <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{project.name}</h3>
      <p className="text-xs text-[hsl(var(--dash-muted-fg))]">
        {project.developer?.name} · {project.area?.name}
      </p>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))] capitalize">
          {project.status?.replace("_", " ")}
        </span>
        {project.property_type && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))] capitalize">
            {project.property_type}
          </span>
        )}
      </div>
    </div>
  </button>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="py-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--dash-muted))] flex items-center justify-center">
      <Folder className="w-7 h-7 text-[hsl(var(--dash-muted-fg))]" />
    </div>
    <p className="text-sm text-[hsl(var(--dash-muted-fg))]">{text}</p>
  </div>
);

export default LibraryHome;
