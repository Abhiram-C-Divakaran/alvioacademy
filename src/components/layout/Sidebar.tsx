import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  BrainCircuit,
  Code2,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Sparkles,
  Swords,
  Terminal,
  TrendingUp,
  User,
  Video,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function Sidebar({ collapsed }: { collapsed?: boolean }) {
  const location = useLocation();

  const getSubNav = (): { title: string; subtitle: string; items: NavItem[] } => {
    if (['/dashboard', '/skill-tree', '/progress', '/profile'].some((path) => location.pathname.startsWith(path))) {
      return {
        title: 'Overview',
        subtitle: 'Your learning pulse',
        items: [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={17} /> },
          { label: 'My Progress', path: '/progress', icon: <TrendingUp size={17} /> },
          { label: 'My Profile', path: '/profile', icon: <User size={17} /> },
        ],
      };
    }

    if (['/coding', '/quiz', '/workspace/pvp'].some((path) => location.pathname.startsWith(path))) {
      return {
        title: 'Practice',
        subtitle: 'Train through repetition',
        items: [
          { label: 'Coding Area', path: '/coding', icon: <Terminal size={17} />, badge: 'New', badgeColor: 'bg-blue-400/10 text-blue-300 border border-blue-300/15' },
          { label: 'PvP Coding Duel', path: '/workspace/pvp', icon: <Swords size={17} />, badge: 'Live', badgeColor: 'bg-rose-400/10 text-rose-300 border border-rose-300/15' },
          { label: 'Quizzes', path: '/quiz', icon: <HelpCircle size={17} /> },
        ],
      };
    }

    if (['/catalog', '/learn', '/workspace', '/video-learning', '/3d-visualizer', '/algorithms-visualizer'].some((path) => location.pathname.startsWith(path))) {
      return {
        title: 'Learn',
        subtitle: 'Explore the curriculum',
        items: [
          { label: 'Constellation', path: '/learn', icon: <Sparkles size={17} /> },
          { label: 'Data Structures', path: '/learn/data-structures', icon: <Layers size={17} /> },
          { label: 'Algorithms', path: '/learn/algorithms', icon: <Code2 size={17} /> },
          { label: '3D Complexity', path: '/learn/complexity', icon: <TrendingUp size={17} />, badge: '3D', badgeColor: 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/15' },
          { label: 'Video Lessons', path: '/video-learning', icon: <Video size={17} />, badge: 'AI', badgeColor: 'bg-violet-400/10 text-violet-300 border border-violet-300/15' },
          { label: '3D Data Structures', path: '/3d-visualizer', icon: <Box size={17} /> },
          { label: '3D Algorithms', path: '/algorithms-visualizer', icon: <Box size={17} /> },
        ],
      };
    }

    if (['/ai-tutor', '/mock-interview', '/learn/ai-visualizer'].some((path) => location.pathname.startsWith(path))) {
      return {
        title: 'AI Tools',
        subtitle: 'Guidance on demand',
        items: [
          { label: 'AI Visualizer', path: '/learn/ai-visualizer', icon: <Sparkles size={17} />, badge: 'New', badgeColor: 'bg-violet-400/10 text-violet-300 border border-violet-300/15' },
          { label: 'AI Tutor', path: '/ai-tutor', icon: <Sparkles size={17} /> },
          { label: 'Mock Interview', path: '/mock-interview', icon: <BrainCircuit size={17} />, badge: 'New', badgeColor: 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/15' },
        ],
      };
    }

    return { title: '', subtitle: '', items: [] };
  };

  const navSection = getSubNav();

  return (
    <motion.aside
      className="sidebar sticky top-0 h-full shrink-0 overflow-hidden"
      initial={false}
      animate={{ width: collapsed ? 0 : 244, opacity: collapsed ? 0 : 1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={collapsed}
    >
      <div className="flex h-full w-[244px] flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {navSection.items.length > 0 && (
            <div>
              <div className="mb-4 px-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">{navSection.title}</p>
                <p className="mt-1 text-[11px] font-medium text-[var(--color-text-muted)]/80">{navSection.subtitle}</p>
              </div>

              <nav className="flex flex-col gap-1">
                {navSection.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isLearnActive = item.path === '/learn/data-structures'
                    && location.pathname.startsWith('/learn')
                    && !location.pathname.includes('/learn/algorithms')
                    && !['/learn', '/learn/sorting', '/learn/searching', '/learn/divide-conquer', '/learn/dynamic-programming', '/learn/greedy', '/learn/graph-algorithms'].includes(location.pathname);
                  const isAlgoActive = item.path === '/learn/algorithms'
                    && (location.pathname.startsWith('/learn/algorithms')
                      || location.pathname.startsWith('/algorithms-visualizer')
                      || ['/learn/sorting', '/learn/searching', '/learn/divide-conquer', '/learn/dynamic-programming', '/learn/greedy', '/learn/graph-algorithms'].includes(location.pathname));
                  const isReallyActive = isActive || isLearnActive || isAlgoActive;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                        isReallyActive
                          ? 'bg-white/[0.065] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-white/[0.035] hover:text-white'
                      }`}
                    >
                      {isReallyActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-300 to-cyan-300" />
                      )}

                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`shrink-0 transition-colors ${isReallyActive ? 'text-violet-300' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate text-[13px] font-semibold">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`${item.badgeColor || 'bg-white/[0.05] text-white'} ml-2 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-3.5">
            <div className="flex items-center gap-2 text-violet-300">
              <Sparkles size={14} />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em]">Alvio tip</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[var(--color-text-muted)]">
              Short, consistent sessions beat occasional marathons. Aim for one focused topic today.
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
