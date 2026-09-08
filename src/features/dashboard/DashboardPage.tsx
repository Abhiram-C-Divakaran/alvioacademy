import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Flame,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import RankBadge from '../../components/ui/RankBadge';
import useAuthStore from '../../stores/useAuthStore';
import useProgressStore from '../../stores/useProgressStore';

const topicRoutes: Record<string, string> = {
  array: '/learn/array',
  arrays: '/learn/array',
  'linked list': '/learn/linked-list',
  'linked lists': '/learn/linked-list',
  stack: '/learn/stack',
  queue: '/learn/queue',
  'binary tree': '/learn/binary-tree',
  'avl tree': '/learn/avl-tree',
  graph: '/learn/graph',
  'hash table': '/learn/hash-table',
  heap: '/learn/heap',
  sorting: '/learn/sorting',
  searching: '/learn/searching',
  'dynamic programming': '/learn/dynamic-programming',
  greedy: '/learn/greedy',
  'graph algorithms': '/learn/graph-algorithms',
};

const fallbackModules = [
  {
    title: 'Linked Lists',
    description: 'Build pointer intuition with interactive node visualizations.',
    path: '/learn/linked-list',
    xp: '50 XP',
  },
  {
    title: 'Stacks & Queues',
    description: 'Practice LIFO/FIFO mechanics before moving into harder problems.',
    path: '/learn/stack',
    xp: '100 XP',
  },
  {
    title: 'Dynamic Programming',
    description: 'Train state, transition, and memoization pattern recognition.',
    path: '/learn/dynamic-programming',
    xp: '200 XP',
  },
];

function routeForTopic(name: string) {
  const normalized = name.trim().toLowerCase();
  return topicRoutes[normalized] || '/learn';
}

function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const progress = useProgressStore((s) => s.progress);
  const stats = useProgressStore((s) => s.stats);

  const topics = progress?.topics || [];
  const completedTopics = topics.filter((topic) => topic.status === 'completed').length;
  const inProgressTopics = topics.filter((topic) => topic.status === 'in-progress');
  const overallProgress = topics.length
    ? Math.round(topics.reduce((sum, topic) => sum + topic.completionPercent, 0) / topics.length)
    : 0;

  const xp = stats?.totalXp || 0;
  const level = stats?.levelName || 'Novice';
  const nextLevelXp = Math.max(stats?.nextLevelXp || 1000, xp || 1);
  const levelProgress = Math.min(100, Math.round((xp / nextLevelXp) * 100));
  const streak = stats?.currentStreak || 0;
  const totalTime = stats?.totalTimeSpent || 0;
  const weeklyActivity = stats?.weeklyActivity || [];
  const weeklyMinutes = weeklyActivity.reduce((sum, day) => sum + day.minutes, 0);

  const recommended = (progress?.recommendedTopics || []).slice(0, 3).map((name, index) => ({
    title: name,
    description: index === 0
      ? 'Recommended from your current learning profile.'
      : 'A useful next step to keep your momentum going.',
    path: routeForTopic(name),
    xp: `${50 + index * 50} XP`,
  }));
  const modules = recommended.length ? recommended : fallbackModules;

  const currentTopic = inProgressTopics[0];
  const continuePath = currentTopic ? routeForTopic(currentTopic.topicName) : '/learn';
  const continueLabel = currentTopic ? `Continue ${currentTopic.topicName}` : 'Start learning';

  const quickStats = [
    {
      label: 'Topics mastered',
      value: `${completedTopics}/${topics.length || stats?.totalCourses || 0}`,
      detail: `${overallProgress}% overall mastery`,
      icon: BookOpen,
      accent: 'text-violet-300 bg-violet-400/10 border-violet-300/15',
    },
    {
      label: 'Learning time',
      value: formatTime(totalTime),
      detail: `${weeklyMinutes}m this week`,
      icon: Clock3,
      accent: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/15',
    },
    {
      label: 'Current streak',
      value: `${streak} day${streak === 1 ? '' : 's'}`,
      detail: streak ? 'Keep the chain alive' : 'Start a streak today',
      icon: Flame,
      accent: 'text-amber-300 bg-amber-400/10 border-amber-300/15',
    },
    {
      label: 'Total XP',
      value: xp.toLocaleString(),
      detail: `${levelProgress}% to next level`,
      icon: Zap,
      accent: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/15',
    },
  ];

  return (
    <div className="relative min-h-full overflow-hidden px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-7">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute left-[8%] top-[-160px] h-[360px] w-[360px] rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[3%] top-[12%] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px] space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="eyebrow">Learning command center</span>
              <span className="h-1 w-1 rounded-full bg-violet-300/70" />
              <span className="text-[11px] font-semibold text-emerald-300">Progress synced</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
              Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-[15px]">
              Pick up where you left off, sharpen weak areas, and keep your DSA practice moving with a clear next action.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/progress')}
              className="btn btn-secondary h-11 rounded-xl px-4"
            >
              View analytics
            </button>
            <button
              onClick={() => navigate(continuePath)}
              className="btn btn-primary h-11 rounded-xl px-5"
            >
              <Play size={16} fill="currentColor" />
              {continueLabel}
            </button>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="dashboard-card p-5"
              >
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{item.label}</p>
                    <p className="mt-3 text-[26px] font-extrabold tracking-[-0.035em] text-white">{item.value}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{item.detail}</p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.accent}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="dashboard-card p-5 sm:p-6">
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">This week</p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">Learning activity</h2>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                  <Clock3 size={14} className="text-cyan-300" />
                  {weeklyMinutes} minutes logged
                </div>
              </div>

              <div className="h-[245px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyActivity} margin={{ top: 10, right: 4, left: -26, bottom: 0 }}>
                    <defs>
                      <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.34} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.045)" strokeDasharray="3 5" vertical={false} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7E879B', fontSize: 11, fontWeight: 600 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      tick={{ fill: '#697287', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{ stroke: 'rgba(167,139,250,0.18)', strokeWidth: 1 }}
                      contentStyle={{
                        background: '#111827',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '12px',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                      }}
                      labelStyle={{ color: '#AAB2C4', fontSize: 11, fontWeight: 700 }}
                      itemStyle={{ color: '#F7F8FC', fontSize: 12, fontWeight: 700 }}
                      formatter={(value) => [`${value} min`, 'Learning time']}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="#A78BFA"
                      strokeWidth={2.5}
                      fill="url(#activityFill)"
                      activeDot={{ r: 4, fill: '#C4B5FD', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-5 sm:p-6">
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Rank progression</p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">{level}</h2>
                </div>
                <RankBadge level={level} size={42} />
              </div>

              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.05em]">{xp.toLocaleString()}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">Total experience points</p>
                </div>
                <span className="rounded-lg border border-violet-300/10 bg-violet-400/[0.08] px-2.5 py-1 text-[11px] font-bold text-violet-300">
                  {levelProgress}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.055]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400"
                />
              </div>
              <p className="mt-2 text-[11px] font-medium text-[var(--color-text-muted)]">
                {Math.max(0, nextLevelXp - xp).toLocaleString()} XP until your next progression threshold
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="soft-panel p-3.5">
                  <Trophy size={16} className="text-amber-300" />
                  <p className="mt-3 text-lg font-bold">{progress?.badges?.length || 0}</p>
                  <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">Badges earned</p>
                </div>
                <div className="soft-panel p-3.5">
                  <Target size={16} className="text-emerald-300" />
                  <p className="mt-3 text-lg font-bold">{inProgressTopics.length}</p>
                  <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">Active topics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="dashboard-card p-5 sm:p-6">
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Recommended next</p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">Keep your momentum</h2>
                </div>
                <button
                  onClick={() => navigate('/learn')}
                  className="hidden items-center gap-1 text-xs font-bold text-violet-300 transition-colors hover:text-violet-200 sm:flex"
                >
                  Browse all <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {modules.map((module, index) => (
                  <button
                    key={`${module.title}-${index}`}
                    onClick={() => navigate(module.path)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition-all hover:border-violet-300/15 hover:bg-white/[0.045]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.09] text-violet-300 transition-transform group-hover:scale-105">
                      <BookOpen size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-white">{module.title}</p>
                        {index === 0 && (
                          <span className="rounded-md bg-emerald-400/[0.09] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-300">Best next</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-muted)]">{module.description}</p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-xs font-bold text-violet-300">+{module.xp}</p>
                      <p className="mt-1 text-[10px] font-semibold text-[var(--color-text-muted)]">Potential reward</p>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card p-5 sm:p-6">
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-400/[0.08] text-cyan-300">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="eyebrow">AI practice layer</p>
                  <h2 className="mt-0.5 text-lg font-bold tracking-tight">Get unstuck faster</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                Use Alvio's AI tools for explanations, interview practice, and guided problem solving without leaving your learning flow.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                {[
                  { label: 'AI Tutor', sub: 'Explain concepts', path: '/ai-tutor', icon: BrainCircuit },
                  { label: 'Mock Interview', sub: 'Practice aloud', path: '/mock-interview', icon: Trophy },
                  { label: 'AI Visualizer', sub: 'See it happen', path: '/learn/ai-visualizer', icon: Sparkles },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      onClick={() => navigate(tool.path)}
                      className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition-all hover:border-cyan-300/15 hover:bg-white/[0.045]"
                    >
                      <Icon size={17} className="text-cyan-300" />
                      <p className="mt-3 text-xs font-bold text-white">{tool.label}</p>
                      <p className="mt-1 text-[10px] font-semibold text-[var(--color-text-muted)]">{tool.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
