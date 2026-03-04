import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { GraduationCap, Search, BookOpen, Flame, Zap, Trophy } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const categories = [
  { labelFr: "Tout", labelEn: "All", icon: "🎓", id: "all" },
  { labelFr: "Immobilier Dubai", labelEn: "Dubai Real Estate", icon: "🏙️", id: "dubai" },
  { labelFr: "Techniques de vente", labelEn: "Sales Techniques", icon: "🎯", id: "sales" },
  { labelFr: "Conformité", labelEn: "Compliance", icon: "🛡️", id: "compliance" },
  { labelFr: "Fiscalité", labelEn: "Taxation", icon: "🧾", id: "tax" },
];

const courses = [
  {
    titleFr: "Pourquoi Dubai ? Les avantages clés",
    titleEn: "Why Dubai? Key Advantages",
    descFr: "Découvrez pourquoi Dubai est la destination #1 pour l'investissement immobilier : fiscalité,...",
    descEn: "Discover why Dubai is the #1 destination for real estate investment: taxation,...",
    duration: "1h 20min",
    students: 342,
    xp: 200,
    level: "Débutant",
    category: "dubai",
    completed: false,
  },
  {
    titleFr: "Off-plan vs Ready : guide complet",
    titleEn: "Off-plan vs Ready: Complete Guide",
    descFr: "Comprenez les différences entre off-plan et ready, les risques, les plans de paiement...",
    descEn: "Understand the differences between off-plan and ready, risks, payment plans...",
    duration: "1h 45min",
    students: 289,
    xp: 250,
    level: "Intermédiaire",
    category: "dubai",
    completed: false,
  },
];

const Academy = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              🎓 Sofara Academy
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {lang === "fr" ? "Votre plateforme de formation — apprenez, testez vos connaissances, progressez." : "Your training platform — learn, test your knowledge, progress."}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-green-500" /><span className="font-bold text-foreground">0</span><span className="text-muted-foreground">{lang === "fr" ? "Terminés" : "Completed"}</span></div>
            <div className="flex items-center gap-1"><Flame className="w-4 h-4 text-destructive" /><span className="font-bold text-foreground">0</span><span className="text-muted-foreground">{lang === "fr" ? "En cours" : "In progress"}</span></div>
            <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="font-bold text-foreground">0</span><span className="text-muted-foreground">XP</span></div>
            <div className="flex items-center gap-1"><Trophy className="w-4 h-4 text-primary" /><span className="text-muted-foreground">Niv. 1</span></div>
          </div>
        </div>
        <div className="mt-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={lang === "fr" ? "Rechercher un cours..." : "Search a course..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-foreground text-background"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.icon} {lang === "fr" ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.filter(c => activeCategory === "all" || c.category === activeCategory).map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden hover:border-border transition-colors cursor-pointer group"
          >
            <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
              <GraduationCap className="w-12 h-12 text-muted-foreground/30" />
              <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${
                course.level === "Débutant" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
              }`}>
                {course.level}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {lang === "fr" ? course.titleFr : course.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                {lang === "fr" ? course.descFr : course.descEn}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span>⏱ {course.duration}</span>
                <span>👥 {course.students}</span>
                <span>⚡ +{course.xp} XP</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Academy;
