'use client';

import type { SocialImpactGoal } from '@/types/tribes';
import { getGoalProgress, getCauseLabel } from '@/lib/storage/tribeStorage';
import { HeartIcon, UsersIcon, BookOpenIcon, BeakerIcon, GiftIcon, RocketIcon, FireIcon, StarIcon, SparklesIcon } from '@/components/icons/MedicalIcons';

// Forest theme colors - only these are allowed
const FOREST_THEME_COLORS = [
  'from-[#3D5A4C] to-[#2D4A3C]', // Deep Forest
  'from-[#5B7B6D] to-[#3D5A4C]', // Forest
  'from-[#6B8B7D] to-[#5B7B6D]', // Sage
  'from-[#8B7355] to-[#6B5344]', // Bark
  'from-[#A89070] to-[#8B7355]', // Sand
  'from-[#C4A77D] to-[#A89070]', // Wheat
];

// Validate and get forest theme color
function getForestColor(color: string | undefined): string {
  if (color && FOREST_THEME_COLORS.includes(color)) {
    return color;
  }
  return 'from-[#5B7B6D] to-[#3D5A4C]'; // Default forest green
}

interface TribeGoalProgressProps {
  goal: SocialImpactGoal;
  color: string;
}

export function TribeGoalProgress({ goal, color }: TribeGoalProgressProps) {
  const progress = getGoalProgress(goal);
  const isCompleted = !!goal.completedAt;
  const validColor = getForestColor(color);

  const causeIcons: Record<SocialImpactGoal['cause'], React.ReactNode> = {
    'red-cross': <HeartIcon className="w-8 h-8 text-white" />,
    'animal-shelter': <GiftIcon className="w-8 h-8 text-white" />,
    environment: <UsersIcon className="w-8 h-8 text-white" />,
    education: <BookOpenIcon className="w-8 h-8 text-white" />,
    healthcare: <BeakerIcon className="w-8 h-8 text-white" />,
    community: <UsersIcon className="w-8 h-8 text-white" />,
  };

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks left`;
    return `${Math.floor(diffDays / 30)} months left`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#D4C4B0]/50 dark:border-slate-700 overflow-hidden shadow-sm shadow-[#3D5A4C]/5">
      {/* Header */}
      <div className={`px-6 py-4 bg-gradient-to-r ${validColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{causeIcons[goal.cause]}</div>
            <div>
              <h3 className="font-bold text-white text-lg">{goal.title}</h3>
              <p className="text-white/80 text-sm">{getCauseLabel(goal.cause)}</p>
            </div>
          </div>
          {isCompleted && (
            <span className="px-3 py-1 bg-white text-[#5B7B6D] rounded-full text-sm font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Progress section */}
      <div className="p-6">
        <p className="text-[#6B5344] dark:text-slate-300 mb-4">{goal.description}</p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#3D5A4C] dark:text-white">Progress</span>
            <span className="text-sm font-bold text-[#5B7B6D] dark:text-[#6B8B7D]">{progress}%</span>
          </div>
          <div className="h-4 bg-[#E8DFD0] dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${validColor} rounded-full transition-all duration-500 relative`}
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-[#F5EFE6] dark:bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-[#5B7B6D] dark:text-[#6B8B7D]">
              {goal.currentPoints.toLocaleString()}
            </p>
            <p className="text-xs text-[#6B5344]/70 dark:text-slate-400">Current Points</p>
          </div>
          <div className="text-center p-3 bg-[#F5EFE6] dark:bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-[#3D5A4C] dark:text-white">
              {goal.targetPoints.toLocaleString()}
            </p>
            <p className="text-xs text-[#6B5344]/70 dark:text-slate-400">Target Points</p>
          </div>
          <div className="text-center p-3 bg-[#F5EFE6] dark:bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-[#8B7355] dark:text-[#C4A77D]">
              {(goal.targetPoints - goal.currentPoints).toLocaleString()}
            </p>
            <p className="text-xs text-[#6B5344]/70 dark:text-slate-400">Points to Go</p>
          </div>
        </div>

        {/* Deadline & Reward */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D4C4B0]/50 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-[#6B5344] dark:text-slate-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDeadline(goal.deadline)}</span>
          </div>
          <div className="flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-[#C4A77D]" />
            <span className="text-sm font-medium text-[#3D5A4C] dark:text-white">{goal.reward}</span>
          </div>
        </div>
      </div>

      {/* Motivation footer */}
      {!isCompleted && progress < 100 && (
        <div className="px-6 py-3 bg-[#F5EFE6] dark:bg-slate-700/50 border-t border-[#D4C4B0]/50 dark:border-slate-700">
          <p className="text-sm text-center text-[#6B5344] dark:text-slate-300 flex items-center justify-center gap-2">
            {progress < 25 && <><RocketIcon className="w-4 h-4" /> Just getting started! Every point counts.</>}
            {progress >= 25 && progress < 50 && <><SparklesIcon className="w-4 h-4" /> Great progress! Keep the momentum going.</>}
            {progress >= 50 && progress < 75 && <><FireIcon className="w-4 h-4" /> Over halfway there! The goal is in sight.</>}
            {progress >= 75 && progress < 100 && <><StarIcon className="w-4 h-4" /> Almost there! Final push to the finish!</>}
          </p>
        </div>
      )}
    </div>
  );
}
