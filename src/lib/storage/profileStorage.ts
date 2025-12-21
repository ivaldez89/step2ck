// User Profile Types and Storage

export type UserRole = 'premed' | 'medical-student' | 'resident' | 'fellow' | 'attending' | 'institution';

export interface UserProfile {
  id: string;
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string; // Base64 or URL
  emailVerified?: boolean; // Has user verified their .edu email

  // Role (primary user type)
  role?: UserRole;

  // Academic Info
  school?: string; // School display name (for backward compatibility)
  schoolId?: string; // Reference to school in schools.ts
  schoolType?: 'md' | 'do' | 'undergrad' | 'caribbean' | 'international';
  graduationYear?: number;
  currentYear?: 'MS1' | 'MS2' | 'MS3' | 'MS4' | 'Resident' | 'Fellow' | 'Attending' | 'Pre-Med' | 'Other';

  // Resident/Fellow specific
  pgyYear?: string;

  // Institution specific
  jobTitle?: string;

  // Interests & Specialties
  interestedSpecialties?: string[];
  studyPreferences?: {
    preferredStudyTime?: 'morning' | 'afternoon' | 'evening' | 'night';
    studyGoalMinutes?: number;
    prefersDarkMode?: boolean;
  };

  // Social
  bio?: string;
  linkedIn?: string;
  twitter?: string;

  // Privacy Settings
  profileVisibility: 'public' | 'connections' | 'private';
  showStudyStats: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalCardsStudied: number;
  totalCasesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  joinedDate: string;
}

const PROFILE_STORAGE_KEY = 'tribewellmd_user_profile';
const STATS_STORAGE_KEY = 'tribewellmd_user_stats';

// Medical specialties for selection
export const MEDICAL_SPECIALTIES = [
  'Internal Medicine',
  'Family Medicine',
  'Pediatrics',
  'Surgery',
  'Emergency Medicine',
  'Psychiatry',
  'OB/GYN',
  'Neurology',
  'Radiology',
  'Anesthesiology',
  'Dermatology',
  'Ophthalmology',
  'Orthopedics',
  'Cardiology',
  'Oncology',
  'Pathology',
  'PM&R',
  'Urology',
  'ENT',
  'Undecided'
];

// Academic year options
export const ACADEMIC_YEARS = [
  { value: 'Pre-Med', label: 'Pre-Med' },
  { value: 'MS1', label: 'MS1 (First Year)' },
  { value: 'MS2', label: 'MS2 (Second Year)' },
  { value: 'MS3', label: 'MS3 (Third Year)' },
  { value: 'MS4', label: 'MS4 (Fourth Year)' },
  { value: 'Resident', label: 'Resident' },
  { value: 'Fellow', label: 'Fellow' },
  { value: 'Attending', label: 'Attending' },
  { value: 'Other', label: 'Other' },
];

// Create a default profile for new users
export function createDefaultProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    firstName: '',
    lastName: '',
    email: '',
    profileVisibility: 'connections',
    showStudyStats: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Get user profile from localStorage
export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

// Save user profile to localStorage
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;

  try {
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

// Update specific profile fields
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const currentProfile = getUserProfile();
  if (!currentProfile) {
    // Create new profile with updates
    const newProfile = { ...createDefaultProfile(), ...updates };
    saveUserProfile(newProfile);
    return newProfile;
  }

  const updatedProfile = { ...currentProfile, ...updates };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}

// Get user stats from localStorage
export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return getDefaultStats();
  } catch (error) {
    console.error('Error loading stats:', error);
    return getDefaultStats();
  }
}

function getDefaultStats(): UserStats {
  return {
    totalCardsStudied: 0,
    totalCasesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalStudyMinutes: 0,
    joinedDate: new Date().toISOString(),
  };
}

// Save user stats
export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

// Check if user has completed profile setup
export function hasCompletedProfile(): boolean {
  const profile = getUserProfile();
  if (!profile) return false;
  return !!(profile.firstName && profile.lastName);
}

// Get user's display name
export function getDisplayName(): string {
  const profile = getUserProfile();
  if (!profile) return 'Student';
  if (profile.firstName && profile.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  if (profile.firstName) return profile.firstName;
  return 'Student';
}

// Get user's initials for avatar
export function getUserInitials(): string {
  const profile = getUserProfile();
  if (!profile) return 'S';

  const first = profile.firstName?.[0] || '';
  const last = profile.lastName?.[0] || '';

  if (first && last) return `${first}${last}`.toUpperCase();
  if (first) return first.toUpperCase();
  return 'S';
}
