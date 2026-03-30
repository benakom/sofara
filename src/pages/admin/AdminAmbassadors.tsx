import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, CheckCircle2, XCircle, Clock, Eye, Users, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Ambassador {
  id: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  profile_type: string | null;
  status: string;
  created_at: string;
  referral_code: string | null;
  leadsCount: number;
  commissionsTotal: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "En attente", color: "bg-[hsl(45,90%,55%/.12)] text-[hsl(45,90%,55%)]", icon: Clock },
  onboarding: { label: "À valider", color: "bg-[hsl(280,70%,60%/.12)] text-[hsl(280,70%,60%)]", icon: Clock },
  approved: { label: "Actif", color: "bg-[hsl(160,70%,50%/.12)] text-[hsl(160,70%,50%)]", icon: CheckCircle2 },
  rejected: { label: "Refusé", color: "bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]", icon: XCircle },
};

const AdminAmbassadors = () => {
  const navigate = useNavigate();
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (!profiles) { setLoading(false); return; }

    const { data: leads } = await supabase.from("leads").select("user_id");
    const { data: commissions } = await supabase.from("commissions").select("user_id, amount");

    const enriched: Ambassador[] = profiles.map((p: any) => ({
      id: p.id, full_name: p.full_name, phone: p.phone, country: p.country,
      profile_type: p.profile_type, status: p.status || "pending", created_at: p.created_at,
      referral_code: p.referral_code,
      leadsCount: leads?.filter((l: any) => l.user_id === p.id).length ?? 0,
      commissionsTotal: commissions?.filter((c: any) => c.user_id === p.id).reduce((s: number, c: any) => s + Number(c.amount), 0) ?? 0,
    }));

    setAmbassadors(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq("id", userId);
    setActionLoading(null);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Statut mis à jour" });
      fetchData();
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const filtered = ambassadors
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => (a.full_name ?? a.id).toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: ambassadors.length,
    onboarding: ambassadors.filter((a) => a.status === "onboarding").length,
    approved: ambassadors.filter((a) => a.status === "approved").length,
    pending: ambassadors.filter((a) => a.status === "pending").length,
    rejected: ambassadors.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Ambassadeurs</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">{ambassadors.length} ambassadeurs inscrits</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniCard icon={Users} label="Total" value={counts.all} color="hsl(var(--primary))" />
        <MiniCard icon={UserCheck} label="Actifs" value={counts.approved} color="hsl(160,70%,50%)" />
        <MiniCard icon={Clock} label="En attente" value={counts.pending + counts.onboarding} color="hsl(45,90%,55%)" />
        <MiniCard icon={UserX} label="Refusés" value={counts.rejected} color="hsl(var(--destructive))" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: "Tous" },
          { key: "onboarding", label: "À valider" },
          { key: "approved", label: "Actifs" },
          { key: "pending", label: "En attente" },
          { key: "rejected", label: "Refusés" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === tab.key ? "bg-white/10 text-white" : "bg-[hsl(228,18%,12%)] text-[hsl(228,10%,50%)] hover:text-white"
            }`}
          >
            {tab.label} ({counts[tab.key as keyof typeof counts]})
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(228,10%,35%)]" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] text-sm text-white placeholder:text-[hsl(228,10%,35%)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/.5)]"
        />
      </div>

      <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(228,18%,14%)] hover:bg-transparent">
              <TableHead className="text-[hsl(228,10%,45%)]">Nom</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Profil</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Pays</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Code parrainage</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Statut</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-right">Leads</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-right">Commissions</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)]">Inscrit le</TableHead>
              <TableHead className="text-[hsl(228,10%,45%)] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => {
              const sc = statusConfig[a.status] || statusConfig.pending;
              return (
                <TableRow key={a.id} className="border-[hsl(228,18%,12%)] hover:bg-[hsl(228,18%,12%)]">
                  <TableCell className="font-medium text-white">{a.full_name || "—"}</TableCell>
                  <TableCell className="text-[hsl(228,10%,50%)] text-xs capitalize">{a.profile_type || "—"}</TableCell>
                  <TableCell className="text-[hsl(228,10%,50%)]">{a.country || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-[hsl(var(--primary))]">{a.referral_code || "—"}</TableCell>
                  <TableCell>
                    <Badge className={`gap-1 text-[10px] border-0 ${sc.color}`}>
                      <sc.icon className="w-2.5 h-2.5" />
                      {sc.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-mono text-white">{a.leadsCount}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-white text-sm">AED {fmt(a.commissionsTotal)}</TableCell>
                  <TableCell className="text-[hsl(228,10%,45%)] text-xs">{new Date(a.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)]" onClick={() => navigate(`/admin/ambassadors/${a.id}`)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {(a.status === "onboarding" || a.status === "pending") && (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(160,70%,50%)] hover:bg-[hsl(160,70%,50%/.1)]" disabled={actionLoading === a.id} onClick={() => handleStatusChange(a.id, "approved")}>
                            {actionLoading === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/.1)]" disabled={actionLoading === a.id} onClick={() => handleStatusChange(a.id, "rejected")}>
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                      {a.status === "rejected" && (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-[hsl(160,70%,50%)] hover:bg-[hsl(160,70%,50%/.1)]" disabled={actionLoading === a.id} onClick={() => handleStatusChange(a.id, "approved")}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[hsl(228,10%,40%)]">Aucun ambassadeur trouvé</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const MiniCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg" style={{ backgroundColor: color + "12" }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="text-xl font-bold font-mono text-white">{value}</p>
      <p className="text-[10px] text-[hsl(228,10%,45%)] uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export default AdminAmbassadors;
