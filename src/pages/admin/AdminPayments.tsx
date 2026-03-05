import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const { data } = await supabase.from("payments").select("*").order("date", { ascending: false });
    setPayments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const markAsPaid = async (id: string) => {
    const { error } = await supabase.from("payments").update({ status: "paid" }).eq("id", id);
    if (error) { toast.error("Erreur lors de la mise à jour"); return; }
    toast.success("Paiement marqué comme payé");
    fetchPayments();
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Paiements</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{payments.length} paiements · {payments.filter(p => p.status === "pending").length} en attente</p>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Référence</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant (AED)</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id} className="border-[hsl(var(--border))]">
                <TableCell className="font-mono text-xs text-[hsl(var(--foreground))]">{p.reference}</TableCell>
                <TableCell className="text-[hsl(var(--foreground))]">{p.deal_name || "—"}</TableCell>
                <TableCell className="text-right font-mono font-medium text-[hsl(var(--foreground))]">{fmt(p.amount)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    p.status === "paid" ? "bg-[hsl(160,70%,50%,.1)] text-[hsl(160,70%,50%)]" :
                    p.status === "processing" ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]" :
                    "bg-[hsl(45,90%,55%,.1)] text-[hsl(45,90%,55%)]"
                  }>
                    {p.status ?? "pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(p.date).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  {p.status !== "paid" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(160,70%,50%,.1)] hover:text-[hsl(160,70%,50%)] hover:border-[hsl(160,70%,50%,.3)]"
                      onClick={() => markAsPaid(p.id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Marquer payé
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucun paiement</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPayments;
