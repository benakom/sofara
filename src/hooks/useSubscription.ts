import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
 * Sofara Pro subscription state, synced from Stripe through the check-subscription edge function.
 * Superadmins always have Pro access.
 */
export const useSubscription = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useAdmin();
  const { profileType, loading: tierLoading } = useUserTier();
  const queryClient = useQueryClient();
  const [checkoutLoading, setCheckoutLoading] = useState<ProPlan | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const query = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<SubscriptionState> => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      return data as SubscriptionState;
    },
    enabled: !!user,
    staleTime: 60_000,
    retry: 1,
  });

  const startCheckout = useCallback(async (plan: ProPlan) => {
    setCheckoutLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { plan } });
      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url as string;
    } finally {
      setCheckoutLoading(null);
    }
  }, []);

  const openPortal = useCallback(async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (!data?.url) throw new Error("No portal URL returned");
      window.location.href = data.url as string;
    } finally {
      setPortalLoading(false);
    }
  }, []);

  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ["subscription", user?.id] }), [queryClient, user?.id]);

  const isPro = isSuperAdmin || !!query.data?.subscribed || profileType === "pro";

  return {
    ...(query.data ?? { subscribed: false, plan: null, subscription_end: null, source: null }),
    isPro,
    loading: query.isLoading || tierLoading,
    error: query.error as Error | null,
    refresh,
    startCheckout,
    checkoutLoading,
    openPortal,
    portalLoading,
  };
};
