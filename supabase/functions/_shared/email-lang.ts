// Language of the emails sent to an ambassador.
// 1. The communication language chosen in the signup form (auth user metadata "email_lang").
// 2. profiles.language (en | fr, set from the site language at signup or the dashboard toggle;
//    the dashboard stores French as "ar", its legacy code).
// 3. The country: French, Spanish, Russian or Arabic speaking countries, else English.

export type EmailLang = 'en' | 'fr' | 'es' | 'ru' | 'ar'
export const EMAIL_LANGS: EmailLang[] = ['en', 'fr', 'es', 'ru', 'ar']

const isEmailLang = (v: unknown): v is EmailLang => typeof v === 'string' && (EMAIL_LANGS as string[]).includes(v)

const COUNTRIES: Record<Exclude<EmailLang, 'en'>, string[]> = {
  fr: [
    'france', 'fr', 'belgium', 'belgique', 'be', 'switzerland', 'suisse', 'ch', 'luxembourg', 'lu',
    'monaco', 'mc', 'morocco', 'maroc', 'ma', 'algeria', 'algérie', 'algerie', 'dz', 'tunisia', 'tunisie', 'tn',
    'senegal', 'sénégal', 'sn', 'ivory coast', "côte d'ivoire", "cote d'ivoire", 'ci', 'cameroon', 'cameroun', 'cm',
    'mali', 'ml', 'burkina faso', 'bf', 'niger', 'ne', 'benin', 'bénin', 'bj', 'togo', 'tg', 'gabon', 'ga',
    'congo', 'cg', 'drc', 'rdc', 'cd', 'guinea', 'guinée', 'gn', 'madagascar', 'mg', 'mauritius', 'maurice', 'mu',
    'haiti', 'haïti', 'ht', 'quebec', 'québec', 'lebanon', 'liban', 'lb', 'djibouti', 'dj', 'chad', 'tchad', 'td',
    'mauritania', 'mauritanie', 'mr', 'comoros', 'comores', 'km', 'seychelles', 'sc', 'burundi', 'bi', 'rwanda', 'rw',
  ],
  es: [
    'spain', 'españa', 'espana', 'es', 'mexico', 'méxico', 'mx', 'argentina', 'ar', 'colombia', 'co',
    'chile', 'cl', 'peru', 'perú', 'pe', 'venezuela', 've', 'ecuador', 'ec', 'uruguay', 'uy', 'paraguay', 'py',
    'bolivia', 'bo', 'costa rica', 'cr', 'panama', 'panamá', 'pa', 'dominican republic', 'república dominicana', 'do',
    'guatemala', 'gt', 'honduras', 'hn', 'el salvador', 'sv', 'nicaragua', 'ni', 'cuba', 'cu', 'puerto rico', 'pr',
  ],
  ru: [
    'russia', 'россия', 'ru', 'russian federation', 'kazakhstan', 'казахстан', 'kz', 'belarus', 'беларусь', 'by',
    'kyrgyzstan', 'кыргызстан', 'kg', 'uzbekistan', 'узбекистан', 'uz', 'tajikistan', 'tj', 'armenia', 'am',
    'azerbaijan', 'az', 'moldova', 'md', 'turkmenistan', 'tm',
  ],
  ar: [
    'united arab emirates', 'uae', 'ae', 'الإمارات', 'saudi arabia', 'ksa', 'sa', 'السعودية', 'qatar', 'qa', 'قطر',
    'kuwait', 'kw', 'الكويت', 'bahrain', 'bh', 'البحرين', 'oman', 'om', 'عمان', 'egypt', 'eg', 'مصر', 'jordan', 'jo',
    'الأردن', 'iraq', 'iq', 'العراق', 'syria', 'sy', 'palestine', 'ps', 'yemen', 'ye', 'libya', 'ly', 'sudan', 'sd',
  ],
}

export function pickEmailLang(opts: {
  emailLang?: unknown
  language?: string | null
  country?: string | null
}): EmailLang {
  if (isEmailLang(opts.emailLang)) return opts.emailLang
  if (opts.language === 'fr' || opts.language === 'ar') return 'fr' // "ar" = dashboard's legacy French code
  if (opts.language === 'en') return 'en'
  const c = (opts.country ?? '').trim().toLowerCase()
  if (c) {
    for (const [lang, list] of Object.entries(COUNTRIES) as [EmailLang, string[]][]) {
      if (list.includes(c)) return lang
    }
  }
  return 'en'
}

export function parseEmailLang(v: unknown): EmailLang | null {
  return isEmailLang(v) ? v : null
}
