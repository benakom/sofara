import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToggleFavorite, useUserFavorites, useLogDownload } from "@/hooks/useLibrary";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, Download, Heart, ExternalLink, FileText, Image, Video, Calendar, Tag, Globe, Layers, Clock } from "lucide-react";

interface Props {
  assetId: string | null;
  onClose: () => void;
}

const AssetPreviewDrawer = ({ assetId, onClose }: Props) => {
  const { lang } = useLanguage();
  const { data: asset, isLoading } = useQuery({
    queryKey: ["lib-asset", assetId],
    enabled: !!assetId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lib_assets")
        .select("*, category:lib_asset_categories(*), project:lib_projects(id, name), developer:lib_developers(id, name), area:lib_areas(id, name), city:lib_cities(id, name)")
        .eq("id", assetId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
  const { data: favorites } = useUserFavorites();
  const toggleFav = useToggleFavorite();
  const logDownload = useLogDownload();

  const isFav = favorites?.has(assetId || "");

  const handleDownload = () => {
    if (!asset?.file_url) return;
    logDownload.mutate(asset.id);
    window.open(asset.file_url, "_blank");
  };

  const isImage = asset?.asset_type === "image" || asset?.asset_type === "render";
  const isVideo = asset?.asset_type === "video";
  const isPdf = asset?.file_format?.toLowerCase() === "pdf";

  return (
    <Sheet open={!!assetId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] max-w-[90vw] p-0 border-l border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg))] overflow-y-auto [&>button]:hidden"
      >
        {asset && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{asset.category?.icon || "📄"}</span>
                <h2 className="text-sm font-semibold text-[hsl(var(--dash-fg))] truncate">{asset.title}</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4">
              {isImage && asset.file_url && (
                <div className="rounded-xl overflow-hidden bg-[hsl(var(--dash-muted))] mb-4">
                  <img src={asset.file_url} alt={asset.title} className="w-full object-contain max-h-72" />
                </div>
              )}
              {isVideo && asset.file_url && (
                <div className="rounded-xl overflow-hidden bg-black mb-4">
                  <video src={asset.file_url} controls className="w-full max-h-72" />
                </div>
              )}
              {asset.thumbnail_url && !isImage && !isVideo && (
                <div className="rounded-xl overflow-hidden bg-[hsl(var(--dash-muted))] mb-4">
                  <img src={asset.thumbnail_url} alt={asset.title} className="w-full object-contain max-h-48" />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={handleDownload}
                  disabled={!asset.file_url}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  {lang === "ar" ? "Télécharger" : "Download"}
                </button>
                <button
                  onClick={() => toggleFav.mutate({ assetId: asset.id, isFav: !!isFav })}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isFav
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : "bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] hover:border-red-500/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Description */}
              {asset.description && (
                <p className="text-sm text-[hsl(var(--dash-muted-fg))] mb-6 leading-relaxed">{asset.description}</p>
              )}

              {/* Metadata */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[hsl(var(--dash-fg))] uppercase tracking-wider">{lang === "ar" ? "التفاصيل" : "Details"}</h3>
                <MetaRow icon={<Layers className="w-3.5 h-3.5" />} label={lang === "ar" ? "Type" : "Type"} value={asset.asset_type} />
                {asset.file_format && <MetaRow icon={<FileText className="w-3.5 h-3.5" />} label="Format" value={asset.file_format.toUpperCase()} />}
                {asset.file_size && <MetaRow icon={<FileText className="w-3.5 h-3.5" />} label={lang === "ar" ? "Taille" : "Size"} value={`${(asset.file_size / 1024 / 1024).toFixed(1)} MB`} />}
                <MetaRow icon={<Tag className="w-3.5 h-3.5" />} label="Version" value={`v${asset.version}`} />
                <MetaRow icon={<Globe className="w-3.5 h-3.5" />} label={lang === "ar" ? "Langue" : "Language"} value={asset.language?.toUpperCase() || "EN"} />
                <MetaRow icon={<Clock className="w-3.5 h-3.5" />} label={lang === "ar" ? "Mis à jour" : "Updated"} value={new Date(asset.updated_at).toLocaleDateString()} />
                <MetaRow icon={<Download className="w-3.5 h-3.5" />} label="Downloads" value={String(asset.download_count)} />
                <MetaRow
                  icon={<Tag className="w-3.5 h-3.5" />}
                  label="Status"
                  value={
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      asset.status === "current" ? "bg-green-500/10 text-green-600" :
                      asset.status === "archived" ? "bg-gray-500/10 text-gray-500" :
                      "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {asset.status}
                    </span>
                  }
                />
                {asset.project && <MetaRow icon={<FileText className="w-3.5 h-3.5" />} label={lang === "ar" ? "Projet" : "Project"} value={asset.project.name} />}
                {asset.developer && <MetaRow icon={<FileText className="w-3.5 h-3.5" />} label={lang === "ar" ? "Développeur" : "Developer"} value={asset.developer.name} />}
                {asset.area && <MetaRow icon={<FileText className="w-3.5 h-3.5" />} label={lang === "ar" ? "Zone" : "Area"} value={asset.area.name} />}
              </div>

              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-[hsl(var(--dash-fg))] uppercase tracking-wider mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-[hsl(var(--dash-muted))] text-xs text-[hsl(var(--dash-muted-fg))]">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const MetaRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--dash-border))]/50 last:border-0">
    <div className="flex items-center gap-2 text-[hsl(var(--dash-muted-fg))]">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-xs font-medium text-[hsl(var(--dash-fg))] capitalize">{value}</span>
  </div>
);

export default AssetPreviewDrawer;
