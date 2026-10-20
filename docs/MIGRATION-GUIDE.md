# sofara — self-hosting migration guide

Audit: 20 October 2026 UTC. This document concerns **sofara.io**, not Cevitas. No design, content, routes or hosted provider behavior have been changed. Only the requested absence-only Gemini fallback was added to repository code; it has not been deployed to the current hosted functions.

## 1. CODE and production build

The uploaded brief retains the repository name `benakom/cevitas` and a Cevitas backend identifier. Neither is established as belonging to this project. Do not deploy that repository based on this brief. Confirm the connected repository and branch in **Project settings → Git**, and compare the published version with that branch before cutover. The agent cannot read Git sync status or the published commit hash.

Local checkout HEAD before this work: `553b5b7a1d27fdc9156bdd51f858b799b9570055`. **This is not a verified live commit hash.** Publishing and repository sync are separate operations; latest source is not proof of the deployed version.

Observed tools: Node `v22.22.0`, Bun `1.3.3`. The repository does not pin a Node version; Node 22 is the observed environment, not a production-host guarantee.

Existing production command: `bun run build` (or `npm run build` with Bun available for the hooks). Install dependencies from the chosen lockfile first, e.g. `bun install --frozen-lockfile`. The production lifecycle is:

1. `prebuild`: `bunx tsx scripts/generate-sitemap.ts || echo "sitemap generation skipped (tsx unavailable), using committed public/sitemap.xml"`.
2. `build`: `vite build` → `dist/`.
3. `postbuild`: `bunx tsx scripts/prerender-seo.ts || npx -y tsx scripts/prerender-seo.ts || echo "prerender skipped"`.

There are **.ts** scripts, not the .mjs scripts in the brief. Prerendering writes public-route HTML snapshots with metadata into `dist/<route>/index.html`; React still boots on these pages. Do not serve only the root HTML at the expense of these files. The hooks deliberately tolerate failures, so a successful process exit alone does not prove sitemap/prerender success: inspect their output and `dist/` before publishing.

`scripts/indexnow-submit.ts` is NOT called by the build lifecycle. It is a manual network submission (`bunx tsx scripts/indexnow-submit.ts`) using the public IndexNow key file. Do not run it before the new site's public sitemap and key file are reachable. No build was manually run during this audit.

Frontend environment variables at destination: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID` for your new project. Vite embeds these at build time. Anon/publishable keys are public identifiers; never put a service-role, Gemini or other private key in a `VITE_` variable. Replace obsolete backend references in the destination deployment, not in the currently live app.

## 2. DOMAINS, headers and routing

Verified project configuration: published; `sofara.io` is Active and Primary. `www.sofara.io`, `getsofara.com` and `www.getsofara.com` are Active with configured app redirects to `https://sofara.io`. This is configuration evidence, not an HTTP status-code capture. The Lovable published address also follows the primary-domain rule. Preview and Trust Center surfaces are exempt.

One build suffices. No separate www build or geographic hostname switch was found. Canonicals, sitemap, robots and SEO data use `https://sofara.io`; some auth/referral URLs use `window.location.origin`. Reproduce the primary-domain redirect at your proxy, preserving path and query. Do not redirect Edge Function APIs to frontend HTML.

Known Lovable hosting contract:
- HTTPS app traffic on secondary domains redirects to the primary domain.
- SPA fallback serves `index.html` for browser navigation to a path without a matching file.
- Real files (including prerendered route HTML) should be served before the SPA fallback.
- Missing file-like paths such as `/missing.png` are assets, not SPA routes, and must not return app HTML.
- Hosting does not process Netlify `_redirects`, `_headers`, `netlify.toml` or Vercel configuration.

Exact platform headers, cache policy, redirect status codes, trailing-slash normalization and CDN-injected behavior are **not available from source or the checked domain configuration**. No claim of a complete live hosting rule dump is made. Capture representative responses from both hosts, root, blog, auth, private routes, missing assets and slash/no-slash URLs before configuring the new proxy. Preserve query parameters and static asset MIME types. Recreate TLS certificates, renewals, DNS, Brotli/gzip and cache rules separately. The new host also loses Lovable's automatic social-preview injection; retain existing SEO tags and decide its replacement before cutover.

## 3. BACKEND and live schema

This project uses **Lovable Cloud**, backed by Supabase technology. The backend identifier in the uploaded Cevitas template does not describe this project; use this project's configuration when auditing and your new project's configuration after import. Private Cloud service-role keys and database passwords are not available to extract.

A complete schema/data SQL dump cannot be generated through this chat's SQL tools. Obtain the authoritative full export through **More → Database → Manage → Settings → Export project data → Export data → Database → Export → Start export**. Download from the emailed link or More → Storage. It includes database structure, data and auth accounts with password hashes; does not include storage files, functions, secrets or auth-provider settings. Limits: database up to 15 GB, export up to 5 GB, one export per 24 hours; backend must be running. This project currently uses one backend for preview and published app; if separate Test/Live environments are introduced, select Live for migration of production.

The separate source archive contains the 32 repository SQL migrations, not an authoritative live-schema dump. Historical migrations can contain fixed deployment URLs and old queue infrastructure. Do not blindly replay all migrations on an already restored export. Restore the export first into an isolated destination, compare schema, and apply only reviewed differences. Keep RLS, grants, function EXECUTE permissions, trigger behavior, constraints and service-role restrictions intact. Do not broaden access to make a broken import appear functional.

Live migration ledger has 26 entries through `20260916032133`. Many ledger timestamps differ by one or two seconds from source filenames; numeric equality is not a reliable mapping. The six later source migrations (lead timeline, newsletters, ambassador validation, signup language, lifecycle notifications, consent intake) were applied directly in prior deployment requests and are **not recorded in that ledger**. Presence of selected objects is verified (all five requested consent columns, `admin_set_lead_consent`, and notifications in realtime), but that does not prove each full migration matches byte-for-byte. The guide does not falsely label the 32 files as ledger-applied.

Verified extensions: pg_cron 1.6.4; pg_net 0.19.5; pg_stat_statements 1.11; pgcrypto 1.3; pgmq 1.5.1; plpgsql 1.0; supabase_vault 0.3.1; uuid-ossp 1.1. Retain compatible extensions at destination. Application functions live in public; do not modify managed auth/storage schemas arbitrarily. Restore managed components through the destination provider's supported process.

## 4. DATA, users and storage exports

`live-table-counts.csv` contains verified counts for 32 public tables (all have RLS enabled). Auth has **16 accounts**. Counts are observed snapshots, not a transaction-consistent backup or a data export. Individual SQL INSERT exports for every table/auth account have **not** been produced: use the supported complete export in section 3. It preserves passwords; an email-only user list does not.

Verified buckets: `kyc-documents` private; `library-assets` public. Both have no configured MIME allowlist or size cap in bucket metadata. Live storage object listing returned **zero files** at audit time. `storage-inventory.csv` records this result. Storage files are excluded from daily database backups and full database exports; download any files that appear before cutover from **More → Storage**. Recreate bucket access policies and URLs, not just bucket names.

The source archive is separate from the full database export. Auth accounts, password hashes, private keys and environment files are intentionally excluded from the source archive. Preserve private KYC files as private if any are added before cutover.

## 5. EDGE FUNCTIONS, triggers and secrets

There are **17 function directories**, excluding `_shared`, not 15. This is a repository inventory, not a verified deployed-function listing. Functions use Deno/npm/remote imports; deploy with a compatible Supabase Edge runtime and reproduce `verify_jwt` plus handler-level checks. Functions not explicitly listed in config use platform defaults; verify actual deployment settings.

Abbreviations: U = `SUPABASE_URL` destination endpoint; A = `SUPABASE_ANON_KEY` destination public key used with user JWT; S = `SUPABASE_SERVICE_ROLE_KEY` destination server-only privileged key; L = `LOVABLE_API_KEY` Lovable service credential (not portable as independent Google/email/GSC authorization).

| Function | Trigger/caller from source | Secrets/configuration and purpose |
|---|---|---|
| admin-create-ambassador | Admin Ambassadors action | U/A validate admin; S creates auth account/profile/role |
| admin-delete-ambassador | Admin Ambassadors action | U/A validate admin; S deletes account and related records |
| admin-gsc | Admin SEO page | U/A/S validate superadmin; L + GOOGLE_SEARCH_CONSOLE_API_KEY use Lovable GSC connector |
| auth-email-hook | Auth email webhook, configured outside frontend | L verifies Lovable webhook signature; U/S profile lookup, enqueue and logging |
| elevenlabs-tts | Authenticated TTS handler; caller not established by audit | U/A authenticate; ELEVENLABS_API_KEY pays/authenticates ElevenLabs speech |
| landing-chat | LandingChatbot frontend POST | L for hosted AI; GEMINI_API_KEY only for absence-only fallback added here |
| lead-notifications | lead-event DB trigger, scheduled sweep | U/A authenticate; S reads profiles/events and enqueues email |
| legal-ai-analyze | Authenticated document analysis handler | U/A user validation; L for AI |
| library-scrape-project | Admin Library import action | U/A user validation; L for extraction AI; fetches supplied project URL |
| newsletter-unsubscribe | Token link from newsletters | U/S validate opt-out token and suppress email; public endpoint |
| onboarding-emails | Auth/account status and admin approval flows | U/A user auth; S profile access and enqueue |
| process-email-queue | Queue wake/dispatch mechanisms, when queue nonempty | U/S queue/log/state; L sends through Lovable Emails; optional LOVABLE_SEND_URL overrides send endpoint |
| send-newsletters | Admin Newsletters action + hourly cron | U/A caller auth; S recipients, settings, token creation and enqueue |
| sofar-ai-chat | Dashboard/chat/simulator callers | U/A JWT and project reads; L hosted AI; GEMINI_API_KEY absence-only fallback |
| sofar-ai-qualify | AutoScore/SofarAI | U/A auth; L AI suggestions |
| sofar-ai-roleplay | RoleplayTool | U/A auth; L AI |
| sofar-ai-sequences | SequencesTool | U/A auth; L AI |

Recreate U/A/S from the destination project, never copy privileged credentials into the frontend. Recreate ElevenLabs credentials if that feature is retained. GSC connector credentials are gateway connection credentials, not standalone Google OAuth credentials: replace the gateway integration with Google authorization under your own account before claiming portability. Recreate the Vault secret `email_queue_service_role_key` with the destination's service credential for scheduled authenticated calls; never place its value in source or this guide.

No repository references were found for `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_LEADS_FROM`, `MP_FROM` or `OTP_SALT` in the Cevitas brief. Do not invent them for sofara. Existing project secret-name inventory includes managed Stripe sandbox and Google Search Console connections; these require their own destination service setup rather than copying connector keys. Managed Cloud JWT/secret key material is not a reusable destination credential.

## 6. SCHEDULES and automatic calls

Verified currently active `cron.job` rows:

| Name | Exact schedule | Target | Authentication |
|---|---|---|---|
| send-newsletters | `5 * * * *` | destination `/functions/v1/send-newsletters` HTTP POST | Bearer credential from Vault `email_queue_service_role_key` |
| lead-notifications-sweep | `*/10 * * * *` | destination `/functions/v1/lead-notifications`, body action sweep | same Vault Bearer credential |

Use database cron timezone (normally UTC; validate destination configuration). These are the only active/installed rows returned at audit time. No Maroc 7-email drip was identified in this project's source; its newsletter onboarding sequence is sofara content, not Cevitas Maroc.

A lead-stage-event trigger also immediately POSTs to lead-notifications, independent of cron. Email queue wake/dispatch functions can dynamically arm `process-email-queue` at a **5-second** interval on enqueue and unschedule when queues empty; that job was not present when inspected. Thus do not treat absence from the current cron list as proof the queue cannot schedule it later. Queue wake, pgmq, pg_net and Vault must be restored together. Historical SQL includes deployment-specific function endpoints: replace at destination, not on the live source.

No workspace Lovable scheduler inventory is exposed here; absence of additional workspace automation is unverified. Check any externally configured webhooks/jobs before cutover. Never run both source and destination newsletter cron against migrated recipients: disable destination jobs until cutover, then coordinate source shutdown to avoid duplicate email.

## 7. AI CHAT fallback

Added `supabase/functions/_shared/chat-provider.ts`, used by **landing-chat and sofar-ai-chat**:
- If LOVABLE_API_KEY is present: identical existing Lovable URL, model, prompt, messages, streaming and token settings.
- Only if it is absent: GEMINI_API_KEY goes server-side to Google's documented OpenAI-compatible endpoint `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, model `gemini-3.1-flash-lite`.
- Neither key: same existing unavailable response.
- No automatic switch after Lovable errors, quota problems or refusals.

This uses the Google API directly; the unprefixed model ID is not sent to Lovable. SSE remains OpenAI-compatible for existing clients. Other AI functions still depend on Lovable and are not silently migrated. Three unit tests passed, including unchanged hosted request body and exact fallback model/streaming. **Real Gemini generation was not verified because no GEMINI_API_KEY is configured here.** Obtain it in Google AI Studio and store server-side in the destination. Confirm model/account availability and test real streamed answers/history at destination before cutover; do not equate mock tests with a live integration test. Existing prompts are unchanged, so factual quality and output behavior still need acceptance testing.

The two changed functions were not redeployed to Lovable in this task. No provider key was generated as a placeholder or included in delivered files.

## 8. EMAIL domains and senders

Verified today through Lovable's email-domain service: **sofara.io is verified and selected for this project**. This does not prove any domain is verified in your Resend account. Repository delivery uses Lovable Emails (`@lovable.dev/email-js` in process-email-queue), not Resend. No Resend connection verification was made; www.sofara.io is a web hostname, not an established Resend sender.

| Producer | Visible From | Sending-domain field | Delivery |
|---|---|---|---|
| auth-email-hook | sofara <noreply@sofara.io> | notify.sofara.io | auth_emails queue → process-email-queue |
| onboarding-emails | Sofara <noreply@sofara.io> | notify.sofara.io | transactional queue → dispatcher |
| lead-notifications shared helper | Sofara <noreply@sofara.io> | notify.sofara.io | transactional queue → dispatcher |
| send-newsletters | Sofara <noreply@sofara.io> | notify.sofara.io | queued newsletters → dispatcher |
| process-email-queue | uses producer payload From | uses payload sender_domain | Lovable email send API |

Destination email delivery and auth-hook verification must be configured under your own provider; copying the templates alone is insufficient. Preserve language selection, subject, body, links, opt-out/suppression, deduplication/logging and retry behavior. If using Resend at destination, verify your chosen domain in your own Resend account and recreate its API key there. Do not remove existing email DNS records until the new sender has passed auth/signup/password-reset and newsletter delivery tests. Lovable auth webhook signature verification cannot simply remain pointed at Lovable after switching Auth providers.

## 9. OTHER portability blockers and acceptance checklist

- **GSC**: admin-gsc routes through Lovable connector gateway; replace authorization and endpoint integration under your Google account. Preserve Search Console property `https://sofara.io/`, public verification file, robots and sitemap.
- **AI**: only the two chat functions have the requested direct Google fallback. Legal analysis, qualification, roleplay, sequences and scraper still require service migration if used.
- **Emails**: managed sender API, auth-hook signature contract, queue RPCs and automatic wake/dispatch are linked dependencies.
- **Auth**: recreate provider configuration, redirect allowlists, OTP/recovery settings, hooks, email-confirmation requirements and destination JWT verification. Export excludes provider settings. `@lovable.dev/cloud-auth-js` is source dependency; any retained Lovable OAuth call requires replacement/reconfiguration. Do not infer auth settings from absent frontend controls.
- **Realtime**: public.notifications is in supabase_realtime publication today; preserve publication/subscriptions and RLS.
- **Forms/data**: public applications and chatbot leads write to this backend; recreate precise grants/RLS and superadmin roles. Leads must preserve relationship/consent intake and admin-only stage changes. Service-role imports must not bypass consent controls in ordinary frontend use.
- **Storage/assets**: preserve private KYC and public library policies and all committed images/favicon. Rebuild references to moved backend storage if new objects are added.
- **Tracking**: no conventional GA/GTM/pixel or Oleadoo webhook was found in searched client/function sources. This is not a guarantee about externally injected Lovable analytics, advertising dashboards or provider-side webhooks. Lovable project analytics will not automatically follow the self-hosted site.
- **Stripe**: sandbox connector secrets exist, but earlier payment functions were removed and no products/checkout were defined in the described launch scope. Verify provider-side webhook/account state before assuming payments transfer or deleting anything.
- **Content**: SEO canonicals and public URLs intentionally stay sofara.io; keep bilingual behavior and all current content unchanged. Existing Cevitas/offplansimulator links are outbound links, not evidence this is the Cevitas project.

### Safe cutover order

1. Confirm actual Git repository/branch and published version. Save current DNS and representative HTTP responses.
2. Owner starts supported full database export and downloads storage files if any; save backups securely.
3. Restore to isolated destination; reconcile schema/migration history without blanket replay. Recreate secrets/provider settings; keep cron disabled.
4. Deploy functions at destination, replace source-specific callback/cron URLs there, configure email provider/auth hooks and Google/GSC/ElevenLabs as needed.
5. Build with destination public environment values; inspect sitemap and all prerendered public pages.
6. Test signup/email confirmation/sign-in/reset, admin approval, consent-first lead submission, stage notes/notifications, commissions/payment readback, opt-out, private storage access, and authenticated role separation with actual migrated users. Test direct Gemini with a real destination key and a follow-up message.
7. Compare desktop/mobile appearance, public SEO/head tags and slash/asset/deep-link response behavior; do not cut over on compilation success alone.
8. Pause writes or arrange a final consistent export/import, coordinate source/destination jobs, then switch DNS. Monitor email/queue/errors and keep the old site recoverable until acceptance.

### Deliverables and limits

Provided separately: sanitized repository source ZIP, audit CSVs (table counts, storage inventory, live migration ledger), and this guide. **Not provided**: full live database/auth SQL export, exact live commit, complete hosting rules dump, provider-side Resend verification, or a live Gemini test. These require the UI export, project Git/publish settings and destination credentials/provider checks respectively. Never treat the migration SQL source files as a full current database export.
