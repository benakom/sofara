import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const stageBadge: Record<string, string> = {
  nouveau: "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]",
  contacté: "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]",
  qualifié: "bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]",
  négociation: "bg-[hsl(280,70%,60%,.1)] text-[hsl(280,70%,60%)]",
  closing: "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]",
  perdu: "bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]",
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"leads" | "commissions">("leads");

  useEffect(() => {
    const fetch = async () => {
      const [leadsRes, commissionsRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("commissions").select("*").order("date", { ascending: false }),
      ]);
      setLeads(leadsRes.data ?? []);
      setCommissions(commissionsRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Leads & Commissions</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{leads.length} leads · {commissions.length} commissions</p>
      </div>

      <div className="flex gap-2">
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

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        {tab === "leads" ? (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Nom</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Email</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Stage</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Score</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Source</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads
                .filter((l) => `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()))
                .map((l) => (
                  <TableRow key={l.id} className="border-[hsl(var(--border))]">
                    <TableCell className="font-medium text-[hsl(var(--foreground))]">{l.first_name} {l.last_name}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{l.email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={stageBadge[l.stage ?? "nouveau"] ?? stageBadge.nouveau}>
                        {l.stage ?? "nouveau"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--foreground))]">{l.score ?? "C"}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{l.source ?? "—"}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(l.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant (AED)</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions
                .filter((c) => c.deal_name.toLowerCase().includes(search.toLowerCase()))
                .map((c) => (
                  <TableRow key={c.id} className="border-[hsl(var(--border))]">
                    <TableCell className="font-medium text-[hsl(var(--foreground))]">{c.deal_name}</TableCell>
                    <TableCell className="text-right font-mono text-[hsl(var(--foreground))]">{fmt(c.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        c.status === "confirmed" ? "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]" :
                        c.status === "paid" ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]" :
                        "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]"
                      }>
                        {c.status ?? "estimated"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
