// Stripe webhook (registered by Lovable payments): keeps profiles.profile_type in sync with subscriptions.
import { verifyWebhook, type StripeEnv } from "../_shared/stripe.ts";
import { corsHeaders, json, getStripe, syncProfileTier } from "../_shared/sofara-pro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Verify against whichever environment's secret matches.
  const body = await req.clone().text();
  let event: { type: string; data: { object: any } } | null = null;
  for (const env of ["live", "sandbox"] as StripeEnv[]) {
    try {
      event = await verifyWebhook(new Request(req.url, { method: "POST", headers: req.headers, body }), env);
      break;
    } catch (_e) { /* try the other environment */ }
  }
  if (!event) return json({ error: "Invalid signature" }, 400);

  try {
    const obj = event.data.object;
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = obj.metadata?.user_id ?? obj.client_reference_id;
        if (userId && obj.mode === "subscription") await syncProfileTier(userId, true);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        let userId: string | undefined = obj.metadata?.user_id;
        if (!userId && obj.customer) {
          // Fall back to the customer's email → auth user.
          const { stripe } = getStripe();
          const customer = await stripe.customers.retrieve(obj.customer as string);
          const email = (customer as { email?: string | null }).email;
          if (email) {
            const { getAdminClient } = await import("../_shared/sofara-pro.ts");
            const { data } = await getAdminClient().auth.admin.listUsers({ perPage: 1000 });
            userId = data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
          }
        }
        if (userId) {
          const active = obj.status === "active" || obj.status === "trialing";
          await syncProfileTier(userId, event.type === "customer.subscription.deleted" ? false : active);
        }
        break;
      }
      default:
        break;
    }
    return json({ received: true });
  } catch (e) {
    console.error("payments-webhook failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
