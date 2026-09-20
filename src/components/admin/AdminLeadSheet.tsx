import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, MessageCircle, StickyNote, ArrowRight, Check, EyeOff, Save, User, CalendarClock, Sparkles } from "lucide-react";
import { STAGES, stageByKey, stageColor, initials, relativeTime } from "@/lib/dashboard-data";
import { LEAD_PHASES, LOST_REASONS, leadStageText } from "@/lib/lead-stages";

interface Lead {
  id: string; user_id: string; first_name: string; last_name: string | null; email: string | null; phone: string | null; source: string | null;
  stage: string | null; score: string | null; next_action: string | null; next_action_at: string | null; lost_reason: string | null;
  assigned_to: string | null; notes: string | null; kyc_status: string | null; created_at: string; updated_at: string; last_stage_at: string | null;
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
