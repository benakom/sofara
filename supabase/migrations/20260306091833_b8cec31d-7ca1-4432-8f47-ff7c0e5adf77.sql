-- Storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false);

-- KYC submissions table
CREATE TABLE public.kyc_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  is_uae_resident boolean NOT NULL DEFAULT false,
  client_phone text NOT NULL,
  client_email text NOT NULL,
  passport_path text,
  emirates_id_path text,
  residence_visa_path text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert own kyc submissions"
  ON public.kyc_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own kyc submissions"
  ON public.kyc_submissions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own kyc submissions"
  ON public.kyc_submissions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all kyc submissions"
  ON public.kyc_submissions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Superadmins can update all kyc submissions"
  ON public.kyc_submissions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'superadmin'));

-- Storage RLS policies
CREATE POLICY "Users can upload kyc docs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own kyc docs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Superadmins can view all kyc docs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-documents' AND has_role(auth.uid(), 'superadmin'));