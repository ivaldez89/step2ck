'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getCurrentVillageId } from '@/lib/storage/profileStorage';
import { PARTNER_CHARITIES } from '@/data/charities';

export default function VillageRedirectPage() {
  const router = useRouter();
  const currentVillageId = getCurrentVillageId();

  useEffect(() => {
    if (currentVillageId) {
      router.replace(`/village/${currentVillageId}`);
    }
  }, [currentVillageId, router]);

  // If user hasn't selected a village yet, show them the options
  if (!currentVillageId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="pt-4 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Choose Your Village
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Select a charity to join as your Village. 100% of your earned points will be converted to
                real donations for your chosen cause.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {PARTNER_CHARITIES.map((charity) => (
                <Link
                  key={charity.id}
                  href={`/village/${charity.id}`}
                  className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#5B7B6D] dark:hover:border-[#5B7B6D] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {charity.shortName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#5B7B6D] dark:group-hover:text-[#7FA08F] transition-colors">
                        {charity.shortName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{charity.focus}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                        {charity.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Not ready to choose? You can also{' '}
                <Link href="/register" className="text-[#5B7B6D] hover:underline">
                  complete your profile
                </Link>{' '}
                to select your Village.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#5B7B6D] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading your Village...</p>
      </div>
    </div>
  );
}
