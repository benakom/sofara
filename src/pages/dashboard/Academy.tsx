import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { GraduationCap, BookOpen, Flame, Zap, Trophy, Play, Clock, Users, Star, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";

const categories = [
  { labelFr: "Tout", labelEn: "All", icon: "🎓", id: "all" },
  { labelFr: "Immobilier Dubai", labelEn: "Dubai Real Estate", icon: "🏙️", id: "dubai" },
  { labelFr: "Techniques de vente", labelEn: "Sales Techniques", icon: "🎯", id: "sales" },
  { labelFr: "Conformité", labelEn: "Compliance", icon: "🛡️", id: "compliance" },
];

const courses = [
  {
    titleFr: "Pourquoi Dubai ? Les avantages clés", titleEn: "Why Dubai? Key Advantages",
    descFr: "Découvrez pourquoi Dubai est la destination #1 pour l'investissement immobilier.", descEn: "Discover why Dubai is the #1 destination for real estate investment.",
    duration: "1h 20min", students: 342, xp: 200, level: "Débutant", levelEn: "Beginner", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=340&fit=crop",
    lessons: 8, progress: 0,
  },
  {
    titleFr: "Off-plan vs Ready : guide complet", titleEn: "Off-plan vs Ready: Complete Guide",
    descFr: "Comprenez les différences, risques et plans de paiement.", descEn: "Understand differences, risks and payment plans.",
    duration: "1h 45min", students: 289, xp: 250, level: "Intermédiaire", levelEn: "Intermediate", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1582407947092-50b8c3e3c3c1?w=600&h=340&fit=crop",
    lessons: 12, progress: 0,
  },
  {
    titleFr: "Techniques de closing immobilier", titleEn: "Real Estate Closing Techniques",
    descFr: "Maîtrisez l'art du closing avec des scripts éprouvés.", descEn: "Master the art of closing with proven scripts.",
    duration: "2h 10min", students: 456, xp: 350, level: "Avancé", levelEn: "Advanced", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=340&fit=crop",
    lessons: 15, progress: 0,
  },
  {
    titleFr: "Gérer les objections clients", titleEn: "Handling Client Objections",
    descFr: "Transformez les objections en opportunités de vente.", descEn: "Turn objections into sales opportunities.",
    duration: "1h 30min", students: 198, xp: 220, level: "Intermédiaire", levelEn: "Intermediate", category: "sales",
    thumbnail: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=340&fit=crop",
    lessons: 10, progress: 0,
  },
  {
    titleFr: "KYC & AML : les fondamentaux", titleEn: "KYC & AML: Fundamentals",
    descFr: "Apprenez les bases de la conformité anti-blanchiment.", descEn: "Learn the basics of anti-money laundering compliance.",
    duration: "1h 00min", students: 512, xp: 180, level: "Débutant", levelEn: "Beginner", category: "compliance",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=340&fit=crop",
    lessons: 6, progress: 0,
  },
  {
    titleFr: "Golden Visa UAE : tout savoir", titleEn: "UAE Golden Visa: Everything You Need",
    descFr: "Tout sur le Golden Visa et comment accompagner vos clients.", descEn: "Everything about the Golden Visa and how to guide your clients.",
    duration: "0h 50min", students: 387, xp: 150, level: "Débutant", levelEn: "Beginner", category: "dubai",
    thumbnail: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=340&fit=crop",
    lessons: 5, progress: 0,
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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-xl font-display font-bold dash-text">🎓 Sofara Academy</h1>
            <p className="dash-muted-text text-sm mt-0.5">{lang === "fr" ? "Apprenez, progressez, devenez expert." : "Learn, progress, become an expert."}</p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] dash-text hover:shadow-sm"
                }`}>
                {cat.icon} {lang === "fr" ? cat.labelFr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="dash-card rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                {/* Thumbnail */}
                <div className="relative h-36 overflow-hidden">
                  <img src={course.thumbnail} alt={lang === "fr" ? course.titleFr : course.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                <div className="p-3.5">
                  <h3 className="text-sm font-display font-semibold dash-text line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                    {lang === "fr" ? course.titleFr : course.titleEn}
                  </h3>
                  <p className="text-xs dash-muted-text mt-1 line-clamp-2">{lang === "fr" ? course.descFr : course.descEn}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px] dash-muted-text">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} {lang === "fr" ? "leçons" : "lessons"}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                    </div>
                    <span className="flex items-center gap-1 font-medium text-amber-500"><Zap className="w-3 h-3" /> +{course.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gamification sidebar */}
        <div className="lg:w-64 shrink-0 space-y-4">
          {/* XP & Level card */}
          <div className="dash-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium dash-text">{lang === "fr" ? "Niveau" : "Level"} {userLevel}</p>
                <p className="text-[10px] dash-muted-text">{userXP}/{nextLevelXP} XP</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(userXP / nextLevelXP) * 100}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="dash-card rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider">{lang === "fr" ? "Progression" : "Progress"}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs dash-muted-text"><BookOpen className="w-3.5 h-3.5 text-emerald-500" /> {lang === "fr" ? "Terminés" : "Completed"}</div>
              <span className="text-sm font-bold dash-text">{completedCourses}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs dash-muted-text"><Flame className="w-3.5 h-3.5 text-orange-500" /> {lang === "fr" ? "En cours" : "In progress"}</div>
              <span className="text-sm font-bold dash-text">{inProgressCourses}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs dash-muted-text"><Zap className="w-3.5 h-3.5 text-amber-500" /> XP {lang === "fr" ? "gagnés" : "earned"}</div>
              <span className="text-sm font-bold dash-text">{userXP}</span>
            </div>
          </div>

          {/* Achievements */}
          <div className="dash-card rounded-xl p-4">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-3">{lang === "fr" ? "Badges" : "Badges"}</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "🏅", label: lang === "fr" ? "1er cours" : "1st course", unlocked: false },
                { icon: "🔥", label: lang === "fr" ? "Série 7j" : "7-day streak", unlocked: false },
                { icon: "⭐", label: "500 XP", unlocked: false },
                { icon: "🎯", label: lang === "fr" ? "Quiz parfait" : "Perfect quiz", unlocked: false },
                { icon: "🏆", label: "Top 10", unlocked: false },
                { icon: "💎", label: lang === "fr" ? "Expert" : "Expert", unlocked: false },
              ].map((badge, i) => (
                <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${badge.unlocked ? "bg-amber-50" : "bg-gray-50 opacity-40"}`}>
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-[9px] dash-muted-text leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard teaser */}
          <div className="dash-card rounded-xl p-4">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" /> {lang === "fr" ? "Classement" : "Leaderboard"}
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map(rank => (
                <div key={rank} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-500 w-4">{rank}.</span>
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                  <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
            <p className="text-[10px] dash-muted-text mt-2 text-center">{lang === "fr" ? "Bientôt disponible" : "Coming soon"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Academy;
