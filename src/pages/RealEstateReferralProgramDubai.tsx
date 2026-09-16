import { Link } from "react-router-dom";
import { PILLAR_FAQS } from "@/data/pillarFaqs";
import PillarPage from "@/components/seo/PillarPage";


const RealEstateReferralProgramDubai = () => (
  <PillarPage
    route="/real-estate-referral-program-dubai"
    eyebrow="Referral program · up to 3% commission"
    intro="Most Dubai referral programs pay a small one-off fee and leave you in the dark. Sofara's real estate referral program pays up to 3% of the property price on Emaar, DAMAC, Sobha and other developer projects, shows you every step of the deal, and pays in AED within 7 days of closing. Free to join, no license required."
    faqs={PILLAR_FAQS["/real-estate-referral-program-dubai"]}
    related={[
      { to: "/dubai-real-estate-ambassadors", label: "Dubai real estate ambassadors: the network explained" },
      { to: "/ambassador-program", label: "Sofara ambassador program" },
      { to: "/become-real-estate-agent-dubai", label: "Become a real estate agent in Dubai" },
      { to: "/blog/sofara-commission-structure-explained", label: "Commission structure explained" },
      { to: "/dubai-off-plan-properties", label: "Dubai off-plan properties: what buyers ask" },
      { to: "/blog/emaar-properties-guide", label: "Emaar Properties guide" },
    ]}
    cta={{ title: "Join the Dubai real estate referral program", text: "Create your free account, get your referral link, and earn up to 3% on every buyer you introduce. The Cevitas team closes; you get paid." }}
  >
    <h2>How real estate referral programs work in Dubai</h2>
    <p>Dubai developers and brokerages have always rewarded introductions. A developer's referral program typically pays a fixed fee or 0.5% to 1.5% to an existing owner or partner who brings a buyer. Brokerages sometimes pay a share of their commission to an introducer. The problems are the same everywhere: low rates, no visibility on what happens to your contact, and slow, opaque payment.</p>
    <p>Sofara redesigned the model around the referrer. You are treated as an <Link to="/dubai-real-estate-ambassadors">ambassador</Link>: your lead is registered and protected for 12 months, you see each qualification stage in real time, and the commission is a published rate of up to 3%, not a discretionary bonus.</p>

    <h2>What you earn</h2>
    <table>
      <thead><tr><th>Program type</th><th>Typical payout</th><th>Visibility</th><th>Payment</th></tr></thead>
      <tbody>
        <tr><td>Developer referral scheme</td><td>Fixed fee or 0.5% to 1.5%</td><td>None</td><td>30 to 90 days</td></tr>
        <tr><td>Agency introducer fee</td><td>10% to 30% of the agency commission</td><td>Limited</td><td>After the agency is paid</td></tr>
        <tr><td>Sofara referral program</td><td>Up to 3% of the price</td><td>Stage-by-stage dashboard</td><td>Within 7 days of closing</td></tr>
      </tbody>
    </table>
    <p>Concretely, a AED 2 million apartment at Emaar Creek Harbour can earn the referrer up to AED 60,000. A AED 3.5 million Sobha villa, up to AED 105,000. Several ambassadors exceed AED 90,000 in a single month. Read the <Link to="/blog/sofara-commission-structure-explained">full commission structure</Link> for the rate per developer.</p>

    <h2>Who can join</h2>
    <p>The program is open worldwide, with no license, no fee and no quota. It is built for expatriates and diaspora communities, financial advisors and wealth managers, real estate agents based outside the UAE, content creators and community leaders, and anyone who regularly hears "I'm thinking of buying in Dubai".</p>

    <h2>How to refer a buyer, step by step</h2>
    <ol>
      <li><strong>Create your free account</strong> and get a personal referral link.</li>
      <li><strong>Share the link</strong> or submit the buyer's details directly from your dashboard, with their budget and goal if you know them.</li>
      <li><strong>The Cevitas team takes over:</strong> qualification call, project shortlist, viewings (on site or virtual), offer, booking, down payment.</li>
      <li><strong>Follow every stage</strong> in your dashboard. You are notified when the offer is accepted and when the booking is paid.</li>
      <li><strong>Receive your commission</strong> within 7 days of closing, in AED, by bank transfer.</li>
    </ol>

    <h2>Why buyers convert better through Sofara</h2>
    <p>Buyers introduced by someone they trust convert several times better than portal leads. Sofara amplifies that with AI lead qualification, WhatsApp follow-ups in the buyer's language, verified project brochures and simulators for <Link to="/blog/dubai-payment-plans-explained">payment plans</Link> and <Link to="/blog/dubai-dld-fees-explained">DLD fees</Link>. You bring the trust; the platform brings the precision.</p>

    <h2>Referral program vs becoming an agent</h2>
    <p>If you would rather sell yourself from Dubai, read our guide on <Link to="/become-real-estate-agent-dubai">how to become a real estate agent in Dubai</Link>. If you want income from Dubai property without a visa, a license or a change of career, the referral program is the fastest path, and you can start today from the <Link to="/ambassador-program">ambassador program</Link> page.</p>
  </PillarPage>
);

export default RealEstateReferralProgramDubai;
