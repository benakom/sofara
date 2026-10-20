import type { PageKey } from "@/i18n/locales";
import type { PillarContent } from "./types";

export const EN_PILLARS: Partial<Record<PageKey, PillarContent>> = {
  affiliate: {
    title: "UAE Real Estate Affiliate Program: Earn up to 3% | Sofara",
    description:
      "Join the Dubai and UAE real estate affiliate program run by Sofara and Cevitas. Refer property buyers, track every lead and earn up to 3% commission in AED.",
    h1: "The UAE Real Estate Affiliate Program for Dubai Property",
    eyebrow: "Affiliate program · Dubai, Abu Dhabi, Ras Al Khaimah",
    intro:
      "Sofara is a **real estate affiliate program** built for Dubai and the wider UAE. Affiliates, whom we call ambassadors, introduce people who want to buy property in the Emirates. A RERA-licensed brokerage, Cevitas Real Estate LLC, handles the advice, the viewings and the paperwork. When the sale goes through, the affiliate earns up to 3% of the property price, paid in AED.",
    sections: [
      {
        h2: "What a real estate affiliate program is",
        blocks: [
          { p: "An affiliate program rewards a person for introducing a customer. In e-commerce the reward is a few percent of a basket. In UAE real estate the same principle applies to transactions worth hundreds of thousands, sometimes millions of dirhams, which is why a single referral can be worth more than a month of salary." },
          { p: "Developers in Dubai pay registered brokerages a commission on every off-plan sale, usually between 2% and 5% of the price. Sofara shares a large part of that commission with the affiliate who brought the buyer. The affiliate does not sell, negotiate or sign anything: the licensed team does, which keeps the activity simple and fully compliant." },
        ],
      },
      {
        h2: "How the Sofara affiliate program works",
        blocks: [
          { ol: [
            "**Create a free account.** Sign up in two minutes from any country. No license, no fee, no monthly target.",
            "**Share your link or submit a lead.** Every affiliate gets a personal referral link and a form to register a buyer directly from the dashboard.",
            "**Let the Cevitas team advise the buyer.** Qualification, project selection, video or on-site viewings, reservation and SPA are handled by licensed agents.",
            "**Follow each stage.** The dashboard shows where every lead stands, from first contact to down payment.",
            "**Get paid in AED.** The commission is earned once the buyer signs the SPA and pays the down payment with the DLD fees. It is paid by bank transfer within 7 days of the developer paying Cevitas.",
          ] },
        ],
      },
      {
        h2: "Commission rates and examples",
        blocks: [
          { p: "Rates depend on the developer and are visible before you refer anyone. A few typical examples:" },
          { table: {
            head: ["Developer", "Affiliate rate", "On a AED 1.5M apartment", "On a AED 4M villa"],
            rows: [
              ["Emaar Properties", "3%", "AED 45,000", "AED 120,000"],
              ["Sobha Realty", "3%", "AED 45,000", "AED 120,000"],
              ["DAMAC Properties", "2.5%", "AED 37,500", "AED 100,000"],
            ],
          } },
          { p: "Each lead stays attached to your account for 12 months, so a buyer who takes time to decide still counts as yours. You can read the full [commission structure](/blog/sofara-commission-structure-explained) on the blog." },
        ],
      },
      {
        h2: "Who joins a Dubai real estate affiliate program",
        blocks: [
          { ul: [
            "**Diaspora communities** in Europe, Africa and Asia whose friends and family ask how to invest in Dubai.",
            "**Content creators** in finance, travel and lifestyle who already talk about Dubai.",
            "**Financial advisors, accountants and relocation consultants** whose clients move capital or residency to the UAE.",
            "**Licensed agents abroad** who want to serve clients buying in Dubai without opening a UAE office.",
            "**Entrepreneurs and professionals** with a strong network who want an income stream next to their main activity.",
          ] },
        ],
      },
      {
        h2: "Why the UAE is a strong market for property affiliates",
        blocks: [
          { p: "The UAE combines high transaction volumes, buyers from more than 180 nationalities and a clear legal framework. Dubai Land Department records every sale, off-plan payments go into escrow accounts regulated by RERA, and freehold areas are open to foreign buyers. Abu Dhabi and Ras Al Khaimah add new master communities each year." },
          { p: "For buyers, the attraction is well known: no annual property tax, rental yields that often sit between 5% and 8% gross, flexible payment plans on new projects and a 10-year Golden Visa for property investments of AED 2 million or more. For an affiliate, this means a steady flow of people who are genuinely interested and need a trusted introduction." },
        ],
      },
      {
        h2: "Affiliate, referral or ambassador: what is the difference?",
        blocks: [
          { p: "The terms are often used interchangeably. A **referral program** usually means a one-off reward for recommending someone. An **affiliate program** adds tracking, a dashboard and recurring earnings. Sofara calls its affiliates **ambassadors** because they also get training, AI tools and a community. You can compare the approaches on the [Dubai real estate referral program](/real-estate-referral-program-dubai) page and learn how the [ambassadors network](/dubai-real-estate-ambassadors) is organised." },
        ],
      },
    ],
    faqs: [
      { q: "Do I need a real estate license to join the affiliate program?", a: "No. Affiliates introduce buyers; Cevitas Real Estate LLC, a RERA-licensed brokerage, carries out all regulated activity. You can join from any country." },
      { q: "How much can a real estate affiliate earn in the UAE?", a: "Up to 3% of the property price depending on the developer, for example AED 45,000 on a AED 1.5 million apartment sold by Emaar or Sobha." },
      { q: "When is the affiliate commission paid?", a: "It is earned when the buyer signs the SPA and pays the down payment with the DLD fees, then paid in AED by bank transfer within 7 days of the developer paying Cevitas, against an invoice issued from your dashboard." },
      { q: "Does the program cover Abu Dhabi and other emirates?", a: "Yes. Sofara focuses on Dubai and also covers projects in Abu Dhabi, Ras Al Khaimah and Sharjah through Cevitas." },
      { q: "Is there a fee or a minimum number of referrals?", a: "No. Joining is free and there is no quota. You earn only when a sale you introduced is completed." },
      { q: "How are my leads protected?", a: "Every lead is linked to your account for 12 months, including when the buyer contacts Sofara or Cevitas directly." },
    ],
    cta: {
      title: "Join the UAE real estate affiliate program",
      text: "Create your free account, share your link and let a licensed Dubai team turn your introductions into commissions.",
    },
    related: ["ambassadors", "agent", "invest", "home"],
  },
};
