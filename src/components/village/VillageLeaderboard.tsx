'use client';

import { useWellness, type VillageLeaderboardEntry } from '@/hooks/useWellness';
import { getCurrentVillageId } from '@/lib/storage/profileStorage';
import { getCharityById } from '@/data/charities';

interface VillageLeaderboardProps {
  variant?: 'full' | 'compact';
  showTopContributors?: boolean;
}

export function VillageLeaderboard({ variant = 'full', showTopContributors = true }: VillageLeaderboardProps) {
  const { getVillageLeaderboard, getUserVillageStats, getGlobalImpactStats } = useWellness();

  const leaderboard = getVillageLeaderboard();
  const userVillageStats = getUserVillageStats();
  const globalStats = getGlobalImpactStats();

  const currentVillageId = getCurrentVillageId();

  // Get medal/rank icon
  const getRankDisplay = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-2xl">🥇</span>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="text-lg font-bold text-slate-500">#{index + 1}</span>;
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Village Rankings</h3>
          <span className="text-xs text-slate-500">${globalStats.totalDonated.toFixed(2)} raised</span>
        </div>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((village, index) => (
            <div
              key={village.villageId}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                village.villageId === currentVillageId
                  ? 'bg-[#5B7B6D]/10 dark:bg-[#5B7B6D]/20 border border-[#5B7B6D]/30'
                  : ''
              }`}
            >
              {getRankDisplay(index)}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {village.villageName.split('(')[0].trim()}
              </span>
              <span className="text-xs text-[#5B7B6D] dark:text-[#7FA08F] font-medium">
                ${village.totalDonated.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] rounded-xl text-white text-center">
          <p className="text-3xl font-bold">${globalStats.totalDonated.toFixed(2)}</p>
          <p className="text-white/80 text-sm">Total Donated</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#C4A77D] to-[#A89070] rounded-xl text-white text-center">
          <p className="text-3xl font-bold">{globalStats.totalPoints.toLocaleString()}</p>
          <p className="text-white/80 text-sm">Total Points</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#8B7355] to-[#6B5344] rounded-xl text-white text-center">
          <p className="text-3xl font-bold">{globalStats.totalMembers}</p>
          <p className="text-white/80 text-sm">Active Members</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl text-white text-center">
          <p className="text-3xl font-bold">{globalStats.totalVillages}</p>
          <p className="text-white/80 text-sm">Villages</p>
        </div>
      </div>

      {/* User's Village Stats */}
      {userVillageStats && (
        <div className="p-6 bg-gradient-to-br from-[#F5F0E8] to-[#E8F0ED] dark:from-[#5B7B6D]/20 dark:to-[#7FA08F]/20 rounded-2xl border border-[#5B7B6D]/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your Village</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userVillageStats.villageName}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Village Rank</p>
              <p className="text-2xl font-bold text-[#5B7B6D] dark:text-[#7FA08F]">
                #{userVillageStats.villageRank}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userVillageStats.userPoints}</p>
              <p className="text-xs text-slate-500">Your Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${userVillageStats.totalVillageDonated.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Village Donated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userVillageStats.currentStreak}</p>
              <p className="text-xs text-slate-500">Day Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#5B7B6D] to-[#7FA08F] text-white">
          <h3 className="text-lg font-bold">Village Leaderboard</h3>
          <p className="text-white/80 text-sm">100% of points convert to real donations</p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {leaderboard.map((village, index) => {
            const charity = getCharityById(village.villageId);
            const isUserVillage = village.villageId === currentVillageId;

            return (
              <div
                key={village.villageId}
                className={`p-4 ${isUserVillage ? 'bg-[#5B7B6D]/5 dark:bg-[#5B7B6D]/10' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">{getRankDisplay(index)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {charity?.shortName || village.villageName}
                      </h4>
                      {isUserVillage && (
                        <span className="px-2 py-0.5 bg-[#5B7B6D] text-white text-xs font-bold rounded-full">
                          Your Village
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{charity?.focus || 'Charitable cause'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#5B7B6D] dark:text-[#7FA08F]">
                      ${village.totalDonated.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">{village.totalPoints.toLocaleString()} pts</p>
                  </div>
                </div>

                {/* Top Contributors (only if enabled and there are contributors) */}
                {showTopContributors && village.topContributors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-2">Top Contributors</p>
                    <div className="flex flex-wrap gap-2">
                      {village.topContributors.slice(0, 3).map((contributor, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300"
                        >
                          {contributor.name}: {contributor.points} pts
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">How Village Points Work</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C4A77D]/20 flex items-center justify-center text-[#C4A77D] font-bold">1</div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Earn Points</p>
              <p className="text-slate-500 dark:text-slate-400">Complete wellness activities, study goals, and challenges</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5B7B6D]/20 flex items-center justify-center text-[#5B7B6D] font-bold">2</div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Points → Village</p>
              <p className="text-slate-500 dark:text-slate-400">All points automatically go to your selected Village (charity)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B7355]/20 flex items-center justify-center text-[#8B7355] font-bold">3</div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">1,000 pts = $1</p>
              <p className="text-slate-500 dark:text-slate-400">100% of converted points are donated to real charities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
