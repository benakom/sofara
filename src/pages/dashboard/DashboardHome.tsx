import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, Zap, Trophy, DollarSign, ArrowUpRight, Send, ShieldCheck, Link2, Sparkles, Clock, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import StatTile from "@/components/dashboard/StatTile";
import FunnelBar from "@/components/dashboard/FunnelBar";
import {
  fr, STAGES, stageByKey, stageLabel, STAGE_RAMP, dailySeries, weekDelta, isStale, relativeTime, daysAgo, aed, initials, greeting, type LeadLike,
} from "@/lib/dashboard-data";

interface Commission { id: string; amount: number; status: string | null; deal_name: string; date: string; created_at: string }

const DashboardHome = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFr = fr(lang);

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => { const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); return (data || []) as LeadLike[]; },
    enabled: !!user,
  });
  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions", user?.id],
    queryFn: async () => { const { data } = await supabase.from("commissions").select("*"); return (data || []) as Commission[]; },
    enabled: !!user,
  });

  const m = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of STAGES) counts[s.key] = 0;
    for (const l of leads) counts[stageByKey(l.stage).key] += 1;
    const won = leads.filter((l) => stageByKey(l.stage).kind === "won");
    const hot = leads.filter((l) => { const s = stageByKey(l.stage); return s.kind === "open" && s.step >= 5; });
    const series = dailySeries(leads, 14);
    const wonSeries = dailySeries(won, 14);
    const sum = (st: string) => commissions.filter((c) => c.status === st).reduce((a, c) => a + Number(c.amount), 0);
    const est = sum("estimated"), val = sum("validated"), paid = sum("paid");
    const commSeries = dailySeries(commissions, 14);
    const attention = leads
      .filter((l) => stageByKey(l.stage).kind === "open" && (isStale(l) || !!l.next_action))
      .sort((a, b) => daysAgo(b.updated_at) - daysAgo(a.updated_at))
      .slice(0, 5);
    const activity = [...leads].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 6);
    const conv = leads.length ? Math.round((won.length / leads.length) * 100) : 0;
    return { counts, won, hot, series, wonSeries, est, val, paid, total: est + val + paid, commSeries, attention, activity, conv };
  }, [leads, commissions]);

  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const firstName = (typeof meta.first_name === "string" && meta.first_name) || (typeof meta.full_name === "string" && meta.full_name.split(" ")[0]) || "";
  const today = new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
  const vs7 = isFr ? "vs 7 j préc." : "vs prev. 7d";
  const leadDelta = weekDelta(m.series), wonDelta = weekDelta(m.wonSeries);
  const isNew = !leadsLoading && leads.length === 0;

  const onboarding = [
    { icon: Send, fr: "Soumettez votre premier lead", en: "Submit your first lead", path: "/dashboard/import-leads" },
    { icon: ShieldCheck, fr: "Vérifiez votre identité (KYC)", en: "Verify your identity (KYC)", path: "/dashboard/kyc" },
    { icon: Link2, fr: "Partagez votre lien de parrainage", en: "Share your referral link", path: "/dashboard/referrals" },
  ];

  const Card = ({ title, action, children, className = "" }: { title: string; action?: { label: string; path: string }; children: React.ReactNode; className?: string }) => (
    <section className={`rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] ${className}`}>
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-[13px] font-semibold text-[hsl(var(--dash-fg))]">{title}</h2>
        {action && (
          <button onClick={() => navigate(action.path)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-accent-ink))] transition-colors">
            {action.label} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[12px] text-[hsl(var(--dash-muted-fg))] capitalize">{today}</p>
          <h1 className="mt-1 text-[26px] leading-tight font-semibold tracking-tight text-[hsl(var(--dash-fg))]">
            {greeting(lang)}{firstName ? `, ${firstName}` : ""}
          </h1>
        </div>
        <button onClick={() => navigate("/dashboard/import-leads")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-fg))] text-[13px] font-semibold px-4 py-2.5 hover:brightness-95 transition-all shadow-[var(--dash-accent-glow)]">
          <Send className="w-4 h-4" /> {isFr ? "Soumettre un lead" : "Submit a lead"}
        </button>
      </div>

      {/* Onboarding for new ambassadors */}
      {isNew && (
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--dash-sidebar-bg))] p-6 mb-6 shadow-[var(--dash-card-shadow-hover)]">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[hsl(var(--dash-accent)/.1)] blur-3xl pointer-events-none" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--dash-accent-ink))]"><Sparkles className="w-3.5 h-3.5" /> {isFr ? "Espace activé" : "Space activated"}</span>
            <h2 className="mt-2 text-xl font-semibold text-white">{isFr ? "Bienvenue chez Sofara. Trois étapes pour commencer." : "Welcome to Sofara. Three steps to get started."}</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {onboarding.map((s, i) => (
                <button key={s.path} onClick={() => navigate(s.path)} className="group text-left rounded-xl border border-white/10 bg-white/[0.03] hover:border-[hsl(var(--dash-accent)/.5)] p-4 transition-colors">
                  <div className="flex items-center gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-fg))] text-[10px] font-bold flex items-center justify-center">{i + 1}</span><s.icon className="w-4 h-4 text-[hsl(var(--dash-accent-ink))]" /></div>
                  <p className="text-[13px] font-medium text-white">{isFr ? s.fr : s.en}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatTile label={isFr ? "Leads" : "Leads"} value={leads.length} icon={Users} deltaPct={leadDelta.pct} deltaLabel={vs7} trend={m.series} onClick={() => navigate("/dashboard/pipeline")} />
        <StatTile label={isFr ? "Leads chauds" : "Hot leads"} value={m.hot.length} icon={Zap} deltaLabel={isFr ? "qualifiés ou offre envoyée" : "qualified or offer sent"} onClick={() => navigate("/dashboard/pipeline?stage=qualifie")} />
        <StatTile label={isFr ? "Ventes gagnées" : "Deals won"} value={m.won.length} icon={Trophy} deltaPct={wonDelta.pct} deltaLabel={vs7} trend={m.wonSeries} onClick={() => navigate("/dashboard/pipeline?stage=offre_acceptee")} />
        <StatTile label={isFr ? "Commissions" : "Commissions"} value={aed(m.total)} icon={DollarSign} deltaLabel={isFr ? `${aed(m.paid)} payées` : `${aed(m.paid)} paid`} trend={m.commSeries} onClick={() => navigate("/dashboard/commissions")} emphasis />
      </div>

      {/* Funnel + attention */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-4">
        <Card title={isFr ? "Entonnoir de conversion" : "Conversion funnel"} action={{ label: isFr ? "Suivi des leads" : "Lead tracking", path: "/dashboard/pipeline" }} className="xl:col-span-3">
          {leads.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Vos leads apparaîtront ici par étape." : "Your leads will appear here by stage."}</p>
          ) : (
            <>
              <FunnelBar counts={m.counts} lang={lang} onSelect={(k) => navigate(`/dashboard/pipeline?stage=${k}`)} />
              <div className="mt-4 pt-4 border-t border-[hsl(var(--dash-border))] flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[hsl(var(--dash-muted-fg))]">
                <span><span className="font-semibold text-[hsl(var(--dash-fg))]">{m.conv}%</span> {isFr ? "taux de conversion" : "conversion rate"}</span>
                <span><span className="font-semibold text-[hsl(var(--dash-fg))]">{leadDelta.current}</span> {isFr ? "nouveaux leads cette semaine" : "new leads this week"}</span>
                <span><span className="font-semibold text-[hsl(var(--dash-fg))]">{m.attention.length}</span> {isFr ? "à relancer" : "need follow-up"}</span>
              </div>
            </>
          )}
        </Card>

        <Card title={isFr ? "À relancer" : "Needs attention"} action={{ label: isFr ? "Tout voir" : "View all", path: "/dashboard/pipeline?filter=attention" }} className="xl:col-span-2">
          {m.attention.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center">
              <CheckCircle2 className="w-6 h-6 text-[hsl(var(--dash-accent-ink))] mb-2" />
              <p className="text-[13px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Tout est à jour. Rien à relancer." : "All caught up. Nothing to follow up."}</p>
            </div>
          ) : (
            <ul className="divide-y divide-[hsl(var(--dash-border))]">
              {m.attention.map((l) => {
                const stale = isStale(l);
                return (
                  <li key={l.id} className="py-2.5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[hsl(var(--dash-muted))] text-[11px] font-semibold text-[hsl(var(--dash-fg))] flex items-center justify-center shrink-0">{initials(l.first_name, l.last_name)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-[hsl(var(--dash-fg))] truncate">{l.first_name} {l.last_name}</p>
                      <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] truncate">{l.next_action || stageLabel(l.stage, lang)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium shrink-0 ${stale ? "text-[hsl(var(--dash-warning))]" : "text-[hsl(var(--dash-muted-fg))]"}`}>
                      {stale ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {relativeTime(l.updated_at, lang)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Activity + commissions */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card title={isFr ? "Activité récente" : "Recent activity"} action={{ label: "Pipeline", path: "/dashboard/pipeline" }} className="xl:col-span-3">
          {m.activity.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "Aucune activité pour l'instant." : "No activity yet."}</p>
          ) : (
            <ul className="relative">
              {m.activity.map((l, i) => {
                const st = stageByKey(l.stage);
                return (
                  <li key={l.id} className="relative flex items-start gap-3 py-2.5">
                    {i < m.activity.length - 1 && <span className="absolute left-[15px] top-9 bottom-0 w-px bg-[hsl(var(--dash-border))]" />}
                    <span className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: STAGE_RAMP[st.step] }} />
                    </span>
                    <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] text-[hsl(var(--dash-fg))] truncate"><span className="font-medium">{l.first_name} {l.last_name}</span> <span className="text-[hsl(var(--dash-muted-fg))]">· {stageLabel(l.stage, lang)}</span></p>
                        <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] capitalize">{(l.source ?? "").replace(/_/g, " ")}</p>
                      </div>
                      <span className="text-[11px] text-[hsl(var(--dash-muted-fg))] shrink-0">{relativeTime(l.updated_at, lang)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title={isFr ? "Commissions" : "Commissions"} action={{ label: isFr ? "Détails" : "Details", path: "/dashboard/commissions" }} className="xl:col-span-2">
          <p className="text-[28px] leading-none font-semibold tracking-tight text-[hsl(var(--dash-fg))]">AED {m.total.toLocaleString()}</p>
          <p className="mt-1 text-[12px] text-[hsl(var(--dash-muted-fg))]">{isFr ? "total estimé, validé et payé" : "estimated, validated and paid"}</p>
          <div className="mt-4 h-2 rounded-full overflow-hidden flex gap-[2px] bg-[hsl(var(--dash-muted))]">
            {[["paid", m.paid, 7], ["validated", m.val, 5], ["estimated", m.est, 3]].map(([k, v, step]) => (
              m.total > 0 && Number(v) > 0 ? <div key={k as string} className="h-full" style={{ width: `${(Number(v) / m.total) * 100}%`, background: STAGE_RAMP[step as number] }} /> : null
            ))}
          </div>
          <ul className="mt-4 space-y-2.5">
            {[
              { k: "paid", label: isFr ? "Payées" : "Paid", v: m.paid, step: 7 },
              { k: "validated", label: isFr ? "Validées" : "Validated", v: m.val, step: 5 },
              { k: "estimated", label: isFr ? "Estimées" : "Estimated", v: m.est, step: 3 },
            ].map((r) => (
              <li key={r.k} className="flex items-center justify-between text-[13px]">
                <span className="inline-flex items-center gap-2 text-[hsl(var(--dash-muted-fg))]"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: STAGE_RAMP[r.step] }} /> {r.label}</span>
                <span className="font-medium text-[hsl(var(--dash-fg))] tabular-nums">AED {r.v.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-[hsl(var(--dash-border))] grid grid-cols-2 gap-2">
            {[
              { icon: Phone, label: isFr ? "Soumettre un lead" : "Submit a lead", path: "/dashboard/import-leads" },
              { icon: ShieldCheck, label: "KYC", path: "/dashboard/kyc" },
            ].map((a) => (
              <button key={a.path} onClick={() => navigate(a.path)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[hsl(var(--dash-border))] px-3 py-2 text-[12px] font-medium text-[hsl(var(--dash-fg))] hover:border-[hsl(var(--dash-accent)/.5)] hover:text-[hsl(var(--dash-accent-ink))] transition-colors">
                <a.icon className="w-3.5 h-3.5" /> {a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
