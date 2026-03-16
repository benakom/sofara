
-- Community Channels (categories/spaces)
CREATE TABLE public.community_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr text NOT NULL,
  title_en text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '💬',
  sort_order integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Community Posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Community Replies
CREATE TABLE public.community_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Community Likes (on posts or replies)
CREATE TABLE public.community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.community_replies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_reply_like UNIQUE (user_id, reply_id),
  CONSTRAINT like_target_check CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR 
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- RLS: community_channels
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view channels" ON public.community_channels
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Superadmins can insert channels" ON public.community_channels
  FOR INSERT TO authenticated WITH CHECK (is_superadmin());

CREATE POLICY "Superadmins can update channels" ON public.community_channels
  FOR UPDATE TO authenticated USING (is_superadmin());

CREATE POLICY "Superadmins can delete channels" ON public.community_channels
  FOR DELETE TO authenticated USING (is_superadmin());

-- RLS: community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view posts" ON public.community_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Approved users can create posts" ON public.community_posts
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id AND get_profile_status(auth.uid()) = 'approved');

CREATE POLICY "Users can update own posts" ON public.community_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can update any post" ON public.community_posts
  FOR UPDATE TO authenticated USING (is_superadmin());

CREATE POLICY "Users can delete own posts" ON public.community_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can delete any post" ON public.community_posts
  FOR DELETE TO authenticated USING (is_superadmin());

-- RLS: community_replies
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view replies" ON public.community_replies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Approved users can create replies" ON public.community_replies
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id AND get_profile_status(auth.uid()) = 'approved');

CREATE POLICY "Users can update own replies" ON public.community_replies
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can update any reply" ON public.community_replies
  FOR UPDATE TO authenticated USING (is_superadmin());

CREATE POLICY "Users can delete own replies" ON public.community_replies
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can delete any reply" ON public.community_replies
  FOR DELETE TO authenticated USING (is_superadmin());

-- RLS: community_likes
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view likes" ON public.community_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Approved users can like" ON public.community_likes
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id AND get_profile_status(auth.uid()) = 'approved');

CREATE POLICY "Users can unlike own likes" ON public.community_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for posts and replies
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_replies;
