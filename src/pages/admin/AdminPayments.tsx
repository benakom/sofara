import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, CheckCircle, CreditCard, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Profile { id: string; full_name: string | null; }

const PAYMENT_STATUSES = [
  { value: "pending", label: "En attente", color: "bg-[hsl(45,90%,55%/.12)] text-[hsl(45,90%,55%)]" },
  { value: "processing", label: "En cours", color: "bg-[hsl(280,70%,60%/.12)] text-[hsl(280,70%,60%)]" },
  { value: "paid", label: "Payé", color: "bg-[hsl(160,70%,50%/.12)] text-[hsl(160,70%,50%)]" },
];

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const getName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || uid.slice(0, 8) + "…";
  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("payments").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Paiement → ${newStatus}`);
    fetchData();
  };

  const filtered = payments
    .filter(p => filterStatus === "all" || p.status === filterStatus)
    .filter(p =>
      (p.reference ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.deal_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      getName(p.user_id).toLowerCase().includes(search.toLowerCase())
    );

  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
  const totalProcessing = payments.filter(p => p.status === "processing").reduce((s, p) => s + Number(p.amount), 0);
  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Paiements</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">{payments.length} paiements au total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={Clock} label="En attente" value={`AED ${fmt(totalPending)}`} count={payments.filter(p => p.status === "pending").length} color="hsl(45,90%,55%)" />
        <SummaryCard icon={CreditCard} label="En cours" value={`AED ${fmt(totalProcessing)}`} count={payments.filter(p => p.status === "processing").length} color="hsl(280,70%,60%)" />
        <SummaryCard icon={CheckCircle} label="Payés" value={`AED ${fmt(totalPaid)}`} count={payments.filter(p => p.status === "paid").length} color="hsl(160,70%,50%)" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {[{ key: "all", label: "Tous" }, ...PAYMENT_STATUSES.map(s => ({ key: s.value, label: s.label }))].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === tab.key ? "bg-white/10 text-white" : "bg-[hsl(228,18%,12%)] text-[hsl(228,10%,50%)] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(228,10%,35%)]" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] text-sm text-white placeholder:text-[hsl(228,10%,35%)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/.5)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(228,18%,14%)] hover:bg-transparent">
              <TableHead className="text-[hsl(228,10%,45%)]">Ambassadeur</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Référence</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Deal</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-right">Montant</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Statut</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Date</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const statusObj = PAYMENT_STATUSES.find(s => s.value === p.status) ?? PAYMENT_STATUSES[0];
              return (
                <TableRow key={p.id} className="border-[hsl(228,18%,12%)] hover:bg-[hsl(228,18%,12%)]">
                  <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getName(p.user_id)}</TableCell>
                  <TableCell className="font-mono text-xs text-[hsl(228,10%,55%)]">{p.reference}</TableCell>
                  <TableCell className="text-white">{p.deal_name || "—"}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-white">AED {fmt(p.amount)}</TableCell>
                  <TableCell>
                    <Select value={p.status ?? "pending"} onValueChange={(v) => handleStatusChange(p.id, v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 ${statusObj.color} font-semibold w-[120px]`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(228,20%,12%)] border-[hsl(228,18%,18%)]">
                        {PAYMENT_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[hsl(228,10%,45%)] text-xs">{new Date(p.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-center">
                    {p.status !== "paid" && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(160,70%,50%)] hover:bg-[hsl(160,70%,50%/.1)]"
                        onClick={() => handleStatusChange(p.id, "paid")}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Payer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-[hsl(228,10%,40%)]">Aucun paiement</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, count, color }: {
  icon: any; label: string; value: string; count: number; color: string;
}) => (
  <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-4 flex items-center gap-4">
    <div className="p-2.5 rounded-lg" style={{ backgroundColor: color + "12" }}>
      <Icon className="w-4.5 h-4.5" style={{ color }} />
    </div>
    <div>
      <p className="text-lg font-bold font-mono text-white">{value}</p>
      <p className="text-[11px] text-[hsl(228,10%,45%)]">{count} {label.toLowerCase()}</p>
    </div>
  </div>
);

export default AdminPayments;
