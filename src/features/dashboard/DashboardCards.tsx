import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Timer, CalendarDays, Sparkles, Clock3, Trophy, Flame, Target, Crown, Check, Code2, MessagesSquare, Box, GraduationCap, BarChart3 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardData } from './dashboardData';
import { duration, percent, relativeDate, topicUrl } from './dashboardData';
import type { TopicProgress } from '../../types/user';
export function ProgressBar({ value, amber = false }: {
  value: number;
  amber?: boolean;
}) {
  return <div className={`ad-progress ${amber ? 'amber' : ''}`}>
    <span style={{ width: `${percent(value)}%` }} />
  </div>;
}
export function CardTitle({ icon, children, to, label = 'View all' }: {
  icon: ReactNode;
  children: ReactNode;
  to?: string;
  label?: string;
}) {
  return <div className="ad-card-title">
    <h2>{icon}{children}</h2>{to && <Link to={to}>{label} <ArrowRight size={12} />
    </Link>}</div>;
}
export function ContinueLearningCard({ data }: {
  data: DashboardData;
}) {
  const t = data.current;
  return <section className="ad-card ad-continue">
    <div className="ad-topic-art">
      <Network size={48} />
    </div>
    <div className="ad-continue-info">
      <span className="ad-eyebrow">{t && t.completionPercent > 0 ? 'Continue learning' : 'Your learning journey'}</span>
      <h2>{t?.topicName ?? 'Build your foundations'}</h2>
      <p>{t ? `${Math.round(percent(t.completionPercent))}% of topic completed` : 'Explore data structures, one concept at a time.'}</p>
      <div className="ad-progress-label">
        <ProgressBar value={t?.completionPercent ?? 0} />
        <span>{Math.round(percent(t?.completionPercent ?? 0))}%</span>
      </div>
      <div className="ad-continue-meta">
        <span>
          <Timer size={14} />{duration(t?.timeSpentMinutes ?? 0)} studied</span>
        <span>
          <CalendarDays size={14} />{t && data.recent.some(r => r.topicId === t.topicId) ? `Last studied ${relativeDate(t.lastAccessed).toLowerCase()}` : 'Ready when you are'}</span>
      </div>
    </div>
    <div className="ad-continue-actions">
      <Link className="ad-button primary" to={t ? topicUrl(t) : '/learn'}>{t && t.completionPercent > 0 ? 'Continue learning' : 'Start learning'}<ArrowRight size={15} />
      </Link>
      <Link className="ad-button" to={t ? `/coding?topic=${encodeURIComponent(t.topicName)}` : '/coding'}>Practice problems</Link>
    </div>
  </section>;
}
export function LearningIllustration() {
  return <aside className="ad-inspiration">
    <div>Better<br />Problem Solvers<br />Build Better<br />Futures<span />
    </div>
    <svg viewBox="0 0 330 200" role="img" aria-label="A quiet coding workspace under a violet night sky">
      <defs>
        <linearGradient id="deskglow" x2="1" y2="1">
          <stop stopColor="#142e55" />
          <stop offset="1" stopColor="#171336" />
        </linearGradient>
        <linearGradient id="screenGlow" x2="1" y2="1">
          <stop stopColor="#7457ff" />
          <stop offset="1" stopColor="#29d3ee" />
        </linearGradient>
      </defs>
      <circle cx="230" cy="72" r="104" fill="url(#deskglow)" opacity=".6" />
      <g stroke="#55709c" opacity=".18">
        <path d="M35 32H310M35 78H310M35 124H310M80 0V180M156 0V180M232 0V180" />
      </g>
      <g fill="#7771ff">
        <circle cx="67" cy="52" r="1.5" />
        <circle cx="289" cy="29" r="2" />
        <circle cx="168" cy="23" r="1" />
      </g>
      <path d="M60 153H315L296 166H71Z" fill="#25324e" />
      <path d="M82 165V200M292 165V200" stroke="#17253d" strokeWidth="8" />
      <rect x="96" y="64" width="122" height="82" rx="6" fill="#0a1225" stroke="#6352ab" />
      <rect x="104" y="72" width="106" height="64" rx="2" fill="#111b37" />
      <g stroke="url(#screenGlow)" strokeWidth="3" strokeLinecap="round">
        <path d="M115 85h27m6 0h16m-49 10h13m6 0h49m-59 10h30m-21 10h44m-62 10h22" />
      </g>
      <path d="M151 146v9m-20 1h48" stroke="#454c7f" strokeWidth="5" />
      <path d="M239 96c-27 0-43 29-46 60l-28 8 7 11h73l35-21c0-38-14-58-41-58" fill="#15182e" stroke="#38316a" />
      <ellipse cx="242" cy="76" rx="22" ry="27" fill="#26283f" />
      <path d="M219 80c-10-28 2-43 21-40 18-7 32 17 24 40l-8-17-12 6-11-10-13 11" fill="#090e20" stroke="#443875" />
      <path d="M217 130c28-9 50-1 61 21v48h-67z" fill="#0a1021" stroke="#40305f" />
      <path d="M63 144h15v-22H63zM78 127h7v11h-7" fill="#172b42" stroke="#42708a" />
      <path d="M49 144h12l5-24H44z" fill="#1e2040" />
      <path d="M55 121l-9-25m10 25 8-34m-8 34-1-39" stroke="#404a81" strokeWidth="3" />
    </svg>
  </aside>;
}
export function MetricCard({ icon, title, value, children, className = '' }: {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return <section className={`ad-card ad-metric ${className}`}>
    <div className="ad-metric-icon">{icon}</div>
    <div className="ad-metric-body">
      <h2>{title}</h2>
      <strong>{value}</strong>{children}</div>
  </section>;
}
export function StreakCalendar({ data }: {
  data: DashboardData;
}) {
  return <div className="ad-streak-days">{data.activity.map(d => <div key={d.day} title={`${d.day}: ${duration(d.minutes)} recorded`}>
    <span className={d.minutes > 0 ? 'active' : ''} />
    <small>{d.day}</small>
  </div>)}</div>;
}
export function Metrics({ data }: {
  data: DashboardData;
}) {
  return <div className="ad-metrics">
    <MetricCard icon={<Target />} title="Overall progress" value={`${data.completion}%`}>
      <p>{data.completed} / {data.topics.length} topics completed</p>
      <ProgressBar value={data.completion} />
    </MetricCard>
    <MetricCard icon={<Flame />} title="Current streak" value={`${data.streak} ${data.streak === 1 ? 'day' : 'days'}`} className="fire">
      <p>{data.streak ? 'Keep it going!' : 'Start your first session'}</p>
      <StreakCalendar data={data} />
    </MetricCard>
    <MetricCard icon={<Crown />} title="XP & rank" value={`${data.xp.toLocaleString()} XP`} className="gold">
      <p>{data.rank}</p>
      <ProgressBar value={data.xpPercent} />
      <small>{data.nextXp > data.xp ? `${(data.nextXp - data.xp).toLocaleString()} XP to next level` : 'Highest level reached'}</small>
    </MetricCard>
    <MetricCard icon={<Clock3 />} title="Learning time" value={duration(data.totalMinutes)}>
      <p>Total recorded study time</p>
      <div className="ad-mini-bars">{data.activity.map(d => <div key={d.day} title={`${d.day}: ${duration(d.minutes)}`}>
        <span style={{ height: `${Math.max(2, d.minutes / Math.max(1, ...data.activity.map(v => v.minutes)) * 34)}px`, opacity: d.minutes ? 1 : .2 }} />
        <small>{d.day.slice(0, 1)}</small>
      </div>)}</div>
    </MetricCard>
  </div>;
}
export function LearningActivityChart({ data }: {
  data: DashboardData;
}) {
  return <section className="ad-card ad-chart">
    <CardTitle icon={<BarChart3 />}>Weekly learning activity</CardTitle>
    <div className="ad-chart-summary">
      <strong>{duration(data.weeklyMinutes)}</strong>
      <span>recorded across the week</span>
      <select aria-label="Activity metric" defaultValue="time">
        <option value="time">Study time</option>
      </select>
    </div>
    <div className="ad-chart-plot">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.activity} margin={{ top: 14, right: 12, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7657ff" stopOpacity={.5} />
              <stop offset="100%" stopColor="#7657ff" stopOpacity={.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#203047" vertical />
          <XAxis dataKey="day" tick={{ fill: '#a4b4cf', fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
          <YAxis tick={{ fill: '#a4b4cf', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}m`} domain={[0, 'auto']} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#101c2d', border: '1px solid #2b3956', borderRadius: 10, color: '#eff3ff' }} formatter={v => [duration(Number(v)), 'Study time']} />
          <Area type="monotone" dataKey="minutes" stroke="#9274ff" strokeWidth={2.5} fill="url(#activityFill)" dot={{ r: 3, fill: '#e5dcff', stroke: '#7657ff', strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>{!data.weeklyMinutes && <p className="ad-chart-empty">Your first study session will bring this chart to life.</p>}</section>;
}
export function SkillMasteryCard({ data }: {
  data: DashboardData;
}) {
  return <section className="ad-card ad-skills">
    <CardTitle icon={<Target />} to="/progress" label="See all">Skill mastery</CardTitle>
    <div className="ad-skill-list">{data.topics.slice(0, 8).map(t => <div className={`ad-skill-row ${data.weak?.topicId === t.topicId ? 'weak' : ''}`} key={t.topicId}>
      <Link to={topicUrl(t)}>{t.topicName}</Link>
      <ProgressBar value={t.quizScore ?? t.completionPercent} amber={data.weak?.topicId === t.topicId} />
      <span>{Math.round(percent(t.quizScore ?? t.completionPercent))}%</span>
    </div>)}</div>{!data.topics.length && <p className="ad-empty">Start a topic to see your skills grow.</p>}<p className="ad-footnote">Quiz score, or topic progress until your first quiz.</p>
    <Link className="ad-button small" to={data.weak ? `/coding?topic=${encodeURIComponent(data.weak.topicName)}` : '/learn'}>{data.weak ? 'Practice weakest skill' : 'Explore learning paths'}<ArrowRight size={13} />
    </Link>
  </section>;
}
export function RecentActivityCard({ data }: {
  data: DashboardData;
}) {
  return <section className="ad-card ad-recent">
    <CardTitle icon={<Clock3 />} to="/progress">Recent activity</CardTitle>{data.recent.slice(0, 5).map(t => <Link className="ad-activity-row" key={t.topicId} to={topicUrl(t)}>
      <span className="ad-small-icon">
        <GraduationCap size={17} />
      </span>
      <div>
        <strong>{t.quizScore !== null ? `${t.topicName} quiz` : `Studied ${t.topicName}`}</strong>
        <small>{t.quizScore !== null ? `${t.quizScore}% score` : `${duration(t.timeSpentMinutes)} total study time`}</small>
      </div>
      <time>{relativeDate(t.lastAccessed)}</time>
    </Link>)}{!data.recent.length && <div className="ad-empty illustrated">
      <Clock3 size={30} />
      <strong>A fresh start</strong>
      <p>Your study sessions and quiz results will appear here.</p>
      <Link to="/learn">Start exploring <ArrowRight size={13} />
      </Link>
    </div>}</section>;
}
export function RecommendationCard({ topic, weak }: {
  topic: TopicProgress;
  weak: boolean;
}) {
  return <article className="ad-recommendation">
    <div className="ad-recommendation-title">
      <span className="ad-small-icon">
        <Network size={23} />
      </span>
      <h3>{topic.topicName}</h3>
    </div>
    <p>{weak ? 'Strengthen this area with a focused learning session.' : topic.completionPercent > 0 ? 'Pick up where you left off and keep your momentum.' : 'Build your foundations with this next topic.'}</p>
    <span className="ad-tag">{topic.completionPercent > 0 ? 'Continue your path' : 'Ready to explore'}</span>
    <Link className="ad-button primary small" to={topicUrl(topic)}>Start learning<ArrowRight size={13} />
    </Link>
  </article>;
}
export function Recommendations({ data }: {
  data: DashboardData;
}) {
  return <section className="ad-card ad-recommendations">
    <CardTitle icon={<Sparkles />} to="/learn">Recommended next steps</CardTitle>
    <p className="ad-section-subtitle">Based on your progress and learning path</p>
    <div className="ad-three-cards">{data.recommendations.map(t => <RecommendationCard key={t.topicId} topic={t} weak={data.weak?.topicId === t.topicId} />)}</div>{!data.recommendations.length && <div className="ad-empty">
      <p>Your next challenge is waiting.</p>
      <Link className="ad-button primary" to="/learn">Explore the curriculum<ArrowRight size={14} />
      </Link>
    </div>}</section>;
}
export function AIToolsCard() {
  const items = [{ title: 'Ask AI Tutor', text: 'Get explanations tailored to your current topic.', button: 'Ask now', to: '/ai-tutor', Icon: MessagesSquare }, { title: 'Mock interview', text: 'Practice technical interview questions.', button: 'Start interview', to: '/mock-interview', Icon: Code2 }, { title: 'AI Visualizer', text: 'Turn algorithms into interactive visual explanations.', button: 'Open visualizer', to: '/learn/ai-visualizer', Icon: Box }]; return <section className="ad-card ad-ai">
    <CardTitle icon={<Sparkles />}>AI learning assistant</CardTitle>
    <p className="ad-section-subtitle">Your AI-powered study companion</p>
    <div className="ad-three-cards">{items.map(({ title, text, button, to, Icon }) => <article className="ad-tool" key={title}>
      <Icon />
      <h3>{title}</h3>
      <p>{text}</p>
      <Link className="ad-button small" to={to}>{button}<ArrowRight size={12} />
      </Link>
    </article>)}</div>
  </section>;
}
export function AchievementsCard({ data }: {
  data: DashboardData;
}) {
  return <section className="ad-card ad-achievements" id="achievements" tabIndex={-1}>
    <CardTitle icon={<Trophy />} to="/profile">Achievements</CardTitle>{data.badges.slice(-3).reverse().map(b => <div className="ad-badge" key={b.id}>
      <span className="ad-small-icon">
        <Trophy size={22} />
      </span>
      <div>
        <h3>{b.name}</h3>
        <p>{b.description}</p>
      </div>
      <Check size={16} />
    </div>)}{!data.badges.length && <div className="ad-empty">
      <Trophy size={28} />
      <strong>Your story starts here</strong>
      <p>Complete topics and quizzes to earn your first badge.</p>
    </div>}<div className="ad-rank-row">
      <Crown size={24} />
      <div>
        <h3>{data.rank}</h3>
        <small>{data.xp.toLocaleString()} / {data.nextXp.toLocaleString()} XP</small>
        <ProgressBar value={data.xpPercent} />
      </div>
    </div>
  </section>;
}
