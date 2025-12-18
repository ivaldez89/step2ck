'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Flashcard, Rating, ReviewSession, ReviewRecord, DeckFilter, TopicPerformance, MedicalSystem } from '@/types';
import { 
  getFlashcards, 
  saveFlashcard, 
  saveFlashcards,
  seedFlashcards,
  saveSession,
  getFilters,
  saveFilters
} from '@/lib/storage/localStorage';
import { 
  scheduleCard, 
  getDueCards, 
  calculateStats,
  previewSchedule 
} from '@/lib/spaced-repetition/fsrs';

interface UseFlashcardsReturn {
  // State
  cards: Flashcard[];
  dueCards: Flashcard[];
  filteredDueCards: Flashcard[];
  currentCard: Flashcard | null;
  currentIndex: number;
  isRevealed: boolean;
  isLoading: boolean;
  stats: ReturnType<typeof calculateStats>;
  session: ReviewSession | null;
  intervalPreview: Record<Rating, number> | null;
  
  // Filter state
  filters: DeckFilter;
  availableTags: string[];
  availableSystems: MedicalSystem[];
  topicPerformance: TopicPerformance[];
  
  // Actions
  revealAnswer: () => void;
  rateCard: (rating: Rating) => void;
  nextCard: () => void;
  previousCard: () => void;
  goToCard: (index: number) => void;
  startSession: () => void;
  endSession: () => void;
  addCard: (card: Omit<Flashcard, 'id' | 'schemaVersion' | 'createdAt' | 'updatedAt'>) => void;
  addCards: (cards: Flashcard[]) => void;
  updateCard: (card: Flashcard) => void;
  deleteCard: (id: string) => void;
  refreshCards: () => void;
  
  // Filter actions
  setFilters: (filters: DeckFilter) => void;
  clearFilters: () => void;
  toggleTag: (tag: string) => void;
  toggleSystem: (system: MedicalSystem) => void;
}

const defaultFilters: DeckFilter = {
  tags: [],
  systems: [],
  rotations: [],
  states: [],
  difficulties: []
};

export function useFlashcards(): UseFlashcardsReturn {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [reviewStartTime, setReviewStartTime] = useState<number | null>(null);
  const [intervalPreview, setIntervalPreview] = useState<Record<Rating, number> | null>(null);
  const [filters, setFiltersState] = useState<DeckFilter>(defaultFilters);

  // Load cards on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Seed sample cards if none exist
    seedFlashcards();
    
    // Load cards
    const loadedCards = getFlashcards();
    setCards(loadedCards);
    
    // Get due cards
    const due = getDueCards(loadedCards);
    setDueCards(due);
    
    // Load saved filters
    const savedFilters = getFilters();
    if (savedFilters) {
      setFiltersState(savedFilters);
    }
    
    setIsLoading(false);
  }, []);

  // Extract available tags and systems from cards
  const availableTags = Array.from(
    new Set(cards.flatMap(c => c.metadata.tags))
  ).sort();
  
  const availableSystems = Array.from(
    new Set(cards.map(c => c.metadata.system))
  ).sort() as MedicalSystem[];

  // Calculate topic performance
  const topicPerformance: TopicPerformance[] = (() => {
    const topicMap = new Map<string, {
      system: MedicalSystem;
      cards: Flashcard[];
    }>();
    
    cards.forEach(card => {
      const key = card.metadata.topic;
      if (!topicMap.has(key)) {
        topicMap.set(key, { system: card.metadata.system, cards: [] });
      }
      topicMap.get(key)!.cards.push(card);
    });
    
    return Array.from(topicMap.entries()).map(([topic, data]) => {
      const totalCards = data.cards.length;
      const reviewedCards = data.cards.filter(c => c.spacedRepetition.reps > 0);
      const correctCount = reviewedCards.reduce((sum, c) => sum + c.spacedRepetition.reps, 0);
      const incorrectCount = reviewedCards.reduce((sum, c) => sum + c.spacedRepetition.lapses, 0);
      const averageEase = reviewedCards.length > 0 
        ? reviewedCards.reduce((sum, c) => sum + c.spacedRepetition.ease, 0) / reviewedCards.length 
        : 2.5;
      
      const totalAttempts = correctCount + incorrectCount;
      const retentionRate = totalAttempts > 0 ? correctCount / totalAttempts : 0;
      
      let strength: 'strong' | 'moderate' | 'weak' | 'new';
      if (reviewedCards.length === 0) {
        strength = 'new';
      } else if (retentionRate >= 0.8) {
        strength = 'strong';
      } else if (retentionRate >= 0.6) {
        strength = 'moderate';
      } else {
        strength = 'weak';
      }
      
      return {
        topic,
        system: data.system,
        totalCards,
        reviewedCards: reviewedCards.length,
        correctCount,
        incorrectCount,
        averageEase,
        retentionRate,
        strength
      };
    }).sort((a, b) => a.retentionRate - b.retentionRate); // Weakest first
  })();

  // Apply filters to due cards
  const filteredDueCards = dueCards.filter(card => {
    // If no filters set, show all
    if (
      filters.tags.length === 0 && 
      filters.systems.length === 0 && 
      filters.rotations.length === 0 &&
      filters.states.length === 0 &&
      filters.difficulties.length === 0
    ) {
      return true;
    }
    
    // Check tag filter (card must have at least one matching tag)
    if (filters.tags.length > 0) {
      const hasMatchingTag = card.metadata.tags.some(t => filters.tags.includes(t));
      if (!hasMatchingTag) return false;
    }
    
    // Check system filter
    if (filters.systems.length > 0 && !filters.systems.includes(card.metadata.system)) {
      return false;
    }
    
    // Check rotation filter
    if (filters.rotations.length > 0 && card.metadata.rotation && !filters.rotations.includes(card.metadata.rotation)) {
      return false;
    }
    
    // Check state filter
    if (filters.states.length > 0 && !filters.states.includes(card.spacedRepetition.state)) {
      return false;
    }
    
    // Check difficulty filter
    if (filters.difficulties.length > 0 && !filters.difficulties.includes(card.metadata.difficulty)) {
      return false;
    }
    
    return true;
  });

  // Current card from filtered list
  const currentCard = filteredDueCards[currentIndex] || null;

  // Calculate interval preview when card changes
  useEffect(() => {
    if (currentCard && isRevealed) {
      setIntervalPreview(previewSchedule(currentCard));
    } else {
      setIntervalPreview(null);
    }
  }, [currentCard, isRevealed]);

  // Calculate stats
  const stats = calculateStats(cards);

  // Refresh cards from storage
  const refreshCards = useCallback(() => {
    const loadedCards = getFlashcards();
    setCards(loadedCards);
    setDueCards(getDueCards(loadedCards));
  }, []);

  // Filter actions
  const setFilters = useCallback((newFilters: DeckFilter) => {
    setFiltersState(newFilters);
    saveFilters(newFilters);
    setCurrentIndex(0);
    setIsRevealed(false);
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);
  
  const toggleTag = useCallback((tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.includes(tag) 
        ? filters.tags.filter(t => t !== tag)
        : [...filters.tags, tag]
    });
  }, [filters, setFilters]);
  
  const toggleSystem = useCallback((system: MedicalSystem) => {
    setFilters({
      ...filters,
      systems: filters.systems.includes(system)
        ? filters.systems.filter(s => s !== system)
        : [...filters.systems, system]
    });
  }, [filters, setFilters]);

  // Reveal answer
  const revealAnswer = useCallback(() => {
    setIsRevealed(true);
    setReviewStartTime(Date.now());
  }, []);

  // Rate card and schedule next review
  const rateCard = useCallback((rating: Rating) => {
    if (!currentCard) return;
    
    // Calculate new scheduling
    const result = scheduleCard(currentCard, rating);
    
    // Update the card
    const updatedCard: Flashcard = {
      ...currentCard,
      updatedAt: new Date().toISOString(),
      spacedRepetition: {
        state: result.state,
        interval: result.interval,
        ease: result.ease,
        reps: currentCard.spacedRepetition.reps + (rating !== 'again' ? 1 : 0),
        lapses: currentCard.spacedRepetition.lapses + (rating === 'again' ? 1 : 0),
        nextReview: result.nextReview.toISOString(),
        lastReview: new Date().toISOString(),
        stability: result.stability,
        difficulty: result.difficulty
      }
    };
    
    // Save to storage
    saveFlashcard(updatedCard);
    
    // Update session if active
    if (session && reviewStartTime) {
      const reviewRecord: ReviewRecord = {
        cardId: currentCard.id,
        rating,
        reviewedAt: new Date().toISOString(),
        timeSpent: Date.now() - reviewStartTime,
        previousState: currentCard.spacedRepetition.state,
        newState: result.state
      };
      
      const updatedSession: ReviewSession = {
        ...session,
        cardsReviewed: session.cardsReviewed + 1,
        cardsCorrect: session.cardsCorrect + (rating !== 'again' ? 1 : 0),
        cardsFailed: session.cardsFailed + (rating === 'again' ? 1 : 0),
        reviews: [...session.reviews, reviewRecord]
      };
      
      setSession(updatedSession);
      saveSession(updatedSession);
    }
    
    // Update local state
    const updatedCards = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
    setCards(updatedCards);
    
    // Remove from due cards if no longer due (or move to end if still learning)
    if (result.state === 'learning' || result.state === 'relearning') {
      // Keep in queue but move to end
      const newDue = [...dueCards];
      const idx = newDue.findIndex(c => c.id === currentCard.id);
      if (idx >= 0) {
        newDue.splice(idx, 1);
        newDue.push(updatedCard);
      }
      setDueCards(newDue);
    } else {
      // Remove from due cards
      const newDue = dueCards.filter(c => c.id !== currentCard.id);
      setDueCards(newDue);
      
      // Adjust index if needed
      if (currentIndex >= filteredDueCards.length - 1 && filteredDueCards.length > 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    }
    
    // Reset for next card
    setIsRevealed(false);
    setReviewStartTime(null);
  }, [currentCard, cards, dueCards, filteredDueCards, currentIndex, session, reviewStartTime]);

  // Navigation
  const nextCard = useCallback(() => {
    if (currentIndex < filteredDueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  }, [currentIndex, filteredDueCards.length]);

  const previousCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsRevealed(false);
    }
  }, [currentIndex]);

  const goToCard = useCallback((index: number) => {
    if (index >= 0 && index < filteredDueCards.length) {
      setCurrentIndex(index);
      setIsRevealed(false);
    }
  }, [filteredDueCards.length]);

  // Session management
  const startSession = useCallback(() => {
    const newSession: ReviewSession = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      cardsReviewed: 0,
      cardsCorrect: 0,
      cardsFailed: 0,
      reviews: []
    };
    setSession(newSession);
    setCurrentIndex(0);
    setIsRevealed(false);
  }, []);

  const endSession = useCallback(() => {
    if (session) {
      const endedSession: ReviewSession = {
        ...session,
        endedAt: new Date().toISOString()
      };
      saveSession(endedSession);
    }
    setSession(null);
  }, [session]);

  // Add new card
  const addCard = useCallback((
    cardData: Omit<Flashcard, 'id' | 'schemaVersion' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newCard: Flashcard = {
      ...cardData,
      id: crypto.randomUUID(),
      schemaVersion: '1.0',
      createdAt: now,
      updatedAt: now
    };
    
    saveFlashcard(newCard);
    
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    
    // Add to due cards if it's due
    const due = getDueCards(updatedCards);
    setDueCards(due);
  }, [cards]);

  // Add multiple cards (merge without duplicates)
  const addCards = useCallback((newCards: Flashcard[]) => {
    const existingIds = new Set(cards.map(c => c.id));
    
    // Filter out cards that already exist (by ID)
    // Also check for duplicate content
    const existingContent = new Set(cards.map(c => c.content.front.toLowerCase().trim()));
    
    const uniqueNewCards = newCards.filter(newCard => {
      const isDuplicateId = existingIds.has(newCard.id);
      const isDuplicateContent = existingContent.has(newCard.content.front.toLowerCase().trim());
      return !isDuplicateId && !isDuplicateContent;
    });

    if (uniqueNewCards.length === 0) {
      console.log('No new unique cards to add');
      return;
    }

    // Merge with existing cards
    const mergedCards = [...cards, ...uniqueNewCards];
    
    // Save to storage
    saveFlashcards(mergedCards);
    
    // Update state
    setCards(mergedCards);
    setDueCards(getDueCards(mergedCards));
    
    console.log(`Added ${uniqueNewCards.length} new cards`);
  }, [cards]);

  // Update existing card
  const updateCard = useCallback((updatedCard: Flashcard) => {
    const updated = { ...updatedCard, updatedAt: new Date().toISOString() };
    saveFlashcard(updated);
    
    const updatedCards = cards.map(c => c.id === updated.id ? updated : c);
    setCards(updatedCards);
    setDueCards(getDueCards(updatedCards));
  }, [cards]);

  // Delete card
  const deleteCard = useCallback((id: string) => {
    const updatedCards = cards.filter(c => c.id !== id);
    saveFlashcards(updatedCards);
    setCards(updatedCards);
    setDueCards(getDueCards(updatedCards));
  }, [cards]);

  return {
    cards,
    dueCards,
    filteredDueCards,
    currentCard,
    currentIndex,
    isRevealed,
    isLoading,
    stats,
    session,
    intervalPreview,
    filters,
    availableTags,
    availableSystems,
    topicPerformance,
    revealAnswer,
    rateCard,
    nextCard,
    previousCard,
    goToCard,
    startSession,
    endSession,
    addCard,
    addCards,
    updateCard,
    deleteCard,
    refreshCards,
    setFilters,
    clearFilters,
    toggleTag,
    toggleSystem
  };
}
