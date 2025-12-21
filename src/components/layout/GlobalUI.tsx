'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { GlobalSpotifyPlayer } from '@/components/music/GlobalSpotifyPlayer';

// Pages where we don't want to show global UI elements
const AUTH_PAGES = ['/login', '/register'];

// Check if user is authenticated
function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('tribewellmd-auth='));
      setIsAuthenticated(authCookie?.includes('authenticated') ?? false);
    };

    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  return isAuthenticated;
}

export function GlobalUI() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();

  // Don't render on auth pages
  if (AUTH_PAGES.includes(pathname)) {
    return null;
  }

  // Don't render if not authenticated (or still loading)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <GlobalSpotifyPlayer />
      <ChatBubble />
    </>
  );
}
