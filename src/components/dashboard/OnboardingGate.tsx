import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Clock, Shield, FileText, UserCheck } from "lucide-react";

const COUNTRIES = [
  "Émirats Arabes Unis", "France", "Royaume-Uni", "États-Unis", "Canada",
  "Maroc", "Tunisie", "Algérie", "Arabie Saoudite", "Liban",
  "Suisse", "Belgique", "Allemagne", "Italie", "Espagne",
  "Portugal", "Pays-Bas", "Inde", "Chine", "Russie",
  "Brésil", "Nigeria", "Afrique du Sud", "Kenya", "Côte d'Ivoire",
  "Sénégal", "Cameroun", "Qatar", "Koweït", "Bahreïn",
  "Oman", "Égypte", "Jordanie", "Turquie", "Autre",
];

const PROFILES = [
  { value: "influencer", labelFr: "Influenceur / Créateur", labelEn: "Influencer / Creator" },
  { value: "agent", labelFr: "Agent immobilier", labelEn: "Real estate agent" },
  { value: "consultant", labelFr: "Consultant financier", labelEn: "Financial consultant" },
  { value: "entrepreneur", labelFr: "Entrepreneur", labelEn: "Entrepreneur" },
  { value: "investor", labelFr: "Investisseur", labelEn: "Investor" },
  { value: "other", labelFr: "Autre", labelEn: "Other" },
];

const PHONE_CODES = [
  "+971", "+33", "+44", "+1", "+212", "+216", "+213", "+966", "+961",
  "+41", "+32", "+49", "+39", "+34", "+351", "+31", "+91", "+86",
];

interface OnboardingGateProps {
  needsOnboarding: boolean;
  isPendingReview: boolean;
  isRejected: boolean;
  onComplete: () => void;
}

const OnboardingGate = ({ needsOnboarding, isPendingReview, isRejected, onComplete }: OnboardingGateProps) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+33");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profileType, setProfileType] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConduct, setAcceptedConduct] = useState(false);

  // Pending review state
  if (isPendingReview && !needsOnboarding) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold dash-text">
              {lang === "fr" ? "En attente de validation" : "Pending Approval"}
            </h2>
            <p className="text-sm dash-muted-text mt-2 max-w-sm mx-auto">
              {lang === "fr"
                ? "Votre profil est en cours de vérification par notre équipe. Vous recevrez un email dès que votre compte sera activé."
                : "Your profile is being reviewed by our team. You'll receive an email once your account is activated."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: UserCheck, labelFr: "Profil complété", labelEn: "Profile completed", done: true },
              { icon: Shield, labelFr: "Vérification", labelEn: "Verification", done: false, active: true },
              { icon: CheckCircle2, labelFr: "Accès complet", labelEn: "Full access", done: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.done ? "bg-emerald-500/10 text-emerald-500" : step.active ? "bg-amber-500/10 text-amber-500 animate-pulse" : "bg-[hsl(var(--dash-muted))] dash-muted-text"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] dash-muted-text text-center">{lang === "fr" ? step.labelFr : step.labelEn}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Rejected state
  if (isRejected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-display font-bold dash-text">
            {lang === "fr" ? "Candidature non retenue" : "Application Not Approved"}
          </h2>
          <p className="text-sm dash-muted-text max-w-sm mx-auto">
            {lang === "fr"
              ? "Votre candidature n'a pas été retenue. Pour plus d'informations, contactez support@sofara.io."
              : "Your application was not approved. For more information, contact support@sofara.io."}
          </p>
        </motion.div>
      </div>
    );
  }

  // Onboarding form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !country || !profileType || !acceptedTerms || !acceptedConduct) {
      toast({ variant: "destructive", title: lang === "fr" ? "Champs requis" : "Required fields", description: lang === "fr" ? "Veuillez remplir tous les champs." : "Please fill all fields." });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: `${phoneCode}${phone.trim()}`,
        country,
        profile_type: profileType,
        accepted_terms: true,
        accepted_terms_at: new Date().toISOString(),
        status: "onboarding",
      })
      .eq("id", user!.id);

    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: lang === "fr" ? "Profil envoyé !" : "Profile submitted!", description: lang === "fr" ? "Votre profil est en cours de vérification." : "Your profile is under review." });
      onComplete();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-xl font-display font-bold dash-text">
            {lang === "fr" ? "Complétez votre profil" : "Complete Your Profile"}
          </h2>
          <p className="text-sm dash-muted-text mt-1">
            {lang === "fr"
              ? "Pour activer votre espace ambassadeur, veuillez remplir les informations suivantes."
              : "To activate your ambassador space, please fill in the following information."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="dash-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <Label className="text-xs dash-muted-text">{lang === "fr" ? "Nom complet" : "Full name"} <span className="text-destructive">*</span></Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]" required />
          </div>

          <div>
            <Label className="text-xs dash-muted-text">{lang === "fr" ? "Téléphone" : "Phone"} <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-[100px_1fr] gap-2 mt-1">
              <Select value={phoneCode} onValueChange={setPhoneCode}>
                <SelectTrigger className="bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_CODES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6 12 34 56 78" className="bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs dash-muted-text">{lang === "fr" ? "Pays de résidence" : "Country"} <span className="text-destructive">*</span></Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue placeholder={lang === "fr" ? "Sélectionner" : "Select"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs dash-muted-text">{lang === "fr" ? "Profil" : "Profile"} <span className="text-destructive">*</span></Label>
              <Select value={profileType} onValueChange={setProfileType}>
                <SelectTrigger className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue placeholder={lang === "fr" ? "Sélectionner" : "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {PROFILES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{lang === "fr" ? p.labelFr : p.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[hsl(var(--dash-border))]">
            <div className="flex items-start gap-3">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(v) => setAcceptedTerms(!!v)} className="mt-0.5" />
              <label htmlFor="terms" className="text-xs dash-muted-text leading-relaxed cursor-pointer">
                {lang === "fr"
                  ? "J'accepte les conditions générales d'utilisation et la politique de confidentialité de Sofara."
                  : "I accept Sofara's terms of service and privacy policy."}
                <span className="text-destructive ml-0.5">*</span>
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="conduct" checked={acceptedConduct} onCheckedChange={(v) => setAcceptedConduct(!!v)} className="mt-0.5" />
              <label htmlFor="conduct" className="text-xs dash-muted-text leading-relaxed cursor-pointer">
                {lang === "fr"
                  ? "Je m'engage à respecter le code de conduite du programme ambassadeur et à ne pas partager d'informations confidentielles."
                  : "I commit to respecting the ambassador program code of conduct and not sharing confidential information."}
                <span className="text-destructive ml-0.5">*</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full rounded-xl py-5 text-sm" disabled={loading || !acceptedTerms || !acceptedConduct}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : lang === "fr" ? "Soumettre ma candidature" : "Submit Application"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingGate;
