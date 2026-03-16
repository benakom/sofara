import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import LibraryHome from "@/components/library/LibraryHome";
import LibraryBrowse from "@/components/library/LibraryBrowse";
import ProjectDetail from "@/components/library/ProjectDetail";
import DeveloperDetail from "@/components/library/DeveloperDetail";
import AreaDetail from "@/components/library/AreaDetail";
import AssetPreviewDrawer from "@/components/library/AssetPreviewDrawer";

export type LibraryView =
  | { type: "home" }
  | { type: "browse"; tab?: string }
  | { type: "project"; id: string }
  | { type: "developer"; id: string }
  | { type: "area"; id: string };

const Library = () => {
  const { lang } = useLanguage();
  const [view, setView] = useState<LibraryView>({ type: "home" });
  const [previewAssetId, setPreviewAssetId] = useState<string | null>(null);

  const navigate = (v: LibraryView) => setView(v);
  const goHome = () => setView({ type: "home" });

  return (
    <div className="min-h-0">
      {view.type === "home" && (
        <LibraryHome navigate={navigate} onPreviewAsset={setPreviewAssetId} />
      )}
      {view.type === "browse" && (
        <LibraryBrowse navigate={navigate} defaultTab={view.tab} onPreviewAsset={setPreviewAssetId} />
      )}
      {view.type === "project" && (
        <ProjectDetail projectId={view.id} navigate={navigate} onPreviewAsset={setPreviewAssetId} />
      )}
      {view.type === "developer" && (
        <DeveloperDetail developerId={view.id} navigate={navigate} onPreviewAsset={setPreviewAssetId} />
      )}
      {view.type === "area" && (
        <AreaDetail areaId={view.id} navigate={navigate} onPreviewAsset={setPreviewAssetId} />
      )}

      <AssetPreviewDrawer assetId={previewAssetId} onClose={() => setPreviewAssetId(null)} />
    </div>
  );
};

export default Library;
