import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Users, MessageCircle, Lock, Plus } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export interface Channel {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  emoji: string;
  is_locked: boolean;
  sort_order: number;
  post_count?: number;
  reply_count?: number;
}

interface Props {
  channels: Channel[];
  selectedId: string | null;
  onSelect: (ch: Channel) => void;
  onCreateChannel?: () => void;
  loading?: boolean;
}

const ChannelList = ({ channels, selectedId, onSelect, onCreateChannel, loading }: Props) => {
  const { lang } = useLanguage();
  const { isSuperAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="dash-card rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-[hsl(var(--dash-muted))] rounded w-2/3 mb-2" />
            <div className="h-3 bg-[hsl(var(--dash-muted))] rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <h2 className="text-xs font-semibold dash-muted-text uppercase tracking-wider">
          {lang === "ar" ? "Espaces" : "Channels"}
        </h2>
        {isSuperAdmin && onCreateChannel && (
          <button
            onClick={onCreateChannel}
            className="p-1 rounded-md hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--primary))] transition-colors"
            title={lang === "ar" ? "Créer un espace" : "Create channel"}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {channels.length === 0 && (
        <p className="text-xs dash-muted-text text-center py-6">
          {lang === "ar" ? "Aucun espace pour le moment." : "No channels yet."}
        </p>
      )}

      {channels.map((ch, i) => {
        const active = selectedId === ch.id;
        return (
          <motion.button
            key={ch.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelect(ch)}
            className={`w-full text-left rounded-xl p-3 transition-all ${
              active
                ? "bg-[hsl(var(--primary)/.1)] border border-[hsl(var(--primary)/.3)]"
                : "dash-card hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{ch.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className={`text-sm font-semibold truncate ${active ? "text-[hsl(var(--primary))]" : "dash-text"}`}>
                    {lang === "ar" ? ch.title_fr : ch.title_en}
                  </h3>
                  {ch.is_locked && <Lock className="w-3 h-3 dash-muted-text shrink-0" />}
                </div>
                <p className="text-[11px] dash-muted-text truncate mt-0.5">
                  {lang === "ar" ? ch.description_fr : ch.description_en}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChannelList;
