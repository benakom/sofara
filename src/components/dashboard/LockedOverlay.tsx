import { Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const LockedOverlay = () => {
  const { lang } = useLanguage();
  return (
    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="text-center space-y-2">
        <Lock className="w-6 h-6 dash-muted-text mx-auto" />
        <p className="text-sm font-medium dash-muted-text">
          {lang === "ar" ? "متاح بعد التفعيل" : "Available after activation"}
        </p>
      </div>
    </div>
  );
};

export default LockedOverlay;
