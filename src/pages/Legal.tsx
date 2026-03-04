import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

type LegalSection = "terms" | "privacy" | "cookies";

const Legal = () => {
  const { section } = useParams<{ section: string }>();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const currentSection = (section || "terms") as LegalSection;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const titles: Record<LegalSection, string> = {
    terms: t("legal.terms.title"),
    privacy: t("legal.privacy.title"),
    cookies: t("legal.cookies.title"),
  };

  const sections: LegalSection[] = ["terms", "privacy", "cookies"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("legal.back")}
          </button>
          <a href="/" className="font-display text-2xl font-bold text-foreground tracking-tight">
            sofara
          </a>
          <div className="flex items-center gap-0.5">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded-md text-sm transition-all duration-200 ${
                  lang === l
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "fr" ? "🇫🇷" : "🇬🇧"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-10 bg-secondary/50 rounded-full p-1 w-fit">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/legal/${s}`)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                currentSection === s
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {titles[s]}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={currentSection + lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="prose prose-sm max-w-none"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            {titles[currentSection]}
          </h1>
          <div
            className="text-muted-foreground leading-relaxed space-y-6 [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: t(`legal.${currentSection}.content`) }}
          />
        </motion.div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground/60">
            {t("legal.lastUpdated")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
