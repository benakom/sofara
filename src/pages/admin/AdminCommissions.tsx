import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, CheckCircle2, DollarSign, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface Profile { id: string; full_name: string | null; }

const STATUSES = [
  { value: "estimated", label: "Estimée", color: "bg-[hsl(45,90%,55%/.12)] text-[hsl(45,90%,55%)]" },
  { value: "confirmed", label: "Confirmée", color: "bg-[hsl(80,70%,55%/.12)] text-[hsl(80,70%,55%)]" },
  { value: "paid", label: "Payée", color: "bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]" },
];

const AdminCommissions = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchData = async () => {
    const [commissionsRes, profilesRes] = await Promise.all([
      supabase.from("commissions").select("*").order("date", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);
    setCommissions(commissionsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getName = (uid: string) => profiles.find(p => p.id === uid)?.full_name || uid.slice(0, 8) + "…";
  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("commissions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    toast.success(`Commission → ${newStatus}`);
    fetchData();
  };

  const filtered = commissions
    .filter(c => filterStatus === "all" || c.status === filterStatus)
    .filter(c => `${c.deal_name} ${getName(c.user_id)}`.toLowerCase().includes(search.toLowerCase()));

  const estimated = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
  const confirmed = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
  const paid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Commissions</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">{commissions.length} commissions au total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={Clock} label="Estimées" value={`AED ${fmt(estimated)}`} count={commissions.filter(c => c.status === "estimated").length} color="hsl(45,90%,55%)" />
        <SummaryCard icon={CheckCircle2} label="Confirmées" value={`AED ${fmt(confirmed)}`} count={commissions.filter(c => c.status === "confirmed").length} color="hsl(80,70%,55%)" />
        <SummaryCard icon={DollarSign} label="Payées" value={`AED ${fmt(paid)}`} count={commissions.filter(c => c.status === "paid").length} color="hsl(var(--primary))" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {[{ key: "all", label: "Toutes" }, ...STATUSES.map(s => ({ key: s.value, label: s.label }))].map(tab => (
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
          <input
            type="text" placeholder="Rechercher..."
            value={search} onChange={(e) => setSearch(e.target.value)}
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
              <TableHead className="text-[hsl(228,10%,45%)]">Deal</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-right">Montant</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Statut</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Date</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const statusObj = STATUSES.find(s => s.value === c.status) ?? STATUSES[0];
              return (
                <TableRow key={c.id} className="border-[hsl(228,18%,12%)] hover:bg-[hsl(228,18%,12%)]">
                  <TableCell className="text-xs font-medium text-[hsl(var(--primary))]">{getName(c.user_id)}</TableCell>
                  <TableCell className="font-medium text-white">{c.deal_name}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-white">AED {fmt(c.amount)}</TableCell>
                  <TableCell>
                    <Select value={c.status ?? "estimated"} onValueChange={(v) => handleStatusChange(c.id, v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 ${statusObj.color} font-semibold w-[120px]`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(228,20%,12%)] border-[hsl(228,18%,18%)]">
                        {STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[hsl(228,10%,45%)] text-xs">{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-center">
                    {c.status === "estimated" && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(80,70%,55%)] hover:bg-[hsl(80,70%,55%/.1)]"
                        onClick={() => handleStatusChange(c.id, "confirmed")}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirmer
                      </Button>
                    )}
                    {c.status === "confirmed" && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)]"
                        onClick={() => handleStatusChange(c.id, "paid")}>
                        <DollarSign className="w-3.5 h-3.5 mr-1" /> Marquer payée
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-[hsl(228,10%,40%)]">Aucune commission</TableCell></TableRow>
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

export default AdminCommissions;
