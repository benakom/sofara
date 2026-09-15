import { ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";
import ProBenefits from "./ProBenefits";
import ProPricing from "./ProPricing";

/** Renders Pro-only pages for Pro members; shows the upgrade offer to everyone else. */
const RequirePro = ({ children }: { children: ReactNode }) => {
  const { isPro, loading } = useSubscription();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const fr = lang === "ar";

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-accent))]" /></div>;
  }
  if (isPro) return <>{children}</>;

  return (
    <div className="max-w-3xl">
      <div className="rounded-3xl bg-[hsl(0,0%,7%)] p-6 sm:p-8 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-[#D2F34C]/15 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-[#D2F34C]" />
        </div>
        <h1 className="text-2xl font-display font-extrabold text-white mb-2">
          {fr ? "Cet outil est réservé aux membres Sofara Pro" : "This tool is reserved for Sofara Pro members"}
        </h1>
        <p className="text-sm text-white/60 mb-6">
          {fr ? "Débloquez-le, ainsi que tous les outils Pro, pour 99 $ par mois ou 990 $ par an (2 mois offerts)." : "Unlock it, along with every Pro tool, for $99 per month or $990 per year (2 months free)."}
        </p>
        <div className="mb-6"><ProBenefits lang={lang} compact limit={6} /></div>
        <ProPricing lang={lang} />
        <button onClick={() => navigate("/dashboard/pro")} className="text-xs text-[#D2F34C] hover:underline mt-4">
          {fr ? "Voir la page Sofara Pro →" : "See the Sofara Pro page →"}
        </button>
      </div>
    </div>
  );
};

export default RequirePro;
