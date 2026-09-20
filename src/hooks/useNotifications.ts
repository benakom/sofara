import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface AppNotification {
  id: string;
  type: "lead_stage" | "lead_note" | "new_lead" | "commission" | "system";
  lead_id: string | null;
  event_id: string | null;
  data: {
    lead_id?: string;
    lead_name?: string;
    lead_first_name?: string;
    from_stage?: string | null;
    to_stage?: string | null;
    note?: string | null;
    ambassador_id?: string;
    ambassador_name?: string | null;
    title?: string;
    body?: string;
  };
  url: string | null;
  read_at: string | null;
  created_at: string;
}

const LIMIT = 40;

/** Current user's in-app notifications, kept live through Supabase realtime. */
export const useNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("notifications")
      .select("id, type, lead_id, event_id, data, url, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    setItems((data ?? []) as AppNotification[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        const row = payload.new as AppNotification;
        setItems((prev) => (prev.some((n) => n.id === row.id) ? prev : [row, ...prev].slice(0, LIMIT)));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        const row = payload.new as AppNotification;
        setItems((prev) => prev.map((n) => (n.id === row.id ? { ...n, ...row } : n)));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unread = items.filter((n) => !n.read_at).length;

  const markRead = useCallback(async (id: string) => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at ?? now } : n)));
    await supabase.from("notifications").update({ read_at: now }).eq("id", id).is("read_at", null);
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    await supabase.from("notifications").update({ read_at: now }).eq("user_id", user.id).is("read_at", null);
  }, [user]);

  return { items, unread, loading, markRead, markAllRead, refresh: load };
};
