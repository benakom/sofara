import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { UserPlus, FileSpreadsheet, Link, Facebook, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const methods = [
  { icon: UserPlus, titleFr: "Saisie manuelle", titleEn: "Manual Entry", descFr: "Ajoutez un lead à la fois avec un formulaire", descEn: "Add one lead at a time with a form", path: "/dashboard/pipeline" },
  { icon: FileSpreadsheet, titleFr: "Import CSV/XLSX", titleEn: "Import CSV/XLSX", descFr: "Uploadez un fichier avec vos leads", descEn: "Upload a file with your leads", path: null },
  { icon: Link, titleFr: "Google Sheets", titleEn: "Google Sheets", descFr: "Connectez votre Google Sheet", descEn: "Connect your Google Sheet", path: null },
  { icon: Facebook, titleFr: "Facebook Ads", titleEn: "Facebook Ads", descFr: "Importez depuis vos campagnes Facebook", descEn: "Import from your Facebook campaigns", path: null },
];

const ImportLeads = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-extrabold dash-text tracking-tight mb-1">{lang === "ar" ? "استيراد العملاء" : "Import Leads"}</h1>
      <p className="dash-muted-text text-xs mt-0.5 mb-6">{lang === "ar" ? "قم بتحميل عملائك بطرق مختلفة" : "Upload your leads through different methods"}</p>

      <div className="bg-[hsl(var(--dash-accent)/.08)] border border-[hsl(var(--dash-accent)/.25)] rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[hsl(var(--dash-accent-ink))] mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-[hsl(var(--dash-accent-ink))] text-sm flex items-center gap-2">
              ⚠️ {lang === "ar" ? "Déclaration obligatoire" : "Mandatory Declaration"}
            </h3>
            <p className="text-sm text-[hsl(var(--dash-fg))] mt-2 leading-relaxed">
              {lang === "ar"
                ? "En uploadant ces leads, j'atteste sur l'honneur qu'il s'agit de mes propres leads, obtenus de manière licite et conforme aux réglementations en vigueur (RGPD, PDPL). Je certifie disposer du consentement explicite de chaque contact pour le partage de leurs informations. Je reconnais également que Sofara se réserve le droit de contacter directement les leads afin de vérifier que le consentement a bien été donné pour l'ambassadeur."
                : "By uploading these leads, I certify on my honor that these are my own leads, obtained lawfully and in compliance with current regulations (GDPR, PDPL). I certify that I have the explicit consent of each contact for sharing their information. I also acknowledge that Sofara reserves the right to directly contact the leads to verify that consent has been properly given for the ambassador."}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="accept" checked={accepted} onCheckedChange={(v) => setAccepted(!!v)} />
              <label htmlFor="accept" className="text-sm text-[hsl(var(--dash-accent-ink))] font-medium cursor-pointer">
                {lang === "ar" ? "J'accepte les conditions ci-dessus" : "I accept the above conditions"}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => accepted && m.path && navigate(m.path)}
            className={`dash-card rounded-2xl p-6 transition-all cursor-pointer group ${
              accepted ? "hover:shadow-md hover:border-[hsl(var(--dash-accent)/.3)]" : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-3 rounded-xl bg-[hsl(var(--dash-accent)/.12)] w-fit mb-4">
              <m.icon className="w-6 h-6 text-[hsl(var(--dash-accent-ink))] group-hover:text-[hsl(var(--dash-accent-ink))] transition-colors" />
            </div>
            <h3 className="font-display font-semibold dash-text">{lang === "ar" ? m.titleFr : m.titleEn}</h3>
            <p className="text-base sm:text-sm dash-muted-text mt-1">{lang === "ar" ? m.descFr : m.descEn}</p>
            <p className="text-base sm:text-sm text-[hsl(var(--dash-accent-ink))] mt-3 group-hover:text-[hsl(var(--dash-accent-ink))] transition-colors font-medium">
              {lang === "ar" ? "Commencer →" : "Start →"}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImportLeads;
