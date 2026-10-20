# Running the backend outside Lovable

Every call that used to go through a Lovable gateway is routed by `supabase/functions/_shared/providers.ts` (the two chat functions use the older `_shared/chat-provider.ts`, same rule). With `LOVABLE_API_KEY` set, nothing changes. Without it, the same code uses providers we own. Unit tests: `src/test/providers.test.ts`, `src/test/chat-provider.test.ts`.

| Need | Lovable | Self-hosted secret(s) |
|---|---|---|
| AI (landing-chat, sofar-ai-chat, -qualify, -roleplay, -sequences, legal-ai-analyze, library-scrape-project) | Lovable AI gateway | `GEMINI_API_KEY` (Google AI Studio); optional `GEMINI_MODEL` (default maps `google/gemini-*` → `gemini-3.1-flash-lite`) |
| Queued email (auth, onboarding, lead notifications, newsletters via `process-email-queue`) | Lovable Emails | `RESEND_API_KEY` from our Resend account with `sofara.io` verified; senders stay `Sofara <noreply@sofara.io>`; optional `RESEND_FROM` only fills a missing sender |
| Newsletter one-click unsubscribe headers | Lovable Emails | built from `SUPABASE_URL` + `newsletter-unsubscribe`; optional `EMAIL_UNSUBSCRIBE_URL` template with `{token}` |
| Supabase auth emails (`auth-email-hook`) | Lovable webhook relay | `SEND_EMAIL_HOOK_SECRET` from Authentication → Hooks → Send Email hook (value `v1,whsec_…`), hook URL `https://<ref>.supabase.co/functions/v1/auth-email-hook` |
| Text-to-speech (elevenlabs-tts) | direct | unchanged: `ELEVENLABS_API_KEY` |
| Search Console admin page (admin-gsc) | Lovable GSC connector | not portable; needs its own Google OAuth integration |

`process-email-queue` accepts both a legacy `service_role` JWT and the project's `sb_secret_…` key as bearer (new projects do not issue JWT keys by default). The Vault secret `email_queue_service_role_key` used by the two cron jobs (`send-newsletters` hourly, `lead-notifications-sweep` every 10 min) and by the queue wake-up must hold one of those.

`landing-chat` is now explicitly `verify_jwt = false`: the public landing page calls it with the publishable key, which is not a JWT.
