'use client';

import Link from 'next/link';
import type { Tribe } from '@/types/tribes';
import { getGoalProgress, getTypeLabel } from '@/lib/storage/tribeStorage';

interface TribeCardProps {
  tribe: Tribe;
  isMember?: boolean;
  onJoin?: (tribeId: string) => void;
}

export function TribeCard({ tribe, isMember = false, onJoin }: TribeCardProps) {
  const goalProgress = tribe.currentGoal ? getGoalProgress(tribe.currentGoal) : 0;

  // Type badge styles
  const typeStyles: Record<Tribe['type'], string> = {
    study: 'bg-purple-100 text-purple-700',
    specialty: 'bg-blue-100 text-blue-700',
    wellness: 'bg-emerald-100 text-emerald-700',
    cause: 'bg-amber-100 text-amber-700',
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onJoin) {
      onJoin(tribe.id);
    }
  };

  return (
    <Link href={`/tribes/${tribe.id}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200 hover:border-teal-300 transition-all duration-200 overflow-hidden cursor-pointer">
        {/* Header with gradient */}
        <div className={`px-4 py-3 bg-gradient-to-r ${tribe.color} border-b border-slate-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{tribe.icon}</span>
              <div>
                <h3 className="font-semibold text-white text-sm drop-shadow-sm">
                  {tribe.name}
                </h3>
                <span className="text-xs text-white/80">
                  {tribe.memberCount} member{tribe.memberCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            {tribe.visibility === 'private' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm">
                Private
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Description */}
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {tribe.description}
          </p>

          {/* Type badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles[tribe.type]}`}>
              {getTypeLabel(tribe.type)}
            </span>
            {tribe.rank > 0 && tribe.rank <= 10 && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                #{tribe.rank} Leaderboard
              </span>
            )}
          </div>

          {/* Goal progress */}
          {tribe.currentGoal && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium truncate pr-2">{tribe.currentGoal.title}</span>
                <span className="whitespace-nowrap">{goalProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${tribe.color} rounded-full transition-all duration-300`}
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>{tribe.currentGoal.currentPoints.toLocaleString()} pts</span>
                <span>{tribe.currentGoal.targetPoints.toLocaleString()} goal</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-400">
              {tribe.weeklyPoints > 0 && (
                <span className="text-emerald-600 font-medium">
                  +{tribe.weeklyPoints} pts this week
                </span>
              )}
            </div>

            {isMember ? (
              <span className="px-3 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">
                Member
              </span>
            ) : (
              <button
                onClick={handleJoinClick}
                className="px-3 py-1 text-xs font-medium bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
              >
                Join
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
