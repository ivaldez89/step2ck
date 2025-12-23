'use client';

import { usePathname } from 'next/navigation';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { GlobalSpotifyPlayer } from '@/components/music/GlobalSpotifyPlayer';
import { useIsAuthenticated } from '@/hooks/useAuth';

// Pages where we don't want to show global UI elements
const AUTH_PAGES = ['/login', '/register'];

// Pages where we don't want to show the ChatBubble (they have their own chat)
const HIDE_CHAT_BUBBLE_PATTERNS = [
  '/study/room/', // Study room has its own SessionChat in the sidebar
];

// Pages where we don't want to show the Spotify player
const HIDE_SPOTIFY_PATTERNS = [
  '/study/room/', // Study room has its own music controls in the UI
];

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

  // Check which components to hide on specific pages
  const hideChatBubble = HIDE_CHAT_BUBBLE_PATTERNS.some(pattern => pathname.startsWith(pattern));
  const hideSpotify = HIDE_SPOTIFY_PATTERNS.some(pattern => pathname.startsWith(pattern));

  return (
    <>
      {!hideSpotify && <GlobalSpotifyPlayer />}
      {!hideChatBubble && <ChatBubble />}
    </>
  );
}
