'use client';

import { useState, useEffect } from 'react';
import type { ConnectionMatch, ConnectionQuestion, QuestionLevel } from '@/data/connectionQuestions';
import {
  LEVEL_DESCRIPTIONS,
  getQuestionsForLevel,
  getLevelProgress,
  isLevelComplete,
} from '@/data/connectionQuestions';
import {
  getConnection,
  getPartnerInfo,
  answerQuestion,
  consentToNextLevel,
  checkAndUnlockNextLevel,
  endConnection,
} from '@/lib/storage/connectionStorage';
import { getCurrentUserId } from '@/lib/storage/profileStorage';

interface QuestionSessionProps {
  connectionId: string;
  onClose: () => void;
  onConnectionEnded?: () => void;
}

export function QuestionSession({ connectionId, onClose, onConnectionEnded }: QuestionSessionProps) {
  const [connection, setConnection] = useState<ConnectionMatch | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ConnectionQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showAdvancePrompt, setShowAdvancePrompt] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const partner = connection ? getPartnerInfo(connectionId) : null;
  const userId = getCurrentUserId();

  useEffect(() => {
    loadConnection();
  }, [connectionId]);

  function loadConnection() {
    const conn = getConnection(connectionId);
    setConnection(conn);

    if (conn) {
      loadNextQuestion(conn);
    }
  }

  function loadNextQuestion(conn: ConnectionMatch) {
    const answeredIds = conn.answeredQuestions.map(q => q.questionId);
    const questions = getQuestionsForLevel(conn.currentLevel);

    // Find questions user hasn't answered yet
    const unanswered = questions.filter(q => {
      const questionEntry = conn.answeredQuestions.find(aq => aq.questionId === q.id);
      if (!questionEntry) return true;
      const userAnswer = questionEntry.answers.find(a => a.odId === userId);
      return !userAnswer;
    });

    if (unanswered.length > 0) {
      setCurrentQuestion(unanswered[0]);
      setShowLevelComplete(false);
      setShowAdvancePrompt(false);
    } else if (isLevelComplete(conn.currentLevel, answeredIds)) {
      setCurrentQuestion(null);

      if (conn.currentLevel >= 5) {
        setShowLevelComplete(true);
        setShowAdvancePrompt(false);
      } else {
        const unlockStatus = checkAndUnlockNextLevel(connectionId);
        if (unlockStatus.waitingForPartner) {
          setWaitingForPartner(true);
          setShowAdvancePrompt(false);
        } else if (!unlockStatus.canUnlock) {
          setShowAdvancePrompt(true);
        } else {
          // Level was unlocked, reload
          loadConnection();
        }
      }
    }
  }

  async function handleSubmitAnswer() {
    if (!answer.trim() || !currentQuestion || !connection) return;

    setIsSubmitting(true);
    answerQuestion(connectionId, currentQuestion.id, answer.trim());
    setAnswer('');
    loadConnection();
    setIsSubmitting(false);
  }

  function handleContinue(wantsToContinue: boolean) {
    consentToNextLevel(connectionId, wantsToContinue);

    if (!wantsToContinue) {
      onConnectionEnded?.();
      onClose();
    } else {
      const unlockStatus = checkAndUnlockNextLevel(connectionId);
      if (unlockStatus.waitingForPartner) {
        setWaitingForPartner(true);
        setShowAdvancePrompt(false);
      } else if (unlockStatus.canUnlock) {
        loadConnection();
      }
    }
  }

  function handleEndConnection(reason: 'not_interested' | 'too_busy' | 'other') {
    endConnection(connectionId, reason);
    onConnectionEnded?.();
    onClose();
  }

  if (!connection || !partner) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const levelInfo = LEVEL_DESCRIPTIONS[connection.currentLevel];
  const progress = getLevelProgress(
    connection.currentLevel,
    connection.answeredQuestions.map(q => q.questionId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-[#5B7B6D] to-[#7FA08F]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                {partner.name[0]}
              </div>
              <div className="text-white">
                <p className="font-medium">{partner.name}</p>
                <p className="text-sm text-white/70">Level {connection.currentLevel}: {levelInfo.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowExitConfirm(true)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>{progress.answered}/{progress.required} to unlock next level</span>
              <span>{Math.round((progress.answered / progress.required) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${Math.min((progress.answered / progress.required) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Waiting for Partner */}
          {waitingForPartner && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#5B7B6D]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#5B7B6D] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Waiting for {partner.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You&apos;ve decided to continue! We&apos;re waiting for {partner.name} to make their choice.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close for Now
              </button>
            </div>
          )}

          {/* Level Complete - Max Level */}
          {showLevelComplete && connection.currentLevel >= 5 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Congratulations!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You&apos;ve completed all 5 levels with {partner.name}! You&apos;ve built a meaningful connection.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Keep the conversation going through direct messages.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#5B7B6D] text-white font-medium rounded-lg hover:bg-[#4A6A5C] transition-colors"
              >
                Continue Connecting
              </button>
            </div>
          )}

          {/* Advance to Next Level Prompt */}
          {showAdvancePrompt && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Level {connection.currentLevel} Complete!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Great progress! Ready to go deeper with {partner.name}?
              </p>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6 text-left">
                <p className="font-medium text-slate-900 dark:text-white mb-1">
                  Level {connection.currentLevel + 1}: {LEVEL_DESCRIPTIONS[(connection.currentLevel + 1) as QuestionLevel].name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {LEVEL_DESCRIPTIONS[(connection.currentLevel + 1) as QuestionLevel].description}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleContinue(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Take a Break
                </button>
                <button
                  onClick={() => handleContinue(true)}
                  className="flex-1 px-4 py-3 bg-[#5B7B6D] text-white font-medium rounded-lg hover:bg-[#4A6A5C] transition-colors"
                >
                  Continue
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Both you and {partner.name} need to choose &quot;Continue&quot; to unlock the next level.
              </p>
            </div>
          )}

          {/* Current Question */}
          {currentQuestion && !showAdvancePrompt && !waitingForPartner && (
            <div>
              <div className="mb-4">
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-3 ${
                  currentQuestion.category === 'icebreaker' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  currentQuestion.category === 'values' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  currentQuestion.category === 'experiences' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  currentQuestion.category === 'dreams' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                </span>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.followUp && (
                  <p className="mt-2 text-sm text-slate-500 italic">
                    Follow-up: {currentQuestion.followUp}
                  </p>
                )}
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#5B7B6D] text-slate-900 dark:text-white placeholder:text-slate-400"
                rows={4}
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || isSubmitting}
                  className="px-6 py-3 bg-[#5B7B6D] text-white font-medium rounded-lg hover:bg-[#4A6A5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Sharing...' : 'Share Answer'}
                </button>
              </div>

              {/* Partner's answers (if they've answered) */}
              {connection.answeredQuestions.find(q => q.questionId === currentQuestion.id)?.answers.filter(a => a.odId !== userId).map((partnerAnswer) => (
                <div key={partnerAnswer.odId} className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#C4A77D] flex items-center justify-center text-white text-xs font-medium">
                      {partner?.name[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{partner?.name}&apos;s answer:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                    {partnerAnswer.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                End Connection?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                Are you sure you want to end this connection? {partner?.name} will receive a graceful message and won&apos;t know you ended it.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleEndConnection('too_busy')}
                  className="w-full px-4 py-2 text-left text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  I&apos;m too busy right now
                </button>
                <button
                  onClick={() => handleEndConnection('not_interested')}
                  className="w-full px-4 py-2 text-left text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Not the right match for me
                </button>
                <button
                  onClick={() => handleEndConnection('other')}
                  className="w-full px-4 py-2 text-left text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Other reason
                </button>
              </div>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full mt-4 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
