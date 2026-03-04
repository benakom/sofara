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
];

const courses = [
  {
    titleFr: "Pourquoi Dubai ? Les avantages clés", titleEn: "Why Dubai? Key Advantages",
    descFr: "Découvrez pourquoi Dubai est la destination #1 pour l'investissement immobilier.", descEn: "Discover why Dubai is the #1 destination for real estate investment.",
    duration: "1h 20min", students: 342, xp: 200, level: "Débutant", category: "dubai",
  },
  {
    titleFr: "Off-plan vs Ready : guide complet", titleEn: "Off-plan vs Ready: Complete Guide",
    descFr: "Comprenez les différences entre off-plan et ready, les risques, les plans de paiement.", descEn: "Understand the differences between off-plan and ready, risks, payment plans.",
    duration: "1h 45min", students: 289, xp: 250, level: "Intermédiaire", category: "dubai",
  },
];

const Academy = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dash-card rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold dash-text flex items-center gap-2">🎓 Sofara Academy</h1>
            <p className="dash-muted-text text-sm mt-1">{lang === "fr" ? "Votre plateforme de formation — apprenez, testez vos connaissances, progressez." : "Your training platform — learn, test your knowledge, progress."}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-green-500" /><span className="font-bold dash-text">0</span><span className="dash-muted-text">{lang === "fr" ? "Terminés" : "Completed"}</span></div>
            <div className="flex items-center gap-1"><Flame className="w-4 h-4 text-red-500" /><span className="font-bold dash-text">0</span><span className="dash-muted-text">{lang === "fr" ? "En cours" : "In progress"}</span></div>
            <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="font-bold dash-text">0</span><span className="dash-muted-text">XP</span></div>
            <div className="flex items-center gap-1"><Trophy className="w-4 h-4 text-primary" /><span className="dash-muted-text">Niv. 1</span></div>
          </div>
        </div>
        <div className="mt-4 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dash-muted-text" />
          <Input placeholder={lang === "fr" ? "Rechercher un cours..." : "Search a course..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id ? "bg-gray-900 text-white" : "dash-card dash-text hover:shadow-sm"
            }`}>
            {cat.icon} {lang === "fr" ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.filter(c => activeCategory === "all" || c.category === activeCategory).map((course, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="dash-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            <div className="h-44 bg-gradient-to-br from-primary/10 to-green-500/10 flex items-center justify-center relative">
              <GraduationCap className="w-12 h-12 text-gray-300" />
              <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${
                course.level === "Débutant" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
              }`}>{course.level}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold dash-text group-hover:text-primary transition-colors">{lang === "fr" ? course.titleFr : course.titleEn}</h3>
              <p className="text-sm dash-muted-text mt-1.5 line-clamp-2">{lang === "fr" ? course.descFr : course.descEn}</p>
              <div className="flex items-center gap-4 mt-4 text-xs dash-muted-text">
                <span>⏱ {course.duration}</span><span>👥 {course.students}</span><span>⚡ +{course.xp} XP</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Academy;
