import { describe, it, expect, vi } from 'vitest';
import {
  aiRequest, requestAI, geminiModel, hasAIProvider,
  resendRequest, sendQueuedEmail, hasEmailProvider, unsubscribeUrl,
  nativeAuthPayload, twilioRequest, hasTwilioProvider, isServiceRoleToken,
} from '../../supabase/functions/_shared/providers';

const env = (values: Record<string, string>) => (name: string) => values[name];
const payload = { model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: 'test' }], stream: true, tools: [{ type: 'function' }], response_format: { type: 'json_object' } };

describe('AI provider', () => {
  it('keeps the Lovable AI path and payload untouched when both providers exist', () => {
    const request = aiRequest(payload, env({ LOVABLE_API_KEY: 'test-lovable', GEMINI_API_KEY: 'test-gemini', GEMINI_MODEL: 'gemini-3.1-flash-lite' }));
    expect(request.url).toBe('https://ai.gateway.lovable.dev/v1/chat/completions');
    expect(request.options.headers.Authorization).toBe('Bearer test-lovable');
    expect(JSON.parse(request.options.body)).toEqual(payload);
  });
  it('goes to Google directly when Lovable is absent, with the model id Google serves', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}'));
    await requestAI(payload, env({ GEMINI_API_KEY: 'test-gemini' }), fetcher);
    expect(fetcher.mock.calls[0][0]).toBe('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ ...payload, model: 'gemini-3.1-flash-lite' });
  });
  it('maps Lovable model ids and honours GEMINI_MODEL', () => {
    expect(geminiModel('google/gemini-2.5-flash', env({}))).toBe('gemini-3.1-flash-lite');
    expect(geminiModel('google/gemini-3-flash-preview', env({}))).toBe('gemini-3.1-flash-lite');
    expect(geminiModel('google/gemini-3.1-pro', env({}))).toBe('gemini-3.1-pro');
    expect(geminiModel('google/gemini-2.5-flash', env({ GEMINI_MODEL: 'gemini-3.5-flash' }))).toBe('gemini-3.5-flash');
  });
  it('does not fall back on a Lovable HTTP failure', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 429 }));
    expect((await requestAI(payload, env({ LOVABLE_API_KEY: 'test', GEMINI_API_KEY: 'test' }), fetcher)).status).toBe(429);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('fails safely without keys', () => {
    expect(() => aiRequest(payload, env({}))).toThrow();
    expect(hasAIProvider(env({}))).toBe(false);
    expect(hasAIProvider(env({ GEMINI_API_KEY: 'x' }))).toBe(true);
  });
});

describe('Resend', () => {
  it('keeps the Lovable connector sender and attachments', () => {
    const mail = { from: 'old@example.test', to: ['user@example.test'], subject: 'test', html: '<p>test</p>', attachments: [{ filename: 'report.pdf', content: 'test' }] };
    const request = resendRequest(mail, env({ LOVABLE_API_KEY: 'test', RESEND_API_KEY: 'test', RESEND_FROM: 'new@example.test' }));
    expect(request.url).toBe('https://connector-gateway.lovable.dev/resend/emails');
    expect(request.options.headers['X-Connection-Api-Key']).toBe('test');
    expect(JSON.parse(request.options.body)).toEqual(mail);
  });
  it('sends through api.resend.com with the template sender kept and RESEND_FROM only filling a gap', () => {
    const kept = resendRequest({ from: 'Sofara <noreply@sofara.io>', to: 'u@example.test', html: 'x', text: 'x' }, env({ RESEND_API_KEY: 'k', RESEND_FROM: 'other@example.test' }));
    expect(kept.url).toBe('https://api.resend.com/emails');
    expect(kept.options.headers.Authorization).toBe('Bearer k');
    expect(JSON.parse(kept.options.body).from).toBe('Sofara <noreply@sofara.io>');
    const filled = resendRequest({ to: 'u@example.test', html: 'x' }, env({ RESEND_API_KEY: 'k', RESEND_FROM: 'other@example.test' }));
    expect(JSON.parse(filled.options.body).from).toBe('other@example.test');
  });
  it('drops Lovable-only fields and adds idempotency and reference headers', () => {
    const request = resendRequest({ to: 'u@example.test', html: 'x', run_id: 'r', sender_domain: 'notify.x', purpose: 'transactional', label: 'l', message_id: 'm-1', idempotency_key: 'i-1' }, env({ RESEND_API_KEY: 'k' }));
    const body = JSON.parse(request.options.body);
    expect(Object.keys(body).sort()).toEqual(['headers', 'html', 'to']);
    expect(body.headers['X-Entity-Ref-ID']).toBe('m-1');
    expect(request.options.headers['Idempotency-Key']).toBe('i-1');
  });
  it('turns an unsubscribe token into one-click List-Unsubscribe headers', () => {
    const request = resendRequest({ to: 'u@example.test', html: 'x', unsubscribe_token: 'tok 1' }, env({ RESEND_API_KEY: 'k', SUPABASE_URL: 'https://abc.supabase.co' }));
    const headers = JSON.parse(request.options.body).headers;
    expect(headers['List-Unsubscribe']).toBe('<https://abc.supabase.co/functions/v1/newsletter-unsubscribe?token=tok%201>');
    expect(headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    expect(unsubscribeUrl('t', env({ EMAIL_UNSUBSCRIBE_URL: 'https://x.test/u?t={token}' }))).toBe('https://x.test/u?t=t');
    expect(unsubscribeUrl('t', env({}))).toBeUndefined();
  });
  it('keeps the managed queue SDK when Lovable is configured', async () => {
    const sender = vi.fn().mockResolvedValue({}); const fetcher = vi.fn();
    await sendQueuedEmail({ html: 'test' }, sender, env({ LOVABLE_API_KEY: 'test' }), fetcher);
    expect(sender).toHaveBeenCalledWith({ html: 'test' }, { apiKey: 'test', sendUrl: undefined }); expect(fetcher).not.toHaveBeenCalled();
  });
  it('retains 429 status and Retry-After for the existing queue cooldown', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('slow down', { status: 429, headers: { 'Retry-After': '120' } }));
    await expect(sendQueuedEmail({ message_id: 'test-id', html: 'test' }, vi.fn(), env({ RESEND_API_KEY: 'test' }), fetcher)).rejects.toMatchObject({ status: 429, retryAfterSeconds: 120 });
    expect(fetcher.mock.calls[0][1].headers['Idempotency-Key']).toBe('test-id');
  });
  it('fails safely without keys', () => {
    expect(() => resendRequest({}, env({}))).toThrow();
    expect(hasEmailProvider(env({}))).toBe(false);
    expect(hasEmailProvider(env({ RESEND_API_KEY: 'x' }))).toBe(true);
  });
});

describe('native Supabase auth hook payload', () => {
  const base = { user: { email: 'user@example.test', user_metadata: { lang: 'fr' } } };
  it.each(['signup', 'invite', 'magiclink', 'recovery', 'reauthentication'])('adapts %s to the template contract', (action) => {
    const result = nativeAuthPayload({ ...base, email_data: { email_action_type: action, token: '123456', token_hash: 'test-hash', redirect_to: 'https://www.offplansimulator.com/admin' } }, 'https://abc.supabase.co');
    expect(result.version).toBe('1');
    expect(result.type).toBe('auth');
    expect(result.data.action_type).toBe(action);
    expect(result.data.email).toBe('user@example.test');
    expect(result.data.token).toBe('123456');
    expect(result.data.user.user_metadata).toEqual({ lang: 'fr' });
    const url = new URL(result.data.url);
    expect(url.origin + url.pathname).toBe('https://abc.supabase.co/auth/v1/verify');
    expect(url.searchParams.get('token')).toBe('test-hash');
    expect(url.searchParams.get('type')).toBe(action);
    expect(url.searchParams.get('redirect_to')).toBe('https://www.offplansimulator.com/admin');
  });
  it('sends the two halves of a secure email change to the right addresses', () => {
    const data = { token: '111111', token_hash: 'old-hash', token_new: '222222', token_hash_new: 'new-hash' };
    const current = nativeAuthPayload({ user: { email: 'old@example.test', new_email: 'new@example.test' }, email_data: { ...data, email_action_type: 'email_change' } }, 'https://abc.supabase.co');
    expect(current.data.email).toBe('old@example.test');
    expect(current.data.token).toBe('111111');
    expect(new URL(current.data.url).searchParams.get('token')).toBe('old-hash');
    const next = nativeAuthPayload({ user: { email: 'old@example.test', new_email: 'new@example.test' }, email_data: { ...data, email_action_type: 'email_change_new' } }, 'https://abc.supabase.co');
    expect(next.data.action_type).toBe('email_change');
    expect(next.data.email).toBe('new@example.test');
    expect(next.data.new_email).toBe('new@example.test');
    expect(next.data.token).toBe('222222');
    expect(new URL(next.data.url).searchParams.get('token')).toBe('new-hash');
    expect(new URL(next.data.url).searchParams.get('type')).toBe('email_change');
  });
  it('rejects anything that is not a Supabase hook body', () => {
    expect(() => nativeAuthPayload({}, 'https://abc.supabase.co')).toThrow();
    expect(() => nativeAuthPayload({ user: { email: 'u@x.test' }, email_data: { email_action_type: 'delete_everything' } }, 'https://abc.supabase.co')).toThrow();
  });
});

describe('Twilio', () => {
  it('keeps the Lovable connector when its keys exist', () => {
    const request = twilioRequest({ To: 'whatsapp:+33600000000', Body: 'hi' }, env({ LOVABLE_API_KEY: 'l', TWILIO_API_KEY: 'c' }));
    expect(request.url).toBe('https://connector-gateway.lovable.dev/twilio/2010-04-01/Accounts/default/Messages.json');
    expect(request.options.headers['X-Connection-Api-Key']).toBe('c');
    expect(new URLSearchParams(request.options.body).get('From')).toBe('whatsapp:+14155238886');
  });
  it('calls our own Twilio account otherwise, with the configured sender', () => {
    const request = twilioRequest({ To: 'whatsapp:+33600000000', Body: 'hi' }, env({ TWILIO_ACCOUNT_SID: 'ACxyz', TWILIO_AUTH_TOKEN: 'tok', TWILIO_WHATSAPP_FROM: 'whatsapp:+971500000000' }));
    expect(request.url).toBe('https://api.twilio.com/2010-04-01/Accounts/ACxyz/Messages.json');
    expect(request.options.headers.Authorization).toBe(`Basic ${btoa('ACxyz:tok')}`);
    const form = new URLSearchParams(request.options.body);
    expect(form.get('From')).toBe('whatsapp:+971500000000');
    expect(form.get('To')).toBe('whatsapp:+33600000000');
    expect(form.get('Body')).toBe('hi');
  });
  it('fails safely without keys', () => {
    expect(() => twilioRequest({ To: 'x', Body: 'y' }, env({}))).toThrow();
    expect(hasTwilioProvider(env({ TWILIO_API_KEY: 'c' }))).toBe(false);
    expect(hasTwilioProvider(env({ TWILIO_ACCOUNT_SID: 'a', TWILIO_AUTH_TOKEN: 'b' }))).toBe(true);
  });
});

describe('service-role callers', () => {
  const jwt = (role: string) => `h.${btoa(JSON.stringify({ role })).replace(/=+$/, '')}.s`;
  it('accepts a legacy service_role JWT and the new secret key, nothing else', () => {
    expect(isServiceRoleToken(jwt('service_role'), env({}))).toBe(true);
    expect(isServiceRoleToken(jwt('anon'), env({}))).toBe(false);
    expect(isServiceRoleToken('sb_secret_abc', env({ SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_abc' }))).toBe(true);
    expect(isServiceRoleToken('sb_publishable_abc', env({ SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_abc' }))).toBe(false);
    expect(isServiceRoleToken('', env({}))).toBe(false);
  });
});
