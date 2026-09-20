import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, AlertCircle, X, Users, ChevronRight } from "lucide-react";
import FunnelBar from "@/components/dashboard/FunnelBar";
import LeadDetailSheet from "@/components/dashboard/LeadDetailSheet";
import { fr, STAGES, stageByKey, stageLabel, stageColor, isStale, relativeTime, initials, type LeadLike } from "@/lib/dashboard-data";
import { LEAD_PHASES } from "@/lib/lead-stages";

const SOURCES: Record<string, { fr: string; en: string }> = {
  manual: { fr: "Manuel", en: "Manual" }, meta_ads: { fr: "Meta Ads", en: "Meta Ads" }, google_sheet: { fr: "Google Sheet", en: "Google Sheet" }, referral: { fr: "Parrainage", en: "Referral" },
};

const Pipeline = () => {
  const { lang } = useLanguage();
  const isFr = fr(lang);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", source: "manual" });
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<LeadLike | null>(null);
  const stageFilter = params.get("stage");
  const attentionOnly = params.get("filter") === "attention";

  useEffect(() => { if (params.get("focus") === "search") { searchRef.current?.focus(); params.delete("focus"); setParams(params, { replace: true }); } }, [params, setParams]);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => { const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); return (data || []) as LeadLike[]; },
    enabled: !!user,
  });

  // Deep link from notifications and emails: /dashboard/pipeline?lead=<id> opens the lead file.
  const deepLinkId = params.get("lead");
  useEffect(() => {
    if (!deepLinkId || leads.length === 0) return;
    const found = leads.find((l) => l.id === deepLinkId);
    if (found) setSelected(found);
    params.delete("lead");
    setParams(params, { replace: true });
  }, [deepLinkId, leads]); // eslint-disable-line react-hooks/exhaustive-deps

  const addLead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").insert({ user_id: user!.id, first_name: form.first_name, last_name: form.last_name, email: form.email || null, phone: form.phone || null, source: form.source });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setNewLeadOpen(false);
      setForm({ first_name: "", last_name: "", email: "", phone: "", source: "manual" });
      toast({ title: isFr ? "Lead ajouté !" : "Lead added!" });
    },
    onError: (e: Error) => toast({ variant: "destructive", title: "Error", description: e.message }),
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STAGES) c[s.key] = 0;
    for (const l of leads) c[stageByKey(l.stage).key] += 1;
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (stageFilter) {
        const st = stageByKey(l.stage);
        if (stageFilter.startsWith("phase:")) { if (st.phase !== stageFilter.slice(6)) return false; }
        else if (stageFilter.startsWith("kind:")) { if (st.kind !== stageFilter.slice(5)) return false; }
        else if (st.key !== stageFilter) return false;
      }
      if (attentionOnly && !(stageByKey(l.stage).kind === "open" && (isStale(l) || !!l.next_action))) return false;
      if (!needle) return true;
      return `${l.first_name} ${l.last_name ?? ""} ${(l as { email?: string | null }).email ?? ""} ${(l as { phone?: string | null }).phone ?? ""}`.toLowerCase().includes(needle);
    });
  }, [leads, q, stageFilter, attentionOnly]);

  const setStageFilter = (key: string | null) => {
    if (key && key !== stageFilter) params.set("stage", key); else params.delete("stage");
    setParams(params, { replace: true });
  };
  const attentionCount = leads.filter((l) => stageByKey(l.stage).kind === "open" && (isStale(l) || !!l.next_action)).length;
  const hasFilter = !!stageFilter || attentionOnly || q.trim().length > 0;

  const StageBadge = ({ stageKey }: { stageKey?: string | null }) => {
    const st = stageByKey(stageKey);
    return (
      <span className="inline-flex items-center gap-1.5 h-7 rounded-md border border-[hsl(var(--dash-border))] px-2 text-[12px] font-medium text-[hsl(var(--dash-fg))] whitespace-nowrap">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: stageColor(st) }} />
        {stageLabel(stageKey, lang)}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-[hsl(var(--dash-fg))]">{isFr ? "Suivi des leads" : "Lead tracking"}</h1>
          <p className="mt-1 text-[13px] text-[hsl(var(--dash-muted-fg))]">
            {leads.length} {isFr ? "leads" : "leads"} · {attentionCount} {isFr ? "à relancer" : "need follow-up"} · <span className="text-[hsl(var(--dash-muted-fg))]">{isFr ? "Les étapes sont mises à jour par l'équipe Sofara. Cliquez un lead pour voir son avancement." : "Stages are updated by the Sofara team. Click a lead to see its progress."}</span>
          </p>
        </div>
        <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg bg-[hsl(var(--dash-accent))] text-black hover:bg-[hsl(var(--dash-accent))] hover:brightness-95 text-[13px] font-semibold gap-1.5 shadow-[var(--dash-accent-glow)]">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> {isFr ? "Nouveau lead" : "New lead"}
            </Button>
          </DialogTrigger>
          <DialogContent className="dash-form-bg border-[hsl(var(--dash-border))]">
            <DialogHeader><DialogTitle className="dash-text">{isFr ? "Ajouter un lead" : "Add a lead"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addLead.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="dash-text text-xs">{isFr ? "Prénom" : "First name"}</Label><Input required value={form.first_name} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} className="mt-1 dash-input" /></div>
                <div><Label className="dash-text text-xs">{isFr ? "Nom" : "Last name"}</Label><Input required value={form.last_name} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} className="mt-1 dash-input" /></div>
              </div>
              <div><Label className="dash-text text-xs">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 dash-input" /></div>
              <div><Label className="dash-text text-xs">{isFr ? "Téléphone" : "Phone"}</Label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1 dash-input" /></div>
              <div><Label className="dash-text text-xs">Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm((p) => ({ ...p, source: v }))}>
                  <SelectTrigger className="mt-1 dash-input"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(SOURCES).map(([k, v]) => <SelectItem key={k} value={k}>{isFr ? v.fr : v.en}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full dash-btn-accent" disabled={addLead.isPending}>{addLead.isPending ? "..." : isFr ? "Ajouter" : "Add"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Funnel */}
      {leads.length > 0 && (
        <section className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] px-5 pt-4 pb-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-[hsl(var(--dash-fg))]">{isFr ? "Entonnoir" : "Funnel"}</h2>
            <span className="text-[11px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Cliquez une étape pour filtrer" : "Click a stage to filter"}</span>
          </div>
          <FunnelBar counts={counts} lang={lang} onSelect={setStageFilter} selected={stageFilter} />
        </section>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
          <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={isFr ? "Rechercher nom, email, téléphone…" : "Search name, email, phone…"} className="w-full h-10 pl-9 pr-3 rounded-lg bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[13px] text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:border-[hsl(var(--dash-accent)/.6)] focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.2)]" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => { if (attentionOnly) params.delete("filter"); else params.set("filter", "attention"); setParams(params, { replace: true }); }} className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[12px] font-medium transition-colors ${attentionOnly ? "border-[hsl(var(--dash-warning))] text-[hsl(var(--dash-warning))] bg-[hsl(var(--dash-warning)/.1)]" : "border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"}`}>
            <AlertCircle className="w-3.5 h-3.5" /> {isFr ? "À relancer" : "Follow-up"} <span className="tabular-nums">{attentionCount}</span>
          </button>
          {stageFilter && (
            <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[hsl(var(--dash-accent)/.12)] text-[12px] font-medium text-[hsl(var(--dash-fg))]">
              <span className="w-2 h-2 rounded-full" style={{ background: stageFilter.startsWith("kind:lost") ? "hsl(0 72% 51%)" : stageFilter.startsWith("kind:") ? "hsl(32 95% 46%)" : stageFilter.startsWith("phase:") ? "hsl(var(--dash-accent))" : stageColor(stageByKey(stageFilter)) }} /> {
                stageFilter.startsWith("phase:") ? (LEAD_PHASES.find((p) => p.key === stageFilter.slice(6)) ?? LEAD_PHASES[0])[isFr ? "fr" : "en"]
                : stageFilter === "kind:paused" ? (isFr ? "En pause / injoignable" : "On hold / unreachable")
                : stageFilter === "kind:lost" ? (isFr ? "Perdus" : "Lost")
                : stageLabel(stageFilter, lang)}
              <button onClick={() => setStageFilter(null)} aria-label="clear" className="ml-0.5 text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {hasFilter && <button onClick={() => { setQ(""); params.delete("stage"); params.delete("filter"); setParams(params, { replace: true }); }} className="h-9 px-2 text-[12px] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]">{isFr ? "Réinitialiser" : "Reset"}</button>}
        </div>
      </div>

      {/* Mobile: lead cards */}
      <div className="md:hidden space-y-2">
        {isLoading ? null : visible.length === 0 ? (
          <div className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] py-12 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--dash-muted-fg))] opacity-40" />
            <p className="text-[13px] text-[hsl(var(--dash-muted-fg))]">{hasFilter ? (isFr ? "Aucun lead ne correspond." : "No lead matches.") : (isFr ? "Aucun lead pour l'instant." : "No leads yet.")}</p>
          </div>
        ) : visible.map((lead) => {
          const stale = isStale(lead);
          const lx = lead as LeadLike & { email?: string | null; phone?: string | null };
          return (
            <button type="button" key={lead.id} onClick={() => setSelected(lead)} className="w-full text-left rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-4 active:bg-[hsl(var(--dash-muted)/.4)]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[hsl(var(--dash-muted))] text-[11px] font-semibold text-[hsl(var(--dash-fg))] flex items-center justify-center shrink-0">{initials(lead.first_name, lead.last_name)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[hsl(var(--dash-fg))] truncate">{lead.first_name} {lead.last_name}</p>
                  <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] truncate">{lx.email || lx.phone || "—"}</p>
                </div>
                {lead.score && <span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-[hsl(var(--dash-muted))] text-[12px] font-semibold text-[hsl(var(--dash-fg))] shrink-0">{lead.score}</span>}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <StageBadge stageKey={lead.stage} />
                <span className={`inline-flex items-center gap-1 text-[12px] ${stale ? "text-[hsl(var(--dash-warning))] font-medium" : "text-[hsl(var(--dash-muted-fg))]"}`}>
                  {stale && <AlertCircle className="w-3.5 h-3.5" />} {relativeTime(lead.updated_at, lang)}
                </span>
              </div>
              {(lead.next_action || lead.source) && (
                <p className="mt-2 text-[12px] text-[hsl(var(--dash-muted-fg))] truncate">
                  {lead.next_action ? <span className="text-[hsl(var(--dash-fg))]">{lead.next_action}</span> : null}
                  {lead.next_action && lead.source ? " · " : ""}
                  {lead.source ? (SOURCES[lead.source] ? (isFr ? SOURCES[lead.source].fr : SOURCES[lead.source].en) : lead.source) : ""}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: table (no inner scrolling; columns share the width) */}
      <div className="hidden md:block rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] overflow-hidden">
        <div>
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[26%]" /><col className="w-[11%]" /><col className="w-[17%]" /><col className="w-[8%]" /><col className="w-[16%]" /><col className="w-[13%]" /><col className="w-[9%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.4)]">
                {[isFr ? "Lead" : "Lead", "Source", isFr ? "Étape" : "Stage", "Score", isFr ? "Prochaine action" : "Next action", isFr ? "Dernière activité" : "Last activity", "KYC"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider px-3 py-2.5 truncate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-14 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">…</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={7} className="py-14 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--dash-muted-fg))] opacity-40" />
                  <p className="text-[13px] text-[hsl(var(--dash-muted-fg))]">{hasFilter ? (isFr ? "Aucun lead ne correspond." : "No lead matches.") : (isFr ? "Aucun lead pour l'instant. Ajoutez votre premier lead." : "No leads yet. Add your first lead.")}</p>
                </td></tr>
              ) : (
                visible.map((lead) => {
                  const stale = isStale(lead);
                  const lx = lead as LeadLike & { email?: string | null };
                  return (
                    <tr key={lead.id} onClick={() => setSelected(lead)} className="border-b border-[hsl(var(--dash-border))] last:border-0 hover:bg-[hsl(var(--dash-muted)/.35)] transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-[hsl(var(--dash-muted))] text-[11px] font-semibold text-[hsl(var(--dash-fg))] flex items-center justify-center shrink-0">{initials(lead.first_name, lead.last_name)}</span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-[hsl(var(--dash-fg))] truncate">{lead.first_name} {lead.last_name}</p>
                            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{lx.email || (lead as { phone?: string | null }).phone || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-[hsl(var(--dash-muted-fg))] truncate">{SOURCES[lead.source ?? ""] ? (isFr ? SOURCES[lead.source!].fr : SOURCES[lead.source!].en) : (lead.source ?? "—")}</td>
                      <td className="px-4 py-3">
                        <StageBadge stageKey={lead.stage} />
                      </td>
                      <td className="px-4 py-3">{lead.score ? <span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-[hsl(var(--dash-muted))] text-[12px] font-semibold text-[hsl(var(--dash-fg))]">{lead.score}</span> : <span className="text-[hsl(var(--dash-muted-fg))]">—</span>}</td>
                      <td className="px-3 py-3 text-[12px] text-[hsl(var(--dash-fg))] truncate">{lead.next_action || <span className="text-[hsl(var(--dash-muted-fg))]">—</span>}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[12px] truncate max-w-full ${stale ? "text-[hsl(var(--dash-warning))] font-medium" : "text-[hsl(var(--dash-muted-fg))]"}`}>
                          {stale && <AlertCircle className="w-3.5 h-3.5" />} {relativeTime(lead.updated_at, lang)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-[hsl(var(--dash-muted-fg))] capitalize truncate"><span className="inline-flex items-center gap-1">{lead.kyc_status?.replace(/_/g, " ") ?? "—"}<ChevronRight className="w-3.5 h-3.5 opacity-50" /></span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <LeadDetailSheet lead={selected as never} open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }} />

      {leads.length > 0 && visible.length > 0 && (
        <p className="mt-3 text-[11px] text-[hsl(var(--dash-muted-fg))]">{visible.length} / {leads.length} · <button onClick={() => navigate("/dashboard")} className="hover:text-[hsl(var(--dash-fg))]">{isFr ? "Retour à la vue d'ensemble" : "Back to overview"}</button></p>
      )}
    </motion.div>
  );
};

export default Pipeline;
