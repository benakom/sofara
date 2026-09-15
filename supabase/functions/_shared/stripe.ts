// Shared helpers for the Sofara Pro subscription edge functions.
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

export type Plan = "monthly" | "yearly";

// Sofara Pro pricing (USD cents). Yearly = 10 months → 2 months free.
export const PLANS: Record<Plan, { lookupKey: string; unitAmount: number; interval: "month" | "year"; nickname: string }> = {
  monthly: { lookupKey: "sofara_pro_monthly", unitAmount: 9900, interval: "month", nickname: "Sofara Pro — Monthly" },
  yearly: { lookupKey: "sofara_pro_yearly", unitAmount: 99000, interval: "year", nickname: "Sofara Pro — Yearly (2 months free)" },
};

export const PRODUCT_NAME = "Sofara Pro";

export function getStripe() {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2023-10-16", httpClient: Stripe.createFetchHttpClient() });
}

/** Resolves the calling user from the Authorization header. */
export async function getAuthUser(req: Request) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization") ?? "";
  const client = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const { data, error } = await client.auth.getUser();
  if (error || !data?.user?.email) return null;
  return data.user;
}

export function getAdminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

/** Finds the Stripe customer for an email, if any. */
export async function findCustomer(stripe: Stripe, email: string) {
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] ?? null;
}

/** Finds (or creates once) the recurring price for a plan, identified by a stable lookup key. */
export async function getOrCreatePrice(stripe: Stripe, plan: Plan) {
  const cfg = PLANS[plan];
  const existing = await stripe.prices.list({ lookup_keys: [cfg.lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0];

  // Reuse the Sofara Pro product if it exists, otherwise create it.
  const products = await stripe.products.search({ query: `name:'${PRODUCT_NAME}' AND active:'true'`, limit: 1 });
  const product = products.data[0] ?? await stripe.products.create({
    name: PRODUCT_NAME,
    description: "Oleadoo CRM, WhatsApp AI, AI marketing campaigns, AI agent, lead qualification and boosted commissions for Sofara ambassadors.",
  });

  return await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: cfg.unitAmount,
    recurring: { interval: cfg.interval },
    lookup_key: cfg.lookupKey,
    nickname: cfg.nickname,
  });
}

export function originFrom(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  return "https://www.sofara.io";
}
