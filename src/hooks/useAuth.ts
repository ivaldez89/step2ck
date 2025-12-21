'use client';

import { useEffect, useState, useCallback } from 'react';

// Create a simple event system for auth state changes
const authListeners = new Set<() => void>();

export function notifyAuthChange() {
  authListeners.forEach(listener => listener());
}

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = useCallback(() => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('tribewellmd-auth='));
    setIsAuthenticated(authCookie?.includes('authenticated') ?? false);
  }, []);

  useEffect(() => {
    // Initial check
    checkAuth();

    // Re-check on focus (in case user logged in/out in another tab)
    window.addEventListener('focus', checkAuth);

    // Listen for auth changes from sign-out
    authListeners.add(checkAuth);

    return () => {
      window.removeEventListener('focus', checkAuth);
      authListeners.delete(checkAuth);
    };
  }, [checkAuth]);

  return isAuthenticated;
}

export function signOut() {
  // Clear the auth cookie
  document.cookie = 'tribewellmd-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  // Notify all listeners
  notifyAuthChange();
}
