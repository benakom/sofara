import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CTASection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
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
    if (!email || !name || !phone || !profile) {
      toast({ title: t("cta.errorFill"), variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: t("cta.successTitle"), description: t("cta.successDesc") });
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("cta.title")}{" "}
            <span className="text-gradient-gold">{t("cta.titleHighlight")}</span> ?
          </h2>
          <p className="text-muted-foreground text-lg mb-12">{t("cta.description")}</p>

          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 space-y-4"
            >
              <Input
                placeholder={t("cta.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base"
              />
              <Input
                type="tel"
                placeholder={t("cta.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base"
              />
              <Input
                type="email"
                placeholder={t("cta.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base"
              />
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground text-base">
                  <SelectValue placeholder={t("cta.profilePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {profileOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="hero" size="lg" className="w-full text-base py-6 rounded-xl">
                {t("cta.submit")}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <p className="text-xs text-muted-foreground">{t("cta.terms")}</p>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2 text-foreground">{t("cta.successHeading")}</h3>
              <p className="text-muted-foreground">{t("cta.successMessage")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
