import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, CheckCircle2, Eye } from "lucide-react";
import { toast } from "sonner";

const STAGES = [
  { value: "nouveau", label: "Nouveau", color: "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]" },
  { value: "contacté", label: "Contacté", color: "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]" },
  { value: "qualifié", label: "Qualifié", color: "bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]" },
  { value: "négociation", label: "Négociation", color: "bg-[hsl(280,70%,60%,.1)] text-[hsl(280,70%,60%)]" },
  { value: "closing", label: "Closing", color: "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]" },
  { value: "perdu", label: "Perdu", color: "bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]" },
];

const COMMISSION_STATUSES = [
  { value: "estimated", label: "Estimée" },
  { value: "confirmed", label: "Confirmée" },
  { value: "paid", label: "Payée" },
];

interface Profile { id: string; full_name: string | null; }

const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"leads" | "commissions">("leads");
  const [filterAmbassador, setFilterAmbassador] = useState("all");

  const fetchData = async () => {
    const [leadsRes, commissionsRes, profilesRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("commissions").select("*").order("date", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);
    setLeads(leadsRes.data ?? []);
    setCommissions(commissionsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getAmbassadorName = (userId: string) => {
    const p = profiles.find(pr => pr.id === userId);
    return p?.full_name || userId.slice(0, 8) + "…";
  };

  const handleStageChange = async (leadId: string, newStage: string) => {
    const { error } = await supabase.from("leads").update({ stage: newStage, updated_at: new Date().toISOString() }).eq("id", leadId);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Stage → ${newStage}`);
    fetchData();
  };

  const handleCommissionStatus = async (commissionId: string, newStatus: string) => {
    const { error } = await supabase.from("commissions").update({ status: newStatus }).eq("id", commissionId);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Commission → ${newStatus}`);
    fetchData();
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  // Get unique ambassadors who have leads
  const ambassadorsWithLeads = [...new Set(leads.map(l => l.user_id))];

  const filteredLeads = leads
    .filter(l => filterAmbassador === "all" || l.user_id === filterAmbassador)
    .filter(l => `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()));

  const filteredCommissions = commissions
    .filter(c => filterAmbassador === "all" || c.user_id === filterAmbassador)
    .filter(c => c.deal_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Leads & Commissions</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{leads.length} leads · {commissions.length} commissions · {ambassadorsWithLeads.length} ambassadeurs actifs</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {(["leads", "commissions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {t === "leads" ? `Leads (${leads.length})` : `Commissions (${commissions.length})`}
          </button>
        ))}

        {/* Ambassador filter */}
        <Select value={filterAmbassador} onValueChange={setFilterAmbassador}>
          <SelectTrigger className="w-[200px] bg-[hsl(var(--card))] border-[hsl(var(--border))] text-sm h-9">
            <SelectValue placeholder="Tous les ambassadeurs" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
            <SelectItem value="all">Tous les ambassadeurs</SelectItem>
            {ambassadorsWithLeads.map(uid => (
              <SelectItem key={uid} value={uid}>{getAmbassadorName(uid)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
        />
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-x-auto">
        {tab === "leads" ? (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Ambassadeur</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Lead</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Email</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Téléphone</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Stage</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Score</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((l) => {
                const stageObj = STAGES.find(s => s.value === l.stage) ?? STAGES[0];
                return (
                  <TableRow key={l.id} className="border-[hsl(var(--border))]">
                    <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getAmbassadorName(l.user_id)}</TableCell>
                    <TableCell className="font-medium text-[hsl(var(--foreground))]">{l.first_name} {l.last_name}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{l.email || "—"}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{l.phone || "—"}</TableCell>
                    <TableCell>
                      <Select value={l.stage ?? "nouveau"} onValueChange={(v) => handleStageChange(l.id, v)}>
                        <SelectTrigger className={`h-7 text-xs border-0 ${stageObj.color} font-semibold w-[120px]`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                          {STAGES.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">{l.score ?? "C"}</Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(l.created_at).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{l.notes ? "📝" : ""}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredLeads.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucun lead trouvé</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Ambassadeur</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant (AED)</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.map((c) => (
                <TableRow key={c.id} className="border-[hsl(var(--border))]">
                  <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getAmbassadorName(c.user_id)}</TableCell>
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">{c.deal_name}</TableCell>
                  <TableCell className="text-right font-mono text-[hsl(var(--foreground))]">AED {fmt(c.amount)}</TableCell>
                  <TableCell>
                    <Select value={c.status ?? "estimated"} onValueChange={(v) => handleCommissionStatus(c.id, v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 font-semibold w-[120px] ${
                        c.status === "confirmed" ? "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]" :
                        c.status === "paid" ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]" :
                        "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]"
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                        {COMMISSION_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    {c.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleCommissionStatus(c.id, "confirmed")}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredCommissions.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucune commission</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
