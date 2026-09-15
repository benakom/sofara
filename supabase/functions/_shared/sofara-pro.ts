// Sofara Pro subscription helpers built on the Lovable payments gateway (see ./stripe.ts).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@22.0.2";
import { createStripeClient, type StripeEnv } from "./stripe.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

export type Plan = "monthly" | "yearly";

// Sofara Pro pricing (USD cents). Yearly = 10 months, i.e. 2 months free.
export const PLANS: Record<Plan, { lookupKey: string; unitAmount: number; interval: "month" | "year"; nickname: string }> = {
  monthly: { lookupKey: "sofara_pro_monthly", unitAmount: 9900, interval: "month", nickname: "Sofara Pro — Monthly" },
  yearly: { lookupKey: "sofara_pro_yearly", unitAmount: 99000, interval: "year", nickname: "Sofara Pro — Yearly (2 months free)" },
};

export const PRODUCT_NAME = "Sofara Pro";

/** Live once Lovable has provisioned the live connection (after go-live), sandbox otherwise. */
export function currentEnv(): StripeEnv {
  return Deno.env.get("STRIPE_LIVE_API_KEY") ? "live" : "sandbox";
}

export function getStripe(): { stripe: Stripe; env: StripeEnv } {
  const env = currentEnv();
  return { stripe: createStripeClient(env), env };
}

/** Resolves the calling user from the Authorization header. */
export async function getAuthUser(req: Request) {
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data?.user?.email) return null;
  return data.user;
}

export function getAdminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

export async function findCustomer(stripe: Stripe, email: string) {
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] ?? null;
}

/** Finds (or creates once) the recurring price for a plan, identified by a stable lookup key. */
export async function getOrCreatePrice(stripe: Stripe, plan: Plan) {
  const cfg = PLANS[plan];
  const existing = await stripe.prices.list({ lookup_keys: [cfg.lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0];

  const products = await stripe.products.list({ active: true, limit: 100 });
  const product = products.data.find((p) => p.name === PRODUCT_NAME) ?? await stripe.products.create({
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

/** Sets the member's tier from a Stripe subscription status. Never touches admin-granted Pro without a Stripe history. */
export async function syncProfileTier(userId: string, subscribed: boolean) {
  const admin = getAdminClient();
  const { data: profile } = await admin.from("profiles").select("profile_type").eq("id", userId).maybeSingle();
  const current = profile?.profile_type ?? "referrer";
  if (subscribed && current !== "pro") {
    await admin.from("profiles").update({ profile_type: "pro" }).eq("id", userId);
  } else if (!subscribed && current === "pro") {
    await admin.from("profiles").update({ profile_type: "referrer" }).eq("id", userId);
  }
}

export function planFromSubscription(sub: Stripe.Subscription): Plan {
  return sub.items.data[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly";
}

export function periodEnd(sub: Stripe.Subscription): string | null {
  const end = sub.items.data[0]?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}
