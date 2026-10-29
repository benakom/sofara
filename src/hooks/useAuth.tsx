import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { onInteractionOrDelay } from "@/lib/defer";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The Supabase client is loaded on demand so it stays out of the landing-page critical path:
    // immediately on app routes; on public pages at the first interaction or a few seconds after load, whichever
    // comes first (the public navbar shows "Sign in" until a session is known, see Navbar).
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    const isAppRoute = /^\/(dashboard|admin|auth|reset-password)(\/|$)/.test(window.location.pathname);
    let cancelDeferred: (() => void) | undefined;
    const whenReady = (cb: () => void) => {
      if (isAppRoute) cb();
      else cancelDeferred = onInteractionOrDelay(cb, 4000);
    };
    whenReady(() => import("@/integrations/supabase/client").then(({ supabase }) => {
      if (cancelled) return;
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      unsubscribe = () => subscription.unsubscribe();

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }));

    return () => {
      cancelled = true;
      cancelDeferred?.();
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
