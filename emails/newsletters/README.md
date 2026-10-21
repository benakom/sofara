# Sofara ambassador newsletter series

Ready-to-send HTML emails for Sofara ambassadors, in English, French, Spanish, Russian and Arabic (monthly issues: English and French, other languages receive English).
Every issue ends with the two standing calls to action: share your referral link
with your network, and real estate agents abroad can hand Dubai-bound clients to
Sofara for closing by Cevitas Real Estate LLC.

## Layout

| Path | What |
|---|---|
| `issues/*.mjs` | One file per issue. Subject, preview text and body blocks in `en` and `fr`. Edit content here. |
| `common.mjs` | Shared CTA blocks (referral link, agent handover, signature). |
| `template.mjs` | HTML renderer. Same look as the verification-code email (white, Poppins, bottle green `#0d3a2b`). |
| `build.mjs` | `node emails/newsletters/build.mjs` regenerates `dist/`. |
| `dist/<id>.<lang>.html` | Final emails. |
| `dist/manifest.json` | Subjects, sequence, send day per issue. |
| `dist/index.html` | Preview page with EN/FR toggle (open locally). |

## Sequences

**Welcome journey** (`sequence: "onboarding"`, day 0 = validation by a super admin in
`/admin/ambassadors`; written in en, fr, es, ru and ar; tone: personal, one small step per email,
a "tip of the week" box and encouragement; no AI wording, no business-size figures):

| Day | Issue | Topic |
|---|---|---|
| 0 | `welcome-validated` (transactional) | Welcome, the model, three steps for the first week |
| 1 | 01-journey-d1-setup | 10-minute setup: link, dashboard tour, list of ten names |
| 3 | 02-journey-d3-first-message | Three ready-to-send messages (friend, professional, story) |
| 6 | 03-journey-d6-who-to-think-of | Five profiles and the question that opens the conversation |
| 9 | 04-journey-d9-five-questions | Five questions buyers ask, one-sentence answers, hand over |
| 13 | 05-journey-d13-first-lead | What happens after adding a lead, 12-month protection |
| 18 | 06-journey-d18-social-media | Four post ideas, three rules |
| 24 | 07-journey-d24-weekly-routine | 15 minutes a week routine |
| 30 | 08-journey-d30-one-month | One-month checklist |
| 40 | 09-journey-d40-grow-network | Ambassador+ (10% bonus), who to invite, agents abroad |
| 50 | 10-journey-d50-not-now | Handling "not now", three follow-ups |
| 60 | 11-journey-d60-still-with-you | 7-day challenge, hand-off to the monthly briefing |

Language: the communication language chosen in the signup form (auth metadata `email_lang`),
else `profiles.language`, else the country (`supabase/functions/_shared/email-lang.ts`), else English.
Steps more than 4 days overdue are skipped, so changing the journey never sends a burst of old emails.
The previous EN/FR onboarding series is kept in `archive/` (not built).

**Monthly** (all ambassadors, including dormant ones; rotate in this order, then repeat with fresh content):

| Issue | Topic |
|---|---|
| 11-monthly-market-pulse | Template. Fill the `[[...]]` placeholders with the month's DLD figures and a project of the month before sending. |
| 12-monthly-developer-spotlight | Developer map, rates, what advisors check |
| 13-monthly-legal-corner | Reservation, SPA, Oqood, escrow, title deed |
| 14-monthly-golden-visa | AED 2M, 10 years, family; how to raise it |
| 15-monthly-reactivation | For dormant ambassadors: what changed (Ambassador+, Pro, pipeline) |
| 16-monthly-agent-handover | For agents abroad: step-by-step handover, what they earn |

Send 15-monthly-reactivation first to the existing base, then the others monthly.

## Transactional onboarding emails

`emails/transactional/*.mjs` hold the two account emails, rendered by the same
`build.mjs` into `supabase/functions/_shared/transactional-emails.ts` and sent by the
`onboarding-emails` edge function (queue `transactional_emails`, purpose transactional,
no unsubscribe link):

| Id | When | Trigger |
|---|---|---|
| `under-review` | Email verified, account pending validation | `Auth.tsx` after the OTP, and the pending screen in the dashboard as fallback. Once per user (`profiles.under_review_email_at`). |
| `welcome-validated` | Super admin validates the ambassador | `/admin/ambassadors` Validate button (via `src/lib/admin-ambassadors.ts`). Once per user (`profiles.approved_email_at`). |

## Merge fields

| Field | Value |
|---|---|
| `{{first_name}}` | `profiles.full_name` first word |
| `{{referral_link}}` | `https://sofara.io/auth?ref=` + `profiles.referral_code` |
| `{{unsubscribe_url}}` | Link built from `email_unsubscribe_tokens.token` |

## Audience (Supabase)

Emails are in `auth.users`; names, referral codes and status in `profiles`. There is
no stored language per user, so pick EN or FR from `profiles.country` (FR for
FR, BE, CH, LU, MA, DZ, TN, SN, CI, CM and other francophone countries, EN otherwise)
or ask ambassadors once in the dashboard.

```sql
select u.email, p.full_name, p.referral_code, p.country, p.created_at
from auth.users u
join public.profiles p on p.id = u.id
where p.status = 'approved'
  and u.email not in (select email from public.suppressed_emails);
```

## Sending (automated)

`build.mjs` also writes `supabase/functions/_shared/newsletters.ts` (HTML per issue
and language, used by the edge function) and `src/data/newsletterIssues.ts`
(subjects only, used by the admin page). Rebuild after editing any issue, then push.

| Piece | Where |
|---|---|
| Tables | `newsletter_settings` (onboarding on/off, start date), `newsletter_campaigns`, `newsletter_sends`; `profiles.language` (en/fr, optional) |
| Sender | Edge function `send-newsletters`, run hourly by pg_cron (job `send-newsletters`). Onboarding: one due step per ambassador per run, only for ambassadors approved after `onboarding_since`. Campaigns: rows with status `scheduled` and `scheduled_for <= now`. |
| Transport | Existing queue `transactional_emails` -> `process-email-queue`, `purpose: marketing`, with unsubscribe token. Suppressed addresses are skipped. |
| Unsubscribe | Edge function `newsletter-unsubscribe?token=...` writes to `suppressed_emails`. |
| Admin | `/admin/newsletters`: pause onboarding, preview, send a test to yourself, send a monthly issue to all or to inactive ambassadors, campaign history. |
| Language | `profiles.language` if set, else French for francophone countries, else English. |

The market-pulse issue keeps `[[placeholders]]`; the sender refuses to send it
until they are filled in `issues/11-monthly-market-pulse.mjs` and the project rebuilt.
The `dist/*.html` files can still be imported into any ESP if needed.
