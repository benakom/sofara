import type { Locale } from "@/i18n/locales";

/**
 * Homepage copy (2026-10-21 redesign), one block per language.
 * Facts used everywhere on the site: up to 3% (Emaar, Sobha 3%, DAMAC 2.5%), commission earned when the buyer
 * signs the SPA and pays the down payment with the DLD fees, paid in AED within 7 days of the developer paying
 * Cevitas, each contact protected 12 months, free, no license, ambassadors in 40+ countries.
 */
export interface HomeCopy {
  eyebrow: string;
  h1: [string, string, string];
  h1Prefix: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  proof: [string, string, string];
  calc: {
    title: string; price: string; deals: string; result: string;
    range: (min: string, max: string) => string;
    perYear: (min: string, max: string, deals: number) => string; note: string;
  };
  trust: [string, string, string, string];
  how: { eyebrow: string; title: string; mark: string; steps: { label: string; title: string; text: string }[] };
  rates: {
    eyebrow: string; title: string; sub: string;
    cards: { rate: string; who: string; example: string }[];
    team: { rate: string; who: string; example: string };
    rules: string;
  };
  projects: {
    eyebrow: string; title: string; mark: string; sub: string; cta: string; note: string;
    items: { slug: string; name: string; where: string; detail: string }[];
  };
  final: { title: string; text: string; cta: string; perks: [string, string, string] };
  faqTitle: string;
}

const PROJECTS = {
  samana: { slug: "samana-greenfield-2", name: "Samana Greenfield 2" },
  sky: { slug: "sky-level-1", name: "Sky Level 1" },
  ardee: { slug: "ardee-views", name: "Ardee Views" },
};

export const HOME_COPY: Record<Locale, HomeCopy> = {
  en: {
    eyebrow: "Dubai & UAE real estate ambassadors network",
    h1: ["You recommend.", "We close.", "You get paid."],
    h1Prefix: "Sofara, the Dubai & UAE real estate ambassadors network: ",
    sub: "Introduce property buyers to Cevitas Real Estate, a RERA-licensed Dubai brokerage. Earn 1% to 3% of the property price, in AED, within 7 days of the developer's payment.",
    ctaPrimary: "Create my free account",
    ctaSecondary: "See the projects",
    proof: ["No license · from 40+ countries", "Each contact protected 12 months", "Free to join"],
    calc: {
      title: "Commission calculator",
      price: "Property price",
      deals: "Sales per year",
      result: "Your commission per sale: 1% to 3% of the price",
      range: (a, b) => `${a} to ${b}`,
      perYear: (a, b, d) => `that is ${a} to ${b} a year for ${d} sale${d > 1 ? "s" : ""}`,
      note: "The rate depends on the project, between 1% and 3% of the price. It is shown in your dashboard before you refer.",
    },
    trust: ["Cevitas Real Estate LLC · RERA-licensed brokerage", "Emaar, DAMAC, Sobha and other leading developers", "Paid in AED by bank transfer", "Every contact tracked in real time"],
    how: {
      eyebrow: "How it works",
      title: "Three steps, and you see everything in your dashboard",
      mark: "you see everything",
      steps: [
        { label: "Step 1", title: "Share your link", text: "Or register a contact in 30 seconds from your dashboard." },
        { label: "Step 2", title: "Cevitas advises the buyer", text: "Advice, project choice, viewings, reservation and contract, by licensed agents." },
        { label: "Step 3", title: "You get paid", text: "Earned when the buyer signs the SPA and pays the down payment, paid within 7 days of the developer." },
      ],
    },
    rates: {
      eyebrow: "Published commissions",
      title: "You know what you earn before you recommend",
      sub: "The rate depends on the project and is visible in your dashboard before you recommend anyone.",
      cards: [
        { rate: "1% to 3%", who: "of the property price", example: "AED 15,000 to 45,000 on a AED 1.5M property" },
        { rate: "7 days", who: "to get paid", example: "after the developer pays Cevitas, in AED by bank transfer" },
      ],
      team: { rate: "+10%", who: "Ambassador+", example: "of the commissions earned by the ambassadors you bring in" },
      rules: "The commission is earned when the buyer signs the SPA and pays the down payment with the DLD fees, then paid in AED within 7 days of the developer paying Cevitas, against an invoice issued from your dashboard.",
    },
    projects: {
      eyebrow: "To recommend this month",
      title: "Projects ready to share, with brochure and payment plan",
      mark: "ready to share",
      sub: "Your dashboard gives you the brochures, payment plans and prices to send to your contacts.",
      cta: "Get the brochures",
      note: "Official developer visuals. Availability and prices change: check your dashboard.",
      items: [
        { ...PROJECTS.samana, where: "Al Warsan 4, Dubai · SAMANA Developers", detail: "From AED 849,000, furnished · 1% a month plan" },
        { ...PROJECTS.sky, where: "Jumeirah Village Circle, Dubai · Object 1", detail: "From AED 945,000 · 40/60 payment plan" },
        { ...PROJECTS.ardee, where: "Al Marjan Island, Ras Al Khaimah · Ardee", detail: "Sea views · 50/50 payment plan" },
      ],
    },
    final: {
      title: "Your network is worth more than you think",
      text: "Create your free account, share your link and let a licensed Dubai team turn your introductions into commissions.",
      cta: "Become an ambassador",
      perks: ["No license required", "Free, no subscription", "Paid in AED within 7 days"],
    },
    faqTitle: "Questions ambassadors ask",
  },

  fr: {
    eyebrow: "Réseau d'ambassadeurs immobiliers · Dubaï et Émirats",
    h1: ["Vous recommandez.", "Nous concluons.", "Vous encaissez."],
    h1Prefix: "Sofara, le réseau d'ambassadeurs de l'immobilier à Dubaï et aux Émirats : ",
    sub: "Présentez des acheteurs à Cevitas Real Estate, agence agréée RERA à Dubaï. Touchez de 1 % à 3 % du prix du bien, en AED, sous 7 jours après le paiement du promoteur.",
    ctaPrimary: "Créer mon compte gratuit",
    ctaSecondary: "Voir les projets",
    proof: ["Sans licence · depuis 40+ pays", "Chaque contact protégé 12 mois", "Inscription gratuite"],
    calc: {
      title: "Simulateur de commission",
      price: "Prix du bien",
      deals: "Ventes par an",
      result: "Votre commission par vente : de 1 % à 3 % du prix",
      range: (a, b) => `${a} à ${b}`,
      perYear: (a, b, d) => `soit ${a} à ${b} par an pour ${d} vente${d > 1 ? "s" : ""}`,
      note: "Le taux dépend du projet, entre 1 % et 3 % du prix. Il est affiché dans votre espace avant de recommander.",
    },
    trust: ["Cevitas Real Estate LLC · agence agréée RERA", "Emaar, DAMAC, Sobha et d'autres grands promoteurs", "Paiement en AED par virement", "Suivi en temps réel de chaque contact"],
    how: {
      eyebrow: "Comment ça marche",
      title: "Trois étapes, et vous voyez tout dans votre espace",
      mark: "vous voyez tout",
      steps: [
        { label: "Étape 1", title: "Vous partagez votre lien", text: "Ou vous enregistrez un contact en 30 secondes depuis votre tableau de bord." },
        { label: "Étape 2", title: "Cevitas accompagne l'acheteur", text: "Conseil, choix du projet, visites, réservation et contrat, par des agents agréés." },
        { label: "Étape 3", title: "Vous êtes payé", text: "Commission acquise à la signature du SPA et au paiement de l'apport, versée sous 7 jours après le promoteur." },
      ],
    },
    rates: {
      eyebrow: "Commissions publiées",
      title: "Vous savez ce que vous gagnez avant de recommander",
      sub: "Le taux dépend du projet et s'affiche dans votre espace avant toute recommandation.",
      cards: [
        { rate: "1 à 3 %", who: "du prix du bien", example: "15 000 à 45 000 AED sur un bien à 1,5 M AED" },
        { rate: "7 jours", who: "pour être payé", example: "après le paiement du promoteur à Cevitas, en AED par virement" },
      ],
      team: { rate: "+10 %", who: "Ambassadeur+", example: "des commissions des ambassadeurs que vous faites entrer" },
      rules: "La commission est acquise lorsque l'acheteur signe le SPA et règle l'apport avec les frais DLD, puis versée en AED sous 7 jours après le paiement du promoteur à Cevitas, contre une facture émise depuis votre espace.",
    },
    projects: {
      eyebrow: "À recommander ce mois-ci",
      title: "Des projets prêts à partager, avec brochure et plan de paiement",
      mark: "prêts à partager",
      sub: "Votre espace vous donne les brochures, plans de paiement et prix à envoyer à vos contacts.",
      cta: "Recevoir les brochures",
      note: "Visuels officiels des promoteurs. Disponibilités et prix évoluent : vérifiez dans votre espace.",
      items: [
        { ...PROJECTS.samana, where: "Al Warsan 4, Dubaï · SAMANA Developers", detail: "Dès 849 000 AED meublé · plan 1 % par mois" },
        { ...PROJECTS.sky, where: "Jumeirah Village Circle, Dubaï · Object 1", detail: "Dès 945 000 AED · plan de paiement 40/60" },
        { ...PROJECTS.ardee, where: "Al Marjan Island, Ras Al Khaimah · Ardee", detail: "Vue mer · plan de paiement 50/50" },
      ],
    },
    final: {
      title: "Votre réseau vaut plus que vous ne le pensez",
      text: "Créez votre compte gratuit, partagez votre lien et laissez une équipe agréée à Dubaï transformer vos recommandations en commissions.",
      cta: "Devenir ambassadeur",
      perks: ["Aucune licence requise", "Gratuit, sans abonnement", "Payé en AED sous 7 jours"],
    },
    faqTitle: "Les questions des ambassadeurs",
  },

  es: {
    eyebrow: "Red de embajadores inmobiliarios · Dubái y EAU",
    h1: ["Tú recomiendas.", "Nosotros cerramos.", "Tú cobras."],
    h1Prefix: "Sofara, la red de embajadores inmobiliarios de Dubái y EAU: ",
    sub: "Presenta compradores a Cevitas Real Estate, agencia autorizada por la RERA en Dubái. Gana del 1 % al 3 % del precio de la propiedad, en AED, en 7 días desde el pago del promotor.",
    ctaPrimary: "Crear mi cuenta gratis",
    ctaSecondary: "Ver los proyectos",
    proof: ["Sin licencia · desde 40+ países", "Cada contacto protegido 12 meses", "Registro gratuito"],
    calc: {
      title: "Calculadora de comisión",
      price: "Precio de la propiedad",
      deals: "Ventas al año",
      result: "Tu comisión por venta: del 1 % al 3 % del precio",
      range: (a, b) => `${a} a ${b}`,
      perYear: (a, b, d) => `es decir ${a} a ${b} al año por ${d} venta${d > 1 ? "s" : ""}`,
      note: "La tasa depende del proyecto, entre el 1 % y el 3 % del precio. Aparece en tu panel antes de recomendar.",
    },
    trust: ["Cevitas Real Estate LLC · agencia autorizada RERA", "Emaar, DAMAC, Sobha y otros grandes promotores", "Pago en AED por transferencia", "Seguimiento en tiempo real de cada contacto"],
    how: {
      eyebrow: "Cómo funciona",
      title: "Tres pasos, y lo ves todo en tu panel",
      mark: "lo ves todo",
      steps: [
        { label: "Paso 1", title: "Compartes tu enlace", text: "O registras un contacto en 30 segundos desde tu panel." },
        { label: "Paso 2", title: "Cevitas acompaña al comprador", text: "Asesoría, elección del proyecto, visitas, reserva y contrato, con agentes autorizados." },
        { label: "Paso 3", title: "Cobras", text: "Comisión generada con la firma del SPA y el pago de la entrada, abonada en 7 días desde el pago del promotor." },
      ],
    },
    rates: {
      eyebrow: "Comisiones publicadas",
      title: "Sabes lo que ganas antes de recomendar",
      sub: "La tasa depende del proyecto y aparece en tu panel antes de recomendar.",
      cards: [
        { rate: "1 a 3 %", who: "del precio de la propiedad", example: "15.000 a 45.000 AED por una propiedad de 1,5 M AED" },
        { rate: "7 días", who: "para cobrar", example: "desde que el promotor paga a Cevitas, en AED por transferencia" },
      ],
      team: { rate: "+10 %", who: "Embajador+", example: "de las comisiones de los embajadores que incorporas" },
      rules: "La comisión se genera cuando el comprador firma el SPA y paga la entrada con las tasas DLD, y se abona en AED en 7 días desde que el promotor paga a Cevitas, contra una factura emitida desde tu panel.",
    },
    projects: {
      eyebrow: "Para recomendar este mes",
      title: "Proyectos listos para compartir, con folleto y plan de pagos",
      mark: "listos para compartir",
      sub: "Tu panel te da los folletos, planes de pago y precios para enviar a tus contactos.",
      cta: "Recibir los folletos",
      note: "Imágenes oficiales de los promotores. Disponibilidad y precios cambian: consulta tu panel.",
      items: [
        { ...PROJECTS.samana, where: "Al Warsan 4, Dubái · SAMANA Developers", detail: "Desde 849.000 AED amueblado · plan del 1 % mensual" },
        { ...PROJECTS.sky, where: "Jumeirah Village Circle, Dubái · Object 1", detail: "Desde 945.000 AED · plan de pagos 40/60" },
        { ...PROJECTS.ardee, where: "Al Marjan Island, Ras al Jaima · Ardee", detail: "Vistas al mar · plan de pagos 50/50" },
      ],
    },
    final: {
      title: "Tu red vale más de lo que crees",
      text: "Crea tu cuenta gratis, comparte tu enlace y deja que un equipo autorizado en Dubái convierta tus recomendaciones en comisiones.",
      cta: "Hacerme embajador",
      perks: ["Sin licencia", "Gratis, sin suscripción", "Pago en AED en 7 días"],
    },
    faqTitle: "Preguntas de los embajadores",
  },

  ru: {
    eyebrow: "Сеть амбассадоров недвижимости · Дубай и ОАЭ",
    h1: ["Вы рекомендуете.", "Мы закрываем сделку.", "Вы получаете деньги."],
    h1Prefix: "Sofara — сеть амбассадоров недвижимости Дубая и ОАЭ: ",
    sub: "Знакомьте покупателей с Cevitas Real Estate — агентством с лицензией RERA в Дубае. Получайте от 1% до 3% от стоимости объекта в AED в течение 7 дней после оплаты девелопера.",
    ctaPrimary: "Создать бесплатный аккаунт",
    ctaSecondary: "Смотреть проекты",
    proof: ["Без лицензии · из 40+ стран", "Каждый контакт закреплён 12 месяцев", "Регистрация бесплатная"],
    calc: {
      title: "Калькулятор комиссии",
      price: "Стоимость объекта",
      deals: "Сделок в год",
      result: "Ваша комиссия за сделку: от 1% до 3% цены",
      range: (a, b) => `от ${a} до ${b}`,
      perYear: (a, b, d) => `то есть от ${a} до ${b} в год за ${d} ${d === 1 ? "сделку" : d < 5 ? "сделки" : "сделок"}`,
      note: "Ставка зависит от проекта: от 1% до 3% цены. Она указана в личном кабинете до рекомендации.",
    },
    trust: ["Cevitas Real Estate LLC · лицензия RERA", "Emaar, DAMAC, Sobha и другие ведущие девелоперы", "Выплата в AED банковским переводом", "Отслеживание каждого контакта в реальном времени"],
    how: {
      eyebrow: "Как это работает",
      title: "Три шага, и всё видно в личном кабинете",
      mark: "всё видно",
      steps: [
        { label: "Шаг 1", title: "Делитесь ссылкой", text: "Или регистрируете контакт за 30 секунд в личном кабинете." },
        { label: "Шаг 2", title: "Cevitas сопровождает покупателя", text: "Консультация, выбор проекта, показы, бронирование и договор — лицензированными агентами." },
        { label: "Шаг 3", title: "Вы получаете выплату", text: "Комиссия начисляется после подписания SPA и первого взноса, выплата — в течение 7 дней после девелопера." },
      ],
    },
    rates: {
      eyebrow: "Опубликованные ставки",
      title: "Вы знаете свой доход до рекомендации",
      sub: "Ставка зависит от проекта и видна в личном кабинете до рекомендации.",
      cards: [
        { rate: "1–3%", who: "от цены объекта", example: "от 15 000 до 45 000 AED с объекта за 1,5 млн AED" },
        { rate: "7 дней", who: "до выплаты", example: "после оплаты девелопера компании Cevitas, в AED переводом" },
      ],
      team: { rate: "+10%", who: "Амбассадор+", example: "от комиссий амбассадоров, которых вы пригласили" },
      rules: "Комиссия начисляется, когда покупатель подписывает SPA и вносит первый взнос со сборами DLD, и выплачивается в AED в течение 7 дней после оплаты девелопера компании Cevitas, по счёту из личного кабинета.",
    },
    projects: {
      eyebrow: "Рекомендовать в этом месяце",
      title: "Проекты, готовые к отправке: брошюра и план оплаты",
      mark: "готовые к отправке",
      sub: "В личном кабинете есть брошюры, планы оплаты и цены для ваших контактов.",
      cta: "Получить брошюры",
      note: "Официальные визуализации девелоперов. Наличие и цены меняются: проверяйте в личном кабинете.",
      items: [
        { ...PROJECTS.samana, where: "Al Warsan 4, Дубай · SAMANA Developers", detail: "От 849 000 AED с мебелью · рассрочка 1% в месяц" },
        { ...PROJECTS.sky, where: "Jumeirah Village Circle, Дубай · Object 1", detail: "От 945 000 AED · план оплаты 40/60" },
        { ...PROJECTS.ardee, where: "Al Marjan Island, Рас-эль-Хайма · Ardee", detail: "Вид на море · план оплаты 50/50" },
      ],
    },
    final: {
      title: "Ваше окружение стоит больше, чем вы думаете",
      text: "Создайте бесплатный аккаунт, поделитесь ссылкой — и лицензированная команда в Дубае превратит ваши рекомендации в комиссии.",
      cta: "Стать амбассадором",
      perks: ["Лицензия не нужна", "Бесплатно, без подписки", "Выплата в AED за 7 дней"],
    },
    faqTitle: "Вопросы амбассадоров",
  },
};

/** Deterministic thousands grouping (same output in Node prerender and browsers). */
export const formatAed = (n: number, locale: Locale) => {
  const sep = locale === "en" ? "," : locale === "es" ? "." : "\u00a0";
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return locale === "en" ? `AED\u00a0${s}` : `${s}\u00a0AED`;
};
