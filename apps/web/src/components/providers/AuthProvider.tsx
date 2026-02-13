'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useCreditStore } from '@/src/stores/creditStore';
import { useGalleryStore } from '@/src/stores/galleryStore';

/**
 * AuthProvider — initializes auth listener and fetches user data.
 * Renders nothing visible. Place in root layout.
 */
export function AuthProvider() {
  const { isAuthenticated } = useAuth();
  const { fetchCredits } = useCreditStore();
  const { fetchGenerations } = useGalleryStore();

  /* Fetch credits and gallery when user is authenticated */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCredits();
      fetchGenerations();
    }
  }, [isAuthenticated, fetchCredits, fetchGenerations]);

  return null;
}
