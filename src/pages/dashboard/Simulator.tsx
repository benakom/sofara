import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText } from "lucide-react";
import DLDSimulator from "@/components/simulator/DLDSimulator";
import PaymentPlanSimulator from "@/components/simulator/PaymentPlanSimulator";

const DISCLAIMER_FR = "Résultats donnés à titre indicatif et approximatif. Ils peuvent varier selon le projet, le promoteur et les frais réels. Sofara ne garantit pas l'exactitude et recommande de valider avec le promoteur / broker.";
const DISCLAIMER_EN = "Results are indicative and approximate. They may vary depending on the project, developer, and actual fees. Sofara does not guarantee accuracy and recommends validating with the developer / broker.";

const Simulator = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
          {lang === "fr" ? "Simulateurs" : "Simulators"}
        </h1>
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1">
          {lang === "fr"
            ? "Estimez les frais et plans de paiement pour vos clients."
            : "Estimate fees and payment plans for your clients."}
        </p>
      </div>

      <Tabs defaultValue="dld" className="w-full">
        <TabsList className="bg-[hsl(var(--dash-muted))] border border-[hsl(var(--dash-border))] h-10 p-1 rounded-xl">
          <TabsTrigger value="dld" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm gap-2">
            <Calculator className="w-4 h-4" />
            DLD + Service Charges
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm gap-2">
            <FileText className="w-4 h-4" />
            Payment Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dld" className="mt-6">
          <DLDSimulator lang={lang} />
          <Disclaimer text={lang === "fr" ? DISCLAIMER_FR : DISCLAIMER_EN} />
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <PaymentPlanSimulator lang={lang} />
          <Disclaimer text={lang === "fr" ? DISCLAIMER_FR : DISCLAIMER_EN} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Disclaimer = ({ text }: { text: string }) => (
  <div className="mt-6 p-4 rounded-xl border border-amber-200/60 bg-amber-50/80 text-amber-800 text-xs leading-relaxed">
    <span className="font-semibold">⚠️ Disclaimer :</span> {text}
  </div>
);

export default Simulator;
