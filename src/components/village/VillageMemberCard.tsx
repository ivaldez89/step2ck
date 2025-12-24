'use client';

import { useState } from 'react';
import type { VillageMemberProfile } from '@/types/community';

interface VillageMemberCardProps {
  member: VillageMemberProfile;
  onMessage?: (member: VillageMemberProfile) => void;
}

export function VillageMemberCard({ member, onMessage }: VillageMemberCardProps) {
  const [expanded, setExpanded] = useState(false);

  function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all ${
        expanded ? 'ring-2 ring-[#5B7B6D]' : ''
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#C4A77D] flex items-center justify-center text-white text-lg font-medium">
              {member.name[0]}
            </div>
            {member.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{member.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{member.role}</p>
            {member.school && (
              <p className="text-xs text-slate-500 truncate">{member.school}</p>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg
              className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <p className="text-lg font-bold text-[#5B7B6D]">{member.pointsContributed.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Points</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#C4A77D]">{member.currentStreak}</p>
            <p className="text-xs text-slate-500">Day Streak</p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-slate-500">
              {member.isOnline ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Online now</span>
              ) : (
                <>Active {formatTimeAgo(member.lastActiveAt)}</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Bio */}
          {member.bio && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>
            </div>
          )}

          {/* Specialty */}
          {member.specialty && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-slate-600 dark:text-slate-400">Interested in {member.specialty}</span>
            </div>
          )}

          {/* Interests */}
          {(member.wellnessInterests?.length || member.generalInterests?.length) && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Interests</p>
              <div className="flex flex-wrap gap-1">
                {member.wellnessInterests?.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 text-xs bg-[#5B7B6D]/10 text-[#5B7B6D] dark:bg-[#5B7B6D]/20 dark:text-[#7FA08F] rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {member.generalInterests?.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 text-xs bg-[#C4A77D]/10 text-[#8B7355] dark:bg-[#C4A77D]/20 dark:text-[#C4A77D] rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Message Button */}
          {onMessage && (
            <button
              onClick={() => onMessage(member)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#5B7B6D] text-white text-sm font-medium rounded-lg hover:bg-[#4A6A5C] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send Message
            </button>
          )}
        </div>
      )}
    </div>
  );
}
