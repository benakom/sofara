import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, MessageCircle, StickyNote, ArrowRight, Check, EyeOff, Save, User, CalendarClock, Sparkles, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";
import { STAGES, stageByKey, stageColor, initials, relativeTime } from "@/lib/dashboard-data";
import { LEAD_PHASES, LOST_REASONS, leadStageText } from "@/lib/lead-stages";
import { RELATIONSHIPS, CONSENT_METHODS, BUDGET_RANGES, TIMELINES, PURPOSES, CHANNELS, LEAD_LANGUAGES, CONSENT_STATUS } from "@/lib/lead-intake";

interface Lead {
  id: string; user_id: string; first_name: string; last_name: string | null; email: string | null; phone: string | null; source: string | null;
  stage: string | null; score: string | null; next_action: string | null; next_action_at: string | null; lost_reason: string | null;
  assigned_to: string | null; notes: string | null; kyc_status: string | null; created_at: string; updated_at: string; last_stage_at: string | null;
  lead_country: string | null; lead_language: string | null; relationship: string | null; relationship_details: string | null; campaign_name: string | null; campaign_link: string | null;
  consent_method: string | null; consent_date: string | null; consent_evidence_url: string | null; budget_range: string | null; timeline: string | null; purpose: string | null;
  preferred_channel: string | null; best_time: string | null; attested_at: string | null; consent_status: string | null; consent_note: string | null; consent_checked_at: string | null; consent_checked_by: string | null;
}
interface StageEvent { id: string; from_stage: string | null; to_stage: string; created_at: string; note: string | null; kind: "stage" | "note"; visible_to_ambassador: boolean; changed_by: string | null; notified_at: string | null }
interface Person { id: string; full_name: string | null; email?: string | null; phone?: string | null; language?: string | null }

interface Props {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after any successful update so the parent list can refresh. */
  onChanged?: () => void;
}

const fmt = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
const inputCls = "w-full h-9 px-3 rounded-lg border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] text-[13px] text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)]";
const labelCls = "block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--dash-muted-fg))] mb-1";

/** Super-admin lead file: qualify the lead (stage, note, next step, reason, score, owner) and see the full history. */
const AdminLeadSheet = ({ leadId, open, onOpenChange, onChanged }: Props) => {
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [ambassador, setAmbassador] = useState<Person | null>(null);
  const [events, setEvents] = useState<StageEvent[]>([]);
  const [people, setPeople] = useState<Record<string, string>>({});
  const [admins, setAdmins] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stage, setStage] = useState("");
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const [nextAction, setNextAction] = useState("");
  const [nextActionAt, setNextActionAt] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [score, setScore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const load = async () => {
    if (!leadId) return;
    setLoading(true);
    const [{ data: l }, { data: ev }, { data: roles }] = await Promise.all([
      supabase.from("leads").select("*").eq("id", leadId).maybeSingle(),
      supabase.from("lead_stage_events").select("id, from_stage, to_stage, created_at, note, kind, visible_to_ambassador, changed_by, notified_at").eq("lead_id", leadId).order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id").eq("role", "superadmin"),
    ]);
    const L = l as Lead | null;
    setLead(L);
    setEvents((ev ?? []) as StageEvent[]);
    const adminIds = (roles ?? []).map((r) => r.user_id);
    const ids = Array.from(new Set([...(L ? [L.user_id] : []), ...adminIds, ...((ev ?? []).map((e) => e.changed_by).filter(Boolean) as string[])]));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email, phone, language").in("id", ids);
      const map: Record<string, string> = {};
      for (const p of profs ?? []) map[p.id] = p.full_name || p.email || p.id.slice(0, 8);
      setPeople(map);
      setAmbassador((profs ?? []).find((p) => p.id === L?.user_id) ?? null);
      setAdmins((profs ?? []).filter((p) => adminIds.includes(p.id)));
    }
    if (L) {
      setStage(stageByKey(L.stage).key);
      setNote("");
      setVisible(true);
      setNextAction(L.next_action ?? "");
      setNextActionAt(toDateInput(L.next_action_at));
      setLostReason(L.lost_reason ?? "");
      setScore(L.score ?? "");
      setAssignedTo(L.assigned_to ?? "");
    }
    setLoading(false);
  };

  useEffect(() => { if (open && leadId) load(); }, [open, leadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = lead ? stageByKey(lead.stage) : null;
  const target = stageByKey(stage);
  const stageChanged = !!lead && target.key !== stageByKey(lead.stage).key;
  const needsReason = target.kind === "lost" || target.kind === "paused";
  const preview = useMemo(() => (lead ? leadStageText(stage, ambassador?.language === "fr" ? "fr" : "en", lead.first_name) : null), [stage, lead, ambassador?.language]);

  const save = async () => {
    if (!lead) return;
    if (!stageChanged && !note.trim() && nextAction === (lead.next_action ?? "") && toDateInput(lead.next_action_at) === nextActionAt && lostReason === (lead.lost_reason ?? "") && score === (lead.score ?? "") && assignedTo === (lead.assigned_to ?? "")) {
      toast({ title: "Nothing to save" }); return;
    }
    setSaving(true);
    const { data, error } = await supabase.rpc("admin_update_lead", {
      p_lead_id: lead.id,
      p_stage: stageChanged ? target.key : null,
      p_note: note.trim() || null,
      p_visible: visible,
      p_next_action: nextAction.trim() || null,
      p_next_action_at: nextActionAt ? new Date(`${nextActionAt}T09:00:00`).toISOString() : null,
      p_lost_reason: needsReason ? (lostReason || null) : null,
      p_score: score || null,
      p_assigned_to: assignedTo || null,
      p_clear_next_action: !nextAction.trim() && !!lead.next_action,
    });
    setSaving(false);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    const r = (data ?? {}) as { stage_changed?: boolean; event_id?: string | null };
    toast({
      title: r.stage_changed ? `Stage → ${target.en}` : note.trim() ? "Note added" : "Lead updated",
      description: r.event_id && visible ? "The ambassador is notified in the app and by email." : r.event_id ? "Internal entry, the ambassador is not notified." : undefined,
    });
    onChanged?.();
    await load();
  };

  const wa = lead?.phone ? `https://wa.me/${lead.phone.replace(/[^\d]/g, "")}` : null;

  const [consentNote, setConsentNote] = useState("");
  const setConsent = async (status: "verified" | "disputed" | "unverified") => {
    if (!lead) return;
    if (status === "disputed" && !confirm("Mark consent as disputed? The ambassador is notified and asked for context.")) return;
    setSaving(true);
    const { error } = await supabase.rpc("admin_set_lead_consent", { p_lead_id: lead.id, p_status: status, p_note: consentNote.trim() || null });
    setSaving(false);
    if (error) { toast({ title: "Consent update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: status === "verified" ? "Consent verified" : status === "disputed" ? "Consent disputed, ambassador notified" : "Consent reset" });
    setConsentNote("");
    onChanged?.();
    await load();
  };
  const lbl = (list: { key: string; label: { en: string } }[], key: string | null) => list.find((x) => x.key === key)?.label.en ?? (key || "—");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg))] text-[hsl(var(--dash-fg))] [&>button]:text-[hsl(var(--dash-muted-fg))] font-['Poppins']">
        {loading || !lead ? (
          <div className="h-full flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-muted-fg))]" /></div>
        ) : (
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-[hsl(var(--dash-border))] text-left">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-[hsl(var(--dash-muted))] text-[13px] font-semibold flex items-center justify-center shrink-0">{initials(lead.first_name, lead.last_name)}</span>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-[17px] font-semibold text-[hsl(var(--dash-fg))] truncate">{lead.first_name} {lead.last_name}</SheetTitle>
                  <SheetDescription className="text-[12px] text-[hsl(var(--dash-muted-fg))] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: current ? stageColor(current) : undefined }} /> {current?.en} · {relativeTime(lead.updated_at, "en")}
                  </SheetDescription>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 text-[12px]">
                <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Lead</p>
                  <p className="flex items-center gap-1.5 mt-0.5 truncate"><Mail className="w-3 h-3 shrink-0" /> {lead.email || "—"}</p>
                  <p className="flex items-center gap-1.5 truncate"><Phone className="w-3 h-3 shrink-0" /> {lead.phone || "—"}{wa && <a href={wa} target="_blank" rel="noreferrer" className="text-[#22C55E]"><MessageCircle className="w-3 h-3" /></a>}</p>
                </div>
                <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Ambassador</p>
                  <button onClick={() => navigate(`/admin/ambassadors/${lead.user_id}`)} className="flex items-center gap-1.5 mt-0.5 truncate hover:underline"><User className="w-3 h-3 shrink-0" /> {ambassador?.full_name || "—"}</button>
                  <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{ambassador?.email || ""} · {ambassador?.language ? ambassador.language.toUpperCase() : "EN"}</p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Update form */}
              <section className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-4 space-y-4">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Update this lead</h3>
                <div>
                  <label className={labelCls}>Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputCls}>
                    {LEAD_PHASES.map((p) => (
                      <optgroup key={p.key} label={p.en}>
                        {STAGES.filter((s) => s.phase === p.key).map((s) => <option key={s.key} value={s.key}>{s.en}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  {preview && (
                    <p className="mt-2 text-[12px] text-[hsl(var(--dash-muted-fg))] leading-snug">
                      <span className="font-medium text-[hsl(var(--dash-fg))]">{stageChanged ? "The ambassador will read:" : "The ambassador currently reads:"}</span> {preview.msg}
                    </p>
                  )}
                </div>
                {needsReason && (
                  <div>
                    <label className={labelCls}>Reason</label>
                    <select value={lostReason} onChange={(e) => setLostReason(e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      {LOST_REASONS.map((r) => <option key={r.key} value={r.key}>{r.en}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className={labelCls}>Note {visible ? "(shared with the ambassador)" : "(internal only)"}</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={visible ? "e.g. Spoke with Karim, budget AED 1.5M, looking at JVC and Arjan. Shortlist going out tomorrow." : "Internal remark, not shown to the ambassador"} className={`${inputCls} h-auto py-2 resize-y`} />
                  <div className="flex items-center justify-between mt-2">
                    <span className="inline-flex items-center gap-2 text-[12px] text-[hsl(var(--dash-muted-fg))]">{visible ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <EyeOff className="w-3.5 h-3.5" />} {visible ? "Ambassador sees this note and gets notified" : "Internal, no notification"}</span>
                    <Switch checked={visible} onCheckedChange={setVisible} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Next step (shown to the ambassador)</label>
                    <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="e.g. Follow-up call after the shortlist" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}><span className="inline-flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Next step date</span></label>
                    <input type="date" value={nextActionAt} onChange={(e) => setNextActionAt(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Score</label>
                    <select value={score} onChange={(e) => setScore(e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      {["A", "B", "C", "D"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Handled by</label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={inputCls}>
                      <option value="">Unassigned</option>
                      {admins.map((a) => <option key={a.id} value={a.id}>{a.full_name || a.email}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={save} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-[13px] font-bold hover:brightness-95 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {stageChanged ? `Move to "${target.en}"` : note.trim() ? "Add note" : "Save"}
                </button>
              </section>

              {/* Source & consent */}
              <section className={`rounded-2xl border p-4 space-y-3 ${lead.consent_status === "disputed" ? "border-[#EF4444]/50 bg-[#EF4444]/5" : lead.consent_status === "verified" ? "border-[#22C55E]/40 bg-[hsl(var(--dash-card))]" : "border-[hsl(var(--dash-warning)/.5)] bg-[hsl(var(--dash-warning)/.06)]"}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] flex items-center gap-2">{lead.consent_status === "disputed" ? <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" /> : <ShieldCheck className="w-3.5 h-3.5" />} Source & consent</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CONSENT_STATUS[lead.consent_status || "unverified"]?.className}`}>{CONSENT_STATUS[lead.consent_status || "unverified"]?.label.en}</span>
                </div>
                {!lead.attested_at ? (
                  <p className="text-[12px] text-[hsl(var(--dash-muted-fg))]">Submitted before the consent-first intake. Confirm on the first call that the person agreed to be contacted through the ambassador.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className="col-span-2 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Relationship</p><p className="mt-0.5 font-medium">{lbl(RELATIONSHIPS, lead.relationship)}</p><p className="mt-1 whitespace-pre-line text-[hsl(var(--dash-fg))]">{lead.relationship_details}</p></div>
                    {lead.campaign_name && <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Campaign</p><p className="mt-0.5">{lead.campaign_name}</p></div>}
                    {lead.campaign_link && <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">{lead.relationship === "content" ? "Profile" : "Form / page"}</p><a href={lead.campaign_link} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[hsl(var(--dash-accent-ink))] hover:underline truncate">{lead.campaign_link} <ExternalLink className="w-3 h-3 shrink-0" /></a></div>}
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Consent</p><p className="mt-0.5">{lbl(CONSENT_METHODS, lead.consent_method)}{lead.consent_date ? ` · ${new Date(lead.consent_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` : ""}</p></div>
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Evidence</p>{lead.consent_evidence_url ? <a href={lead.consent_evidence_url} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[hsl(var(--dash-accent-ink))] hover:underline truncate">Open <ExternalLink className="w-3 h-3" /></a> : <p className="mt-0.5 text-[hsl(var(--dash-muted-fg))]">None provided</p>}</div>
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Budget · timeline</p><p className="mt-0.5">{lbl(BUDGET_RANGES, lead.budget_range)} · {lbl(TIMELINES, lead.timeline)}</p></div>
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Purpose · channel</p><p className="mt-0.5">{lbl(PURPOSES, lead.purpose)} · {lbl(CHANNELS, lead.preferred_channel)}</p></div>
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Language · country</p><p className="mt-0.5">{lbl(LEAD_LANGUAGES, lead.lead_language)} · {lead.lead_country || "—"}</p></div>
                    <div className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Best time</p><p className="mt-0.5">{lead.best_time || "—"}</p></div>
                    <p className="col-span-2 text-[11px] text-[hsl(var(--dash-muted-fg))]">Declarations accepted {fmt(lead.attested_at)}{lead.consent_checked_at ? ` · checked ${fmt(lead.consent_checked_at)} by ${lead.consent_checked_by ? people[lead.consent_checked_by] || "admin" : "admin"}` : ""}{lead.consent_note ? ` · ${lead.consent_note}` : ""}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input value={consentNote} onChange={(e) => setConsentNote(e.target.value)} placeholder="Optional note on the consent check (shared with the ambassador)" className={`${inputCls} flex-1`} />
                  <div className="flex gap-2">
                    <button onClick={() => setConsent("verified")} disabled={saving} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[#22C55E] text-white text-[12px] font-bold hover:brightness-95 disabled:opacity-60"><ShieldCheck className="w-3.5 h-3.5" /> Verified</button>
                    <button onClick={() => setConsent("disputed")} disabled={saving} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[#EF4444]/40 text-[#EF4444] text-[12px] font-bold hover:bg-[#EF4444]/5 disabled:opacity-60"><ShieldAlert className="w-3.5 h-3.5" /> Disputed</button>
                  </div>
                </div>
                {lead.consent_status === "disputed" && <p className="text-[11px] text-[#EF4444]">Consent is disputed. If confirmed, move the stage to "Rejected: no consent" above; the ambassador receives the explanation automatically.</p>}
              </section>

              {/* Lead details */}
              <section className="grid grid-cols-2 gap-2 text-[12px]">
                {[["Source", lead.source || "—"], ["Score", lead.score || "—"], ["KYC", (lead.kyc_status || "not_started").replace(/_/g, " ")], ["Created", fmt(lead.created_at)], ["Last stage change", lead.last_stage_at ? fmt(lead.last_stage_at) : "—"], ["Handled by", lead.assigned_to ? people[lead.assigned_to] || "—" : "Unassigned"]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">{k}</p><p className="mt-0.5 capitalize">{v}</p></div>
                ))}
                {lead.notes && <div className="col-span-2 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">Ambassador's notes at submission</p><p className="mt-0.5 whitespace-pre-line">{lead.notes}</p></div>}
              </section>

              {/* History */}
              <section>
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))] mb-3">History</h3>
                <ol className="relative">
                  {events.map((e, i) => {
                    const st = stageByKey(e.to_stage);
                    const isNote = e.kind === "note";
                    const created = e.from_stage === null && !isNote;
                    return (
                      <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
                        {i < events.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-[hsl(var(--dash-border))]" />}
                        <span className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]" style={!isNote ? { background: stageColor(st), borderColor: stageColor(st), color: "#0a0a0a" } : undefined}>
                          {isNote ? <StickyNote className="w-3 h-3 text-[hsl(var(--dash-muted-fg))]" /> : created ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-medium">{isNote ? "Note" : created ? "Lead submitted" : `${e.from_stage ? stageByKey(e.from_stage).en : "—"} → ${st.en}`}</p>
                            <span className="text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0">{fmt(e.created_at)}</span>
                          </div>
                          <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5">
                            {e.changed_by ? `by ${people[e.changed_by] || "admin"}` : "system"}
                            {!e.visible_to_ambassador && <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[hsl(var(--dash-muted))]"><EyeOff className="w-3 h-3" /> internal</span>}
                            {e.visible_to_ambassador && !created && <span className="ml-2 text-[10px]">{e.notified_at ? "· email sent" : "· email pending"}</span>}
                          </p>
                          {e.note && <p className="mt-1.5 text-[12px] rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] px-3 py-2 whitespace-pre-line">{e.note}</p>}
                        </div>
                      </li>
                    );
                  })}
                  {events.length === 0 && <p className="text-[12px] text-[hsl(var(--dash-muted-fg))]">No history yet.</p>}
                </ol>
              </section>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminLeadSheet;
