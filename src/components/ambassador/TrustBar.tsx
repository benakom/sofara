import { useLanguage } from "@/i18n/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();
  return (
    <section className="py-8 sm:py-10 border-y border-border/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-20" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs sm:text-sm text-muted-foreground">{t("trust.liveAgents")}</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="text-primary font-semibold">RERA</span> {t("trust.licensed")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="text-primary font-semibold">0%</span> {t("trust.fees")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
