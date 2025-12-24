'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ConnectionMatch } from '@/data/connectionQuestions';
import { LEVEL_DESCRIPTIONS } from '@/data/connectionQuestions';
import { getConnectionProgress, getPartnerInfo, getConnectionEndMessage } from '@/lib/storage/connectionStorage';

interface ConnectionCardProps {
  connection: ConnectionMatch;
  onViewConnection: (connectionId: string) => void;
}

export function ConnectionCard({ connection, onViewConnection }: ConnectionCardProps) {
  const progress = getConnectionProgress(connection.id);
  const partner = getPartnerInfo(connection.id);
  const endMessage = getConnectionEndMessage(connection.id);

  if (!progress || !partner) return null;

  const levelInfo = LEVEL_DESCRIPTIONS[progress.currentLevel];
  const progressPercent = (progress.levelProgress.answered / progress.levelProgress.required) * 100;

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

  // Show ended state with graceful message
  if (connection.status === 'ended' && endMessage) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-600 dark:text-slate-400">Connection Ended</p>
            <p className="text-sm text-slate-500">{formatTimeAgo(connection.endedAt || connection.createdAt)}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{endMessage}</p>
        <Link
          href="/connections/find"
          className="inline-flex items-center gap-2 text-sm text-[#5B7B6D] hover:text-[#4A6A5C] font-medium"
        >
          Find New Match
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-[#5B7B6D] transition-colors cursor-pointer"
      onClick={() => onViewConnection(connection.id)}
    >
      {/* Partner Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#C4A77D] flex items-center justify-center text-white font-medium text-lg">
            {partner.name[0]}
          </div>
          {partner.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{partner.name}</h3>
          <p className="text-sm text-slate-500">{partner.role} • {partner.school}</p>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            progress.canAdvance
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:bg-[#5B7B6D]/20 dark:text-[#7FA08F]'
          }`}>
            Level {progress.currentLevel}
          </span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600 dark:text-slate-400">{levelInfo.name}</span>
          <span className="text-slate-500">
            {progress.levelProgress.answered}/{progress.levelProgress.required} questions
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5B7B6D] to-[#7FA08F] transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Status Message */}
      {progress.canAdvance && (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-green-700 dark:text-green-400">Ready to advance!</span>
        </div>
      )}

      {/* Common Interests */}
      {partner.generalInterests && partner.generalInterests.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Shared interests</p>
          <div className="flex flex-wrap gap-1">
            {partner.generalInterests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
