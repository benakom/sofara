import { useCallback, useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useUserTier } from "@/hooks/useUserTier";

export type ProPlan = "monthly" | "yearly";

export interface SubscriptionState {
  subscribed: boolean;
  plan: ProPlan | null;
  subscription_end: string | null;
  cancel_at_period_end?: boolean;
  source: "stripe" | "manual" | null;
}

export const PRO_PRICING = {
  monthly: { usd: 99, label: "99 $" },
  yearly: { usd: 990, label: "990 $", perMonth: "82,50 $", freeMonths: 2 },
};

/**
 * Legacy Sofara Pro subscription state. The paid Pro plan is currently disabled:
 * access is derived from the profile tier / superadmin role only. Built-in payments
 * are enabled at the project level and will drive this hook once products exist.
 */
export const useSubscription = () => {
  const { isSuperAdmin } = useAdmin();
  const { profileType, loading: tierLoading } = useUserTier();
  const [checkoutLoading] = useState<ProPlan | null>(null);
  const [portalLoading] = useState(false);

  const notConfigured = useCallback(async () => {
    throw new Error("Paid plans are not available yet.");
  }, []);

  const isPro = isSuperAdmin || profileType === "pro";

  return {
    subscribed: false,
    plan: null as ProPlan | null,
    subscription_end: null as string | null,
    cancel_at_period_end: false,
    source: null as "stripe" | "manual" | null,
    isPro,
    loading: tierLoading,
    error: null as Error | null,
    refresh: () => {},
    startCheckout: notConfigured,
    checkoutLoading,
    openPortal: notConfigured,
    portalLoading,
  };
};
