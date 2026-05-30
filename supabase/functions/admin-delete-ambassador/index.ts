import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

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
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isSuper } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "superadmin")
      .maybeSingle();
    if (!isSuper) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const targetId = await readTargetId(req);
    if (!isUuid(targetId)) {
      console.error("Invalid or missing ambassador id", { targetId });
      return new Response(JSON.stringify({ error: "Invalid or missing ambassador id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (targetId === userData.user.id) {
      return new Response(JSON.stringify({ error: "Cannot delete yourself" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

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

    const { error: delErr } = await admin.auth.admin.deleteUser(targetId);
    if (delErr && !/not found/i.test(delErr.message)) {
      console.error("Auth user deletion failed", delErr.message);
      return new Response(JSON.stringify({ error: delErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
