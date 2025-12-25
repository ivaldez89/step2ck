'use client';

import { useState, useEffect, useMemo } from 'react';
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

export default function QBankPreviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Fetch questions from Supabase
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('status', 'active')
          .order('batch')
          .order('question_id');

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        setQuestions(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // Get unique batches and systems for filters
  const batches = useMemo(() => {
    const uniqueBatches = Array.from(new Set(questions.map(q => q.batch))).sort();
    return uniqueBatches;
  }, [questions]);

  const systems = useMemo(() => {
    const uniqueSystems = Array.from(new Set(questions.map(q => q.system))).sort();
    return uniqueSystems;
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedBatch !== 'all' && q.batch !== selectedBatch) return false;
      if (selectedSystem !== 'all' && q.system !== selectedSystem) return false;
      return true;
    });
  }, [questions, selectedBatch, selectedSystem]);

  // Toggle question expansion
  const toggleQuestion = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  // Left sidebar with filters
  const leftSidebar = (
    <div className={CARD_STYLES.containerWithPadding}>
      <h2 className="text-lg font-semibold text-content mb-4">Filters</h2>

      {/* Batch filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-content-secondary mb-2">
          Batch
        </label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-content focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Batches</option>
          {batches.map(batch => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
        </select>
      </div>

      {/* System filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-content-secondary mb-2">
          System
        </label>
        <select
          value={selectedSystem}
          onChange={(e) => setSelectedSystem(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-content focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Systems</option>
          {systems.map(system => (
            <option key={system} value={system}>{system}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-border">
        <div className="text-sm text-content-muted">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      </div>
    </div>
  );

  // Right sidebar with batch summary
  const rightSidebar = (
    <div className={CARD_STYLES.containerWithPadding}>
      <h2 className="text-lg font-semibold text-content mb-4">Batch Summary</h2>
      <div className="space-y-2">
        {batches.map(batch => {
          const count = questions.filter(q => q.batch === batch).length;
          return (
            <div key={batch} className="flex justify-between text-sm">
              <span className="text-content-secondary">{batch}</span>
              <span className="text-content font-medium">{count}</span>
            </div>
          );
        })}
        <div className="pt-2 border-t border-border flex justify-between text-sm font-semibold">
          <span className="text-content">Total</span>
          <span className="text-primary">{questions.length}</span>
        </div>
      </div>
    </div>
  );

  // Mobile header
  const mobileHeader = (
    <div className={CARD_STYLES.containerWithPadding}>
      <h1 className="text-xl font-bold text-content">QBank Preview</h1>
      <p className="text-sm text-content-muted mt-1">
        {questions.length} questions loaded
      </p>
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
        <div className={CARD_STYLES.containerWithPadding}>
          <h1 className="text-xl font-bold text-error mb-2">Error Loading Questions</h1>
          <p className="text-content-muted">{error}</p>
          <p className="text-sm text-content-muted mt-4">
            Make sure the questions table exists and RLS policies allow reading.
          </p>
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
      {/* Page header */}
      <div className={CARD_STYLES.containerWithPadding}>
        <h1 className="text-2xl font-bold text-content">QBank Preview</h1>
        <p className="text-content-muted mt-1">
          Read-only view of all QBank questions. Click a question to expand.
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className={CARD_STYLES.containerWithPadding}>
            <p className="text-content-muted text-center py-8">
              No questions found matching your filters.
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className={CARD_STYLES.container}
            >
              {/* Question header - clickable */}
              <button
                onClick={() => toggleQuestion(question.id)}
                className="w-full text-left p-4 hover:bg-surface-muted transition-colors rounded-t-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {question.batch}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                        {question.system}
                      </span>
                      {question.cognitive_error && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-warning/10 text-warning rounded-full">
                          {question.cognitive_error}
                        </span>
                      )}
                    </div>
                    {/* Question ID */}
                    <div className="text-xs text-content-muted mb-1">
                      {question.question_id}
                    </div>
                    {/* Stem preview */}
                    <p className="text-content line-clamp-3">
                      {question.stem.substring(0, 200)}...
                    </p>
                  </div>
                  {/* Expand indicator */}
                  <div className="text-content-muted">
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedQuestion === question.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {expandedQuestion === question.id && (
                <div className="px-4 pb-4 border-t border-border">
                  {/* Full stem */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-content-secondary mb-2">Question Stem</h3>
                    <p className="text-content whitespace-pre-wrap text-sm leading-relaxed">
                      {question.stem}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-content-secondary mb-2">Answer Choices</h3>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.label}
                          className={`p-3 rounded-lg border text-sm ${
                            option.label === question.correct_answer
                              ? 'bg-success/10 border-success text-content'
                              : 'bg-surface-muted border-border text-content'
                          }`}
                        >
                          <span className="font-semibold mr-2">{option.label}.</span>
                          {option.text}
                          {option.label === question.correct_answer && (
                            <span className="ml-2 text-success font-medium">(Correct)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-content-secondary mb-2">Explanation</h3>
                    <div className="p-3 bg-surface-muted rounded-lg">
                      <p className="text-content text-sm whitespace-pre-wrap leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-4 text-xs text-content-muted">
                      <span>Concept: {question.concept_id}</span>
                      {question.cognitive_error && (
                        <span>Cognitive Error: {question.cognitive_error}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </ThreeColumnLayout>
  );
}
