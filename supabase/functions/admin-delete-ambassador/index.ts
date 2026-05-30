import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const readTargetId = async (req: Request) => {
  const fromQuery = new URL(req.url).searchParams.get("user_id");
  if (fromQuery) return fromQuery;

  const raw = await req.text().catch(() => "");
  if (!raw) return undefined;

  try {
    const body = JSON.parse(raw);
    return body?.user_id ?? body?.id;
  } catch (_) {
    return new URLSearchParams(raw).get("user_id") ?? undefined;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isSuper } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "superadmin")
      .maybeSingle();
    if (!isSuper) {
      return json({ error: "Forbidden" }, 403);
    }

    const targetId = await readTargetId(req);
    if (!isUuid(targetId)) {
      console.error("Invalid or missing ambassador id", { targetId });
      return json({ error: "Invalid or missing ambassador id" }, 400);
    }
    if (targetId === userData.user.id) {
      return json({ error: "Cannot delete yourself" }, 400);
    }

    const { data: targetRole } = await admin.from("user_roles").select("role").eq("user_id", targetId).eq("role", "superadmin").maybeSingle();
    if (targetRole) return json({ error: "Cannot delete a super admin account" }, 400);

    // Clean public data first (no FK cascades)
    await admin.from("community_likes").delete().eq("user_id", targetId);
    await admin.from("community_replies").delete().eq("user_id", targetId);
    await admin.from("community_posts").delete().eq("user_id", targetId);
    await admin.from("lib_user_favorites").delete().eq("user_id", targetId);
    await admin.from("lib_user_recent_views").delete().eq("user_id", targetId);
    await admin.from("kyc_submissions").delete().eq("user_id", targetId);
    await admin.from("payments").delete().eq("user_id", targetId);
    await admin.from("commissions").delete().eq("user_id", targetId);
    await admin.from("leads").delete().eq("user_id", targetId);
    await admin.from("referral_bonuses").delete().or(`super_ambassador_id.eq.${targetId},godchild_id.eq.${targetId}`);
    await admin.from("user_roles").delete().eq("user_id", targetId);
    await admin.from("profiles").delete().eq("id", targetId);

    const { data: authUser } = await admin.auth.admin.getUserById(targetId);
    const { error: delErr } = authUser?.user ? await admin.auth.admin.deleteUser(targetId) : { error: null };
    if (delErr && !/not found/i.test(delErr.message)) {
      console.error("Auth user deletion failed", delErr.message);
      return json({ error: delErr.message }, 500);
    }

    return json({ ok: true });
  } catch (e) {
    console.error("admin-delete-ambassador failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
