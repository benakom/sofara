import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type UserTier = "referrer" | "pro";
export type AmbassadorTier = "ambassador" | "ambassador_plus";

interface UserTierData {
  profileType: UserTier;
  ambassadorTier: AmbassadorTier;
  referralCode: string | null;
  godchildrenCount: number;
  loading: boolean;
}

export const useUserTier = (): UserTierData => {
  const { user } = useAuth();
  const [profileType, setProfileType] = useState<UserTier>("referrer");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [godchildrenCount, setGodchildrenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetch = async () => {
      // Get profile type + referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("profile_type, referral_code")
        .eq("id", user.id)
        .single();

      if (profile) {
        const pt = profile.profile_type;
        setProfileType(pt === "pro" ? "pro" : "referrer");
        setReferralCode(profile.referral_code);
      }

      // Count godchildren
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("referred_by", user.id);

      setGodchildrenCount(count ?? 0);
      setLoading(false);
    };

    fetch();
  }, [user]);

  const ambassadorTier: AmbassadorTier = godchildrenCount >= 1 ? "ambassador_plus" : "ambassador";

  return { profileType, ambassadorTier, referralCode, godchildrenCount, loading };
};
