import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ProfileStatus = "pending" | "onboarding" | "approved" | "rejected";

interface ProfileData {
  status: ProfileStatus;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  profile_type: string | null;
  accepted_terms: boolean;
}

export const useProfileStatus = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("profiles")
      .select("status, full_name, phone, country, profile_type, accepted_terms")
      .eq("id", user.id)
      .single();
    
    setProfile(data as ProfileData | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isApproved = profile?.status === "approved";
  const isPending = profile?.status === "pending" || profile?.status === "onboarding";
  const isRejected = profile?.status === "rejected";
  const needsOnboarding = !profile?.full_name || !profile?.phone || !profile?.country || !profile?.profile_type || !profile?.accepted_terms;

  return { profile, loading, isApproved, isPending, isRejected, needsOnboarding, refetch: fetchProfile };
};
