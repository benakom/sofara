// Creates a Stripe Checkout session (via the Lovable payments gateway) for a Sofara Pro subscription.
import { corsHeaders, json, getStripe, getAuthUser, findCustomer, getOrCreatePrice, originFrom, type Plan } from "../_shared/sofara-pro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const user = await getAuthUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const plan: Plan = body.plan === "yearly" ? "yearly" : "monthly";

    const { stripe, env } = getStripe();
    const customer = await findCustomer(stripe, user.email!);
    const price = await getOrCreatePrice(stripe, plan);
    const origin = originFrom(req);

    const session = await stripe.checkout.sessions.create({
      ...(customer ? { customer: customer.id } : { customer_email: user.email! }),
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard/pro?checkout=success`,
      cancel_url: `${origin}/dashboard/pro?checkout=cancel`,
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan },
      subscription_data: { metadata: { user_id: user.id, plan } },
    });

    return json({ url: session.url, env });
  } catch (e) {
    console.error("create-checkout failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
