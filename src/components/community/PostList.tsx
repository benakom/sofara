import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Heart, MessageCircle, Pin, Lock, Trash2, Plus } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { getLocalizedText } from "@/lib/i18n-utils";

export interface Post {
  id: string;
  channel_id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  author_name?: string;
  like_count: number;
  reply_count: number;
  user_liked: boolean;
}

interface Props {
  posts: Post[];
  channelTitle: string;
  channelLocked: boolean;
  onSelectPost: (post: Post) => void;
  onCreatePost: () => void;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onTogglePin?: (postId: string, pinned: boolean) => void;
  loading?: boolean;
}

const PostList = ({
  posts, channelTitle, channelLocked, onSelectPost, onCreatePost,
  onLike, onDelete, onTogglePin, loading
}: Props) => {
  const { lang } = useLanguage();
  const { isSuperAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="dash-card rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-[hsl(var(--dash-muted))] rounded w-1/2 mb-3" />
            <div className="h-3 bg-[hsl(var(--dash-muted))] rounded w-full mb-2" />
            <div className="h-3 bg-[hsl(var(--dash-muted))] rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const pinnedPosts = posts.filter(p => p.is_pinned);
  const normalPosts = posts.filter(p => !p.is_pinned);

  const renderPost = (post: Post, i: number) => {
    const timeAgo = formatDistanceToNow(new Date(post.created_at), {
      addSuffix: true,
      locale: lang === "ar" ? fr : enUS,
    });

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03 }}
        className="dash-card rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer group"
        onClick={() => onSelectPost(post)}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/.1)] flex items-center justify-center text-xs font-bold text-[hsl(var(--primary))] shrink-0 mt-0.5">
            {(post.author_name || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {post.is_pinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
              {post.is_locked && <Lock className="w-3 h-3 dash-muted-text shrink-0" />}
              <h3 className="text-sm font-semibold dash-text group-hover:text-[hsl(var(--primary))] transition-colors truncate">
                {getLocalizedText(post.title, lang)}
              </h3>
            </div>
            <p className="text-xs dash-muted-text mt-1 line-clamp-2">{getLocalizedText(post.content, lang)}</p>
            <div className="flex items-center gap-4 mt-2.5 text-[11px] dash-muted-text">
              <span className="font-medium">{post.author_name || "Anonyme"}</span>
              <span>{timeAgo}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                className={`flex items-center gap-1 transition-colors ${post.user_liked ? "text-red-400" : "hover:text-red-400"}`}
              >
                <Heart className={`w-3 h-3 ${post.user_liked ? "fill-red-400" : ""}`} /> {post.like_count}
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {post.reply_count}
              </span>
              {(isSuperAdmin) && (
                <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onTogglePin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onTogglePin(post.id, !post.is_pinned); }}
                      className="p-1 rounded hover:bg-[hsl(var(--dash-muted))] text-amber-500"
                      title={post.is_pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
                      className="p-1 rounded hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--destructive))]"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-display font-bold dash-text">{channelTitle}</h2>
        {!channelLocked && (
          <button
            onClick={onCreatePost}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3 h-3" />
            {lang === "ar" ? "منشور جديد" : "New post"}
          </button>
        )}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-8 h-8 mx-auto dash-muted-text mb-2" />
          <p className="text-sm dash-muted-text">
            {lang === "ar" ? "Aucune discussion dans cet espace." : "No posts in this channel yet."}
          </p>
        </div>
      )}

      {pinnedPosts.map((p, i) => renderPost(p, i))}
      {pinnedPosts.length > 0 && normalPosts.length > 0 && (
        <div className="border-t border-[hsl(var(--dash-border))]" />
      )}
      {normalPosts.map((p, i) => renderPost(p, i + pinnedPosts.length))}
    </div>
  );
};

export default PostList;
