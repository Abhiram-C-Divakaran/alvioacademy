// ============================================================
// User, Auth & Progress Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  animationSpeed: number;
  notifications: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ---- Progress Tracking ----

export type TopicStatus = 'not-started' | 'in-progress' | 'completed';

export interface TopicProgress {
  topicId: string;
  topicName: string;
  status: TopicStatus;
  completionPercent: number;
  timeSpentMinutes: number;
  quizScore: number | null;
  lastAccessed: string;
}

export interface LearningProgress {
  userId: string;
  topics: TopicProgress[];
  totalTimeSpentMinutes: number;
  overallScore: number;
  streak: number;
  badges: Badge[];
  weakAreas: string[];
  recommendedTopics: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface DashboardStats {
  coursesCompleted: number;
  totalCourses: number;
  totalXp: number;
  level: number;
  levelName: string;
  nextLevelXp: number;
  totalTimeSpent: number;
  currentStreak: number;
  weeklyActivity: WeeklyActivity[];
}

export interface WeeklyActivity {
  day: string;
  minutes: number;
}
