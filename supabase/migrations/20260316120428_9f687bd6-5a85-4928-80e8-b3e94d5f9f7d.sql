
-- =============================================
-- PROJECT INTELLIGENCE LIBRARY SCHEMA
-- =============================================

-- Cities
CREATE TABLE public.lib_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  country text NOT NULL DEFAULT 'UAE',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view cities" ON public.lib_cities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmins can manage cities" ON public.lib_cities FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Areas
CREATE TABLE public.lib_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES public.lib_cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  highlights jsonb DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(city_id, name)
);
ALTER TABLE public.lib_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view areas" ON public.lib_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmins can manage areas" ON public.lib_areas FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Developers
CREATE TABLE public.lib_developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  description text,
  website text,
  trust_points jsonb DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view developers" ON public.lib_developers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmins can manage developers" ON public.lib_developers FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Projects
CREATE TABLE public.lib_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  developer_id uuid NOT NULL REFERENCES public.lib_developers(id) ON DELETE CASCADE,
  area_id uuid NOT NULL REFERENCES public.lib_areas(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'under_construction',
  property_type text NOT NULL DEFAULT 'apartment',
  handover_date text,
  price_from numeric,
  price_to numeric,
  bedrooms text,
  description text,
  hero_image_url text,
  ai_summary text,
  selling_points jsonb DEFAULT '[]'::jsonb,
  target_buyer text,
  objection_handling jsonb DEFAULT '[]'::jsonb,
  quick_pitch text,
  whatsapp_summary text,
  social_captions jsonb DEFAULT '[]'::jsonb,
  faq jsonb DEFAULT '[]'::jsonb,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view projects" ON public.lib_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmins can manage projects" ON public.lib_projects FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Asset Categories
CREATE TABLE public.lib_asset_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text DEFAULT '📄',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.lib_asset_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view categories" ON public.lib_asset_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmins can manage categories" ON public.lib_asset_categories FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Assets
CREATE TABLE public.lib_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  asset_type text NOT NULL DEFAULT 'document',
  category_id uuid REFERENCES public.lib_asset_categories(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.lib_projects(id) ON DELETE CASCADE,
  developer_id uuid REFERENCES public.lib_developers(id) ON DELETE SET NULL,
  area_id uuid REFERENCES public.lib_areas(id) ON DELETE SET NULL,
  city_id uuid REFERENCES public.lib_cities(id) ON DELETE SET NULL,
  file_url text,
  file_format text,
  file_size bigint,
  thumbnail_url text,
  language text DEFAULT 'en',
  version integer NOT NULL DEFAULT 1,
  tags text[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_approved boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'current',
  visibility text NOT NULL DEFAULT 'all',
  sort_priority integer NOT NULL DEFAULT 0,
  uploaded_by uuid,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view approved assets" ON public.lib_assets FOR SELECT TO authenticated USING (is_approved = true OR is_superadmin());
CREATE POLICY "Superadmins can manage assets" ON public.lib_assets FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

CREATE INDEX idx_lib_assets_project ON public.lib_assets(project_id);
CREATE INDEX idx_lib_assets_developer ON public.lib_assets(developer_id);
CREATE INDEX idx_lib_assets_area ON public.lib_assets(area_id);
CREATE INDEX idx_lib_assets_type ON public.lib_assets(asset_type);
CREATE INDEX idx_lib_assets_tags ON public.lib_assets USING GIN(tags);

-- User Favorites
CREATE TABLE public.lib_user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  asset_id uuid NOT NULL REFERENCES public.lib_assets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, asset_id)
);
ALTER TABLE public.lib_user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.lib_user_favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Recent Views
CREATE TABLE public.lib_user_recent_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  asset_id uuid REFERENCES public.lib_assets(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.lib_projects(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_user_recent_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own views" ON public.lib_user_recent_views FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Download Logs
CREATE TABLE public.lib_download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  asset_id uuid NOT NULL REFERENCES public.lib_assets(id) ON DELETE CASCADE,
  downloaded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lib_download_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own downloads" ON public.lib_download_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can log downloads" ON public.lib_download_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Superadmins view all downloads" ON public.lib_download_logs FOR SELECT TO authenticated USING (is_superadmin());

-- Insert default asset categories
INSERT INTO public.lib_asset_categories (name, icon, sort_order) VALUES
  ('Brochure', '📖', 1),
  ('Floor Plan', '📐', 2),
  ('Payment Plan', '💳', 3),
  ('Price List', '💰', 4),
  ('Masterplan', '🗺️', 5),
  ('Availability', '📊', 6),
  ('Photo', '📷', 7),
  ('Render', '🎨', 8),
  ('Video', '🎬', 9),
  ('Developer Logo', '🏢', 10),
  ('Area Guide', '📍', 11),
  ('FAQ', '❓', 12),
  ('Legal Document', '⚖️', 13),
  ('Campaign Creative', '🎯', 14),
  ('Social Media Asset', '📱', 15);

-- Insert default cities
INSERT INTO public.lib_cities (name, country, sort_order) VALUES
  ('Dubai', 'UAE', 1),
  ('Abu Dhabi', 'UAE', 2),
  ('Ras Al Khaimah', 'UAE', 3),
  ('Sharjah', 'UAE', 4),
  ('Ajman', 'UAE', 5);

-- Insert popular Dubai areas
INSERT INTO public.lib_areas (city_id, name, sort_order) 
SELECT c.id, a.name, a.sort_order
FROM public.lib_cities c,
(VALUES 
  ('Dubai Marina', 1), ('Business Bay', 2), ('JVC', 3), ('Dubai Hills', 4),
  ('Downtown Dubai', 5), ('Arjan', 6), ('Dubai South', 7), ('Motor City', 8),
  ('Palm Jumeirah', 9), ('Dubai Islands', 10), ('MBR City', 11), ('Dubai Creek Harbour', 12),
  ('Al Furjan', 13), ('Dubailand', 14), ('Jumeirah Village Triangle', 15)
) AS a(name, sort_order)
WHERE c.name = 'Dubai';

-- Insert top developers
INSERT INTO public.lib_developers (name, sort_order) VALUES
  ('Emaar', 1), ('Sobha', 2), ('Damac', 3), ('Nakheel', 4),
  ('Ellington', 5), ('Omniyat', 6), ('Meraas', 7), ('Azizi', 8),
  ('Danube', 9), ('Binghatti', 10), ('Select Group', 11), ('MAG', 12);

-- Storage bucket for library assets
INSERT INTO storage.buckets (id, name, public) VALUES ('library-assets', 'library-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view library assets" ON storage.objects FOR SELECT USING (bucket_id = 'library-assets');
CREATE POLICY "Superadmins can upload library assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'library-assets' AND public.is_superadmin());
CREATE POLICY "Superadmins can update library assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'library-assets' AND public.is_superadmin());
CREATE POLICY "Superadmins can delete library assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'library-assets' AND public.is_superadmin());
