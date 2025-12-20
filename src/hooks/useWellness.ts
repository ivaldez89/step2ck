'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  UserWellnessProfile,
  WellnessJourney,
  WellnessDomain,
  Village,
  VillagePoints,
  MoodEntry,
  DailyChallenge,
  CharitableCause,
  Achievement,
  WELLNESS_DOMAINS
} from '@/types/wellness';

const WELLNESS_STORAGE_KEY = 'tribewellmd_wellness_profile';
const VILLAGES_STORAGE_KEY = 'tribewellmd_villages';

// Calculate XP needed for each level (exponential growth)
const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Default wellness profile
const createDefaultProfile = (): UserWellnessProfile => ({
  id: `user-${Date.now()}`,
  villagePoints: {
    total: 0,
    donated: 0,
    available: 0,
    history: []
  },
  activeJourneys: [],
  villages: [],
  preferredCause: null,
  weeklyGoal: {
    minutes: 60,
    completed: 0
  },
  achievements: [],
  socialSkillsProgress: {
    currentModule: null,
    completedModules: [],
    skillLevels: {
      communication: 0,
      boundaries: 0,
      empathy: 0,
      conflict: 0,
      support: 0
    }
  },
  lastCheckIn: null,
  moodHistory: []
});

// Sample villages for the community
const createSampleVillages = (): Village[] => [
  {
    id: 'village-im-wellness',
    name: 'Internal Medicine Wellness',
    type: 'rotation',
    description: 'Supporting each other through the IM rotation grind',
    members: [
      { id: '1', name: 'Sarah M.', avatar: '👩‍⚕️', role: 'founder', joinedAt: '2024-01-01', villagePoints: 450, streak: 12, isOnline: true },
      { id: '2', name: 'James K.', avatar: '👨‍⚕️', role: 'moderator', joinedAt: '2024-01-15', villagePoints: 380, streak: 8, isOnline: false },
      { id: '3', name: 'Emily R.', avatar: '👩‍⚕️', role: 'member', joinedAt: '2024-02-01', villagePoints: 220, streak: 5, isOnline: true },
    ],
    memberCount: 24,
    cause: 'physician-wellness',
    totalDonated: 1250,
    weeklyGoal: 500,
    weeklyProgress: 380,
    createdAt: '2024-01-01',
    icon: '🏥',
    color: 'blue'
  },
  {
    id: 'village-mindful-medics',
    name: 'Mindful Medics',
    type: 'wellness',
    description: 'Daily mindfulness and meditation practice for busy med students',
    members: [
      { id: '4', name: 'Alex T.', avatar: '🧘', role: 'founder', joinedAt: '2024-01-01', villagePoints: 680, streak: 21, isOnline: true },
      { id: '5', name: 'Priya S.', avatar: '👩‍⚕️', role: 'member', joinedAt: '2024-01-20', villagePoints: 340, streak: 14, isOnline: true },
    ],
    memberCount: 42,
    cause: 'mental-health-awareness',
    totalDonated: 2100,
    weeklyGoal: 600,
    weeklyProgress: 520,
    createdAt: '2024-01-01',
    icon: '🧘',
    color: 'purple'
  },
  {
    id: 'village-sleep-squad',
    name: 'Sleep Squad',
    type: 'wellness',
    description: 'Prioritizing rest and recovery together',
    members: [],
    memberCount: 18,
    cause: 'physician-wellness',
    totalDonated: 450,
    weeklyGoal: 300,
    weeklyProgress: 180,
    createdAt: '2024-02-01',
    icon: '😴',
    color: 'indigo'
  },
  {
    id: 'village-neuro-nerds',
    name: 'Neuro Enthusiasts',
    type: 'specialty',
    description: 'Future neurologists supporting each other',
    members: [],
    memberCount: 15,
    cause: 'medical-education',
    totalDonated: 890,
    weeklyGoal: 400,
    weeklyProgress: 290,
    createdAt: '2024-01-15',
    icon: '🧠',
    color: 'pink'
  }
];

// Daily challenges pool
const DAILY_CHALLENGES: Omit<DailyChallenge, 'id' | 'completed' | 'expiresAt'>[] = [
  { title: '5-Minute Breathing', description: 'Complete a 5-minute breathing exercise', domain: 'mindfulness', xpReward: 25, villagePointsReward: 5 },
  { title: 'Gratitude Journal', description: 'Write 3 things you\'re grateful for', domain: 'mindfulness', xpReward: 20, villagePointsReward: 5 },
  { title: 'Tech-Free Lunch', description: 'Eat one meal without screens', domain: 'stress-management', xpReward: 30, villagePointsReward: 8 },
  { title: 'Walking Break', description: 'Take a 10-minute walk between study sessions', domain: 'physical-fitness', xpReward: 25, villagePointsReward: 5 },
  { title: 'Hydration Hero', description: 'Drink 8 glasses of water today', domain: 'nutrition', xpReward: 20, villagePointsReward: 5 },
  { title: 'Sleep Routine', description: 'Be in bed by your target time', domain: 'sleep', xpReward: 30, villagePointsReward: 8 },
  { title: 'Connect & Check-In', description: 'Reach out to a friend or family member', domain: 'social-connection', xpReward: 35, villagePointsReward: 10 },
  { title: 'Boundary Setting', description: 'Say no to one non-essential commitment', domain: 'work-life-balance', xpReward: 40, villagePointsReward: 12 },
];

export function useWellness() {
  const [profile, setProfile] = useState<UserWellnessProfile | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem(WELLNESS_STORAGE_KEY);
      const savedVillages = localStorage.getItem(VILLAGES_STORAGE_KEY);

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile(createDefaultProfile());
      }

      if (savedVillages) {
        setVillages(JSON.parse(savedVillages));
      } else {
        const sampleVillages = createSampleVillages();
        setVillages(sampleVillages);
        localStorage.setItem(VILLAGES_STORAGE_KEY, JSON.stringify(sampleVillages));
      }

      // Generate daily challenges
      generateDailyChallenges();

      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    if (profile && typeof window !== 'undefined') {
      localStorage.setItem(WELLNESS_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Generate daily challenges
  const generateDailyChallenges = useCallback(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Pick 3 random challenges
    const shuffled = [...DAILY_CHALLENGES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).map((challenge, index) => ({
      ...challenge,
      id: `challenge-${Date.now()}-${index}`,
      completed: false,
      expiresAt: today.toISOString()
    }));

    setDailyChallenges(selected);
  }, []);

  // Start a wellness journey
  const startJourney = useCallback((domain: WellnessDomain) => {
    if (!profile) return;

    const existingJourney = profile.activeJourneys.find(j => j.domain === domain);
    if (existingJourney) return; // Already on this journey

    const newJourney: WellnessJourney = {
      id: `journey-${domain}-${Date.now()}`,
      domain,
      startedAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: getXPForLevel(1),
      completedModules: [],
      currentModule: `${domain}-intro`,
      milestones: []
    };

    setProfile(prev => prev ? {
      ...prev,
      activeJourneys: [...prev.activeJourneys, newJourney]
    } : prev);
  }, [profile]);

  // Earn XP and village points
  const earnRewards = useCallback((xp: number, villagePoints: number, source: string) => {
    if (!profile) return;

    setProfile(prev => {
      if (!prev) return prev;

      const newVillagePoints: VillagePoints = {
        ...prev.villagePoints,
        total: prev.villagePoints.total + villagePoints,
        available: prev.villagePoints.available + villagePoints,
        history: [
          {
            id: `tx-${Date.now()}`,
            amount: villagePoints,
            type: 'earned',
            source,
            timestamp: new Date().toISOString()
          },
          ...prev.villagePoints.history.slice(0, 49) // Keep last 50
        ]
      };

      // Update journey XP if applicable
      const updatedJourneys = prev.activeJourneys.map(journey => {
        const newXP = journey.xp + xp;
        let newLevel = journey.level;
        let xpToNext = journey.xpToNextLevel;

        // Level up check
        while (newXP >= xpToNext) {
          newLevel++;
          xpToNext = getXPForLevel(newLevel);
        }

        return {
          ...journey,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: xpToNext
        };
      });

      return {
        ...prev,
        villagePoints: newVillagePoints,
        activeJourneys: updatedJourneys
      };
    });
  }, [profile]);

  // Complete a daily challenge
  const completeChallenge = useCallback((challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setDailyChallenges(prev =>
      prev.map(c => c.id === challengeId ? { ...c, completed: true } : c)
    );

    earnRewards(challenge.xpReward, challenge.villagePointsReward, `Daily Challenge: ${challenge.title}`);
  }, [dailyChallenges, earnRewards]);

  // Log mood
  const logMood = useCallback((mood: 1|2|3|4|5, energy: 1|2|3|4|5, stress: 1|2|3|4|5, notes?: string, tags?: string[]) => {
    if (!profile) return;

    const entry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      energy,
      stress,
      notes,
      tags: tags || []
    };

    setProfile(prev => prev ? {
      ...prev,
      moodHistory: [entry, ...prev.moodHistory.slice(0, 29)], // Keep last 30
      lastCheckIn: entry.timestamp
    } : prev);

    // Reward for check-in
    earnRewards(10, 2, 'Daily Check-In');
  }, [profile, earnRewards]);

  // Donate village points
  const donatePoints = useCallback((amount: number, causeId: CharitableCause) => {
    if (!profile || profile.villagePoints.available < amount) return;

    setProfile(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        villagePoints: {
          ...prev.villagePoints,
          donated: prev.villagePoints.donated + amount,
          available: prev.villagePoints.available - amount,
          history: [
            {
              id: `tx-${Date.now()}`,
              amount: -amount,
              type: 'donated',
              source: `Donated to ${causeId}`,
              timestamp: new Date().toISOString(),
              causeId
            },
            ...prev.villagePoints.history.slice(0, 49)
          ]
        },
        preferredCause: causeId
      };
    });
  }, [profile]);

  // Join a village
  const joinVillage = useCallback((villageId: string) => {
    if (!profile) return;

    if (profile.villages.includes(villageId)) return;

    setProfile(prev => prev ? {
      ...prev,
      villages: [...prev.villages, villageId]
    } : prev);

    // Update village member count
    setVillages(prev =>
      prev.map(v => v.id === villageId ? { ...v, memberCount: v.memberCount + 1 } : v)
    );
  }, [profile]);

  // Get user's villages
  const getUserVillages = useCallback(() => {
    if (!profile) return [];
    return villages.filter(v => profile.villages.includes(v.id));
  }, [profile, villages]);

  // Get stats
  const getStats = useCallback(() => {
    if (!profile) return null;

    const totalXP = profile.activeJourneys.reduce((sum, j) => sum + j.xp, 0);
    const highestStreak = Math.max(...profile.activeJourneys.map(j => j.longestStreak), 0);
    const completedChallenges = dailyChallenges.filter(c => c.completed).length;

    return {
      totalXP,
      villagePoints: profile.villagePoints.total,
      donated: profile.villagePoints.donated,
      activeJourneys: profile.activeJourneys.length,
      highestStreak,
      achievements: profile.achievements.length,
      completedChallenges,
      totalChallenges: dailyChallenges.length
    };
  }, [profile, dailyChallenges]);

  return {
    profile,
    villages,
    dailyChallenges,
    isLoading,
    startJourney,
    earnRewards,
    completeChallenge,
    logMood,
    donatePoints,
    joinVillage,
    getUserVillages,
    getStats
  };
}
