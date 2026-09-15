// Opens the Stripe billing portal (via the Lovable gateway) so a Pro member can manage or cancel.
import { corsHeaders, json, getStripe, getAuthUser, findCustomer, originFrom } from "../_shared/sofara-pro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const user = await getAuthUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { stripe } = getStripe();
    const customer = await findCustomer(stripe, user.email!);
    if (!customer) return json({ error: "No Stripe customer found for this account" }, 404);

    const session = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: `${originFrom(req)}/dashboard/pro` });
    return json({ url: session.url });
  } catch (e) {
    console.error("customer-portal failed", e);
    return json({ error: (e as Error).message }, 500);
  }
});
