import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

interface Ambassador {
  id: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  created_at: string;
  leadsCount: number;
  commissionsTotal: number;
}

const AdminAmbassadors = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data: profiles } = await supabase.from("profiles").select("*");
      if (!profiles) { setLoading(false); return; }

      const { data: leads } = await supabase.from("leads").select("user_id");
      const { data: commissions } = await supabase.from("commissions").select("user_id, amount");

      const enriched: Ambassador[] = profiles.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        country: p.country,
        created_at: p.created_at,
        leadsCount: leads?.filter((l) => l.user_id === p.id).length ?? 0,
        commissionsTotal: commissions?.filter((c) => c.user_id === p.id).reduce((s, c) => s + Number(c.amount), 0) ?? 0,
      }));

      setAmbassadors(enriched);
      setLoading(false);
    };
    fetch();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);
  const filtered = ambassadors.filter((a) =>
    (a.full_name ?? a.id).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Ambassadeurs</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{ambassadors.length} ambassadeurs inscrits</p>
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
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Nom</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Pays</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Téléphone</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Leads</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Commissions (AED)</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id} className="border-[hsl(var(--border))]">
                <TableCell className="font-medium text-[hsl(var(--foreground))]">{a.full_name || "—"}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{a.country || "—"}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{a.phone || "—"}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]">{a.leadsCount}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-[hsl(var(--foreground))]">{fmt(a.commissionsTotal)}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(a.created_at).toLocaleDateString("fr-FR")}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucun ambassadeur trouvé</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAmbassadors;
