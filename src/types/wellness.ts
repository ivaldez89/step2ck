// TribeWellz Wellness Types - Based on the original vision

export type WellnessDomain =
  | 'mindfulness'
  | 'stress-management'
  | 'sleep'
  | 'physical-fitness'
  | 'nutrition'
  | 'social-connection'
  | 'work-life-balance';

export type VillageType =
  | 'rotation' // Same clinical rotation
  | 'specialty' // Same specialty interest
  | 'wellness' // Same wellness goals
  | 'cause'; // Same charitable cause

export type CharitableCause =
  | 'mental-health-awareness'
  | 'healthcare-access'
  | 'medical-education'
  | 'physician-wellness'
  | 'community-health';

export interface WellnessJourney {
  id: string;
  domain: WellnessDomain;
  startedAt: string;
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedModules: string[];
  currentModule: string | null;
  milestones: WellnessMilestone[];
}

export interface WellnessMilestone {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  villagePointsReward: number;
  unlockedAt: string | null;
  icon: string;
}

export interface VillagePoints {
  total: number;
  donated: number;
  available: number;
  history: VillagePointTransaction[];
}

export interface VillagePointTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'donated' | 'bonus';
  source: string;
  timestamp: string;
  causeId?: string;
}

export interface Village {
  id: string;
  name: string;
  type: VillageType;
  description: string;
  members: VillageMember[];
  memberCount: number;
  cause: CharitableCause | null;
  totalDonated: number;
  weeklyGoal: number;
  weeklyProgress: number;
  createdAt: string;
  icon: string;
  color: string;
}

export interface VillageMember {
  id: string;
  name: string;
  avatar: string;
  role: 'founder' | 'moderator' | 'member';
  joinedAt: string;
  villagePoints: number;
  streak: number;
  isOnline: boolean;
}

export interface UserWellnessProfile {
  id: string;
  villagePoints: VillagePoints;
  activeJourneys: WellnessJourney[];
  villages: string[]; // Village IDs
  preferredCause: CharitableCause | null;
  weeklyGoal: {
    minutes: number;
    completed: number;
  };
  achievements: Achievement[];
  socialSkillsProgress: SocialSkillsProgress;
  lastCheckIn: string | null;
  moodHistory: MoodEntry[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  xpReward: number;
}

export interface SocialSkillsProgress {
  currentModule: string | null;
  completedModules: string[];
  skillLevels: {
    communication: number;
    boundaries: number;
    empathy: number;
    conflict: number;
    support: number;
  };
}

export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags: string[];
}

export interface WellnessModule {
  id: string;
  domain: WellnessDomain;
  title: string;
  description: string;
  duration: number; // minutes
  xpReward: number;
  villagePointsReward: number;
  type: 'lesson' | 'exercise' | 'reflection' | 'challenge';
  content: WellnessContent[];
  prerequisites: string[];
  order: number;
}

export interface WellnessContent {
  type: 'text' | 'video' | 'audio' | 'interactive' | 'checklist';
  title: string;
  content: string;
  duration?: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  domain: WellnessDomain;
  xpReward: number;
  villagePointsReward: number;
  completed: boolean;
  expiresAt: string;
}

// Domain metadata
export const WELLNESS_DOMAINS: Record<WellnessDomain, {
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}> = {
  'mindfulness': {
    title: 'Mindfulness',
    description: 'Cultivate present-moment awareness and inner peace',
    icon: 'Meditation',
    color: 'purple',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'stress-management': {
    title: 'Stress Management',
    description: 'Build resilience and healthy coping strategies',
    icon: 'Wave',
    color: 'blue',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'sleep': {
    title: 'Sleep Optimization',
    description: 'Improve sleep quality and establish healthy routines',
    icon: 'Moon',
    color: 'indigo',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'physical-fitness': {
    title: 'Physical Wellness',
    description: 'Stay active with quick, effective workouts',
    icon: 'Running',
    color: 'orange',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'nutrition': {
    title: 'Nutrition',
    description: 'Fuel your body and mind with smart eating habits',
    icon: 'Leaf',
    color: 'green',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'social-connection': {
    title: 'Social Connection',
    description: 'Build and maintain meaningful relationships',
    icon: 'Users',
    color: 'pink',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  },
  'work-life-balance': {
    title: 'Work-Life Balance',
    description: 'Set boundaries and protect your personal time',
    icon: 'Shield',
    color: 'teal',
    gradient: 'from-[#D4C4B0] to-[#C4A77D]'
  }
};

export const CHARITABLE_CAUSES: Record<CharitableCause, {
  title: string;
  description: string;
  icon: string;
  organization: string;
}> = {
  'mental-health-awareness': {
    title: 'Mental Health Awareness',
    description: 'Support mental health education and destigmatization',
    icon: 'Heart',
    organization: 'NAMI'
  },
  'healthcare-access': {
    title: 'Healthcare Access',
    description: 'Provide healthcare to underserved communities',
    icon: 'Hospital',
    organization: 'Remote Area Medical'
  },
  'medical-education': {
    title: 'Medical Education',
    description: 'Support scholarships for future physicians',
    icon: 'GraduationCap',
    organization: 'SNMA'
  },
  'physician-wellness': {
    title: 'Physician Wellness',
    description: 'Support programs addressing physician burnout',
    icon: 'HeartHand',
    organization: 'Dr. Lorna Breen Heroes Foundation'
  },
  'community-health': {
    title: 'Community Health',
    description: 'Fund community health initiatives',
    icon: 'Globe',
    organization: 'Partners in Health'
  }
};
