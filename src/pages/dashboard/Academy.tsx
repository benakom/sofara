import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { GraduationCap, BookOpen, Flame, Zap, Trophy, Play, Clock, Users, Star, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  category: string;
  level: string;
  duration: string;
  lessons_count: number;
  xp: number;
  thumbnail_url: string | null;
  youtube_url: string | null;
  sort_order: number;
}

const categories = [
  { labelFr: "Tout", labelEn: "All", icon: "🎓", id: "all" },
  { labelFr: "Immobilier Dubai", labelEn: "Dubai Real Estate", icon: "🏙️", id: "dubai" },
  { labelFr: "Techniques de vente", labelEn: "Sales Techniques", icon: "🎯", id: "sales" },
  { labelFr: "Conformité", labelEn: "Compliance", icon: "🛡️", id: "compliance" },
];

const levelConfig: Record<string, { color: string; labelFr: string; labelEn: string }> = {
  beginner: { color: "bg-emerald-100 text-emerald-700", labelFr: "Débutant", labelEn: "Beginner" },
  intermediate: { color: "bg-amber-100 text-amber-700", labelFr: "Intermédiaire", labelEn: "Intermediate" },
  advanced: { color: "bg-rose-100 text-rose-700", labelFr: "Avancé", labelEn: "Advanced" },
};

const getYoutubeId = (url: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
  return match ? match[1] : null;
};

const Academy = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const userXP = 0;
  const userLevel = 1;
  const nextLevelXP = 500;
  const completedCourses = 0;
  const inProgressCourses = 0;

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (data) setCourses(data as Course[]);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => activeCategory === "all" || c.category === activeCategory);

  // Course detail view
  if (selectedCourse) {
    const ytId = getYoutubeId(selectedCourse.youtube_url);
    const lvl = levelConfig[selectedCourse.level] || levelConfig.beginner;
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-sm dash-muted-text hover:dash-text mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour à l'Academy" : "Back to Academy"}
        </button>

        <div className="max-w-4xl">
          {/* Video player */}
          {ytId ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-5">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] flex items-center justify-center mb-5">
              <p className="dash-muted-text text-sm">{lang === "fr" ? "Vidéo bientôt disponible" : "Video coming soon"}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${lvl.color}`}>
              {lang === "fr" ? lvl.labelFr : lvl.labelEn}
            </span>
            <span className="text-xs dash-muted-text flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedCourse.duration}</span>
            <span className="text-xs dash-muted-text flex items-center gap-1"><BookOpen className="w-3 h-3" /> {selectedCourse.lessons_count} {lang === "fr" ? "leçons" : "lessons"}</span>
            <span className="text-xs font-medium text-amber-500 flex items-center gap-1"><Zap className="w-3 h-3" /> +{selectedCourse.xp} XP</span>
          </div>

          <h1 className="text-lg lg:text-xl font-display font-bold dash-text mb-2">
            {lang === "fr" ? selectedCourse.title_fr : selectedCourse.title_en}
          </h1>
          <p className="text-sm dash-muted-text leading-relaxed">
            {lang === "fr" ? selectedCourse.description_fr : selectedCourse.description_en}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
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
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--primary))]" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 dash-muted-text">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{lang === "fr" ? "Contenu bientôt disponible" : "Content coming soon"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
              {filtered.map((course, i) => {
                const thumb = course.thumbnail_url || (getYoutubeId(course.youtube_url) ? `https://img.youtube.com/vi/${getYoutubeId(course.youtube_url)}/hqdefault.jpg` : null);
                const lvl = levelConfig[course.level] || levelConfig.beginner;
                return (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedCourse(course)}
                    className="dash-card rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                    <div className="relative h-32 sm:h-36 overflow-hidden bg-[hsl(var(--muted))]">
                      {thumb && <img src={thumb} alt={lang === "fr" ? course.title_fr : course.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${lvl.color}`}>
                          {lang === "fr" ? lvl.labelFr : lvl.labelEn}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-[hsl(var(--primary))] transition-colors">
                          <Play className="w-3.5 h-3.5 text-gray-700 group-hover:text-white transition-colors ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {course.duration}
                      </div>
                    </div>
                    <div className="p-3 lg:p-3.5">
                      <h3 className="text-[13px] lg:text-sm font-display font-semibold dash-text line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors leading-snug">
                        {lang === "fr" ? course.title_fr : course.title_en}
                      </h3>
                      <p className="text-[11px] lg:text-xs dash-muted-text mt-1 line-clamp-2">{lang === "fr" ? course.description_fr : course.description_en}</p>
                      <div className="flex items-center justify-between mt-2.5 lg:mt-3 text-[10px] lg:text-[11px] dash-muted-text">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons_count}</span>
                        <span className="flex items-center gap-1 font-medium text-amber-500"><Zap className="w-3 h-3" /> +{course.xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gamification sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
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
