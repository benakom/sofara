import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { AlertTriangle, CheckCircle, Lock, Star, ShieldCheck } from "lucide-react";

const kycDocs = [
  { titleFr: "Passeport valide (copie couleur)", titleEn: "Valid Passport (color copy)", required: true },
  { titleFr: "Justificatif de domicile (< 3 mois)", titleEn: "Proof of Address (< 3 months)", required: true },
  { titleFr: "Relevé bancaire (< 3 mois)", titleEn: "Bank Statement (< 3 months)", required: true },
  { titleFr: "Source of funds declaration", titleEn: "Source of funds declaration", required: true },
  { titleFr: "Formulaire de réservation signé", titleEn: "Signed Reservation Form", required: true },
  { titleFr: "Power of Attorney (si applicable)", titleEn: "Power of Attorney (if applicable)", required: false },
];

const amlModules = [
  { titleFr: "Qu'est-ce que le blanchiment d'argent ?", titleEn: "What is money laundering?", pts: 10, completed: false },
  { titleFr: "Quels sont les signaux d'alerte (red flags) ?", titleEn: "What are the warning signs (red flags)?", pts: 15, completed: false },
  { titleFr: "Obligations de déclaration à Dubai", titleEn: "Declaration obligations in Dubai", pts: 20, completed: false },
  { titleFr: "Cas pratiques : identifier les risques", titleEn: "Case studies: identifying risks", pts: 25, completed: false },
];

const KycAml = () => {
  const { lang } = useLanguage();
  const totalPts = amlModules.reduce((a, m) => a + m.pts, 0);
  const earnedPts = amlModules.filter(m => m.completed).reduce((a, m) => a + m.pts, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-foreground mb-1">KYC & AML</h1>
      <p className="text-muted-foreground text-sm mb-6">{lang === "fr" ? "Conformité et vérification de vos leads" : "Compliance and verification of your leads"}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Checklist */}
        <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5" /> Checklist KYC
          </h2>
          <p className="text-sm text-muted-foreground mb-5">{lang === "fr" ? "Documents requis pour chaque lead avant le closing" : "Required documents for each lead before closing"}</p>
          <div className="space-y-3">
            {kycDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-foreground">{lang === "fr" ? doc.titleFr : doc.titleEn}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${doc.required ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>
                  {doc.required ? (lang === "fr" ? "Obligatoire" : "Required") : "Optional"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AML Briefing */}
        <div className="bg-card/50 border border-primary/20 rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Briefing AML
          </h2>
          <p className="text-sm text-muted-foreground mb-3">{lang === "fr" ? "Complétez les modules AML pour débloquer votre certification" : "Complete AML modules to unlock your certification"}</p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(earnedPts / totalPts) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mb-5">{earnedPts}/{totalPts} pts</p>
          <div className="space-y-3">
            {amlModules.map((mod, i) => (
              <div key={i} className={`rounded-xl p-4 border transition-all ${mod.completed ? "bg-green-500/5 border-green-500/30" : "bg-secondary/30 border-border/30"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {mod.completed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm font-medium text-foreground">{lang === "fr" ? mod.titleFr : mod.titleEn}</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">+{mod.pts} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KycAml;
