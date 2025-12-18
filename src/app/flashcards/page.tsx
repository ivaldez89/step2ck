'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { FlashcardViewer } from '@/components/flashcards/FlashcardViewer';
import { AnswerButtons } from '@/components/flashcards/AnswerButtons';
import { DeckFilterPanel } from '@/components/deck/DeckFilterPanel';
import { CardEditor } from '@/components/deck/CardEditor';
import { useFlashcards } from '@/hooks/useFlashcards';

export default function FlashcardsPage() {
  const {
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
    revealAnswer,
    rateCard,
    startSession,
    endSession,
    updateCard,
    deleteCard,
    setFilters,
    clearFilters,
    previousCard,
    goToCard
  } = useFlashcards();

  const [showEditor, setShowEditor] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Auto-start session when page loads with due cards
  useEffect(() => {
    if (!isLoading && filteredDueCards.length > 0 && !session) {
      startSession();
    }
  }, [isLoading, filteredDueCards.length, session, startSession]);

  const handleEditCard = () => {
    setShowEditor(true);
  };

  const handleSaveCard = (card: typeof currentCard) => {
    if (card) {
      updateCard(card);
    }
    setShowEditor(false);
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    setShowEditor(false);
  };

  // Handle going back to previous card
  const handleBack = () => {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  };

  const hasActiveFilters = 
    filters.tags.length > 0 || 
    filters.systems.length > 0 || 
    filters.rotations.length > 0 ||
    filters.states.length > 0 ||
    filters.difficulties.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
          <p className="text-slate-500">Loading cards...</p>
        </div>
      </div>
    );
  }

  // No cards due - show completion screen
  if (filteredDueCards.length === 0) {
    return (
      <div className="min-h-screen">
        <Header stats={stats} />
        
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {hasActiveFilters && dueCards.length > 0 ? (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  No Cards Match Filters
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto mb-6">
                  You have {dueCards.length} cards due, but none match your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Clear Filters & Study All
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  All Caught Up! 🎉
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  You've reviewed all your due cards. Great work! Come back later for your next review session.
                </p>
              </>
            )}
          </div>
          
          {session && session.cardsReviewed > 0 && (
            <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm inline-block">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Session Summary
              </h2>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{session.cardsReviewed}</p>
                  <p className="text-sm text-slate-500">Reviewed</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{session.cardsCorrect}</p>
                  <p className="text-sm text-slate-500">Correct</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">{session.cardsFailed}</p>
                  <p className="text-sm text-slate-500">Again</p>
                </div>
              </div>
            </div>
          )}
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header stats={stats} />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Session progress bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {session && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 font-medium">{session.cardsCorrect}</span>
                  <span className="text-slate-400">correct</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-500 font-medium">{session.cardsFailed}</span>
                  <span className="text-slate-400">again</span>
                </div>
              </>
            )}
            
            {/* Filter indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filtered</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
            
            <button
              onClick={endSession}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <div className="mb-6">
            <DeckFilterPanel
              filters={filters}
              availableTags={availableTags}
              availableSystems={availableSystems}
              filteredCount={filteredDueCards.length}
              totalDueCount={dueCards.length}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>
        )}
        
        {/* Flashcard */}
        {currentCard && (
          <>
            <FlashcardViewer
              card={currentCard}
              isRevealed={isRevealed}
              onReveal={revealAnswer}
              onEdit={handleEditCard}
              onBack={currentIndex > 0 ? handleBack : undefined}
              cardNumber={currentIndex + 1}
              totalCards={filteredDueCards.length}
            />
            
            {/* Answer buttons - only show when revealed */}
            <AnswerButtons
              onRate={rateCard}
              disabled={!isRevealed}
              intervalPreview={intervalPreview}
            />
          </>
        )}
        
        {/* Keyboard shortcuts help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono">Space</kbd> to reveal
            <span className="mx-2">•</span>
            <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono">1-4</kbd> to rate
          </p>
        </div>
      </main>

      {/* Card Editor Modal */}
      {showEditor && currentCard && (
        <CardEditor
          card={currentCard}
          onSave={handleSaveCard}
          onCancel={() => setShowEditor(false)}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
}
