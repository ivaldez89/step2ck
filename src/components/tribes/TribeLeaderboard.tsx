'use client';

import { useState } from 'react';
import type { TribeMember } from '@/types/tribes';
import { TrophyIcon } from '@/components/icons/MedicalIcons';

interface TribeLeaderboardProps {
  members: TribeMember[];
  currentUserId?: string;
}

type TimeFilter = 'all-time' | 'weekly';

export function TribeLeaderboard({ members, currentUserId = 'current-user' }: TribeLeaderboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');

  // Sort members by points
  const sortedMembers = [...members].sort((a, b) => {
    if (timeFilter === 'weekly') {
      return b.weeklyContribution - a.weeklyContribution;
    }
    return b.contributionPoints - a.contributionPoints;
  });

  const getPoints = (member: TribeMember) => {
    return timeFilter === 'weekly' ? member.weeklyContribution : member.contributionPoints;
  };

  const maxPoints = sortedMembers.length > 0 ? getPoints(sortedMembers[0]) : 0;

  const getRankBadge = (index: number) => {
    if (index === 0) return { content: <span className="text-xl">1</span>, bg: 'bg-[#C4A77D]/20', text: 'text-[#8B7355]' };
    if (index === 1) return { content: <span className="text-xl">2</span>, bg: 'bg-[#D4C4B0]/50', text: 'text-[#6B5344]' };
    if (index === 2) return { content: <span className="text-xl">3</span>, bg: 'bg-[#E8DFD0]', text: 'text-[#8B7355]' };
    return { content: <span>{index + 1}</span>, bg: 'bg-[#F5EFE6] dark:bg-slate-700', text: 'text-[#6B5344] dark:text-slate-400' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  // Find current user's rank
  const currentUserRank = sortedMembers.findIndex((m) => m.oderId === currentUserId);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#D4C4B0]/50 dark:border-slate-700 overflow-hidden shadow-sm shadow-[#3D5A4C]/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#D4C4B0]/50 dark:border-slate-700 bg-gradient-to-r from-[#8B7355] to-[#A89070]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-white">Leaderboard</h3>
          </div>
          <div className="flex bg-white/20 backdrop-blur rounded-lg p-1">
            <button
              onClick={() => setTimeFilter('all-time')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === 'all-time'
                  ? 'bg-white text-[#3D5A4C] font-medium'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === 'weekly'
                  ? 'bg-white text-[#3D5A4C] font-medium'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Current user's rank banner */}
      {currentUserRank >= 0 && (
        <div className="px-4 py-3 bg-[#5B7B6D]/10 dark:bg-[#5B7B6D]/20 border-b border-[#5B7B6D]/20 dark:border-[#5B7B6D]/30">
          <p className="text-sm text-[#3D5A4C] dark:text-[#6B8B7D]">
            You&apos;re ranked <span className="font-bold">#{currentUserRank + 1}</span> with{' '}
            <span className="font-bold">{getPoints(sortedMembers[currentUserRank]).toLocaleString()}</span> points
            {timeFilter === 'weekly' && ' this week'}
          </p>
        </div>
      )}

      {/* Leaderboard list */}
      <div className="divide-y divide-[#D4C4B0]/30 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
        {sortedMembers.length > 0 ? (
          sortedMembers.map((member, index) => {
            const rank = getRankBadge(index);
            const points = getPoints(member);
            const progressWidth = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-4 ${
                  member.oderId === currentUserId ? 'bg-[#5B7B6D]/5 dark:bg-[#5B7B6D]/10' : 'hover:bg-[#F5EFE6] dark:hover:bg-slate-700/50'
                } transition-colors`}
              >
                {/* Rank */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank.bg} ${rank.text}`}
                >
                  {rank.content}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B7B6D] to-[#6B8B7D] flex items-center justify-center text-white font-medium text-sm">
                  {member.avatar || getInitials(member.firstName, member.lastName)}
                </div>

                {/* Info with progress bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#3D5A4C] dark:text-white truncate">
                      {member.firstName} {member.lastName}
                      {member.oderId === currentUserId && (
                        <span className="text-[#6B5344]/70 dark:text-slate-400 font-normal"> (you)</span>
                      )}
                    </span>
                    {member.role !== 'member' && (
                      <span
                        className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                          member.role === 'founder'
                            ? 'bg-[#C4A77D]/20 text-[#8B7355]'
                            : 'bg-[#5B7B6D]/10 text-[#5B7B6D]'
                        }`}
                      >
                        {member.role === 'founder' ? 'Founder' : 'Mod'}
                      </span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#E8DFD0] dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-gradient-to-r from-[#C4A77D] to-[#A89070]'
                          : 'bg-gradient-to-r from-[#5B7B6D] to-[#6B8B7D]'
                      }`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-bold text-[#5B7B6D] dark:text-[#6B8B7D] text-lg">
                    {points.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#6B5344]/70 dark:text-slate-400">points</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-[#6B5344]/70 dark:text-slate-400">
            <p>No members yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#D4C4B0]/50 dark:border-slate-700 bg-[#F5EFE6] dark:bg-slate-700/50">
        <p className="text-xs text-[#6B5344]/70 dark:text-slate-400 text-center">
          Earn points through study and wellness activities
        </p>
      </div>
    </div>
  );
}
