import { useLanguage } from "@/i18n/LanguageContext";

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-lg font-bold text-foreground tracking-tight">
          Sofara
        </div>
        <p className="text-sm text-muted-foreground">{t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default FooterSection;
