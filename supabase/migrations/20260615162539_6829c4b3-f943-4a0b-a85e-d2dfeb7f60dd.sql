
CREATE TABLE public.ambassador_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  occupation text NOT NULL,
  ref_code text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ambassador_applications TO authenticated;
GRANT INSERT ON public.ambassador_applications TO anon;
GRANT ALL ON public.ambassador_applications TO service_role;

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.ambassador_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Superadmins can view applications"
  ON public.ambassador_applications FOR SELECT
  TO authenticated
  USING (public.is_superadmin());

CREATE POLICY "Superadmins can update applications"
  ON public.ambassador_applications FOR UPDATE
  TO authenticated
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Superadmins can delete applications"
  ON public.ambassador_applications FOR DELETE
  TO authenticated
  USING (public.is_superadmin());

CREATE INDEX idx_amb_apps_status_created ON public.ambassador_applications (status, created_at DESC);
