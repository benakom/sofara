import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDevelopers, useProjects, useAreas, useCities, useAssets, useAssetCategories } from "@/hooks/useLibrary";
import { Search, Building2, MapPin, Folder, Grid3X3, List, ChevronLeft, Star, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryView } from "@/pages/dashboard/Library";

interface Props {
  navigate: (v: LibraryView) => void;
  defaultTab?: string;
  onPreviewAsset: (id: string) => void;
}

const tabs = [
  { id: "projects", icon: Folder, labelEn: "Projects", labelAr: "Projets" },
  { id: "developers", icon: Building2, labelEn: "Developers", labelAr: "Développeurs" },
  { id: "areas", icon: MapPin, labelEn: "Areas", labelAr: "Zones" },
  { id: "assets", icon: Grid3X3, labelEn: "Documents", labelAr: "Documents" },
  { id: "favorites", icon: Star, labelEn: "Favorites", labelAr: "Favoris" },
];

const LibraryBrowse = ({ navigate, defaultTab = "projects", onPreviewAsset }: Props) => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState(defaultTab);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: projects, isLoading: pLoading } = useProjects();
  const { data: developers, isLoading: dLoading } = useDevelopers();
  const { data: areas, isLoading: aLoading } = useAreas();
  const { data: assets, isLoading: asLoading } = useAssets({ search: search || undefined });

  const filterBySearch = (items: any[], keys: string[]) => {
    if (!search) return items;
    const lower = search.toLowerCase();
    return items?.filter((i) => keys.some((k) => i[k]?.toString().toLowerCase().includes(lower))) || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ type: "home" })} className="p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-display font-bold text-[hsl(var(--dash-fg))]">
          {lang === "ar" ? "Explorer la Bibliothèque" : "Browse Library"}
        </h1>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-[hsl(var(--dash-muted))]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-fg))] shadow-sm"
                  : "text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {lang === "ar" ? t.labelAr : t.labelEn}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث..." : "Search..."}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/30"
            />
          </div>
          <div className="flex gap-0.5 p-0.5 rounded-lg bg-[hsl(var(--dash-muted))]">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-[hsl(var(--dash-card))] shadow-sm" : ""}`}>
              <Grid3X3 className="w-3.5 h-3.5 text-[hsl(var(--dash-fg))]" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-[hsl(var(--dash-card))] shadow-sm" : ""}`}>
              <List className="w-3.5 h-3.5 text-[hsl(var(--dash-fg))]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {tab === "projects" && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {pLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className={viewMode === "grid" ? "h-48 rounded-xl" : "h-16 rounded-lg"} />)
          ) : filterBySearch(projects || [], ["name"]).length > 0 ? (
            filterBySearch(projects || [], ["name"]).map((p: any) =>
              viewMode === "grid" ? (
                <button key={p.id} onClick={() => navigate({ type: "project", id: p.id })} className="group text-left rounded-xl overflow-hidden bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-lg transition-all">
                  <div className="h-28 bg-[hsl(var(--dash-muted))] overflow-hidden">
                    {p.hero_image_url ? <img src={p.hero_image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-[hsl(var(--dash-muted-fg))]" /></div>}
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{p.name}</h3>
                    <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{p.developer?.name} · {p.area?.name}</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))] capitalize">{p.status?.replace("_", " ")}</span>
                  </div>
                </button>
              ) : (
                <button key={p.id} onClick={() => navigate({ type: "project", id: p.id })} className="w-full flex items-center gap-4 p-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/20 transition-all text-left">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--dash-muted))] shrink-0 overflow-hidden">
                    {p.hero_image_url ? <img src={p.hero_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-5 h-5 text-[hsl(var(--dash-muted-fg))]" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{p.name}</h3>
                    <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{p.developer?.name} · {p.area?.name}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))] capitalize shrink-0">{p.status?.replace("_", " ")}</span>
                </button>
              )
            )
          ) : (
            <EmptyBrowse />
          )}
        </div>
      )}

      {tab === "developers" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : filterBySearch(developers || [], ["name"]).length > 0 ? (
            filterBySearch(developers || [], ["name"]).map((d: any) => (
              <button key={d.id} onClick={() => navigate({ type: "developer", id: d.id })} className="flex flex-col items-center gap-3 p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-xl font-bold text-[hsl(var(--dash-muted-fg))] group-hover:bg-[hsl(var(--primary))]/10 group-hover:text-[hsl(var(--primary))] transition-colors">
                  {d.logo_url ? <img src={d.logo_url} alt={d.name} className="w-full h-full rounded-full object-cover" /> : d.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-[hsl(var(--dash-fg))]">{d.name}</span>
              </button>
            ))
          ) : (
            <EmptyBrowse />
          )}
        </div>
      )}

      {tab === "areas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {aLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
          ) : filterBySearch(areas || [], ["name"]).length > 0 ? (
            filterBySearch(areas || [], ["name"]).map((a: any) => (
              <button key={a.id} onClick={() => navigate({ type: "area", id: a.id })} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/30 hover:shadow-md transition-all text-left group">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{a.name}</h3>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{a.city?.name || "Dubai"}</p>
                </div>
              </button>
            ))
          ) : (
            <EmptyBrowse />
          )}
        </div>
      )}

      {tab === "assets" && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" : "space-y-2"}>
          {asLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className={viewMode === "grid" ? "h-24 rounded-xl" : "h-14 rounded-lg"} />)
          ) : filterBySearch(assets || [], ["title", "description"]).length > 0 ? (
            filterBySearch(assets || [], ["title", "description"]).map((a: any) => (
              <button key={a.id} onClick={() => onPreviewAsset(a.id)} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/20 transition-all text-left w-full">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-base shrink-0">{a.category?.icon || "📄"}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{a.title}</p>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))] truncate">{a.project?.name || a.developer?.name} · {a.file_format?.toUpperCase()}</p>
                </div>
              </button>
            ))
          ) : (
            <EmptyBrowse />
          )}
        </div>
      )}

      {tab === "favorites" && (
        <EmptyBrowse text={lang === "ar" ? "Vos favoris apparaîtront ici" : "Your favorites will appear here"} />
      )}
    </div>
  );
};

const EmptyBrowse = ({ text }: { text?: string }) => (
  <div className="col-span-full py-16 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--dash-muted))] flex items-center justify-center">
      <Folder className="w-7 h-7 text-[hsl(var(--dash-muted-fg))]" />
    </div>
    <p className="text-sm text-[hsl(var(--dash-muted-fg))]">{text || "No items found"}</p>
  </div>
);

export default LibraryBrowse;
