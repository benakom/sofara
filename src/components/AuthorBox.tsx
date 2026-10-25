import type { Locale } from "@/i18n/locales";

/** Visible author line and author box for articles and guides (one language per page). */
export const AUTHOR_TEXT: Record<Locale, { name: string; byline: string; role: string; bio: string; more: string; href: string }> = {
  en: {
    name: "Ahmed Benjas",
    byline: "By Ahmed Benjas, founder",
    role: "Founder of Sofara and of Cevitas Real Estate, a RERA-licensed brokerage in Dubai",
    bio: "Moroccan entrepreneur based in Dubai, with AED 200M+ in property transactions. He advises buyers in French, Arabic, Darija and English.",
    more: "About Ahmed Benjas",
    href: "https://www.ahmedbenjas.com/en/about/",
  },
  fr: {
    name: "Ahmed Benjas",
    byline: "Par Ahmed Benjas, fondateur",
    role: "Fondateur de Sofara et de Cevitas Real Estate, agence immobilière agréée RERA à Dubaï",
    bio: "Entrepreneur marocain installé à Dubaï, plus de 200 M AED de transactions immobilières. Il accompagne les acheteurs en français, arabe, darija et anglais.",
    more: "En savoir plus sur Ahmed Benjas",
    href: "https://www.ahmedbenjas.com/a-propos/",
  },
  es: {
    name: "Ahmed Benjas",
    byline: "Por Ahmed Benjas, fundador",
    role: "Fundador de Sofara y de Cevitas Real Estate, agencia inmobiliaria con licencia RERA en Dubái",
    bio: "Emprendedor marroquí afincado en Dubái, con más de 200 M AED en transacciones inmobiliarias. Asesora a compradores en francés, árabe, dariya e inglés.",
    more: "Más sobre Ahmed Benjas",
    href: "https://www.ahmedbenjas.com/en/about/",
  },
  ru: {
    name: "Ahmed Benjas",
    byline: "Автор: Ahmed Benjas, основатель",
    role: "Основатель Sofara и Cevitas Real Estate — агентства недвижимости в Дубае с лицензией RERA",
    bio: "Марокканский предприниматель, живёт в Дубае; более 200 млн AED сделок с недвижимостью. Консультирует покупателей на французском, арабском, дарижа и английском.",
    more: "Подробнее об Ahmed Benjas",
    href: "https://www.ahmedbenjas.com/en/about/",
  },
  ar: {
    name: "أحمد بنجاس",
    byline: "بقلم أحمد بنجاس، المؤسس",
    role: "مؤسس Sofara وCevitas Real Estate، وكالة عقارية مرخّصة من RERA في دبي",
    bio: "رائد أعمال مغربي مقيم في دبي، بأكثر من 200 مليون درهم من المعاملات العقارية. يرافق المشترين بالفرنسية والعربية والدارجة والإنجليزية.",
    more: "المزيد عن أحمد بنجاس",
    href: "https://www.ahmedbenjas.com/en/about/",
  },
};

const AuthorBox = ({ locale, className = "" }: { locale: Locale; className?: string }) => {
  const t = AUTHOR_TEXT[locale];
  return (
    <aside
      aria-label={t.name}
      className={`not-prose flex items-start gap-4 rounded-2xl border border-border/50 bg-secondary/20 p-5 sm:p-6 ${className}`}
    >
      <img
        src="/team/ahmed-benjas-192.jpg"
        alt={t.name}
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="w-16 h-16 rounded-full object-cover object-top shrink-0"
      />
      <div className="min-w-0">
        <p className="font-display font-semibold text-foreground">{t.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{t.bio}</p>
        <a
          href={t.href}
          target="_blank"
          rel="noopener"
          className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
        >
          {t.more} {locale === "ar" ? "←" : "→"}
        </a>
      </div>
    </aside>
  );
};

export default AuthorBox;
