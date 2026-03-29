import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUserTier } from "@/hooks/useUserTier";
import { Users, Copy, CheckCircle2, TrendingUp, Gift, Loader2, UserPlus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Godchild {
  id: string;
  full_name: string | null;
  status: string;
  created_at: string;
  leads_count: number;
  deals_closed: number;
}

const Referrals = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { referralCode, ambassadorTier, godchildrenCount } = useUserTier();
  const { toast } = useToast();
  const [godchildren, setGodchildren] = useState<Godchild[]>([]);
  const [bonusTotal, setBonusTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch godchildren profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, status, created_at")
        .eq("referred_by", user.id);

      if (profiles) {
        const enriched: Godchild[] = await Promise.all(
          profiles.map(async (p) => {
            const { count: leadsCount } = await supabase
              .from("leads")
              .select("id", { count: "exact", head: true })
              .eq("user_id", p.id);

            const { count: dealsCount } = await supabase
              .from("commissions")
              .select("id", { count: "exact", head: true })
              .eq("user_id", p.id)
              .eq("status", "confirmed");

            return {
              ...p,
              leads_count: leadsCount ?? 0,
              deals_closed: dealsCount ?? 0,
            };
          })
        );
        setGodchildren(enriched);
      }

      // Fetch total bonuses
      const { data: bonuses } = await supabase
        .from("referral_bonuses")
        .select("bonus_amount")
        .eq("super_ambassador_id", user.id);

      if (bonuses) {
        setBonusTotal(bonuses.reduce((sum, b) => sum + Number(b.bonus_amount), 0));
      }

      setLoading(false);
    };
    fetchData();
  }, [user]);

  const referralLink = `${window.location.origin}/auth?ref=${referralCode || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: lang === "fr" ? "Lien copié !" : "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--dash-accent))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-display font-bold dash-text">
            {lang === "fr" ? "Mes Filleuls" : "My Referrals"}
          </h1>
          {ambassadorTier === "ambassador_plus" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
              <Crown className="w-3 h-3" />
              Ambassadeur+
            </span>
          )}
        </div>
        <p className="text-sm dash-muted-text">
          {lang === "fr"
            ? "Parrainez de nouveaux ambassadeurs et gagnez 10% de bonus sur chacun de leurs closings."
            : "Refer new ambassadors and earn 10% bonus on each of their closings."}
        </p>
      </div>

      {/* Referral link card */}
      <div className="dash-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold dash-text">
              {lang === "fr" ? "Votre lien de parrainage" : "Your referral link"}
            </p>
            <p className="text-xs dash-muted-text">
              {lang === "fr" ? "Partagez ce lien pour parrainer" : "Share this link to refer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[hsl(var(--dash-bg))] border border-[hsl(var(--dash-border))] rounded-lg px-3 py-2 text-sm dash-text truncate font-mono">
            {referralLink}
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0 gap-1.5">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? (lang === "fr" ? "Copié" : "Copied") : (lang === "fr" ? "Copier" : "Copy")}
          </Button>
        </div>
        {referralCode && (
          <p className="text-xs dash-muted-text mt-2">
            {lang === "fr" ? "Code :" : "Code:"} <span className="font-mono font-bold text-[hsl(var(--dash-accent))]">{referralCode}</span>
          </p>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Users,
            value: godchildrenCount,
            labelFr: "Filleuls",
            labelEn: "Referrals",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            icon: TrendingUp,
            value: godchildren.reduce((s, g) => s + g.deals_closed, 0),
            labelFr: "Deals closés",
            labelEn: "Deals closed",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Gift,
            value: `AED ${bonusTotal.toLocaleString()}`,
            labelFr: "Bonus gagnés",
            labelEn: "Bonuses earned",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((kpi, i) => (
          <div key={i} className="dash-card rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold dash-text">{kpi.value}</p>
              <p className="text-xs dash-muted-text">{lang === "fr" ? kpi.labelFr : kpi.labelEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Godchildren table */}
      {godchildren.length > 0 ? (
        <div className="dash-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[hsl(var(--dash-border))]">
            <h3 className="text-sm font-semibold dash-text">
              {lang === "fr" ? "Ambassadeurs parrainés" : "Referred ambassadors"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--dash-border))]">
                  <th className="text-left px-4 py-3 text-xs dash-muted-text font-medium">{lang === "fr" ? "Nom" : "Name"}</th>
                  <th className="text-left px-4 py-3 text-xs dash-muted-text font-medium">{lang === "fr" ? "Statut" : "Status"}</th>
                  <th className="text-center px-4 py-3 text-xs dash-muted-text font-medium">{lang === "fr" ? "Leads" : "Leads"}</th>
                  <th className="text-center px-4 py-3 text-xs dash-muted-text font-medium">{lang === "fr" ? "Deals closés" : "Deals closed"}</th>
                  <th className="text-right px-4 py-3 text-xs dash-muted-text font-medium">{lang === "fr" ? "Inscrit le" : "Joined"}</th>
                </tr>
              </thead>
              <tbody>
                {godchildren.map((g) => (
                  <tr key={g.id} className="border-b border-[hsl(var(--dash-border)/.5)] last:border-0">
                    <td className="px-4 py-3 font-medium dash-text">{g.full_name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        g.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : g.status === "rejected"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {g.status === "approved" ? (lang === "fr" ? "Actif" : "Active") :
                         g.status === "rejected" ? (lang === "fr" ? "Rejeté" : "Rejected") :
                         (lang === "fr" ? "En attente" : "Pending")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center dash-text">{g.leads_count}</td>
                    <td className="px-4 py-3 text-center dash-text">{g.deals_closed}</td>
                    <td className="px-4 py-3 text-right dash-muted-text text-xs">
                      {new Date(g.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dash-card rounded-xl p-8 text-center">
          <Users className="w-10 h-10 mx-auto dash-muted-text mb-3 opacity-40" />
          <p className="text-sm dash-muted-text">
            {lang === "fr"
              ? "Vous n'avez pas encore de filleuls. Partagez votre lien pour commencer !"
              : "You don't have any referrals yet. Share your link to get started!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Referrals;
