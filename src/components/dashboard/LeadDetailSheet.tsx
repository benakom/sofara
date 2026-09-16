import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Check, Circle, AlertTriangle, Mail, Phone, Info, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  fr, STAGES, stageByKey, stageLabel, STAGE_RAMP, normalizeStage, COMMISSION_STATUSES, commissionStatusByKey, commissionStatusLabel,
  relativeTime, initials, type LeadLike,
} from "@/lib/dashboard-data";

interface StageEvent { id: string; from_stage: string | null; to_stage: string; created_at: string; note: string | null }
interface Commission { id: string; amount: number; status: string | null; deal_name: string; date: string; created_at: string; lead_id: string | null }

interface LeadDetailSheetProps {
  lead: (LeadLike & { email?: string | null; phone?: string | null; notes?: string | null }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmtDate = (iso: string, lang: string) => new Date(iso).toLocaleDateString(fr(lang) ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** Read-only lead file for ambassadors: qualification timeline (stages are moved by Sofara admins) + commission tracking. */
const LeadDetailSheet = ({ lead, open, onOpenChange }: LeadDetailSheetProps) => {
  const { lang } = useLanguage();
  const isFr = fr(lang);

  const { data: events = [] } = useQuery({
    queryKey: ["lead_events", lead?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_stage_events").select("id, from_stage, to_stage, created_at, note").eq("lead_id", lead!.id).order("created_at", { ascending: true });
      if (error) return [] as StageEvent[]; // table not provisioned yet → derived timeline below
      return (data ?? []) as StageEvent[];
    },
    enabled: !!lead && open,
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ["lead_commissions", lead?.id],
    queryFn: async () => {
      const { data } = await supabase.from("commissions").select("*").eq("lead_id", lead!.id).order("created_at", { ascending: false });
      return (data ?? []) as Commission[];
    },
    enabled: !!lead && open,
  });

  if (!lead) return null;
  const current = stageByKey(lead.stage);
  const funnel = STAGES.filter((s) => s.kind !== "lost");
  const currentIdx = funnel.findIndex((s) => s.key === current.key);
  const lost = current.kind === "lost";

  // Date reached per stage: from events when available, else created_at for the first stage and updated_at for the current one.
  const reachedAt: Record<string, string> = {};
  for (const e of events) reachedAt[normalizeStage(e.to_stage)] = e.created_at;
  if (!events.length) { reachedAt.nouveau = lead.created_at; if (current.key !== "nouveau") reachedAt[current.key] = lead.updated_at; }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg))] text-[hsl(var(--dash-fg))] [&>button]:text-[hsl(var(--dash-muted-fg))]">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-[hsl(var(--dash-border))] text-left">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-[hsl(var(--dash-muted))] text-[13px] font-semibold flex items-center justify-center shrink-0">{initials(lead.first_name, lead.last_name)}</span>
              <div className="min-w-0">
                <SheetTitle className="text-[17px] font-semibold text-[hsl(var(--dash-fg))] truncate">{lead.first_name} {lead.last_name}</SheetTitle>
                <SheetDescription className="text-[12px] text-[hsl(var(--dash-muted-fg))]">
                  {lost ? (isFr ? "Injoignable" : "Unreachable") : `${isFr ? "Étape" : "Stage"} ${currentIdx + 1}/${funnel.length} · ${stageLabel(lead.stage, lang)}`} · {relativeTime(lead.updated_at, lang)}
                </SheetDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[12px] text-[hsl(var(--dash-muted-fg))]">
              {lead.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>}
              {lead.phone && <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
            {/* Timeline */}
            <section>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">{isFr ? "Avancement de la qualification" : "Qualification progress"}</h3>
              <ol className="relative">
                {funnel.map((s, i) => {
                  const done = !lost && i < currentIdx;
                  const active = !lost && i === currentIdx;
                  const date = reachedAt[s.key];
                  return (
                    <li key={s.key} className="relative flex gap-3 pb-5 last:pb-0">
                      {i < funnel.length - 1 && <span className={`absolute left-[11px] top-6 bottom-0 w-px ${done ? "bg-[hsl(var(--dash-accent))]" : "bg-[hsl(var(--dash-border))]"}`} />}
                      <span className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                        done ? "bg-[hsl(var(--dash-accent))] border-[hsl(var(--dash-accent))] text-[hsl(var(--dash-fg))]"
                        : active ? "bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-accent-ink))] text-[hsl(var(--dash-accent-ink))] shadow-[0_0_0_4px_hsl(var(--dash-accent)/.35)]"
                        : "bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))]"}`}>
                        {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Circle className="w-2 h-2 fill-current" />}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[13px] ${done || active ? "font-medium text-[hsl(var(--dash-fg))]" : "text-[hsl(var(--dash-muted-fg))]"}`}>{isFr ? s.fr : s.en}</p>
                          {date && (done || active) && <span className="text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0">{fmtDate(date, lang)}</span>}
                        </div>
                        {active && <p className="text-[11px] text-[hsl(var(--dash-accent-ink))] mt-0.5">{isFr ? "Étape en cours, mise à jour par l'équipe Sofara" : "Current stage, updated by the Sofara team"}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {lost && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg" style={{ background: "hsl(38 92% 50% / .12)", color: "hsl(38 92% 60%)" }}>
                  <AlertTriangle className="w-3.5 h-3.5" /> {isFr ? "Lead injoignable pour le moment" : "Lead unreachable for now"}
                </div>
              )}
              {events.filter((e) => e.note).length > 0 && (
                <ul className="mt-4 space-y-2">
                  {events.filter((e) => e.note).map((e) => (
                    <li key={e.id} className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2 text-[12px]">
                      <p className="text-[hsl(var(--dash-fg))]">{e.note}</p>
                      <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5">{fmtDate(e.created_at, lang)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Commission */}
            <section>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">{isFr ? "Votre commission" : "Your commission"}</h3>
              {commissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[hsl(var(--dash-border))] p-4 flex gap-3">
                  <Info className="w-4 h-4 text-[hsl(var(--dash-muted-fg))] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] leading-relaxed">
                    {isFr ? "Votre commission apparaîtra ici dès que l'équipe Sofara l'aura estimée, généralement à l'acceptation de l'offre. Vous suivrez ensuite sa validation puis son paiement." : "Your commission will appear here once the Sofara team estimates it, usually when the offer is accepted. You will then follow its validation and payment."}
                  </p>
                </div>
              ) : commissions.map((c) => {
                const st = commissionStatusByKey(c.status);
                const steps = COMMISSION_STATUSES.filter((x) => x.order > 0);
                return (
                  <div key={c.id} className="rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-4 mb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium truncate">{c.deal_name}</p>
                        <p className="text-[22px] font-semibold tracking-tight mt-0.5">AED {Number(c.amount).toLocaleString()}</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-md shrink-0" style={st.order === 0 ? { background: "hsl(38 92% 50% / .12)", color: "hsl(38 92% 60%)" } : { background: "hsl(var(--dash-accent) / .25)", color: "hsl(var(--dash-accent-ink))" }}>
                        {commissionStatusLabel(c.status, lang)}
                      </span>
                    </div>
                    {st.order > 0 && (
                      <div className="mt-4 flex items-center gap-1.5">
                        {steps.map((step, i) => {
                          const reached = st.order >= step.order;
                          return (
                            <div key={step.key} className="flex-1">
                              <div className="h-1.5 rounded-full" style={{ background: reached ? STAGE_RAMP[step.step] : "hsl(var(--dash-muted))" }} />
                              <p className={`mt-1.5 text-[10px] ${reached ? "text-[hsl(var(--dash-fg))] font-medium" : "text-[hsl(var(--dash-muted-fg))]"}`}>{isFr ? step.fr : step.en}{i === steps.length - 1 && st.key === "paid" && c.date ? ` · ${fmtDate(c.date, lang)}` : ""}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[hsl(var(--dash-muted-fg))]">
                      <Clock className="w-3 h-3" />
                      {st.key === "paid"
                        ? (isFr ? `Payée le ${fmtDate(c.date, lang)}` : `Paid on ${fmtDate(c.date, lang)}`)
                        : st.key === "validated"
                          ? (isFr ? "Validée, paiement en préparation par Sofara" : "Validated, payment being prepared by Sofara")
                          : st.key === "rejected"
                            ? (isFr ? "Non retenue" : "Not retained")
                            : (isFr ? `Estimée le ${fmtDate(c.created_at, lang)}, en attente de validation` : `Estimated on ${fmtDate(c.created_at, lang)}, awaiting validation`)}
                    </p>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailSheet;
