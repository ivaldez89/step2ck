'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('step2_pomodoro_sessions');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setSessionsCompleted(data.count);
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSession = useCallback(() => {
    const today = new Date().toDateString();
    const newCount = sessionsCompleted + 1;
    setSessionsCompleted(newCount);
    localStorage.setItem('step2_pomodoro_sessions', JSON.stringify({
      date: today,
      count: newCount
    }));
  }, [sessionsCompleted]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      playNotificationSound();
      
      if (mode === 'focus') {
        saveSession();
        onSessionComplete?.();
        // Auto-switch to break
        const newSessions = sessionsCompleted + 1;
        if (newSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(TIMER_SETTINGS.longBreak);
        } else {
          setMode('shortBreak');
          setTimeLeft(TIMER_SETTINGS.shortBreak);
        }
      } else {
        // Break completed, back to focus
        setMode('focus');
        setTimeLeft(TIMER_SETTINGS.focus);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, saveSession, onSessionComplete, sessionsCompleted]);

  const playNotificationSound = () => {
    // Create a simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // Beep pattern
      setTimeout(() => { gainNode.gain.value = 0; }, 200);
      setTimeout(() => { gainNode.gain.value = 0.3; }, 400);
      setTimeout(() => { gainNode.gain.value = 0; }, 600);
      setTimeout(() => { gainNode.gain.value = 0.3; }, 800);
      setTimeout(() => { 
        oscillator.stop();
        audioContext.close();
      }, 1000);
    } catch (e) {
      console.log('Audio notification failed');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;

  const modeColors = {
    focus: 'from-red-500 to-orange-500',
    shortBreak: 'from-green-500 to-emerald-500',
    longBreak: 'from-blue-500 to-cyan-500',
  };

  const modeLabels = {
    focus: '🎯 Focus',
    shortBreak: '☕ Short Break',
    longBreak: '🌴 Long Break',
  };

  if (!isExpanded) {
    // Compact view
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
          isRunning 
            ? 'bg-red-100 text-red-700' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
        }`}
      >
        <span className="text-base">🍅</span>
        {isRunning ? (
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
        ) : (
          <span>Pomodoro</span>
        )}
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          🍅 Pomodoro Timer
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Today: {sessionsCompleted} 🍅
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg">
        {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === m 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative mb-4">
        {/* Progress ring */}
        <div className="w-40 h-40 mx-auto relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * progress) / 100}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={mode === 'focus' ? '#ef4444' : mode === 'shortBreak' ? '#22c55e' : '#3b82f6'} />
                <stop offset="100%" stopColor={mode === 'focus' ? '#f97316' : mode === 'shortBreak' ? '#10b981' : '#06b6d4'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900 font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-slate-500">{modeLabels[mode]}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={resetTimer}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r ${modeColors[mode]}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={() => {
            setIsRunning(false);
            if (mode === 'focus') {
              switchMode('shortBreak');
            } else {
              switchMode('focus');
            }
          }}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Skip"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center">
        Complete 4 focus sessions for a long break. {4 - (sessionsCompleted % 4)} more until long break!
      </p>
    </div>
  );
}
