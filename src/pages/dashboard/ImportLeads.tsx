import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { UserPlus, FileSpreadsheet, Link, Facebook, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const methods = [
  { icon: UserPlus, titleFr: "Saisie manuelle", titleEn: "Manual Entry", descFr: "Ajoutez un lead à la fois avec un formulaire", descEn: "Add one lead at a time with a form" },
  { icon: FileSpreadsheet, titleFr: "Import CSV/XLSX", titleEn: "Import CSV/XLSX", descFr: "Uploadez un fichier avec vos leads", descEn: "Upload a file with your leads" },
  { icon: Link, titleFr: "Google Sheets", titleEn: "Google Sheets", descFr: "Connectez votre Google Sheet", descEn: "Connect your Google Sheet" },
  { icon: Facebook, titleFr: "Facebook Ads", titleEn: "Facebook Ads", descFr: "Importez depuis vos campagnes Facebook", descEn: "Import from your Facebook campaigns" },
];

const ImportLeads = () => {
  const { lang } = useLanguage();
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-foreground mb-1">Import Leads</h1>
      <p className="text-muted-foreground text-sm mb-6">{lang === "fr" ? "Uploadez vos leads par différents moyens" : "Upload your leads through different methods"}</p>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              ⚠️ {lang === "fr" ? "Déclaration obligatoire" : "Mandatory Declaration"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {lang === "fr"
                ? "En uploadant ces leads, j'atteste sur l'honneur qu'il s'agit de mes propres leads, obtenus de manière licite et conforme aux réglementations en vigueur (RGPD, PDPL). Je certifie disposer du consentement explicite de chaque contact pour le partage de leurs informations."
                : "By uploading these leads, I certify on my honor that these are my own leads, obtained lawfully and in compliance with current regulations (GDPR, PDPL). I certify that I have the explicit consent of each contact for sharing their information."}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="accept" checked={accepted} onCheckedChange={(v) => setAccepted(!!v)} />
              <label htmlFor="accept" className="text-sm text-foreground font-medium cursor-pointer">
                {lang === "fr" ? "J'accepte les conditions ci-dessus" : "I accept the above conditions"}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Methods grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-card/50 border border-border/50 rounded-2xl p-6 transition-all cursor-pointer group ${
              accepted ? "hover:border-primary/40" : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-3 rounded-xl bg-secondary/50 w-fit mb-4">
              <m.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-display font-semibold text-foreground">{lang === "fr" ? m.titleFr : m.titleEn}</h3>
            <p className="text-sm text-muted-foreground mt-1">{lang === "fr" ? m.descFr : m.descEn}</p>
            <p className="text-sm text-muted-foreground mt-3 group-hover:text-primary transition-colors">
              {lang === "fr" ? "Commencer →" : "Start →"}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImportLeads;
