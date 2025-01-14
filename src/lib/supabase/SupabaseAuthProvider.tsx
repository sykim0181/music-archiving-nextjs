'use client'

import { createContext, ReactNode, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export const SessionContext = createContext<{
  session: Session | null
}>({ session: null });

interface Props {
  children: ReactNode
}

const SupabaseAuthProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(()=> {
    const supabase = createClient();

    const { data: { subscription }} = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`${event}: `, session);
        if (event === 'SIGNED_OUT') {
          setSession(null);
        } else if (session) {
          setSession(session);
        }
    });

    const refreshToken = window.sessionStorage.getItem('refresh-token');
    if (refreshToken !== null) {
      supabase.auth.refreshSession({ refresh_token: refreshToken })
        .then(({ data, error }) => {
          window.sessionStorage.removeItem('refresh-token');
          if (error) {
            console.log('Failed to refresh session:', error);
          } else {
            console.log('Refresh session:', data);
            if (data.session?.refresh_token) {
              window.sessionStorage.setItem('refresh-token', data.session?.refresh_token);
            }
          }
        });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SupabaseAuthProvider;