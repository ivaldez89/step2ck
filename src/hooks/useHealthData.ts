'use client';

import { useState, useEffect, useCallback } from 'react';

const HEALTH_STORAGE_KEY = 'tribewellmd_health_data';
const HEALTH_SYNC_KEY = 'tribewellmd_health_sync';

export interface HealthDataPoint {
  id: string;
  type: 'steps' | 'workout' | 'sleep' | 'heart_rate' | 'mindful_minutes';
  value: number;
  unit: string;
  date: string; // ISO date string
  source: 'apple_health' | 'google_fit' | 'manual' | 'fitbit' | 'garmin';
  verified: boolean;
  syncedAt: string;
}

export interface DailyHealthSummary {
  date: string;
  steps: number;
  stepsGoal: number;
  stepsVerified: boolean;
  workoutMinutes: number;
  workoutVerified: boolean;
  sleepHours: number;
  sleepVerified: boolean;
  mindfulMinutes: number;
  mindfulVerified: boolean;
  // Calculated village points from health activities
  villagePointsEarned: number;
}

export interface HealthSyncStatus {
  isConnected: boolean;
  provider: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | null;
  lastSync: string | null;
  error: string | null;
}

interface HealthDataState {
  history: HealthDataPoint[];
  syncStatus: HealthSyncStatus;
  dailySummaries: Record<string, DailyHealthSummary>;
}

const DEFAULT_STEPS_GOAL = 10000;

const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

const createDefaultState = (): HealthDataState => ({
  history: [],
  syncStatus: {
    isConnected: false,
    provider: null,
    lastSync: null,
    error: null
  },
  dailySummaries: {}
});

// Calculate village points based on health activities
// These are health-app verified (3x multiplier tier)
const calculateHealthVillagePoints = (summary: Partial<DailyHealthSummary>): number => {
  let points = 0;

  // Steps: 5 points for hitting 10k (verified)
  if (summary.steps && summary.steps >= 10000 && summary.stepsVerified) {
    points += 5;
  } else if (summary.steps && summary.steps >= 5000 && summary.stepsVerified) {
    // Partial credit for 5k steps
    points += 2;
  }

  // Workout: 8 points for 30+ minutes (verified)
  if (summary.workoutMinutes && summary.workoutMinutes >= 30 && summary.workoutVerified) {
    points += 8;
  } else if (summary.workoutMinutes && summary.workoutMinutes >= 15 && summary.workoutVerified) {
    points += 4;
  }

  // Sleep: 4 points for 7+ hours (verified)
  if (summary.sleepHours && summary.sleepHours >= 7 && summary.sleepVerified) {
    points += 4;
  }

  // Mindful minutes: 2 points per 5 minutes (verified)
  if (summary.mindfulMinutes && summary.mindfulVerified) {
    points += Math.floor(summary.mindfulMinutes / 5) * 2;
  }

  return points;
};

export function useHealthData() {
  const [state, setState] = useState<HealthDataState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(HEALTH_STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        setState(createDefaultState());
      }
    } else {
      setState(createDefaultState());
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (state && typeof window !== 'undefined') {
      localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Check if Web Health API is available (experimental)
  const checkHealthApiAvailability = useCallback((): boolean => {
    // The Web Health API is still experimental and not widely available
    // For now, we'll use a manual sync approach or iOS Shortcuts integration
    return false;
  }, []);

  // Connect to a health provider (simulated for now)
  const connectProvider = useCallback(async (provider: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin'): Promise<boolean> => {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          isConnected: true,
          provider,
          lastSync: new Date().toISOString(),
          error: null
        }
      };
    });

    return true;
  }, []);

  // Disconnect from health provider
  const disconnectProvider = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        syncStatus: {
          isConnected: false,
          provider: null,
          lastSync: null,
          error: null
        }
      };
    });
  }, []);

  // Add health data point (from manual entry or sync)
  const addHealthData = useCallback((
    type: HealthDataPoint['type'],
    value: number,
    source: HealthDataPoint['source'],
    date?: Date
  ): HealthDataPoint => {
    const dataPoint: HealthDataPoint = {
      id: `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      value,
      unit: type === 'steps' ? 'count' :
            type === 'workout' ? 'minutes' :
            type === 'sleep' ? 'hours' :
            type === 'heart_rate' ? 'bpm' : 'minutes',
      date: getDateString(date || new Date()),
      source,
      verified: source !== 'manual', // Manual entries are not verified
      syncedAt: new Date().toISOString()
    };

    setState(prev => {
      if (!prev) return prev;

      const dateKey = dataPoint.date;
      const existingSummary = prev.dailySummaries[dateKey] || {
        date: dateKey,
        steps: 0,
        stepsGoal: DEFAULT_STEPS_GOAL,
        stepsVerified: false,
        workoutMinutes: 0,
        workoutVerified: false,
        sleepHours: 0,
        sleepVerified: false,
        mindfulMinutes: 0,
        mindfulVerified: false,
        villagePointsEarned: 0
      };

      // Update summary based on data type
      const updatedSummary = { ...existingSummary };
      switch (dataPoint.type) {
        case 'steps':
          updatedSummary.steps = Math.max(existingSummary.steps, value);
          updatedSummary.stepsVerified = dataPoint.verified || existingSummary.stepsVerified;
          break;
        case 'workout':
          updatedSummary.workoutMinutes += value;
          updatedSummary.workoutVerified = dataPoint.verified || existingSummary.workoutVerified;
          break;
        case 'sleep':
          updatedSummary.sleepHours = value;
          updatedSummary.sleepVerified = dataPoint.verified || existingSummary.sleepVerified;
          break;
        case 'mindful_minutes':
          updatedSummary.mindfulMinutes += value;
          updatedSummary.mindfulVerified = dataPoint.verified || existingSummary.mindfulVerified;
          break;
      }

      // Recalculate village points
      updatedSummary.villagePointsEarned = calculateHealthVillagePoints(updatedSummary);

      return {
        ...prev,
        history: [dataPoint, ...prev.history.slice(0, 499)], // Keep last 500
        dailySummaries: {
          ...prev.dailySummaries,
          [dateKey]: updatedSummary
        }
      };
    });

    return dataPoint;
  }, []);

  // Sync health data from provider (simulated batch import)
  const syncHealthData = useCallback(async (data: Array<{
    type: HealthDataPoint['type'];
    value: number;
    date: Date;
  }>): Promise<number> => {
    if (!state?.syncStatus.provider) {
      throw new Error('No health provider connected');
    }

    let pointsAdded = 0;
    const source = state.syncStatus.provider;

    data.forEach(item => {
      const dp = addHealthData(item.type, item.value, source, item.date);
      // Track points for newly verified data
      if (dp.verified) {
        const dateKey = dp.date;
        const summary = state.dailySummaries[dateKey];
        if (summary) {
          pointsAdded += summary.villagePointsEarned;
        }
      }
    });

    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          lastSync: new Date().toISOString()
        }
      };
    });

    return pointsAdded;
  }, [state, addHealthData]);

  // Get today's summary
  const getTodaySummary = useCallback((): DailyHealthSummary | null => {
    if (!state) return null;
    const today = getDateString();
    return state.dailySummaries[today] || null;
  }, [state]);

  // Get week's summaries
  const getWeekSummaries = useCallback((): DailyHealthSummary[] => {
    if (!state) return [];

    const summaries: DailyHealthSummary[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateString(date);
      summaries.push(state.dailySummaries[dateKey] || {
        date: dateKey,
        steps: 0,
        stepsGoal: DEFAULT_STEPS_GOAL,
        stepsVerified: false,
        workoutMinutes: 0,
        workoutVerified: false,
        sleepHours: 0,
        sleepVerified: false,
        mindfulMinutes: 0,
        mindfulVerified: false,
        villagePointsEarned: 0
      });
    }
    return summaries;
  }, [state]);

  // Calculate total verified village points from health data
  const getTotalHealthVillagePoints = useCallback((): number => {
    if (!state) return 0;
    return Object.values(state.dailySummaries).reduce(
      (sum, s) => sum + s.villagePointsEarned,
      0
    );
  }, [state]);

  // Get weekly verified village points
  const getWeeklyHealthVillagePoints = useCallback((): number => {
    const weekSummaries = getWeekSummaries();
    return weekSummaries.reduce((sum, s) => sum + s.villagePointsEarned, 0);
  }, [getWeekSummaries]);

  // Generate iOS Shortcut URL for Apple Health sync
  const getAppleHealthShortcutUrl = useCallback((): string => {
    // This would link to a custom iOS Shortcut that reads Health data
    // and posts it back to the app via a webhook or clipboard
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `shortcuts://run-shortcut?name=TribeWellMD%20Health%20Sync&input=text&text=${encodeURIComponent(baseUrl)}`;
  }, []);

  return {
    state,
    isLoading,
    syncStatus: state?.syncStatus || null,

    // Connection
    checkHealthApiAvailability,
    connectProvider,
    disconnectProvider,

    // Data management
    addHealthData,
    syncHealthData,

    // Summaries
    getTodaySummary,
    getWeekSummaries,

    // Village points
    getTotalHealthVillagePoints,
    getWeeklyHealthVillagePoints,

    // iOS integration
    getAppleHealthShortcutUrl
  };
}
