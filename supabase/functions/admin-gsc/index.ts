import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = "https://sofara.io/";
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function gsc(path: string, init: RequestInit = {}) {
  const r = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY!,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`GSC ${r.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

function dateRange(days = 28) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY || !GSC_KEY) {
      return new Response(JSON.stringify({ error: "GSC connector not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify superadmin
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = (roles ?? []).some((r: any) => r.role === "superadmin");
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { action, days = 28, url } = await req.json().catch(() => ({ action: "overview" }));
    const site = encodeURIComponent(SITE_URL);
    const range = dateRange(days);

    if (action === "overview") {
      const totals = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: [] }),
      });
      const byDate = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: ["date"], rowLimit: 90 }),
      });
      return new Response(JSON.stringify({ totals, byDate, range }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "pages") {
      const data = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: ["page"], rowLimit: 100 }),
      });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "queries") {
      const data = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: ["query"], rowLimit: 100 }),
      });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "countries") {
      const data = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: ["country"], rowLimit: 50 }),
      });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "devices") {
      const data = await gsc(`/webmasters/v3/sites/${site}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ ...range, dimensions: ["device"], rowLimit: 10 }),
      });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "sitemaps") {
      const data = await gsc(`/webmasters/v3/sites/${site}/sitemaps`);
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "inspect" && url) {
      const data = await gsc(`/v1/urlInspection/index:inspect`, {
        method: "POST",
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
      });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "resubmit_sitemap") {
      const sm = encodeURIComponent("https://sofara.io/sitemap.xml");
      await gsc(`/webmasters/v3/sites/${site}/sitemaps/${sm}`, { method: "PUT" });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
