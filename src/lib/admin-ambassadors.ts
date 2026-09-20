import { supabase } from "@/integrations/supabase/client";

// Shared helpers for the super-admin ambassador pages.

export type AmbassadorStatus = "pending" | "approved" | "rejected" | "suspended";

export const STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending validation", className: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  approved: { label: "Active", className: "bg-[#22C55E]/10 text-[#22C55E]" },
  rejected: { label: "Rejected", className: "bg-[#EF4444]/10 text-[#EF4444]" },
  suspended: { label: "Suspended", className: "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]" },
  onboarding: { label: "Pending validation", className: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  pro_pending: { label: "Active · Pro requested", className: "bg-[#22C55E]/10 text-[#22C55E]" },
};

export const OCCUPATION_LABELS: Record<string, string> = {
  real_estate_agent: "Real estate agent",
  influencer: "Influencer / content creator",
  entrepreneur: "Entrepreneur",
  investor: "Investor",
  networker: "Networker / community",
  finance: "Finance / banking",
  consultant: "Consultant",
  other: "Other",
};

export const occupationLabel = (v: string | null | undefined) => (v ? OCCUPATION_LABELS[v] ?? v : "—");

async function setStatus(id: string, status: AmbassadorStatus) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("profiles")
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user?.id ?? null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Validate an application: status -> approved, then send the welcome email (idempotent). */
export async function validateAmbassador(id: string): Promise<{ emailSent: boolean; note?: string }> {
  await setStatus(id, "approved");
  const { data, error } = await supabase.functions.invoke("onboarding-emails", { body: { event: "approved", user_id: id } });
  if (error) return { emailSent: false, note: error.message };
  if (data?.error) return { emailSent: false, note: String(data.error) };
  if (data?.skipped) return { emailSent: false, note: "Welcome email was already sent earlier." };
  return { emailSent: true };
}

export async function rejectAmbassador(id: string) {
  await setStatus(id, "rejected");
}

export async function suspendAmbassador(id: string) {
  await setStatus(id, "suspended");
}

/** Reactivate a suspended account without re-sending the welcome email. */
export async function reactivateAmbassador(id: string) {
  await setStatus(id, "approved");
}

export const fmtDate = (iso: string | null | undefined, withTime = false) =>
  iso ? new Date(iso).toLocaleString("en-GB", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }) : "—";
