'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// Icons
const Icons = {
  Target: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </svg>
  ),
  Users: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  HeartHand: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Lightbulb: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-teal-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Our Mission
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Redefining Success in Medicine
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                We believe that succeeding in medicine shouldn't mean sacrificing your health, your relationships, or your sense of purpose. TribeWellMD exists to prove that <span className="text-teal-600 dark:text-teal-400 font-semibold">individual achievement</span> and <span className="text-indigo-600 dark:text-indigo-400 font-semibold">community wellbeing</span> are not opposing forces—they're mutually reinforcing.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Icons.Lightbulb />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Our Philosophy
                </h2>
                <blockquote className="text-xl text-slate-700 dark:text-slate-300 border-l-4 border-teal-500 pl-6 mb-6 italic">
                  "Most people believe individualism and community are mutually exclusive. Our mission is to show they are mutually reinforcing."
                </blockquote>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Medical education has long operated on a scarcity mindset—limited spots, competitive rankings, and the constant pressure to outperform your peers. But what if your success could lift others up, and their success could fuel yours?
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  That's the vision behind TribeWellMD. We're building a platform where every hour you study, every wellness goal you achieve, and every connection you make contributes not just to your own growth, but to the growth of a community that has your back.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 md:p-10">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-6">The Old Way vs. The TribeWellMD Way</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Compete against peers</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Zero-sum thinking, isolation, burnout</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-500 flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Grow with your tribe</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Shared accountability, mutual support, sustainable success</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Sacrifice wellness for grades</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Burnout, anxiety, loss of purpose</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-500 flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Wellness fuels performance</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Sustainable habits, resilience, meaning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Framework Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                The TribeWellMD Framework
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                Three interconnected pillars that create a virtuous cycle of personal growth and community impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-t-4 border-violet-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="w-14 h-14 mb-6 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Icons.Target />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Sustained Behavior Change</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Real growth comes from consistent, sustainable habits—not cramming or burning out. Our platform uses evidence-based techniques like spaced repetition and gamification to make lasting change achievable.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                    FSRS-powered spaced repetition
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                    Wellness tracking & habits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                    Progress visualization
                  </li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-t-4 border-emerald-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="w-14 h-14 mb-6 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icons.Users />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Guided Social Connection</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Medicine doesn't have to be lonely. Connect with mentors who've walked your path, peers who understand your struggles, and a community that celebrates your wins alongside you.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Mentorship matching
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Study groups & tribes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Shared accountability
                  </li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-t-4 border-orange-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="w-14 h-14 mb-6 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Icons.HeartHand />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Altruistic Contributions</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Your achievements matter beyond your own success. Through our platform, your progress converts to real donations—and that act of giving creates meaning and purpose that fuels continued growth.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Progress → Donations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Community impact tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Purpose-driven motivation
                  </li>
                </ul>
              </div>
            </div>

            {/* The Cycle */}
            <div className="mt-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 md:p-10 text-white">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icons.Sparkles />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">The Virtuous Cycle</h3>
                  <p className="text-white/90 leading-relaxed">
                    Here's the magic: these three pillars aren't separate—they reinforce each other. When you achieve your personal goals, you contribute to the community. When the community supports you, you're more likely to succeed. And when your success creates real-world impact through charitable giving, it creates meaning that drives you to keep growing. <span className="font-semibold">Giving back creates meaning and purpose, which fuels continued personal growth.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Our Vision
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                We envision a future where the medical profession is known not just for its expertise, but for its wellness. Where physicians are as skilled at taking care of themselves as they are at taking care of others. Where success in medicine is measured not just by test scores and publications, but by lives improved—including your own.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                TribeWellMD is building that future, one medical student, resident, and attending at a time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Tribe?
            </h2>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              Join a community that believes in a different kind of success—one where your growth lifts others up, and their support helps you thrive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/study"
                className="px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:scale-105"
              >
                Start Studying →
              </Link>
              <Link
                href="/wellness"
                className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-all"
              >
                Explore Wellness
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
