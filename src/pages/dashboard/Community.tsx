import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { MessageCircle, Users } from "lucide-react";

const Community = () => {
  const { lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="p-4 rounded-2xl bg-primary/10 mb-6">
        <MessageCircle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">Community</h1>
      <p className="text-muted-foreground text-sm text-center max-w-md">
        {lang === "fr"
          ? "L'espace communautaire sera bientôt disponible. Échangez avec d'autres ambassadeurs, partagez vos expériences et vos succès."
          : "The community space will be available soon. Connect with other ambassadors, share your experiences and successes."}
      </p>
      <div className="flex items-center gap-2 mt-6 text-muted-foreground text-sm">
        <Users className="w-4 h-4" />
        <span>{lang === "fr" ? "Bientôt disponible" : "Coming soon"}</span>
      </div>
    </motion.div>
  );
};

export default Community;
