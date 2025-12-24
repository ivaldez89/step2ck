// Village Community Storage - localStorage layer for community features

import type {
  VillagePost,
  PostComment,
  PostReaction,
  ReactionType,
  DirectMessage,
  Conversation,
  VillageMemberProfile,
  VillageCommunityStats,
} from '@/types/community';
import { getUserProfile, getCurrentUserId } from './profileStorage';

const POSTS_KEY = 'tribewellmd_village_posts';
const COMMENTS_KEY = 'tribewellmd_post_comments';
const CONVERSATIONS_KEY = 'tribewellmd_conversations';
const MESSAGES_KEY = 'tribewellmd_messages';
const MEMBERS_KEY = 'tribewellmd_village_members';

// ============================================
// Posts
// ============================================

export function getVillagePosts(villageId: string): VillagePost[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return getSamplePosts(villageId);

    const allPosts: VillagePost[] = JSON.parse(stored);
    const villagePosts = allPosts.filter(p => p.villageId === villageId);

    // Return sample posts if no posts exist for this village
    if (villagePosts.length === 0) {
      return getSamplePosts(villageId);
    }

    return villagePosts.sort((a, b) => {
      // Pinned posts first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error loading village posts:', error);
    return getSamplePosts(villageId);
  }
}

export function createPost(
  villageId: string,
  content: string,
  postType: VillagePost['postType'] = 'update',
  imageUrl?: string
): VillagePost | null {
  const profile = getUserProfile();
  if (!profile) return null;

  const post: VillagePost = {
    id: crypto.randomUUID(),
    villageId,
    authorId: profile.id,
    authorName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
    authorAvatar: profile.avatar,
    authorRole: profile.currentYear || profile.role,
    content,
    imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reactions: [],
    commentCount: 0,
    isPinned: false,
    postType,
  };

  try {
    const stored = localStorage.getItem(POSTS_KEY);
    const allPosts: VillagePost[] = stored ? JSON.parse(stored) : [];
    allPosts.unshift(post);
    localStorage.setItem(POSTS_KEY, JSON.stringify(allPosts));
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export function deletePost(postId: string): boolean {
  const profile = getUserProfile();
  if (!profile) return false;

  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return false;

    const allPosts: VillagePost[] = JSON.parse(stored);
    const postIndex = allPosts.findIndex(p => p.id === postId && p.authorId === profile.id);

    if (postIndex === -1) return false;

    allPosts.splice(postIndex, 1);
    localStorage.setItem(POSTS_KEY, JSON.stringify(allPosts));

    // Also delete associated comments
    deletePostComments(postId);

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export function toggleReaction(postId: string, reactionType: ReactionType): boolean {
  const profile = getUserProfile();
  if (!profile) return false;

  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return false;

    const allPosts: VillagePost[] = JSON.parse(stored);
    const post = allPosts.find(p => p.id === postId);

    if (!post) return false;

    const existingReactionIndex = post.reactions.findIndex(r => r.userId === profile.id);

    if (existingReactionIndex !== -1) {
      const existing = post.reactions[existingReactionIndex];
      if (existing.type === reactionType) {
        // Remove reaction if same type
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // Change reaction type
        existing.type = reactionType;
        existing.createdAt = new Date().toISOString();
      }
    } else {
      // Add new reaction
      post.reactions.push({
        userId: profile.id,
        userName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
        type: reactionType,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(POSTS_KEY, JSON.stringify(allPosts));
    return true;
  } catch (error) {
    console.error('Error toggling reaction:', error);
    return false;
  }
}

// ============================================
// Comments
// ============================================

export function getPostComments(postId: string): PostComment[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return [];

    const allComments: PostComment[] = JSON.parse(stored);
    return allComments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
}

export function createComment(postId: string, content: string, parentCommentId?: string): PostComment | null {
  const profile = getUserProfile();
  if (!profile) return null;

  const comment: PostComment = {
    id: crypto.randomUUID(),
    postId,
    authorId: profile.id,
    authorName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
    authorAvatar: profile.avatar,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reactions: [],
    parentCommentId,
  };

  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    const allComments: PostComment[] = stored ? JSON.parse(stored) : [];
    allComments.push(comment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));

    // Update comment count on post
    updatePostCommentCount(postId, 1);

    return comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

export function deleteComment(commentId: string): boolean {
  const profile = getUserProfile();
  if (!profile) return false;

  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return false;

    const allComments: PostComment[] = JSON.parse(stored);
    const commentIndex = allComments.findIndex(c => c.id === commentId && c.authorId === profile.id);

    if (commentIndex === -1) return false;

    const comment = allComments[commentIndex];
    allComments.splice(commentIndex, 1);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));

    // Update comment count on post
    updatePostCommentCount(comment.postId, -1);

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

function deletePostComments(postId: string): void {
  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return;

    const allComments: PostComment[] = JSON.parse(stored);
    const filtered = allComments.filter(c => c.postId !== postId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting post comments:', error);
  }
}

function updatePostCommentCount(postId: string, delta: number): void {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return;

    const allPosts: VillagePost[] = JSON.parse(stored);
    const post = allPosts.find(p => p.id === postId);

    if (post) {
      post.commentCount = Math.max(0, post.commentCount + delta);
      localStorage.setItem(POSTS_KEY, JSON.stringify(allPosts));
    }
  } catch (error) {
    console.error('Error updating comment count:', error);
  }
}

// ============================================
// Direct Messaging
// ============================================

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];

  const userId = getCurrentUserId();
  if (!userId) return [];

  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) return [];

    const allConversations: Conversation[] = JSON.parse(stored);
    return allConversations
      .filter(c => c.participantIds.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

export function getOrCreateConversation(otherUserId: string, otherUserName: string): Conversation | null {
  const profile = getUserProfile();
  if (!profile) return null;

  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const allConversations: Conversation[] = stored ? JSON.parse(stored) : [];

    // Check if conversation already exists
    const existing = allConversations.find(c =>
      c.participantIds.includes(profile.id) && c.participantIds.includes(otherUserId)
    );

    if (existing) return existing;

    // Create new conversation
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      participantIds: [profile.id, otherUserId],
      participantNames: [`${profile.firstName} ${profile.lastName}`.trim() || 'You', otherUserName],
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };

    allConversations.push(conversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(allConversations));

    return conversation;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    return null;
  }
}

export function getMessages(conversationId: string): DirectMessage[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (!stored) return [];

    const allMessages: DirectMessage[] = JSON.parse(stored);
    return allMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

export function sendMessage(conversationId: string, receiverId: string, content: string): DirectMessage | null {
  const profile = getUserProfile();
  if (!profile) return null;

  const message: DirectMessage = {
    id: crypto.randomUUID(),
    conversationId,
    senderId: profile.id,
    senderName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
    receiverId,
    content,
    createdAt: new Date().toISOString(),
  };

  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    const allMessages: DirectMessage[] = stored ? JSON.parse(stored) : [];
    allMessages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));

    // Update conversation
    updateConversationLastMessage(conversationId, message);

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

function updateConversationLastMessage(conversationId: string, message: DirectMessage): void {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) return;

    const allConversations: Conversation[] = JSON.parse(stored);
    const conversation = allConversations.find(c => c.id === conversationId);

    if (conversation) {
      conversation.lastMessage = message;
      conversation.lastMessageAt = message.createdAt;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(allConversations));
    }
  } catch (error) {
    console.error('Error updating conversation:', error);
  }
}

// ============================================
// Village Members
// ============================================

export function getVillageMembers(villageId: string): VillageMemberProfile[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MEMBERS_KEY);
    if (!stored) return getSampleMembers(villageId);

    const allMembers: Record<string, VillageMemberProfile[]> = JSON.parse(stored);
    const villageMembers = allMembers[villageId] || [];

    if (villageMembers.length === 0) {
      return getSampleMembers(villageId);
    }

    return villageMembers.sort((a, b) => b.pointsContributed - a.pointsContributed);
  } catch (error) {
    console.error('Error loading village members:', error);
    return getSampleMembers(villageId);
  }
}

// ============================================
// Sample Data
// ============================================

function getSamplePosts(villageId: string): VillagePost[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  return [
    {
      id: 'sample-1',
      villageId,
      authorId: 'sample-user-1',
      authorName: 'Sarah M.',
      authorRole: 'MS3',
      content: "Just hit my 30-day wellness streak! The mindfulness exercises have really helped during rotations. Keep pushing everyone! 💪",
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
      reactions: [
        { userId: 'u1', userName: 'Alex', type: 'celebrate', createdAt: yesterday.toISOString() },
        { userId: 'u2', userName: 'Jordan', type: 'love', createdAt: yesterday.toISOString() },
        { userId: 'u3', userName: 'Chris', type: 'support', createdAt: yesterday.toISOString() },
      ],
      commentCount: 3,
      isPinned: false,
      postType: 'milestone',
    },
    {
      id: 'sample-2',
      villageId,
      authorId: 'sample-user-2',
      authorName: 'Michael R.',
      authorRole: 'Resident',
      content: "Quick tip: I've been doing 5-minute meditation sessions between cases. Game changer for staying focused. Anyone else have productivity tips?",
      createdAt: twoDaysAgo.toISOString(),
      updatedAt: twoDaysAgo.toISOString(),
      reactions: [
        { userId: 'u4', userName: 'Pat', type: 'insightful', createdAt: twoDaysAgo.toISOString() },
        { userId: 'u5', userName: 'Sam', type: 'like', createdAt: twoDaysAgo.toISOString() },
      ],
      commentCount: 5,
      isPinned: false,
      postType: 'resource',
    },
    {
      id: 'sample-3',
      villageId,
      authorId: 'sample-user-3',
      authorName: 'Emily K.',
      authorRole: 'MS2',
      content: "Struggling with boards prep stress. Any advice on balancing Step 1 studying with wellness goals?",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      reactions: [
        { userId: 'u6', userName: 'Taylor', type: 'support', createdAt: now.toISOString() },
      ],
      commentCount: 8,
      isPinned: false,
      postType: 'question',
    },
  ];
}

function getSampleMembers(villageId: string): VillageMemberProfile[] {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'sample-member-1',
      name: 'Sarah M.',
      role: 'MS3',
      school: 'Johns Hopkins',
      specialty: 'Internal Medicine',
      joinedVillageAt: twoMonthsAgo.toISOString(),
      pointsContributed: 4500,
      currentStreak: 30,
      isOnline: true,
      lastActiveAt: now.toISOString(),
      bio: 'Passionate about preventive medicine and wellness',
      wellnessInterests: ['Mindfulness', 'Physical Fitness'],
      generalInterests: ['Hiking', 'Photography'],
    },
    {
      id: 'sample-member-2',
      name: 'Michael R.',
      role: 'Resident',
      school: 'UCSF',
      specialty: 'Emergency Medicine',
      joinedVillageAt: oneMonthAgo.toISOString(),
      pointsContributed: 3200,
      currentStreak: 15,
      isOnline: false,
      lastActiveAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      bio: 'EM resident interested in wilderness medicine',
      wellnessInterests: ['Stress Management', 'Sleep'],
      generalInterests: ['Cooking', 'Travel'],
    },
    {
      id: 'sample-member-3',
      name: 'Emily K.',
      role: 'MS2',
      school: 'Duke',
      specialty: 'Undecided',
      joinedVillageAt: oneMonthAgo.toISOString(),
      pointsContributed: 1800,
      currentStreak: 7,
      isOnline: true,
      lastActiveAt: now.toISOString(),
      bio: 'Finding my path in medicine',
      wellnessInterests: ['Emotional', 'Social'],
      generalInterests: ['Music', 'Yoga'],
    },
    {
      id: 'sample-member-4',
      name: 'Alex T.',
      role: 'MS4',
      school: 'Stanford',
      specialty: 'Pediatrics',
      joinedVillageAt: twoMonthsAgo.toISOString(),
      pointsContributed: 2100,
      currentStreak: 12,
      isOnline: false,
      lastActiveAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      bio: 'Match season survivor, happy to help!',
      wellnessInterests: ['Work-Life Balance', 'Physical'],
      generalInterests: ['Running', 'Board Games'],
    },
  ];
}
