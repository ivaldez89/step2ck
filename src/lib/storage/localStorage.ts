/**
 * LocalStorage utilities for persisting flashcard data
 */

import type { Flashcard, ReviewSession, DeckFilter } from '@/types';

const STORAGE_KEYS = {
  FLASHCARDS: 'step2_flashcards',
  SESSIONS: 'step2_sessions',
  SETTINGS: 'step2_settings',
  LAST_SYNC: 'step2_last_sync',
  FILTERS: 'step2_filters'
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getFlashcards(): Flashcard[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading flashcards:', error);
    return [];
  }
}

export function saveFlashcards(cards: Flashcard[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving flashcards:', error);
  }
}

export function getFlashcard(id: string): Flashcard | null {
  const cards = getFlashcards();
  return cards.find(card => card.id === id) || null;
}

export function saveFlashcard(card: Flashcard): void {
  const cards = getFlashcards();
  const index = cards.findIndex(c => c.id === card.id);
  if (index >= 0) {
    cards[index] = { ...card, updatedAt: new Date().toISOString() };
  } else {
    cards.push(card);
  }
  saveFlashcards(cards);
}

export function deleteFlashcard(id: string): void {
  const cards = getFlashcards();
  saveFlashcards(cards.filter(card => card.id !== id));
}

export function getSessions(): ReviewSession[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export function saveSession(session: ReviewSession): void {
  if (!isBrowser()) return;
  try {
    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function getFilters(): DeckFilter | null {
  if (!isBrowser()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export function saveFilters(filters: DeckFilter): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

export function clearAllData(): void {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

export function exportData(): string {
  return JSON.stringify({
    flashcards: getFlashcards(),
    sessions: getSessions(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

export function importData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (data.flashcards && Array.isArray(data.flashcards)) {
      saveFlashcards(data.flashcards);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function seedFlashcards(): void {
  if (!isBrowser()) return;
  if (localStorage.getItem(STORAGE_KEYS.FLASHCARDS)) return;
  
  const now = new Date().toISOString();
  
  const createCard = (
    front: string, 
    back: string, 
    explanation: string, 
    tags: string[], 
    system: string, 
    topic: string, 
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Flashcard => ({
    id: crypto.randomUUID(),
    schemaVersion: '1.0',
    createdAt: now,
    updatedAt: now,
    userId: 'demo',
    content: { front, back, explanation },
    metadata: {
      tags,
      system: system as any,
      topic,
      difficulty,
      clinicalVignette: true,
      rotation: 'Ambulatory'
    },
    spacedRepetition: {
      state: 'new',
      interval: 0,
      ease: 2.5,
      reps: 0,
      lapses: 0,
      nextReview: now
    }
  });

  const sampleCards: Flashcard[] = [
    createCard(
      'A 45-year-old obese man who smokes 1 pack/day presents for routine health maintenance. He has hypertension and hyperlipidemia. What single intervention provides the greatest reduction in all-cause mortality?',
      'Smoking cessation counseling with FDA-approved pharmacotherapy.\n\nQuitting tobacco is the single most impactful intervention for reducing cardiovascular and all-cause mortality.',
      'While controlling BP and lipids is important, smoking cessation provides the largest mortality benefit. Assess readiness to quit and offer both counseling and pharmacotherapy (varenicline, bupropion, or NRT).',
      ['smoking cessation', 'preventive medicine', 'cardiovascular risk'],
      'Preventive Medicine',
      'Health Maintenance',
      'easy'
    ),
    createCard(
      'A 58-year-old man with hypertension is on lisinopril, amlodipine, and chlorthalidone but BP remains 155/95 mmHg. Before adding a fourth medication, what should you do first?',
      'Assess medication adherence with a nonjudgmental question and confirm accurate BP readings (home or ambulatory monitoring).\n\nNonadherence is extremely common—ask about barriers like cost, side effects, or misunderstanding.',
      'Resistant HTN is defined as BP above goal despite 3 medications including a diuretic. However, pseudo-resistance from nonadherence or white-coat effect must be excluded first.',
      ['resistant hypertension', 'adherence', 'blood pressure'],
      'Cardiology',
      'Hypertension',
      'medium'
    ),
    createCard(
      'A 52-year-old woman has resistant hypertension despite 3 medications. Labs show K+ 3.1 mEq/L. What is the next best diagnostic step?',
      'Aldosterone-to-renin ratio (ARR) to screen for primary hyperaldosteronism.\n\nHypokalemia + resistant HTN is classic for primary hyperaldosteronism. Screen with ARR before imaging.',
      'Do NOT order CT adrenals first—biochemical confirmation must precede imaging. Primary hyperaldosteronism has LOW renin (vs. renal artery stenosis which has HIGH renin).',
      ['hyperaldosteronism', 'hypokalemia', 'resistant hypertension'],
      'Endocrinology',
      'Adrenal Disorders',
      'medium'
    )
  ];
  
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(sampleCards));
  console.log('Seeded', sampleCards.length, 'sample flashcards');
}
