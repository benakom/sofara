import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Eye, Users, Sparkles } from "lucide-react";
import AmbassadorAgreement from "./AmbassadorAgreement";

const PHONE_CODES = [
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "+216", flag: "🇹🇳", name: "Tunisie" },
  { code: "+213", flag: "🇩🇿", name: "Algérie" },
  { code: "+966", flag: "🇸🇦", name: "Arabie S." },
  { code: "+961", flag: "🇱🇧", name: "Liban" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+49", flag: "🇩🇪", name: "Allemagne" },
  { code: "+39", flag: "🇮🇹", name: "Italie" },
  { code: "+34", flag: "🇪🇸", name: "Espagne" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+31", flag: "🇳🇱", name: "Pays-Bas" },
  { code: "+91", flag: "🇮🇳", name: "Inde" },
  { code: "+86", flag: "🇨🇳", name: "Chine" },
  { code: "+7", flag: "🇷🇺", name: "Russie" },
  { code: "+55", flag: "🇧🇷", name: "Brésil" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "Afr. du Sud" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Iv." },
  { code: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+965", flag: "🇰🇼", name: "Koweït" },
  { code: "+973", flag: "🇧🇭", name: "Bahreïn" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+20", flag: "🇪🇬", name: "Égypte" },
  { code: "+962", flag: "🇯🇴", name: "Jordanie" },
  { code: "+90", flag: "🇹🇷", name: "Turquie" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
];

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
  { value: "influencer", labelAr: "Influenceur / Créateur", labelEn: "Influencer / Creator" },
  { value: "entrepreneur", labelAr: "Entrepreneur", labelEn: "Entrepreneur" },
  { value: "investor", labelAr: "Investisseur", labelEn: "Investor" },
  { value: "networker", labelAr: "Réseau / Communauté", labelEn: "Network / Community" },
  { value: "other", labelAr: "Autre", labelEn: "Other" },
];

interface OnboardingGateProps {
  needsOnboarding: boolean;
  isPendingReview: boolean;
  isRejected: boolean;
  onComplete: () => void;
}

const OnboardingGate = ({ onComplete }: OnboardingGateProps) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+33");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profileType, setProfileType] = useState("");
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);

  const selectedPhoneCode = PHONE_CODES.find(c => c.code === phoneCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !country || !profileType || !acceptedAgreement) {
      toast({ variant: "destructive", title: lang === "ar" ? "Champs requis" : "Required fields", description: lang === "ar" ? "Veuillez remplir tous les champs et accepter l'accord." : "Please fill all fields and accept the agreement." });
      return;
    }
    setLoading(true);

    // Check for referral code
    const refCode = localStorage.getItem("sofara_ref");
    let referredBy: string | null = null;

    if (refCode) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", refCode)
        .single();
      if (referrer) referredBy = referrer.id;
    }

    const updateData: Record<string, unknown> = {
      full_name: fullName.trim(),
      phone: `${phoneCode}${phone.trim()}`,
      country,
      profile_type: "referrer",
      accepted_terms: true,
      accepted_terms_at: new Date().toISOString(),
      status: "approved",
    };
    if (referredBy) updateData.referred_by = referredBy;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user!.id);

    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      localStorage.removeItem("sofara_ref");
      toast({
        title: lang === "ar" ? "Bienvenue sur Sofara ! 🎉" : "Welcome to Sofara! 🎉",
        description: lang === "ar" ? "Votre compte est activé." : "Your account is activated.",
      });
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
            <Sparkles className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-xl font-display font-bold dash-text">
            {lang === "ar" ? "Bienvenue sur Sofara" : "Welcome to Sofara"}
          </h2>
          <p className="text-sm dash-muted-text mt-2 max-w-md mx-auto leading-relaxed">
            {lang === "ar"
              ? "Complétez votre profil pour accéder à la plateforme. Votre compte sera activé immédiatement."
              : "Complete your profile to access the platform. Your account will be activated immediately."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: Lock, labelAr: "Accès sécurisé", labelEn: "Secure access" },
            { icon: Eye, labelAr: "Données protégées", labelEn: "Data protected" },
            { icon: Users, labelAr: "Réseau vérifié", labelEn: "Verified network" },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl bg-[hsl(var(--dash-muted)/.5)] border border-[hsl(var(--dash-border)/.5)]">
              <badge.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-[10px] dash-muted-text text-center font-medium">{lang === "ar" ? badge.labelAr : badge.labelEn}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="dash-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <Label className="text-xs dash-muted-text">{lang === "ar" ? "Nom complet" : "Full name"} <span className="text-destructive">*</span></Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]" required />
          </div>

          <div>
            <Label className="text-xs dash-muted-text">{lang === "ar" ? "الهاتف" : "Phone"} <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-[160px_1fr] gap-2 mt-1">
              <Select value={phoneCode} onValueChange={setPhoneCode}>
                <SelectTrigger className="bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue>
                    {selectedPhoneCode && (
                      <span className="flex items-center gap-1.5">
                        <span>{selectedPhoneCode.flag}</span>
                        <span className="truncate">{selectedPhoneCode.name}</span>
                        <span className="text-[hsl(var(--dash-muted-fg))]">{selectedPhoneCode.code}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {PHONE_CODES.map((c) => (
                    <SelectItem key={`${c.code}-${c.name}`} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="text-muted-foreground">{c.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6 12 34 56 78" className="bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs dash-muted-text">{lang === "ar" ? "Pays de résidence" : "Country"} <span className="text-destructive">*</span></Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue placeholder={lang === "ar" ? "Sélectionner" : "Select"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs dash-muted-text">{lang === "ar" ? "Profil" : "Profile"} <span className="text-destructive">*</span></Label>
              <Select value={profileType} onValueChange={setProfileType}>
                <SelectTrigger className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))] text-sm">
                  <SelectValue placeholder={lang === "ar" ? "Sélectionner" : "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {PROFILES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{lang === "ar" ? p.labelAr : p.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2 border-t border-[hsl(var(--dash-border))]">
            <AmbassadorAgreement
              lang={lang}
              accepted={acceptedAgreement}
              onAcceptedChange={setAcceptedAgreement}
            />
          </div>

          <Button type="submit" variant="hero" className="w-full rounded-xl py-5 text-sm" disabled={loading || !acceptedAgreement}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : lang === "ar" ? "Activer mon compte" : "Activate my account"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingGate;
