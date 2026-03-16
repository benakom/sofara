import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface LibCity { id: string; name: string; country: string; sort_order: number; }
export interface LibArea { id: string; city_id: string; name: string; description: string | null; image_url: string | null; highlights: any; sort_order: number; }
export interface LibDeveloper { id: string; name: string; logo_url: string | null; description: string | null; website: string | null; trust_points: any; sort_order: number; }
export interface LibProject {
  id: string; name: string; developer_id: string; area_id: string; status: string; property_type: string;
  handover_date: string | null; price_from: number | null; price_to: number | null; bedrooms: string | null;
  description: string | null; hero_image_url: string | null; ai_summary: string | null;
  selling_points: any; target_buyer: string | null; objection_handling: any; quick_pitch: string | null;
  whatsapp_summary: string | null; social_captions: any; faq: any; is_featured: boolean; sort_order: number;
  created_at: string; updated_at: string;
  // joined
  developer?: LibDeveloper; area?: LibArea & { city?: LibCity };
}
export interface LibAssetCategory { id: string; name: string; icon: string; sort_order: number; }
export interface LibAsset {
  id: string; title: string; description: string | null; asset_type: string; category_id: string | null;
  project_id: string | null; developer_id: string | null; area_id: string | null; city_id: string | null;
  file_url: string | null; file_format: string | null; file_size: number | null; thumbnail_url: string | null;
  language: string; version: number; tags: string[]; is_featured: boolean; is_approved: boolean;
  status: string; visibility: string; sort_priority: number; download_count: number;
  created_at: string; updated_at: string;
  // joined
  category?: LibAssetCategory; project?: { id: string; name: string }; developer?: { id: string; name: string };
  area?: { id: string; name: string }; city?: { id: string; name: string };
  is_favorited?: boolean;
}

export const useCities = () => useQuery({
  queryKey: ["lib-cities"],
  queryFn: async () => {
    const { data, error } = await supabase.from("lib_cities").select("*").order("sort_order");
    if (error) throw error;
    return data as LibCity[];
  },
});

export const useAreas = (cityId?: string) => useQuery({
  queryKey: ["lib-areas", cityId],
  queryFn: async () => {
    let q = supabase.from("lib_areas").select("*, city:lib_cities(*)").order("sort_order");
    if (cityId) q = q.eq("city_id", cityId);
    const { data, error } = await q;
    if (error) throw error;
    return data as any[];
  },
});

export const useDevelopers = () => useQuery({
  queryKey: ["lib-developers"],
  queryFn: async () => {
    const { data, error } = await supabase.from("lib_developers").select("*").order("sort_order");
    if (error) throw error;
    return data as LibDeveloper[];
  },
});

export const useProjects = (filters?: { areaId?: string; developerId?: string; status?: string; featured?: boolean }) => useQuery({
  queryKey: ["lib-projects", filters],
  queryFn: async () => {
    let q = supabase.from("lib_projects").select("*, developer:lib_developers(*), area:lib_areas(*, city:lib_cities(*))").order("sort_order");
    if (filters?.areaId) q = q.eq("area_id", filters.areaId);
    if (filters?.developerId) q = q.eq("developer_id", filters.developerId);
    if (filters?.status) q = q.eq("status", filters.status);
    if (filters?.featured) q = q.eq("is_featured", true);
    const { data, error } = await q;
    if (error) throw error;
    return data as any[];
  },
});

export const useProject = (id?: string) => useQuery({
  queryKey: ["lib-project", id],
  enabled: !!id,
  queryFn: async () => {
    const { data, error } = await supabase.from("lib_projects").select("*, developer:lib_developers(*), area:lib_areas(*, city:lib_cities(*))").eq("id", id!).single();
    if (error) throw error;
    return data as any;
  },
});

export const useAssetCategories = () => useQuery({
  queryKey: ["lib-asset-categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("lib_asset_categories").select("*").order("sort_order");
    if (error) throw error;
    return data as LibAssetCategory[];
  },
});

export const useAssets = (filters?: { projectId?: string; developerId?: string; areaId?: string; categoryId?: string; assetType?: string; search?: string }) => useQuery({
  queryKey: ["lib-assets", filters],
  queryFn: async () => {
    let q = supabase.from("lib_assets").select("*, category:lib_asset_categories(*), project:lib_projects(id, name), developer:lib_developers(id, name), area:lib_areas(id, name), city:lib_cities(id, name)").order("sort_priority", { ascending: false }).order("updated_at", { ascending: false });
    if (filters?.projectId) q = q.eq("project_id", filters.projectId);
    if (filters?.developerId) q = q.eq("developer_id", filters.developerId);
    if (filters?.areaId) q = q.eq("area_id", filters.areaId);
    if (filters?.categoryId) q = q.eq("category_id", filters.categoryId);
    if (filters?.assetType) q = q.eq("asset_type", filters.assetType);
    if (filters?.search) q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return data as any[];
  },
});

export const useUserFavorites = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["lib-favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("lib_user_favorites").select("asset_id").eq("user_id", user!.id);
      if (error) throw error;
      return new Set(data.map((f: any) => f.asset_id));
    },
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ assetId, isFav }: { assetId: string; isFav: boolean }) => {
      if (isFav) {
        await supabase.from("lib_user_favorites").delete().eq("user_id", user!.id).eq("asset_id", assetId);
      } else {
        await supabase.from("lib_user_favorites").insert({ user_id: user!.id, asset_id: assetId });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lib-favorites"] }),
  });
};

export const useLogDownload = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (assetId: string) => {
      if (!user) return;
      await supabase.from("lib_download_logs").insert({ user_id: user.id, asset_id: assetId });
      // increment download_count
      await supabase.rpc("increment_download_count" as any, { _asset_id: assetId } as any).throwOnError();
    },
  });
};
