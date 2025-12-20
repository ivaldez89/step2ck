'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Tribe,
  TribeMember,
  TribeMessage,
  TribeMembership,
  TribeWithMembers,
  TribeFilter,
  UserTribeStats,
  CreateTribeData,
  TribeType,
  SocialCause,
} from '@/types/tribes';
import {
  getTribes,
  getTribe,
  getTribeWithMembers,
  createTribe,
  updateTribe,
  deleteTribe,
  getTribeMembers,
  addTribeMember,
  removeTribeMember,
  addPointsToMember,
  getTribeMessages,
  sendTribeMessage,
  getUserMemberships,
  getUserTribes,
  getPrimaryTribe,
  setPrimaryTribe,
  isMemberOf,
  canJoinMoreTribes,
  filterTribes,
  getPublicTribes,
  getTribeLeaderboard,
  joinTribe,
  leaveTribe,
  getUserTribeStats,
  MAX_TRIBES_PER_USER,
  formatTribeTime,
  getGoalProgress,
  getCauseLabel,
  getTypeLabel,
} from '@/lib/storage/tribeStorage';

export function useTribes() {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [userMemberships, setUserMemberships] = useState<TribeMembership[]>([]);
  const [userTribes, setUserTribes] = useState<Tribe[]>([]);
  const [primaryTribe, setPrimaryTribeState] = useState<Tribe | null>(null);
  const [userStats, setUserStats] = useState<UserTribeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadData = () => {
      setTribes(getTribes());
      setUserMemberships(getUserMemberships());
      setUserTribes(getUserTribes());
      setPrimaryTribeState(getPrimaryTribe());
      setUserStats(getUserTribeStats());
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Refresh all data
  const refresh = useCallback(() => {
    setTribes(getTribes());
    setUserMemberships(getUserMemberships());
    setUserTribes(getUserTribes());
    setPrimaryTribeState(getPrimaryTribe());
    setUserStats(getUserTribeStats());
  }, []);

  // Get a single tribe with members
  const getTribeDetails = useCallback((tribeId: string): TribeWithMembers | null => {
    return getTribeWithMembers(tribeId);
  }, []);

  // Get tribe by ID
  const getTribeById = useCallback((tribeId: string): Tribe | null => {
    return getTribe(tribeId);
  }, []);

  // Create a new tribe
  const handleCreateTribe = useCallback(
    (data: CreateTribeData): Tribe => {
      const tribe = createTribe(data);
      refresh();
      return tribe;
    },
    [refresh]
  );

  // Update a tribe
  const handleUpdateTribe = useCallback(
    (tribeId: string, updates: Partial<Tribe>): Tribe | null => {
      const updated = updateTribe(tribeId, updates);
      if (updated) refresh();
      return updated;
    },
    [refresh]
  );

  // Delete a tribe
  const handleDeleteTribe = useCallback(
    (tribeId: string): void => {
      deleteTribe(tribeId);
      refresh();
    },
    [refresh]
  );

  // Join a tribe
  const handleJoinTribe = useCallback(
    (
      tribeId: string,
      userData?: { firstName: string; lastName: string; avatar?: string }
    ): { success: boolean; error?: string } => {
      const result = joinTribe(tribeId, 'current-user', userData);
      if (result.success) refresh();
      return result;
    },
    [refresh]
  );

  // Leave a tribe
  const handleLeaveTribe = useCallback(
    (tribeId: string): { success: boolean; error?: string } => {
      const result = leaveTribe(tribeId);
      if (result.success) refresh();
      return result;
    },
    [refresh]
  );

  // Set primary tribe
  const handleSetPrimaryTribe = useCallback(
    (tribeId: string): void => {
      setPrimaryTribe('current-user', tribeId);
      refresh();
    },
    [refresh]
  );

  // Get tribe messages
  const getMessages = useCallback((tribeId: string): TribeMessage[] => {
    return getTribeMessages(tribeId);
  }, []);

  // Send a message to tribe chat
  const sendMessage = useCallback(
    (
      tribeId: string,
      content: string,
      senderName: string = 'You'
    ): TribeMessage => {
      return sendTribeMessage(tribeId, content, 'current-user', senderName);
    },
    []
  );

  // Get tribe members
  const getMembers = useCallback((tribeId: string): TribeMember[] => {
    return getTribeMembers(tribeId);
  }, []);

  // Add points to user's contribution
  const addPoints = useCallback(
    (points: number): void => {
      // Add points to primary tribe
      const primary = getPrimaryTribe();
      if (primary) {
        addPointsToMember(primary.id, 'current-user', points);
        refresh();
      }
    },
    [refresh]
  );

  // Filter tribes for discovery
  const searchTribes = useCallback((filter: TribeFilter): Tribe[] => {
    return filterTribes(filter);
  }, []);

  // Get public tribes
  const getDiscoverableTribes = useCallback((): Tribe[] => {
    return getPublicTribes();
  }, []);

  // Get leaderboard
  const getLeaderboard = useCallback((): Tribe[] => {
    return getTribeLeaderboard();
  }, []);

  // Check if user is member of a tribe
  const checkMembership = useCallback((tribeId: string): boolean => {
    return isMemberOf(tribeId);
  }, []);

  // Check if user can join more tribes
  const canJoinMore = useCallback((): boolean => {
    return canJoinMoreTribes();
  }, []);

  // Get tribes by type
  const getTribesByType = useCallback(
    (type: TribeType): Tribe[] => {
      return tribes.filter(t => t.type === type && t.visibility === 'public');
    },
    [tribes]
  );

  // Get tribes by cause
  const getTribesByCause = useCallback(
    (cause: SocialCause): Tribe[] => {
      return tribes.filter(
        t =>
          t.visibility === 'public' &&
          t.currentGoal &&
          t.currentGoal.cause === cause
      );
    },
    [tribes]
  );

  return {
    // State
    tribes,
    userMemberships,
    userTribes,
    primaryTribe,
    userStats,
    isLoading,
    maxTribesPerUser: MAX_TRIBES_PER_USER,

    // Actions
    refresh,
    getTribeDetails,
    getTribeById,
    createTribe: handleCreateTribe,
    updateTribe: handleUpdateTribe,
    deleteTribe: handleDeleteTribe,
    joinTribe: handleJoinTribe,
    leaveTribe: handleLeaveTribe,
    setPrimaryTribe: handleSetPrimaryTribe,
    getMessages,
    sendMessage,
    getMembers,
    addPoints,

    // Search & Filter
    searchTribes,
    getDiscoverableTribes,
    getLeaderboard,
    getTribesByType,
    getTribesByCause,

    // Utilities
    checkMembership,
    canJoinMore,
    formatTime: formatTribeTime,
    getGoalProgress,
    getCauseLabel,
    getTypeLabel,
  };
}

// Hook for a single tribe page
export function useTribe(tribeId: string) {
  const [tribe, setTribe] = useState<TribeWithMembers | null>(null);
  const [messages, setMessages] = useState<TribeMessage[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !tribeId) return;

    const loadTribe = () => {
      const tribeData = getTribeWithMembers(tribeId);
      setTribe(tribeData);
      setMessages(getTribeMessages(tribeId));
      setIsMember(isMemberOf(tribeId));
      setIsLoading(false);
    };

    loadTribe();
  }, [tribeId]);

  const refresh = useCallback(() => {
    if (!tribeId) return;
    const tribeData = getTribeWithMembers(tribeId);
    setTribe(tribeData);
    setMessages(getTribeMessages(tribeId));
    setIsMember(isMemberOf(tribeId));
  }, [tribeId]);

  const sendChatMessage = useCallback(
    (content: string, senderName: string = 'You'): TribeMessage => {
      const message = sendTribeMessage(tribeId, content, 'current-user', senderName);
      setMessages(prev => [...prev, message]);
      return message;
    },
    [tribeId]
  );

  const join = useCallback(
    (userData?: { firstName: string; lastName: string; avatar?: string }) => {
      const result = joinTribe(tribeId, 'current-user', userData);
      if (result.success) refresh();
      return result;
    },
    [tribeId, refresh]
  );

  const leave = useCallback(() => {
    const result = leaveTribe(tribeId);
    if (result.success) refresh();
    return result;
  }, [tribeId, refresh]);

  return {
    tribe,
    messages,
    isMember,
    isLoading,
    refresh,
    sendMessage: sendChatMessage,
    join,
    leave,
    formatTime: formatTribeTime,
    getGoalProgress,
  };
}
