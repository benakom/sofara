// Shared helpers for the ambassador dashboard (stages, time, series).

export type Lang = "en" | "ar";
export const fr = (lang: string) => lang === "ar"; // project convention: "ar" renders French copy

import { LEAD_STAGES, LEGACY_LEAD_STAGE, normalizeLeadStage, leadStage, type LeadStage, type StageKind } from "@/lib/lead-stages";

export type StageDef = LeadStage;

/** Pipeline stages in funnel order (see src/lib/lead-stages.ts). `step` is the lime-ramp step (1 = lightest, 0 = paused/lost). */
export const STAGES: StageDef[] = LEAD_STAGES;

/** Legacy values still present in older rows / admin screens → canonical stage keys. */
export const LEGACY_STAGE: Record<string, string> = LEGACY_LEAD_STAGE;
export const normalizeStage = normalizeLeadStage;
export const stageByKey = (key?: string | null): StageDef => leadStage(key);
/** Ambassadors' open leads: anything not won, lost or paused. */
export const isOpenKind = (kind: StageKind) => kind === "open";

/** Commission lifecycle. `step` is the lime ramp step; rejected uses the warning status color. */
export interface CommissionStatusDef { key: string; fr: string; en: string; step: number; order: number }
export const COMMISSION_STATUSES: CommissionStatusDef[] = [
  { key: "estimated", fr: "Estimée", en: "Estimated", step: 3, order: 1 },
  { key: "validated", fr: "Validée", en: "Validated", step: 5, order: 2 },
  { key: "paid", fr: "Payée", en: "Paid", step: 7, order: 3 },
  { key: "rejected", fr: "Rejetée", en: "Rejected", step: 0, order: 0 },
];
export const LEGACY_COMMISSION_STATUS: Record<string, string> = { confirmed: "validated", approved: "validated", pending: "estimated" };
export const normalizeCommissionStatus = (s?: string | null) => (s && (LEGACY_COMMISSION_STATUS[s] ?? s)) || "estimated";
export const commissionStatusByKey = (s?: string | null) => COMMISSION_STATUSES.find((c) => c.key === normalizeCommissionStatus(s)) ?? COMMISSION_STATUSES[0];
export const commissionStatusLabel = (s: string | null | undefined, lang: string) => (fr(lang) ? commissionStatusByKey(s).fr : commissionStatusByKey(s).en);
export const stageLabel = (key: string | null | undefined, lang: string) => (fr(lang) ? stageByKey(key).fr : stageByKey(key).en);

/** Sequential lime ramp (one hue, light → dark) for stage progression. Text stays in text tokens. */
export const STAGE_RAMP: Record<number, string> = {
  0: "hsl(32 95% 46%)",   // paused/lost: warning status color, shown with icon+label
  1: "hsl(68 85% 72%)",
  2: "hsl(68 86% 68%)",
  3: "hsl(68 88% 62%)",
  4: "hsl(70 85% 56%)",
  5: "hsl(72 80% 50%)",
  6: "hsl(74 76% 45%)",
  7: "hsl(76 70% 40%)",
  8: "hsl(78 65% 36%)",
  9: "hsl(80 60% 33%)",
  10: "hsl(95 52% 30%)",
  11: "hsl(120 45% 26%)",
  12: "hsl(140 52% 23%)",
  13: "hsl(150 58% 20%)",
  14: "hsl(160 64% 18%)",
};
/** Color for a stage dot/bar: lime ramp for the funnel, amber for paused, red for lost. */
export const stageColor = (s: StageDef) => (s.kind === "lost" ? "hsl(0 72% 51%)" : s.kind === "paused" ? STAGE_RAMP[0] : STAGE_RAMP[s.step] ?? STAGE_RAMP[1]);

export interface LeadLike {
  id: string; first_name: string; last_name?: string | null; stage?: string | null; source?: string | null;
  score?: string | null; next_action?: string | null; kyc_status?: string | null; created_at: string; updated_at: string;
}

const DAY = 864e5;

export const daysAgo = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / DAY);

export function relativeTime(iso: string, lang: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 6e4), h = Math.round(diff / 36e5), d = Math.round(diff / DAY);
  if (m < 1) return fr(lang) ? "à l'instant" : "just now";
  if (m < 60) return fr(lang) ? `il y a ${m} min` : `${m} min ago`;
  if (h < 24) return fr(lang) ? `il y a ${h} h` : `${h} h ago`;
  if (d < 30) return fr(lang) ? `il y a ${d} j` : `${d} d ago`;
  return new Date(iso).toLocaleDateString(fr(lang) ? "fr-FR" : "en-GB", { day: "2-digit", month: "short" });
}

/** A lead is stale when still open and untouched for 7+ days. */
export const isStale = (l: LeadLike) => stageByKey(l.stage).kind === "open" && daysAgo(l.updated_at) >= 7;

/** Counts per day for the last `days` days (oldest → newest). */
export function dailySeries(items: { created_at: string }[], days = 14): number[] {
  const out = new Array(days).fill(0);
  for (const it of items) {
    const idx = days - 1 - daysAgo(it.created_at);
    if (idx >= 0 && idx < days) out[idx] += 1;
  }
  return out;
}

/** Current 7-day window vs the previous one. Returns null when both are zero. */
export function weekDelta(series14: number[]): { current: number; previous: number; pct: number | null } {
  const previous = series14.slice(0, 7).reduce((a, b) => a + b, 0);
  const current = series14.slice(7).reduce((a, b) => a + b, 0);
  const pct = previous === 0 ? (current === 0 ? null : 100) : Math.round(((current - previous) / previous) * 100);
  return { current, previous, pct };
}

export const compact = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K` : `${n}`;

export const aed = (n: number) => `AED ${compact(n)}`;

export const initials = (first?: string | null, last?: string | null) =>
  `${(first ?? "").charAt(0)}${(last ?? "").charAt(0)}`.toUpperCase() || "?";

export const greeting = (lang: string) => {
  const h = new Date().getHours();
  if (fr(lang)) return h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
