// Shared HTML email renderer for the Sofara ambassador newsletter series.
// Design mirrors supabase/functions/_shared/email-templates/signup.tsx
// (white background, Poppins, bottle green #0d3a2b, 520px container).

const GREEN = "#0d3a2b";
const LIME = "#D3F34B";
const TEXT = "#4b5563";
const MUTED = "#9ca3af";
const LINE = "#e5e7eb";
const BOX = "#f3f4f6";
const FONT = "'Poppins', Arial, sans-serif";

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

const renderers = {
  h1: (t) =>
    `<h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;font-weight:700;color:${GREEN}">${inline(t)}</h1>`,
  h2: (t) =>
    `<h2 style="margin:26px 0 10px;font-size:17px;line-height:1.35;font-weight:700;color:${GREEN}">${inline(t)}</h2>`,
  p: (t) => `<p style="${P}">${inline(t)}</p>`,
  ul: (items) =>
    `<ul style="margin:0 0 16px;padding-left:20px">${items
      .map((i) => `<li style="${P};margin-bottom:6px">${inline(i)}</li>`)
      .join("")}</ul>`,
  ol: (items) =>
    `<ol style="margin:0 0 16px;padding-left:20px">${items
      .map((i) => `<li style="${P};margin-bottom:6px">${inline(i)}</li>`)
      .join("")}</ol>`,
  callout: (t) =>
    `<div style="background:${BOX};border-left:4px solid ${LIME};border-radius:10px;padding:14px 18px;margin:0 0 18px"><p style="${P};margin:0">${inline(t)}</p></div>`,
  quote: (t) =>
    `<div style="border-left:3px solid ${LINE};padding:2px 0 2px 16px;margin:0 0 18px"><p style="${P};margin:0;font-style:italic">${inline(t)}</p></div>`,
  table: ({ head, rows }) => {
    const th = head
      .map(
        (h) =>
          `<th align="left" style="padding:8px 10px;font-size:13px;color:${GREEN};border-bottom:2px solid ${LINE}">${inline(h)}</th>`
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
    `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:6px 0 22px"><tr><td style="background:${GREEN};border-radius:10px"><a href="${url}" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:${FONT}">${esc(label)}</a></td></tr></table>`,
  hr: () => `<hr style="border:none;border-top:1px solid ${LINE};margin:22px 0" />`,
  // Unescaped: for merge fields that carry pre-rendered HTML (may resolve to an empty string).
  raw: (t) => String(t),
  sig: (lines) =>
    `<p style="${P};margin-top:8px">${lines.map(inline).join("<br />")}</p>`,
};

const chrome = {
  en: {
    dashboard: "Dashboard",
    referral: "Your referral link",
    legal:
      "Sofara is a platform owned by Cevitas Real Estate LLC, a RERA-licensed Dubai brokerage. Ambassadors act as business introducers; all regulated real estate activity is carried out by Cevitas Real Estate LLC. Commission figures are indicative and depend on the developer and the net commission collected.",
    unsub: "Unsubscribe",
    why: "You receive this email because you are a registered Sofara ambassador.",
  },
  fr: {
    dashboard: "Tableau de bord",
    referral: "Votre lien de parrainage",
    legal:
      "Sofara est une plateforme détenue par Cevitas Real Estate LLC, agence immobilière licenciée RERA à Dubaï. Les ambassadeurs agissent comme apporteurs d'affaires ; toute activité immobilière réglementée est réalisée par Cevitas Real Estate LLC. Les montants de commission sont indicatifs et dépendent du promoteur et de la commission nette perçue.",
    unsub: "Se désabonner",
    why: "Vous recevez cet email car vous êtes ambassadeur Sofara inscrit.",
  },
};

const transactionalWhy = {
  en: "You receive this email because you created a Sofara ambassador account.",
  fr: "Vous recevez cet email car vous avez créé un compte ambassadeur Sofara.",
};

export function renderEmail({ lang, subject, preview, blocks, kind = "newsletter" }) {
  const c = chrome[lang];
  const whyLine =
    kind === "transactional"
      ? `${transactionalWhy[lang]} &nbsp;·&nbsp; © 2026 Sofara. hello@sofara.io`
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
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto">
<tr><td style="padding:40px 25px 0">
  <p style="margin:0 0 28px;font-size:28px;font-weight:700;letter-spacing:3px;color:${GREEN}">SOFARA</p>
  ${body}
  <hr style="border:none;border-top:1px solid ${LINE};margin:26px 0 18px" />
  <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:${TEXT}">
    <a href="https://sofara.io/dashboard" style="color:${GREEN};text-decoration:underline">${c.dashboard}</a>
    &nbsp;·&nbsp;
    <a href="{{referral_link}}" style="color:${GREEN};text-decoration:underline">${c.referral}</a>
    &nbsp;·&nbsp;
    <a href="https://www.instagram.com/sofaradubai/" style="color:${GREEN};text-decoration:underline">Instagram</a>
  </p>
  <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:${MUTED}">${c.legal}</p>
  <p style="margin:0 0 40px;font-size:12px;line-height:1.6;color:${MUTED}">${whyLine}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
