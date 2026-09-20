import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, AlertTriangle, Loader2, ChevronRight } from "lucide-react";
import { fr } from "@/lib/dashboard-data";
import {
  RELATIONSHIPS, CONSENT_METHODS, BUDGET_RANGES, TIMELINES, PURPOSES, CHANNELS, LEAD_LANGUAGES, CONSENT_POLICY, ATTESTATIONS,
  emptyLeadIntake, validateLeadIntake, type LeadIntakeForm, type IntakeErrors,
} from "@/lib/lead-intake";

interface Props {
  onSubmitted?: () => void;
  /** Hide the policy box when the page already shows it. */
  showPolicy?: boolean;
  compact?: boolean;
}

const sel = "mt-1 w-full h-10 px-3 rounded-lg dash-input text-[13px]";
const area = "mt-1 w-full px-3 py-2 rounded-lg dash-input text-[13px] resize-y";

export const ConsentPolicyBox = ({ lang }: { lang: string }) => {
  const L = fr(lang) ? "fr" : "en";
  return (
    <div className="rounded-2xl border border-[hsl(var(--dash-accent)/.35)] bg-[hsl(var(--dash-accent)/.08)] p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[hsl(var(--dash-accent-ink))] mt-0.5 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-[hsl(var(--dash-fg))]">{CONSENT_POLICY.title[L]}</h3>
          <p className="mt-1.5 text-[13px] text-[hsl(var(--dash-fg))] leading-relaxed">{CONSENT_POLICY.intro[L]}</p>
          <ul className="mt-3 space-y-1.5">
            {CONSENT_POLICY.rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-[hsl(var(--dash-fg))] leading-snug"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[hsl(var(--dash-accent-ink))]" /> {r[L]}</li>
            ))}
          </ul>
          <p className="mt-3 flex gap-2 text-[12px] font-medium text-[hsl(var(--dash-warning))] leading-snug"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {CONSENT_POLICY.consequences[L]}</p>
        </div>
      </div>
    </div>
  );
};

/** Consent-first lead submission form. Mirrors the DB trigger enforce_lead_intake. */
const NewLeadForm = ({ onSubmitted, showPolicy = true, compact = false }: Props) => {
  const { lang } = useLanguage();
  const isFr = fr(lang);
  const L: "en" | "fr" = isFr ? "fr" : "en";
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LeadIntakeForm>(emptyLeadIntake());
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof LeadIntakeForm>(k: K, v: LeadIntakeForm[K]) => setForm((p) => ({ ...p, [k]: v }));
  const rel = useMemo(() => RELATIONSHIPS.find((r) => r.key === form.relationship), [form.relationship]);

  const submit = useMutation({
    mutationFn: async () => {
      const e = validateLeadIntake(form);
      setErrors(e); setTouched(true);
      if (Object.keys(e).length) throw new Error(isFr ? "Merci de compléter les champs signalés." : "Please complete the highlighted fields.");
      const { error } = await supabase.from("leads").insert({
        user_id: user!.id,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        source: rel?.needsCampaign ? "campaign" : rel?.needsProfile ? "content" : "manual",
        lead_country: form.lead_country.trim() || null,
        lead_language: form.lead_language || null,
        relationship: form.relationship,
        relationship_details: form.relationship_details.trim(),
        campaign_name: form.campaign_name.trim() || null,
        campaign_link: form.campaign_link.trim() || null,
        consent_method: form.consent_method,
        consent_date: form.consent_date,
        consent_evidence_url: form.consent_evidence_url.trim() || null,
        budget_range: form.budget_range || null,
        timeline: form.timeline || null,
        purpose: form.purpose || null,
        preferred_channel: form.preferred_channel || null,
        best_time: form.best_time.trim() || null,
        notes: form.notes.trim() || null,
        attested_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: isFr ? "Lead soumis" : "Lead submitted", description: isFr ? "Notre équipe contacte votre lead sous 24 heures et confirme son accord dès le premier appel." : "Our team contacts your lead within 24 hours and confirms their consent on the first call." });
      setForm(emptyLeadIntake()); setErrors({}); setTouched(false);
      onSubmitted?.();
    },
    onError: (e: Error) => toast({ variant: "destructive", title: isFr ? "Lead non enregistré" : "Lead not saved", description: e.message }),
  });

  const err = (k: keyof LeadIntakeForm) => (touched && errors[k] ? <p className="mt-1 text-[11px] text-[hsl(0,72%,55%)]">{errors[k]![L]}</p> : null);
  const Section = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
    <section className={compact ? "space-y-3" : "rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-5 space-y-3"}>
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))]">{n}. {title}</h3>
      {children}
    </section>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} className="space-y-5">
      {showPolicy && <ConsentPolicyBox lang={lang} />}

      <Section n={1} title={isFr ? "La personne" : "The person"}>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="dash-text text-xs">{isFr ? "Prénom" : "First name"} *</Label><Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className="mt-1 dash-input" />{err("first_name")}</div>
          <div><Label className="dash-text text-xs">{isFr ? "Nom" : "Last name"} *</Label><Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className="mt-1 dash-input" />{err("last_name")}</div>
          <div><Label className="dash-text text-xs">{isFr ? "Téléphone avec indicatif" : "Phone with country code"} *</Label><Input placeholder="+33 6 12 34 56 78" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1 dash-input" />{err("phone")}</div>
          <div><Label className="dash-text text-xs">Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1 dash-input" />{err("email")}</div>
          <div><Label className="dash-text text-xs">{isFr ? "Pays de résidence" : "Country of residence"}</Label><Input value={form.lead_country} onChange={(e) => set("lead_country", e.target.value)} className="mt-1 dash-input" /></div>
          <div><Label className="dash-text text-xs">{isFr ? "Langue à utiliser" : "Language to use"}</Label>
            <select value={form.lead_language} onChange={(e) => set("lead_language", e.target.value)} className={sel}>{LEAD_LANGUAGES.map((o) => <option key={o.key} value={o.key}>{o.label[L]}</option>)}</select></div>
        </div>
      </Section>

      <Section n={2} title={isFr ? "Comment vous connaissez cette personne" : "How you know this person"}>
        <div>
          <Label className="dash-text text-xs">{isFr ? "Relation" : "Relationship"} *</Label>
          <select value={form.relationship} onChange={(e) => set("relationship", e.target.value)} className={sel}>
            <option value="">{isFr ? "Choisir..." : "Choose..."}</option>
            {RELATIONSHIPS.map((r) => <option key={r.key} value={r.key}>{r.label[L]}</option>)}
          </select>
          {err("relationship")}
        </div>
        {rel?.needsCampaign && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="dash-text text-xs">{isFr ? "Campagne et plateforme" : "Campaign and platform"} *</Label><Input placeholder={isFr ? "ex. Meta Ads · Dubai Off-Plan FR · sept. 2026" : "e.g. Meta Ads · Dubai Off-Plan EN · Sep 2026"} value={form.campaign_name} onChange={(e) => set("campaign_name", e.target.value)} className="mt-1 dash-input" />{err("campaign_name")}</div>
            <div><Label className="dash-text text-xs">{isFr ? "Lien du formulaire ou de la page" : "Form or landing page link"} *</Label><Input placeholder="https://" value={form.campaign_link} onChange={(e) => set("campaign_link", e.target.value)} className="mt-1 dash-input" />{err("campaign_link")}</div>
          </div>
        )}
        {rel?.needsProfile && (
          <div><Label className="dash-text text-xs">{isFr ? "Lien de votre profil ou chaîne" : "Your profile or channel link"} *</Label><Input placeholder="https://instagram.com/..." value={form.campaign_link} onChange={(e) => set("campaign_link", e.target.value)} className="mt-1 dash-input" />{err("campaign_link")}</div>
        )}
        <div>
          <Label className="dash-text text-xs">{isFr ? "Contexte" : "Context"} *</Label>
          <textarea rows={3} value={form.relationship_details} onChange={(e) => set("relationship_details", e.target.value)} placeholder={rel ? rel.hint[L] : (isFr ? "Comment connaissez-vous cette personne, et qu'a-t-elle demandé exactement ?" : "How do you know this person, and what exactly did they ask for?")} className={area} />
          {err("relationship_details")}
        </div>
      </Section>

      <Section n={3} title={isFr ? "Son accord pour être contactée par Sofara" : "Their agreement to be contacted by Sofara"}>
        <div className="space-y-2">
          {CONSENT_METHODS.map((c) => (
            <label key={c.key} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${form.consent_method === c.key ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.08)]" : "border-[hsl(var(--dash-border))] hover:bg-[hsl(var(--dash-muted)/.3)]"}`}>
              <input type="radio" name="consent_method" value={c.key} checked={form.consent_method === c.key} onChange={() => set("consent_method", c.key)} className="mt-1" />
              <span><span className="block text-[13px] font-medium text-[hsl(var(--dash-fg))]">{c.label[L]}</span><span className="block text-[11px] text-[hsl(var(--dash-muted-fg))]">{c.desc[L]}</span></span>
            </label>
          ))}
          {err("consent_method")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><Label className="dash-text text-xs">{isFr ? "Date de l'accord" : "Date of agreement"} *</Label><Input type="date" value={form.consent_date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set("consent_date", e.target.value)} className="mt-1 dash-input" />{err("consent_date")}</div>
          <div><Label className="dash-text text-xs">{isFr ? "Preuve (lien capture, message)" : "Evidence (screenshot link, message)"}</Label><Input placeholder="https://" value={form.consent_evidence_url} onChange={(e) => set("consent_evidence_url", e.target.value)} className="mt-1 dash-input" />{err("consent_evidence_url")}</div>
        </div>
      </Section>

      <Section n={4} title={isFr ? "Son projet" : "Their project"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><Label className="dash-text text-xs">{isFr ? "Budget" : "Budget"}</Label><select value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)} className={sel}>{BUDGET_RANGES.map((o) => <option key={o.key} value={o.key}>{o.label[L]}</option>)}</select></div>
          <div><Label className="dash-text text-xs">{isFr ? "Horizon d'achat" : "Buying timeline"}</Label><select value={form.timeline} onChange={(e) => set("timeline", e.target.value)} className={sel}>{TIMELINES.map((o) => <option key={o.key} value={o.key}>{o.label[L]}</option>)}</select></div>
          <div><Label className="dash-text text-xs">{isFr ? "Objectif" : "Purpose"}</Label><select value={form.purpose} onChange={(e) => set("purpose", e.target.value)} className={sel}>{PURPOSES.map((o) => <option key={o.key} value={o.key}>{o.label[L]}</option>)}</select></div>
          <div><Label className="dash-text text-xs">{isFr ? "Canal préféré" : "Preferred channel"}</Label><select value={form.preferred_channel} onChange={(e) => set("preferred_channel", e.target.value)} className={sel}>{CHANNELS.map((o) => <option key={o.key} value={o.key}>{o.label[L]}</option>)}</select></div>
          <div className="sm:col-span-2"><Label className="dash-text text-xs">{isFr ? "Meilleur moment pour l'appeler" : "Best time to call"}</Label><Input placeholder={isFr ? "ex. en semaine après 18h, heure de Paris" : "e.g. weekdays after 6pm, Paris time"} value={form.best_time} onChange={(e) => set("best_time", e.target.value)} className="mt-1 dash-input" /></div>
          <div className="sm:col-span-2"><Label className="dash-text text-xs">{isFr ? "Notes pour le conseiller" : "Notes for the advisor"}</Label><textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={isFr ? "Quartiers évoqués, situation familiale, points d'attention..." : "Areas mentioned, family situation, points of attention..."} className={area} /></div>
        </div>
      </Section>

      <Section n={5} title={isFr ? "Vos déclarations" : "Your declarations"}>
        <div className="space-y-3">
          {ATTESTATIONS.map((a, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={form.attest[i]} onCheckedChange={(v) => set("attest", form.attest.map((x, j) => (j === i ? !!v : x)))} className="mt-0.5" />
              <span className="text-[12px] text-[hsl(var(--dash-fg))] leading-snug">{a[L]}</span>
            </label>
          ))}
          {err("attest")}
        </div>
      </Section>

      <Button type="submit" className="w-full dash-btn-accent h-11 text-[13px] font-semibold" disabled={submit.isPending}>
        {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isFr ? "Soumettre le lead à Sofara" : "Submit the lead to Sofara"}
      </Button>
    </form>
  );
};

export default NewLeadForm;
