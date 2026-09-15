import { Bot, MessageCircle, Megaphone, Sparkles, Target, BookOpen, TrendingUp, Calculator, CalendarDays, Scale, Users, Headphones } from "lucide-react";

export const PRO_BENEFITS = [
  { icon: Bot, titleAr: "Oleadoo CRM inclus", titleEn: "Oleadoo CRM included",
    descAr: "Pipeline, relances automatiques, historique complet de chaque lead. Notre CRM immobilier, sans frais supplémentaires.", descEn: "Pipeline, automatic follow-ups, full history of every lead. Our real estate CRM, at no extra cost." },
  { icon: MessageCircle, titleAr: "WhatsApp AI 24/7", titleEn: "WhatsApp AI 24/7",
    descAr: "Un assistant IA répond, qualifie et relance vos leads sur WhatsApp, même quand vous dormez.", descEn: "An AI assistant answers, qualifies and follows up with your leads on WhatsApp, even while you sleep." },
  { icon: Megaphone, titleAr: "Campagnes marketing IA", titleEn: "AI marketing campaigns",
    descAr: "Emails, séquences et posts générés par l'IA pour attirer des investisseurs Dubai en continu.", descEn: "AI-generated emails, sequences and posts to attract Dubai investors continuously." },
  { icon: Sparkles, titleAr: "Agent IA SofarAI", titleEn: "SofarAI agent",
    descAr: "Scripts, objections, roleplay et coaching de closing personnalisés par l'IA.", descEn: "AI-personalized scripts, objection handling, roleplay and closing coaching." },
  { icon: Target, titleAr: "Qualification & scoring des leads", titleEn: "Lead qualification & scoring",
    descAr: "Chaque lead est scoré automatiquement : vous concentrez votre temps sur ceux qui achètent.", descEn: "Every lead is scored automatically so you spend your time on the ones who buy." },
  { icon: BookOpen, titleAr: "Présentation des projets", titleEn: "Project presentations",
    descAr: "Bibliothèque complète : fiches vérifiées, brochures, plans de paiement des meilleurs développeurs.", descEn: "Full library: verified fact sheets, brochures and payment plans from top developers." },
  { icon: TrendingUp, titleAr: "Commission majorée", titleEn: "Boosted commission",
    descAr: "Une commission supplémentaire sur chaque vente conclue en tant que membre Pro.", descEn: "An extra commission on every closing you make as a Pro member." },
  { icon: Calculator, titleAr: "Simulateurs DLD & plans de paiement", titleEn: "DLD & payment plan simulators",
    descAr: "Chiffrez frais, rendement et échéancier en quelques secondes devant votre client.", descEn: "Quote fees, yield and payment schedules in seconds, in front of your client." },
  { icon: Scale, titleAr: "Legal AI", titleEn: "Legal AI",
    descAr: "Analyse IA des contrats et documents (SPA, réservation, RERA) avant signature.", descEn: "AI analysis of contracts and documents (SPA, reservation, RERA) before signing." },
  { icon: CalendarDays, titleAr: "Calendrier & relances", titleEn: "Calendar & follow-ups",
    descAr: "Rendez-vous, visites et rappels centralisés, synchronisés avec votre pipeline.", descEn: "Appointments, viewings and reminders centralized and synced with your pipeline." },
  { icon: Users, titleAr: "Communauté Pro", titleEn: "Pro community",
    descAr: "Échangez avec les meilleurs ambassadeurs, partagez les lancements et les deals.", descEn: "Exchange with top ambassadors, share launches and deals." },
  { icon: Headphones, titleAr: "Support prioritaire", titleEn: "Priority support",
    descAr: "Une ligne directe avec l'équipe Sofara pour vos dossiers en cours.", descEn: "A direct line to the Sofara team for your active deals." },
];

interface ProBenefitsProps {
  lang: string;
  compact?: boolean;
  limit?: number;
}

const ProBenefits = ({ lang, compact = false, limit }: ProBenefitsProps) => {
  const items = limit ? PRO_BENEFITS.slice(0, limit) : PRO_BENEFITS;
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {items.map((b) => (
        <div key={b.titleEn} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-[#D2F34C]/15 flex items-center justify-center">
            <b.icon className="w-4.5 h-4.5 w-[18px] h-[18px] text-[#D2F34C]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">{lang === "ar" ? b.titleAr : b.titleEn}</p>
            {!compact && <p className="text-xs text-white/55 mt-1 leading-relaxed">{lang === "ar" ? b.descAr : b.descEn}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProBenefits;
