'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Professional SVG Icons
const Icons = {
  Problem: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Solution: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  Points: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Verification: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Market: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  Differentiator: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Contact: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
};

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                For Investors & Partners
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Only Platform Where Studying for Step 2 CK{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  Saves Lives
                </span>{' '}
                Through Charitable Giving
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl">
                TribeWellMD transforms medical education by connecting academic achievement with wellness and social impact.
                Every study session, every wellness activity creates real-world charitable donations.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:invest@tribewellmd.com"
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
                >
                  Request Pitch Deck
                </a>
                <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                <Icons.Problem />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  The Problem
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Medical education is broken</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-red-500 mb-2">400+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Physician suicides annually</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">The highest rate of any profession. The Dr. Lorna Breen Act was passed in response to this crisis.</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-red-500 mb-2">$300K+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Average medical student debt</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Students can't afford premium study tools AND wellness resources. They're forced to choose.</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-red-500 mb-2">Fragmented</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Disconnected tools</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Anki for studying. Headspace for wellness. Strava for fitness. No integration. No community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-gradient-to-b from-teal-50/70 to-cyan-50/50 dark:from-slate-800/50 dark:to-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                <Icons.Solution />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Our Solution
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">One platform. Study. Wellness. Community. Impact.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-teal-500">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">AI-Powered Study</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• FSRS spaced repetition</li>
                  <li>• Smart review of weak areas</li>
                  <li>• Text-to-speech for commutes</li>
                  <li>• Step 2 CK & Shelf prep</li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-rose-500">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Wellness Tracking</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Daily wellness challenges</li>
                  <li>• Activity verification tiers</li>
                  <li>• Health app integration</li>
                  <li>• Mental health resources</li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-violet-500">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Community & Tribes</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Peer study groups</li>
                  <li>• Mentorship matching</li>
                  <li>• Shared accountability</li>
                  <li>• Cross-institution connections</li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-orange-500">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Social Impact</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Points convert to donations</li>
                  <li>• Curated charity partners</li>
                  <li>• Community impact dashboard</li>
                  <li>• Institutional sponsorship</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Verification System */}
        <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                <Icons.Verification />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Activity Verification
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Trust vs. Gaming Prevention: A tiered approach</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  Tier 1: Self-Reported
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Base Points</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <li>• Honor system activities</li>
                  <li>• Meditation, journaling, hydration</li>
                  <li>• Lower point value (5 pts/activity)</li>
                  <li>• Daily cap to prevent abuse</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                  "We trust you. Self-care is about your growth."
                </p>
              </div>

              {/* Tier 2 */}
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 dark:bg-emerald-800 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-4">
                  Tier 2: Soft Verification
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Bonus Points (2-3x)</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <li>• Photo evidence analyzed by AI</li>
                  <li>• Time-stamped metadata check</li>
                  <li>• Healthy meals, workouts, groups</li>
                  <li>• AI verifies content authenticity</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                  Coming in Phase 2
                </p>
              </div>

              {/* Tier 3 */}
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-300 dark:border-amber-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200 dark:bg-amber-800 rounded-full text-sm font-medium text-amber-700 dark:text-amber-300 mb-4">
                  Tier 3: Hard Verification
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Premium Points (3-5x)</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <li>• Apple Health / Google Fit / Fitbit</li>
                  <li>• Actual step counts, sleep data</li>
                  <li>• Workout minutes verification</li>
                  <li>• GPS data (optional, privacy-first)</li>
                </ul>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  The Gold Standard
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Points Economy */}
        <section className="bg-gradient-to-b from-teal-50/70 to-cyan-50/50 dark:from-slate-800/50 dark:to-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                <Icons.Points />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Points-to-Money Conversion
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Transparent economics that scale</p>
              </div>
            </div>

            {/* Conversion Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Activity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">XP Earned</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Village Points</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Cash Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">Flashcard review</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">5-12 XP</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">~1 point</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400 font-medium">$0.001</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">Case completion</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">25-40 XP</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2-4 points</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400 font-medium">$0.002-0.004</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">10,000 steps (verified)</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">50 XP</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">5 points</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400 font-medium">$0.005</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">Healthy meal photo</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">20 XP</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2 points</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400 font-medium">$0.002</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">7-day streak bonus</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">100 XP</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">10 points</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400 font-medium">$0.01</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scale projection */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 md:p-8 text-white">
              <h3 className="font-bold text-xl mb-4">At Scale</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-1">1,000</div>
                  <p className="text-teal-100">active students</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">50,000</div>
                  <p className="text-teal-100">points/week</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">$50/week</div>
                  <p className="text-teal-100">to charity pool</p>
                </div>
              </div>
              <p className="mt-4 text-teal-100 text-sm">
                Institutional sponsors multiply this 10-20x. Medical schools can match student contributions.
              </p>
            </div>
          </div>
        </section>

        {/* Charity Partnerships */}
        <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                <Icons.Heart />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Charity Partnerships
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Curated + Custom Hybrid Model</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Curated Partners (Pre-verified)</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Physician wellness:</span> Dr. Lorna Breen Heroes Foundation
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Mental health:</span> NAMI
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Healthcare access:</span> Remote Area Medical, Partners in Health
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Medical education:</span> SNMA, scholarships
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Global health:</span> Doctors Without Borders
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Benefits of Pre-selection</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    501(c)(3) verified
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accountability & reporting
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Co-marketing opportunities
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    "TribeWellMD Community donated $X this month"
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Future: Student-Created Projects</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    "Micro-grants" model where students propose community health projects. Community votes with village points. Top projects get funded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Differentiation */}
        <section className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Icons.Differentiator />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  What Sets Us Apart
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Complex but differentiating</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Competitor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">What They Do</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-teal-600 dark:text-teal-400">TribeWellMD Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">Anki / Flashcard apps</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Just study</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400">Study = Community impact</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">Headspace</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Personal wellness</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400">Wellness → Charity</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">Strava</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Track fitness</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400">Fitness → Medical education causes</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">Charity Miles</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Walk for charity</td>
                    <td className="px-6 py-4 text-sm text-teal-600 dark:text-teal-400">Holistic (study + wellness + social)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
              <p className="text-xl md:text-2xl font-serif italic text-center">
                "The only platform where studying for Step 2 CK literally saves lives through charitable giving."
              </p>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Icons.Market />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Market Opportunity
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Large, underserved, and growing</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl text-center">
                <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">95K+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">US medical students</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl text-center">
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">140K+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">Residents</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl text-center">
                <div className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-2">90K+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">Pre-med students (serious)</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">$2B+</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">Medical education market</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Icons.Contact />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Let's Build the Future of Medical Education
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              We're looking for investors and partners who share our vision of transforming how medical students learn,
              stay well, and create impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:invest@tribewellmd.com"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
              >
                Contact Us: invest@tribewellmd.com
              </a>
              <Link
                href="/"
                className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
              >
                Try the Platform
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
