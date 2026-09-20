import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Check, AlertTriangle, Mail, Phone, Info, Clock, StickyNote, ArrowRight, CalendarClock, Lightbulb, PauseCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  fr, STAGES, stageByKey, stageLabel, stageColor, STAGE_RAMP, COMMISSION_STATUSES, commissionStatusByKey, commissionStatusLabel,
  relativeTime, initials, type LeadLike,
} from "@/lib/dashboard-data";
import { LEAD_PHASES, LOST_REASONS, leadStageText } from "@/lib/lead-stages";

interface StageEvent { id: string; from_stage: string | null; to_stage: string; created_at: string; note: string | null; kind: "stage" | "note" }
interface Commission { id: string; amount: number; status: string | null; deal_name: string; date: string; created_at: string; lead_id: string | null }

export type SheetLead = LeadLike & { email?: string | null; phone?: string | null; notes?: string | null; next_action_at?: string | null; lost_reason?: string | null };

interface LeadDetailSheetProps {
  lead: SheetLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmtDate = (iso: string, lang: string) => new Date(iso).toLocaleDateString(fr(lang) ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtDateTime = (iso: string, lang: string) => new Date(iso).toLocaleString(fr(lang) ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/** Read-only lead file for ambassadors: current status, phase ladder, full activity feed, commission. Stages are moved by Sofara admins. */
const LeadDetailSheet = ({ lead, open, onOpenChange }: LeadDetailSheetProps) => {
  const { lang } = useLanguage();
  const isFr = fr(lang);
  const L: "en" | "fr" = isFr ? "fr" : "en";

  const { data: events = [] } = useQuery({
    queryKey: ["lead_events", lead?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_stage_events").select("id, from_stage, to_stage, created_at, note, kind").eq("lead_id", lead!.id).order("created_at", { ascending: false });
      if (error) return [] as StageEvent[];
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
  const text = leadStageText(lead.stage, L, lead.first_name);
  const funnel = STAGES.filter((s) => s.step > 0);
  const currentStep = current.step;
  const stopped = current.kind === "lost" || current.kind === "paused";
  // Highest funnel step ever reached, so a paused/lost lead still shows its progress.
  const reachedStep = Math.max(currentStep, ...events.map((e) => stageByKey(e.to_stage).step));
  const phases = LEAD_PHASES.filter((p) => p.key !== "closed").map((p) => {
    const steps = funnel.filter((s) => s.phase === p.key);
    const last = steps[steps.length - 1]?.step ?? 0;
    const first = steps[0]?.step ?? 0;
    return { ...p, steps, done: reachedStep > last, active: reachedStep >= first && reachedStep <= last };
  });
  const lostReason = lead.lost_reason ? LOST_REASONS.find((r) => r.key === lead.lost_reason) : null;

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
                  {isFr ? "Dernière activité" : "Last activity"} {relativeTime(lead.updated_at, lang)}
                </SheetDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[12px] text-[hsl(var(--dash-muted-fg))]">
              {lead.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>}
              {lead.phone && <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
            {/* Current status */}
            <section className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stageColor(current) }} />
                <p className="text-[14px] font-semibold">{stageLabel(lead.stage, lang)}</p>
                {stopped && (current.kind === "paused" ? <PauseCircle className="w-4 h-4 text-[hsl(var(--dash-warning))]" /> : <XCircle className="w-4 h-4 text-[hsl(0,72%,55%)]" />)}
              </div>
              <p className="text-[13px] text-[hsl(var(--dash-fg))] leading-relaxed">{text.msg}</p>
              {text.hint && (
                <p className="mt-3 flex gap-2 text-[12px] text-[hsl(var(--dash-accent-ink))] leading-relaxed"><Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> {text.hint}</p>
              )}
              {lead.next_action && (
                <p className="mt-3 flex gap-2 text-[12px] text-[hsl(var(--dash-muted-fg))] leading-relaxed"><CalendarClock className="w-4 h-4 shrink-0 mt-0.5" /><span><span className="font-medium text-[hsl(var(--dash-fg))]">{isFr ? "Prochaine étape :" : "Next step:"}</span> {lead.next_action}{lead.next_action_at ? ` · ${fmtDate(lead.next_action_at, lang)}` : ""}</span></p>
              )}
              {lostReason && (
                <p className="mt-3 flex gap-2 text-[12px] text-[hsl(var(--dash-muted-fg))]"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span><span className="font-medium text-[hsl(var(--dash-fg))]">{isFr ? "Raison :" : "Reason:"}</span> {isFr ? lostReason.fr : lostReason.en}</span></p>
              )}
            </section>

            {/* Phase ladder */}
            <section>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">{isFr ? "Parcours" : "Journey"}</h3>
              <ol className="flex items-start gap-1">
                {phases.map((p, i) => (
                  <li key={p.key} className="flex-1 min-w-0">
                    <div className="h-1.5 rounded-full" style={{ background: p.done ? STAGE_RAMP[p.steps[p.steps.length - 1].step] : p.active ? (stopped ? STAGE_RAMP[0] : STAGE_RAMP[p.steps[0].step]) : "hsl(var(--dash-muted))" }} />
                    <p className={`mt-1.5 text-[10px] leading-tight ${p.done || p.active ? "font-medium text-[hsl(var(--dash-fg))]" : "text-[hsl(var(--dash-muted-fg))]"}`}>{i + 1}. {isFr ? p.fr : p.en}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[11px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Les étapes sont mises à jour par l'équipe Sofara. Vous êtes prévenu à chaque changement." : "Stages are updated by the Sofara team. You are notified at every change."}</p>
            </section>

            {/* Activity feed */}
            <section>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">{isFr ? "Historique" : "Activity"}</h3>
              {events.length === 0 ? (
                <p className="text-[12px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Lead reçu le" : "Lead received on"} {fmtDate(lead.created_at, lang)}.</p>
              ) : (
                <ol className="relative">
                  {events.map((e, i) => {
                    const st = stageByKey(e.to_stage);
                    const isNote = e.kind === "note";
                    const created = e.from_stage === null && !isNote;
                    const t = leadStageText(e.to_stage, L, lead.first_name);
                    return (
                      <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
                        {i < events.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-[hsl(var(--dash-border))]" />}
                        <span className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]" style={!isNote ? { background: stageColor(st), borderColor: stageColor(st), color: "#0a0a0a" } : undefined}>
                          {isNote ? <StickyNote className="w-3 h-3 text-[hsl(var(--dash-muted-fg))]" /> : created ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-medium text-[hsl(var(--dash-fg))]">{isNote ? (isFr ? "Note de l'équipe Sofara" : "Note from the Sofara team") : created ? (isFr ? "Lead reçu" : "Lead received") : t.label}</p>
                            <span className="text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0">{fmtDateTime(e.created_at, lang)}</span>
                          </div>
                          {!isNote && !created && <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] mt-0.5 leading-snug">{t.msg}</p>}
                          {e.note && <p className="mt-1.5 text-[12px] text-[hsl(var(--dash-fg))] rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2 whitespace-pre-line">{e.note}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Commission */}
            <section>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">{isFr ? "Votre commission" : "Your commission"}</h3>
              {commissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[hsl(var(--dash-border))] p-4 flex gap-3">
                  <Info className="w-4 h-4 text-[hsl(var(--dash-muted-fg))] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] leading-relaxed">
                    {isFr ? "Votre commission est acquise une fois le SPA signé et l'apport payé avec les frais DLD. Elle apparaîtra ici en estimation, puis passera en validation et sera versée sous 7 jours après le paiement du promoteur à Cevitas." : "Your commission is earned once the SPA is signed and the down payment with DLD fees is paid. It will appear here as an estimate, then move to validation and be paid within 7 days of the developer's payment to Cevitas."}
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
