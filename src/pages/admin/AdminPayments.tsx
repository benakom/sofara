import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";

interface Profile { id: string; full_name: string | null; }

const PAYMENT_STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "processing", label: "En cours" },
  { value: "paid", label: "Payé" },
];

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const [paymentsRes, profilesRes] = await Promise.all([
      supabase.from("payments").select("*").order("date", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);
    setPayments(paymentsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getAmbassadorName = (userId: string) => {
    const p = profiles.find(pr => pr.id === userId);
    return p?.full_name || userId.slice(0, 8) + "…";
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("payments").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Erreur lors de la mise à jour"); return; }
    toast.success(`Paiement → ${newStatus}`);
    fetchData();
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const filtered = payments.filter(p => 
    (p.reference ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.deal_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    getAmbassadorName(p.user_id).toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Paiements</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          {payments.length} paiements · {payments.filter(p => p.status === "pending").length} en attente · AED {fmt(totalPending)} à verser · AED {fmt(totalPaid)} payés
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
        />
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Ambassadeur</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Référence</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant (AED)</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="border-[hsl(var(--border))]">
                <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getAmbassadorName(p.user_id)}</TableCell>
                <TableCell className="font-mono text-xs text-[hsl(var(--foreground))]">{p.reference}</TableCell>
                <TableCell className="text-[hsl(var(--foreground))]">{p.deal_name || "—"}</TableCell>
                <TableCell className="text-right font-mono font-medium text-[hsl(var(--foreground))]">AED {fmt(p.amount)}</TableCell>
                <TableCell>
                  <Select value={p.status ?? "pending"} onValueChange={(v) => handleStatusChange(p.id, v)}>
                    <SelectTrigger className={`h-7 text-xs border-0 font-semibold w-[120px] ${
                      p.status === "paid" ? "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]" :
                      p.status === "processing" ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]" :
                      "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                      {PAYMENT_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(p.date).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  {p.status !== "paid" && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => handleStatusChange(p.id, "paid")}>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucun paiement</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPayments;
