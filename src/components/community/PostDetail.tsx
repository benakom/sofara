import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Heart, ArrowLeft, Trash2, Send, Lock } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useState } from "react";
import { getLocalizedText } from "@/lib/i18n-utils";

export interface Reply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  like_count: number;
  user_liked: boolean;
}

interface Props {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    is_locked: boolean;
    is_pinned: boolean;
    author_name?: string;
    like_count: number;
    user_liked: boolean;
  };
  replies: Reply[];
  onBack: () => void;
  onLikePost: () => void;
  onLikeReply: (replyId: string) => void;
  onReply: (content: string) => void;
  onDeleteReply?: (replyId: string) => void;
  replying?: boolean;
  loadingReplies?: boolean;
}

const PostDetail = ({
  post, replies, onBack, onLikePost, onLikeReply,
  onReply, onDeleteReply, replying, loadingReplies
}: Props) => {
  const { lang } = useLanguage();
  const { isSuperAdmin } = useAdmin();
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || replying) return;
    onReply(replyText.trim());
    setReplyText("");
  };

  const timeAgo = (date: string) =>
    formatDistanceToNow(new Date(date), { addSuffix: true, locale: lang === "ar" ? fr : enUS });

  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs dash-muted-text hover:text-[hsl(var(--primary))] transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        {lang === "ar" ? "Retour" : "Back"}
      </button>

      {/* Post */}
      <div className="dash-card rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))] shrink-0">
            {(post.author_name || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-display font-bold dash-text">{getLocalizedText(post.title, lang)}</h2>
            <div className="flex items-center gap-2 text-[11px] dash-muted-text mt-1">
              <span className="font-medium">{post.author_name || "Anonyme"}</span>
              <span>·</span>
              <span>{timeAgo(post.created_at)}</span>
              {post.is_locked && (
                <span className="flex items-center gap-0.5 text-amber-500"><Lock className="w-3 h-3" /> {lang === "ar" ? "Verrouillé" : "Locked"}</span>
              )}
            </div>
            <p className="text-sm dash-text mt-3 whitespace-pre-wrap leading-relaxed">{getLocalizedText(post.content, lang)}</p>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[hsl(var(--dash-border))]">
              <button
                onClick={onLikePost}
                className={`flex items-center gap-1.5 text-xs transition-colors ${post.user_liked ? "text-red-400" : "dash-muted-text hover:text-red-400"}`}
              >
                <Heart className={`w-4 h-4 ${post.user_liked ? "fill-red-400" : ""}`} />
                {post.like_count} {lang === "ar" ? "j'aime" : "likes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div>
        <h3 className="text-xs font-semibold dash-muted-text uppercase tracking-wider px-1 mb-3">
          {replies.length} {lang === "ar" ? "réponse(s)" : "reply(ies)"}
        </h3>

        {loadingReplies ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="dash-card rounded-xl p-4 animate-pulse">
                <div className="h-3 bg-[hsl(var(--dash-muted))] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {replies.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="dash-card rounded-xl p-3.5 group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--dash-muted))] flex items-center justify-center text-[10px] font-bold dash-muted-text shrink-0">
                    {(r.author_name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] dash-muted-text">
                      <span className="font-medium">{r.author_name || "Anonyme"}</span>
                      <span>{timeAgo(r.created_at)}</span>
                    </div>
                    <p className="text-sm dash-text mt-1 whitespace-pre-wrap">{r.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      <button
                        onClick={() => onLikeReply(r.id)}
                        className={`flex items-center gap-1 transition-colors ${r.user_liked ? "text-red-400" : "dash-muted-text hover:text-red-400"}`}
                      >
                        <Heart className={`w-3 h-3 ${r.user_liked ? "fill-red-400" : ""}`} /> {r.like_count}
                      </button>
                      {(isSuperAdmin) && onDeleteReply && (
                        <button
                          onClick={() => onDeleteReply(r.id)}
                          className="opacity-0 group-hover:opacity-100 text-[hsl(var(--destructive))] transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reply input */}
      {!post.is_locked && (
        <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-0 bg-[hsl(var(--dash-bg))] py-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={lang === "ar" ? "Votre réponse…" : "Your reply…"}
            className="flex-1 min-w-0 h-10 px-4 rounded-full bg-[hsl(var(--dash-card))] border border-[hsl(var(--dash-border))] text-sm dash-text placeholder:dash-muted-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
            disabled={replying}
          />
          <button
            type="submit"
            disabled={replying || !replyText.trim()}
            className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default PostDetail;
