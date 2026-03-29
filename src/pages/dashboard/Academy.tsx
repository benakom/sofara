import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  GraduationCap, BookOpen, Flame, Zap, Trophy, Play, Clock, Users, Star,
  ArrowLeft, Loader2, TrendingUp, Award, CheckCircle, ChevronRight, Search, Filter
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
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
  { labelAr: "Tout", labelEn: "All", icon: GraduationCap, id: "all" },
  { labelAr: "Immobilier Dubai", labelEn: "Dubai Real Estate", icon: TrendingUp, id: "dubai" },
  { labelAr: "Techniques de vente", labelEn: "Sales Techniques", icon: Users, id: "sales" },
  { labelAr: "Conformité", labelEn: "Compliance", icon: CheckCircle, id: "compliance" },
];

const levelConfig: Record<string, { color: string; bg: string; labelAr: string; labelEn: string }> = {
  beginner: { color: "text-emerald-700", bg: "bg-emerald-100", labelAr: "Débutant", labelEn: "Beginner" },
  intermediate: { color: "text-amber-700", bg: "bg-amber-100", labelAr: "Intermédiaire", labelEn: "Intermediate" },
  advanced: { color: "text-rose-700", bg: "bg-rose-100", labelAr: "Avancé", labelEn: "Advanced" },
};

// Simulated data for Udemy feel
const courseExtras: Record<number, { rating: number; students: number; bestseller?: boolean; isNew?: boolean }> = {
  1: { rating: 4.8, students: 1247, bestseller: true },
  2: { rating: 4.7, students: 983 },
  3: { rating: 4.5, students: 756 },
  4: { rating: 4.9, students: 1534, bestseller: true },
  5: { rating: 4.6, students: 892 },
  6: { rating: 4.8, students: 1102, bestseller: true },
  7: { rating: 4.7, students: 867 },
  8: { rating: 4.6, students: 723 },
  9: { rating: 4.9, students: 645 },
  10: { rating: 4.4, students: 1389 },
  11: { rating: 4.5, students: 934 },
  12: { rating: 4.7, students: 1456 },
  13: { rating: 4.8, students: 1678, isNew: true },
  14: { rating: 4.6, students: 812, isNew: true },
  15: { rating: 4.9, students: 567 },
  16: { rating: 4.7, students: 934, isNew: true },
};

const getYoutubeId = (url: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
  return match ? match[1] : null;
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < full || (i === full && half) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
};

const Academy = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userXP = 0;
  const userLevel = 1;
  const nextLevelXP = 500;
  const completedCourses = 0;

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

  const filtered = useMemo(() => {
    let result = courses;
    if (activeCategory !== "all") result = result.filter(c => c.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title_fr.toLowerCase().includes(q) || c.title_en.toLowerCase().includes(q) ||
        c.description_fr.toLowerCase().includes(q) || c.description_en.toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, activeCategory, searchQuery]);

  const featuredCourse = courses.length > 0 ? courses[0] : null;
  const totalLessons = courses.reduce((a, c) => a + c.lessons_count, 0);
  const totalHours = courses.reduce((a, c) => {
    const match = c.duration.match(/(\d+)h/);
    return a + (match ? parseInt(match[1]) : 0);
  }, 0);

  // Course detail view
  if (selectedCourse) {
    const ytId = getYoutubeId(selectedCourse.youtube_url);
    const lvl = levelConfig[selectedCourse.level] || levelConfig.beginner;
    const extras = courseExtras[selectedCourse.sort_order] || { rating: 4.5, students: 500 };
    const relatedCourses = courses.filter(c => c.category === selectedCourse.category && c.id !== selectedCourse.id).slice(0, 3);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-base sm:text-sm dash-muted-text hover:dash-text mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lang === "ar" ? "Retour à l'Academy" : "Back to Academy"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Video player */}
            {ytId ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-5 shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : selectedCourse.thumbnail_url ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-5 shadow-lg">
                <img src={selectedCourse.thumbnail_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-gray-800 ml-1" />
                  </div>
                  <p className="absolute bottom-4 text-white text-sm font-medium">{lang === "ar" ? "Vidéo bientôt disponible" : "Video coming soon"}</p>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] flex items-center justify-center mb-5">
                <p className="dash-muted-text text-base sm:text-sm">{lang === "ar" ? "Vidéo bientôt disponible" : "Video coming soon"}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${lvl.bg} ${lvl.color}`}>
                {lang === "ar" ? lvl.labelAr : lvl.labelEn}
              </span>
              {extras.bestseller && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-900">Bestseller</span>
              )}
              {extras.isNew && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white">{lang === "ar" ? "Nouveau" : "New"}</span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold dash-text mb-3">
              {lang === "ar" ? selectedCourse.title_fr : selectedCourse.title_en}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-500">{extras.rating}</span>
                <StarRating rating={extras.rating} />
              </div>
              <span className="text-sm dash-muted-text flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {extras.students.toLocaleString()} {lang === "ar" ? "inscrits" : "enrolled"}</span>
              <span className="text-sm dash-muted-text flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedCourse.duration}</span>
              <span className="text-sm dash-muted-text flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {selectedCourse.lessons_count} {lang === "ar" ? "leçons" : "lessons"}</span>
            </div>

            <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-xl p-5 mb-5">
              <h2 className="text-lg font-display font-semibold dash-text mb-3">{lang === "ar" ? "À propos de ce cours" : "About this course"}</h2>
              <p className="text-base sm:text-sm dash-muted-text leading-relaxed">
                {lang === "ar" ? selectedCourse.description_fr : selectedCourse.description_en}
              </p>
            </div>

            {/* What you'll learn */}
            <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-xl p-5 mb-5">
              <h2 className="text-lg font-display font-semibold dash-text mb-3">{lang === "ar" ? "Ce que vous apprendrez" : "What you'll learn"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Array.from({ length: Math.min(selectedCourse.lessons_count, 6) }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm dash-muted-text">
                      {lang === "ar" ? `Module ${i + 1} — Leçon interactive` : `Module ${i + 1} — Interactive lesson`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* CTA card */}
            <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-display font-bold text-emerald-500">{lang === "ar" ? "Gratuit" : "Free"}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{lang === "ar" ? "Inclus dans votre plan" : "Included in your plan"}</span>
              </div>
              <button className="w-full py-3 rounded-xl dash-btn-accent text-base">
                {lang === "ar" ? "Commencer le cours" : "Start course"}
              </button>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 dash-muted-text"><Clock className="w-4 h-4" /> {selectedCourse.duration} {lang === "ar" ? "de contenu" : "of content"}</div>
                <div className="flex items-center gap-2 dash-muted-text"><BookOpen className="w-4 h-4" /> {selectedCourse.lessons_count} {lang === "ar" ? "leçons" : "lessons"}</div>
                <div className="flex items-center gap-2 dash-muted-text"><Zap className="w-4 h-4 text-amber-500" /> +{selectedCourse.xp} XP {lang === "ar" ? "à gagner" : "to earn"}</div>
                <div className="flex items-center gap-2 dash-muted-text"><Award className="w-4 h-4" /> {lang === "ar" ? "Certificat de complétion" : "Completion certificate"}</div>
              </div>
            </div>

            {/* Related courses */}
            {relatedCourses.length > 0 && (
              <div className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-xl p-4">
                <h3 className="text-sm font-display font-semibold dash-text mb-3">{lang === "ar" ? "Cours similaires" : "Related courses"}</h3>
                <div className="space-y-3">
                  {relatedCourses.map(rc => (
                    <button key={rc.id} onClick={() => { setSelectedCourse(rc); window.scrollTo(0, 0); }}
                      className="flex gap-3 w-full text-left hover:opacity-80 transition-opacity">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-[hsl(var(--muted))] shrink-0">
                        {rc.thumbnail_url && <img src={rc.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium dash-text line-clamp-2 leading-tight">{lang === "ar" ? rc.title_fr : rc.title_en}</p>
                        <p className="text-[11px] dash-muted-text mt-0.5">{rc.duration} • +{rc.xp} XP</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold text-[hsl(var(--dash-fg))] tracking-[-0.02em]">🎓 Sofara Academy</h1>
        <p className="text-[hsl(var(--dash-muted-fg))] text-xs mt-0.5">
          {lang === "ar" ? "تدرب وكن خبيرًا في العقارات في دبي" : "Train yourself and become a Dubai real estate expert"}
        </p>
        <div className="mt-2 h-2 w-full max-w-xs bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
          <div className="h-full bg-[hsl(var(--dash-accent))] rounded-full" style={{ width: `${courses.length > 0 ? (completedCourses / courses.length) * 100 : 0}%`, minWidth: 4 }} />
        </div>
        <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-1">{completedCourses} {lang === "ar" ? "من" : "of"} {courses.length} {lang === "ar" ? "مكتمل" : "completed"}</p>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { labelAr: "Cours", labelEn: "Courses", value: courses.length, icon: BookOpen, accent: "bg-blue-100 text-blue-600" },
          { labelAr: "Heures +", labelEn: "Hours +", value: `${totalHours}h`, icon: Clock, accent: "bg-violet-100 text-violet-600" },
          { labelAr: "Leçons", labelEn: "Lessons", value: totalLessons, icon: GraduationCap, accent: "bg-emerald-100 text-emerald-600" },
          { labelAr: "Votre XP", labelEn: "Your XP", value: `${userXP}/${nextLevelXP}`, icon: Zap, accent: "bg-amber-100 text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="dash-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-lg ${s.accent}`}><s.icon className="w-3.5 h-3.5" /></div>
              <span className="text-xs font-medium dash-muted-text uppercase tracking-wider">{lang === "ar" ? s.labelAr : s.labelEn}</span>
            </div>
            <p className="text-xl sm:text-lg font-display font-bold dash-text">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Featured course hero */}
      {featuredCourse && activeCategory === "all" && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => setSelectedCourse(featuredCourse)}
          className="relative rounded-2xl overflow-hidden mb-6 cursor-pointer group"
        >
          <div className="relative h-48 sm:h-56 lg:h-64">
            {featuredCourse.thumbnail_url && (
              <img src={featuredCourse.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-900">⭐ Bestseller</span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {(levelConfig[featuredCourse.level] || levelConfig.beginner)[lang === "ar" ? "labelFr" : "labelEn"]}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white mb-2 max-w-xl">
                {lang === "ar" ? featuredCourse.title_fr : featuredCourse.title_en}
              </h2>
              <p className="text-sm text-white/80 max-w-lg line-clamp-2 mb-3 hidden sm:block">
                {lang === "ar" ? featuredCourse.description_fr : featuredCourse.description_en}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredCourse.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {featuredCourse.lessons_count} {lang === "ar" ? "leçons" : "lessons"}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 1,247 {lang === "ar" ? "inscrits" : "enrolled"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search + Categories */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dash-muted-text" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "Rechercher un cours..." : "Search courses..."}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.3)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "dash-btn-accent shadow-md"
                  : "bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] dash-text hover:shadow-sm hover:border-[hsl(var(--dash-accent)/.3)]"
              }`}>
              <cat.icon className="w-4 h-4" />
              {lang === "ar" ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold dash-text">
          {activeCategory === "all"
            ? (lang === "ar" ? "Toutes les formations" : "All courses")
            : categories.find(c => c.id === activeCategory)?.[lang === "ar" ? "labelFr" : "labelEn"]
          }
          <span className="text-sm font-normal dash-muted-text ml-2">({filtered.length})</span>
        </h2>
      </div>

      {/* Course grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-accent))]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 dash-muted-text">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-base">{lang === "ar" ? "Aucun cours trouvé" : "No courses found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {filtered.map((course, i) => {
            const thumb = course.thumbnail_url || (getYoutubeId(course.youtube_url) ? `https://img.youtube.com/vi/${getYoutubeId(course.youtube_url)}/hqdefault.jpg` : null);
            const lvl = levelConfig[course.level] || levelConfig.beginner;
            const extras = courseExtras[course.sort_order] || { rating: 4.5, students: 500 };

            return (
              <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedCourse(course)}
                className="bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[hsl(var(--primary)/.2)] transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 sm:h-44 overflow-hidden bg-[hsl(var(--muted))]">
                  {thumb && <img src={thumb} alt={lang === "ar" ? course.title_fr : course.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 text-gray-800 ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {extras.bestseller && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-amber-900 shadow-sm">Bestseller</span>
                    )}
                    {extras.isNew && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white shadow-sm">{lang === "ar" ? "Nouveau" : "New"}</span>
                    )}
                  </div>

                  {/* Duration pill */}
                  <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </div>

                  {/* Level badge */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${lvl.bg} ${lvl.color}`}>
                      {lang === "ar" ? lvl.labelAr : lvl.labelEn}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base sm:text-[15px] font-display font-semibold dash-text line-clamp-2 group-hover:text-[hsl(var(--dash-accent))] transition-colors leading-snug mb-1.5">
                    {lang === "ar" ? course.title_fr : course.title_en}
                  </h3>
                  <p className="text-sm sm:text-xs dash-muted-text line-clamp-2 mb-3">{lang === "ar" ? course.description_fr : course.description_en}</p>

                  {/* Rating & Students */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-amber-500">{extras.rating}</span>
                    <StarRating rating={extras.rating} />
                    <span className="text-xs dash-muted-text">({extras.students.toLocaleString()})</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--dash-border)/.5)]">
                    <div className="flex items-center gap-3 text-xs dash-muted-text">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons_count} {lang === "ar" ? "leçons" : "lessons"}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500"><Zap className="w-3.5 h-3.5" /> +{course.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Gamification footer */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50"><Trophy className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-sm font-semibold dash-text">{lang === "ar" ? "Niveau" : "Level"} {userLevel}</p>
              <p className="text-xs dash-muted-text">{userXP}/{nextLevelXP} XP</p>
            </div>
          </div>
          <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all" style={{ width: `${(userXP / nextLevelXP) * 100}%` }} />
          </div>
        </div>

        <div className="dash-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50"><Award className="w-5 h-5 text-emerald-500" /></div>
            <div>
              <p className="text-sm font-semibold dash-text">{lang === "ar" ? "Cours terminés" : "Completed"}</p>
              <p className="text-xs dash-muted-text">{completedCourses}/{courses.length}</p>
            </div>
          </div>
          <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all" style={{ width: `${courses.length > 0 ? (completedCourses / courses.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="dash-card rounded-2xl p-5">
          <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-3">{lang === "ar" ? "Badges" : "Badges"}</h3>
          <div className="flex gap-2">
            {[
              { icon: "🏅", label: lang === "ar" ? "1er cours" : "1st course" },
              { icon: "🔥", label: lang === "ar" ? "Série 7j" : "7-day streak" },
              { icon: "⭐", label: "500 XP" },
              { icon: "🏆", label: "Top 10" },
              { icon: "💎", label: "Expert" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-[hsl(var(--dash-muted))] opacity-40" title={badge.label}>
                <span className="text-lg">{badge.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Academy;
