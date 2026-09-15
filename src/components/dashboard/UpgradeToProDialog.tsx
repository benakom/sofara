import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import ProBenefits from "./ProBenefits";
import ProPricing from "./ProPricing";

interface UpgradeToProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeRequested?: () => void;
}

/** Sofara Pro upgrade dialog: key benefits + plan choice + Stripe checkout. */
const UpgradeToProDialog = ({ open, onOpenChange }: UpgradeToProDialogProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const fr = lang === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[hsl(0,0%,7%)] border-white/10 text-white p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2F34C]/15 border border-[#D2F34C]/30 w-fit mb-3">
              <Crown className="w-3.5 h-3.5 text-[#D2F34C]" />
              <span className="text-[#D2F34C] text-[11px] font-semibold uppercase tracking-wider">Sofara Pro</span>
            </div>
            <DialogTitle className="text-2xl font-display font-extrabold text-white">
              {fr ? "Passez au niveau supérieur" : "Level up your ambassador space"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {fr
                ? "CRM Oleadoo, WhatsApp AI, campagnes marketing IA, agent IA et commission majorée. Tout ce qu'il faut pour qualifier vos leads, présenter les projets et closer plus."
                : "Oleadoo CRM, WhatsApp AI, AI marketing campaigns, AI agent and boosted commission. Everything you need to qualify leads, present projects and close more."}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-6">
            <ProBenefits lang={lang} compact limit={8} />
            <button onClick={() => { onOpenChange(false); navigate("/dashboard/pro"); }} className="text-xs text-[#D2F34C] hover:underline mt-3">
              {fr ? "Voir tous les avantages →" : "See all benefits →"}
            </button>
          </div>

          <ProPricing lang={lang} onCheckoutStart={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProDialog;
