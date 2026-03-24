import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, CheckCircle2, Clock, Shield, FileText, UserCheck,
  Lock, Eye, Users, ArrowRight, Sparkles, BarChart3, Bot, GraduationCap,
  Rocket
} from "lucide-react";

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

const AMBASSADOR_TYPES = [
  {
    value: "referrer",
    labelFr: "J'ai un réseau et je veux recommander",
    labelEn: "I have a network and want to refer",
    descFr: "Apportez des contacts, on s'occupe du reste. Aucune compétence immobilière requise.",
    descEn: "Bring contacts, we handle the rest. No real estate skills needed.",
    icon: "🤝",
  },
  {
    value: "pro",
    labelFr: "Je suis professionnel de l'immobilier ou de la vente",
    labelEn: "I'm a real estate or sales professional",
    descFr: "Accédez à tous les outils IA pour qualifier, convaincre et closer vos leads.",
    descEn: "Access all AI tools to qualify, convince and close your leads.",
    icon: "🏢",
  },
];

const PROFILES = [
  { value: "influencer", labelFr: "Influenceur / Créateur", labelEn: "Influencer / Creator" },
  { value: "agent", labelFr: "Agent immobilier", labelEn: "Real estate agent" },
  { value: "consultant", labelFr: "Consultant financier", labelEn: "Financial consultant" },
  { value: "entrepreneur", labelFr: "Entrepreneur", labelEn: "Entrepreneur" },
  { value: "investor", labelFr: "Investisseur", labelEn: "Investor" },
  { value: "other", labelFr: "Autre", labelEn: "Other" },
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
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const [ambassadorType, setAmbassadorType] = useState<"referrer" | "pro" | "">("");
  const [fullName, setFullName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+33");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profileType, setProfileType] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConduct, setAcceptedConduct] = useState(false);

  const tourSlides = [
    {
      icon: BarChart3,
      color: "from-blue-500 to-cyan-400",
      titleFr: "Tableau de bord intelligent",
      titleEn: "Smart Dashboard",
      descFr: "Suivez vos performances, vos commissions et votre pipeline en temps réel avec des KPIs clairs et actionnables.",
      descEn: "Track your performance, commissions and pipeline in real-time with clear, actionable KPIs.",
    },
    {
      icon: Bot,
      color: "from-violet-500 to-purple-400",
      titleFr: "SofarAI — Votre assistant IA",
      titleEn: "SofarAI — Your AI Assistant",
      descFr: "Qualifiez vos leads, générez des séquences de messages et entraînez-vous avec un roleplay IA réaliste.",
      descEn: "Qualify your leads, generate message sequences and practice with realistic AI roleplay.",
    },
    {
      icon: GraduationCap,
      color: "from-amber-500 to-orange-400",
      titleFr: "Academy & Certification",
      titleEn: "Academy & Certification",
      descFr: "Accédez à des formations exclusives sur l'immobilier à Dubai, la vente et la conformité pour devenir un expert.",
      descEn: "Access exclusive courses on Dubai real estate, sales and compliance to become an expert.",
    },
    {
      icon: Rocket,
      color: "from-emerald-500 to-teal-400",
      titleFr: "Prêt à décoller ?",
      titleEn: "Ready to launch?",
      descFr: "Notre équipe examine votre profil sous 24-48h. Vous recevrez un email dès que votre accès complet sera activé.",
      descEn: "Our team reviews your profile within 24-48h. You'll receive an email once your full access is activated.",
    },
  ];

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

  // Platform tour after submission
  if (showTour) {
    const slide = tourSlides[tourStep];
    const isLast = tourStep === tourSlides.length - 1;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="dash-card rounded-2xl p-8 sm:p-10 text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                <slide.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold dash-text mb-2">
                {lang === "fr" ? slide.titleFr : slide.titleEn}
              </h3>
              <p className="text-sm dash-muted-text leading-relaxed max-w-sm mx-auto mb-8">
                {lang === "fr" ? slide.descFr : slide.descEn}
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {tourSlides.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === tourStep ? "w-6 bg-[hsl(var(--primary))]" : "w-1.5 bg-[hsl(var(--dash-border))]"
                  }`} />
                ))}
              </div>

              <Button
                variant="hero"
                className="rounded-full px-8 py-5 text-sm group"
                onClick={() => {
                  if (isLast) {
                    onComplete();
                  } else {
                    setTourStep(tourStep + 1);
                  }
                }}
              >
                {isLast
                  ? (lang === "fr" ? "C'est parti !" : "Let's go!")
                  : (lang === "fr" ? "Suivant" : "Next")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Onboarding form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !country || !profileType || !acceptedTerms || !acceptedConduct || !ambassadorType) {
      toast({ variant: "destructive", title: lang === "fr" ? "Champs requis" : "Required fields", description: lang === "fr" ? "Veuillez remplir tous les champs." : "Please fill all fields." });
      return;
    }
    setLoading(true);

    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref") || localStorage.getItem("sofara_ref");
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
      profile_type: ambassadorType === "pro" ? "pro" : profileType,
      accepted_terms: true,
      accepted_terms_at: new Date().toISOString(),
      status: "onboarding",
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
      setShowTour(true);
    }
  };

  const selectedPhoneCode = PHONE_CODES.find(c => c.code === phoneCode);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Header with explanation */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-xl font-display font-bold dash-text">
            {lang === "fr" ? "Vérification de votre profil" : "Profile Verification"}
          </h2>
          <p className="text-sm dash-muted-text mt-2 max-w-md mx-auto leading-relaxed">
            {lang === "fr"
              ? "Sofara est une plateforme sélective. Pour garantir la sécurité de notre réseau et la qualité de nos collaborations, nous vérifions chaque profil avant d'accorder l'accès aux outils."
              : "Sofara is a selective platform. To ensure network security and collaboration quality, we verify every profile before granting tool access."}
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: Lock, labelFr: "Accès sécurisé", labelEn: "Secure access" },
            { icon: Eye, labelFr: "Données protégées", labelEn: "Data protected" },
            { icon: Users, labelFr: "Réseau vérifié", labelEn: "Verified network" },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl bg-[hsl(var(--dash-muted)/.5)] border border-[hsl(var(--dash-border)/.5)]">
              <badge.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-[10px] dash-muted-text text-center font-medium">{lang === "fr" ? badge.labelFr : badge.labelEn}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="dash-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <Label className="text-xs dash-muted-text">{lang === "fr" ? "Nom complet" : "Full name"} <span className="text-destructive">*</span></Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1 bg-[hsl(var(--dash-bg))] border-[hsl(var(--dash-border))]" required />
          </div>

          <div>
            <Label className="text-xs dash-muted-text">{lang === "fr" ? "Téléphone" : "Phone"} <span className="text-destructive">*</span></Label>
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

          <p className="text-[10px] dash-muted-text text-center opacity-60">
            {lang === "fr"
              ? "Votre candidature sera examinée sous 24-48h par notre équipe."
              : "Your application will be reviewed within 24-48h by our team."}
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingGate;
