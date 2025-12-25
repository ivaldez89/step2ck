/**
 * Database Types - Supabase Schema Definitions
 *
 * These types match the Supabase database schema defined in:
 * supabase/migrations/006_flashcards.sql
 *
 * Use these for direct database operations.
 * The existing app types (Flashcard, etc.) are used for UI/business logic.
 */

// ============================================
// Database Row Types (match Supabase schema)
// ============================================

export interface FlashcardRow {
  id: string;
  user_id: string;
  schema_version: string;

  // Content
  front: string;
  back: string;
  explanation: string | null;
  references: string[] | null;
  images: string[] | null;

  // Metadata
  tags: string[];
  system: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_clinical_vignette: boolean;
  source: string | null;
  usmle_step: 1 | 2 | 3 | null;
  rotation: string | null;

  // Concept-based learning
  concept_code: string | null;
  clinical_decision: string | null;
  qbank_uworld: string[] | null;
  qbank_amboss: string[] | null;
  related_concepts: string[] | null;

  // Spaced Repetition
  sr_state: 'new' | 'learning' | 'review' | 'relearning';
  sr_interval: number;
  sr_ease: number;
  sr_reps: number;
  sr_lapses: number;
  sr_next_review: string;
  sr_last_review: string | null;
  sr_stability: number;
  sr_difficulty: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ReviewSessionRow {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  cards_reviewed: number;
  cards_correct: number;
  cards_failed: number;
  total_time_ms: number;
  session_type: 'review' | 'new' | 'mixed' | 'cram';
  deck_filter: Record<string, unknown> | null;
  created_at: string;
}

export interface ReviewRecordRow {
  id: string;
  session_id: string;
  user_id: string;
  card_id: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  reviewed_at: string;
  time_spent_ms: number;
  previous_state: string;
  new_state: string;
  sr_interval_before: number | null;
  sr_interval_after: number | null;
  sr_ease_before: number | null;
  sr_ease_after: number | null;
}

export interface StudyStreakRow {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  total_study_days: number;
  total_cards_reviewed: number;
  total_study_time_ms: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Insert Types (for creating new records)
// ============================================

export type FlashcardInsert = Omit<FlashcardRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ReviewSessionInsert = Omit<ReviewSessionRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ReviewRecordInsert = Omit<ReviewRecordRow, 'id'> & {
  id?: string;
};

export type StudyStreakInsert = Omit<StudyStreakRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// ============================================
// Update Types (for partial updates)
// ============================================

export type FlashcardUpdate = Partial<Omit<FlashcardRow, 'id' | 'user_id' | 'created_at'>>;

export type ReviewSessionUpdate = Partial<Omit<ReviewSessionRow, 'id' | 'user_id' | 'created_at'>>;

export type StudyStreakUpdate = Partial<Omit<StudyStreakRow, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// Function Return Types
// ============================================

export interface UserStudyStats {
  total_cards: number;
  new_cards: number;
  learning_cards: number;
  review_cards: number;
  due_today: number;
  total_reviews: number;
  average_ease: number;
}

// ============================================
// Database Type (for Supabase client typing)
// ============================================

export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: FlashcardRow;
        Insert: FlashcardInsert;
        Update: FlashcardUpdate;
      };
      review_sessions: {
        Row: ReviewSessionRow;
        Insert: ReviewSessionInsert;
        Update: ReviewSessionUpdate;
      };
      review_records: {
        Row: ReviewRecordRow;
        Insert: ReviewRecordInsert;
        Update: Partial<ReviewRecordRow>;
      };
      study_streaks: {
        Row: StudyStreakRow;
        Insert: StudyStreakInsert;
        Update: StudyStreakUpdate;
      };
    };
    Functions: {
      get_user_study_stats: {
        Args: { p_user_id: string };
        Returns: UserStudyStats[];
      };
      update_study_streak: {
        Args: { p_user_id: string; p_cards_reviewed: number; p_time_ms: number };
        Returns: void;
      };
    };
  };
}
