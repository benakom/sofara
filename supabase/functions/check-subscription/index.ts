// Checks the caller's Sofara Pro subscription in Stripe and syncs profiles.profile_type.
import { corsHeaders, json, getStripe, getAuthUser, getAdminClient, findCustomer } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const user = await getAuthUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const admin = getAdminClient();
    const { data: profile } = await admin.from("profiles").select("profile_type").eq("id", user.id).maybeSingle();
    const currentType = profile?.profile_type ?? "referrer";

    // Stripe not configured yet: fall back to the profile flag (manual Pro access keeps working).
    if (!Deno.env.get("STRIPE_SECRET_KEY")) {
      return json({ subscribed: currentType === "pro", plan: null, subscription_end: null, source: currentType === "pro" ? "manual" : null });
    }

    const stripe = getStripe();
    const customer = await findCustomer(stripe, user.email!);

    // No Stripe customer: nothing to sync. Pro access granted manually by an admin stays untouched.
    if (!customer) {
      return json({ subscribed: currentType === "pro", plan: null, subscription_end: null, source: currentType === "pro" ? "manual" : null });
    }

    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
    const active = subs.data.find((s) => s.status === "active" || s.status === "trialing");

    if (active) {
      const interval = active.items.data[0]?.price?.recurring?.interval;
      const plan = interval === "year" ? "yearly" : "monthly";
      const subscription_end = new Date(active.current_period_end * 1000).toISOString();
      if (currentType !== "pro") {
        await admin.from("profiles").update({ profile_type: "pro" }).eq("id", user.id);
      }
      return json({ subscribed: true, plan, subscription_end, cancel_at_period_end: active.cancel_at_period_end, source: "stripe" });
    }

    // Had a Stripe subscription before, but none is active now → downgrade to the basic space.
    if (currentType === "pro" && subs.data.length > 0) {
      await admin.from("profiles").update({ profile_type: "referrer" }).eq("id", user.id);
    }
    return json({ subscribed: false, plan: null, subscription_end: null, source: null });
  } catch (e) {
    console.error("check-subscription failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
