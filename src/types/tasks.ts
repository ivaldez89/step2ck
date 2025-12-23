// Task types for the TribeWellMD Task Manager

export type TaskCategory = 'study' | 'clinical' | 'personal' | 'wellness';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // ISO date string
  dueTime?: string; // HH:mm format
  wellnessPoints: number; // Points earned on completion
  createdAt: string;
  completedAt?: string;
  // Optional links to other features
  linkedExam?: string; // e.g., "Step 2 CK", "IM Shelf"
  linkedDeckId?: string; // Link to a flashcard deck
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'weekdays';
}

export interface TaskStats {
  totalTasks: number;
  completedToday: number;
  pendingToday: number;
  studyTasks: number;
  wellnessTasks: number;
  pointsEarnedToday: number;
  studyWellnessBalance: number; // Percentage of wellness tasks
}

// Category configuration - uses icon names that map to SVG icons in Icons.tsx
export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string; bgColor: string }> = {
  study: {
    label: 'Study',
    icon: 'Book',
    color: 'text-[#5B7B6D] dark:text-[#7FA08F]',
    bgColor: 'bg-[#E8E0D5] dark:bg-[#3D4A44]',
  },
  clinical: {
    label: 'Clinical',
    icon: 'Hospital',
    color: 'text-[#8B7355] dark:text-[#C4A77D]',
    bgColor: 'bg-[#E8E0D5] dark:bg-[#3D3832]',
  },
  personal: {
    label: 'Personal',
    icon: 'Person',
    color: 'text-[#6B7B8C] dark:text-[#9CAAB8]',
    bgColor: 'bg-[#E8E4DE] dark:bg-[#3A3F44]',
  },
  wellness: {
    label: 'Wellness',
    icon: 'Heart',
    color: 'text-[#5DB075] dark:text-[#7FC796]',
    bgColor: 'bg-[#E5EDE8] dark:bg-[#2D3D34]',
  },
};

// Priority configuration
export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-700',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  high: {
    label: 'High',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
};

// Default wellness points by category
export const DEFAULT_WELLNESS_POINTS: Record<TaskCategory, number> = {
  study: 10,
  clinical: 15,
  personal: 5,
  wellness: 20,
};
