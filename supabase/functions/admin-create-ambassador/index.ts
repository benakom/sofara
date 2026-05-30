import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isSuper } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "superadmin").maybeSingle();
    if (!isSuper) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.full_name ?? "").trim();
    const phone = String(body.phone ?? "").trim() || null;
    const country = String(body.country ?? "").trim() || null;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Valid email is required" }, 400);
    if (!password || password.length < 8) return json({ error: "Password must contain at least 8 characters" }, 400);
    if (!fullName) return json({ error: "Full name is required" }, 400);

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone },
    });
    if (createErr || !created?.user) return json({ error: createErr?.message ?? "Unable to create ambassador" }, 400);

    const profilePayload = {
      id: created.user.id,
      full_name: fullName,
      phone,
      country,
      profile_type: "referrer",
      status: "approved",
      accepted_terms: true,
      accepted_terms_at: new Date().toISOString(),
    };

    const { error: profileErr } = await admin.from("profiles").upsert(profilePayload, { onConflict: "id" });
    const { error: roleErr } = await admin.from("user_roles").upsert({ user_id: created.user.id, role: "user" }, { onConflict: "user_id,role" });

    if (profileErr || roleErr) {
      await admin.auth.admin.deleteUser(created.user.id).catch(() => null);
      return json({ error: profileErr?.message ?? roleErr?.message ?? "Unable to initialize ambassador" }, 500);
    }

    return json({ ok: true, ambassador: profilePayload });
  } catch (e) {
    console.error("admin-create-ambassador failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});