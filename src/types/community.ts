// Village Community Types

export interface VillagePost {
  id: string;
  villageId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string; // e.g., "MS2", "Resident", "Attending"
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  reactions: PostReaction[];
  commentCount: number;
  isPinned: boolean;
  postType: 'update' | 'motivation' | 'milestone' | 'question' | 'resource';
}

export interface PostReaction {
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: string;
}

export type ReactionType = 'like' | 'love' | 'celebrate' | 'support' | 'insightful';

export const REACTION_EMOJIS: Record<ReactionType, { emoji: string; label: string }> = {
  like: { emoji: '', label: 'Like' },
  love: { emoji: '', label: 'Love' },
  celebrate: { emoji: '', label: 'Celebrate' },
  support: { emoji: '', label: 'Support' },
  insightful: { emoji: '', label: 'Insightful' },
};

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  reactions: PostReaction[];
  parentCommentId?: string; // For threaded replies
}

export interface VillageMemberProfile {
  id: string;
  name: string;
  avatar?: string;
  role: string; // e.g., "MS2", "Resident"
  school?: string;
  specialty?: string;
  joinedVillageAt: string;
  pointsContributed: number;
  currentStreak: number;
  isOnline: boolean;
  lastActiveAt: string;
  bio?: string;
  // Connection matching fields
  wellnessInterests?: string[];
  generalInterests?: string[];
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage?: DirectMessage;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

export interface VillageCommunityStats {
  villageId: string;
  totalMembers: number;
  activeMembersToday: number;
  totalPosts: number;
  postsThisWeek: number;
  totalDonated: number;
  currentStreak: number; // Village-wide activity streak
}

export const POST_TYPE_LABELS: Record<VillagePost['postType'], { label: string; icon: string; color: string }> = {
  update: { label: 'Update', icon: 'MessageCircle', color: 'text-slate-600' },
  motivation: { label: 'Motivation', icon: 'Sparkles', color: 'text-yellow-600' },
  milestone: { label: 'Milestone', icon: 'Trophy', color: 'text-amber-600' },
  question: { label: 'Question', icon: 'HelpCircle', color: 'text-blue-600' },
  resource: { label: 'Resource', icon: 'BookOpen', color: 'text-green-600' },
};
