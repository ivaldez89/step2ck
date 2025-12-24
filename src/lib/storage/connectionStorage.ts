// Connection Matching Storage - localStorage layer for connection features

import type { ConnectionMatch, QuestionLevel, MatchScore } from '@/data/connectionQuestions';

// Re-export types for consumers
export type { MatchScore } from '@/data/connectionQuestions';
import {
  calculateMatchScore,
  getGracefulExitMessage,
  isLevelComplete,
  getNextQuestion,
  getLevelProgress,
} from '@/data/connectionQuestions';
import { getUserProfile, getCurrentUserId } from './profileStorage';
import { getVillageMembers } from './communityStorage';
import type { VillageMemberProfile } from '@/types/community';

const CONNECTIONS_KEY = 'tribewellmd_connections';
const PENDING_REQUESTS_KEY = 'tribewellmd_connection_requests';
const MATCH_PREFERENCES_KEY = 'tribewellmd_match_preferences';

// ============================================
// Connection Request Types
// ============================================

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  villageId: string;
  message?: string;
  commonInterests: string[];
  matchScore: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  respondedAt?: string;
}

export interface MatchPreferences {
  userId: string;
  isLookingForConnections: boolean;
  preferredPace: 'slow' | 'moderate' | 'fast'; // How often to answer questions
  notifyOnNewMatch: boolean;
  notifyOnNewAnswer: boolean;
}

// ============================================
// Connection Requests
// ============================================

export function getConnectionRequests(status?: ConnectionRequest['status']): ConnectionRequest[] {
  if (typeof window === 'undefined') return [];
  const userId = getCurrentUserId();
  if (!userId) return [];

  try {
    const stored = localStorage.getItem(PENDING_REQUESTS_KEY);
    if (!stored) return [];

    const allRequests: ConnectionRequest[] = JSON.parse(stored);
    const userRequests = allRequests.filter(
      r => r.toUserId === userId || r.fromUserId === userId
    );

    if (status) {
      return userRequests.filter(r => r.status === status);
    }

    return userRequests;
  } catch (error) {
    console.error('Error loading connection requests:', error);
    return [];
  }
}

export function getIncomingRequests(): ConnectionRequest[] {
  const userId = getCurrentUserId();
  if (!userId) return [];

  return getConnectionRequests('pending').filter(r => r.toUserId === userId);
}

export function getOutgoingRequests(): ConnectionRequest[] {
  const userId = getCurrentUserId();
  if (!userId) return [];

  return getConnectionRequests('pending').filter(r => r.fromUserId === userId);
}

export function sendConnectionRequest(
  toUserId: string,
  toUserName: string,
  villageId: string,
  message?: string
): ConnectionRequest | null {
  const profile = getUserProfile();
  if (!profile) return null;

  // Get match score
  const targetMember = getVillageMembers(villageId).find(m => m.id === toUserId);
  const matchData = targetMember
    ? calculateMatchScore(
        {
          wellness: profile.wellnessInterests || [],
          specialties: profile.interestedSpecialties || [],
          general: profile.generalInterests || [],
        },
        {
          wellness: targetMember.wellnessInterests || [],
          specialties: [targetMember.specialty || ''].filter(Boolean),
          general: targetMember.generalInterests || [],
        }
      )
    : { score: 0, commonInterests: [] };

  const request: ConnectionRequest = {
    id: crypto.randomUUID(),
    fromUserId: profile.id,
    fromUserName: `${profile.firstName} ${profile.lastName}`.trim() || 'Anonymous',
    toUserId,
    toUserName,
    villageId,
    message,
    commonInterests: matchData.commonInterests,
    matchScore: matchData.score,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const stored = localStorage.getItem(PENDING_REQUESTS_KEY);
    const allRequests: ConnectionRequest[] = stored ? JSON.parse(stored) : [];

    // Check if request already exists
    const existingRequest = allRequests.find(
      r =>
        (r.fromUserId === profile.id && r.toUserId === toUserId) ||
        (r.fromUserId === toUserId && r.toUserId === profile.id)
    );

    if (existingRequest) {
      return null; // Already have a request
    }

    allRequests.push(request);
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(allRequests));
    return request;
  } catch (error) {
    console.error('Error sending connection request:', error);
    return null;
  }
}

export function respondToRequest(requestId: string, accept: boolean): ConnectionMatch | null {
  const userId = getCurrentUserId();
  if (!userId) return null;

  try {
    const stored = localStorage.getItem(PENDING_REQUESTS_KEY);
    if (!stored) return null;

    const allRequests: ConnectionRequest[] = JSON.parse(stored);
    const requestIndex = allRequests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) return null;

    const request = allRequests[requestIndex];

    // Only the recipient can respond
    if (request.toUserId !== userId) return null;

    request.status = accept ? 'accepted' : 'declined';
    request.respondedAt = new Date().toISOString();

    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(allRequests));

    if (accept) {
      // Create a new connection
      return createConnection(request);
    }

    return null;
  } catch (error) {
    console.error('Error responding to request:', error);
    return null;
  }
}

// ============================================
// Connections
// ============================================

export function getConnections(): ConnectionMatch[] {
  if (typeof window === 'undefined') return [];
  const userId = getCurrentUserId();
  if (!userId) return [];

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return [];

    const allConnections: ConnectionMatch[] = JSON.parse(stored);
    return allConnections.filter(c => c.participantIds.includes(userId));
  } catch (error) {
    console.error('Error loading connections:', error);
    return [];
  }
}

export function getActiveConnections(): ConnectionMatch[] {
  return getConnections().filter(c => c.status === 'active');
}

export function getConnection(connectionId: string): ConnectionMatch | null {
  const connections = getConnections();
  return connections.find(c => c.id === connectionId) || null;
}

export function createConnection(request: ConnectionRequest): ConnectionMatch {
  const connection: ConnectionMatch = {
    id: crypto.randomUUID(),
    participantIds: [request.fromUserId, request.toUserId],
    villageId: request.villageId,
    createdAt: new Date().toISOString(),
    status: 'active',
    currentLevel: 1,
    answeredQuestions: [],
    levelUnlockConsent: [],
  };

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    const allConnections: ConnectionMatch[] = stored ? JSON.parse(stored) : [];
    allConnections.push(connection);
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections));
    return connection;
  } catch (error) {
    console.error('Error creating connection:', error);
    return connection;
  }
}

export function answerQuestion(
  connectionId: string,
  questionId: string,
  answer: string
): boolean {
  const userId = getCurrentUserId();
  if (!userId) return false;

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return false;

    const allConnections: ConnectionMatch[] = JSON.parse(stored);
    const connection = allConnections.find(c => c.id === connectionId);

    if (!connection || !connection.participantIds.includes(userId)) {
      return false;
    }

    // Find or create the question entry
    let questionEntry = connection.answeredQuestions.find(q => q.questionId === questionId);

    if (!questionEntry) {
      questionEntry = {
        questionId,
        answers: [],
      };
      connection.answeredQuestions.push(questionEntry);
    }

    // Check if user already answered
    const existingAnswer = questionEntry.answers.find(a => a.odId === userId);
    if (existingAnswer) {
      // Update existing answer
      existingAnswer.answer = answer;
      existingAnswer.answeredAt = new Date().toISOString();
    } else {
      // Add new answer
      questionEntry.answers.push({
        odId: userId,
        answer,
        answeredAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections));
    return true;
  } catch (error) {
    console.error('Error answering question:', error);
    return false;
  }
}

export function checkAndUnlockNextLevel(connectionId: string): {
  canUnlock: boolean;
  currentLevel: QuestionLevel;
  nextLevel: QuestionLevel | null;
  waitingForPartner: boolean;
} {
  const userId = getCurrentUserId();
  if (!userId) {
    return { canUnlock: false, currentLevel: 1, nextLevel: null, waitingForPartner: false };
  }

  const connection = getConnection(connectionId);
  if (!connection) {
    return { canUnlock: false, currentLevel: 1, nextLevel: null, waitingForPartner: false };
  }

  const answeredIds = connection.answeredQuestions.map(q => q.questionId);
  const currentLevel = connection.currentLevel;

  // Check if current level is complete
  if (!isLevelComplete(currentLevel, answeredIds)) {
    return { canUnlock: false, currentLevel, nextLevel: null, waitingForPartner: false };
  }

  // Check if max level reached
  if (currentLevel >= 5) {
    return { canUnlock: false, currentLevel, nextLevel: null, waitingForPartner: false };
  }

  const nextLevel = (currentLevel + 1) as QuestionLevel;

  // Check if both users consented to continue
  const userConsent = connection.levelUnlockConsent.find(
    c => c.level === nextLevel && c.userId === userId
  );
  const partnerId = connection.participantIds.find(id => id !== userId);
  const partnerConsent = connection.levelUnlockConsent.find(
    c => c.level === nextLevel && c.userId === partnerId
  );

  if (userConsent?.wantsToContinue && partnerConsent?.wantsToContinue) {
    // Both consented, unlock the level
    unlockLevel(connectionId, nextLevel);
    return { canUnlock: true, currentLevel: nextLevel, nextLevel: null, waitingForPartner: false };
  }

  if (userConsent?.wantsToContinue && !partnerConsent) {
    // User consented, waiting for partner
    return { canUnlock: false, currentLevel, nextLevel, waitingForPartner: true };
  }

  return { canUnlock: false, currentLevel, nextLevel, waitingForPartner: false };
}

export function consentToNextLevel(connectionId: string, wantsToContinue: boolean): boolean {
  const userId = getCurrentUserId();
  if (!userId) return false;

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return false;

    const allConnections: ConnectionMatch[] = JSON.parse(stored);
    const connection = allConnections.find(c => c.id === connectionId);

    if (!connection || !connection.participantIds.includes(userId)) {
      return false;
    }

    const nextLevel = (connection.currentLevel + 1) as QuestionLevel;

    // Remove any existing consent for this level from this user
    connection.levelUnlockConsent = connection.levelUnlockConsent.filter(
      c => !(c.level === nextLevel && c.userId === userId)
    );

    // Add new consent
    connection.levelUnlockConsent.push({
      level: nextLevel,
      userId,
      wantsToContinue,
      respondedAt: new Date().toISOString(),
    });

    // If user doesn't want to continue, end the connection gracefully
    if (!wantsToContinue) {
      connection.status = 'ended';
      connection.endedBy = userId;
      connection.endedAt = new Date().toISOString();
      connection.endReason = 'not_interested';
    }

    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections));

    // Check if both consented and should unlock
    if (wantsToContinue) {
      checkAndUnlockNextLevel(connectionId);
    }

    return true;
  } catch (error) {
    console.error('Error consenting to next level:', error);
    return false;
  }
}

function unlockLevel(connectionId: string, level: QuestionLevel): void {
  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return;

    const allConnections: ConnectionMatch[] = JSON.parse(stored);
    const connection = allConnections.find(c => c.id === connectionId);

    if (connection) {
      connection.currentLevel = level;
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections));
    }
  } catch (error) {
    console.error('Error unlocking level:', error);
  }
}

export function endConnection(
  connectionId: string,
  reason: 'not_interested' | 'too_busy' | 'other'
): boolean {
  const userId = getCurrentUserId();
  if (!userId) return false;

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return false;

    const allConnections: ConnectionMatch[] = JSON.parse(stored);
    const connection = allConnections.find(c => c.id === connectionId);

    if (!connection || !connection.participantIds.includes(userId)) {
      return false;
    }

    connection.status = 'ended';
    connection.endedBy = userId;
    connection.endedAt = new Date().toISOString();
    connection.endReason = reason;

    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections));
    return true;
  } catch (error) {
    console.error('Error ending connection:', error);
    return false;
  }
}

// ============================================
// Matching Algorithm
// ============================================

export function findPotentialMatches(villageId: string, limit: number = 5): MatchScore[] {
  const profile = getUserProfile();
  if (!profile) return [];

  const members = getVillageMembers(villageId);
  const existingConnections = getConnections();
  const pendingRequests = getConnectionRequests();

  // Filter out self, existing connections, and pending requests
  const availableMembers = members.filter(member => {
    if (member.id === profile.id) return false;

    // Check if already connected
    const isConnected = existingConnections.some(c =>
      c.participantIds.includes(member.id) && c.status !== 'ended'
    );
    if (isConnected) return false;

    // Check if request already sent/received
    const hasPendingRequest = pendingRequests.some(r =>
      (r.fromUserId === profile.id && r.toUserId === member.id) ||
      (r.toUserId === profile.id && r.fromUserId === member.id)
    );
    if (hasPendingRequest) return false;

    return true;
  });

  // Calculate match scores
  const scores: MatchScore[] = availableMembers.map(member => {
    const matchData = calculateMatchScore(
      {
        wellness: profile.wellnessInterests || [],
        specialties: profile.interestedSpecialties || [],
        general: profile.generalInterests || [],
      },
      {
        wellness: member.wellnessInterests || [],
        specialties: [member.specialty || ''].filter(Boolean),
        general: member.generalInterests || [],
      }
    );

    return {
      userId: member.id,
      score: matchData.score,
      commonInterests: matchData.commonInterests,
    };
  });

  // Sort by score descending and return top matches
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ============================================
// Connection Status Helpers
// ============================================

export function getConnectionProgress(connectionId: string): {
  currentLevel: QuestionLevel;
  levelProgress: { answered: number; total: number; required: number };
  totalQuestionsAnswered: number;
  isLevelComplete: boolean;
  canAdvance: boolean;
  status: ConnectionMatch['status'];
} | null {
  const connection = getConnection(connectionId);
  if (!connection) return null;

  const answeredIds = connection.answeredQuestions.map(q => q.questionId);
  const levelProgressData = getLevelProgress(connection.currentLevel, answeredIds);
  const levelComplete = isLevelComplete(connection.currentLevel, answeredIds);

  return {
    currentLevel: connection.currentLevel,
    levelProgress: levelProgressData,
    totalQuestionsAnswered: answeredIds.length,
    isLevelComplete: levelComplete,
    canAdvance: levelComplete && connection.currentLevel < 5,
    status: connection.status,
  };
}

export function getPartnerInfo(connectionId: string): VillageMemberProfile | null {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const connection = getConnection(connectionId);
  if (!connection) return null;

  const partnerId = connection.participantIds.find(id => id !== userId);
  if (!partnerId) return null;

  const members = getVillageMembers(connection.villageId);
  return members.find(m => m.id === partnerId) || null;
}

export function getConnectionEndMessage(connectionId: string): string | null {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const connection = getConnection(connectionId);
  if (!connection || connection.status !== 'ended') return null;

  // Only show graceful message to the person who didn't end it
  if (connection.endedBy !== userId) {
    return getGracefulExitMessage();
  }

  return null;
}
