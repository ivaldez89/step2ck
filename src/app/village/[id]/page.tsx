'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThreeColumnLayout, CARD_STYLES, ThreeColumnLayoutSkeleton } from '@/components/layout/ThreeColumnLayout';
import { getCharityById } from '@/data/charities';
import { getCurrentVillageId, getUserProfile, switchVillage } from '@/lib/storage/profileStorage';
import { getVillagePosts, getVillageMembers, createPost } from '@/lib/storage/communityStorage';
import { useWellness } from '@/hooks/useWellness';
import { VillagePostCard } from '@/components/village/VillagePostCard';
import { VillageMemberCard } from '@/components/village/VillageMemberCard';
import { DirectMessages } from '@/components/village/DirectMessages';
import type { VillagePost, VillageMemberProfile } from '@/types/community';
import { SparklesIcon } from '@/components/icons/MedicalIcons';

export default function VillageCommunityPage() {
  const params = useParams();
  const router = useRouter();
  const villageId = params.id as string;

  const [posts, setPosts] = useState<VillagePost[]>([]);
  const [members, setMembers] = useState<VillageMemberProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [postType, setPostType] = useState<VillagePost['postType']>('update');
  const [isPosting, setIsPosting] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<VillageMemberProfile | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const charity = getCharityById(villageId);
  const currentVillageId = getCurrentVillageId();
  const isUserVillage = currentVillageId === villageId;
  const profile = getUserProfile();
  const { getVillageLeaderboard, getUserVillageStats } = useWellness();

  const villageStats = getUserVillageStats();
  const leaderboard = getVillageLeaderboard();
  const villageRankData = leaderboard.find(v => v.villageId === villageId);

  useEffect(() => {
    loadCommunityData();
  }, [villageId]);

  function loadCommunityData() {
    const villagePosts = getVillagePosts(villageId);
    const villageMembers = getVillageMembers(villageId);
    setPosts(villagePosts);
    setMembers(villageMembers);
    setIsLoading(false);
  }

  async function handleCreatePost() {
    if (!newPostContent.trim() || !isUserVillage) return;

    setIsPosting(true);
    const post = createPost(villageId, newPostContent.trim(), postType);

    if (post) {
      setPosts(prev => [post, ...prev]);
      setNewPostContent('');
      setPostType('update');
      setShowPostForm(false);
    }

    setIsPosting(false);
  }

  function handlePostDeleted(postId: string) {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  function handlePostUpdated(updatedPost: VillagePost) {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  }

  function handleMessageMember(member: VillageMemberProfile) {
    setMessageRecipient(member);
    setShowMessages(true);
  }

  function handleSwitchVillage() {
    if (confirm(`Are you sure you want to switch to ${charity?.shortName}? Your points will stay with your current Village.`)) {
      const success = switchVillage(villageId);
      if (success) {
        router.refresh();
        window.location.reload();
      } else {
        alert('Failed to switch Village. Please try again.');
      }
    }
  }

  // Not found state
  if (!charity) {
    return (
      <ThreeColumnLayout>
        <div className={CARD_STYLES.containerWithPadding + ' text-center py-12'}>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Village Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This Village doesn&apos;t exist or may have been removed.
          </p>
          <Link
            href="/impact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7B6D] text-white rounded-lg hover:bg-[#4A6A5C] transition-colors"
          >
            View All Villages
          </Link>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <ThreeColumnLayout
        isLoading={true}
        loadingContent={<ThreeColumnLayoutSkeleton />}
      >
        <div />
      </ThreeColumnLayout>
    );
  }

  // Mobile Header
  const mobileHeader = (
    <div className={CARD_STYLES.containerWithPadding}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] flex items-center justify-center text-white font-bold text-xl">
          {charity.shortName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{charity.shortName}</h1>
            {isUserVillage && (
              <span className="px-2 py-0.5 bg-[#5B7B6D]/10 text-[#5B7B6D] text-xs font-medium rounded-full">
                Your Village
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{charity.focus}</p>
        </div>
      </div>
    </div>
  );

  // Left Sidebar - Navigation & Filters
  const leftSidebar = (
    <>
      {/* Village Quick Stats */}
      <div className={CARD_STYLES.container + ' overflow-hidden'}>
        <div className="h-16 bg-gradient-to-br from-[#5B7B6D] via-[#6B8B7D] to-[#7FA08F] flex items-center px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
              {charity.shortName[0]}
            </div>
            <h2 className="text-lg font-bold text-white">{charity.shortName}</h2>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700">
              <p className="text-xl font-bold text-[#5B7B6D]">{villageRankData?.memberCount || members.length}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Members</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700">
              <p className="text-xl font-bold text-[#C4A77D]">#{leaderboard.findIndex(v => v.villageId === villageId) + 1 || '-'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={CARD_STYLES.containerWithPadding.replace('p-4', 'p-3')}>
        <h3 className="font-semibold text-slate-900 dark:text-white px-3 py-2 text-sm">Navigation</h3>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'feed'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D]'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              activeTab === 'feed' ? 'bg-[#5B7B6D] text-white' : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="font-medium">Community Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'members'
                ? 'bg-[#5B7B6D]/10 text-[#5B7B6D]'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              activeTab === 'members' ? 'bg-[#5B7B6D] text-white' : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-medium">Members ({members.length})</span>
          </button>
        </nav>
      </div>

      {/* Quick Actions */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <a
            href={charity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4 text-[#5B7B6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Charity Website
          </a>
          {isUserVillage && (
            <Link
              href="/connections"
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4 text-[#C4A77D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Find Connections
            </Link>
          )}
          {isUserVillage ? (
            <Link
              href="/impact"
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Switch Village
            </Link>
          ) : (
            <button
              onClick={handleSwitchVillage}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[#5B7B6D] text-white rounded-lg text-sm font-medium hover:bg-[#4A6A5C] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Join This Village
            </button>
          )}
        </div>
      </div>
    </>
  );

  // Right Sidebar - About, Contributors, Stats
  const rightSidebar = (
    <>
      {/* About Card */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">About {charity.shortName}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{charity.mission}</p>
        <div className="space-y-2">
          {charity.impactMetrics.slice(0, 3).map((metric, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-slate-500">{metric.label}</span>
              <span className="font-medium text-slate-900 dark:text-white">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Top Contributors</h3>
        <div className="space-y-3">
          {members.slice(0, 5).map((member, index) => (
            <div key={member.id} className="flex items-center gap-3">
              <span className="w-5 text-sm font-medium text-slate-500">{index + 1}</span>
              <div className="w-8 h-8 rounded-full bg-[#C4A77D] flex items-center justify-center text-white text-sm font-medium">
                {member.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {member.name}
                </p>
                <p className="text-xs text-slate-500">{member.pointsContributed.toLocaleString()} pts</p>
              </div>
              {member.isOnline && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Village Stats */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Village Impact</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Total Donated</span>
            <span className="font-semibold text-[#5B7B6D]">${(villageRankData?.totalDonated || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Total Points</span>
            <span className="font-semibold text-[#C4A77D]">{(villageRankData?.totalPoints || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Your Points</span>
            <span className="font-semibold text-[#8B7355]">{villageStats?.userPoints?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* How Points Work */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-amber-500" />
          Points to Donations
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Every 1,000 points = $1.00 donated to {charity.shortName}
        </p>
      </div>
    </>
  );

  return (
    <ThreeColumnLayout
      mobileHeader={mobileHeader}
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
    >
      {/* Village Header Banner - Now as white card in center column */}
      <div className={CARD_STYLES.container + ' overflow-hidden'}>
        <div className="h-24 bg-gradient-to-br from-[#5B7B6D] via-[#6B8B7D] to-[#7FA08F]" />
        <div className="px-4 py-4 -mt-8">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#5B7B6D] to-[#7FA08F] border-4 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {charity.shortName[0]}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{charity.shortName}</h1>
                {isUserVillage && (
                  <span className="px-2 py-0.5 bg-[#5B7B6D]/10 text-[#5B7B6D] text-xs font-medium rounded-full">
                    Your Village
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{charity.focus}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{charity.description}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="text-center">
              <p className="text-lg font-bold text-[#5B7B6D]">{villageRankData?.memberCount || members.length}</p>
              <p className="text-[10px] text-slate-500">Members</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#C4A77D]">${(villageRankData?.totalDonated || 0).toFixed(0)}</p>
              <p className="text-[10px] text-slate-500">Donated</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#8B7355]">{((villageRankData?.totalPoints || 0) / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-slate-500">Points</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">#{leaderboard.findIndex(v => v.villageId === villageId) + 1 || '-'}</p>
              <p className="text-[10px] text-slate-500">Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' ? (
        <>
          {/* Create Post (only for village members) */}
          {isUserVillage && (
            <div className={CARD_STYLES.containerWithPadding}>
              {!showPostForm ? (
                <button
                  onClick={() => setShowPostForm(true)}
                  className="w-full text-left px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Share something with your Village...
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#5B7B6D] flex items-center justify-center text-white font-medium">
                      {profile?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{profile?.currentYear || profile?.role}</p>
                    </div>
                  </div>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5B7B6D] text-slate-900 dark:text-white placeholder:text-slate-400"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {(['update', 'motivation', 'milestone', 'question', 'resource'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setPostType(type)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            postType === type
                              ? 'bg-[#5B7B6D] text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowPostForm(false);
                          setNewPostContent('');
                        }}
                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim() || isPosting}
                        className="px-4 py-2 bg-[#5B7B6D] text-white text-sm font-medium rounded-lg hover:bg-[#4A6A5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isPosting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className={CARD_STYLES.containerWithPadding + ' text-center py-8'}>
              <p className="text-slate-600 dark:text-slate-400 mb-2">No posts yet</p>
              <p className="text-sm text-slate-500">Be the first to share something with your Village!</p>
            </div>
          ) : (
            posts.map((post) => (
              <VillagePostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))
          )}
        </>
      ) : (
        /* Members Tab */
        <div className={CARD_STYLES.containerWithPadding}>
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Village Members</h2>
          <div className="grid gap-4">
            {members.map((member) => (
              <VillageMemberCard
                key={member.id}
                member={member}
                onMessage={isUserVillage ? handleMessageMember : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Messages Button - Fixed */}
      {isUserVillage && (
        <button
          onClick={() => setShowMessages(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#5B7B6D] text-white rounded-full shadow-lg hover:bg-[#4A6A5C] transition-colors flex items-center justify-center z-40"
          aria-label="Messages"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Direct Messages Modal */}
      <DirectMessages
        isOpen={showMessages}
        onClose={() => {
          setShowMessages(false);
          setMessageRecipient(undefined);
        }}
        initialRecipient={messageRecipient}
      />
    </ThreeColumnLayout>
  );
}
