import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { GraduationCap, BookOpen, Flame, Zap, Trophy, Play, Clock, Users, Star } from "lucide-react";
import { useState } from "react";

const categories = [
  { labelFr: "Tout", labelEn: "All", icon: "🎓", id: "all" },
  { labelFr: "Immobilier Dubai", labelEn: "Dubai Real Estate", icon: "🏙️", id: "dubai" },
  { labelFr: "Techniques de vente", labelEn: "Sales Techniques", icon: "🎯", id: "sales" },
  { labelFr: "Conformité", labelEn: "Compliance", icon: "🛡️", id: "compliance" },
];

const courses = [
  {
    titleFr: "Dubai Real Estate 101", titleEn: "Dubai Real Estate 101",
    descFr: "Les bases de l'immobilier à Dubai : marché, acteurs, opportunités.", descEn: "The basics of Dubai real estate: market, players, opportunities.",
    duration: "1h 20min", students: 342, xp: 200, level: "Débutant", levelEn: "Beginner", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=340&fit=crop",
    lessons: 8, progress: 0,
  },
  {
    titleFr: "Off-Plan vs Ready : choisir selon le profil", titleEn: "Off-Plan vs Ready: Choose by Profile",
    descFr: "Comprenez les différences et orientez vos clients selon leur profil investisseur.", descEn: "Understand differences and guide clients based on their investor profile.",
    duration: "1h 45min", students: 289, xp: 250, level: "Intermédiaire", levelEn: "Intermediate", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1582407947092-50b8c3e3c3c1?w=600&h=340&fit=crop",
    lessons: 12, progress: 0,
  },
  {
    titleFr: "Les zones qui vendent le plus (2026)", titleEn: "Top Selling Areas (2026)",
    descFr: "Analyse des zones les plus demandées et rentables à Dubai en 2026.", descEn: "Analysis of the most in-demand and profitable areas in Dubai in 2026.",
    duration: "1h 00min", students: 410, xp: 220, level: "Intermédiaire", levelEn: "Intermediate", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=340&fit=crop",
    lessons: 7, progress: 0,
  },
  {
    titleFr: "Comprendre le DLD, Oqood & Title Deed", titleEn: "Understanding DLD, Oqood & Title Deed",
    descFr: "Tout sur les frais DLD, l'Oqood et le Title Deed pour accompagner vos clients.", descEn: "Everything about DLD fees, Oqood and Title Deed to guide your clients.",
    duration: "0h 50min", students: 387, xp: 180, level: "Débutant", levelEn: "Beginner", category: "compliance",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=340&fit=crop",
    lessons: 6, progress: 0,
  },
  {
    titleFr: "Lire un deal : prix/sqft, frais, rentabilité", titleEn: "Reading a Deal: Price/Sqft, Fees, ROI",
    descFr: "Apprenez à décrypter un deal immobilier : prix au pied carré, frais cachés et rentabilité.", descEn: "Learn to decode a real estate deal: price per sqft, hidden fees and profitability.",
    duration: "1h 15min", students: 315, xp: 240, level: "Intermédiaire", levelEn: "Intermediate", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=340&fit=crop",
    lessons: 9, progress: 0,
  },
  {
    titleFr: "Payment Plans : 60/40, 50/50, Post-Handover", titleEn: "Payment Plans: 60/40, 50/50, Post-Handover",
    descFr: "Maîtrisez les différents plans de paiement et sachez les expliquer clairement.", descEn: "Master the different payment plans and explain them clearly.",
    duration: "1h 10min", students: 378, xp: 210, level: "Débutant", levelEn: "Beginner", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop",
    lessons: 8, progress: 0,
  },
  {
    titleFr: "Qualification & Scoring des leads", titleEn: "Lead Qualification & Scoring",
    descFr: "Qualifiez vos leads efficacement via WhatsApp et appels. Scripts inclus.", descEn: "Qualify your leads efficiently via WhatsApp and calls. Scripts included.",
    duration: "1h 30min", students: 198, xp: 260, level: "Intermédiaire", levelEn: "Intermediate", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=340&fit=crop",
    lessons: 10, progress: 0,
  },
  {
    titleFr: "Pitch & Storytelling : présenter une opportunité", titleEn: "Pitch & Storytelling: Present an Opportunity",
    descFr: "Construisez un pitch percutant et racontez l'histoire d'un projet immobilier.", descEn: "Build a compelling pitch and tell the story of a real estate project.",
    duration: "1h 25min", students: 267, xp: 280, level: "Intermédiaire", levelEn: "Intermediate", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=340&fit=crop",
    lessons: 11, progress: 0,
  },
  {
    titleFr: "Objections & Négociation : scripts et relances", titleEn: "Objections & Negotiation: Scripts & Follow-ups",
    descFr: "Transformez les objections en opportunités avec des scripts éprouvés.", descEn: "Turn objections into opportunities with proven scripts.",
    duration: "2h 10min", students: 456, xp: 350, level: "Avancé", levelEn: "Advanced", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=600&h=340&fit=crop",
    lessons: 15, progress: 0,
  },
  {
    titleFr: "Closing : booking, suivi, handoff broker & KYC", titleEn: "Closing: Booking, Follow-up, Broker Handoff & KYC",
    descFr: "Maîtrisez le closing complet : du booking au handoff broker et la KYC readiness.", descEn: "Master the full closing: from booking to broker handoff and KYC readiness.",
    duration: "2h 00min", students: 512, xp: 400, level: "Avancé", levelEn: "Advanced", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=340&fit=crop",
    lessons: 14, progress: 0,
  },
];

const levelColor: Record<string, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Intermédiaire": "bg-amber-100 text-amber-700",
  "Avancé": "bg-rose-100 text-rose-700",
};

const Academy = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const userXP = 0;
  const userLevel = 1;
  const nextLevelXP = 500;
  const completedCourses = 0;
  const inProgressCourses = 0;

  const filtered = courses.filter(c => activeCategory === "all" || c.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-4 lg:mb-5">
            <h1 className="text-lg lg:text-xl font-display font-bold dash-text">🎓 Sofara Academy</h1>
            <p className="dash-muted-text text-xs lg:text-sm mt-0.5">{lang === "fr" ? "Apprenez, progressez, devenez expert." : "Learn, progress, become an expert."}</p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:mb-5 -mx-1 px-1 scrollbar-none">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-full text-[11px] lg:text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] dash-text hover:shadow-sm"
                }`}>
                {cat.icon} {lang === "fr" ? cat.labelFr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {filtered.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="dash-card rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                {/* Thumbnail */}
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img src={course.thumbnail} alt={lang === "fr" ? course.titleFr : course.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${levelColor[course.level] || "bg-gray-100 text-gray-700"}`}>
                      {lang === "fr" ? course.level : course.levelEn}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-[hsl(var(--primary))] transition-colors">
                      <Play className="w-3.5 h-3.5 text-gray-700 group-hover:text-white transition-colors ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </div>
                </div>
                {/* Info */}
                <div className="p-3 lg:p-3.5">
                  <h3 className="text-[13px] lg:text-sm font-display font-semibold dash-text line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors leading-snug">
                    {lang === "fr" ? course.titleFr : course.titleEn}
                  </h3>
                  <p className="text-[11px] lg:text-xs dash-muted-text mt-1 line-clamp-2">{lang === "fr" ? course.descFr : course.descEn}</p>
                  <div className="flex items-center justify-between mt-2.5 lg:mt-3 text-[10px] lg:text-[11px] dash-muted-text">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                    </div>
                    <span className="flex items-center gap-1 font-medium text-amber-500"><Zap className="w-3 h-3" /> +{course.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gamification sidebar - horizontal on mobile, vertical on desktop */}
        <div className="lg:w-64 shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
            {/* XP & Level card */}
            <div className="dash-card rounded-xl p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <div className="p-1.5 lg:p-2 rounded-lg bg-amber-50">
                  <Trophy className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[11px] lg:text-xs font-medium dash-text">{lang === "fr" ? "Niveau" : "Level"} {userLevel}</p>
                  <p className="text-[9px] lg:text-[10px] dash-muted-text">{userXP}/{nextLevelXP} XP</p>
                </div>
              </div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(userXP / nextLevelXP) * 100}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="dash-card rounded-xl p-3 lg:p-4 space-y-2 lg:space-y-3">
              <h3 className="text-[10px] lg:text-xs font-semibold dash-text uppercase tracking-wider">{lang === "fr" ? "Progression" : "Progress"}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs dash-muted-text"><BookOpen className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-emerald-500" /> {lang === "fr" ? "Terminés" : "Done"}</div>
                <span className="text-xs lg:text-sm font-bold dash-text">{completedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs dash-muted-text"><Flame className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-orange-500" /> {lang === "fr" ? "En cours" : "Active"}</div>
                <span className="text-xs lg:text-sm font-bold dash-text">{inProgressCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs dash-muted-text"><Zap className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-amber-500" /> XP</div>
                <span className="text-xs lg:text-sm font-bold dash-text">{userXP}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="dash-card rounded-xl p-3 lg:p-4 col-span-2 lg:col-span-1">
              <h3 className="text-[10px] lg:text-xs font-semibold dash-text uppercase tracking-wider mb-2 lg:mb-3">{lang === "fr" ? "Badges" : "Badges"}</h3>
              <div className="grid grid-cols-6 lg:grid-cols-3 gap-1.5 lg:gap-2">
                {[
                  { icon: "🏅", label: lang === "fr" ? "1er cours" : "1st course", unlocked: false },
                  { icon: "🔥", label: lang === "fr" ? "Série 7j" : "7-day streak", unlocked: false },
                  { icon: "⭐", label: "500 XP", unlocked: false },
                  { icon: "🎯", label: lang === "fr" ? "Quiz parfait" : "Perfect quiz", unlocked: false },
                  { icon: "🏆", label: "Top 10", unlocked: false },
                  { icon: "💎", label: "Expert", unlocked: false },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center gap-0.5 lg:gap-1 p-1.5 lg:p-2 rounded-lg text-center ${badge.unlocked ? "bg-amber-50" : "bg-gray-50 opacity-40"}`}>
                    <span className="text-base lg:text-lg">{badge.icon}</span>
                    <span className="text-[8px] lg:text-[9px] dash-muted-text leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Academy;
