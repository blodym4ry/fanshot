'use client';

import { useEffect, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/authStore';

const supabase = createClient();

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, clearUser, setLoading } =
    useAuthStore();

  /* Listen for auth state changes */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          displayName:
            (session.user.user_metadata?.display_name as string) ||
            (session.user.user_metadata?.full_name as string) ||
            session.user.email?.split('@')[0] ||
            'User',
          avatarUrl:
            (session.user.user_metadata?.avatar_url as string) || null,
        });
      } else {
        clearUser();
      }
    });

    /* Check initial session */
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          id: u.id,
          email: u.email || '',
          displayName:
            (u.user_metadata?.display_name as string) ||
            (u.user_metadata?.full_name as string) ||
            u.email?.split('@')[0] ||
            'User',
          avatarUrl: (u.user_metadata?.avatar_url as string) || null,
        });
      } else {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser, setLoading]);

  /* ── Actions ─────────────────────────────────── */

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!isSupabaseConfigured) {
        /* DEV MODE: mock sign-up — create a fake user */
        setUser({
          id: `dev-${Date.now()}`,
          email,
          displayName,
          avatarUrl: null,
        });
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
      return data;
    },
    [setUser]
  );

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      /* DEV MODE: mock sign-in — create a fake user */
      setUser({
        id: `dev-${Date.now()}`,
        email,
        displayName: email.split('@')[0] || 'User',
        avatarUrl: null,
      });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, [setUser]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      clearUser();
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearUser();
  }, [clearUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    isSupabaseConfigured,
  };
}
