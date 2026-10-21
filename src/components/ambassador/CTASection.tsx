import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRY_CODES = [
  { code: "+971", country: "🇦🇪 UAE" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+44", country: "🇬🇧 UK" },
  { code: "+1", country: "🇺🇸 USA" },
  { code: "+212", country: "🇲🇦 Maroc" },
  { code: "+216", country: "🇹🇳 Tunisie" },
  { code: "+213", country: "🇩🇿 Algérie" },
  { code: "+966", country: "🇸🇦 Arabie S." },
  { code: "+961", country: "🇱🇧 Liban" },
  { code: "+41", country: "🇨🇭 Suisse" },
  { code: "+32", country: "🇧🇪 Belgique" },
  { code: "+49", country: "🇩🇪 Allemagne" },
  { code: "+39", country: "🇮🇹 Italie" },
  { code: "+34", country: "🇪🇸 Espagne" },
  { code: "+351", country: "🇵🇹 Portugal" },
  { code: "+31", country: "🇳🇱 Pays-Bas" },
  { code: "+91", country: "🇮🇳 Inde" },
  { code: "+86", country: "🇨🇳 Chine" },
  { code: "+7", country: "🇷🇺 Russie" },
  { code: "+55", country: "🇧🇷 Brésil" },
  { code: "+234", country: "🇳🇬 Nigeria" },
  { code: "+27", country: "🇿🇦 Afr. du Sud" },
  { code: "+254", country: "🇰🇪 Kenya" },
  { code: "+225", country: "🇨🇮 Côte d'Iv." },
  { code: "+221", country: "🇸🇳 Sénégal" },
  { code: "+237", country: "🇨🇲 Cameroun" },
  { code: "+974", country: "🇶🇦 Qatar" },
  { code: "+965", country: "🇰🇼 Koweït" },
  { code: "+973", country: "🇧🇭 Bahreïn" },
  { code: "+968", country: "🇴🇲 Oman" },
  { code: "+20", country: "🇪🇬 Égypte" },
  { code: "+962", country: "🇯🇴 Jordanie" },
  { code: "+90", country: "🇹🇷 Turquie" },
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

const CTASection = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [country, setCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const profileOptions = [
    { value: "influencer", label: t("cta.profileInfluencer") },
    { value: "agent", label: t("cta.profileAgent") },
    { value: "consultant", label: t("cta.profileConsultant") },
    { value: "entrepreneur", label: t("cta.profileEntrepreneur") },
    { value: "investor", label: t("cta.profileInvestor") },
    { value: "other", label: t("cta.profileOther") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !lastName || !firstName || !phoneCode || !phoneNumber || !profile || !country) {
      toast({ title: t("cta.errorFill"), variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: t("cta.successTitle"), description: t("cta.successDesc") });
  };

  const inputClass = "h-12 sm:h-13 rounded-xl bg-background/60 border-border/40 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base";

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-sm text-muted-foreground mb-1.5 block">
      {children} <span className="text-destructive">*</span>
    </span>
  );


  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-primary/5 blur-[100px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("cta.title")}{" "}
            <span className="text-gradient-primary">{t("cta.titleHighlight")}</span> ?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-12">{t("cta.description")}</p>

          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 sm:p-8 bg-secondary/30 border border-border/30 space-y-4 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <RequiredLabel>{t("cta.lastNameLabel")}</RequiredLabel>
                  <Input
                    placeholder={t("cta.lastNamePlaceholder")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <RequiredLabel>{t("cta.firstNameLabel")}</RequiredLabel>
                  <Input
                    placeholder={t("cta.firstNamePlaceholder")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <RequiredLabel>{t("cta.emailLabel")}</RequiredLabel>
                <Input
                  type="email"
                  placeholder={t("cta.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <RequiredLabel>{t("cta.phoneLabel")}</RequiredLabel>
                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2">
                  <Select value={phoneCode} onValueChange={setPhoneCode}>
                    <SelectTrigger className="h-12 sm:h-13 rounded-xl bg-background/60 border-border/40 text-foreground text-sm">
                      <SelectValue placeholder="+..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.country} {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder={t("cta.phonePlaceholder")}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <RequiredLabel>{t("cta.countryLabel")}</RequiredLabel>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 sm:h-13 rounded-xl bg-background/60 border-border/40 text-foreground text-sm">
                      <SelectValue placeholder={t("cta.countryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <RequiredLabel>{t("cta.profileLabel")}</RequiredLabel>
                  <Select value={profile} onValueChange={setProfile}>
                    <SelectTrigger className="h-12 sm:h-13 rounded-xl bg-background/60 border-border/40 text-foreground text-sm">
                      <SelectValue placeholder={t("cta.profilePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {profileOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>


              <Button variant="hero" size="lg" className="w-full text-base py-5 sm:py-6 rounded-full group">
                {t("cta.submit")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-muted-foreground/60 text-center">{t("cta.terms")}</p>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-10 sm:p-12 bg-secondary/30 border border-border/30 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-5 sm:mb-6">
                <Check className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 text-foreground">{t("cta.successHeading")}</h3>
              <p className="text-muted-foreground text-base">{t("cta.successMessage")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
