'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';


// Type for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Professional SVG Icons Component
const Icons = {
  Study: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Wellness: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Resources: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Community: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  PreMed: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  MedStudent: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  Resident: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Attending: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  PreMedStudent: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Target: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Handshake: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  HeartHand: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Lightbulb: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
};

const PLATFORM_PILLARS = [
  {
    title: 'Study',
    description: 'FSRS-powered flashcards, rapid review, and exam prep designed for medical education',
    href: '/study',
    icon: 'Study',
    gradient: 'from-teal-400 to-cyan-500',
    features: ['Spaced Repetition', 'Step 2 CK & Shelf Exams', 'AI Card Generation']
  },
  {
    title: 'Wellness',
    description: 'Mental health resources, stress management, and support for your wellbeing journey',
    href: '/wellness',
    icon: 'Wellness',
    gradient: 'from-rose-400 to-pink-500',
    features: ['Mental Health Tools', 'Crisis Resources', 'Self-Care Guides']
  },
  {
    title: 'Resources',
    description: 'High-yield infographics, survival guides, and curated content for medical education',
    href: '/resources',
    icon: 'Resources',
    gradient: 'from-amber-400 to-orange-500',
    features: ['Visual Summaries', 'Clinical Pearls', 'Study Guides']
  },
  {
    title: 'Community',
    description: 'Connect with mentors, join study groups, and find your tribe in medicine',
    href: '/community',
    icon: 'Community',
    gradient: 'from-violet-400 to-purple-500',
    features: ['Mentorship', 'Research & News', 'Study Groups'],
    comingSoon: true
  },
  {
    title: 'PreMed',
    description: 'Guidance, mentorship, and resources for your journey to medical school',
    href: '/premed',
    icon: 'PreMed',
    gradient: 'from-emerald-400 to-teal-500',
    features: ['MCAT Prep', 'Application Guide', 'Med Student Mentors'],
    comingSoon: true
  },
];

const USER_TYPES = [
  { type: 'Medical Students', description: 'Ace your exams while staying sane', icon: 'MedStudent' },
  { type: 'Residents', description: 'Stay sharp, pay it forward', icon: 'Resident' },
  { type: 'Attendings', description: 'Share wisdom, stay connected', icon: 'Attending' },
  { type: 'Pre-Meds', description: 'Start your journey right', icon: 'PreMedStudent' },
];

// Icon renderer helper
const renderIcon = (iconName: string, className?: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  if (!IconComponent) return null;
  return (
    <div className={className}>
      <IconComponent />
    </div>
  );
};

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Scroll animation refs
  const frameworkRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const [frameworkVisible, setFrameworkVisible] = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState(false);

  // Email signup state
  const [ctaEmail, setCtaEmail] = useState('');
  const [ctaSubscribed, setCtaSubscribed] = useState(false);
  const [ctaLoading, setCtaLoading] = useState(false);

  const handleCtaSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaEmail) return;

    setCtaLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ctaEmail, source: 'homepage-cta' }),
      });

      if (response.ok) {
        setCtaSubscribed(true);
        setCtaEmail('');
      }
    } catch {
      // Silent fail
    } finally {
      setCtaLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === frameworkRef.current) setFrameworkVisible(true);
          if (entry.target === pillarsRef.current) setPillarsVisible(true);
        }
      });
    }, observerOptions);

    if (frameworkRef.current) observer.observe(frameworkRef.current);
    if (pillarsRef.current) observer.observe(pillarsRef.current);

    return () => observer.disconnect();
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <main>
        {/* Hero Section - White background */}
        <section className="bg-white dark:bg-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              <span className="inline-block animate-fade-in-up">Study Smart.</span>
              <br />
              <span className="inline-block animate-fade-in-up animation-delay-100">Find Your Tribe.</span>
              <br />
              <span className="inline-block animate-fade-in-up animation-delay-200">
                <span className="text-shimmer">Stay Well.</span>
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-300">
              The complete platform for medical students, residents, and attendings.
              <br />
              Evidence-based tools. Mental wellness. Community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
              <Link
                href="/study"
                className="px-8 py-4 bg-slate-900 dark:bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 transition-all hover:scale-105 hover:shadow-lg"
              >
                Get Started &nbsp;→
              </Link>
              <Link
                href="/wellness"
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Explore Wellness →
              </Link>
            </div>
          </div>
        </section>

        {/* Platform Pillars - Light teal background (first after hero) */}
        <section className="bg-gradient-to-b from-teal-50/70 to-cyan-50/50 dark:from-slate-800/50 dark:to-slate-900" ref={pillarsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className={`text-center mb-10 transition-all duration-700 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Explore Our Platform
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                Tools designed to help you thrive at every stage of your medical journey
              </p>
            </div>
            {/* Top row - 2 featured cards */}
            <div className={`grid md:grid-cols-2 gap-6 mb-6 transition-all duration-700 delay-200 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {PLATFORM_PILLARS.slice(0, 2).map((pillar, index) => (
                <Link
                  key={index}
                  href={pillar.href}
                  className={`group relative p-8 rounded-2xl bg-gradient-to-br ${pillar.gradient} text-white overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  style={{ transitionDelay: pillarsVisible ? `${300 + index * 100}ms` : '0ms' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="w-14 h-14 mb-4 rounded-xl bg-white/20 flex items-center justify-center">
                        {renderIcon(pillar.icon)}
                      </div>
                      <h3 className="text-3xl font-bold mb-3">{pillar.title}</h3>
                      <p className="text-white/90 mb-6 max-w-md">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pillar.features.map((feature, idx) => (
                      <span key={idx} className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom row - 3 cards */}
            <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-400 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {PLATFORM_PILLARS.slice(2).map((pillar, index) => (
                <Link
                  key={index}
                  href={pillar.href}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${pillar.gradient} text-white overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  style={{ transitionDelay: pillarsVisible ? `${500 + index * 100}ms` : '0ms' }}
                >
                  {pillar.comingSoon && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                      Coming Soon
                    </div>
                  )}

                  <div className="w-12 h-12 mb-4 rounded-xl bg-white/20 flex items-center justify-center">
                    {renderIcon(pillar.icon)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{pillar.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{pillar.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Quote - White background */}
        <section className="bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Icons.Lightbulb />
            </div>
            <blockquote className="text-2xl md:text-3xl font-serif text-slate-800 dark:text-slate-200 max-w-4xl mx-auto mb-6 leading-relaxed">
              "Most people believe <span className="text-teal-600 dark:text-teal-400 font-semibold">individualism</span> and{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">community</span> are mutually exclusive.{' '}
              <br className="hidden md:block" />
              Our mission is to show they are{' '}
              <span className="bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent font-bold">
                mutually reinforcing
              </span>."
            </blockquote>
            <p className="text-slate-500 dark:text-slate-400 italic">
              — TribeWellMD Philosophy
            </p>
          </div>
        </section>

        {/* Wellness Framework - Light teal background (flows from quote) */}
        <section className="bg-gradient-to-b from-teal-50/70 to-cyan-50/50 dark:from-slate-800/50 dark:to-slate-900" ref={frameworkRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className={`text-center mb-16 transition-all duration-700 ${frameworkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Our Framework
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                The TribeWellMD Wellness Framework
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                How individualism and community become mutually reinforcing
              </p>
            </div>

            {/* Framework Cards with Connecting Arrows */}
            <div className={`relative max-w-6xl mx-auto transition-all duration-700 delay-200 ${frameworkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Three Pillar Cards in a Row */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
                {/* Card 1 - Sustained Behavior Change (Purple) */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-t-4 border-violet-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${frameworkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: frameworkVisible ? '300ms' : '0ms' }}>
                  <div className="w-12 h-12 mb-4 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Icons.Target />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Sustained Behavior Change</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
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

                {/* Arrow 1: Purple → Green (between card 1 and 2) */}
                <div className="hidden md:flex absolute left-[31%] top-1/2 -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-slate-300 dark:border-l-slate-600"></div>
                  </div>
                </div>

                {/* Card 2 - Guided Social Connection (Green) */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-t-4 border-emerald-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${frameworkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: frameworkVisible ? '450ms' : '0ms' }}>
                  <div className="w-12 h-12 mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icons.Users />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Guided Social Connection</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
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

                {/* Arrow 2: Green → Orange (between card 2 and 3) */}
                <div className="hidden md:flex absolute left-[64.5%] top-1/2 -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-slate-300 dark:border-l-slate-600"></div>
                  </div>
                </div>

                {/* Card 3 - Altruistic Contributions (Orange) */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-t-4 border-orange-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${frameworkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: frameworkVisible ? '600ms' : '0ms' }}>
                  <div className="w-12 h-12 mb-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Icons.HeartHand />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Altruistic Contributions</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
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

              {/* Arrow 3: Orange back to Purple (curved arrow below) */}
              <div className="hidden md:flex justify-center mt-6">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-slate-300 dark:border-r-slate-600"></div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div className="w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <span className="text-xs font-medium italic whitespace-nowrap">The Virtuous Cycle</span>
                    <div className="w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-slate-300 dark:border-l-slate-600"></div>
                </div>
              </div>

              {/* Mobile arrows - show vertically */}
              <div className="flex md:hidden flex-col items-center gap-2 -mt-2 mb-4">
                <div className="flex flex-col items-center py-2">
                  <div className="h-4 w-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-slate-300 dark:border-t-slate-600"></div>
                </div>
              </div>

              {/* The Virtuous Cycle Explanation */}
              <div className="mt-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 md:p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icons.Sparkles />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">The Virtuous Cycle</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Here's the magic: these three pillars aren't separate—they reinforce each other. When you achieve your personal goals, you contribute to the community. When the community supports you, you're more likely to succeed. And when your success creates real-world impact through charitable giving, it creates meaning that drives you to keep growing. <span className="font-semibold">Giving back creates meaning and purpose, which fuels continued personal growth.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg text-lg hover:scale-105 hover:shadow-xl"
                >
                  Explore Our Mission
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve - White background */}
        <section className="bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                For Everyone in Medicine
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                From pre-meds to attendings, we're building tools for every stage of your journey
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {USER_TYPES.map((user, index) => {
                const colors = ['teal', 'violet', 'rose', 'amber'];
                const color = colors[index % colors.length];
                return (
                  <div
                    key={index}
                    className={`relative p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all group`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${color}-100 dark:bg-${color}-500/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
                      {renderIcon(user.icon)}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm md:text-base">{user.type}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">{user.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Soft teal accent */}
        <section className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join Your Tribe?
            </h2>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              Start your journey today. Study smarter, take care of yourself, and connect with a community that has your back.
            </p>

            {/* Email Signup - Join the Village */}
            <div className="max-w-md mx-auto mb-10">
              <p className="text-white font-medium mb-3">Join the Village</p>
              {ctaSubscribed ? (
                <div className="flex items-center justify-center gap-2 text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Welcome to the village!</span>
                </div>
              ) : (
                <form onSubmit={handleCtaSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={ctaLoading}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={ctaLoading}
                    className="px-6 py-3 bg-white hover:bg-white/90 text-teal-600 font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg"
                  >
                    {ctaLoading ? '...' : 'Join'}
                  </button>
                </form>
              )}
              <p className="text-teal-100/80 text-xs mt-2">Get updates on new features. No spam, ever.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/study"
                className="px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg"
              >
                Start Studying Now →
              </Link>
              <Link
                href="/premed"
                className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-all"
              >
                I'm a Pre-Med
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
