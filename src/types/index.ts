// Core flashcard types for Step 2 CK study platform

export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type MedicalSystem = 
  | 'Cardiology'
  | 'Pulmonology'
  | 'Gastroenterology'
  | 'Nephrology'
  | 'Neurology'
  | 'Endocrinology'
  | 'Hematology/Oncology'
  | 'Infectious Disease'
  | 'Rheumatology'
  | 'Dermatology'
  | 'Psychiatry'
  | 'OB/GYN'
  | 'Pediatrics'
  | 'Surgery'
  | 'Emergency Medicine'
  | 'Preventive Medicine'
  | 'General';

// Rotation/Exam types for deck filtering
export type Rotation = 
  | 'Ambulatory'
  | 'Internal Medicine'
  | 'Surgery'
  | 'OB/GYN'
  | 'Pediatrics'
  | 'Psychiatry'
  | 'Family Medicine'
  | 'Neurology'
  | 'Emergency Medicine';

export interface CardContent {
  front: string;
  back: string;
  explanation?: string;
  references?: string[];
  images?: string[];
}

export interface CardMetadata {
  tags: string[];
  system: MedicalSystem;
  topic: string;
  difficulty: Difficulty;
  clinicalVignette: boolean;
  source?: string;
  usmleStep?: 1 | 2 | 3;
  rotation?: Rotation; // Which rotation/exam this card belongs to
}

export interface SpacedRepetitionData {
  state: CardState;
  interval: number; // days until next review
  ease: number; // easiness factor (typically 1.3 - 2.5)
  reps: number; // number of successful reviews
  lapses: number; // number of times card was forgotten
  nextReview: string; // ISO date string
  lastReview?: string; // ISO date string
  stability?: number; // FSRS stability parameter
  difficulty?: number; // FSRS difficulty parameter (0-1)
}

export interface Flashcard {
  id: string;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  content: CardContent;
  metadata: CardMetadata;
  spacedRepetition: SpacedRepetitionData;
}

export interface ReviewSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  cardsReviewed: number;
  cardsCorrect: number;
  cardsFailed: number;
  reviews: ReviewRecord[];
}

export interface ReviewRecord {
  cardId: string;
  rating: Rating;
  reviewedAt: string;
  timeSpent: number; // milliseconds
  previousState: CardState;
  newState: CardState;
}

export interface StudyStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  dueToday: number;
  streakDays: number;
  totalReviews: number;
  averageEase: number;
  retentionRate: number;
}

// Topic performance analytics
export interface TopicPerformance {
  topic: string;
  system: MedicalSystem;
  totalCards: number;
  reviewedCards: number;
  correctCount: number;
  incorrectCount: number;
  averageEase: number;
  retentionRate: number;
  strength: 'strong' | 'moderate' | 'weak' | 'new';
}

// Filter settings for deck view
export interface DeckFilter {
  tags: string[];
  systems: MedicalSystem[];
  rotations: Rotation[];
  states: CardState[];
  difficulties: Difficulty[];
}

export interface FSRSParameters {
  requestRetention: number;
  maximumInterval: number;
  w: number[]; // FSRS weights
}
