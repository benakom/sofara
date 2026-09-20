import { createClient } from 'npm:@supabase/supabase-js@2'

// One-click unsubscribe for ambassador newsletters.
// GET/POST ?token=<email_unsubscribe_tokens.token> -> adds the address to suppressed_emails.
// verify_jwt = false (linked from emails, no session).

const page = (title: string, body: string, ok: boolean) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;font-family:Poppins,Arial,sans-serif;background:#fff;color:#4b5563}main{max-width:520px;margin:0 auto;padding:60px 25px}h1{color:#0d3a2b;font-size:22px}p{font-size:15px;line-height:1.6}a{color:#0d3a2b}.mark{font-weight:700;letter-spacing:3px;color:#0d3a2b;font-size:24px;margin-bottom:30px}</style></head>
<body><main><div class="mark">SOFARA</div><h1>${title}</h1>${body}<p style="margin-top:30px;font-size:13px;color:#9ca3af">${ok ? 'Transactional emails about your account and commissions are not affected.<br>Les emails transactionnels liés à votre compte et vos commissions ne sont pas concernés.' : ''}<br><a href="https://sofara.io">sofara.io</a></p></main></body></html>`

Deno.serve(async (req) => {
  const url = new URL(req.url)
  let token = url.searchParams.get('token')
  if (!token && req.method === 'POST') {
    try {
      const body = await req.json()
      token = body?.token ?? null
    } catch {
      /* form or empty body */
    }
  }
  const headers = { 'Content-Type': 'text/html; charset=utf-8' }
  if (!token) {
    return new Response(page('Invalid link · Lien invalide', '<p>This unsubscribe link is incomplete.<br>Ce lien de désabonnement est incomplet.</p>', false), { status: 400, headers })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: row } = await supabase.from('email_unsubscribe_tokens').select('email, used_at').eq('token', token).maybeSingle()
  if (!row) {
    return new Response(page('Invalid link · Lien invalide', '<p>This unsubscribe link is not recognised.<br>Ce lien de désabonnement n\'est pas reconnu.</p>', false), { status: 404, headers })
  }

  const { error } = await supabase.from('suppressed_emails').upsert(
    { email: row.email, reason: 'unsubscribe', metadata: { source: 'newsletter-unsubscribe' } },
    { onConflict: 'email', ignoreDuplicates: true }
  )
  if (error) {
    console.error('Failed to suppress email', { email: row.email, error: error.message })
    return new Response(page('Something went wrong · Une erreur est survenue', '<p>Please try again later or write to hello@sofara.io.<br>Réessayez plus tard ou écrivez à hello@sofara.io.</p>', false), { status: 500, headers })
  }
  if (!row.used_at) {
    await supabase.from('email_unsubscribe_tokens').update({ used_at: new Date().toISOString() }).eq('token', token)
  }
  await supabase.from('email_send_log').insert({ template_name: 'newsletter-unsubscribe', recipient_email: row.email, status: 'suppressed' })

  return new Response(
    page('Unsubscribed · Désabonné', `<p><strong>${row.email}</strong> will no longer receive the Sofara ambassador newsletter.<br>ne recevra plus la newsletter ambassadeurs Sofara.</p>`, true),
    { status: 200, headers }
  )
})
