'use client';

import { useState } from 'react';
import type { ConnectionRequest } from '@/lib/storage/connectionStorage';
import { respondToRequest } from '@/lib/storage/connectionStorage';

interface ConnectionRequestCardProps {
  request: ConnectionRequest;
  type: 'incoming' | 'outgoing';
  onResponded?: () => void;
}

export function ConnectionRequestCard({ request, type, onResponded }: ConnectionRequestCardProps) {
  const [isResponding, setIsResponding] = useState(false);

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

  async function handleResponse(accept: boolean) {
    setIsResponding(true);
    respondToRequest(request.id, accept);
    onResponded?.();
    setIsResponding(false);
  }

  const displayName = type === 'incoming' ? request.fromUserName : request.toUserName;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[#C4A77D] flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
          {displayName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{displayName}</h3>
            {request.matchScore > 0 && (
              <span className="px-2 py-0.5 text-xs bg-[#5B7B6D]/10 text-[#5B7B6D] dark:bg-[#5B7B6D]/20 dark:text-[#7FA08F] rounded-full">
                {Math.round(request.matchScore)}% match
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-2">{formatTimeAgo(request.createdAt)}</p>

          {/* Message */}
          {request.message && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 italic">
              &quot;{request.message}&quot;
            </p>
          )}

          {/* Common Interests */}
          {request.commonInterests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1">
                {request.commonInterests.length} shared interest{request.commonInterests.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1">
                {request.commonInterests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {request.commonInterests.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-slate-500">
                    +{request.commonInterests.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {type === 'incoming' && request.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleResponse(true)}
                disabled={isResponding}
                className="flex-1 px-4 py-2 bg-[#5B7B6D] text-white text-sm font-medium rounded-lg hover:bg-[#4A6A5C] disabled:opacity-50 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleResponse(false)}
                disabled={isResponding}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          )}

          {type === 'outgoing' && request.status === 'pending' && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Waiting for response...
            </div>
          )}

          {request.status === 'accepted' && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connection started!
            </div>
          )}

          {request.status === 'declined' && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Request declined
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
