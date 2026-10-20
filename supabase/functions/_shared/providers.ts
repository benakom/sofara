// Provider selection for everything that used to go through Lovable's gateways.
// Rule: when LOVABLE_API_KEY is present every request is byte-for-byte what it was on Lovable.
// When it is absent, the same call goes to the provider we own: Google Gemini (OpenAI-compatible
// endpoint), Resend, Twilio, and Supabase's native Send Email auth hook. Pure functions, no I/O:
// `env` and `fetcher` are injected so the whole file is unit-tested with vitest.

export type Environment = (name: string) => string | undefined;
export type Payload = Record<string, unknown>;
const runtimeEnv: Environment = (name) => {
  const runtime = globalThis as typeof globalThis & { Deno?: { env: { get: Environment } } };
  return runtime.Deno?.env.get(name);
};

// ---------------------------------------------------------------- AI

export function hasAIProvider(env: Environment = runtimeEnv): boolean {
  return Boolean(env('LOVABLE_API_KEY') || env('GEMINI_API_KEY'));
}

/** Lovable model ids ("google/gemini-2.5-flash") → the id Google's own endpoint accepts. GEMINI_MODEL overrides. */
export function geminiModel(requested: unknown, env: Environment = runtimeEnv): string {
  const override = env('GEMINI_MODEL');
  if (override) return override;
  const model = String(requested || 'gemini-2.5-flash').replace(/^google\//, '');
  // Gemini 2.5 ids are not served to accounts created after mid-2026; 3.x flash-lite is the current equivalent.
  return model.startsWith('gemini-2.5') ? 'gemini-3.1-flash-lite' : model.replace('gemini-3-flash-preview', 'gemini-3.1-flash-lite');
}

export function aiRequest(payload: Payload, env: Environment = runtimeEnv) {
  const lovableKey = env('LOVABLE_API_KEY');
  const key = lovableKey || env('GEMINI_API_KEY');
  if (!key) throw new Error('AI provider is not configured');
  return {
    url: lovableKey ? 'https://ai.gateway.lovable.dev/v1/chat/completions' : 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    options: {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(lovableKey ? payload : { ...payload, model: geminiModel(payload.model, env) }),
    },
  };
}

export function requestAI(payload: Payload, env: Environment = runtimeEnv, fetcher: typeof fetch = fetch) {
  const request = aiRequest(payload, env);
  return fetcher(request.url, request.options);
}

// ---------------------------------------------------------------- Email

export function hasEmailProvider(env: Environment = runtimeEnv): boolean {
  return Boolean(env('LOVABLE_API_KEY') || env('RESEND_API_KEY'));
}

const NATIVE_ACTIONS = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email_change_new', 'reauthentication'];

/**
 * Adapt a signature-verified native Supabase Send Email hook body to the payload shape the
 * templates were written for (Lovable's `{ version, run_id, type, data }`).
 * Secure email change arrives as two hook calls: `email_change` (to the current address,
 * token_hash) and `email_change_new` (to the new address, token_hash_new). Both render the
 * same template; the recipient and token differ.
 */
export function nativeAuthPayload(input: unknown, backendUrl: string) {
  const body = input as {
    user?: { email?: string; new_email?: string; user_metadata?: Record<string, unknown> };
    email_data?: { email_action_type?: string; token?: string; token_hash?: string; token_new?: string; token_hash_new?: string; redirect_to?: string; site_url?: string };
  };
  const data = body?.email_data;
  const action = data?.email_action_type;
  if (!body?.user?.email || !action || !NATIVE_ACTIONS.includes(action)) throw new Error('Invalid native auth hook payload');
  const toNew = action === 'email_change_new';
  const tokenHash = toNew ? data?.token_hash_new : data?.token_hash;
  const url = new URL('/auth/v1/verify', backendUrl);
  if (tokenHash) url.searchParams.set('token', tokenHash);
  url.searchParams.set('type', toNew ? 'email_change' : action);
  if (data?.redirect_to) url.searchParams.set('redirect_to', data.redirect_to);
  return {
    version: '1',
    run_id: crypto.randomUUID(),
    type: 'auth',
    data: {
      action_type: toNew ? 'email_change' : action,
      email: toNew ? body.user.new_email || body.user.email : body.user.email,
      new_email: body.user.new_email,
      token: toNew ? data?.token_new || data?.token : data?.token,
      url: url.toString(),
      user: { user_metadata: body.user.user_metadata ?? {} },
    },
  };
}

/** Where a one-click unsubscribe token resolves when we send through Resend ourselves. */
export function unsubscribeUrl(token: string, env: Environment = runtimeEnv): string | undefined {
  const template = env('EMAIL_UNSUBSCRIBE_URL');
  if (template) return template.replace('{token}', encodeURIComponent(token));
  const base = env('SUPABASE_URL');
  return base ? `${base.replace(/\/$/, '')}/functions/v1/newsletter-unsubscribe?token=${encodeURIComponent(token)}` : undefined;
}

export function resendRequest(payload: Payload, env: Environment = runtimeEnv) {
  const lovableKey = env('LOVABLE_API_KEY');
  const resendKey = env('RESEND_API_KEY');
  if (!resendKey) throw new Error('Resend provider is not configured');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${lovableKey || resendKey}` };
  if (lovableKey) headers['X-Connection-Api-Key'] = resendKey;
  else if (typeof payload.idempotency_key === 'string') headers['Idempotency-Key'] = payload.idempotency_key;
  const body: Payload = {};
  for (const field of ['from', 'to', 'subject', 'html', 'text', 'reply_to', 'cc', 'bcc', 'headers', 'attachments', 'tags']) {
    if (payload[field] !== undefined) body[field] = payload[field];
  }
  if (!lovableKey) {
    // RESEND_FROM fills in a missing sender; it never overrides the address a template chose.
    if (!body.from && env('RESEND_FROM')) body.from = env('RESEND_FROM');
    if (typeof payload.unsubscribe_token === 'string' && payload.unsubscribe_token) {
      const url = unsubscribeUrl(payload.unsubscribe_token, env);
      if (url) body.headers = { ...(body.headers as Record<string, string> | undefined), 'List-Unsubscribe': `<${url}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };
    }
    if (typeof payload.message_id === 'string' && payload.message_id) body.headers = { ...(body.headers as Record<string, string> | undefined), 'X-Entity-Ref-ID': payload.message_id };
  }
  return {
    url: lovableKey ? 'https://connector-gateway.lovable.dev/resend/emails' : 'https://api.resend.com/emails',
    options: { method: 'POST', headers, body: JSON.stringify(body) },
  };
}

export function requestResend(payload: Payload, env: Environment = runtimeEnv, fetcher: typeof fetch = fetch) {
  const request = resendRequest(payload, env);
  return fetcher(request.url, request.options);
}

/** Queue dispatcher send: Lovable Emails SDK when its key exists, else Resend with the same retry semantics (status + Retry-After). */
export async function sendQueuedEmail(
  payload: Payload,
  // deno-lint-ignore no-explicit-any
  lovableSender: (payload: any, options: { apiKey: string; sendUrl?: string }) => Promise<unknown>,
  env: Environment = runtimeEnv,
  fetcher: typeof fetch = fetch,
) {
  const key = env('LOVABLE_API_KEY');
  if (key) return lovableSender(payload, { apiKey: key, sendUrl: env('LOVABLE_SEND_URL') });
  const response = await requestResend({ ...payload, idempotency_key: payload.idempotency_key || payload.message_id }, env, fetcher);
  if (!response.ok) {
    const retry = response.headers.get('Retry-After');
    const seconds = retry ? Number(retry) : 60;
    const detail = (await response.text().catch(() => '')).slice(0, 300);
    throw Object.assign(new Error(`Resend email send failed (${response.status})${detail ? `: ${detail}` : ''}`), {
      status: response.status,
      retryAfterSeconds: Number.isFinite(seconds) ? seconds : 60,
    });
  }
  return response.json();
}

// ---------------------------------------------------------------- Twilio (WhatsApp)

export function hasTwilioProvider(env: Environment = runtimeEnv): boolean {
  return Boolean((env('LOVABLE_API_KEY') && env('TWILIO_API_KEY')) || (env('TWILIO_ACCOUNT_SID') && env('TWILIO_AUTH_TOKEN')));
}

/** Twilio Messages API: Lovable's connector gateway on Lovable, our own account (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN) elsewhere. */
export function twilioRequest(form: { To: string; From?: string; Body: string }, env: Environment = runtimeEnv): { url: string; options: { method: string; headers: Record<string, string>; body: string } } {
  const lovableKey = env('LOVABLE_API_KEY');
  const connectorKey = env('TWILIO_API_KEY');
  const from = form.From || env('TWILIO_WHATSAPP_FROM') || 'whatsapp:+14155238886';
  const body = new URLSearchParams({ To: form.To, From: from, Body: form.Body }).toString();
  const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (lovableKey && connectorKey) {
    headers.Authorization = `Bearer ${lovableKey}`;
    headers['X-Connection-Api-Key'] = connectorKey;
    return { url: 'https://connector-gateway.lovable.dev/twilio/2010-04-01/Accounts/default/Messages.json', options: { method: 'POST', headers, body } };
  }
  const sid = env('TWILIO_ACCOUNT_SID');
  const token = env('TWILIO_AUTH_TOKEN');
  if (!sid || !token) throw new Error('Twilio provider is not configured');
  headers.Authorization = `Basic ${btoa(`${sid}:${token}`)}`;
  return { url: `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, options: { method: 'POST', headers, body } };
}

export function requestTwilio(form: { To: string; From?: string; Body: string }, env: Environment = runtimeEnv, fetcher: typeof fetch = fetch) {
  const request = twilioRequest(form, env);
  return fetcher(request.url, request.options);
}

// ---------------------------------------------------------------- Service-role callers

/** True for a legacy service_role JWT or the project's secret key (new projects issue `sb_secret_…`, which is not a JWT). */
export function isServiceRoleToken(token: string, env: Environment = runtimeEnv): boolean {
  if (!token) return false;
  const secret = env('SUPABASE_SERVICE_ROLE_KEY');
  if (secret && token === secret) return true;
  const parts = token.split('.');
  if (parts.length < 2) return false;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '=');
    return (JSON.parse(atob(payload)) as { role?: string }).role === 'service_role';
  } catch {
    return false;
  }
}
