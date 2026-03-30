import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Loader2, User, Phone, MapPin, Calendar, GitBranch,
  DollarSign, CreditCard, CheckCircle2, Clock, XCircle, Users, Copy
} from "lucide-react";
import { toast } from "sonner";

const STAGES = [
  { value: "nouveau", label: "Nouveau" },
  { value: "contacté", label: "Contacté" },
  { value: "qualifié", label: "Qualifié" },
  { value: "négociation", label: "Négociation" },
  { value: "closing", label: "Closing" },
  { value: "perdu", label: "Perdu" },
];

const COMMISSION_STATUSES = [
  { value: "estimated", label: "Estimée" },
  { value: "confirmed", label: "Confirmée" },
  { value: "paid", label: "Payée" },
];

const AdminAmbassadorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [godchildren, setGodchildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!id) return;
    const [profileRes, leadsRes, commissionsRes, paymentsRes, godchildrenRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase.from("leads").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      supabase.from("commissions").select("*").eq("user_id", id).order("date", { ascending: false }),
      supabase.from("payments").select("*").eq("user_id", id).order("date", { ascending: false }),
      supabase.from("profiles").select("id, full_name, created_at, status").eq("referred_by", id),
    ]);
    setProfile(profileRes.data);
    setLeads(leadsRes.data ?? []);
    setCommissions(commissionsRes.data ?? []);
    setPayments(paymentsRes.data ?? []);
    setGodchildren(godchildrenRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const fmt = (n: number) => new Intl.NumberFormat("en-AE").format(n);

  const handleStatusChange = async (newStatus: string) => {
    await supabase.from("profiles").update({ status: newStatus, reviewed_at: new Date().toISOString() }).eq("id", id);
    toast.success(`Statut → ${newStatus}`);
    fetchAll();
  };

  const handleStageChange = async (leadId: string, stage: string) => {
    await supabase.from("leads").update({ stage, updated_at: new Date().toISOString() }).eq("id", leadId);
    toast.success(`Lead → ${stage}`);
    fetchAll();
  };

  const handleCommissionStatus = async (commId: string, status: string) => {
    await supabase.from("commissions").update({ status }).eq("id", commId);
    toast.success(`Commission → ${status}`);
    fetchAll();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent))]" /></div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">Ambassadeur introuvable</div>;
  }

  const totalEstimated = commissions.filter(c => c.status === "estimated").reduce((s, c) => s + Number(c.amount), 0);
  const totalConfirmed = commissions.filter(c => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);
  const totalPaid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);

  const statusBadge = (s: string) => {
    if (s === "approved") return <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" />Actif</Badge>;
    if (s === "pending" || s === "onboarding") return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />En attente</Badge>;
    if (s === "rejected") return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Refusé</Badge>;
    return <Badge variant="outline">{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/admin/ambassadors")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold text-[hsl(var(--foreground))]">{profile.full_name || "Sans nom"}</h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">ID: {profile.id.slice(0, 8)}… · Inscrit le {new Date(profile.created_at).toLocaleDateString("fr-FR")}</p>
        </div>
        {statusBadge(profile.status)}
      </div>

      {/* Profile card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile info */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Informations</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /><span className="text-[hsl(var(--foreground))]">{profile.full_name || "—"}</span></div>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /><span className="text-[hsl(var(--foreground))]">{profile.phone || "—"}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /><span className="text-[hsl(var(--foreground))]">{profile.country || "—"}</span></div>
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /><span className="text-[hsl(var(--foreground))]">{new Date(profile.created_at).toLocaleDateString("fr-FR")}</span></div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Type:</span>
              <Badge variant="outline" className="text-xs capitalize">{profile.profile_type || "referrer"}</Badge>
            </div>
            {profile.referral_code && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Code:</span>
                <code className="text-xs font-mono bg-[hsl(var(--muted))] px-2 py-0.5 rounded text-[hsl(var(--foreground))]">{profile.referral_code}</code>
                <button onClick={() => { navigator.clipboard.writeText(profile.referral_code); toast.success("Copié"); }}>
                  <Copy className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
            )}
          </div>
          {/* Actions */}
          <div className="pt-3 border-t border-[hsl(var(--border))] flex gap-2">
            {profile.status !== "approved" && (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusChange("approved")}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Activer
              </Button>
            )}
            {profile.status !== "rejected" && profile.status === "approved" && (
              <Button size="sm" variant="destructive" onClick={() => handleStatusChange("rejected")}>
                <XCircle className="w-3.5 h-3.5 mr-1" />Suspendre
              </Button>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Leads", value: leads.length, icon: GitBranch, color: "hsl(var(--primary))" },
            { label: "Estimé", value: `AED ${fmt(totalEstimated)}`, icon: DollarSign, color: "hsl(45, 90%, 55%)" },
            { label: "Confirmé", value: `AED ${fmt(totalConfirmed)}`, icon: DollarSign, color: "hsl(160, 70%, 50%)" },
            { label: "Payé", value: `AED ${fmt(totalPaid)}`, icon: CreditCard, color: "hsl(var(--primary))" },
            { label: "Paiements", value: payments.length, icon: CreditCard, color: "hsl(280, 70%, 60%)" },
            { label: "Filleuls", value: godchildren.length, icon: Users, color: "hsl(var(--accent))" },
            { label: "Pipeline", value: `AED ${fmt(totalEstimated + totalConfirmed + totalPaid)}`, icon: DollarSign, color: "hsl(var(--destructive))" },
            { label: "Closing", value: leads.filter(l => l.stage === "closing").length, icon: CheckCircle2, color: "hsl(160, 70%, 50%)" },
          ].map(card => (
            <div key={card.label} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
                <span className="text-[10px] uppercase font-medium text-[hsl(var(--muted-foreground))] tracking-wider">{card.label}</span>
              </div>
              <p className="text-lg font-bold text-[hsl(var(--foreground))]">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
          <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Leads ({leads.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Nom</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Email</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Téléphone</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Stage</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Score</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map(l => (
              <TableRow key={l.id} className="border-[hsl(var(--border))]">
                <TableCell className="font-medium text-[hsl(var(--foreground))]">{l.first_name} {l.last_name}</TableCell>
                <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{l.email || "—"}</TableCell>
                <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{l.phone || "—"}</TableCell>
                <TableCell>
                  <Select value={l.stage ?? "nouveau"} onValueChange={(v) => handleStageChange(l.id, v)}>
                    <SelectTrigger className="h-7 text-xs border-0 font-semibold w-[120px] bg-[hsl(var(--muted))]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                      {STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Badge variant="secondary">{l.score ?? "C"}</Badge></TableCell>
                <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(l.created_at).toLocaleDateString("fr-FR")}</TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-6 text-[hsl(var(--muted-foreground))]">Aucun lead</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Commissions table */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
          <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Commissions ({commissions.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map(c => (
              <TableRow key={c.id} className="border-[hsl(var(--border))]">
                <TableCell className="font-medium text-[hsl(var(--foreground))]">{c.deal_name}</TableCell>
                <TableCell className="text-right font-mono text-[hsl(var(--foreground))]">AED {fmt(c.amount)}</TableCell>
                <TableCell>
                  <Select value={c.status ?? "estimated"} onValueChange={(v) => handleCommissionStatus(c.id, v)}>
                    <SelectTrigger className="h-7 text-xs border-0 font-semibold w-[120px] bg-[hsl(var(--muted))]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--popover))] border-[hsl(var(--border))]">
                      {COMMISSION_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
              </TableRow>
            ))}
            {commissions.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-6 text-[hsl(var(--muted-foreground))]">Aucune commission</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Payments */}
      {payments.length > 0 && (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Paiements ({payments.length})</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Référence</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Deal</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] text-right">Montant</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id} className="border-[hsl(var(--border))]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--foreground))]">{p.reference}</TableCell>
                  <TableCell className="text-[hsl(var(--foreground))]">{p.deal_name || "—"}</TableCell>
                  <TableCell className="text-right font-mono font-medium text-[hsl(var(--foreground))]">AED {fmt(p.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "paid" ? "default" : "secondary"} className="text-xs">
                      {p.status === "paid" ? "Payé" : p.status === "processing" ? "En cours" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(p.date).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Godchildren / Referrals */}
      {godchildren.length > 0 && (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))]">Filleuls ({godchildren.length})</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))]">Nom</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Statut</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))]">Inscrit le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {godchildren.map(g => (
                <TableRow key={g.id} className="border-[hsl(var(--border))] cursor-pointer hover:bg-[hsl(var(--muted)/.5)]" onClick={() => navigate(`/admin/ambassadors/${g.id}`)}>
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">{g.full_name || "—"}</TableCell>
                  <TableCell>{statusBadge(g.status)}</TableCell>
                  <TableCell className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(g.created_at).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminAmbassadorDetail;
