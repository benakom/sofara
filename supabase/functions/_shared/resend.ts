// Email delivery through Resend (https://resend.com/docs/api-reference/emails/send-email).
// Secrets: RESEND_API_KEY (required), RESEND_FROM (optional, overrides the payload From,
// e.g. "Sofara <noreply@sofara.io>"), RESEND_REPLY_TO (optional, defaults to hello@sofara.io).
// The sending domain sofara.io is verified in the Resend account.

export class EmailSendError extends Error {
  status: number
  retryAfterSeconds: number | null
  constructor(message: string, status: number, retryAfterSeconds: number | null = null) {
    super(message)
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export interface OutgoingEmail {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
  /** Marketing emails carry a one-click unsubscribe link (RFC 8058). */
  unsubscribe_url?: string | null
  idempotency_key?: string
  tags?: Record<string, string>
}

const DEFAULT_FROM = 'Sofara <noreply@sofara.io>'

export function unsubscribeUrlFor(token: string | null | undefined): string | null {
  const base = Deno.env.get('SUPABASE_URL')
  if (!token || !base) return null
  return `${base}/functions/v1/newsletter-unsubscribe?token=${encodeURIComponent(token)}`
}

export async function sendEmail(email: OutgoingEmail): Promise<{ id: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) throw new EmailSendError('RESEND_API_KEY is not set', 403)

  const headers: Record<string, string> = {}
  if (email.unsubscribe_url) {
    headers['List-Unsubscribe'] = `<${email.unsubscribe_url}>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
  }

  const body = {
    from: Deno.env.get('RESEND_FROM') || email.from || DEFAULT_FROM,
    to: [email.to],
    reply_to: Deno.env.get('RESEND_REPLY_TO') || 'hello@sofara.io',
    subject: email.subject,
    html: email.html,
    ...(email.text ? { text: email.text } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
    ...(email.tags
      ? { tags: Object.entries(email.tags).map(([name, value]) => ({ name, value: value.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 256) })) }
      : {}),
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(email.idempotency_key ? { 'Idempotency-Key': email.idempotency_key.slice(0, 256) } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const retry = Number(res.headers.get('retry-after'))
    // 401/403 (bad key, unverified domain) and 422 (invalid payload) are permanent: report them as 403.
    const status = res.status === 401 || res.status === 422 ? 403 : res.status
    throw new EmailSendError(`Resend ${res.status}: ${detail.slice(0, 500)}`, status, Number.isFinite(retry) && retry > 0 ? retry : null)
  }
  const data = await res.json().catch(() => ({}))
  return { id: String(data?.id ?? '') }
}
