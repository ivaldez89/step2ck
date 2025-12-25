'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ThreeColumnLayout, CARD_STYLES } from '@/components/layout/ThreeColumnLayout';
import { TribeCard } from '@/components/tribes/TribeCard';
import { CreateTribeModal } from '@/components/tribes/CreateTribeModal';
import { useTribes } from '@/hooks/useTribes';
import { Icons } from '@/components/ui/Icons';
import type { TribeType, TribeFilter } from '@/types/tribes';

// Forest theme colors - only these are allowed
const FOREST_THEME_COLORS = [
  'from-[#3D5A4C] to-[#2D4A3C]', // Deep Forest
  'from-[#5B7B6D] to-[#3D5A4C]', // Forest
  'from-[#6B8B7D] to-[#5B7B6D]', // Sage
  'from-[#8B7355] to-[#6B5344]', // Bark
  'from-[#A89070] to-[#8B7355]', // Sand
  'from-[#C4A77D] to-[#A89070]', // Wheat
];

// Map group types to forest theme colors (fallback)
const TYPE_COLORS: Record<TribeType, string> = {
  study: 'from-[#A89070] to-[#8B7355]',    // Sand
  specialty: 'from-[#8B7355] to-[#6B5344]', // Bark
  wellness: 'from-[#6B8B7D] to-[#5B7B6D]',  // Sage
  cause: 'from-[#5B7B6D] to-[#3D5A4C]',     // Forest
};

// Validate and get forest theme color
function getForestColor(color: string | undefined, type: TribeType): string {
  if (color && FOREST_THEME_COLORS.includes(color)) {
    return color;
  }
  return TYPE_COLORS[type] || 'from-[#5B7B6D] to-[#3D5A4C]';
}

type SortOption = 'popular' | 'newest' | 'points' | 'alphabetical';

export default function GroupsPage() {
  const {
    tribes,
    userTribes,
    isLoading,
    createTribe,
    joinTribe,
    checkMembership,
    canJoinMore,
    maxTribesPerUser,
    searchTribes,
  } = useTribes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TribeType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    const filter: TribeFilter = {
      search: searchQuery,
      types: typeFilter !== 'all' ? [typeFilter] : [],
      causes: [],
      visibility: 'public',
      sortBy,
    };
    return searchTribes(filter);
  }, [searchQuery, typeFilter, sortBy, searchTribes]);

  const handleJoinGroup = (groupId: string) => {
    if (!canJoinMore()) {
      alert(`You can only be a member of ${maxTribesPerUser} groups`);
      return;
    }
    const result = joinTribe(groupId, { firstName: 'You', lastName: '' });
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleCreateGroup = (data: Parameters<typeof createTribe>[0]) => {
    createTribe(data);
    setShowCreateModal(false);
  };

  // Loading skeleton
  const loadingContent = (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-surface-muted dark:bg-surface-muted rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-surface-muted dark:bg-surface-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );

  // Left Sidebar - Filters
  const leftSidebar = (
    <>
      {/* Profile Card - Your Groups */}
      <div className={CARD_STYLES.container + ' overflow-hidden'}>
        <div className="h-16 bg-gradient-to-br from-[#5B7B6D] via-[#6B8B7D] to-[#C4A77D]" />
        <div className="px-4 py-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">My Groups</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            {userTribes.length} of {maxTribesPerUser} groups joined
          </p>
          {userTribes.length > 0 ? (
            <div className="space-y-2">
              {userTribes.slice(0, 4).map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getForestColor(group.color, group.type)} flex items-center justify-center text-white`}>
                    <Icons.Users />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{group.name}</span>
                </Link>
              ))}
              {userTribes.length > 4 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
                  +{userTribes.length - 4} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              Join groups to see them here
            </p>
          )}
        </div>
      </div>

      {/* Filter by Type */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Filter by Type</h3>
        <div className="space-y-1">
          <button
            onClick={() => setTypeFilter('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
              typeFilter === 'all'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm">All Groups</span>
          </button>
          <button
            onClick={() => setTypeFilter('study')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
              typeFilter === 'study'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm">Study Groups</span>
          </button>
          <button
            onClick={() => setTypeFilter('specialty')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
              typeFilter === 'specialty'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm">Specialty</span>
          </button>
          <button
            onClick={() => setTypeFilter('wellness')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
              typeFilter === 'wellness'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Wellness</span>
          </button>
          <button
            onClick={() => setTypeFilter('cause')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
              typeFilter === 'cause'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="text-sm">Social Cause</span>
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Sort By</h3>
        <div className="space-y-1">
          {[
            { value: 'popular', label: 'Most Popular' },
            { value: 'newest', label: 'Newest' },
            { value: 'alphabetical', label: 'A-Z' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as SortOption)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                sortBy === option.value
                  ? 'bg-[#5B7B6D]/10 text-[#5B7B6D] dark:text-[#7FA08F] font-medium'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // Right Sidebar - Popular Groups & Tips
  const rightSidebar = (
    <>
      {/* Popular Groups */}
      <div className={CARD_STYLES.container + ' overflow-hidden'}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-[#8B7355] to-[#A89070]">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Popular Groups
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {tribes
            .filter((t) => t.visibility === 'public')
            .sort((a, b) => b.memberCount - a.memberCount)
            .slice(0, 5)
            .map((group, index) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-[#C4A77D] to-[#8B7355] text-white'
                      : index === 1
                      ? 'bg-gradient-to-br from-[#A89070] to-[#8B7355] text-white'
                      : index === 2
                      ? 'bg-gradient-to-br from-[#6B8B7D] to-[#5B7B6D] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{group.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{group.memberCount} members</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Tips */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#C4A77D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Group Tips
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-[#5B7B6D]">Study Groups:</span> Perfect for exam prep and collaborative learning.
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-[#8B7355]">Specialty Groups:</span> Connect with peers in your field of interest.
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-[#6B8B7D]">Wellness Groups:</span> Support mental health and work-life balance.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <ThreeColumnLayout
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
        isLoading={isLoading}
        loadingContent={loadingContent}
      >
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B7B6D] via-[#6B8B7D] to-[#7FA08F] p-6 shadow-lg mb-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Explore Groups
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                Join interest-based groups to connect with peers
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-white text-[#3D5A4C] rounded-xl font-medium hover:bg-[#F5EFE6] transition-colors shadow-lg flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Group
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={CARD_STYLES.containerWithPadding + ' mb-4'}>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#5B7B6D] focus:border-[#5B7B6D] transition-colors"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} found
            </p>
            {(searchQuery || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
                className="text-sm text-[#5B7B6D] dark:text-[#7FA08F] hover:underline font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.map((group) => (
              <TribeCard
                key={group.id}
                tribe={group}
                isMember={checkMembership(group.id)}
                onJoin={handleJoinGroup}
                hidePoints={true}
              />
            ))}
          </div>
        ) : (
          <div className={CARD_STYLES.containerWithPadding + ' text-center py-12'}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
              <Icons.Search />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No groups found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Try adjusting your filters or create your own group to get started!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#5B7B6D] to-[#6B8B7D] text-white rounded-xl font-medium hover:from-[#4A6B5D] hover:to-[#5B7B6D] transition-colors shadow-lg"
            >
              Create a Group
            </button>
          </div>
        )}
      </ThreeColumnLayout>

      {/* Create Group Modal */}
      <CreateTribeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGroup}
      />
    </>
  );
}
