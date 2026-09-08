import { LogOut, Menu, User } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import RankBadge from '../ui/RankBadge';
import useAuthStore from '../../stores/useAuthStore';
import useProgressStore from '../../stores/useProgressStore';
import { getRankProgress } from '../../utils/rank';

const mainNavGroups = [
  { label: 'Dashboard', path: '/dashboard', matches: ['/dashboard', '/progress', '/profile'] },
  { label: 'Learn', path: '/learn', matches: ['/catalog', '/learn', '/workspace', '/video-learning', '/3d-visualizer', '/algorithms-visualizer'] },
  { label: 'Practice', path: '/coding', matches: ['/coding', '/quiz', '/workspace/pvp'] },
  { label: 'AI Tools', path: '/ai-tutor', matches: ['/ai-tutor', '/mock-interview'] },
];

export default function TopBar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const stats = useProgressStore((s) => s.stats);
  const navigate = useNavigate();
  const location = useLocation();

  const xp = stats?.totalXp || 0;
  const rank = getRankProgress(xp);

  return (
    <header
      className="topbar relative z-[100] flex h-16 shrink-0 items-center justify-between px-3 sm:px-5 lg:px-6"
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-colors hover:bg-white/[0.05] hover:text-white"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="flex shrink-0 items-center gap-2.5 rounded-xl"
          aria-label="Go to dashboard"
        >
          <Logo className="h-8 w-8" />
          <span className="hidden text-base font-extrabold tracking-[-0.025em] text-white sm:inline">Alvio</span>
        </button>

        <div className="hidden h-6 w-px bg-white/[0.065] lg:block" />

        <nav className="hidden min-w-0 items-center gap-1 md:flex">
          {mainNavGroups.map((group) => {
            const isActive = group.matches.some((match) => {
              if (match === '/workspace' && location.pathname.startsWith('/workspace/pvp')) return false;
              return location.pathname.startsWith(match);
            });

            return (
              <NavLink
                key={group.label}
                to={group.path}
                className={`rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all ${
                  isActive
                    ? 'bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.035] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {group.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/progress')}
          className="hidden items-center gap-2 rounded-xl border border-white/[0.065] bg-white/[0.028] px-3 py-2 transition-colors hover:bg-white/[0.05] lg:flex"
          title="View rank progress"
        >
          <RankBadge level={rank.name} size={22} />
          <div className="text-left leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{rank.name}</div>
            <div className="mt-0.5 text-[11px] font-bold text-[var(--color-text-secondary)]">{xp.toLocaleString()} XP</div>
          </div>
        </button>

        <div className="h-7 w-px bg-white/[0.065]" />

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition-colors hover:bg-white/[0.04]"
          title="View profile"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.05] shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <User size={15} className="text-[var(--color-text-secondary)]" />
            )}
          </div>
          <div className="hidden max-w-28 text-left sm:block">
            <p className="truncate text-xs font-bold text-white">{user?.name || 'Student'}</p>
            <p className="truncate text-[10px] font-semibold text-[var(--color-text-muted)]">Learner profile</p>
          </div>
        </button>

        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-colors hover:bg-rose-400/[0.08] hover:text-rose-300"
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
