import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Search, TrendingUp, MousePointerClick, Eye, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

const fmt = (n: number, d = 0) => Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: d });

const call = async (body: any) => {
  const { data, error } = await supabase.functions.invoke("admin-gsc", { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

const Kpi = ({ icon: Icon, label, value, hint }: any) => (
  <Card className="p-5 rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--dash-muted-fg))]">{label}</span>
      <Icon className="w-4 h-4 text-[hsl(var(--dash-fg))]" />
    </div>
    <div className="text-3xl font-extrabold text-[hsl(var(--dash-fg))] font-['Poppins']">{value}</div>
    {hint && <div className="text-xs text-[hsl(var(--dash-muted-fg))] mt-1">{hint}</div>}
  </Card>
);

export default function AdminSEO() {
  const [days, setDays] = useState(28);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [pages, setPages] = useState<Row[]>([]);
  const [queries, setQueries] = useState<Row[]>([]);
  const [countries, setCountries] = useState<Row[]>([]);
  const [devices, setDevices] = useState<Row[]>([]);
  const [sitemaps, setSitemaps] = useState<any[]>([]);
  const [inspectUrl, setInspectUrl] = useState("https://sofara.io/");
  const [inspectResult, setInspectResult] = useState<any>(null);
  const [inspecting, setInspecting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [ov, pg, qr, co, dv, sm] = await Promise.all([
        call({ action: "overview", days }),
        call({ action: "pages", days }),
        call({ action: "queries", days }),
        call({ action: "countries", days }),
        call({ action: "devices", days }),
        call({ action: "sitemaps" }),
      ]);
      setOverview(ov);
      setPages(pg.rows ?? []);
      setQueries(qr.rows ?? []);
      setCountries(co.rows ?? []);
      setDevices(dv.rows ?? []);
      setSitemaps(sm.sitemap ?? []);
    } catch (e: any) {
      toast.error("GSC: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [days]);

  const inspect = async () => {
    setInspecting(true);
    setInspectResult(null);
    try {
      const data = await call({ action: "inspect", url: inspectUrl });
      setInspectResult(data.inspectionResult);
    } catch (e: any) { toast.error(e.message); }
    finally { setInspecting(false); }
  };

  const resubmit = async () => {
    try {
      await call({ action: "resubmit_sitemap" });
      toast.success("Sitemap resoumis à Google");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const totals = overview?.totals?.rows?.[0];
  const chartData = (overview?.byDate?.rows ?? []).map((r: any) => ({
    date: r.keys[0].slice(5),
    clicks: r.clicks,
    impressions: r.impressions,
  }));

  return (
    <div className="space-y-6 font-['Poppins']">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[hsl(var(--dash-fg))]">SEO Dashboard</h1>
          <p className="text-sm text-[hsl(var(--dash-muted-fg))]">Google Search Console — sofara.io</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 28, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${days === d ? "bg-[hsl(var(--dash-accent))] text-black" : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-[hsl(var(--dash-muted-fg))]"}`}>
              {d}j
            </button>
          ))}
          <Button onClick={load} variant="outline" size="sm" className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
        </div>
      </div>

      {loading && !overview ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-fg))]" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi icon={MousePointerClick} label="Clics" value={fmt(totals?.clicks ?? 0)} hint={`${days} derniers jours`} />
            <Kpi icon={Eye} label="Impressions" value={fmt(totals?.impressions ?? 0)} />
            <Kpi icon={TrendingUp} label="CTR moyen" value={`${fmt((totals?.ctr ?? 0) * 100, 2)}%`} />
            <Kpi icon={BarChart3} label="Position moy." value={fmt(totals?.position ?? 0, 1)} />
          </div>

          <Card className="p-5 rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))]">
            <h3 className="text-sm font-bold text-[hsl(var(--dash-fg))] mb-4">Performance journalière</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8a8a8a" }} />
                  <YAxis yAxisId="l" tick={{ fontSize: 10, fill: "#8a8a8a" }} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10, fill: "#8a8a8a" }} />
                  <Tooltip />
                  <Line yAxisId="l" type="monotone" dataKey="clicks" stroke="#D2F34C" strokeWidth={2} dot={false} />
                  <Line yAxisId="r" type="monotone" dataKey="impressions" stroke="#D2F34C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Tabs defaultValue="pages">
            <TabsList className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))]">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="queries">Requêtes</TabsTrigger>
              <TabsTrigger value="countries">Pays</TabsTrigger>
              <TabsTrigger value="devices">Appareils</TabsTrigger>
              <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
              <TabsTrigger value="inspect">Inspecter URL</TabsTrigger>
            </TabsList>

            {([
              ["pages", "Page", pages],
              ["queries", "Requête", queries],
              ["countries", "Pays", countries],
              ["devices", "Appareil", devices],
            ] as const).map(([key, label, rows]) => (
              <TabsContent key={key} value={key}>
                <Card className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{label}</TableHead>
                        <TableHead className="text-right">Clics</TableHead>
                        <TableHead className="text-right">Impr.</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                        <TableHead className="text-right">Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center text-[hsl(var(--dash-muted-fg))] py-8">Aucune donnée</TableCell></TableRow>
                      )}
                      {rows.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="max-w-md truncate text-xs">{r.keys?.[0]}</TableCell>
                          <TableCell className="text-right font-semibold">{fmt(r.clicks)}</TableCell>
                          <TableCell className="text-right">{fmt(r.impressions)}</TableCell>
                          <TableCell className="text-right">{fmt(r.ctr * 100, 2)}%</TableCell>
                          <TableCell className="text-right">{fmt(r.position, 1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="sitemaps">
              <Card className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[hsl(var(--dash-fg))]">Sitemaps soumis</h3>
                  <Button onClick={resubmit} size="sm" className="bg-[hsl(var(--dash-accent))] text-black hover:brightness-95">Resoumettre sitemap.xml</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">URLs</TableHead>
                      <TableHead className="text-right">Erreurs</TableHead>
                      <TableHead className="text-right">Avertis.</TableHead>
                      <TableHead className="text-right">Dernier DL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sitemaps.map((s: any, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs truncate max-w-sm">{s.path}</TableCell>
                        <TableCell className="text-right">{s.contents?.[0]?.submitted ?? "—"}</TableCell>
                        <TableCell className="text-right text-red-600">{s.errors ?? 0}</TableCell>
                        <TableCell className="text-right text-orange-600">{s.warnings ?? 0}</TableCell>
                        <TableCell className="text-right text-xs">{s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString() : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="inspect">
              <Card className="rounded-2xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] p-5 space-y-4">
                <div className="flex gap-2">
                  <Input value={inspectUrl} onChange={(e) => setInspectUrl(e.target.value)} placeholder="https://sofara.io/..." />
                  <Button onClick={inspect} disabled={inspecting} className="bg-[hsl(var(--dash-accent))] text-black hover:brightness-95 gap-1.5">
                    {inspecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Inspecter
                  </Button>
                </div>
                {inspectResult && (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)]">
                        <div className="text-xs text-[hsl(var(--dash-muted-fg))] uppercase font-semibold">Indexation</div>
                        <div className="font-bold text-[hsl(var(--dash-fg))]">{inspectResult.indexStatusResult?.verdict ?? "—"}</div>
                        <div className="text-xs text-[hsl(var(--dash-muted-fg))]">{inspectResult.indexStatusResult?.coverageState}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[hsl(var(--dash-muted)/.4)]">
                        <div className="text-xs text-[hsl(var(--dash-muted-fg))] uppercase font-semibold">Mobile</div>
                        <div className="font-bold text-[hsl(var(--dash-fg))]">{inspectResult.mobileUsabilityResult?.verdict ?? "—"}</div>
                      </div>
                    </div>
                    <pre className="text-xs bg-[#0F172A] text-[hsl(var(--dash-accent-ink))] p-3 rounded-lg overflow-auto max-h-80">{JSON.stringify(inspectResult, null, 2)}</pre>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
