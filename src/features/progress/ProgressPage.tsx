// ============================================================
// Progress Page — Dynamic Analytics
// ============================================================
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import useProgressStore from '../../stores/useProgressStore';

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'accent'; label: string }> = {
  completed: { variant: 'success', label: 'Completed' },
  'in-progress': { variant: 'warning', label: 'In Progress' },
  'not-started': { variant: 'accent', label: 'Not Started' },
};

export default function ProgressPage() {
  const progress = useProgressStore((s) => s.progress);

  if (!progress) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <p className="text-[var(--color-text-muted)] text-sm">No progress data found. Please log in.</p>
      </div>
    );
  }

  const topics = progress.topics;
  const overallProgress = Math.round(topics.reduce((s, t) => s + t.completionPercent, 0) / topics.length);
  
  const quizTopics = topics.filter((t) => t.quizScore !== null);
  const avgQuizScore = quizTopics.length > 0
    ? Math.round(quizTopics.reduce((s, t) => s + (t.quizScore ?? 0), 0) / quizTopics.length)
    : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-1">Progress Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Track your learning journey across all topics.
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <TrendingUp size={20} />, label: 'Overall Progress', value: `${overallProgress}%`, color: '#6366f1' },
          { icon: <Award size={20} />, label: 'Topics Mastered', value: `${topics.filter((t) => t.status === 'completed').length}/${topics.length}`, color: '#22c55e' },
          { icon: <Target size={20} />, label: 'Avg. Quiz Score', value: `${avgQuizScore}%`, color: '#f59e0b' },
        ].map((stat) => (
          <Card key={stat.label} padding="lg" className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}15`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Topic Progress Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} style={{ color: 'var(--color-accent-primary)' }} />
            <h3 className="font-semibold">Topic Breakdown</h3>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
          {topics.map((topic, i) => (
            <motion.div
              key={topic.topicId}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-surface-glass-hover)] transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="w-32 text-sm font-medium">{topic.topicName}</span>

              {/* Progress Bar */}
              <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--color-bg-tertiary)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: topic.completionPercent === 100
                      ? 'var(--color-success)'
                      : 'var(--gradient-accent)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.completionPercent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>

              <span className="w-12 text-right text-sm font-mono" style={{ color: 'var(--color-text-muted)' }}>
                {topic.completionPercent}%
              </span>

              <span className="w-16 text-right text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {topic.quizScore !== null ? `${topic.quizScore}%` : '—'}
              </span>

              <Badge variant={statusBadge[topic.status].variant}>
                {statusBadge[topic.status].label}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
