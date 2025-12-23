// Tribe Storage - localStorage CRUD for Tribes feature
// Follows same patterns as chatStorage.ts

import type {
  Tribe,
  TribeMember,
  TribeMessage,
  TribeMembership,
  SocialImpactGoal,
  TribeWithMembers,
  CreateTribeData,
  TribeFilter,
  UserTribeStats,
  TribeMemberRole,
} from '@/types/tribes';

// Storage keys with tribewellmd_ prefix
const TRIBES_KEY = 'tribewellmd_tribes';
const TRIBE_MEMBERS_KEY = 'tribewellmd_tribe_members';
const TRIBE_MESSAGES_KEY = 'tribewellmd_tribe_messages';
const TRIBE_MEMBERSHIPS_KEY = 'tribewellmd_tribe_memberships';
const USER_TRIBE_STATS_KEY = 'tribewellmd_user_tribe_stats';

// Max tribes a user can belong to
export const MAX_TRIBES_PER_USER = 5;

// ============================================
// TRIBES CRUD
// ============================================

export function getTribes(): Tribe[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TRIBES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with demo tribes
    const demoTribes = createDemoTribes();
    saveTribes(demoTribes);
    return demoTribes;
  } catch (error) {
    console.error('Error loading tribes:', error);
    return [];
  }
}

export function saveTribes(tribes: Tribe[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TRIBES_KEY, JSON.stringify(tribes));
  } catch (error) {
    console.error('Error saving tribes:', error);
  }
}

export function getTribe(tribeId: string): Tribe | null {
  const tribes = getTribes();
  return tribes.find(t => t.id === tribeId) || null;
}

export function getTribeWithMembers(tribeId: string): TribeWithMembers | null {
  const tribe = getTribe(tribeId);
  if (!tribe) return null;

  const members = getTribeMembers(tribeId);
  return { ...tribe, members };
}

export function createTribe(data: CreateTribeData, founderId: string = 'current-user'): Tribe {
  const now = new Date().toISOString();

  const goal: SocialImpactGoal | null = data.goalTitle
    ? {
        id: crypto.randomUUID(),
        title: data.goalTitle,
        description: data.goalDescription || '',
        cause: data.goalCause || 'community',
        targetPoints: data.goalTargetPoints || 5000,
        currentPoints: 0,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        reward: `${data.goalTitle} Champion`,
      }
    : null;

  const tribe: Tribe = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    mission: data.mission,
    type: data.type,
    visibility: data.visibility,
    icon: data.icon,
    color: data.color,
    currentGoal: goal,
    founderId,
    memberCount: 1,
    maxMembers: 50,
    totalPoints: 0,
    weeklyPoints: 0,
    rank: 0,
    createdAt: now,
    updatedAt: now,
  };

  const tribes = getTribes();
  tribes.push(tribe);
  saveTribes(tribes);

  // Add founder as first member
  addTribeMember(tribe.id, founderId, 'founder');

  // Create membership
  addMembership(founderId, tribe.id, 'founder', true);

  return tribe;
}

export function updateTribe(tribeId: string, updates: Partial<Tribe>): Tribe | null {
  const tribes = getTribes();
  const index = tribes.findIndex(t => t.id === tribeId);
  if (index === -1) return null;

  tribes[index] = {
    ...tribes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTribes(tribes);
  return tribes[index];
}

export function deleteTribe(tribeId: string): void {
  const tribes = getTribes();
  saveTribes(tribes.filter(t => t.id !== tribeId));

  // Clean up related data
  const members = getAllTribeMembers().filter(m => m.id.split('-')[0] !== tribeId);
  saveTribeMembers(members);

  const messages = getAllTribeMessages().filter(m => m.tribeId !== tribeId);
  saveTribeMessages(messages);

  const memberships = getAllMemberships().filter(m => m.tribeId !== tribeId);
  saveMemberships(memberships);
}

// ============================================
// TRIBE MEMBERS CRUD
// ============================================

function getAllTribeMembers(): TribeMember[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TRIBE_MEMBERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const demoMembers = createDemoMembers();
    saveTribeMembers(demoMembers);
    return demoMembers;
  } catch (error) {
    console.error('Error loading tribe members:', error);
    return [];
  }
}

function saveTribeMembers(members: TribeMember[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TRIBE_MEMBERS_KEY, JSON.stringify(members));
  } catch (error) {
    console.error('Error saving tribe members:', error);
  }
}

export function getTribeMembers(tribeId: string): TribeMember[] {
  const allMembers = getAllTribeMembers();
  return allMembers.filter(m => m.id.startsWith(`${tribeId}-`));
}

export function addTribeMember(
  tribeId: string,
  userId: string,
  role: TribeMemberRole = 'member',
  userData?: { firstName: string; lastName: string; avatar?: string }
): TribeMember {
  const now = new Date().toISOString();

  const member: TribeMember = {
    id: `${tribeId}-${userId}`,
    oderId: userId,
    odername: userData?.firstName || 'User',
    firstName: userData?.firstName || 'User',
    lastName: userData?.lastName || '',
    avatar: userData?.avatar,
    role,
    joinedAt: now,
    contributionPoints: 0,
    weeklyContribution: 0,
    isOnline: userId === 'current-user',
  };

  const allMembers = getAllTribeMembers();
  allMembers.push(member);
  saveTribeMembers(allMembers);

  // Update tribe member count
  const tribe = getTribe(tribeId);
  if (tribe) {
    updateTribe(tribeId, { memberCount: tribe.memberCount + 1 });
  }

  return member;
}

export function removeTribeMember(tribeId: string, userId: string): void {
  const allMembers = getAllTribeMembers();
  const memberId = `${tribeId}-${userId}`;
  saveTribeMembers(allMembers.filter(m => m.id !== memberId));

  // Update tribe member count
  const tribe = getTribe(tribeId);
  if (tribe && tribe.memberCount > 0) {
    updateTribe(tribeId, { memberCount: tribe.memberCount - 1 });
  }

  // Remove membership
  removeMembership(userId, tribeId);
}

export function updateTribeMemberRole(
  tribeId: string,
  userId: string,
  role: TribeMemberRole
): void {
  const allMembers = getAllTribeMembers();
  const memberId = `${tribeId}-${userId}`;
  const index = allMembers.findIndex(m => m.id === memberId);

  if (index !== -1) {
    allMembers[index].role = role;
    saveTribeMembers(allMembers);
  }
}

export function addPointsToMember(
  tribeId: string,
  userId: string,
  points: number
): void {
  const allMembers = getAllTribeMembers();
  const memberId = `${tribeId}-${userId}`;
  const index = allMembers.findIndex(m => m.id === memberId);

  if (index !== -1) {
    allMembers[index].contributionPoints += points;
    allMembers[index].weeklyContribution += points;
    saveTribeMembers(allMembers);
  }

  // Also update tribe total points
  const tribe = getTribe(tribeId);
  if (tribe) {
    const newTotal = tribe.totalPoints + points;
    const newWeekly = tribe.weeklyPoints + points;

    // Update goal progress if exists
    let updatedGoal = tribe.currentGoal;
    if (updatedGoal && !updatedGoal.completedAt) {
      updatedGoal = {
        ...updatedGoal,
        currentPoints: updatedGoal.currentPoints + points,
      };

      // Check if goal is completed
      if (updatedGoal.currentPoints >= updatedGoal.targetPoints) {
        updatedGoal.completedAt = new Date().toISOString();
      }
    }

    updateTribe(tribeId, {
      totalPoints: newTotal,
      weeklyPoints: newWeekly,
      currentGoal: updatedGoal,
    });
  }
}

// ============================================
// TRIBE MESSAGES (CHAT)
// ============================================

function getAllTribeMessages(): TribeMessage[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TRIBE_MESSAGES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const demoMessages = createDemoTribeMessages();
    saveTribeMessages(demoMessages);
    return demoMessages;
  } catch (error) {
    console.error('Error loading tribe messages:', error);
    return [];
  }
}

function saveTribeMessages(messages: TribeMessage[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TRIBE_MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving tribe messages:', error);
  }
}

export function getTribeMessages(tribeId: string): TribeMessage[] {
  const allMessages = getAllTribeMessages();
  return allMessages
    .filter(m => m.tribeId === tribeId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function sendTribeMessage(
  tribeId: string,
  content: string,
  senderId: string = 'current-user',
  senderName: string = 'You',
  type: TribeMessage['type'] = 'message'
): TribeMessage {
  const message: TribeMessage = {
    id: crypto.randomUUID(),
    tribeId,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    type,
  };

  const allMessages = getAllTribeMessages();
  allMessages.push(message);
  saveTribeMessages(allMessages);

  return message;
}

// ============================================
// MEMBERSHIPS (User's tribe memberships)
// ============================================

function getAllMemberships(): TribeMembership[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TRIBE_MEMBERSHIPS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const demoMemberships = createDemoMemberships();
    saveMemberships(demoMemberships);
    return demoMemberships;
  } catch (error) {
    console.error('Error loading memberships:', error);
    return [];
  }
}

function saveMemberships(memberships: TribeMembership[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TRIBE_MEMBERSHIPS_KEY, JSON.stringify(memberships));
  } catch (error) {
    console.error('Error saving memberships:', error);
  }
}

export function getUserMemberships(userId: string = 'current-user'): TribeMembership[] {
  const allMemberships = getAllMemberships();
  return allMemberships.filter(m => m.oderId === userId && m.status === 'active');
}

export function getUserTribes(userId: string = 'current-user'): Tribe[] {
  const memberships = getUserMemberships(userId);
  const tribes = getTribes();
  return tribes.filter(t => memberships.some(m => m.tribeId === t.id));
}

export function getPrimaryTribe(userId: string = 'current-user'): Tribe | null {
  const memberships = getUserMemberships(userId);
  const primary = memberships.find(m => m.isPrimary);
  if (!primary) return null;
  return getTribe(primary.tribeId);
}

export function setPrimaryTribe(userId: string, tribeId: string): void {
  const allMemberships = getAllMemberships();

  // Clear previous primary
  allMemberships.forEach(m => {
    if (m.oderId === userId) {
      m.isPrimary = m.tribeId === tribeId;
    }
  });

  saveMemberships(allMemberships);
}

export function addMembership(
  userId: string,
  tribeId: string,
  role: TribeMemberRole = 'member',
  isPrimary: boolean = false
): TribeMembership {
  const membership: TribeMembership = {
    oderId: userId,
    tribeId,
    role,
    joinedAt: new Date().toISOString(),
    contributionPoints: 0,
    status: 'active',
    isPrimary,
  };

  const allMemberships = getAllMemberships();
  allMemberships.push(membership);
  saveMemberships(allMemberships);

  return membership;
}

export function removeMembership(userId: string, tribeId: string): void {
  const allMemberships = getAllMemberships();
  saveMemberships(
    allMemberships.filter(m => !(m.oderId === userId && m.tribeId === tribeId))
  );
}

export function isMemberOf(tribeId: string, userId: string = 'current-user'): boolean {
  const memberships = getUserMemberships(userId);
  return memberships.some(m => m.tribeId === tribeId);
}

export function canJoinMoreTribes(userId: string = 'current-user'): boolean {
  const memberships = getUserMemberships(userId);
  return memberships.length < MAX_TRIBES_PER_USER;
}

// ============================================
// USER TRIBE STATS
// ============================================

export function getUserTribeStats(userId: string = 'current-user'): UserTribeStats {
  if (typeof window === 'undefined') {
    return {
      totalTribes: 0,
      primaryTribeId: null,
      totalContributionPoints: 0,
      weeklyContributionPoints: 0,
      completedGoals: 0,
      badges: [],
    };
  }

  try {
    const stored = localStorage.getItem(`${USER_TRIBE_STATS_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // Calculate from memberships
    const memberships = getUserMemberships(userId);
    const primary = memberships.find(m => m.isPrimary);

    const stats: UserTribeStats = {
      totalTribes: memberships.length,
      primaryTribeId: primary?.tribeId || null,
      totalContributionPoints: memberships.reduce((sum, m) => sum + m.contributionPoints, 0),
      weeklyContributionPoints: 0,
      completedGoals: 0,
      badges: [],
    };

    saveUserTribeStats(userId, stats);
    return stats;
  } catch (error) {
    console.error('Error loading user tribe stats:', error);
    return {
      totalTribes: 0,
      primaryTribeId: null,
      totalContributionPoints: 0,
      weeklyContributionPoints: 0,
      completedGoals: 0,
      badges: [],
    };
  }
}

export function saveUserTribeStats(userId: string, stats: UserTribeStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${USER_TRIBE_STATS_KEY}_${userId}`, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user tribe stats:', error);
  }
}

// ============================================
// FILTERING & SEARCH
// ============================================

export function filterTribes(filter: TribeFilter): Tribe[] {
  let tribes = getTribes();

  // Only show public tribes (private tribes only visible to members)
  if (filter.visibility === 'all' || !filter.visibility) {
    tribes = tribes.filter(t => t.visibility === 'public');
  } else {
    tribes = tribes.filter(t => t.visibility === filter.visibility);
  }

  // Search by name or description
  if (filter.search) {
    const search = filter.search.toLowerCase();
    tribes = tribes.filter(
      t =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.mission.toLowerCase().includes(search)
    );
  }

  // Filter by type
  if (filter.types && filter.types.length > 0) {
    tribes = tribes.filter(t => filter.types.includes(t.type));
  }

  // Filter by cause
  if (filter.causes && filter.causes.length > 0) {
    tribes = tribes.filter(
      t => t.currentGoal && filter.causes.includes(t.currentGoal.cause)
    );
  }

  // Sort
  switch (filter.sortBy) {
    case 'popular':
      tribes.sort((a, b) => b.memberCount - a.memberCount);
      break;
    case 'newest':
      tribes.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'points':
      tribes.sort((a, b) => b.totalPoints - a.totalPoints);
      break;
    case 'alphabetical':
      tribes.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return tribes;
}

export function getPublicTribes(): Tribe[] {
  return getTribes().filter(t => t.visibility === 'public');
}

export function getTribeLeaderboard(): Tribe[] {
  return getPublicTribes()
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);
}

// ============================================
// JOIN / LEAVE TRIBE
// ============================================

export function joinTribe(
  tribeId: string,
  userId: string = 'current-user',
  userData?: { firstName: string; lastName: string; avatar?: string }
): { success: boolean; error?: string } {
  // Check if user can join more tribes
  if (!canJoinMoreTribes(userId)) {
    return {
      success: false,
      error: `You can only be a member of ${MAX_TRIBES_PER_USER} tribes`,
    };
  }

  // Check if already a member
  if (isMemberOf(tribeId, userId)) {
    return { success: false, error: 'Already a member of this tribe' };
  }

  // Check if tribe exists and has room
  const tribe = getTribe(tribeId);
  if (!tribe) {
    return { success: false, error: 'Tribe not found' };
  }

  if (tribe.memberCount >= tribe.maxMembers) {
    return { success: false, error: 'Tribe is full' };
  }

  // Add member
  addTribeMember(tribeId, userId, 'member', userData);

  // Add membership (set as primary if first tribe)
  const existingMemberships = getUserMemberships(userId);
  const isPrimary = existingMemberships.length === 0;
  addMembership(userId, tribeId, 'member', isPrimary);

  // Send system message
  sendTribeMessage(
    tribeId,
    `${userData?.firstName || 'A new member'} joined the tribe!`,
    'system',
    'System',
    'system'
  );

  return { success: true };
}

export function leaveTribe(
  tribeId: string,
  userId: string = 'current-user'
): { success: boolean; error?: string } {
  const membership = getUserMemberships(userId).find(m => m.tribeId === tribeId);

  if (!membership) {
    return { success: false, error: 'Not a member of this tribe' };
  }

  // Founders cannot leave (must transfer ownership or delete tribe)
  if (membership.role === 'founder') {
    return { success: false, error: 'Founders cannot leave. Transfer ownership or delete the tribe.' };
  }

  // Remove member
  removeTribeMember(tribeId, userId);

  return { success: true };
}

// ============================================
// DEMO DATA
// ============================================

function createDemoTribes(): Tribe[] {
  const now = new Date();

  return [
    {
      id: 'tribe-ocean-guardians',
      name: 'Ocean Guardians',
      description: 'Medical students dedicated to environmental conservation and ocean protection.',
      mission: 'Organize beach cleanups and raise awareness about ocean health among the medical community.',
      type: 'cause',
      visibility: 'public',
      icon: '🌊',
      color: 'from-[#5B7B6D] to-[#3D5A4C]',
      currentGoal: {
        id: 'goal-beach-cleanup',
        title: 'Beach Cleanup Drive',
        description: 'Earn points to fund a community beach cleanup event',
        cause: 'environment',
        targetPoints: 5000,
        currentPoints: 3240,
        deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 'Ocean Guardian Badge',
      },
      founderId: 'demo-1',
      memberCount: 23,
      maxMembers: 50,
      totalPoints: 3240,
      weeklyPoints: 420,
      rank: 3,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tribe-future-surgeons',
      name: 'Future Surgeons',
      description: 'Aspiring surgeons sharing resources, tips, and supporting each other through surgical rotations.',
      mission: 'Build a supportive community for surgery-bound medical students and mentor the next generation.',
      type: 'specialty',
      visibility: 'public',
      icon: '🔪',
      color: 'from-[#8B7355] to-[#6B5344]',
      currentGoal: {
        id: 'goal-tutoring',
        title: 'Tutoring Initiative',
        description: 'Fund tutoring sessions for underrepresented pre-med students',
        cause: 'education',
        targetPoints: 7500,
        currentPoints: 5100,
        deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 'Mentor Champion Badge',
      },
      founderId: 'demo-2',
      memberCount: 45,
      maxMembers: 50,
      totalPoints: 8920,
      weeklyPoints: 890,
      rank: 1,
      createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'tribe-mindful-medics',
      name: 'Mindful Medics',
      description: 'A wellness-focused community promoting mental health, mindfulness, and work-life balance in medicine.',
      mission: 'Reduce burnout and promote wellness practices among medical students and residents.',
      type: 'wellness',
      visibility: 'public',
      icon: '🧘',
      color: 'from-[#6B8B7D] to-[#5B7B6D]',
      currentGoal: {
        id: 'goal-community-garden',
        title: 'Community Garden',
        description: 'Support a therapeutic community garden at the local hospital',
        cause: 'community',
        targetPoints: 4000,
        currentPoints: 2800,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 'Green Thumb Badge',
      },
      founderId: 'demo-5',
      memberCount: 18,
      maxMembers: 50,
      totalPoints: 4250,
      weeklyPoints: 320,
      rank: 2,
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tribe-im-study-squad',
      name: 'IM Study Squad',
      description: 'Internal Medicine enthusiasts preparing for shelf exams and Step 2 together.',
      mission: 'Collaborative learning and peer support for mastering internal medicine.',
      type: 'study',
      visibility: 'public',
      icon: '📚',
      color: 'from-[#A89070] to-[#8B7355]',
      currentGoal: {
        id: 'goal-red-cross',
        title: 'Red Cross Support',
        description: 'Contribute to Red Cross disaster relief efforts',
        cause: 'red-cross',
        targetPoints: 10000,
        currentPoints: 6500,
        deadline: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 'Lifesaver Badge',
      },
      founderId: 'demo-4',
      memberCount: 31,
      maxMembers: 50,
      totalPoints: 6500,
      weeklyPoints: 580,
      rank: 4,
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tribe-private-peds',
      name: 'Private Peds Group',
      description: 'An intimate group of pediatrics-focused students sharing resources and experiences.',
      mission: 'Create a safe space for discussing pediatric cases and supporting each other.',
      type: 'specialty',
      visibility: 'private',
      icon: '👶',
      color: 'from-[#C4A77D] to-[#A89070]',
      currentGoal: {
        id: 'goal-animal-shelter',
        title: 'Animal Shelter Week',
        description: 'Support the local animal shelter with supplies and volunteers',
        cause: 'animal-shelter',
        targetPoints: 3000,
        currentPoints: 1200,
        deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 'Paw Protector Badge',
      },
      founderId: 'demo-3',
      memberCount: 8,
      maxMembers: 15,
      totalPoints: 1200,
      weeklyPoints: 150,
      rank: 0, // Private tribes don't appear on leaderboard
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function createDemoMembers(): TribeMember[] {
  const now = new Date();

  // Sample members for demo tribes
  return [
    // Ocean Guardians members
    {
      id: 'tribe-ocean-guardians-demo-1',
      oderId: 'demo-1',
      odername: 'Sarah',
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'founder',
      joinedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 890,
      weeklyContribution: 120,
      isOnline: true,
    },
    {
      id: 'tribe-ocean-guardians-current-user',
      oderId: 'current-user',
      odername: 'You',
      firstName: 'You',
      lastName: '',
      role: 'member',
      joinedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 245,
      weeklyContribution: 85,
      isOnline: true,
    },
    {
      id: 'tribe-ocean-guardians-demo-4',
      oderId: 'demo-4',
      odername: 'James',
      firstName: 'James',
      lastName: 'Park',
      role: 'moderator',
      joinedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 720,
      weeklyContribution: 95,
      isOnline: true,
    },
    // Mindful Medics members
    {
      id: 'tribe-mindful-medics-demo-5',
      oderId: 'demo-5',
      odername: 'Amanda',
      firstName: 'Dr. Amanda',
      lastName: 'Foster',
      role: 'founder',
      joinedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 980,
      weeklyContribution: 110,
      isOnline: false,
    },
    {
      id: 'tribe-mindful-medics-current-user',
      oderId: 'current-user',
      odername: 'You',
      firstName: 'You',
      lastName: '',
      role: 'member',
      joinedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 180,
      weeklyContribution: 45,
      isOnline: true,
    },
    // Future Surgeons members
    {
      id: 'tribe-future-surgeons-demo-2',
      oderId: 'demo-2',
      odername: 'Marcus',
      firstName: 'Marcus',
      lastName: 'Williams',
      role: 'founder',
      joinedAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 1450,
      weeklyContribution: 180,
      isOnline: true,
    },
  ];
}

function createDemoMemberships(): TribeMembership[] {
  const now = new Date();

  // Current user is member of Ocean Guardians (primary) and Mindful Medics
  return [
    {
      oderId: 'current-user',
      tribeId: 'tribe-ocean-guardians',
      role: 'member',
      joinedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 245,
      status: 'active',
      isPrimary: true,
    },
    {
      oderId: 'current-user',
      tribeId: 'tribe-mindful-medics',
      role: 'member',
      joinedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      contributionPoints: 180,
      status: 'active',
      isPrimary: false,
    },
  ];
}

function createDemoTribeMessages(): TribeMessage[] {
  const now = new Date();

  return [
    // Ocean Guardians chat
    {
      id: 'msg-og-1',
      tribeId: 'tribe-ocean-guardians',
      senderId: 'demo-1',
      senderName: 'Sarah Chen',
      content: 'Welcome everyone! Excited to have such a great group committed to ocean conservation.',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'message',
    },
    {
      id: 'msg-og-2',
      tribeId: 'tribe-ocean-guardians',
      senderId: 'demo-4',
      senderName: 'James Park',
      content: 'Just finished a study session - 50 more points toward our beach cleanup goal!',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'message',
    },
    {
      id: 'msg-og-3',
      tribeId: 'tribe-ocean-guardians',
      senderId: 'system',
      senderName: 'System',
      content: 'Milestone reached! The tribe has earned 3,000 points toward the Beach Cleanup Drive goal.',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'achievement',
    },
    {
      id: 'msg-og-4',
      tribeId: 'tribe-ocean-guardians',
      senderId: 'current-user',
      senderName: 'You',
      content: 'Great progress everyone! Let\'s keep it up!',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'message',
    },
    // Mindful Medics chat
    {
      id: 'msg-mm-1',
      tribeId: 'tribe-mindful-medics',
      senderId: 'demo-5',
      senderName: 'Dr. Amanda Foster',
      content: 'Remember to take breaks during study sessions. Your mental health matters!',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'message',
    },
    {
      id: 'msg-mm-2',
      tribeId: 'tribe-mindful-medics',
      senderId: 'system',
      senderName: 'System',
      content: 'A new member joined the tribe!',
      timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'system',
    },
  ];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatTribeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getGoalProgress(goal: SocialImpactGoal): number {
  return Math.min(100, Math.round((goal.currentPoints / goal.targetPoints) * 100));
}

export function getCauseLabel(cause: SocialImpactGoal['cause']): string {
  const labels: Record<SocialImpactGoal['cause'], string> = {
    'red-cross': 'Red Cross',
    'animal-shelter': 'Animal Welfare',
    environment: 'Environment',
    education: 'Education',
    healthcare: 'Healthcare',
    community: 'Community',
  };
  return labels[cause] || cause;
}

export function getTypeLabel(type: Tribe['type']): string {
  const labels: Record<Tribe['type'], string> = {
    study: 'Study Group',
    specialty: 'Specialty',
    wellness: 'Wellness',
    cause: 'Social Cause',
  };
  return labels[type] || type;
}
