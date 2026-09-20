import type { SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { TRANSACTIONAL_EMAILS, type TxLang } from './transactional-emails.ts'

// Shared helpers for transactional emails sent by edge functions.

export const FROM = 'Sofara <noreply@sofara.io>'
export const SENDER_DOMAIN = 'notify.sofara.io'
export const SITE_URL = 'https://sofara.io'

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|li|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function firstNameOf(p: { first_name?: string | null; full_name?: string | null }, email: string): string {
  const fn = (p.first_name ?? (p.full_name ?? '').split(/\s+/)[0] ?? '').trim()
  if (fn) return fn.charAt(0).toUpperCase() + fn.slice(1)
  return email.split('@')[0]
}

/** English by default; French only when the profile explicitly says so. */
export const emailLang = (language: string | null | undefined): TxLang => (language === 'fr' ? 'fr' : 'en')

/**
 * Render a transactional template and push it on the transactional queue.
 * Fields are replaced after rendering, so a value may contain HTML (e.g. a pre-built callout).
 */
export async function enqueueTransactional(
  admin: SupabaseClient,
  templateId: string,
  to: string,
  lang: TxLang,
  fields: Record<string, string>,
  labelPrefix = 'tx'
): Promise<string> {
  const tpl = TRANSACTIONAL_EMAILS[templateId]
  if (!tpl) throw new Error(`Unknown template ${templateId}`)
  let html = tpl.html[lang]
  let subject = tpl.subject[lang]
  for (const [k, v] of Object.entries(fields)) {
    html = html.replaceAll(`{{${k}}}`, v)
    subject = subject.replaceAll(`{{${k}}}`, htmlToText(v))
  }
  const message_id = crypto.randomUUID()
  const label = `${labelPrefix}:${templateId}:${lang}`
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
