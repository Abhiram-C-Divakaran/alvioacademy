// ============================================================
// Progress Store — Zustand state for learning progress
// ============================================================
import { create } from 'zustand';
import type { LearningProgress, TopicProgress, DashboardStats, WeeklyActivity } from '../types/user';
import { dbService } from '../services/db';

interface ProgressState {
  progress: LearningProgress | null;
  stats: DashboardStats | null;
  isLoading: boolean;
}

interface ProgressActions {
  setProgress: (progress: LearningProgress) => void;
  updateTopicProgress: (topicId: string, updates: Partial<TopicProgress>) => Promise<void>;
  saveTopicQuizScore: (topicId: string, score: number) => Promise<void>;
  addTimeSpent: (minutes: number) => Promise<void>;
  addXp: (xp: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getInitialWeeklyActivity = (): WeeklyActivity[] => {
  return daysOfWeek.map((day) => ({ day, minutes: 0 }));
};

const calculateStats = (progress: LearningProgress): DashboardStats => {
  const completed = progress.topics.filter((t) => t.status === 'completed').length;
  const total = progress.topics.length;
  
  // XP: 1000 XP per completed topic + quiz scores * 10
  const baseTopicXp = completed * 1000;
  const quizXp = progress.topics.reduce((acc, t) => acc + (t.quizScore || 0) * 10, 0);
  const extraXp = (progress as any).totalXp || 0;
  const totalXp = baseTopicXp + quizXp + extraXp;

  // Level System
  let level = 1;
  let levelName = 'Novice';
  let nextLevelXp = 1000;
  if (totalXp >= 10001) {
    level = 5; levelName = 'Grandmaster'; nextLevelXp = totalXp;
  } else if (totalXp >= 6001) {
    level = 4; levelName = 'Master'; nextLevelXp = 10001;
  } else if (totalXp >= 3001) {
    level = 3; levelName = 'Scholar'; nextLevelXp = 6001;
  } else if (totalXp >= 1001) {
    level = 2; levelName = 'Apprentice'; nextLevelXp = 3001;
  }

  const weeklyActivity = (progress as any).weeklyActivity || getInitialWeeklyActivity();

  return {
    coursesCompleted: completed,
    totalCourses: total,
    totalXp,
    level,
    levelName,
    nextLevelXp,
    totalTimeSpent: progress.totalTimeSpentMinutes,
    currentStreak: progress.streak,
    weeklyActivity,
  };
};

const useProgressStore = create<ProgressState & ProgressActions>((set, get) => ({
  progress: null,
  stats: null,
  isLoading: false,

  setProgress: (progress) => {
    const stats = calculateStats(progress);
    set({ progress, stats });
  },

  updateTopicProgress: async (topicId, updates) => {
    const { progress } = get();
    if (!progress) return;

    const now = new Date().toISOString();
    const updatedTopics = progress.topics.map((t) => {
      if (t.topicId === topicId) {
        const newStatus = updates.status || t.status;
        const newPercent = updates.completionPercent !== undefined ? updates.completionPercent : t.completionPercent;
        
        return {
          ...t,
          ...updates,
          status: newPercent === 100 ? 'completed' : newStatus,
          lastAccessed: now,
        };
      }
      return t;
    });

    const updatedProgress: LearningProgress = {
      ...progress,
      topics: updatedTopics,
    };

    const stats = calculateStats(updatedProgress);
    set({ progress: updatedProgress, stats });

    // Sync to database
    try {
      await dbService.saveProgress(updatedProgress);
    } catch (err) {
      console.warn('Failed to sync progress to database:', err);
    }
  },

  saveTopicQuizScore: async (topicId, score) => {
    const { progress } = get();
    if (!progress) return;

    const now = new Date().toISOString();
    const updatedTopics = progress.topics.map((t) => {
      if (t.topicId === topicId) {
        // Taking a quiz completes the topic if they score well, or at least updates it
        const currentScore = t.quizScore;
        const newScore = currentScore === null ? score : Math.max(currentScore, score);
        
        return {
          ...t,
          status: 'completed' as const,
          completionPercent: 100,
          quizScore: newScore,
          lastAccessed: now,
        };
      }
      return t;
    });

    // Update overall score (average of completed quiz scores)
    const quizScores = updatedTopics.filter((t) => t.quizScore !== null).map((t) => t.quizScore as number);
    const overallScore = quizScores.length > 0 
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) 
      : 0;

    // Check if we should award badges based on stats calculated from topics
    const badges = [...progress.badges];
    const completedCount = updatedTopics.filter((t) => t.status === 'completed').length;
    
    if (completedCount >= 1 && !badges.some(b => b.id === 'first-steps')) {
      badges.push({
        id: 'first-steps',
        name: 'First Steps',
        description: 'Completed your first DSA topic',
        icon: 'Award',
        earnedAt: now
      });
    }

    const tempProgress = { ...progress, topics: updatedTopics };
    const tempStats = calculateStats(tempProgress);

    if (tempStats.level >= 2 && !badges.some(b => b.id === 'level-2')) {
      badges.push({ id: 'level-2', name: 'Apprentice', description: 'Reached Level 2', icon: 'Award', earnedAt: now });
    }
    if (tempStats.level >= 3 && !badges.some(b => b.id === 'level-3')) {
      badges.push({ id: 'level-3', name: 'Scholar', description: 'Reached Level 3', icon: 'Award', earnedAt: now });
    }
    if (tempStats.level >= 4 && !badges.some(b => b.id === 'level-4')) {
      badges.push({ id: 'level-4', name: 'Master', description: 'Solved the toughest coding challenges to reach Level 4', icon: 'Award', earnedAt: now });
    }
    if (tempStats.level >= 5 && !badges.some(b => b.id === 'level-5')) {
      badges.push({ id: 'level-5', name: 'Grandmaster', description: 'Attained by only a handful of elite engineers', icon: 'Award', earnedAt: now });
    }

    const updatedProgress: LearningProgress = {
      ...progress,
      topics: updatedTopics,
      overallScore,
      badges,
    };

    const stats = calculateStats(updatedProgress);
    set({ progress: updatedProgress, stats });

    // Sync to database
    try {
      await dbService.saveProgress(updatedProgress);
    } catch (err) {
      console.warn('Failed to sync progress to database:', err);
    }
  },

  addTimeSpent: async (minutes) => {
    const { progress } = get();
    if (!progress) return;

    // Get current day of week (e.g. 'Mon')
    const todayIndex = new Date().getDay();
    const todayName = daysOfWeek[todayIndex];

    const weeklyActivity = (progress as any).weeklyActivity 
      ? [...(progress as any).weeklyActivity] 
      : getInitialWeeklyActivity();
      
    const updatedWeeklyActivity = weeklyActivity.map((act) => {
      if (act.day === todayName) {
        return { ...act, minutes: act.minutes + minutes };
      }
      return act;
    });

    const updatedProgress: LearningProgress = {
      ...progress,
      totalTimeSpentMinutes: progress.totalTimeSpentMinutes + minutes,
      weeklyActivity: updatedWeeklyActivity,
    } as any;

    const stats = calculateStats(updatedProgress);
    set({ progress: updatedProgress, stats });

    // Sync to database
    try {
      await dbService.saveProgress(updatedProgress);
    } catch (err) {
      console.warn('Failed to sync progress to database:', err);
    }
  },

  addXp: async (xp) => {
    const { progress } = get();
    if (!progress) return;

    const currentXp = (progress as any).totalXp || 0;
    const updatedProgress: LearningProgress = {
      ...progress,
      totalXp: currentXp + xp,
    } as any;

    const stats = calculateStats(updatedProgress);
    set({ progress: updatedProgress, stats });

    // Sync to database
    try {
      await dbService.saveProgress(updatedProgress);
    } catch (err) {
      console.warn('Failed to sync progress to database:', err);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useProgressStore;
