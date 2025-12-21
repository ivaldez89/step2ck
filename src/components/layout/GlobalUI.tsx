'use client';

import { usePathname } from 'next/navigation';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { GlobalSpotifyPlayer } from '@/components/music/GlobalSpotifyPlayer';
import { useIsAuthenticated } from '@/hooks/useAuth';

// Pages where we don't want to show global UI elements
const AUTH_PAGES = ['/login', '/register'];

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
