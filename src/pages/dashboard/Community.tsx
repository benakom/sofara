import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { MessageCircle, Users, HelpCircle, Megaphone, Star, TrendingUp, Heart, Award } from "lucide-react";

const channels = [
  { icon: Megaphone, titleFr: "📢 Annonces", titleEn: "📢 Announcements", descFr: "Actualités et mises à jour Sofara.", descEn: "Sofara news and updates.", members: 512, posts: 34 },
  { icon: HelpCircle, titleFr: "💬 Entraide", titleEn: "💬 Help & Support", descFr: "Posez vos questions, obtenez des réponses.", descEn: "Ask questions, get answers.", members: 389, posts: 156 },
  { icon: TrendingUp, titleFr: "📈 Deals & Success", titleEn: "📈 Deals & Success", descFr: "Partagez vos succès et célébrez ensemble.", descEn: "Share your wins and celebrate together.", members: 298, posts: 87 },
  { icon: Star, titleFr: "🎯 Tips & Stratégies", titleEn: "🎯 Tips & Strategies", descFr: "Techniques et stratégies de vente.", descEn: "Sales techniques and strategies.", members: 445, posts: 203 },
];

const topMembers = [
  { name: "Ahmed K.", deals: 12, badge: "🏆" },
  { name: "Sarah M.", deals: 9, badge: "🥈" },
  { name: "Omar R.", deals: 7, badge: "🥉" },
];

const Community = () => {
  const { lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl sm:text-xl font-display font-bold dash-text mb-0.5">Community</h1>
      <p className="dash-muted-text text-base sm:text-sm mb-5">{lang === "fr" ? "Échangez avec les ambassadeurs Sofara." : "Connect with Sofara ambassadors."}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Channels */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-semibold dash-muted-text uppercase tracking-wider px-1">{lang === "fr" ? "Espaces de discussion" : "Discussion Spaces"}</h2>
          {channels.map((ch, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="dash-card rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[hsl(var(--primary)/.06)]">
                  <ch.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-sm font-semibold dash-text group-hover:text-[hsl(var(--primary))] transition-colors">{lang === "fr" ? ch.titleFr : ch.titleEn}</h3>
                  <p className="text-sm sm:text-xs dash-muted-text mt-0.5">{lang === "fr" ? ch.descFr : ch.descEn}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs sm:text-[11px] dash-muted-text">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ch.members}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {ch.posts} posts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="text-center py-4">
            <p className="text-xs dash-muted-text flex items-center justify-center gap-1"><Heart className="w-3 h-3" /> {lang === "fr" ? "Bientôt disponible — Rejoignez la communauté !" : "Coming soon — Join the community!"}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Top members */}
          <div className="dash-card rounded-xl p-4">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-3 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> {lang === "fr" ? "Top Ambassadeurs" : "Top Ambassadors"}</h3>
            <div className="space-y-2.5">
              {topMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-lg">{m.badge}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium dash-text">{m.name}</p>
                    <p className="text-[11px] dash-muted-text">{m.deals} deals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="dash-card rounded-xl p-4">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-3">{lang === "fr" ? "Communauté" : "Community"}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="dash-muted-text flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {lang === "fr" ? "Membres" : "Members"}</span>
                <span className="font-bold dash-text">512</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="dash-muted-text flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {lang === "fr" ? "Messages" : "Messages"}</span>
                <span className="font-bold dash-text">1,204</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="dash-muted-text flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {lang === "fr" ? "Actifs cette semaine" : "Active this week"}</span>
                <span className="font-bold dash-text">89</span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="dash-card rounded-xl p-4">
            <h3 className="text-xs font-semibold dash-text uppercase tracking-wider mb-2">{lang === "fr" ? "Règles" : "Guidelines"}</h3>
            <ul className="space-y-1.5 text-[11px] dash-muted-text">
              <li>✅ {lang === "fr" ? "Respect et bienveillance" : "Respect and kindness"}</li>
              <li>✅ {lang === "fr" ? "Partage de connaissances" : "Knowledge sharing"}</li>
              <li>✅ {lang === "fr" ? "Pas de spam ni auto-promotion" : "No spam or self-promotion"}</li>
              <li>✅ {lang === "fr" ? "Confidentialité des données clients" : "Client data confidentiality"}</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Community;
