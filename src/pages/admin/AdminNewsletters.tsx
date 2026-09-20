import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Eye, Loader2, Mail, Users, UserX, RefreshCw } from "lucide-react";
import { NEWSLETTER_ISSUES, type NewsletterIssueMeta, type NewsletterLang } from "@/data/newsletterIssues";

interface Campaign {
  id: string;
  issue_id: string;
  audience: string;
  status: string;
  scheduled_for: string;
  sent_count: number;
  error: string | null;
  created_at: string;
  finished_at: string | null;
}

interface Settings {
  onboarding_enabled: boolean;
  onboarding_since: string;
}

const statusColor: Record<string, string> = {
  scheduled: "bg-amber-100 text-amber-800",
  sending: "bg-blue-100 text-blue-800",
  sent: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—");

const AdminNewsletters = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sendCounts, setSendCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [lang, setLang] = useState<NewsletterLang>("en");
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);

  const onboarding = useMemo(() => NEWSLETTER_ISSUES.filter((i) => i.sequence === "onboarding"), []);
  const monthly = useMemo(() => NEWSLETTER_ISSUES.filter((i) => i.sequence === "monthly"), []);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: c }, { data: sends }] = await Promise.all([
      supabase.from("newsletter_settings").select("onboarding_enabled, onboarding_since").eq("id", 1).maybeSingle(),
      supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("newsletter_sends").select("issue_id"),
    ]);
    setSettings(s ?? { onboarding_enabled: true, onboarding_since: new Date().toISOString() });
    setCampaigns((c ?? []) as Campaign[]);
    const counts: Record<string, number> = {};
    for (const row of sends ?? []) counts[row.issue_id] = (counts[row.issue_id] ?? 0) + 1;
    setSendCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleOnboarding = async (enabled: boolean) => {
    const { error } = await supabase.from("newsletter_settings").update({ onboarding_enabled: enabled, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setSettings((s) => (s ? { ...s, onboarding_enabled: enabled } : s));
    toast({ title: enabled ? "Onboarding series enabled" : "Onboarding series paused" });
  };

  const invoke = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("send-newsletters", { body });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(String(data.error));
    return data;
  };

  const openPreview = async (issue: NewsletterIssueMeta) => {
    setBusy(`preview:${issue.id}`);
    try {
      const data = await invoke({ action: "preview", issue_id: issue.id, lang });
      setPreview({ subject: data.subject, html: data.html });
    } catch (e) {
      toast({ title: "Preview failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const sendTest = async (issue: NewsletterIssueMeta) => {
    setBusy(`test:${issue.id}`);
    try {
      const data = await invoke({ action: "test", issue_id: issue.id, lang });
      toast({ title: "Test queued", description: `Sent to ${data.to}. Allow a minute for delivery.` });
    } catch (e) {
      toast({ title: "Test failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const sendCampaign = async (issue: NewsletterIssueMeta, audience: "all" | "inactive") => {
    const who = audience === "all" ? "ALL approved ambassadors" : "ambassadors with no lead in 90 days";
    if (!window.confirm(`Send "${issue.subject.en}" (EN + FR) to ${who} now?`)) return;
    setBusy(`send:${issue.id}:${audience}`);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("newsletter_campaigns").insert({ issue_id: issue.id, audience, created_by: user?.id ?? null });
      if (error) throw new Error(error.message);
      await invoke({ action: "run" });
      toast({ title: "Campaign sent", description: "Emails are being dispatched by the queue." });
      await load();
    } catch (e) {
      toast({ title: "Send failed", description: (e as Error).message, variant: "destructive" });
      await load();
    } finally {
      setBusy(null);
    }
  };

  const runNow = async () => {
    setBusy("run");
    try {
      const data = await invoke({ action: "run" });
      toast({ title: "Sender run complete", description: `${data.recipients} recipients, ${data.onboarding?.sent ?? 0} onboarding emails queued.` });
      await load();
    } catch (e) {
      toast({ title: "Run failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const IssueRow = ({ issue, monthlyActions }: { issue: NewsletterIssueMeta; monthlyActions: boolean }) => (
    <div className="flex flex-col md:flex-row md:items-center gap-3 py-3 border-b border-[hsl(var(--dash-border))] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--dash-muted-fg))] w-14 shrink-0">
            {issue.sequence === "onboarding" ? `Day ${issue.day}` : "Monthly"}
          </span>
          <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{issue.subject[lang]}</p>
        </div>
        <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5 md:pl-16 truncate">{issue.preview[lang]}</p>
        <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5 md:pl-16">
          {sendCounts[issue.id] ?? 0} sent{issue.template ? " · template: fill the [[placeholders]] and rebuild before sending" : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <button onClick={() => openPreview(issue)} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-50">
          {busy === `preview:${issue.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} Preview
        </button>
        <button onClick={() => sendTest(issue)} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-50">
          {busy === `test:${issue.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />} Test to me
        </button>
        {monthlyActions && (
          <>
            <button onClick={() => sendCampaign(issue, "all")} disabled={busy !== null || issue.template} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--dash-accent))] text-black text-xs font-bold hover:brightness-95 disabled:opacity-50">
              {busy === `send:${issue.id}:all` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Users className="w-3.5 h-3.5" />} Send to all
            </button>
            <button onClick={() => sendCampaign(issue, "inactive")} disabled={busy !== null || issue.template} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-50">
              {busy === `send:${issue.id}:inactive` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />} Inactive only
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-muted-fg))]" /></div>;
  }

  return (
    <div className="max-w-[1400px] font-['Poppins'] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[hsl(var(--dash-fg))]">Newsletters</h1>
          <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-1">Ambassador series in English and French. Each ambassador gets the language of their profile or country.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[hsl(var(--dash-border))] overflow-hidden">
            {(["en", "fr"] as NewsletterLang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs font-semibold ${lang === l ? "bg-[hsl(var(--dash-accent))] text-black" : "text-[hsl(var(--dash-muted-fg))] hover:bg-[hsl(var(--dash-muted)/.5)]"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={runNow} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[hsl(var(--dash-border))] text-xs text-[hsl(var(--dash-fg))] hover:bg-[hsl(var(--dash-muted)/.5)] disabled:opacity-50" title="Runs the hourly sender now">
            {busy === "run" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Run sender now
          </button>
        </div>
      </div>

      <section className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))]">Onboarding series</h2>
            <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5">
              Sent automatically, one step at a time, to ambassadors approved after {fmt(settings?.onboarding_since ?? null)}. Runs every hour.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[hsl(var(--dash-muted-fg))]">{settings?.onboarding_enabled ? "Active" : "Paused"}</span>
            <Switch checked={!!settings?.onboarding_enabled} onCheckedChange={toggleOnboarding} />
          </div>
        </div>
        {onboarding.map((i) => <IssueRow key={i.id} issue={i} monthlyActions={false} />)}
      </section>

      <section className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5">
        <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))]">Monthly issues</h2>
        <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5 mb-2">Send one issue a month to everyone. "Inactive only" targets ambassadors with no lead in the last 90 days. Unsubscribed addresses are always skipped.</p>
        {monthly.map((i) => <IssueRow key={i.id} issue={i} monthlyActions />)}
      </section>

      <section className="bg-[hsl(var(--dash-card))] rounded-2xl border border-[hsl(var(--dash-border))] p-5">
        <h2 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-3">Campaign history</h2>
        {campaigns.length === 0 ? (
          <p className="text-xs text-[hsl(var(--dash-muted-fg))]">No campaign sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-[hsl(var(--dash-muted-fg))]">
                  <th className="py-2 pr-3">Issue</th><th className="py-2 pr-3">Audience</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Sent</th><th className="py-2 pr-3">Scheduled</th><th className="py-2 pr-3">Finished</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-[hsl(var(--dash-border))] text-[hsl(var(--dash-fg))]">
                    <td className="py-2 pr-3">{NEWSLETTER_ISSUES.find((i) => i.id === c.issue_id)?.subject.en ?? c.issue_id}{c.error && <p className="text-[11px] text-red-600 mt-0.5 whitespace-pre-line">{c.error}</p>}</td>
                    <td className="py-2 pr-3">{c.audience}</td>
                    <td className="py-2 pr-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[c.status] ?? ""}`}>{c.status}</span></td>
                    <td className="py-2 pr-3 tabular-nums">{c.sent_count}</td>
                    <td className="py-2 pr-3">{fmt(c.scheduled_for)}</td>
                    <td className="py-2 pr-3">{fmt(c.finished_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[640px] max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900 truncate">{preview.subject}</p>
              <button onClick={() => setPreview(null)} className="text-xs text-gray-500 hover:text-gray-900">Close</button>
            </div>
            <iframe title="Email preview" srcDoc={preview.html} className="flex-1 w-full min-h-[70vh] border-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletters;
