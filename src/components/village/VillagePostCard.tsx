'use client';

import { useState } from 'react';
import { getUserProfile } from '@/lib/storage/profileStorage';
import { toggleReaction, deletePost, getPostComments, createComment } from '@/lib/storage/communityStorage';
import type { VillagePost, PostComment, ReactionType } from '@/types/community';
import { REACTION_EMOJIS, POST_TYPE_LABELS } from '@/types/community';

interface VillagePostCardProps {
  post: VillagePost;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (post: VillagePost) => void;
}

export function VillagePostCard({ post, onPostDeleted, onPostUpdated }: VillagePostCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const profile = getUserProfile();
  const isAuthor = profile?.id === post.authorId;
  const userReaction = post.reactions.find(r => r.userId === profile?.id);
  const postTypeInfo = POST_TYPE_LABELS[post.postType];

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

  function handleReaction(type: ReactionType) {
    if (!profile) return;

    toggleReaction(post.id, type);

    // Optimistic update
    const existingIndex = post.reactions.findIndex(r => r.userId === profile.id);
    const newReactions = [...post.reactions];

    if (existingIndex !== -1) {
      if (newReactions[existingIndex].type === type) {
        newReactions.splice(existingIndex, 1);
      } else {
        newReactions[existingIndex] = {
          ...newReactions[existingIndex],
          type,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      newReactions.push({
        userId: profile.id,
        userName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
        type,
        createdAt: new Date().toISOString(),
      });
    }

    onPostUpdated({ ...post, reactions: newReactions });
    setShowReactions(false);
  }

  function handleDeletePost() {
    if (deletePost(post.id)) {
      onPostDeleted(post.id);
    }
    setShowMenu(false);
  }

  async function loadComments() {
    if (comments.length > 0) {
      setShowComments(!showComments);
      return;
    }

    setIsLoadingComments(true);
    const postComments = getPostComments(post.id);
    setComments(postComments);
    setShowComments(true);
    setIsLoadingComments(false);
  }

  function handleAddComment() {
    if (!newComment.trim()) return;

    const comment = createComment(post.id, newComment.trim());
    if (comment) {
      setComments(prev => [...prev, comment]);
      setNewComment('');
      onPostUpdated({ ...post, commentCount: post.commentCount + 1 });
    }
  }

  // Group reactions by type for display
  const reactionCounts = post.reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C4A77D] flex items-center justify-center text-white font-medium">
              {post.authorName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900 dark:text-white">{post.authorName}</p>
                {post.authorRole && (
                  <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                    {post.authorRole}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <span className={postTypeInfo.color}>{postTypeInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Menu (for post author) */}
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="mt-3">
          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {/* Reactions Summary */}
      {post.reactions.length > 0 && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <div className="flex -space-x-1">
            {Object.entries(reactionCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([type]) => (
                <span
                  key={type}
                  className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-xs"
                >
                  {REACTION_EMOJIS[type as ReactionType].emoji}
                </span>
              ))}
          </div>
          <span className="text-xs text-slate-500">{post.reactions.length}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1">
        {/* React Button */}
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              userReaction
                ? 'text-[#5B7B6D] font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {userReaction ? (
              <span>{REACTION_EMOJIS[userReaction.type].emoji}</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            )}
            <span>{userReaction ? REACTION_EMOJIS[userReaction.type].label : 'React'}</span>
          </button>

          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg flex gap-1 z-10">
              {Object.entries(REACTION_EMOJIS).map(([type, { emoji, label }]) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type as ReactionType)}
                  className="w-9 h-9 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-transform hover:scale-125"
                  title={label}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={loadComments}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Comment{post.commentCount > 0 ? ` (${post.commentCount})` : ''}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          {isLoadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-[#5B7B6D] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <>
              {/* Comment List */}
              <div className="space-y-3 mb-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-2">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {comment.authorName[0]}
                      </div>
                      <div className="flex-1 bg-white dark:bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              {profile && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B7B6D] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {profile.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7B6D] text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-[#5B7B6D] text-white text-sm font-medium rounded-lg hover:bg-[#4A6A5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
