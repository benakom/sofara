import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { NEWSLETTER_ISSUES, type NewsletterIssue, type NewsletterLang } from '../_shared/newsletters.ts'

// Ambassador newsletter sender.
//
// Called hourly by pg_cron (service role) with { action: "run" }:
//   1. onboarding drip: for every approved ambassador approved after
//      newsletter_settings.onboarding_since, enqueue the next due onboarding
//      issue (one per run) that has not been sent yet.
//   2. campaigns: every newsletter_campaigns row with status 'scheduled' and
//      scheduled_for <= now is sent to its audience.
// Called by super admins from /admin/newsletters with:
//   { action: "test", issue_id, lang }            -> sends that issue to the admin's own address
//   { action: "preview", issue_id, lang }         -> returns { subject, html } (merge fields filled with samples)
//   { action: "run" }                              -> same as cron
//
// Emails go through the existing queue (transactional_emails -> process-email-queue)
// with purpose 'marketing' and an unsubscribe token. Suppressed addresses are skipped.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SITE_NAME = 'Sofara'
const FROM = `${SITE_NAME} <noreply@sofara.io>`
const SENDER_DOMAIN = 'notify.sofara.io'
const SITE_URL = 'https://sofara.io'
const QUEUE = 'transactional_emails'
const DAY_MS = 24 * 60 * 60 * 1000

// Countries whose ambassadors get the French edition unless profiles.language says otherwise.
const FRENCH_COUNTRIES = new Set([
  'france', 'fr', 'belgium', 'belgique', 'be', 'switzerland', 'suisse', 'ch', 'luxembourg', 'lu',
  'monaco', 'mc', 'morocco', 'maroc', 'ma', 'algeria', 'algérie', 'algerie', 'dz', 'tunisia', 'tunisie', 'tn',
  'senegal', 'sénégal', 'sn', 'ivory coast', "côte d'ivoire", "cote d'ivoire", 'ci', 'cameroon', 'cameroun', 'cm',
  'mali', 'ml', 'burkina faso', 'bf', 'niger', 'ne', 'benin', 'bénin', 'bj', 'togo', 'tg', 'gabon', 'ga',
  'congo', 'cg', 'drc', 'rdc', 'cd', 'guinea', 'guinée', 'gn', 'madagascar', 'mg', 'mauritius', 'maurice', 'mu',
  'haiti', 'haïti', 'ht', 'quebec', 'québec', 'lebanon', 'liban', 'lb', 'djibouti', 'dj', 'chad', 'tchad', 'td',
  'mauritania', 'mauritanie', 'mr', 'comoros', 'comores', 'km', 'seychelles', 'sc', 'burundi', 'bi', 'rwanda', 'rw',
])

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

function parseJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const payload = parts[1].replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '=')
    return JSON.parse(atob(payload)) as Record<string, unknown>
  } catch {
    return null
  }
}

interface Recipient {
  user_id: string
  email: string
  first_name: string
  referral_code: string | null
  lang: NewsletterLang
  approved_at: string
}

function pickLang(language: string | null, country: string | null): NewsletterLang {
  if (language === 'fr' || language === 'en') return language
  const c = (country ?? '').trim().toLowerCase()
  return c && FRENCH_COUNTRIES.has(c) ? 'fr' : 'en'
}

function firstName(fullName: string | null, email: string): string {
  const fn = (fullName ?? '').trim().split(/\s+/)[0]
  if (fn) return fn.charAt(0).toUpperCase() + fn.slice(1)
  return email.split('@')[0]
}

function fill(html: string, r: { first_name: string; referral_link: string; unsubscribe_url: string }): string {
  return html
    .replaceAll('{{first_name}}', r.first_name)
    .replaceAll('{{referral_link}}', r.referral_link)
    .replaceAll('{{unsubscribe_url}}', r.unsubscribe_url)
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|li|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function loadRecipients(admin: SupabaseClient): Promise<Recipient[]> {
  // Emails live in auth.users; everything else in profiles.
  const emails = new Map<string, string>()
  let page = 1
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(`listUsers failed: ${error.message}`)
    for (const u of data.users) if (u.email) emails.set(u.id, u.email)
    if (data.users.length < 1000) break
    page++
  }

  const { data: profiles, error } = await admin
    .from('profiles')
    .select('id, full_name, country, language, referral_code, status, reviewed_at, created_at')
    .eq('status', 'approved')
  if (error) throw new Error(`profiles query failed: ${error.message}`)

  const { data: suppressed } = await admin.from('suppressed_emails').select('email')
  const blocked = new Set((suppressed ?? []).map((s) => String(s.email).toLowerCase()))

  const out: Recipient[] = []
  for (const p of profiles ?? []) {
    const email = emails.get(p.id)
    if (!email || blocked.has(email.toLowerCase())) continue
    out.push({
      user_id: p.id,
      email,
      first_name: firstName(p.full_name, email),
      referral_code: p.referral_code,
      lang: pickLang(p.language, p.country),
      approved_at: p.reviewed_at ?? p.created_at,
    })
  }
  return out
}

async function unsubscribeUrl(admin: SupabaseClient, email: string, supabaseUrl: string): Promise<{ token: string; url: string }> {
  const { data: existing } = await admin.from('email_unsubscribe_tokens').select('token').eq('email', email).maybeSingle()
  let token = existing?.token as string | undefined
  if (!token) {
    token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
    const { error } = await admin.from('email_unsubscribe_tokens').insert({ token, email })
    if (error) {
      // Race with another run: read it back.
      const { data: again } = await admin.from('email_unsubscribe_tokens').select('token').eq('email', email).maybeSingle()
      token = (again?.token as string | undefined) ?? token
    }
  }
  return { token, url: `${supabaseUrl}/functions/v1/newsletter-unsubscribe?token=${token}` }
}

async function enqueue(
  admin: SupabaseClient,
  supabaseUrl: string,
  issue: NewsletterIssue,
  r: Recipient,
  campaignId: string | null,
  overrideTo?: string
): Promise<{ ok: boolean; message_id: string; error?: string }> {
  const to = overrideTo ?? r.email
  const unsub = await unsubscribeUrl(admin, to, supabaseUrl)
  const referral_link = r.referral_code ? `${SITE_URL}/auth?ref=${r.referral_code}` : `${SITE_URL}/dashboard/referrals`
  const html = fill(issue.html[r.lang], { first_name: r.first_name, referral_link, unsubscribe_url: unsub.url })
  const subject = issue.subject[r.lang].replaceAll('{{first_name}}', r.first_name)
  const text = htmlToText(html)
  const message_id = crypto.randomUUID()
  const label = `newsletter:${issue.id}:${r.lang}`

  await admin.from('email_send_log').insert({ message_id, template_name: label, recipient_email: to, status: 'pending' })

  const { error } = await admin.rpc('enqueue_email', {
    queue_name: QUEUE,
    payload: {
      message_id,
      to,
      from: FROM,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'marketing',
      label,
      unsubscribe_token: unsub.token,
      idempotency_key: message_id,
      queued_at: new Date().toISOString(),
    },
  })
  if (error) {
    await admin.from('email_send_log').insert({ message_id, template_name: label, recipient_email: to, status: 'failed', error_message: `enqueue: ${error.message}` })
    return { ok: false, message_id, error: error.message }
  }

  if (!overrideTo) {
    await admin.from('newsletter_sends').insert({ user_id: r.user_id, issue_id: issue.id, campaign_id: campaignId, lang: r.lang, email: to, message_id })
  }
  return { ok: true, message_id }
}

async function runOnboarding(admin: SupabaseClient, supabaseUrl: string, recipients: Recipient[]) {
  const { data: settings } = await admin.from('newsletter_settings').select('onboarding_enabled, onboarding_since').eq('id', 1).maybeSingle()
  if (!settings?.onboarding_enabled) return { skipped: 'disabled', sent: 0 }

  const since = new Date(settings.onboarding_since).getTime()
  const eligible = recipients.filter((r) => new Date(r.approved_at).getTime() >= since)
  if (!eligible.length) return { sent: 0, eligible: 0 }

  const { data: sentRows } = await admin
    .from('newsletter_sends')
    .select('user_id, issue_id')
    .is('campaign_id', null)
    .in('user_id', eligible.map((r) => r.user_id))
  const already = new Set((sentRows ?? []).map((s) => `${s.user_id}:${s.issue_id}`))

  const steps = NEWSLETTER_ISSUES.filter((i) => i.sequence === 'onboarding' && i.day !== null).sort((a, b) => (a.day ?? 0) - (b.day ?? 0))
  const now = Date.now()
  let sent = 0
  const errors: string[] = []
  for (const r of eligible) {
    const daysIn = Math.floor((now - new Date(r.approved_at).getTime()) / DAY_MS)
    const next = steps.find((s) => (s.day ?? 0) <= daysIn && !already.has(`${r.user_id}:${s.id}`))
    if (!next) continue
    const res = await enqueue(admin, supabaseUrl, next, r, null)
    if (res.ok) sent++
    else errors.push(`${r.email}: ${res.error}`)
  }
  return { sent, eligible: eligible.length, errors }
}

async function runCampaigns(admin: SupabaseClient, supabaseUrl: string, recipients: Recipient[]) {
  const { data: due } = await admin
    .from('newsletter_campaigns')
    .select('id, issue_id, audience')
    .eq('status', 'scheduled')
    .lte('scheduled_for', new Date().toISOString())
  const results: Record<string, unknown>[] = []

  for (const c of due ?? []) {
    // Claim it so a concurrent run does not double send.
    const { data: claimed } = await admin
      .from('newsletter_campaigns')
      .update({ status: 'sending' })
      .eq('id', c.id)
      .eq('status', 'scheduled')
      .select('id')
    if (!claimed?.length) continue

    const issue = NEWSLETTER_ISSUES.find((i) => i.id === c.issue_id)
    if (!issue) {
      await admin.from('newsletter_campaigns').update({ status: 'failed', error: `Unknown issue ${c.issue_id}`, finished_at: new Date().toISOString() }).eq('id', c.id)
      continue
    }
    if (/\[\[/.test(issue.html.en) || /\[\[/.test(issue.html.fr)) {
      await admin.from('newsletter_campaigns').update({ status: 'failed', error: 'Issue still contains [[placeholders]]; fill them in emails/newsletters/issues and rebuild.', finished_at: new Date().toISOString() }).eq('id', c.id)
      continue
    }

    let audience = recipients
    if (c.audience === 'inactive') {
      // Ambassadors with no lead in the last 90 days.
      const cutoff = new Date(Date.now() - 90 * DAY_MS).toISOString()
      const { data: active } = await admin.from('leads').select('user_id').gte('created_at', cutoff)
      const activeIds = new Set((active ?? []).map((l) => l.user_id))
      audience = recipients.filter((r) => !activeIds.has(r.user_id))
    }

    const { data: sentRows } = await admin.from('newsletter_sends').select('user_id').eq('campaign_id', c.id)
    const already = new Set((sentRows ?? []).map((s) => s.user_id))

    let sent = 0
    const errors: string[] = []
    for (const r of audience) {
      if (already.has(r.user_id)) continue
      const res = await enqueue(admin, supabaseUrl, issue, r, c.id)
      if (res.ok) sent++
      else errors.push(`${r.email}: ${res.error}`)
    }
    await admin
      .from('newsletter_campaigns')
      .update({
        status: 'sent',
        sent_count: sent + already.size,
        error: errors.length ? errors.slice(0, 20).join('\n') : null,
        finished_at: new Date().toISOString(),
      })
      .eq('id', c.id)
    results.push({ campaign: c.id, issue: c.issue_id, audience: c.audience, sent, errors: errors.length })
  }
  return results
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server configuration error' }, 500)

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const token = authHeader.slice(7).trim()
  const claims = parseJwtClaims(token)

  const admin = createClient(supabaseUrl, serviceKey)
  let callerEmail: string | null = null
  let isService = claims?.role === 'service_role'
  if (!isService) {
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) return json({ error: 'Unauthorized' }, 401)
    const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id)
    if (!(roles ?? []).some((r) => r.role === 'superadmin')) return json({ error: 'Forbidden' }, 403)
    callerEmail = user.email ?? null
    isService = false
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const action = (body.action as string) || 'run'

  try {
    if (action === 'preview' || action === 'test') {
      const issue = NEWSLETTER_ISSUES.find((i) => i.id === body.issue_id)
      const lang: NewsletterLang = body.lang === 'fr' ? 'fr' : 'en'
      if (!issue) return json({ error: 'Unknown issue_id' }, 400)

      if (action === 'preview') {
        const html = fill(issue.html[lang], { first_name: 'Sara', referral_link: `${SITE_URL}/auth?ref=SARA-1A2`, unsubscribe_url: '#' })
        return json({ subject: issue.subject[lang].replaceAll('{{first_name}}', 'Sara'), html })
      }

      if (!callerEmail) return json({ error: 'Test sends need a signed-in super admin' }, 400)
      const r: Recipient = { user_id: 'test', email: callerEmail, first_name: 'Sara', referral_code: 'SARA-1A2', lang, approved_at: new Date().toISOString() }
      const res = await enqueue(admin, supabaseUrl, issue, r, null, callerEmail)
      return json({ ok: res.ok, to: callerEmail, message_id: res.message_id, error: res.error })
    }

    if (action === 'run') {
      const recipients = await loadRecipients(admin)
      const onboarding = await runOnboarding(admin, supabaseUrl, recipients)
      const campaigns = await runCampaigns(admin, supabaseUrl, recipients)
      console.log('send-newsletters run', { recipients: recipients.length, onboarding, campaigns })
      return json({ recipients: recipients.length, onboarding, campaigns })
    }

    return json({ error: `Unknown action ${action}` }, 400)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('send-newsletters failed', msg)
    return json({ error: msg }, 500)
  }
})
