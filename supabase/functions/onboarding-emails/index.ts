import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { TRANSACTIONAL_EMAILS, type TxLang } from '../_shared/transactional-emails.ts'

// Onboarding transactional emails for ambassadors.
//
//   { event: "verified", lang? }            caller = the ambassador, right after email verification
//                                           (super admins may pass user_id). Sends "under review" once.
//   { event: "approved", user_id }          caller = super admin. Sends "welcome, validated" once.
//
// Idempotent: profiles.under_review_email_at / approved_email_at are claimed atomically
// before enqueueing, so double calls never double send.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const FROM = 'Sofara <noreply@sofara.io>'
const SENDER_DOMAIN = 'notify.sofara.io'
const SITE_URL = 'https://sofara.io'

const FRENCH_COUNTRIES = new Set([
  'france', 'fr', 'belgium', 'belgique', 'be', 'switzerland', 'suisse', 'ch', 'luxembourg', 'lu', 'monaco', 'mc',
  'morocco', 'maroc', 'ma', 'algeria', 'algérie', 'algerie', 'dz', 'tunisia', 'tunisie', 'tn', 'senegal', 'sénégal', 'sn',
  'ivory coast', "côte d'ivoire", "cote d'ivoire", 'ci', 'cameroon', 'cameroun', 'cm', 'mali', 'ml', 'burkina faso', 'bf',
  'niger', 'ne', 'benin', 'bénin', 'bj', 'togo', 'tg', 'gabon', 'ga', 'congo', 'cg', 'drc', 'rdc', 'cd', 'guinea', 'guinée', 'gn',
  'madagascar', 'mg', 'mauritius', 'maurice', 'mu', 'haiti', 'haïti', 'ht', 'quebec', 'québec', 'lebanon', 'liban', 'lb',
  'djibouti', 'dj', 'chad', 'tchad', 'td', 'mauritania', 'mauritanie', 'mr', 'comoros', 'comores', 'km', 'burundi', 'bi', 'rwanda', 'rw',
])

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

function pickLang(language: string | null, country: string | null): TxLang {
  if (language === 'fr' || language === 'en') return language
  const c = (country ?? '').trim().toLowerCase()
  return c && FRENCH_COUNTRIES.has(c) ? 'fr' : 'en'
}

function firstName(p: { first_name: string | null; full_name: string | null }, email: string): string {
  const fn = (p.first_name ?? (p.full_name ?? '').split(/\s+/)[0] ?? '').trim()
  if (fn) return fn.charAt(0).toUpperCase() + fn.slice(1)
  return email.split('@')[0]
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|li|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  full_name: string | null
  country: string | null
  language: string | null
  referral_code: string | null
  status: string
  under_review_email_at: string | null
  approved_email_at: string | null
}

async function enqueue(admin: SupabaseClient, templateId: string, to: string, lang: TxLang, fields: Record<string, string>) {
  const tpl = TRANSACTIONAL_EMAILS[templateId]
  if (!tpl) throw new Error(`Unknown template ${templateId}`)
  let html = tpl.html[lang]
  let subject = tpl.subject[lang]
  for (const [k, v] of Object.entries(fields)) {
    html = html.replaceAll(`{{${k}}}`, v)
    subject = subject.replaceAll(`{{${k}}}`, v)
  }
  const message_id = crypto.randomUUID()
  const label = `onboarding:${templateId}:${lang}`
  await admin.from('email_send_log').insert({ message_id, template_name: label, recipient_email: to, status: 'pending' })
  const { error } = await admin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id,
      to,
      from: FROM,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: htmlToText(html),
      purpose: 'transactional',
      label,
      idempotency_key: message_id,
      queued_at: new Date().toISOString(),
    },
  })
  if (error) {
    await admin.from('email_send_log').insert({ message_id, template_name: label, recipient_email: to, status: 'failed', error_message: `enqueue: ${error.message}` })
    throw new Error(error.message)
  }
  return message_id
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server configuration error' }, 500)

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

  const admin = createClient(supabaseUrl, serviceKey)
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id)
  const isSuperAdmin = (roles ?? []).some((r) => r.role === 'superadmin')

  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { body = {} }
  const event = body.event as string
  const requestedLang = body.lang === 'fr' ? 'fr' : body.lang === 'en' ? 'en' : null

  try {
    if (event === 'verified') {
      const targetId = isSuperAdmin && typeof body.user_id === 'string' ? body.user_id : user.id
      const { data: target } = await admin.auth.admin.getUserById(targetId)
      if (!target?.user?.email) return json({ error: 'User not found' }, 404)
      if (!target.user.email_confirmed_at) return json({ error: 'Email not verified yet' }, 400)

      const { data: profile } = await admin.from('profiles').select('*').eq('id', targetId).maybeSingle<Profile>()
      if (!profile) return json({ error: 'Profile not found' }, 404)
      if (profile.status !== 'pending') return json({ skipped: 'not_pending', status: profile.status })

      // Remember the language the person used on the site, if we do not have one yet.
      if (!profile.language && requestedLang) {
        await admin.from('profiles').update({ language: requestedLang }).eq('id', targetId)
      }
      const lang = pickLang(profile.language ?? requestedLang, profile.country)

      const { data: claimed } = await admin
        .from('profiles')
        .update({ under_review_email_at: new Date().toISOString() })
        .eq('id', targetId)
        .is('under_review_email_at', null)
        .select('id')
      if (!claimed?.length) return json({ skipped: 'already_sent' })

      const message_id = await enqueue(admin, 'under-review', target.user.email, lang, {
        first_name: firstName(profile, target.user.email),
      })
      return json({ ok: true, template: 'under-review', lang, message_id })
    }

    if (event === 'approved') {
      if (!isSuperAdmin) return json({ error: 'Forbidden' }, 403)
      const targetId = body.user_id
      if (typeof targetId !== 'string') return json({ error: 'user_id required' }, 400)

      const { data: profile } = await admin.from('profiles').select('*').eq('id', targetId).maybeSingle<Profile>()
      if (!profile) return json({ error: 'Profile not found' }, 404)
      if (profile.status !== 'approved') return json({ error: `Profile is ${profile.status}, not approved` }, 400)

      const { data: target } = await admin.auth.admin.getUserById(targetId)
      const email = profile.email ?? target?.user?.email
      if (!email) return json({ error: 'No email on file' }, 400)

      const { data: claimed } = await admin
        .from('profiles')
        .update({ approved_email_at: new Date().toISOString() })
        .eq('id', targetId)
        .is('approved_email_at', null)
        .select('id')
      if (!claimed?.length) return json({ skipped: 'already_sent' })

      const lang = pickLang(profile.language, profile.country)
      const referral_link = profile.referral_code ? `${SITE_URL}/auth?ref=${profile.referral_code}` : `${SITE_URL}/dashboard/referrals`
      const message_id = await enqueue(admin, 'welcome-validated', email, lang, {
        first_name: firstName(profile, email),
        referral_link,
      })
      return json({ ok: true, template: 'welcome-validated', lang, message_id })
    }

    return json({ error: `Unknown event ${event}` }, 400)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('onboarding-emails failed', { event, msg })
    return json({ error: msg }, 500)
  }
})
