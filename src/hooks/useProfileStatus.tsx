import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ProfileStatus = "pending" | "onboarding" | "approved" | "rejected" | "pro_pending";

interface ProfileData {
  status: ProfileStatus;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  profile_type: string | null;
  accepted_terms: boolean;
}

const PROFILE_SELECT = "status, full_name, phone, country, profile_type, accepted_terms";

export const useProfileStatus = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setLoading(false);
      return;
    }

    let resolvedProfile = data as ProfileData | null;

    if (!resolvedProfile) {
      const userMeta = user.user_metadata ?? {};
      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: typeof userMeta.full_name === "string" ? userMeta.full_name : null,
          phone: typeof userMeta.phone === "string" ? userMeta.phone : null,
          profile_type: "referrer",
          status: "approved",
          accepted_terms: true,
          accepted_terms_at: new Date().toISOString(),
        })
        .select(PROFILE_SELECT)
        .eq("id", user.id)
        .single();

      resolvedProfile = (createdProfile as ProfileData | null) ?? null;
    }

    if (resolvedProfile && (resolvedProfile.status === "pending" || resolvedProfile.status === "onboarding")) {
      const { data: upgradedProfile } = await supabase
        .from("profiles")
        .update({
          status: "approved",
          profile_type: resolvedProfile.profile_type ?? "referrer",
          accepted_terms: true,
          accepted_terms_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select(PROFILE_SELECT)
        .single();

      resolvedProfile = (upgradedProfile as ProfileData | null) ?? resolvedProfile;
    }

    setProfile(resolvedProfile);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isApproved = profile?.status === "approved";
  const isPending = profile?.status === "pending" || profile?.status === "onboarding" || profile?.status === "pro_pending";
  const isRejected = profile?.status === "rejected";
  const needsOnboarding = !profile?.full_name || !profile?.phone || !profile?.country || !profile?.profile_type || !profile?.accepted_terms;

  return { profile, loading, isApproved, isPending, isRejected, needsOnboarding, refetch: fetchProfile };
};
