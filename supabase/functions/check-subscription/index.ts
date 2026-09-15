// Checks the caller's Sofara Pro subscription in Stripe (via the Lovable gateway) and syncs profiles.profile_type.
import { corsHeaders, json, getStripe, getAuthUser, getAdminClient, findCustomer, syncProfileTier, planFromSubscription, periodEnd } from "../_shared/sofara-pro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const user = await getAuthUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const admin = getAdminClient();
    const { data: profile } = await admin.from("profiles").select("profile_type").eq("id", user.id).maybeSingle();
    const currentType = profile?.profile_type ?? "referrer";
    const manual = { subscribed: currentType === "pro", plan: null, subscription_end: null, source: currentType === "pro" ? "manual" : null };

    // Payments not provisioned yet: fall back to the profile flag (manual Pro access keeps working).
    if (!Deno.env.get("STRIPE_SANDBOX_API_KEY") && !Deno.env.get("STRIPE_LIVE_API_KEY")) return json(manual);

    const { stripe, env } = getStripe();
    const customer = await findCustomer(stripe, user.email!);
    if (!customer) return json(manual);

    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
    const active = subs.data.find((s) => s.status === "active" || s.status === "trialing");

    if (active) {
      await syncProfileTier(user.id, true);
      return json({ subscribed: true, plan: planFromSubscription(active), subscription_end: periodEnd(active), cancel_at_period_end: active.cancel_at_period_end, source: "stripe", env });
    }

    // Had a Stripe subscription before, none active now → back to the basic space.
    if (subs.data.length > 0) await syncProfileTier(user.id, false);
    return json({ subscribed: false, plan: null, subscription_end: null, source: null, env });
  } catch (e) {
    console.error("check-subscription failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
