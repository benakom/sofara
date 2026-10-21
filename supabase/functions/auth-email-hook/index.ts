import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { Webhook } from 'npm:standardwebhooks@1.0.0'
import { sendEmail } from '../_shared/resend.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'
import { InviteEmail } from '../_shared/email-templates/invite.tsx'
import { MagicLinkEmail } from '../_shared/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../_shared/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../_shared/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'
import { subjectFor } from '../_shared/email-templates/i18n.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Subjects are bilingual, see ../_shared/email-templates/i18n.tsx (subjectFor).

// Countries whose users get French auth emails when no language is stored.
const FRENCH_COUNTRIES = new Set([
  'france', 'fr', 'belgium', 'belgique', 'be', 'switzerland', 'suisse', 'ch', 'luxembourg', 'lu', 'monaco', 'mc',
  'morocco', 'maroc', 'ma', 'algeria', 'algérie', 'algerie', 'dz', 'tunisia', 'tunisie', 'tn', 'senegal', 'sénégal', 'sn',
  'ivory coast', "côte d'ivoire", "cote d'ivoire", 'ci', 'cameroon', 'cameroun', 'cm', 'mali', 'ml', 'burkina faso', 'bf',
  'niger', 'ne', 'benin', 'bénin', 'bj', 'togo', 'tg', 'gabon', 'ga', 'congo', 'cg', 'drc', 'rdc', 'cd', 'guinea', 'guinée', 'gn',
  'madagascar', 'mg', 'mauritius', 'maurice', 'mu', 'haiti', 'haïti', 'ht', 'quebec', 'québec', 'lebanon', 'liban', 'lb',
  'djibouti', 'dj', 'chad', 'tchad', 'td', 'mauritania', 'mauritanie', 'mr', 'comoros', 'comores', 'km', 'burundi', 'bi', 'rwanda', 'rw',
])

// 'en' | 'fr' when we know the person's language, 'both' otherwise (email rendered in both).
async function resolveLang(supabase: ReturnType<typeof createClient>, payload: any): Promise<'en' | 'fr' | 'both'> {
  const meta = payload?.data?.user?.user_metadata ?? payload?.data?.user_metadata ?? payload?.user?.user_metadata ?? {}
  if (meta?.lang === 'fr' || meta?.lang === 'en') return meta.lang
  const email = payload?.data?.email
  if (!email) return 'both'
  try {
    const { data } = await supabase.from('profiles').select('language, country').ilike('email', email).maybeSingle()
    if (data?.language === 'fr' || data?.language === 'en') return data.language
    const c = String(data?.country ?? '').trim().toLowerCase()
    if (c && FRENCH_COUNTRIES.has(c)) return 'fr'
  } catch (_) {
    /* fall through */
  }
  return 'both'
}

// Template mapping
const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

// Configuration
const SITE_NAME = "sofara"
const ROOT_DOMAIN = "sofara.io"
const FROM_DOMAIN = "sofara.io" // Domain shown in From address (may be root or sender subdomain)

// Sample data for preview mode ONLY (not used in actual email sending).
// URLs are baked in at scaffold time from the project's real data.
// The sample email uses a fixed placeholder (RFC 6761 .test TLD) so the Go backend
// can always find-and-replace it with the actual recipient when sending test emails,
// even if the project's domain has changed since the template was scaffolded.
const SAMPLE_PROJECT_URL = "https://sofara.io"
const SAMPLE_EMAIL = "user@example.test"
const SAMPLE_DATA: Record<string, object> = {
  signup: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: SAMPLE_PROJECT_URL,
  },
  magiclink: {
    siteName: SITE_NAME,
    confirmationUrl: SAMPLE_PROJECT_URL,
  },
  recovery: {
    siteName: SITE_NAME,
    confirmationUrl: SAMPLE_PROJECT_URL,
  },
  invite: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    confirmationUrl: SAMPLE_PROJECT_URL,
  },
  email_change: {
    siteName: SITE_NAME,
    email: SAMPLE_EMAIL,
    newEmail: SAMPLE_EMAIL,
    confirmationUrl: SAMPLE_PROJECT_URL,
  },
  reauthentication: {
    token: '123456',
  },
}

// Preview endpoint handler - returns rendered HTML without sending email
async function handlePreview(req: Request): Promise<Response> {
  const previewCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: previewCorsHeaders })
  }

  // Super-admin tooling only: requires the service-role key.
  const apiKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authHeader = req.headers.get('Authorization')

  if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let type: string
  try {
    const body = await req.json()
    type = body.type
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const EmailTemplate = EMAIL_TEMPLATES[type]

  if (!EmailTemplate) {
    return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
      status: 400,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const sampleData = SAMPLE_DATA[type] || {}
  const html = await renderAsync(React.createElement(EmailTemplate, sampleData))

  return new Response(html, {
    status: 200,
    headers: { ...previewCorsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// Supabase Auth "Send Email" hook (Authentication > Hooks > Send Email -> this function).
// Payload: { user: { email, new_email?, user_metadata }, email_data: { token, token_hash,
// redirect_to, email_action_type, site_url, token_new?, token_hash_new? } }, signed with
// Standard Webhooks; the secret (v1,whsec_...) is stored as SEND_EMAIL_HOOK_SECRET.
// The email is rendered here and sent straight away through Resend, so codes arrive in seconds.
const hookError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { http_code: status, message } }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

async function handleWebhook(req: Request): Promise<Response> {
  const secret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
  if (!secret) {
    console.error('SEND_EMAIL_HOOK_SECRET not configured')
    return hookError(500, 'Server configuration error')
  }

  const raw = await req.text()
  let payload: any
  try {
    const wh = new Webhook(secret.replace(/^v1,whsec_/, ''))
    payload = wh.verify(raw, Object.fromEntries(req.headers))
  } catch (error) {
    console.error('Invalid hook signature', { error: error instanceof Error ? error.message : String(error) })
    return hookError(401, 'Invalid signature')
  }

  const user = payload?.user ?? {}
  const data = payload?.email_data ?? {}
  const emailType: string = data.email_action_type
  const EmailTemplate = EMAIL_TEMPLATES[emailType]
  if (!EmailTemplate) {
    console.error('Unknown email type', { emailType })
    return hookError(400, `Unknown email type: ${emailType}`)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // EN, FR, or both languages in one email when the recipient's language is unknown.
  const lang = await resolveLang(supabase, { user, data: { email: user.email } })

  const redirectTo = data.redirect_to || `https://${ROOT_DOMAIN}/auth`
  const confirmationUrl = data.token_hash
    ? `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(data.token_hash)}&type=${encodeURIComponent(emailType)}&redirect_to=${encodeURIComponent(redirectTo)}`
    : redirectTo

  // Email change: the code goes to the new address.
  const to: string = emailType === 'email_change' && user.new_email ? user.new_email : user.email
  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: `https://${ROOT_DOMAIN}`,
    recipient: to,
    confirmationUrl,
    token: emailType === 'email_change' && data.token_new ? data.token_new : data.token,
    email: user.email,
    newEmail: user.new_email,
    lang,
  }

  const html = await renderAsync(React.createElement(EmailTemplate, templateProps))
  const text = await renderAsync(React.createElement(EmailTemplate, templateProps), { plainText: true })
  const messageId = crypto.randomUUID()

  try {
    const res = await sendEmail({
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      subject: subjectFor(emailType, lang),
      html,
      text,
      idempotency_key: messageId,
      tags: { label: emailType },
    })
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: emailType, recipient_email: to, status: 'sent' })
    console.log('Auth email sent', { emailType, resend_id: res.id })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Auth email failed', { emailType, msg })
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: emailType, recipient_email: to, status: 'failed', error_message: msg.slice(0, 1000) })
    return hookError(500, 'Email could not be sent')
  }

  return new Response(JSON.stringify({}), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  // Handle CORS preflight for main endpoint
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Route to preview handler for /preview path
  if (url.pathname.endsWith('/preview')) {
    return handlePreview(req)
  }

  // Main webhook handler
  try {
    return await handleWebhook(req)
  } catch (error) {
    console.error('Webhook handler error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
