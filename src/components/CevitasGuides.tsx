/** Links to the Dubai & UAE real estate guides of Cevitas Real Estate (partner brokerage). */
const GUIDES_EN = [
  { href: "https://www.cevitas.ae/", label: "Cevitas, Dubai real estate agency" },
  { href: "https://www.cevitas.ae/uae-real-estate", label: "UAE real estate guide 2026" },
  { href: "https://www.cevitas.ae/off-plan-properties-dubai", label: "Off-plan properties in Dubai" },
  { href: "https://www.cevitas.ae/dubai-rental-yields", label: "Dubai rental yields by area" },
  { href: "https://www.cevitas.ae/abu-dhabi-real-estate", label: "Buy property in Abu Dhabi" },
  { href: "https://www.cevitas.ae/ras-al-khaimah-real-estate", label: "Ras Al Khaimah real estate" },
];
const GUIDES_FR = [
  { href: "https://www.cevitas.ae/agence-immobiliere-dubai", label: "Agence immobilière à Dubaï" },
  { href: "https://www.cevitas.ae/investir-immobilier-dubai", label: "Investir dans l'immobilier à Dubaï" },
  { href: "https://www.cevitas.ae/acheter-sur-plan-dubai", label: "Acheter sur plan à Dubaï" },
  { href: "https://www.cevitas.ae/immobilier-emirats-arabes-unis", label: "Immobilier aux Émirats" },
  { href: "https://www.cevitas.ae/golden-visa-dubai-immobilier", label: "Golden Visa Dubaï par l'immobilier" },
];

const CevitasGuides = ({ className = "", title = "Dubai & UAE property guides by Cevitas" }: { className?: string; title?: string }) => (
  <nav aria-label={title} className={className}>
    <p style={{ fontWeight: 600, marginBottom: 8 }}>{title}</p>
    <ul style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", listStyle: "none", padding: 0, margin: 0, fontSize: 13, opacity: 0.8 }}>
      {[...GUIDES_EN, ...GUIDES_FR].map((g) => (
        <li key={g.href}><a href={g.href} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{g.label}</a></li>
      ))}
    </ul>
  </nav>
);


export default CevitasGuides;
