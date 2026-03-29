import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Story {
  id: string;
  label: string;
  labelAr: string;
  thumbnail: string;
  gradientFrom: string;
  gradientTo: string;
  videoUrl: string;
  viewed: boolean;
}

const DEMO_STORIES: Story[] = [
  {
    id: "1",
    label: "Tips",
    labelAr: "نصائح",
    thumbnail: "💡",
    gradientFrom: "#D2F34C",
    gradientTo: "#a8c438",
    videoUrl: "",
    viewed: false,
  },
  {
    id: "2",
    label: "New",
    labelAr: "جديد",
    thumbnail: "🚀",
    gradientFrom: "#8B5CF6",
    gradientTo: "#6D28D9",
    videoUrl: "",
    viewed: false,
  },
  {
    id: "3",
    label: "Market",
    labelAr: "السوق",
    thumbnail: "📊",
    gradientFrom: "#F43F5E",
    gradientTo: "#BE123C",
    videoUrl: "",
    viewed: false,
  },
  {
    id: "4",
    label: "Deals",
    labelAr: "صفقات",
    thumbnail: "🤝",
    gradientFrom: "#3B82F6",
    gradientTo: "#1D4ED8",
    videoUrl: "",
    viewed: false,
  },
  {
    id: "5",
    label: "Training",
    labelAr: "تدريب",
    thumbnail: "🎓",
    gradientFrom: "#F59E0B",
    gradientTo: "#D97706",
    videoUrl: "",
    viewed: false,
  },
  {
    id: "6",
    label: "Sofara",
    labelAr: "سفرا",
    thumbnail: "⭐",
    gradientFrom: "#D2F34C",
    gradientTo: "#6EE7B7",
    videoUrl: "",
    viewed: false,
  },
];

const StoriesCircles = () => {
  const { lang } = useLanguage();
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const STORY_DURATION = 5000; // 5 seconds per story

  const openStory = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPaused(false);
    setStories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, viewed: true } : s))
    );
  };

  const closeStory = () => {
    setActiveIndex(null);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const nextStory = () => {
    if (activeIndex !== null && activeIndex < stories.length - 1) {
      openStory(activeIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeIndex !== null && activeIndex > 0) {
      openStory(activeIndex - 1);
    }
  };

  // Progress timer
  useEffect(() => {
    if (activeIndex === null || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50;
    const increment = (interval / STORY_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isPaused]);

  return (
    <>
      {/* Stories row - horizontal scroll */}
      <div className="mb-5">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stories.map((story, i) => (
            <button
              key={story.id}
              onClick={() => openStory(i)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              {/* Ring + avatar */}
              <div
                className="rounded-full p-[3px] transition-transform active:scale-90"
                style={{
                  background: story.viewed
                    ? "hsl(0 0% 30%)"
                    : `linear-gradient(135deg, ${story.gradientFrom}, ${story.gradientTo})`,
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--dash-card))] flex items-center justify-center text-2xl border-2 border-[hsl(var(--dash-bg))]">
                  {story.thumbnail}
                </div>
              </div>
              <span
                className="text-[10px] font-semibold max-w-[64px] truncate"
                style={{
                  color: story.viewed
                    ? "hsl(var(--dash-muted-fg))"
                    : "hsl(var(--dash-fg))",
                }}
              >
                {lang === "ar" ? story.labelAr : story.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen story viewer */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3 pt-[env(safe-area-inset-top,12px)]">
              {stories.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[3px] rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  <div
                    className="h-full rounded-full transition-none"
                    style={{
                      backgroundColor: "#D2F34C",
                      width:
                        i < activeIndex
                          ? "100%"
                          : i === activeIndex
                          ? `${progress}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-0 right-0 z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{
                    background: `linear-gradient(135deg, ${stories[activeIndex].gradientFrom}, ${stories[activeIndex].gradientTo})`,
                  }}
                >
                  {stories[activeIndex].thumbnail}
                </div>
                <span className="text-white text-sm font-semibold">
                  {lang === "ar"
                    ? stories[activeIndex].labelAr
                    : stories[activeIndex].label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 text-white/70 hover:text-white"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={closeStory}
                  className="p-1.5 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story content */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Tap zones */}
              <button
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
                onClick={prevStory}
              />
              <button
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
                onClick={nextStory}
              />

              {/* Placeholder content (replace with actual video) */}
              <motion.div
                key={activeIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col items-center justify-center px-8 text-center"
                style={{
                  background: `linear-gradient(160deg, ${stories[activeIndex].gradientFrom}22, ${stories[activeIndex].gradientTo}33)`,
                }}
              >
                <div className="text-6xl mb-6">{stories[activeIndex].thumbnail}</div>
                <h2 className="text-white text-2xl font-bold font-display mb-3">
                  {lang === "ar"
                    ? stories[activeIndex].labelAr
                    : stories[activeIndex].label}
                </h2>
                <p className="text-white/60 text-sm max-w-xs">
                  {lang === "ar"
                    ? "المحتوى قريبًا — فيديوهات حصرية للسفراء"
                    : "Coming soon — exclusive video insights for ambassadors"}
                </p>
                <div className="mt-8 px-5 py-2.5 rounded-xl bg-[#D2F34C] text-black text-sm font-bold">
                  {lang === "ar" ? "قريبًا" : "Coming Soon"}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesCircles;
