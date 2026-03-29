import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Check, X, Sparkles, GitBranch, Bot, BookOpen,
  Calculator, CalendarDays, ShieldCheck, Crown
} from "lucide-react";

const COMPARE_FEATURES = [
  { labelAr: "Pipeline de leads", labelEn: "Lead Pipeline", lite: true, pro: true },
  { labelAr: "Suivi des commissions", labelEn: "Commission Tracking", lite: true, pro: true },
  { labelAr: "Suivi des paiements", labelEn: "Payment Tracking", lite: true, pro: true },
  { labelAr: "Community", labelEn: "Community", lite: true, pro: true },
  { labelAr: "Academy (formations)", labelEn: "Academy (courses)", lite: true, pro: true },
  { labelAr: "Parrainage d'ambassadeurs", labelEn: "Ambassador Referrals", lite: true, pro: true },
  { labelAr: "SofarAI — Assistant IA", labelEn: "SofarAI — AI Assistant", lite: false, pro: true },
  { labelAr: "Scoring IA des leads", labelEn: "AI Lead Scoring", lite: false, pro: true },
  { labelAr: "Bibliothèque de projets", labelEn: "Project Library", lite: false, pro: true },
  { labelAr: "Simulateurs (DLD, Plans)", labelEn: "Simulators (DLD, Plans)", lite: false, pro: true },
  { labelAr: "Calendrier intégré", labelEn: "Integrated Calendar", lite: false, pro: true },
  { labelAr: "KYC & AML", labelEn: "KYC & AML", lite: false, pro: true },
];

const EXPERIENCE_OPTIONS = [
  { value: "agent", labelAr: "Agent immobilier", labelEn: "Real estate agent" },
  { value: "broker", labelAr: "Courtier immobilier", labelEn: "Real estate broker" },
  { value: "sales", labelAr: "Professionnel de la vente", labelEn: "Sales professional" },
  { value: "consultant", labelAr: "Consultant immobilier", labelEn: "Real estate consultant" },
  { value: "aspiring", labelAr: "Je veux me lancer dans l'immobilier", labelEn: "I want to start in real estate" },
];

interface UpgradeToProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeRequested: () => void;
}

const UpgradeToProDialog = ({ open, onOpenChange, onUpgradeRequested }: UpgradeToProDialogProps) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<"compare" | "form">("compare");
  const [loading, setLoading] = useState(false);

  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleSubmit = async () => {
    if (!experience) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        profile_type: "pro_pending",
      })
      .eq("id", user!.id);

    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({
        title: lang === "ar" ? "Demande envoyée !" : "Request sent!",
        description: lang === "ar"
          ? "Notre équipe va examiner votre profil sous 24-48h."
          : "Our team will review your profile within 24-48h.",
      });
      onUpgradeRequested();
      onOpenChange(false);
      setStep("compare");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg dash-text font-display">
            <Crown className="w-5 h-5 text-[hsl(var(--primary))]" />
            {lang === "ar" ? "Passer à Sofara Pro" : "Upgrade to Sofara Pro"}
          </DialogTitle>
          <DialogDescription className="dash-muted-text">
            {lang === "ar"
              ? "Gratuit • Accédez à tous les outils pro pour qualifier et closer vos leads."
              : "Free • Access all pro tools to qualify and close your leads."}
          </DialogDescription>
        </DialogHeader>

        {step === "compare" ? (
          <div className="space-y-5">
            {/* Comparison table */}
            <div className="rounded-xl border border-[hsl(var(--dash-border))] overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_80px] bg-[hsl(var(--dash-muted)/.5)]">
                <div className="p-3 text-xs font-semibold dash-muted-text uppercase tracking-wider">
                  {lang === "ar" ? "Fonctionnalité" : "Feature"}
                </div>
                <div className="p-3 text-xs font-semibold dash-muted-text text-center uppercase tracking-wider">Lite</div>
                <div className="p-3 text-xs font-semibold text-[hsl(var(--primary))] text-center uppercase tracking-wider">Pro</div>
              </div>
              {COMPARE_FEATURES.map((f, i) => (
                <div key={i} className={`grid grid-cols-[1fr_80px_80px] border-t border-[hsl(var(--dash-border)/.5)] ${!f.lite ? "bg-[hsl(var(--primary)/.03)]" : ""}`}>
                  <div className="p-3 text-xs dash-text">{lang === "ar" ? f.labelAr : f.labelEn}</div>
                  <div className="p-3 flex items-center justify-center">
                    {f.lite ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-[hsl(var(--dash-muted-fg)/.3)]" />
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[hsl(var(--primary))]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--primary)/.06)] border border-[hsl(var(--primary)/.15)]">
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
              <p className="text-xs dash-text">
                {lang === "ar"
                  ? "L'upgrade Pro est 100% gratuit. Vous devez être un professionnel de l'immobilier ou vouloir vous lancer dans ce secteur."
                  : "Pro upgrade is 100% free. You must be a real estate professional or want to start in this industry."}
              </p>
            </div>

            <Button
              variant="hero"
              className="w-full rounded-xl py-5 text-sm"
              onClick={() => setStep("form")}
            >
              {lang === "ar" ? "Demander l'upgrade Pro" : "Request Pro Upgrade"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setStep("compare")} className="text-xs text-[hsl(var(--primary))] hover:underline">
              ← {lang === "ar" ? "Retour au comparatif" : "Back to comparison"}
            </button>

            <div>
              <Label className="text-xs dash-muted-text">
                {lang === "ar" ? "Votre profil professionnel" : "Your professional profile"} <span className="text-destructive">*</span>
              </Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue placeholder={lang === "ar" ? "Sélectionner" : "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {lang === "ar" ? o.labelAr : o.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs dash-muted-text">
                {lang === "ar" ? "Entreprise / Agence (optionnel)" : "Company / Agency (optional)"}
              </Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={lang === "ar" ? "Nom de votre entreprise" : "Your company name"}
                className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]"
              />
            </div>

            <div>
              <Label className="text-xs dash-muted-text">
                {lang === "ar" ? "Pourquoi souhaitez-vous passer Pro ? (optionnel)" : "Why do you want to go Pro? (optional)"}
              </Label>
              <Textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder={lang === "ar" ? "Décrivez brièvement votre activité..." : "Briefly describe your activity..."}
                className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] min-h-[80px]"
              />
            </div>

            <Button
              variant="hero"
              className="w-full rounded-xl py-5 text-sm"
              disabled={loading || !experience}
              onClick={handleSubmit}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : lang === "ar" ? "Soumettre ma demande" : "Submit my request"}
            </Button>

            <p className="text-[10px] dash-muted-text text-center opacity-60">
              {lang === "ar"
                ? "Votre demande sera examinée sous 24-48h par notre équipe."
                : "Your request will be reviewed within 24-48h by our team."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProDialog;
