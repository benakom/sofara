import { Link } from "react-router-dom";
import { PILLAR_FAQS } from "@/data/pillarFaqs";
import PillarPage from "@/components/seo/PillarPage";


const RealEstateReferralProgramDubai = () => (
  <PillarPage
    route="/real-estate-referral-program-dubai"
    eyebrow="Real estate referral program · Dubai & UAE · updated October 2026"
    intro="The Sofara real estate referral program in Dubai pays you for introducing property buyers: you refer, Cevitas Real Estate LLC (a RERA-licensed brokerage) handles the sale, and you earn 1% to 3% of the property price on every completed purchase. It is open to anyone, UAE resident or not, real estate agent or not, from any country, with no license and no fee. Below: who can join, how the referral fee is calculated, when it is paid, the agreement, the legal framework and how to submit your first lead."
    faqs={PILLAR_FAQS["/real-estate-referral-program-dubai"]}
    related={[
      { to: "/real-estate-affiliate-program-uae", label: "Real estate affiliate program in the UAE" },
      { to: "/dubai-real-estate-ambassadors", label: "Dubai real estate ambassadors network: how it works" },
      { to: "/real-estate-referral-fee-dubai", label: "Real estate referral fee in Dubai: how much and who pays" },
      { to: "/ambassador-program", label: "Ambassador program Dubai: apply for free" },
      { to: "/side-income-dubai-real-estate", label: "Side income in Dubai from property referrals" },
      { to: "/become-real-estate-agent-dubai", label: "Become a real estate agent in Dubai" },
      { to: "/blog/sofara-commission-structure-explained", label: "Commission structure explained" },
      { to: "/blog/how-to-become-dubai-real-estate-ambassador", label: "How to become a Dubai real estate ambassador" },
    ]}
    cta={{ title: "Join the Dubai real estate referral program", text: "Create your free account, get your referral link, and earn 1% to 3% of the price on every buyer you introduce. The licensed team handles the sale; you get paid." }}
  >
    <h2>What a real estate referral program is</h2>
    <p>A real estate referral program rewards the person who introduces a property buyer to a licensed brokerage. You do not sell, negotiate or sign anything. You make the introduction, the brokerage does every regulated step, and you receive a share of the commission once the purchase is completed.</p>
    <p>With Sofara, you are treated as an <Link to="/dubai-real-estate-ambassadors">ambassador</Link>: your lead is registered and protected for 12 months, you see each stage in real time, and the commission is a published rate of 1% to 3% of the property price, shown before you refer anyone. More than 700 active ambassadors use the program today.</p>

    <h2>Who can join the referral program</h2>
    <p>The program is open worldwide, with no license, no fee and no quota.</p>
    <ul>
      <li><strong>UAE residents</strong> whose colleagues, friends and clients ask about buying in Dubai or Abu Dhabi.</li>
      <li><strong>Non-residents</strong>: expatriates and diaspora communities in Europe, Africa, Asia and the Americas.</li>
      <li><strong>People who are not agents</strong>: financial advisors, wealth managers, relocation consultants, content creators, community leaders and entrepreneurs.</li>
      <li><strong>Licensed agents abroad</strong> who want to serve clients buying in Dubai while keeping their local business.</li>
    </ul>
    <p>A short identity check is completed before your first payout.</p>

    <h2>How the referral fee is calculated</h2>
    <p>Your referral fee is a percentage of the property price, from 1% to 3% depending on the project. It is paid out of the commission the brokerage receives, so the buyer pays nothing extra.</p>
    <table>
      <thead><tr><th>Question</th><th>How it works with Sofara</th></tr></thead>
      <tbody>
        <tr><td>Basis</td><td>The property price of the completed sale</td></tr>
        <tr><td>Rate</td><td>1% to 3%, shown per project in your dashboard before you refer</td></tr>
        <tr><td>Who pays</td><td>Sofara, out of the brokerage commission; nothing is added for the buyer</td></tr>
        <tr><td>When it is earned</td><td>SPA signed and down payment paid with the DLD fees</td></tr>
        <tr><td>When it is paid</td><td>Within 7 days once the client signs the SPA, in AED, by bank transfer</td></tr>
        <tr><td>Lead protection</td><td>12 months from the date you register the buyer</td></tr>
      </tbody>
    </table>
    <p>Read the <Link to="/blog/sofara-commission-structure-explained">full commission structure</Link>, or our guide to the <Link to="/real-estate-referral-fee-dubai">real estate referral fee in Dubai</Link> for how fees work across the market.</p>

    <h2>When and how the referral commission is paid</h2>
    <p>The commission moves through three states in your dashboard: <strong>estimated</strong> while the deal progresses, <strong>validated</strong> once the buyer has signed the SPA and paid the down payment with the DLD fees, and <strong>paid</strong> when the transfer is made. Payment is made in AED by bank transfer within 7 days once the client signs the SPA, against an invoice generated from your dashboard. If you live outside the UAE, declare it under your local tax rules.</p>

    <h2>Is there a referral agreement?</h2>
    <p>Yes. The referral terms are accepted when you create your account. They set the rate, the moment the commission is earned, how it is invoiced and how long your lead is protected. Nothing depends on a verbal promise: the rate for each project and the status of each lead are visible in writing in your dashboard.</p>

    <h2>Is it legal to refer buyers without a license?</h2>
    <p>In Dubai, brokerage work (advising, showing, negotiating and signing on behalf of a client) is regulated by RERA, the Real Estate Regulatory Agency of the Dubai Land Department, and must be carried out by a licensed brokerage. A referrer only introduces the buyer. In the Sofara program, every regulated step is carried out by Cevitas Real Estate LLC under its RERA license, so you never act as a broker. Each sale is registered with the Dubai Land Department and off-plan payments go to escrow accounts regulated by RERA.</p>

    <h2>How to submit a lead, step by step</h2>
    <ol>
      <li><strong>Create your free account</strong> and get a personal referral link.</li>
      <li><strong>Submit the buyer</strong> from your dashboard, with their consent, adding their budget and goal if you know them, or <strong>share your link</strong> so they sign up themselves.</li>
      <li><strong>The licensed team takes over:</strong> qualification call, project shortlist, viewings (on site or by video), offer, booking, down payment.</li>
      <li><strong>Follow every stage</strong> in your dashboard. You are notified when the offer is accepted and when the booking is paid.</li>
      <li><strong>Receive your commission</strong> in AED within 7 days once the client signs the SPA.</li>
    </ol>

    <h2>Attribution and lead protection</h2>
    <p>A lead is attributed to you as soon as you submit it or the buyer signs up through your link. It stays yours for 12 months, including when the buyer later contacts Sofara or Cevitas directly. If the purchase completes within that window, the commission is yours, even if it happens months after the introduction.</p>

    <h2>A property referral program for the whole UAE</h2>
    <p>Sofara is a property referral program for Dubai first, and for the rest of the UAE: Abu Dhabi, Ras Al Khaimah and Sharjah. The rules are the same everywhere: a published rate of 1% to 3% of the price, a contact protected for 12 months, and payment in AED within 7 days once the client signs the SPA. Buyers are supported with <Link to="/blog/dubai-payment-plans-explained">payment plan</Link> and <Link to="/blog/dubai-dld-fees-explained">DLD fee</Link> explanations in their language.</p>

    <h2>Referral, affiliate, ambassador or agent?</h2>
    <ul>
      <li><strong>Referral program</strong> (this page): you recommend a buyer and receive a referral fee when they buy.</li>
      <li><strong>Affiliate program</strong>: the same reward with link-based tracking. See the <Link to="/real-estate-affiliate-program-uae">real estate affiliate program in the UAE</Link>.</li>
      <li><strong>Ambassador</strong>: Sofara's name for its referrers, who also get training, project material and a community. Join through the <Link to="/ambassador-program">ambassador program in Dubai</Link>.</li>
      <li><strong>Licensed agent</strong>: a RERA-registered broker who advises, shows and closes. Read <Link to="/become-real-estate-agent-dubai">how to become a real estate agent in Dubai</Link>.</li>
    </ul>
  </PillarPage>
);

export default RealEstateReferralProgramDubai;
