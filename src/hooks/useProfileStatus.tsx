import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ProfileStatus = "pending" | "onboarding" | "approved" | "rejected" | "suspended" | "pro_pending";

interface ProfileData {
  status: ProfileStatus;
  full_name: string | null;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  profile_type: string | null;
  accepted_terms: boolean;
  under_review_email_at: string | null;
  notify_email: boolean | null;
  created_at: string;
}

const PROFILE_SELECT = "status, full_name, first_name, email, phone, country, profile_type, accepted_terms, under_review_email_at, notify_email, created_at";

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

    // Fallback for accounts whose profile row is missing (the signup trigger normally
    // creates it). New rows always start as pending: validation is done by an admin.
    if (!resolvedProfile) {
      const userMeta = user.user_metadata ?? {};
      const str = (v: unknown) => (typeof v === "string" && v ? v : null);
      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email ?? null,
          full_name: str(userMeta.full_name),
          first_name: str(userMeta.first_name),
          last_name: str(userMeta.last_name),
          occupation: str(userMeta.occupation),
          phone: str(userMeta.phone),
          profile_type: "referrer",
          status: "pending",
          accepted_terms: true,
          accepted_terms_at: new Date().toISOString(),
        })
        .select(PROFILE_SELECT)
        .eq("id", user.id)
        .single();

      resolvedProfile = (createdProfile as ProfileData | null) ?? null;
    }

    setProfile(resolvedProfile);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isApproved = profile?.status === "approved" || profile?.status === "pro_pending";
  const isPending = profile?.status === "pending" || profile?.status === "onboarding";
  const isRejected = profile?.status === "rejected";
  const isSuspended = profile?.status === "suspended";
  const needsOnboarding = !profile?.full_name || !profile?.phone || !profile?.country || !profile?.profile_type || !profile?.accepted_terms;

  return { profile, loading, isApproved, isPending, isRejected, isSuspended, needsOnboarding, refetch: fetchProfile };
};
