'use client';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SpotifyProvider } from '@/contexts/SpotifyContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SpotifyProvider>
        {children}
      </SpotifyProvider>
    </ThemeProvider>
  );
}
