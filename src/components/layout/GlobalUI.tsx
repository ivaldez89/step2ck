'use client';

import { usePathname } from 'next/navigation';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { GlobalSpotifyPlayer } from '@/components/music/GlobalSpotifyPlayer';

// Pages where we don't want to show global UI elements
const AUTH_PAGES = ['/login', '/register'];

export function GlobalUI() {
  const pathname = usePathname();

  // Don't render on auth pages
  if (AUTH_PAGES.includes(pathname)) {
    return null;
  }

  return (
    <>
      <GlobalSpotifyPlayer />
      <ChatBubble />
    </>
  );
}
