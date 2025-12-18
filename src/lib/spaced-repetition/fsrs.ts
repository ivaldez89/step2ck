/**
 * FSRS (Free Spaced Repetition Scheduler) Algorithm Implementation
 * Based on the open-source FSRS algorithm by Jarrett Ye
 * 
 * This is a simplified implementation suitable for the MVP.
 * The algorithm calculates optimal review intervals based on:
 * - Stability: How well the memory is established
 * - Difficulty: How hard the card is to remember
 * - Retrievability: Probability of successful recall
 */

import type { Flashcard, Rating, CardState, SpacedRepetitionData } from '@/types';

// Default FSRS parameters (optimized weights)
const DEFAULT_WEIGHTS = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01,
  1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61
];

const DECAY = -0.5;
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1;

interface FSRSState {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
}

interface SchedulingResult {
  state: CardState;
  interval: number;
  ease: number;
  stability: number;
  difficulty: number;
  nextReview: Date;
}

/**
 * Calculate the initial difficulty based on first rating
 */
function initDifficulty(rating: number): number {
  return Math.min(Math.max(
    DEFAULT_WEIGHTS[4] - Math.exp(DEFAULT_WEIGHTS[5] * (rating - 1)) + 1,
    1
  ), 10);
}

/**
 * Calculate initial stability based on rating
 */
function initStability(rating: number): number {
  return Math.max(DEFAULT_WEIGHTS[rating - 1], 0.1);
}

/**
 * Calculate the retrievability (probability of recall)
 */
function retrievability(elapsedDays: number, stability: number): number {
  return Math.pow(1 + FACTOR * elapsedDays / stability, DECAY);
}

/**
 * Calculate next difficulty based on rating
 */
function nextDifficulty(d: number, rating: number): number {
  const nextD = d - DEFAULT_WEIGHTS[6] * (rating - 3);
  return Math.min(Math.max(
    DEFAULT_WEIGHTS[7] * initDifficulty(3) + (1 - DEFAULT_WEIGHTS[7]) * nextD,
    1
  ), 10);
}

/**
 * Calculate short-term stability for learning/relearning cards
 */
function shortTermStability(stability: number, rating: number): number {
  return stability * Math.exp(DEFAULT_WEIGHTS[17] * (rating - 3 + DEFAULT_WEIGHTS[18]));
}

/**
 * Calculate next stability after successful review
 */
function nextRecallStability(
  d: number, 
  s: number, 
  r: number, 
  rating: number
): number {
  const hardPenalty = rating === 2 ? DEFAULT_WEIGHTS[15] : 1;
  const easyBonus = rating === 4 ? DEFAULT_WEIGHTS[16] : 1;
  
  return s * (
    1 +
    Math.exp(DEFAULT_WEIGHTS[8]) *
    (11 - d) *
    Math.pow(s, -DEFAULT_WEIGHTS[9]) *
    (Math.exp((1 - r) * DEFAULT_WEIGHTS[10]) - 1) *
    hardPenalty *
    easyBonus
  );
}

/**
 * Calculate stability after forgetting (lapse)
 */
function nextForgetStability(
  d: number, 
  s: number, 
  r: number
): number {
  return Math.min(
    DEFAULT_WEIGHTS[11] *
    Math.pow(d, -DEFAULT_WEIGHTS[12]) *
    (Math.pow(s + 1, DEFAULT_WEIGHTS[13]) - 1) *
    Math.exp((1 - r) * DEFAULT_WEIGHTS[14]),
    s
  );
}

/**
 * Convert rating string to numeric value
 */
function ratingToNumber(rating: Rating): number {
  const ratings: Record<Rating, number> = {
    again: 1,
    hard: 2,
    good: 3,
    easy: 4
  };
  return ratings[rating];
}

/**
 * Calculate the interval in days from stability
 */
function stabilityToInterval(stability: number, requestRetention: number = 0.9): number {
  return Math.round(stability / FACTOR * (Math.pow(requestRetention, 1 / DECAY) - 1));
}

/**
 * Main scheduling function - calculates next review based on rating
 */
export function scheduleCard(
  card: Flashcard,
  rating: Rating
): SchedulingResult {
  const now = new Date();
  const ratingNum = ratingToNumber(rating);
  const sr = card.spacedRepetition;
  
  // Get current stability and difficulty (or defaults for new cards)
  let stability = sr.stability ?? 0;
  let difficulty = sr.difficulty ?? 0;
  let reps = sr.reps;
  let lapses = sr.lapses;
  let state = sr.state;
  
  // Calculate elapsed days since last review
  const lastReview = sr.lastReview ? new Date(sr.lastReview) : now;
  const elapsedDays = Math.max(
    (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24),
    0
  );
  
  // Handle based on current state
  if (state === 'new') {
    // First time seeing this card
    difficulty = initDifficulty(ratingNum);
    stability = initStability(ratingNum);
    reps = 0;
    
    if (ratingNum === 1) {
      // Again - go to learning
      state = 'learning';
      lapses++;
    } else if (ratingNum === 2) {
      // Hard - short interval, still learning
      state = 'learning';
    } else {
      // Good or Easy - graduate to review
      state = 'review';
      reps = 1;
    }
  } else if (state === 'learning' || state === 'relearning') {
    // In learning phase
    if (ratingNum === 1) {
      // Again - reset
      stability = initStability(1);
      if (state === 'learning') {
        lapses++;
      }
    } else if (ratingNum === 2) {
      // Hard - small increase
      stability = shortTermStability(stability || 0.5, ratingNum);
    } else {
      // Good or Easy - graduate to review
      stability = shortTermStability(stability || 1, ratingNum);
      state = 'review';
      reps++;
    }
  } else {
    // Review state
    const r = retrievability(elapsedDays, stability || 1);
    
    if (ratingNum === 1) {
      // Forgot - go to relearning
      stability = nextForgetStability(difficulty, stability, r);
      difficulty = nextDifficulty(difficulty, ratingNum);
      state = 'relearning';
      lapses++;
      reps = 0;
    } else {
      // Remembered
      stability = nextRecallStability(difficulty, stability, r, ratingNum);
      difficulty = nextDifficulty(difficulty, ratingNum);
      reps++;
    }
  }
  
  // Calculate interval based on state
  let interval: number;
  
  if (state === 'learning') {
    // Learning steps: 1min, 10min (represented as fractions of days)
    interval = ratingNum === 1 ? 1/1440 : (ratingNum === 2 ? 10/1440 : 1);
  } else if (state === 'relearning') {
    // Relearning: 10min
    interval = ratingNum >= 3 ? 1 : 10/1440;
  } else {
    // Review - calculate from stability
    interval = stabilityToInterval(stability);
    
    // Apply rating modifiers
    if (ratingNum === 2) {
      interval = Math.max(1, Math.round(interval * 0.8));
    } else if (ratingNum === 4) {
      interval = Math.round(interval * 1.3);
    }
    
    // Clamp interval
    interval = Math.max(1, Math.min(interval, 365));
  }
  
  // Calculate next review date
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  
  // Calculate ease for compatibility (map difficulty to ease factor)
  const ease = Math.max(1.3, 2.5 - (difficulty - 1) * 0.15);
  
  return {
    state,
    interval,
    ease,
    stability,
    difficulty,
    nextReview
  };
}

/**
 * Get cards due for review
 */
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  
  return cards.filter(card => {
    const nextReview = new Date(card.spacedRepetition.nextReview);
    return nextReview <= now;
  }).sort((a, b) => {
    // Sort by: new cards first, then by due date
    if (a.spacedRepetition.state === 'new' && b.spacedRepetition.state !== 'new') return -1;
    if (b.spacedRepetition.state === 'new' && a.spacedRepetition.state !== 'new') return 1;
    
    return new Date(a.spacedRepetition.nextReview).getTime() - 
           new Date(b.spacedRepetition.nextReview).getTime();
  });
}

/**
 * Calculate study statistics
 */
export function calculateStats(cards: Flashcard[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const stats = {
    totalCards: cards.length,
    newCards: 0,
    learningCards: 0,
    reviewCards: 0,
    dueToday: 0,
    averageEase: 0,
    averageInterval: 0
  };
  
  let totalEase = 0;
  let totalInterval = 0;
  let reviewCount = 0;
  
  for (const card of cards) {
    const sr = card.spacedRepetition;
    
    switch (sr.state) {
      case 'new':
        stats.newCards++;
        break;
      case 'learning':
      case 'relearning':
        stats.learningCards++;
        break;
      case 'review':
        stats.reviewCards++;
        break;
    }
    
    const nextReview = new Date(sr.nextReview);
    if (nextReview <= now) {
      stats.dueToday++;
    }
    
    if (sr.state === 'review') {
      totalEase += sr.ease;
      totalInterval += sr.interval;
      reviewCount++;
    }
  }
  
  if (reviewCount > 0) {
    stats.averageEase = totalEase / reviewCount;
    stats.averageInterval = totalInterval / reviewCount;
  }
  
  return stats;
}

/**
 * Preview what intervals would result from each rating
 */
export function previewSchedule(card: Flashcard): Record<Rating, number> {
  const ratings: Rating[] = ['again', 'hard', 'good', 'easy'];
  const preview: Record<Rating, number> = {} as Record<Rating, number>;
  
  for (const rating of ratings) {
    const result = scheduleCard(card, rating);
    preview[rating] = result.interval;
  }
  
  return preview;
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days < 1/60) {
    return '<1m';
  } else if (days < 1/24) {
    return `${Math.round(days * 24 * 60)}m`;
  } else if (days < 1) {
    return `${Math.round(days * 24)}h`;
  } else if (days < 30) {
    return `${Math.round(days)}d`;
  } else if (days < 365) {
    return `${Math.round(days / 30)}mo`;
  } else {
    return `${(days / 365).toFixed(1)}y`;
  }
}
