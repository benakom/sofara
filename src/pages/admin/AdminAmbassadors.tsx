import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
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
  leadsCount: number;
  commissionsTotal: number;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  pending: { label: "En attente", variant: "secondary", icon: Clock },
  onboarding: { label: "À valider", variant: "outline", icon: Clock },
  approved: { label: "Actif", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Refusé", variant: "destructive", icon: XCircle },
};

const AdminAmbassadors = () => {
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
      id: p.id,
      full_name: p.full_name,
      phone: p.phone,
      country: p.country,
      profile_type: p.profile_type,
      status: p.status || "pending",
      created_at: p.created_at,
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
      toast({ title: "Statut mis à jour", description: `Ambassadeur ${newStatus === "approved" ? "activé" : "refusé"}.` });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">Ambassadeurs</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{ambassadors.length} ambassadeurs inscrits</p>
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
              filter === tab.key
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            }`}
          >
            {tab.label} ({counts[tab.key as keyof typeof counts]})
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
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Nom</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Profil</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Pays</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Leads</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Commissions</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Inscrit le</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => {
              const sc = statusConfig[a.status] || statusConfig.pending;
              return (
                <TableRow key={a.id} className="border-[hsl(var(--border))]">
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">{a.full_name || "—"}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-xs capitalize">{a.profile_type || "—"}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">{a.country || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={sc.variant} className="gap-1 text-xs">
                      <sc.icon className="w-3 h-3" />
                      {sc.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]">{a.leadsCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-[hsl(var(--foreground))]">AED {fmt(a.commissionsTotal)}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-xs">{new Date(a.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    {(a.status === "onboarding" || a.status === "pending") && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          disabled={actionLoading === a.id}
                          onClick={() => handleStatusChange(a.id, "approved")}
                        >
                          {actionLoading === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={actionLoading === a.id}
                          onClick={() => handleStatusChange(a.id, "rejected")}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                    {a.status === "rejected" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        disabled={actionLoading === a.id}
                        onClick={() => handleStatusChange(a.id, "approved")}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-[hsl(var(--muted-foreground))]">Aucun ambassadeur trouvé</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAmbassadors;
