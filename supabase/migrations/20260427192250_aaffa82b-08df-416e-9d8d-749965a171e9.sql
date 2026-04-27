CREATE TABLE public.chatbot_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  language TEXT,
  source_page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit chatbot leads"
ON public.chatbot_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(first_name) > 0 AND length(first_name) <= 100
  AND length(last_name) > 0 AND length(last_name) <= 100
  AND length(email) > 0 AND length(email) <= 255
  AND length(country_code) > 0 AND length(country_code) <= 8
  AND length(phone) > 0 AND length(phone) <= 32
);

CREATE POLICY "Superadmins can view chatbot leads"
ON public.chatbot_leads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE INDEX idx_chatbot_leads_created_at ON public.chatbot_leads(created_at DESC);