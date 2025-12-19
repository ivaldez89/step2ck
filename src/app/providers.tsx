'use client';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ServiceWorkerRegistration />
    </ThemeProvider>
  );
}
