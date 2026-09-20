"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mounted: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  mounted: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    let cancelled = false;
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      // OAuth redirects can finish writing browser storage just after the
      // first session read on slower mobile browsers.
      window.setTimeout(async () => {
        if (cancelled) return;
        const { data: { session: retriedSession } } = await supabase.auth.getSession();
        if (!cancelled) {
          setUser(retriedSession?.user ?? null);
          setLoading(false);
        }
      }, 300);
    };

    void loadSession();

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, mounted, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);