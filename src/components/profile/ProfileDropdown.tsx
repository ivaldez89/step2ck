'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile, getUserInitials, getDisplayName, type UserProfile } from '@/lib/storage/profileStorage';
import { signOut as legacySignOut } from '@/hooks/useAuth';
import { signOut as supabaseSignOut } from '@/lib/supabase/auth';

interface ProfileDropdownProps {
  className?: string;
}

export function ProfileDropdown({ className = '' }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = async () => {
    setIsOpen(false);
    legacySignOut();
    await supabaseSignOut();
  };

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const initials = getUserInitials();
  const displayName = getDisplayName();

  return (
    <div className={`relative ${className}`}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 p-1 rounded-full transition-all duration-200 hover:ring-2 hover:ring-tribe-sage-500/30 focus:outline-none focus:ring-2 focus:ring-tribe-sage-500/50"
        aria-label="Account menu"
      >
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white dark:border-slate-700">
            {initials}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-tribe-sage-500 border-2 border-white dark:border-slate-900 rounded-full" />
      </button>

      {/* Dropdown Panel - Simplified Account Utility Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[110]"
        >
          {/* Settings */}
          <Link
            href="/profile/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Settings</span>
          </Link>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700" />

          {/* Sign Out */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSignOut();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
