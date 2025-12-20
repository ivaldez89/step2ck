'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { TribeCard } from '@/components/tribes/TribeCard';
import { CreateTribeModal } from '@/components/tribes/CreateTribeModal';
import { useTribes } from '@/hooks/useTribes';
import type { TribeType, SocialCause, TribeFilter } from '@/types/tribes';

type SortOption = 'popular' | 'newest' | 'points' | 'alphabetical';

export default function TribesPage() {
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
  const [causeFilter, setCauseFilter] = useState<SocialCause | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Filter and sort tribes
  const filteredTribes = useMemo(() => {
    const filter: TribeFilter = {
      search: searchQuery,
      types: typeFilter !== 'all' ? [typeFilter] : [],
      causes: causeFilter !== 'all' ? [causeFilter] : [],
      visibility: 'public',
      sortBy,
    };
    return searchTribes(filter);
  }, [searchQuery, typeFilter, causeFilter, sortBy, searchTribes]);

  const handleJoinTribe = (tribeId: string) => {
    if (!canJoinMore()) {
      alert(`You can only be a member of ${maxTribesPerUser} tribes`);
      return;
    }
    const result = joinTribe(tribeId, { firstName: 'You', lastName: '' });
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleCreateTribe = (data: Parameters<typeof createTribe>[0]) => {
    createTribe(data);
    setShowCreateModal(false);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-2xl p-6 md:p-8 mb-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Your Tribe</h1>
                <p className="text-teal-100 max-w-xl">
                  Join a community working toward meaningful goals. Study together,
                  support each other, and make a social impact.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-lg flex items-center gap-2 self-start"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Tribe
              </button>
            </div>

            {/* User's tribes summary */}
            {userTribes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-teal-100 mb-2">
                  Your Tribes ({userTribes.length}/{maxTribesPerUser})
                </p>
                <div className="flex flex-wrap gap-2">
                  {userTribes.map((tribe) => (
                    <a
                      key={tribe.id}
                      href={`/tribes/${tribe.id}`}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span>{tribe.icon}</span>
                      <span>{tribe.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tribes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TribeType | 'all')}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="study">Study Group</option>
                <option value="specialty">Specialty</option>
                <option value="wellness">Wellness</option>
                <option value="cause">Social Cause</option>
              </select>

              {/* Cause filter */}
              <select
                value={causeFilter}
                onChange={(e) => setCauseFilter(e.target.value as SocialCause | 'all')}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="all">All Causes</option>
                <option value="environment">Environment</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="red-cross">Red Cross</option>
                <option value="animal-shelter">Animal Welfare</option>
                <option value="community">Community</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="points">Most Points</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {filteredTribes.length} tribe{filteredTribes.length !== 1 ? 's' : ''} found
            </p>
            {(searchQuery || typeFilter !== 'all' || causeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setCauseFilter('all');
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Tribes Grid */}
          {filteredTribes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTribes.map((tribe) => (
                <TribeCard
                  key={tribe.id}
                  tribe={tribe}
                  isMember={checkMembership(tribe.id)}
                  onJoin={handleJoinTribe}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No tribes found</h3>
              <p className="text-slate-500 mb-4">
                Try adjusting your filters or create your own tribe!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Create a Tribe
              </button>
            </div>
          )}

          {/* Leaderboard Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🏆</span>
              Top Tribes This Month
            </h2>
            <div className="space-y-3">
              {tribes
                .filter((t) => t.visibility === 'public' && t.rank > 0)
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 5)
                .map((tribe, index) => (
                  <a
                    key={tribe.id}
                    href={`/tribes/${tribe.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : index === 1
                          ? 'bg-slate-100 text-slate-700'
                          : index === 2
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${tribe.color} flex items-center justify-center text-xl`}>
                      {tribe.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{tribe.name}</p>
                      <p className="text-sm text-slate-500">{tribe.memberCount} members</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-teal-600">
                        {tribe.totalPoints.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">points</p>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Tribe Modal */}
      <CreateTribeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTribe}
      />
    </>
  );
}
