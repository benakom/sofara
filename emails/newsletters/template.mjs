// Shared HTML email renderer for the Sofara ambassador emails.
// Design mirrors supabase/functions/_shared/email-templates/signup.tsx
// (white background, Poppins, bottle green #0d3a2b, 520px container).
// Languages: en, fr, es, ru, ar (Arabic is rendered right-to-left).

const GREEN = "#0d3a2b";
const LIME = "#D3F34B";
const TEXT = "#4b5563";
const MUTED = "#9ca3af";
const LINE = "#e5e7eb";
const BOX = "#f3f4f6";
const FONT = "'Poppins', Arial, sans-serif";
const FONT_AR = "Tahoma, 'Segoe UI', Arial, sans-serif";

export const LANGS = ["en", "fr", "es", "ru", "ar"];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Minimal inline markup: **bold**, [text](url)
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong style=\"color:#111827\">$1</strong>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      `<a href="$2" style="color:${GREEN};text-decoration:underline">$1</a>`
    );

const P = `margin:0 0 16px;font-size:15px;line-height:1.65;color:${TEXT}`;

const makeRenderers = (rtl) => {
  const start = rtl ? "right" : "left";
  const end = rtl ? "left" : "right";
  const font = rtl ? FONT_AR : FONT;
  return {
    h1: (t) =>
      `<h1 style="margin:0 0 18px;font-size:24px;line-height:1.35;font-weight:700;color:${GREEN}">${inline(t)}</h1>`,
    h2: (t) =>
      `<h2 style="margin:26px 0 10px;font-size:17px;line-height:1.4;font-weight:700;color:${GREEN}">${inline(t)}</h2>`,
    p: (t) => `<p style="${P}">${inline(t)}</p>`,
    ul: (items) =>
      `<ul style="margin:0 0 16px;padding-${start}:20px;padding-${end}:0">${items
        .map((i) => `<li style="${P};margin-bottom:6px">${inline(i)}</li>`)
        .join("")}</ul>`,
    ol: (items) =>
      `<ol style="margin:0 0 16px;padding-${start}:20px;padding-${end}:0">${items
        .map((i) => `<li style="${P};margin-bottom:6px">${inline(i)}</li>`)
        .join("")}</ol>`,
    callout: (t) =>
      `<div style="background:${BOX};border-${start}:4px solid ${LIME};border-radius:10px;padding:14px 18px;margin:0 0 18px"><p style="${P};margin:0">${inline(t)}</p></div>`,
    // A small highlighted "tip" box with a label (e.g. "Tip of the day").
    tip: ({ label, text }) =>
      `<div style="background:#f7fbe6;border:1px solid #e6f3a8;border-radius:12px;padding:14px 18px;margin:0 0 18px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GREEN}">${esc(label)}</p><p style="${P};margin:0">${inline(text)}</p></div>`,
    quote: (t) =>
      `<div style="border-${start}:3px solid ${LINE};padding-${start}:16px;padding-top:2px;padding-bottom:2px;margin:0 0 18px"><p style="${P};margin:0;font-style:${rtl ? "normal" : "italic"}">${inline(t)}</p></div>`,
    table: ({ head, rows }) => {
      const th = head
        .map(
          (h) =>
            `<th align="${start}" style="padding:8px 10px;font-size:13px;color:${GREEN};border-bottom:2px solid ${LINE}">${inline(h)}</th>`
        )
        .join("");
      const tr = rows
        .map(
          (r) =>
            `<tr>${r
              .map(
                (c) =>
                  `<td style="padding:8px 10px;font-size:14px;color:${TEXT};border-bottom:1px solid ${LINE}">${inline(c)}</td>`
              )
              .join("")}</tr>`
        )
        .join("");
      return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 18px"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
    },
    cta: ({ label, url }) =>
      `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:6px 0 22px"><tr><td style="background:${GREEN};border-radius:10px"><a href="${url}" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:${font}">${esc(label)}</a></td></tr></table>`,
    hr: () => `<hr style="border:none;border-top:1px solid ${LINE};margin:22px 0" />`,
    // Unescaped: for merge fields that carry pre-rendered HTML (may resolve to an empty string).
    raw: (t) => String(t),
    sig: (lines) =>
      `<p style="${P};margin-top:8px">${lines.map(inline).join("<br />")}</p>`,
  };
};

const LEGAL = {
  en: "Sofara is a platform owned by Cevitas Real Estate LLC, a RERA-licensed Dubai brokerage. Ambassadors act as business introducers; all regulated real estate activity is carried out by Cevitas Real Estate LLC. Commissions are indicative and depend on the transaction.",
  fr: "Sofara est une plateforme détenue par Cevitas Real Estate LLC, agence immobilière licenciée RERA à Dubaï. Les ambassadeurs agissent comme apporteurs d'affaires ; toute activité immobilière réglementée est réalisée par Cevitas Real Estate LLC. Les commissions sont indicatives et dépendent de la transaction.",
  es: "Sofara es una plataforma propiedad de Cevitas Real Estate LLC, agencia inmobiliaria con licencia RERA en Dubái. Los embajadores actúan como intermediarios; toda actividad inmobiliaria regulada la realiza Cevitas Real Estate LLC. Las comisiones son indicativas y dependen de la operación.",
  ru: "Sofara — платформа компании Cevitas Real Estate LLC, агентства недвижимости в Дубае с лицензией RERA. Амбассадоры выступают как агенты-рекомендатели; вся регулируемая деятельность с недвижимостью ведётся Cevitas Real Estate LLC. Комиссия ориентировочная и зависит от сделки.",
  ar: "سوفارا منصة مملوكة لشركة Cevitas Real Estate LLC، وسيط عقاري مرخّص من مؤسسة التنظيم العقاري RERA في دبي. يعمل السفراء كوسطاء تعريف، وتتولى Cevitas Real Estate LLC كل نشاط عقاري منظَّم. العمولات تقديرية وتعتمد على كل صفقة.",
};

const chrome = {
  en: { dashboard: "Dashboard", referral: "Your referral link", unsub: "Unsubscribe", why: "You receive this email because you are a registered Sofara ambassador.", txWhy: "You receive this email because you created a Sofara ambassador account." },
  fr: { dashboard: "Tableau de bord", referral: "Votre lien de parrainage", unsub: "Se désabonner", why: "Vous recevez cet email car vous êtes ambassadeur Sofara inscrit.", txWhy: "Vous recevez cet email car vous avez créé un compte ambassadeur Sofara." },
  es: { dashboard: "Panel", referral: "Tu enlace de referido", unsub: "Darse de baja", why: "Recibes este email porque eres embajador registrado de Sofara.", txWhy: "Recibes este email porque creaste una cuenta de embajador en Sofara." },
  ru: { dashboard: "Личный кабинет", referral: "Ваша реферальная ссылка", unsub: "Отписаться", why: "Вы получили это письмо как зарегистрированный амбассадор Sofara.", txWhy: "Вы получили это письмо, потому что создали аккаунт амбассадора Sofara." },
  ar: { dashboard: "لوحة التحكم", referral: "رابط الإحالة الخاص بك", unsub: "إلغاء الاشتراك", why: "تصلك هذه الرسالة لأنك سفير مسجّل في سوفارا.", txWhy: "تصلك هذه الرسالة لأنك أنشأت حساب سفير في سوفارا." },
};

export function renderEmail({ lang, subject, preview, blocks, kind = "newsletter" }) {
  const c = chrome[lang];
  if (!c) throw new Error(`Unsupported language: ${lang}`);
  const rtl = lang === "ar";
  const renderers = makeRenderers(rtl);
  const font = rtl ? FONT_AR : FONT;
  const dir = rtl ? ' dir="rtl"' : "";
  const whyLine =
    kind === "transactional"
      ? `${c.txWhy} &nbsp;·&nbsp; © 2026 Sofara. hello@sofara.io`
      : `${c.why}
    <a href="{{unsubscribe_url}}" style="color:${MUTED};text-decoration:underline">${c.unsub}</a>
    &nbsp;·&nbsp; © 2026 Sofara. hello@sofara.io`;
  const body = blocks
    .map((b) => {
      const [type, value] = Array.isArray(b) ? b : [b.type, b.value];
      const r = renderers[type];
      if (!r) throw new Error(`Unknown block type: ${type}`);
      return r(value);
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${lang}"${dir}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${font}"${dir}>
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff"${dir}>
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto">
<tr><td style="padding:40px 25px 0;text-align:${rtl ? "right" : "left"}"${dir}>
  <p style="margin:0 0 28px;font-size:28px;font-weight:700;letter-spacing:3px;color:${GREEN};font-family:${FONT}" dir="ltr">SOFARA</p>
  ${body}
  <hr style="border:none;border-top:1px solid ${LINE};margin:26px 0 18px" />
  <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:${TEXT}">
    <a href="https://sofara.io/dashboard" style="color:${GREEN};text-decoration:underline">${c.dashboard}</a>
    &nbsp;·&nbsp;
    <a href="{{referral_link}}" style="color:${GREEN};text-decoration:underline">${c.referral}</a>
    &nbsp;·&nbsp;
    <a href="https://www.instagram.com/sofaradubai/" style="color:${GREEN};text-decoration:underline">Instagram</a>
  </p>
  <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:${MUTED}">${LEGAL[lang]}</p>
  <p style="margin:0 0 40px;font-size:12px;line-height:1.6;color:${MUTED}">${whyLine}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
