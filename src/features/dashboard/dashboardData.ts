import type { DashboardStats, LearningProgress, TopicProgress } from '../../types/user';
export const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const percent = (value: number) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
export const duration = (minutes: number) => minutes >= 60 ? `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m` : `${Math.round(minutes)}m`;
export const topicUrl = (topic: TopicProgress) => `/learn/${['array', 'linked-list', 'stack', 'queue', 'binary-tree', 'avl-tree', 'graph', 'hash-table', 'heap', 'sorting', 'searching', 'dynamic-programming'].includes(topic.topicId) ? topic.topicId : `topic/${encodeURIComponent(topic.topicId)}`}`;
export function relativeDate(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  return !Number.isFinite(days) ? 'Recently' : days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
}
export function dashboardData(progress: LearningProgress | null, stats: DashboardStats | null) {
  const topics = progress?.topics ?? [];
  const started = topics.filter(t => t.status !== 'not-started' || t.timeSpentMinutes > 0 || t.quizScore !== null);
  const recent = [...started].sort((a, b) => Date.parse(b.lastAccessed) - Date.parse(a.lastAccessed));
  const current = recent.find(t => t.status !== 'completed') ?? topics.find(t => t.status !== 'completed') ?? topics[0];
  const weak = [...started].sort((a, b) => (a.quizScore ?? a.completionPercent) - (b.quizScore ?? b.completionPercent))[0];
  const preferred = [...(progress?.weakAreas ?? []), ...(progress?.recommendedTopics ?? [])];
  const recommendations = [...new Set([...preferred.map(id => topics.find(t => t.topicId === id || t.topicName.toLowerCase() === id.toLowerCase())).filter((t): t is TopicProgress => !!t), ...topics.filter(t => t.status !== 'completed')])].slice(0, 3);
  const activity = weekdays.map(day => ({ day, minutes: Math.max(0, stats?.weeklyActivity.find(d => d.day === day)?.minutes ?? 0) }));
  const xp = stats?.totalXp ?? 0;
  const nextXp = stats?.nextLevelXp ?? 1000;
  return { topics, recent, current, weak, recommendations, activity, weeklyMinutes: activity.reduce((n, d) => n + d.minutes, 0), completion: topics.length ? Math.round(topics.reduce((n, t) => n + percent(t.completionPercent), 0) / topics.length) : 0, completed: topics.filter(t => t.status === 'completed').length, xp, nextXp, xpPercent: percent(xp / Math.max(1, nextXp) * 100), rank: stats?.levelName ?? 'Novice', streak: stats?.currentStreak ?? progress?.streak ?? 0, totalMinutes: stats?.totalTimeSpent ?? progress?.totalTimeSpentMinutes ?? 0, badges: progress?.badges ?? [] };
}
export type DashboardData = ReturnType<typeof dashboardData>;
