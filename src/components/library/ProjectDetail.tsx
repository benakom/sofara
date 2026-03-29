import { useLanguage } from "@/i18n/LanguageContext";
import { useProject, useAssets } from "@/hooks/useLibrary";
import { ChevronLeft, Building2, MapPin, Calendar, DollarSign, Bed, Sparkles, MessageCircle, Share2, FileText, Image, Video, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryView } from "@/pages/dashboard/Library";
import { useState } from "react";

interface Props {
  projectId: string;
  navigate: (v: LibraryView) => void;
  onPreviewAsset: (id: string) => void;
}

const projectTabs = [
  { id: "overview", labelEn: "Overview", labelAr: "Aperçu" },
  { id: "documents", labelEn: "Documents", labelAr: "Documents" },
  { id: "media", labelEn: "Media", labelAr: "Médias" },
  { id: "toolkit", labelEn: "Sales Toolkit", labelAr: "Kit de Vente" },
];

const ProjectDetail = ({ projectId, navigate, onPreviewAsset }: Props) => {
  const { lang } = useLanguage();
  const { data: project, isLoading } = useProject(projectId);
  const { data: assets } = useAssets({ projectId });
  const [tab, setTab] = useState("overview");

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    </div>
  );

  if (!project) return <div className="py-20 text-center text-[hsl(var(--dash-muted-fg))]">Project not found</div>;

  const documents = assets?.filter((a: any) => ["document", "pdf", "spreadsheet"].includes(a.asset_type)) || [];
  const media = assets?.filter((a: any) => ["image", "video", "render"].includes(a.asset_type)) || [];
  const sellingPoints = Array.isArray(project.selling_points) ? project.selling_points : [];
  const faqs = Array.isArray(project.faq) ? project.faq : [];
  const objections = Array.isArray(project.objection_handling) ? project.objection_handling : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--dash-muted-fg))]">
        <button onClick={() => navigate({ type: "home" })} className="hover:text-[hsl(var(--primary))]">Library</button>
        <span>/</span>
        <button onClick={() => navigate({ type: "browse", tab: "projects" })} className="hover:text-[hsl(var(--primary))]">{lang === "ar" ? "مشاريع" : "Projects"}</button>
        <span>/</span>
        <span className="text-[hsl(var(--dash-fg))] font-medium">{project.name}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-56 bg-[hsl(var(--dash-muted))]">
        {project.hero_image_url ? (
          <img src={project.hero_image_url} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--dash-sidebar-bg))] to-[hsl(225,15%,18%)]">
            <Building2 className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {project.developer && (
              <button onClick={() => navigate({ type: "developer", id: project.developer_id })} className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium hover:bg-white/30 transition-colors">
                <Building2 className="w-3 h-3 inline mr-1" />{project.developer.name}
              </button>
            )}
            {project.area && (
              <button onClick={() => navigate({ type: "area", id: project.area_id })} className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium hover:bg-white/30 transition-colors">
                <MapPin className="w-3 h-3 inline mr-1" />{project.area.name}
              </button>
            )}
            <span className="px-2.5 py-1 rounded-full bg-[hsl(var(--primary))]/80 text-white text-[11px] font-medium capitalize">
              {project.status?.replace("_", " ")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{project.name}</h1>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: DollarSign, label: lang === "ar" ? "Prix" : "Price", value: project.price_from ? `AED ${(project.price_from / 1000).toFixed(0)}K${project.price_to ? ` - ${(project.price_to / 1000000).toFixed(1)}M` : "+"}` : "TBA" },
          { icon: Bed, label: lang === "ar" ? "Chambres" : "Bedrooms", value: project.bedrooms || "TBA" },
          { icon: Calendar, label: lang === "ar" ? "Livraison" : "Handover", value: project.handover_date || "TBA" },
          { icon: FileText, label: lang === "ar" ? "Documents" : "Documents", value: `${assets?.length || 0} files` },
        ].map((m, i) => (
          <div key={i} className="p-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
            <div className="flex items-center gap-2 mb-1">
              <m.icon className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
              <span className="text-[11px] text-[hsl(var(--dash-muted-fg))]">{m.label}</span>
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[hsl(var(--dash-muted))] w-fit">
        {projectTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-fg))] shadow-sm" : "text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"
            }`}
          >
            {lang === "ar" ? t.labelAr : t.labelEn}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {project.description && (
              <div className="p-6 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">{lang === "ar" ? "Description" : "Description"}</h3>
                <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>
            )}
            {sellingPoints.length > 0 && (
              <div className="p-6 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">🔑 {lang === "ar" ? "Points clés de vente" : "Key Selling Points"}</h3>
                <ul className="space-y-2">
                  {sellingPoints.map((sp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--dash-muted-fg))]">
                      <span className="text-[hsl(var(--primary))] mt-0.5">•</span>{sp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {faqs.length > 0 && (
              <div className="p-6 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-3">❓ FAQ</h3>
                <div className="space-y-3">
                  {faqs.map((f: any, i: number) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-[hsl(var(--dash-fg))]">{f.q}</p>
                      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Right sidebar */}
          <div className="space-y-4">
            {project.ai_summary && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">AI Summary</h3>
                </div>
                <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed">{project.ai_summary}</p>
              </div>
            )}
            {project.quick_pitch && (
              <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-2">🎯 Quick Pitch</h3>
                <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed">{project.quick_pitch}</p>
              </div>
            )}
            {project.whatsapp_summary && (
              <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">WhatsApp Ready</h3>
                </div>
                <p className="text-sm text-[hsl(var(--dash-muted-fg))] leading-relaxed">{project.whatsapp_summary}</p>
                <button className="mt-3 w-full py-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors">
                  📋 {lang === "ar" ? "Copier" : "Copy"}
                </button>
              </div>
            )}
            {project.target_buyer && (
              <div className="p-5 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-2">👤 {lang === "ar" ? "Profil Acheteur" : "Buyer Profile"}</h3>
                <p className="text-sm text-[hsl(var(--dash-muted-fg))]">{project.target_buyer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.length > 0 ? documents.map((a: any) => (
            <AssetCard key={a.id} asset={a} onClick={() => onPreviewAsset(a.id)} />
          )) : (
            <div className="col-span-full py-16 text-center text-sm text-[hsl(var(--dash-muted-fg))]">
              {lang === "ar" ? "Aucun document pour le moment" : "No documents yet"}
            </div>
          )}
        </div>
      )}

      {tab === "media" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {media.length > 0 ? media.map((a: any) => (
            <AssetCard key={a.id} asset={a} onClick={() => onPreviewAsset(a.id)} />
          )) : (
            <div className="col-span-full py-16 text-center text-sm text-[hsl(var(--dash-muted-fg))]">
              {lang === "ar" ? "Aucun média pour le moment" : "No media yet"}
            </div>
          )}
        </div>
      )}

      {tab === "toolkit" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {objections.length > 0 && (
            <div className="p-6 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
              <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">💡 {lang === "ar" ? "Objections & Réponses" : "Objections & Answers"}</h3>
              <div className="space-y-4">
                {objections.map((o: any, i: number) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-[hsl(var(--destructive))]">❌ {o.objection}</p>
                    <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1">✅ {o.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(project.social_captions) && project.social_captions.length > 0 && (
            <div className="p-6 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{lang === "ar" ? "Captions Réseaux Sociaux" : "Social Media Captions"}</h3>
              </div>
              <div className="space-y-3">
                {project.social_captions.map((c: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-[hsl(var(--dash-muted))] text-sm text-[hsl(var(--dash-muted-fg))]">{c}</div>
                ))}
              </div>
            </div>
          )}
          {!objections.length && !project.social_captions?.length && (
            <div className="col-span-full py-16 text-center text-sm text-[hsl(var(--dash-muted-fg))]">
              {lang === "ar" ? "Le kit de vente sera bientôt disponible" : "Sales toolkit coming soon"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AssetCard = ({ asset, onClick }: { asset: any; onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary))]/20 hover:shadow-sm transition-all text-left w-full">
    <div className="w-11 h-11 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-base shrink-0">
      {asset.category?.icon || "📄"}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{asset.title}</p>
      <p className="text-xs text-[hsl(var(--dash-muted-fg))]">
        {asset.file_format?.toUpperCase()} · v{asset.version}
        {asset.file_size ? ` · ${(asset.file_size / 1024 / 1024).toFixed(1)}MB` : ""}
      </p>
    </div>
    <Download className="w-4 h-4 text-[hsl(var(--dash-muted-fg))] shrink-0" />
  </button>
);

export default ProjectDetail;
