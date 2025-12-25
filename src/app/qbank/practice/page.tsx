'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThreeColumnLayout, CARD_STYLES, ThreeColumnLayoutSkeleton } from '@/components/layout/ThreeColumnLayout';
import { createClient } from '@/lib/supabase/client';

// Question type matching Supabase schema
interface Question {
  id: string;
  question_id: string;
  concept_id: string;
  batch: string;
  system: string;
  stem: string;
  options: { label: string; text: string }[];
  correct_answer: string;
  explanation: string;
  cognitive_error: string | null;
}

interface QuestionState {
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

// Format question stem with proper styling for lab values
function formatStem(stem: string): React.ReactNode {
  const lines = stem.split('\n');
  const elements: React.ReactNode[] = [];
  let inLabSection = false;
  let labValues: string[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.toLowerCase().includes('laboratory') || trimmed.toLowerCase().includes('lab studies') || trimmed.toLowerCase().includes('studies show')) {
      inLabSection = true;
      elements.push(
        <p key={`line-${idx}`} className="mt-4 mb-2 font-medium text-content dark:text-white">
          {trimmed}
        </p>
      );
      return;
    }

    const isLabValue = inLabSection && (
      trimmed.includes(':') ||
      /\d+\s*(mg|mEq|mm|g|%|\/dL|\/L|pH)/i.test(trimmed) ||
      trimmed.startsWith('•') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('*')
    );

    if (isLabValue && trimmed.length > 0) {
      const cleanValue = trimmed.replace(/^[•\-\*]\s*/, '');
      if (cleanValue.length > 0) {
        labValues.push(cleanValue);
      }
    } else {
      if (labValues.length > 0) {
        elements.push(
          <div key={`lab-${idx}`} className="my-4 p-4 bg-surface-muted dark:bg-slate-800 rounded-xl border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {labValues.map((val, i) => {
                const parts = val.split(':');
                if (parts.length === 2) {
                  return (
                    <div key={i} className="flex justify-between items-baseline py-1 border-b border-border/50 last:border-0">
                      <span className="text-content-secondary text-sm">{parts[0].trim()}</span>
                      <span className="font-medium text-content dark:text-white text-sm tabular-nums">{parts[1].trim()}</span>
                    </div>
                  );
                }
                return (
                  <div key={i} className="flex items-baseline py-1 text-sm text-content-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0 mt-1.5" />
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        );
        labValues = [];
        inLabSection = false;
      }

      if (trimmed.length > 0) {
        const isQuestion = /^(which|what|how|why|the most|the next|the best|the primary|the initial)/i.test(trimmed);

        if (isQuestion) {
          elements.push(
            <p key={`line-${idx}`} className="mt-6 pt-4 border-t border-border text-base font-medium text-content dark:text-white">
              {trimmed}
            </p>
          );
        } else {
          elements.push(
            <p key={`line-${idx}`} className="mb-3 text-base text-content-secondary dark:text-slate-300 leading-relaxed">
              {trimmed}
            </p>
          );
        }
      }
    }
  });

  if (labValues.length > 0) {
    elements.push(
      <div key="lab-final" className="my-4 p-4 bg-surface-muted dark:bg-slate-800 rounded-xl border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {labValues.map((val, i) => {
            const parts = val.split(':');
            if (parts.length === 2) {
              return (
                <div key={i} className="flex justify-between items-baseline py-1 border-b border-border/50 last:border-0">
                  <span className="text-content-secondary text-sm">{parts[0].trim()}</span>
                  <span className="font-medium text-content dark:text-white text-sm tabular-nums">{parts[1].trim()}</span>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-baseline py-1 text-sm text-content-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0 mt-1.5" />
                {val}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div className="space-y-0">{elements}</div>;
}

function QBankPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [isMarked, setIsMarked] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Timer state for timed mode
  const [timeRemaining, setTimeRemaining] = useState(0);
  const urlMode = searchParams.get('mode') || 'tutor';
  const isTimed = urlMode === 'timed';

  // Get filters from URL params
  const urlBatches = searchParams.get('batches')?.split(',').filter(Boolean) || [];
  const urlSystems = searchParams.get('systems')?.split(',').filter(Boolean) || [];
  const urlCount = parseInt(searchParams.get('count') || '0', 10);

  // Fetch questions from Supabase
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const supabase = createClient();

        let query = supabase
          .from('questions')
          .select('*')
          .eq('status', 'active');

        if (urlBatches.length > 0) {
          query = query.in('batch', urlBatches);
        }
        if (urlSystems.length > 0) {
          query = query.in('system', urlSystems);
        }

        query = query.order('batch').order('question_id');

        const { data, error } = await query;

        if (error) {
          setError(error.message);
          return;
        }

        let filteredData = data || [];
        if (urlCount > 0 && filteredData.length > urlCount) {
          filteredData = filteredData
            .sort(() => Math.random() - 0.5)
            .slice(0, urlCount);
        }

        setQuestions(filteredData);

        // Initialize timer for timed mode (90 seconds per question)
        if (isTimed && filteredData.length > 0) {
          setTimeRemaining(90);
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimed || isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit if time runs out
          handleSubmit();
          return 90; // Reset for next question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimed, isPaused, timeRemaining, currentIndex]);

  const filteredQuestions = questions;
  const currentQuestion = filteredQuestions[currentIndex];
  const currentState = currentQuestion ? questionStates[currentQuestion.id] : null;

  // Handle answer selection
  const handleSelectAnswer = useCallback((label: string) => {
    if (!currentQuestion || currentState?.isSubmitted) return;

    setQuestionStates(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selectedAnswer: label,
        isSubmitted: false,
        isCorrect: null,
      }
    }));
  }, [currentQuestion, currentState?.isSubmitted]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!currentQuestion || !questionStates[currentQuestion.id]?.selectedAnswer) return;

    const isCorrect = questionStates[currentQuestion.id].selectedAnswer === currentQuestion.correct_answer;

    setQuestionStates(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        isSubmitted: true,
        isCorrect,
      }
    }));

    // Reset timer for next question in timed mode
    if (isTimed) {
      setTimeRemaining(90);
    }
  }, [currentQuestion, questionStates, isTimed]);

  // Toggle mark for review
  const toggleMark = useCallback(() => {
    if (!currentQuestion) return;
    setIsMarked(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  }, [currentQuestion]);

  // Navigation
  const goToNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (isTimed) setTimeRemaining(90);
    }
  }, [currentIndex, filteredQuestions.length, isTimed]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (isTimed) setTimeRemaining(90);
    }
  }, [currentIndex, isTimed]);

  // End session
  const handleEndSession = () => {
    router.push('/qbank');
  };

  // Stats
  const answeredCount = filteredQuestions.filter(q => questionStates[q.id]?.isSubmitted).length;
  const correctCount = filteredQuestions.filter(q => questionStates[q.id]?.isCorrect === true).length;

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Left sidebar - Minimal progress only
  const leftSidebar = (
    <div className={CARD_STYLES.containerWithPadding}>
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-content dark:text-white">
            Q {currentIndex + 1} / {filteredQuestions.length}
          </span>
          {answeredCount > 0 && (
            <span className="text-xs text-content-muted">
              {correctCount}/{answeredCount} correct
            </span>
          )}
        </div>

        {/* Dot progress indicator */}
        <div className="flex flex-wrap gap-1">
          {filteredQuestions.map((q, idx) => {
            const state = questionStates[q.id];
            const marked = isMarked[q.id];
            const isCurrent = idx === currentIndex;

            let dotClass = 'bg-border';
            if (state?.isSubmitted) {
              dotClass = state.isCorrect ? 'bg-success' : 'bg-error';
            } else if (marked) {
              dotClass = 'bg-warning';
            } else if (isCurrent) {
              dotClass = 'bg-primary';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${dotClass} ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : 'hover:opacity-70'}`}
              />
            );
          })}
        </div>
      </div>

      {/* Flag question */}
      <button
        onClick={toggleMark}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
          currentQuestion && isMarked[currentQuestion.id]
            ? 'bg-warning/10 text-warning border border-warning'
            : 'bg-surface-muted dark:bg-slate-800 text-content-secondary border border-transparent hover:border-border'
        }`}
      >
        <svg className="w-4 h-4" fill={currentQuestion && isMarked[currentQuestion.id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        {currentQuestion && isMarked[currentQuestion.id] ? 'Flagged' : 'Flag Question'}
      </button>

      {/* Back link */}
      <Link
        href="/qbank"
        className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 text-sm text-content-muted hover:text-content transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Exit
      </Link>
    </div>
  );

  // Right sidebar - Timer and controls (minimal)
  const rightSidebar = (
    <>
      {/* Timer (timed mode only) */}
      {isTimed && (
        <div className={CARD_STYLES.containerWithPadding}>
          <div className="text-center">
            <p className={`text-3xl font-mono font-bold ${timeRemaining <= 10 ? 'text-error' : 'text-content dark:text-white'}`}>
              {formatTime(timeRemaining)}
            </p>
            <p className="text-xs text-content-muted mt-1">remaining</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={CARD_STYLES.containerWithPadding + ' space-y-2'}>
        {isTimed && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-surface-muted dark:bg-slate-800 text-content-secondary hover:bg-primary/10 hover:text-primary transition-all"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="w-full py-2.5 rounded-xl text-sm font-medium bg-surface-muted dark:bg-slate-800 text-content-secondary hover:bg-error/10 hover:text-error transition-all"
        >
          End Session
        </button>
      </div>
    </>
  );

  // Mobile header
  const mobileHeader = (
    <div className={CARD_STYLES.containerWithPadding}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-content dark:text-white">
          Q {currentIndex + 1} / {filteredQuestions.length}
        </span>
        {isTimed && (
          <span className={`font-mono font-bold ${timeRemaining <= 10 ? 'text-error' : 'text-content dark:text-white'}`}>
            {formatTime(timeRemaining)}
          </span>
        )}
        {!isTimed && answeredCount > 0 && (
          <span className="text-sm text-content-muted">
            {correctCount}/{answeredCount}
          </span>
        )}
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <ThreeColumnLayout
        isLoading={true}
        loadingContent={<ThreeColumnLayoutSkeleton />}
      >
        <div />
      </ThreeColumnLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ThreeColumnLayout>
        <div className={CARD_STYLES.containerWithPadding + ' text-center py-8'}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-content dark:text-white mb-2">Error Loading Questions</h1>
          <p className="text-content-muted">{error}</p>
        </div>
      </ThreeColumnLayout>
    );
  }

  // No questions
  if (filteredQuestions.length === 0) {
    return (
      <ThreeColumnLayout>
        <div className={CARD_STYLES.containerWithPadding + ' text-center py-12'}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-content dark:text-white mb-2">No Questions Found</h3>
          <p className="text-content-muted text-sm mb-4">
            Adjust your filters to see questions.
          </p>
          <Link href="/qbank" className="text-primary hover:underline text-sm">
            Back to QBank
          </Link>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Paused overlay
  if (isPaused) {
    return (
      <ThreeColumnLayout>
        <div className={CARD_STYLES.containerWithPadding + ' text-center py-16'}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-content dark:text-white mb-2">Session Paused</h3>
          <p className="text-content-muted text-sm mb-6">
            Your timer is paused. Click resume to continue.
          </p>
          <button
            onClick={() => setIsPaused(false)}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all"
          >
            Resume Session
          </button>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout
      mobileHeader={mobileHeader}
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
    >
      {/* End session confirmation modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-content dark:text-white mb-2">End Session?</h3>
            <p className="text-sm text-content-muted mb-4">
              You've answered {answeredCount} of {filteredQuestions.length} questions.
              {answeredCount > 0 && ` Score: ${Math.round((correctCount / answeredCount) * 100)}%`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-surface-muted dark:bg-slate-700 text-content-secondary hover:bg-border transition-all"
              >
                Continue
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-error/10 text-error hover:bg-error/20 transition-all"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Card - Clean, focused design */}
      <div className={CARD_STYLES.containerWithPadding}>
        {/* Question Stem */}
        <div className="mb-6">
          {formatStem(currentQuestion.stem)}
        </div>

        {/* Answer Options - Clean styling */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = currentState?.selectedAnswer === option.label;
            const isSubmitted = currentState?.isSubmitted;
            const isCorrect = option.label === currentQuestion.correct_answer;

            let containerClass = 'bg-surface dark:bg-slate-800 border-border hover:border-primary/50';
            let bubbleClass = 'border-border-strong text-content-muted';

            if (isSubmitted) {
              if (isCorrect) {
                containerClass = 'bg-success/5 border-success';
                bubbleClass = 'bg-success border-success text-white';
              } else if (isSelected) {
                containerClass = 'bg-error/5 border-error';
                bubbleClass = 'bg-error border-error text-white';
              } else {
                containerClass = 'bg-surface-muted dark:bg-slate-800/50 border-border opacity-60';
              }
            } else if (isSelected) {
              containerClass = 'bg-primary/5 border-primary';
              bubbleClass = 'bg-primary border-primary text-white';
            }

            return (
              <button
                key={option.label}
                onClick={() => handleSelectAnswer(option.label)}
                disabled={isSubmitted}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${containerClass} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-medium transition-all ${bubbleClass}`}>
                  {isSubmitted && isCorrect ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isSubmitted && isSelected && !isCorrect ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    option.label
                  )}
                </div>
                <p className={`flex-1 pt-2 text-base leading-relaxed ${isSubmitted && !isCorrect && !isSelected ? 'text-content-muted' : 'text-content dark:text-slate-200'}`}>
                  {option.text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!currentState?.isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!currentState?.selectedAnswer}
            className={`w-full mt-6 py-4 rounded-xl font-medium transition-all ${
              currentState?.selectedAnswer
                ? 'bg-primary hover:bg-primary-hover text-white'
                : 'bg-surface-muted dark:bg-slate-800 text-content-muted cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        )}

        {/* Explanation (shown after submit in tutor mode) */}
        {currentState?.isSubmitted && urlMode === 'tutor' && (
          <div className={`mt-6 p-5 rounded-xl border ${
            currentState.isCorrect
              ? 'bg-success/5 border-success/30'
              : 'bg-warning/5 border-warning/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {currentState.isCorrect ? (
                <span className="text-sm font-medium text-success">Correct</span>
              ) : (
                <span className="text-sm font-medium text-warning">Incorrect</span>
              )}
            </div>
            <p className="text-sm text-content-secondary dark:text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.cognitive_error && (
              <p className="mt-3 pt-3 border-t border-border text-xs text-content-muted">
                Common error: {currentQuestion.cognitive_error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation - Simplified */}
      <div className={CARD_STYLES.containerWithPadding}>
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentIndex === 0
                ? 'text-content-muted cursor-not-allowed'
                : 'text-content-secondary hover:bg-surface-muted dark:hover:bg-slate-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <span className="text-sm text-content-muted">
            {currentIndex + 1} / {filteredQuestions.length}
          </span>

          <button
            onClick={goToNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentIndex === filteredQuestions.length - 1
                ? 'bg-surface-muted dark:bg-slate-800 text-content-muted cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}

export default function QBankPracticePage() {
  return (
    <Suspense fallback={
      <ThreeColumnLayout
        isLoading={true}
        loadingContent={<ThreeColumnLayoutSkeleton />}
      >
        <div />
      </ThreeColumnLayout>
    }>
      <QBankPracticeContent />
    </Suspense>
  );
}
