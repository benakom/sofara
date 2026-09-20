import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { FileSpreadsheet, Mail } from "lucide-react";
import NewLeadForm from "@/components/dashboard/NewLeadForm";
import { fr } from "@/lib/dashboard-data";

/** Submit a lead: consent-first policy, then the full intake form. */
const ImportLeads = () => {
  const { lang } = useLanguage();
  const isFr = fr(lang);
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-extrabold dash-text tracking-tight mb-1">{isFr ? "Soumettre un lead" : "Submit a lead"}</h1>
      <p className="dash-muted-text text-xs mt-0.5 mb-6">
        {isFr
          ? "Un lead complet et consenti est contacté sous 24 heures. Plus vous donnez de contexte, plus vite notre conseiller avance."
          : "A complete, consented lead is contacted within 24 hours. The more context you give, the faster our advisor moves."}
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <NewLeadForm onSubmitted={() => navigate("/dashboard/pipeline")} />
        </div>
        <aside className="xl:col-span-2 space-y-4">
          <div className="dash-card rounded-2xl p-5">
            <h3 className="font-display font-semibold dash-text text-[14px]">{isFr ? "Ce qui se passe ensuite" : "What happens next"}</h3>
            <ol className="mt-3 space-y-2 text-[13px] dash-text">
              {(isFr
                ? ["Notre conseiller appelle le lead sous 24 heures, dans sa langue.", "Il confirme d'abord que la personne a bien accepté d'être contactée via vous.", "Vous suivez chaque étape dans Suivi des leads et recevez une notification à chaque changement.", "Votre commission est acquise une fois le SPA signé et l'apport payé avec les frais DLD, puis versée sous 7 jours après le paiement du promoteur."]
                : ["Our advisor calls the lead within 24 hours, in their language.", "They first confirm the person agreed to be contacted through you.", "You follow every step in Lead tracking and get notified at each change.", "Your commission is earned once the SPA is signed and the down payment with DLD fees is paid, then transferred within 7 days of the developer's payment."]
              ).map((s, i) => (
                <li key={i} className="flex gap-2"><span className="w-5 h-5 rounded-full bg-[hsl(var(--dash-accent)/.15)] text-[hsl(var(--dash-accent-ink))] text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="leading-snug">{s}</span></li>
              ))}
            </ol>
          </div>
          <div className="dash-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2"><FileSpreadsheet className="w-4 h-4 text-[hsl(var(--dash-accent-ink))]" /><h3 className="font-display font-semibold dash-text text-[14px]">{isFr ? "Plusieurs leads à la fois ?" : "Several leads at once?"}</h3></div>
            <p className="text-[12px] dash-muted-text leading-relaxed">
              {isFr
                ? "Les imports en masse (fichier, Google Sheets, campagnes publicitaires) passent par une revue manuelle du consentement. Écrivez-nous avec la source des leads et nous ouvrons l'import pour votre compte."
                : "Bulk imports (file, Google Sheets, ad campaigns) go through a manual consent review. Write to us with the source of the leads and we open the import for your account."}
            </p>
            <a href="mailto:hello@sofara.io?subject=Bulk%20lead%20import" className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-[hsl(var(--dash-accent-ink))] hover:underline"><Mail className="w-3.5 h-3.5" /> hello@sofara.io</a>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default ImportLeads;
