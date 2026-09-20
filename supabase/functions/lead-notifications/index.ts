import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { enqueueTransactional, emailLang, escapeHtml, firstNameOf, SITE_URL } from '../_shared/transactional.ts'
import { leadStageText, LOST_REASONS } from '../_shared/lead-stages.ts'

// Emails ambassadors when the Sofara team moves one of their leads or leaves them a note.
//
//   { event_id }         called by the DB trigger right after a lead_stage_events insert
//   { action: "sweep" }  called every 10 minutes by pg_cron: sends anything not yet notified
//
// Auth: service role (trigger, cron) or a signed-in super admin. Idempotent through
// lead_stage_events.notified_at, claimed atomically before enqueueing.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
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

interface StageEvent {
  id: string
  lead_id: string
  user_id: string
  from_stage: string | null
  to_stage: string
  note: string | null
  kind: 'stage' | 'note'
  visible_to_ambassador: boolean
  notified_at: string | null
  created_at: string
  changed_by: string | null
}

const callout = (text: string, lang: 'en' | 'fr', title?: string) =>
  `<div style="background:#f3f4f6;border-left:4px solid #D3F34B;border-radius:10px;padding:14px 18px;margin:0 0 18px"><p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4b5563;margin-bottom:0">${
    title ? `<strong style="color:#111827">${escapeHtml(title)}</strong> ` : ''
  }${escapeHtml(text).replace(/\n/g, '<br />')}</p></div>`

async function processEvent(admin: SupabaseClient, ev: StageEvent): Promise<Record<string, unknown>> {
  // Creation events and admin-only entries never email the ambassador.
  if (ev.kind === 'stage' && ev.from_stage === null) return { event: ev.id, skipped: 'creation' }
  if (!ev.visible_to_ambassador) return { event: ev.id, skipped: 'internal' }

  const { data: lead } = await admin.from('leads').select('id, user_id, first_name, last_name, stage, next_action, next_action_at, lost_reason').eq('id', ev.lead_id).maybeSingle()
  if (!lead) return { event: ev.id, skipped: 'lead_missing' }
  if (ev.changed_by && ev.changed_by === lead.user_id) return { event: ev.id, skipped: 'own_change' }

  const { data: profile } = await admin.from('profiles').select('id, email, first_name, full_name, language, notify_email, referral_code, status').eq('id', lead.user_id).maybeSingle()
  if (!profile?.email) return { event: ev.id, skipped: 'no_email' }

  // Claim before sending so a trigger call and a sweep never both send.
  const { data: claimed } = await admin.from('lead_stage_events').update({ notified_at: new Date().toISOString() }).eq('id', ev.id).is('notified_at', null).select('id')
  if (!claimed?.length) return { event: ev.id, skipped: 'already_notified' }

  if (profile.notify_email === false) return { event: ev.id, skipped: 'opted_out' }
  if (profile.status !== 'approved' && profile.status !== 'pro_pending') return { event: ev.id, skipped: 'not_active' }

  const lang = emailLang(profile.language)
  const leadFirst = String(lead.first_name ?? '').trim()
  const leadName = `${leadFirst} ${String(lead.last_name ?? '').trim()}`.trim() || (lang === 'fr' ? 'votre lead' : 'your lead')
  const text = leadStageText(ev.kind === 'stage' ? ev.to_stage : lead.stage, lang, leadFirst)

  const noteTitle = lang === 'fr' ? "Note de l'équipe Sofara" : 'Note from the Sofara team'
  const note_html = ev.note ? callout(ev.note, lang, noteTitle) : ''
  const hint_html = text.hint ? callout(text.hint, lang, lang === 'fr' ? 'Comment aider' : 'How you can help') : ''

  let next_html = ''
  if (lead.next_action) {
    const when = lead.next_action_at ? new Date(lead.next_action_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : null
    next_html = `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4b5563"><strong style="color:#111827">${lang === 'fr' ? 'Prochaine étape' : 'Next step'}:</strong> ${escapeHtml(lead.next_action)}${when ? ` (${when})` : ''}</p>`
  }
  let lost_html = ''
  if (lead.lost_reason) {
    const r = LOST_REASONS.find((x) => x.key === lead.lost_reason)
    lost_html = `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4b5563"><strong style="color:#111827">${lang === 'fr' ? 'Raison' : 'Reason'}:</strong> ${escapeHtml(r ? r[lang] : lead.lost_reason)}</p>`
  }

  const fields = {
    first_name: firstNameOf(profile, profile.email),
    lead_name: leadName,
    stage_label: text.label,
    stage_message: text.msg,
    note_html,
    hint_html,
    next_html,
    lost_html,
    lead_url: `${SITE_URL}/dashboard/pipeline?lead=${lead.id}`,
    referral_link: profile.referral_code ? `${SITE_URL}/auth?ref=${profile.referral_code}` : `${SITE_URL}/dashboard/referrals`,
  }
  const template = ev.kind === 'note' ? 'lead-note' : 'lead-stage-update'
  const message_id = await enqueueTransactional(admin, template, profile.email, lang, fields, 'lead')
  return { event: ev.id, sent: template, lang, message_id }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server configuration error' }, 500)

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const claims = parseJwtClaims(authHeader.slice(7).trim())
  const admin = createClient(supabaseUrl, serviceKey)

  if (claims?.role !== 'service_role') {
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) return json({ error: 'Unauthorized' }, 401)
    const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id)
    if (!(roles ?? []).some((r) => r.role === 'superadmin')) return json({ error: 'Forbidden' }, 403)
  }

  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { body = {} }

  try {
    const select = 'id, lead_id, user_id, from_stage, to_stage, note, kind, visible_to_ambassador, notified_at, created_at, changed_by'
    let events: StageEvent[] = []

    if (typeof body.event_id === 'string') {
      const { data } = await admin.from('lead_stage_events').select(select).eq('id', body.event_id).is('notified_at', null).maybeSingle<StageEvent>()
      if (data) events = [data]
    } else {
      const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      const { data } = await admin.from('lead_stage_events').select(select).is('notified_at', null).gte('created_at', since).order('created_at', { ascending: true }).limit(200)
      events = (data ?? []) as StageEvent[]
    }

    const results: Record<string, unknown>[] = []
    for (const ev of events) {
      try {
        results.push(await processEvent(admin, ev))
      } catch (e) {
        results.push({ event: ev.id, error: e instanceof Error ? e.message : String(e) })
      }
    }
    if (results.length) console.log('lead-notifications', results)
    return json({ processed: results.length, results })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('lead-notifications failed', msg)
    return json({ error: msg }, 500)
  }
})
