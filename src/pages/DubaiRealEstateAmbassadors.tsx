import { Link } from "react-router-dom";
import PillarPage from "@/components/seo/PillarPage";

const faqs = [
  { q: "What is a Dubai real estate ambassador?", a: "A real estate ambassador is a person who introduces potential property buyers to a licensed Dubai brokerage and earns a commission when a sale completes. Ambassadors do not need a RERA license because they never negotiate or sign on behalf of the buyer: the licensed brokerage does. Sofara ambassadors work with Cevitas Real Estate LLC, RERA-licensed in Dubai." },
  { q: "How much do Dubai real estate ambassadors earn?", a: "Sofara pays up to 3% of the property price, typically AED 37,000 to AED 120,000 per closed deal on Emaar, DAMAC, Sobha and other developer projects. Commissions are paid in AED by international bank transfer within 7 days of closing." },
  { q: "Who can become an ambassador?", a: "Anyone with a network of people interested in Dubai property: expatriates, diaspora community leaders, financial advisors, content creators, real estate agents based abroad, entrepreneurs. There is no age, nationality or residency requirement, and no license or fee." },
  { q: "Is the ambassador model legal?", a: "Yes. The ambassador acts as a business introducer. The brokerage that closes the transaction, Cevitas Real Estate LLC, holds the RERA license and complies with Dubai Land Department rules. You are not acting as a real estate agent in your own country." },
  { q: "How is the ambassadors network different from an agency?", a: "An agency employs licensed agents based in Dubai. An ambassadors network connects independent people worldwide, each bringing buyers from their own community, to one licensed closing team. Sofara adds a shared platform: referral links, AI lead qualification, WhatsApp automation, CRM and real-time commission tracking." },
  { q: "How do I track my leads and commissions?", a: "Every ambassador has a dashboard showing each lead's qualification stage, updated by the Sofara team, plus a commission tracker that moves from estimated to validated to paid." },
];

const DubaiRealEstateAmbassadors = () => (
  <PillarPage
    route="/dubai-real-estate-ambassadors"
    eyebrow="The ambassadors network · Dubai & UAE"
    intro="Dubai real estate ambassadors are the people who bring buyers to Dubai property from every corner of the world, without holding a license themselves. This page explains how the ambassadors network works, what an ambassador does day to day, how the commission is calculated and paid, and how to join Sofara, the network built by Cevitas Real Estate."
    faqs={faqs}
    related={[
      { to: "/ambassador-program", label: "Sofara ambassador program: steps, commissions, tools" },
      { to: "/real-estate-referral-program-dubai", label: "Dubai real estate referral program explained" },
      { to: "/become-real-estate-agent-dubai", label: "Become a real estate agent in Dubai (licensed vs ambassador)" },
      { to: "/blog/ambassador-success-stories", label: "Ambassador success stories" },
      { to: "/blog/dubai-real-estate-ambassadors-network", label: "Inside the Dubai real estate ambassadors network" },
      { to: "/blog/uae-real-estate-ambassadors-network", label: "The UAE ambassadors network beyond Dubai" },
    ]}
    cta={{ title: "Become a Dubai real estate ambassador", text: "Join hundreds of ambassadors in more than 40 countries. Refer buyers to Emaar, DAMAC and Sobha projects, follow every lead in your dashboard, and get paid in AED." }}
  >
    <h2>Why Dubai created a new role in real estate</h2>
    <p>Dubai sells property to buyers from more than 180 nationalities. Most of those buyers do not start their search on a Dubai portal: they ask a friend, a relative, a financial advisor or a creator they trust in their own country. Traditional agencies, staffed with licensed agents sitting in Dubai, cannot reach those conversations. The <strong>real estate ambassador</strong> role fills that gap: a trusted person abroad introduces the buyer, and a licensed team in Dubai does the rest.</p>
    <p>Sofara formalised this into the <strong>Dubai Real Estate Ambassadors Network</strong>, operated by Cevitas Real Estate LLC, a RERA-licensed brokerage. Ambassadors share one platform, one closing team and one commission policy, whichever country they live in.</p>

    <h2>What an ambassador actually does</h2>
    <ul>
      <li><strong>Spot interest.</strong> Someone in your network mentions Dubai, the Golden Visa, rental yields or a new launch. You share your referral link or submit their details in your dashboard.</li>
      <li><strong>Let the team qualify.</strong> Sofara's AI-assisted qualification and the Cevitas sales team contact the lead, understand budget and goals, and shortlist projects.</li>
      <li><strong>Follow the progress.</strong> Your dashboard shows the lead moving through the stages: new, prequalified, qualified, offer sent, offer accepted, booking paid, down payment paid. Stages are updated by the Sofara team, so the information is always accurate.</li>
      <li><strong>Get paid.</strong> Once the sale closes, your commission is estimated, validated and paid within 7 days, in AED.</li>
    </ul>
    <p>You never negotiate prices, draft contracts or handle escrow. That is precisely why no license is required and why the model works from abroad.</p>

    <h2>How the commission works</h2>
    <p>Developers pay brokerages a commission on off-plan sales, generally between 2% and 5% of the price. Sofara passes up to 3% to the ambassador who introduced the buyer. On a one-bedroom apartment sold at AED 1.5 million, the ambassador earns up to AED 45,000; on a AED 4 million villa, up to AED 120,000. The <Link to="/blog/sofara-commission-structure-explained">commission structure</Link> is published in advance, and each lead is protected under your referral for 12 months.</p>
    <table>
      <thead><tr><th>Developer</th><th>Ambassador rate</th><th>Typical commission per deal</th></tr></thead>
      <tbody>
        <tr><td>Emaar Properties</td><td>3%</td><td>AED 60K to 150K</td></tr>
        <tr><td>DAMAC Properties</td><td>2.5%</td><td>AED 45K to 120K</td></tr>
        <tr><td>Sobha Realty</td><td>3%</td><td>AED 60K to 130K</td></tr>
        <tr><td>Nakheel, Aldar, Binghatti</td><td>2.5% to 3%</td><td>AED 40K to 140K</td></tr>
      </tbody>
    </table>

    <h2>Who succeeds as an ambassador</h2>
    <p>The best ambassadors are not salespeople. They are people others already trust on money and relocation decisions: expatriates in Europe, Africa, the Gulf and Asia; financial and wealth advisors; content creators with property-interested audiences; business owners in diaspora communities; and real estate professionals abroad who want a Dubai desk without opening an office. If you already get asked "is Dubai a good idea?", you have the raw material.</p>

    <h2>The tools ambassadors get</h2>
    <p>Sofara is a software platform as much as a network. Every ambassador receives a personal referral link, a dashboard with lead tracking and commission follow-up, AI lead scoring, WhatsApp follow-up automation, sales scripts and role-play training, a project library with verified brochures and payment plans, and simulators for <Link to="/blog/dubai-dld-fees-explained">DLD fees</Link> and <Link to="/blog/dubai-payment-plans-explained">payment plans</Link>. The <Link to="/blog/ai-tools-real-estate-ambassadors">AI tools</Link> are included for free.</p>

    <h2>Ambassador vs licensed agent vs classic referral</h2>
    <p>A <Link to="/become-real-estate-agent-dubai">licensed agent</Link> needs a visa, the DREI course and the RERA exam, and works from Dubai. A classic developer <Link to="/real-estate-referral-program-dubai">referral program</Link> pays a one-off fee, often 0.5% to 1.5%, with little visibility on the deal. The ambassador model sits in between: no license, higher commission than a referral fee, full visibility on the lead, and a team that closes for you.</p>

    <h2>How to join the network</h2>
    <ol>
      <li>Create your free account on Sofara (two minutes, no documents required to start).</li>
      <li>Complete your profile and, before your first payout, a short KYC verification.</li>
      <li>Share your referral link or submit your first lead from the dashboard.</li>
    </ol>
    <p>Read the full <Link to="/ambassador-program">ambassador program</Link> page for the step-by-step onboarding, or the <Link to="/blog/how-to-become-dubai-real-estate-ambassador">guide to becoming an ambassador</Link>.</p>
  </PillarPage>
);

export default DubaiRealEstateAmbassadors;
