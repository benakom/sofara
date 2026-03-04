import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CTASection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [country, setCountry] = useState("");
  const [networkSize, setNetworkSize] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [motivation, setMotivation] = useState("");
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

  const networkOptions = [
    { value: "small", label: t("cta.networkSmall") },
    { value: "medium", label: t("cta.networkMedium") },
    { value: "large", label: t("cta.networkLarge") },
    { value: "xlarge", label: t("cta.networkXLarge") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone || !profile || !country || !networkSize) {
      toast({ title: t("cta.errorFill"), variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: t("cta.successTitle"), description: t("cta.successDesc") });
  };

  const inputClass = "h-13 rounded-xl bg-background/60 border-border/40 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-sm";

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("cta.title")}{" "}
            <span className="text-gradient-primary">{t("cta.titleHighlight")}</span> ?
          </h2>
          <p className="text-muted-foreground text-base mb-12">{t("cta.description")}</p>

          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-8 bg-secondary/30 border border-border/30 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder={t("cta.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
                <Input
                  type="email"
                  placeholder={t("cta.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  placeholder={t("cta.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
                <Input
                  placeholder={t("cta.countryPlaceholder")}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger className="h-13 rounded-xl bg-background/60 border-border/40 text-foreground text-sm">
                    <SelectValue placeholder={t("cta.profilePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {profileOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={networkSize} onValueChange={setNetworkSize}>
                  <SelectTrigger className="h-13 rounded-xl bg-background/60 border-border/40 text-foreground text-sm">
                    <SelectValue placeholder={t("cta.networkPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {networkOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder={t("cta.linkedinPlaceholder")}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={inputClass}
              />
              <Textarea
                placeholder={t("cta.motivationPlaceholder")}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="rounded-xl bg-background/60 border-border/40 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-sm min-h-[100px]"
              />
              <Button variant="hero" size="lg" className="w-full text-base py-6 rounded-full group">
                {t("cta.submit")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[11px] text-muted-foreground/60">{t("cta.terms")}</p>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-12 bg-secondary/30 border border-border/30 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                <Check className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2 text-foreground">{t("cta.successHeading")}</h3>
              <p className="text-muted-foreground text-sm">{t("cta.successMessage")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
