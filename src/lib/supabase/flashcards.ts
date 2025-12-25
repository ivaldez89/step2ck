/**
 * Supabase Flashcards Data Layer
 *
 * Handles all database operations for flashcards, review sessions,
 * and study streaks. Provides conversion between app types and DB types.
 */

import { createClient } from './client';
import type { Flashcard, CardState, Rating, MedicalSystem, Difficulty, Rotation } from '@/types';
import type {
  FlashcardRow,
  FlashcardInsert,
  FlashcardUpdate,
  ReviewSessionRow,
  ReviewSessionInsert,
  ReviewRecordInsert,
  StudyStreakRow,
  UserStudyStats,
} from '@/types/database';

// ============================================
// Type Conversion Functions
// ============================================

/**
 * Convert database row to app Flashcard type
 */
export function dbToFlashcard(row: FlashcardRow): Flashcard {
  return {
    id: row.id,
    schemaVersion: row.schema_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    content: {
      front: row.front,
      back: row.back,
      explanation: row.explanation ?? undefined,
      references: row.references ?? undefined,
      images: row.images ?? undefined,
    },
    metadata: {
      tags: row.tags,
      system: row.system as MedicalSystem,
      topic: row.topic,
      difficulty: row.difficulty as Difficulty,
      clinicalVignette: row.is_clinical_vignette,
      source: row.source ?? undefined,
      usmleStep: row.usmle_step ?? undefined,
      rotation: row.rotation as Rotation | undefined,
      conceptCode: row.concept_code ?? undefined,
      clinicalDecision: row.clinical_decision ?? undefined,
      qbankCodes: row.qbank_uworld || row.qbank_amboss ? {
        uworld: row.qbank_uworld ?? undefined,
        amboss: row.qbank_amboss ?? undefined,
      } : undefined,
      relatedConcepts: row.related_concepts ?? undefined,
    },
    spacedRepetition: {
      state: row.sr_state as CardState,
      interval: row.sr_interval,
      ease: row.sr_ease,
      reps: row.sr_reps,
      lapses: row.sr_lapses,
      nextReview: row.sr_next_review,
      lastReview: row.sr_last_review ?? undefined,
      stability: row.sr_stability,
      difficulty: row.sr_difficulty,
    },
  };
}

/**
 * Convert app Flashcard type to database insert
 */
export function flashcardToDb(card: Flashcard, userId: string): FlashcardInsert {
  return {
    id: card.id,
    user_id: userId,
    schema_version: card.schemaVersion,
    front: card.content.front,
    back: card.content.back,
    explanation: card.content.explanation ?? null,
    references: card.content.references ?? null,
    images: card.content.images ?? null,
    tags: card.metadata.tags,
    system: card.metadata.system,
    topic: card.metadata.topic,
    difficulty: card.metadata.difficulty,
    is_clinical_vignette: card.metadata.clinicalVignette,
    source: card.metadata.source ?? null,
    usmle_step: card.metadata.usmleStep ?? null,
    rotation: card.metadata.rotation ?? null,
    concept_code: card.metadata.conceptCode ?? null,
    clinical_decision: card.metadata.clinicalDecision ?? null,
    qbank_uworld: card.metadata.qbankCodes?.uworld ?? null,
    qbank_amboss: card.metadata.qbankCodes?.amboss ?? null,
    related_concepts: card.metadata.relatedConcepts ?? null,
    sr_state: card.spacedRepetition.state,
    sr_interval: card.spacedRepetition.interval,
    sr_ease: card.spacedRepetition.ease,
    sr_reps: card.spacedRepetition.reps,
    sr_lapses: card.spacedRepetition.lapses,
    sr_next_review: card.spacedRepetition.nextReview,
    sr_last_review: card.spacedRepetition.lastReview ?? null,
    sr_stability: card.spacedRepetition.stability ?? 0,
    sr_difficulty: card.spacedRepetition.difficulty ?? 0,
  };
}

/**
 * Convert partial Flashcard update to database update
 */
export function flashcardUpdateToDb(card: Partial<Flashcard>): FlashcardUpdate {
  const update: FlashcardUpdate = {};

  if (card.content) {
    if (card.content.front !== undefined) update.front = card.content.front;
    if (card.content.back !== undefined) update.back = card.content.back;
    if (card.content.explanation !== undefined) update.explanation = card.content.explanation ?? null;
    if (card.content.references !== undefined) update.references = card.content.references ?? null;
    if (card.content.images !== undefined) update.images = card.content.images ?? null;
  }

  if (card.metadata) {
    if (card.metadata.tags !== undefined) update.tags = card.metadata.tags;
    if (card.metadata.system !== undefined) update.system = card.metadata.system;
    if (card.metadata.topic !== undefined) update.topic = card.metadata.topic;
    if (card.metadata.difficulty !== undefined) update.difficulty = card.metadata.difficulty;
    if (card.metadata.clinicalVignette !== undefined) update.is_clinical_vignette = card.metadata.clinicalVignette;
  }

  if (card.spacedRepetition) {
    if (card.spacedRepetition.state !== undefined) update.sr_state = card.spacedRepetition.state;
    if (card.spacedRepetition.interval !== undefined) update.sr_interval = card.spacedRepetition.interval;
    if (card.spacedRepetition.ease !== undefined) update.sr_ease = card.spacedRepetition.ease;
    if (card.spacedRepetition.reps !== undefined) update.sr_reps = card.spacedRepetition.reps;
    if (card.spacedRepetition.lapses !== undefined) update.sr_lapses = card.spacedRepetition.lapses;
    if (card.spacedRepetition.nextReview !== undefined) update.sr_next_review = card.spacedRepetition.nextReview;
    if (card.spacedRepetition.lastReview !== undefined) update.sr_last_review = card.spacedRepetition.lastReview ?? null;
    if (card.spacedRepetition.stability !== undefined) update.sr_stability = card.spacedRepetition.stability;
    if (card.spacedRepetition.difficulty !== undefined) update.sr_difficulty = card.spacedRepetition.difficulty;
  }

  update.updated_at = new Date().toISOString();

  return update;
}

// ============================================
// Flashcard CRUD Operations
// ============================================

/**
 * Fetch all flashcards for the current user
 */
export async function fetchFlashcards(): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch flashcards: ${error.message}`);
  }

  return (data as FlashcardRow[]).map(dbToFlashcard);
}

/**
 * Fetch flashcards due for review
 */
export async function fetchDueFlashcards(): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', user.id)
    .lte('sr_next_review', new Date().toISOString())
    .order('sr_next_review', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch due flashcards: ${error.message}`);
  }

  return (data as FlashcardRow[]).map(dbToFlashcard);
}

/**
 * Fetch new flashcards (not yet studied)
 */
export async function fetchNewFlashcards(limit: number = 20): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', user.id)
    .eq('sr_state', 'new')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch new flashcards: ${error.message}`);
  }

  return (data as FlashcardRow[]).map(dbToFlashcard);
}

/**
 * Create a new flashcard
 */
export async function createFlashcard(card: Flashcard): Promise<Flashcard> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const dbCard = flashcardToDb(card, user.id);

  const { data, error } = await supabase
    .from('flashcards')
    .insert(dbCard)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create flashcard: ${error.message}`);
  }

  return dbToFlashcard(data as FlashcardRow);
}

/**
 * Create multiple flashcards
 */
export async function createFlashcards(cards: Flashcard[]): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const dbCards = cards.map(card => flashcardToDb(card, user.id));

  const { data, error } = await supabase
    .from('flashcards')
    .insert(dbCards)
    .select();

  if (error) {
    throw new Error(`Failed to create flashcards: ${error.message}`);
  }

  return (data as FlashcardRow[]).map(dbToFlashcard);
}

/**
 * Update a flashcard
 */
export async function updateFlashcard(cardId: string, updates: Partial<Flashcard>): Promise<Flashcard> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const dbUpdate = flashcardUpdateToDb(updates);

  const { data, error } = await supabase
    .from('flashcards')
    .update(dbUpdate)
    .eq('id', cardId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update flashcard: ${error.message}`);
  }

  return dbToFlashcard(data as FlashcardRow);
}

/**
 * Update spaced repetition data after review
 */
export async function updateFlashcardSR(
  cardId: string,
  srData: Flashcard['spacedRepetition']
): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('flashcards')
    .update({
      sr_state: srData.state,
      sr_interval: srData.interval,
      sr_ease: srData.ease,
      sr_reps: srData.reps,
      sr_lapses: srData.lapses,
      sr_next_review: srData.nextReview,
      sr_last_review: srData.lastReview ?? null,
      sr_stability: srData.stability ?? 0,
      sr_difficulty: srData.difficulty ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to update flashcard SR: ${error.message}`);
  }
}

/**
 * Delete a flashcard
 */
export async function deleteFlashcard(cardId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete flashcard: ${error.message}`);
  }
}

// ============================================
// Review Session Operations
// ============================================

/**
 * Start a new review session
 */
export async function startReviewSession(sessionType: string = 'review'): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('review_sessions')
    .insert({
      user_id: user.id,
      session_type: sessionType,
    } as ReviewSessionInsert)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to start review session: ${error.message}`);
  }

  return data.id;
}

/**
 * End a review session
 */
export async function endReviewSession(
  sessionId: string,
  stats: { cardsReviewed: number; cardsCorrect: number; cardsFailed: number; totalTimeMs: number }
): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('review_sessions')
    .update({
      ended_at: new Date().toISOString(),
      cards_reviewed: stats.cardsReviewed,
      cards_correct: stats.cardsCorrect,
      cards_failed: stats.cardsFailed,
      total_time_ms: stats.totalTimeMs,
    })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to end review session: ${error.message}`);
  }

  // Update streak
  await supabase.rpc('update_study_streak', {
    p_user_id: user.id,
    p_cards_reviewed: stats.cardsReviewed,
    p_time_ms: stats.totalTimeMs,
  });
}

/**
 * Record a card review
 */
export async function recordReview(
  sessionId: string,
  cardId: string,
  rating: Rating,
  timeSpentMs: number,
  previousState: CardState,
  newState: CardState,
  srBefore: { interval: number; ease: number },
  srAfter: { interval: number; ease: number }
): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('review_records')
    .insert({
      session_id: sessionId,
      user_id: user.id,
      card_id: cardId,
      rating,
      time_spent_ms: timeSpentMs,
      previous_state: previousState,
      new_state: newState,
      sr_interval_before: srBefore.interval,
      sr_interval_after: srAfter.interval,
      sr_ease_before: srBefore.ease,
      sr_ease_after: srAfter.ease,
    } as ReviewRecordInsert);

  if (error) {
    throw new Error(`Failed to record review: ${error.message}`);
  }
}

// ============================================
// Stats Operations
// ============================================

/**
 * Get user study statistics
 */
export async function getUserStats(): Promise<UserStudyStats | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .rpc('get_user_study_stats', { p_user_id: user.id });

  if (error) {
    throw new Error(`Failed to get user stats: ${error.message}`);
  }

  return data?.[0] ?? null;
}

/**
 * Get user's study streak
 */
export async function getStudyStreak(): Promise<StudyStreakRow | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('study_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to get study streak: ${error.message}`);
  }

  return data as StudyStreakRow | null;
}
