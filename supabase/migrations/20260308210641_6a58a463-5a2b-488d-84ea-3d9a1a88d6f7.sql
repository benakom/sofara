
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'dubai',
  level TEXT NOT NULL DEFAULT 'beginner',
  duration TEXT NOT NULL DEFAULT '0h 00min',
  lessons_count INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 100,
  thumbnail_url TEXT,
  youtube_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view published courses
CREATE POLICY "Authenticated users can view published courses"
  ON public.courses FOR SELECT TO authenticated
  USING (is_published = true);

-- Superadmins can do everything
CREATE POLICY "Superadmins can view all courses"
  ON public.courses FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can insert courses"
  ON public.courses FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can update courses"
  ON public.courses FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can delete courses"
  ON public.courses FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'superadmin'::app_role));
