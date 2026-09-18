import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ChannelList, { type Channel } from "@/components/community/ChannelList";
import PostList, { type Post } from "@/components/community/PostList";
import PostDetail, { type Reply } from "@/components/community/PostDetail";
import CreatePostDialog from "@/components/community/CreatePostDialog";
import CreateChannelDialog from "@/components/community/CreateChannelDialog";
import { MessageCircle } from "lucide-react";

type View = "channels" | "posts" | "post-detail";

const Community = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [view, setView] = useState<View>("channels");

  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  // ─── Fetch channels ─────────────────────────────────────
  const fetchChannels = useCallback(async () => {
    setLoadingChannels(true);
    const { data, error } = await supabase
      .from("community_channels")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setChannels(data as Channel[]);
    setLoadingChannels(false);
  }, []);

  useEffect(() => { fetchChannels(); }, [fetchChannels]);

  // ─── Fetch posts for a channel ──────────────────────────
  const fetchPosts = useCallback(async (channelId: string) => {
    if (!user) return;
    setLoadingPosts(true);
    const { data: postsData, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("channel_id", channelId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) { setLoadingPosts(false); return; }

    // Enrich with author names, like counts, user_liked
    const enriched: Post[] = await Promise.all(
      (postsData || []).map(async (p: any) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", p.user_id)
          .single();

        const { count: likeCount } = await supabase
          .from("community_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", p.id);

        const { count: replyCount } = await supabase
          .from("community_replies")
          .select("*", { count: "exact", head: true })
          .eq("post_id", p.id);

        const { data: userLike } = await supabase
          .from("community_likes")
          .select("id")
          .eq("post_id", p.id)
          .eq("user_id", user.id)
          .maybeSingle();

        return {
          ...p,
          author_name: profile?.full_name || "Anonyme",
          like_count: likeCount || 0,
          reply_count: replyCount || 0,
          user_liked: !!userLike,
        };
      })
    );

    setPosts(enriched);
    setLoadingPosts(false);
  }, [user]);

  // ─── Fetch replies for a post ───────────────────────────
  const fetchReplies = useCallback(async (postId: string) => {
    if (!user) return;
    setLoadingReplies(true);
    const { data: repliesData } = await supabase
      .from("community_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    const enriched: Reply[] = await Promise.all(
      (repliesData || []).map(async (r: any) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", r.user_id)
          .single();

        const { count: likeCount } = await supabase
          .from("community_likes")
          .select("*", { count: "exact", head: true })
          .eq("reply_id", r.id);

        const { data: userLike } = await supabase
          .from("community_likes")
          .select("id")
          .eq("reply_id", r.id)
          .eq("user_id", user.id)
          .maybeSingle();

        return {
          ...r,
          author_name: profile?.full_name || "Anonyme",
          like_count: likeCount || 0,
          user_liked: !!userLike,
        };
      })
    );

    setReplies(enriched);
    setLoadingReplies(false);
  }, [user]);

  // ─── Channel selection ──────────────────────────────────
  const handleSelectChannel = (ch: Channel) => {
    setSelectedChannel(ch);
    setSelectedPost(null);
    setView("posts");
    fetchPosts(ch.id);
  };

  // ─── Post selection ─────────────────────────────────────
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setView("post-detail");
    fetchReplies(post.id);
  };

  // ─── Create channel (admin) ─────────────────────────────
  const handleCreateChannel = async (data: { title_fr: string; title_en: string; description_fr: string; description_en: string; emoji: string }) => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("community_channels").insert({
      ...data,
      created_by: user.id,
      sort_order: channels.length,
    });
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setShowCreateChannel(false);
      fetchChannels();
      toast({ title: lang === "ar" ? "Espace créé !" : "Channel created!" });
    }
  };

  // ─── Create post ────────────────────────────────────────
  const handleCreatePost = async (title: string, content: string) => {
    if (!user || !selectedChannel) return;
    setSubmitting(true);
    const { error } = await supabase.from("community_posts").insert({
      channel_id: selectedChannel.id,
      user_id: user.id,
      title,
      content,
    });
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setShowCreatePost(false);
      fetchPosts(selectedChannel.id);
      toast({ title: lang === "ar" ? "Post publié !" : "Post published!" });
    }
  };

  // ─── Reply ──────────────────────────────────────────────
  const handleReply = async (content: string) => {
    if (!user || !selectedPost) return;
    setSubmitting(true);
    const { error } = await supabase.from("community_replies").insert({
      post_id: selectedPost.id,
      user_id: user.id,
      content,
    });
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      fetchReplies(selectedPost.id);
      // Update reply count in local state
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, reply_count: p.reply_count + 1 } : p));
    }
  };

  // ─── Like / Unlike ─────────────────────────────────────
  const toggleLikePost = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("community_likes").insert({ post_id: postId, user_id: user.id });
    }
    // Refresh
    if (selectedChannel) fetchPosts(selectedChannel.id);
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, user_liked: !prev.user_liked, like_count: prev.like_count + (prev.user_liked ? -1 : 1) } : prev);
    }
  };

  const toggleLikeReply = async (replyId: string) => {
    if (!user) return;
    const reply = replies.find(r => r.id === replyId);
    if (!reply) return;

    if (reply.user_liked) {
      await supabase.from("community_likes").delete().eq("reply_id", replyId).eq("user_id", user.id);
    } else {
      await supabase.from("community_likes").insert({ reply_id: replyId, user_id: user.id });
    }
    if (selectedPost) fetchReplies(selectedPost.id);
  };

  // ─── Delete post (admin) ───────────────────────────────
  const handleDeletePost = async (postId: string) => {
    await supabase.from("community_posts").delete().eq("id", postId);
    if (selectedChannel) fetchPosts(selectedChannel.id);
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setView("posts");
    }
  };

  // ─── Toggle pin (admin) ────────────────────────────────
  const handleTogglePin = async (postId: string, pinned: boolean) => {
    await supabase.from("community_posts").update({ is_pinned: pinned }).eq("id", postId);
    if (selectedChannel) fetchPosts(selectedChannel.id);
  };

  // ─── Delete reply (admin) ──────────────────────────────
  const handleDeleteReply = async (replyId: string) => {
    await supabase.from("community_replies").delete().eq("id", replyId);
    if (selectedPost) fetchReplies(selectedPost.id);
  };

  // ─── Back navigation ───────────────────────────────────
  const handleBackToPosts = () => {
    setSelectedPost(null);
    setView("posts");
  };

  const handleBackToChannels = () => {
    setSelectedChannel(null);
    setSelectedPost(null);
    setView("channels");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-xl font-display font-extrabold dash-text tracking-tight mb-0.5">{lang === "ar" ? "المجتمع" : "Community"}</h1>
      <p className="dash-muted-text text-xs mt-0.5 mb-5">
        {lang === "ar" ? "تواصل مع سفراء سفارة." : "Connect with Sofara ambassadors."}
      </p>

      {/* Mobile: stacked views / Desktop: side-by-side */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Channel sidebar — always visible on desktop, conditional on mobile */}
        <div className={`lg:w-[260px] shrink-0 ${view !== "channels" ? "hidden lg:block" : ""}`}>
          <ChannelList
            channels={channels}
            selectedId={selectedChannel?.id || null}
            onSelect={handleSelectChannel}
            onCreateChannel={() => setShowCreateChannel(true)}
            loading={loadingChannels}
          />
        </div>

        {/* Main area */}
        <div className="flex-1 min-w-0">
          {view === "channels" && (
            <div className="lg:hidden text-center py-12">
              <MessageCircle className="w-10 h-10 mx-auto dash-muted-text mb-3" />
              <p className="text-sm dash-muted-text">
                {lang === "ar" ? "Sélectionnez un espace pour commencer." : "Select a channel to get started."}
              </p>
            </div>
          )}

          {view === "channels" && (
            <div className="hidden lg:flex items-center justify-center h-64">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 mx-auto dash-muted-text mb-3" />
                <p className="text-sm dash-muted-text">
                  {lang === "ar" ? "Sélectionnez un espace pour voir les discussions." : "Select a channel to see discussions."}
                </p>
              </div>
            </div>
          )}

          {view === "posts" && selectedChannel && (
            <>
              <button onClick={handleBackToChannels} className="lg:hidden flex items-center gap-1.5 text-xs dash-muted-text hover:text-[hsl(var(--dash-accent-ink))] transition-colors mb-3">
                ← {lang === "ar" ? "Espaces" : "Channels"}
              </button>
              <PostList
                posts={posts}
                channelTitle={`${selectedChannel.emoji} ${lang === "ar" ? selectedChannel.title_fr : selectedChannel.title_en}`}
                channelLocked={selectedChannel.is_locked}
                onSelectPost={handleSelectPost}
                onCreatePost={() => setShowCreatePost(true)}
                onLike={toggleLikePost}
                onDelete={handleDeletePost}
                onTogglePin={handleTogglePin}
                loading={loadingPosts}
              />
            </>
          )}

          {view === "post-detail" && selectedPost && (
            <PostDetail
              post={selectedPost}
              replies={replies}
              onBack={handleBackToPosts}
              onLikePost={() => toggleLikePost(selectedPost.id)}
              onLikeReply={toggleLikeReply}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
              replying={submitting}
              loadingReplies={loadingReplies}
            />
          )}
        </div>
      </div>

      <CreatePostDialog
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        submitting={submitting}
      />

      <CreateChannelDialog
        open={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onSubmit={handleCreateChannel}
        submitting={submitting}
      />
    </motion.div>
  );
};

export default Community;
