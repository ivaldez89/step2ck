// Tribes - Group communities for TribeWellMD
// Distinct from 1:1 Connections - Tribes are groups with shared identity,
// collective goals, and social impact missions.

export type TribeType = 'study' | 'specialty' | 'wellness' | 'cause';

export type TribeVisibility = 'public' | 'private';

export type TribeMemberRole = 'founder' | 'moderator' | 'member';

export type TribeMembershipStatus = 'active' | 'invited' | 'requested';

export type SocialCause =
  | 'red-cross'
  | 'animal-shelter'
  | 'environment'
  | 'education'
  | 'healthcare'
  | 'community';

export type TribeMessageType = 'message' | 'system' | 'achievement';

// Core Tribe interface
export interface Tribe {
  id: string;
  name: string;
  description: string;
  mission: string;                    // Social impact goal statement
  type: TribeType;
  visibility: TribeVisibility;
  icon: string;                       // Emoji or icon key
  color: string;                      // Tailwind gradient class

  // Social Impact Goal
  currentGoal: SocialImpactGoal | null;

  // Membership
  founderId: string;
  memberCount: number;
  maxMembers: number;                 // Default 50

  // Stats
  totalPoints: number;
  weeklyPoints: number;
  rank: number;                       // Global leaderboard position

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Member of a tribe
export interface TribeMember {
  id: string;
  oderId: string;                     // User ID (keeping typo from plan for consistency)
  odername: string;                   // Username (keeping typo from plan for consistency)
  firstName: string;
  lastName: string;
  avatar?: string;
  role: TribeMemberRole;
  joinedAt: string;
  contributionPoints: number;         // Points contributed to tribe
  weeklyContribution: number;
  isOnline: boolean;
}

// Social impact goal that tribes work toward
export interface SocialImpactGoal {
  id: string;
  title: string;                      // "Beach Cleanup Drive"
  description: string;
  cause: SocialCause;
  targetPoints: number;
  currentPoints: number;
  deadline: string;
  reward: string;                     // Badge or achievement unlocked
  completedAt?: string;
}

// Message in tribe chat
export interface TribeMessage {
  id: string;
  tribeId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: TribeMessageType;
}

// User's membership in a tribe
export interface TribeMembership {
  oderId: string;                     // User ID
  tribeId: string;
  role: TribeMemberRole;
  joinedAt: string;
  contributionPoints: number;
  status: TribeMembershipStatus;
  isPrimary: boolean;                 // Points go to primary tribe only
}

// Create tribe form data
export interface CreateTribeData {
  name: string;
  description: string;
  mission: string;
  type: TribeType;
  visibility: TribeVisibility;
  icon: string;
  color: string;
  goalTitle?: string;
  goalDescription?: string;
  goalCause?: SocialCause;
  goalTargetPoints?: number;
}

// Tribe with full member list (for tribe detail page)
export interface TribeWithMembers extends Tribe {
  members: TribeMember[];
}

// Filter options for tribe discovery
export interface TribeFilter {
  search: string;
  types: TribeType[];
  causes: SocialCause[];
  visibility: TribeVisibility | 'all';
  sortBy: 'popular' | 'newest' | 'points' | 'alphabetical';
}

// User's tribe-related stats
export interface UserTribeStats {
  totalTribes: number;
  primaryTribeId: string | null;
  totalContributionPoints: number;
  weeklyContributionPoints: number;
  completedGoals: number;
  badges: string[];
}
