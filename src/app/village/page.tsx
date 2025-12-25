'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThreeColumnLayout, CARD_STYLES, ThreeColumnLayoutSkeleton } from '@/components/layout/ThreeColumnLayout';
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
    // Mobile Header
    const mobileHeader = (
      <div className={CARD_STYLES.containerWithPadding}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Community</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose your Village</p>
          </div>
        </div>
      </div>
    );

    // Left Sidebar
    const leftSidebar = (
      <>
        {/* Header Card */}
        <div className={CARD_STYLES.container + ' overflow-hidden'}>
          <div className="h-16 bg-gradient-to-br from-[#5B7B6D] via-[#6B8B7D] to-[#7FA08F] flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Community</h2>
            </div>
          </div>

          <div className="px-4 py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Join a Village to contribute your study points to real charitable causes. Every point you earn makes a difference.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className={CARD_STYLES.containerWithPadding}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span>
            How It Works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#5B7B6D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose a charity that resonates with you</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#5B7B6D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">Study flashcards and earn points</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#5B7B6D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">100% of your points become real donations</p>
            </div>
          </div>
        </div>
      </>
    );

    // Right Sidebar
    const rightSidebar = (
      <>
        <div className={CARD_STYLES.containerWithPadding}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Why Villages?</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-[#5B7B6D]">Purpose-driven learning:</span> Your study efforts contribute to causes you care about.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-[#C4A77D]">Community:</span> Connect with others who share your values.
              </p>
            </div>
          </div>
        </div>

        <div className={CARD_STYLES.containerWithPadding}>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You can change your Village at any time from your profile settings.
          </p>
        </div>
      </>
    );

    return (
      <ThreeColumnLayout
        mobileHeader={mobileHeader}
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
      >
        {/* Main Content - Charity Selection */}
        <div className={CARD_STYLES.containerWithPadding}>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Choose Your Village
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Select a charity to join. Your study points will be converted to real donations.
            </p>
          </div>

          <div className="space-y-3">
            {PARTNER_CHARITIES.map((charity) => (
              <Link
                key={charity.id}
                href={`/village/${charity.id}`}
                className="block p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-[#5B7B6D] dark:hover:border-[#5B7B6D] transition-all hover:shadow-md group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {charity.shortName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#5B7B6D] dark:group-hover:text-[#7FA08F] transition-colors">
                      {charity.shortName}
                    </h3>
                    <p className="text-sm text-[#C4A77D] font-medium">{charity.focus}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {charity.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-[#5B7B6D] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Not Ready CTA */}
        <div className={CARD_STYLES.containerWithPadding + ' text-center'}>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Not ready to choose? You can also{' '}
            <Link href="/register" className="text-[#5B7B6D] hover:underline font-medium">
              complete your profile
            </Link>{' '}
            to select your Village later.
          </p>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Show loading while redirecting
  return (
    <ThreeColumnLayout
      isLoading={true}
      loadingContent={<ThreeColumnLayoutSkeleton />}
    >
      <div />
    </ThreeColumnLayout>
  );
}
