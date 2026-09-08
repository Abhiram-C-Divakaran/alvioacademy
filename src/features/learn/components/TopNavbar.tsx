import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import Logo from '../../../components/ui/Logo';
import useAuthStore from '../../../stores/useAuthStore';

export default function TopNavbar({ onToggleMenu }: { onToggleMenu?: () => void }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-[56px] flex items-center justify-between px-6 bg-[#070814] border-b border-white/[0.07] z-50 shrink-0 select-none">
      {/* Left Section */}
      <div className="flex items-center gap-5">
        <button onClick={onToggleMenu} aria-label="Toggle learning menu" className="lg:hidden text-[#8E92A8] hover:text-white transition-colors p-1 -ml-1">
          <Menu size={18} />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight">Alvio</span>
        </div>

        <nav className="hidden md:flex items-center gap-1.5 ml-5">
          <NavLink
            to="/dashboard"
            className="px-3.5 py-1 text-[13px] font-medium text-[#8E92A8] hover:text-white transition-colors"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/learn"
            className="px-4 py-1 text-[13px] font-medium text-white bg-[rgba(109,53,248,0.22)] rounded-full border border-[rgba(109,53,248,0.45)] shadow-[0_0_12px_rgba(109,53,248,0.25)] transition-colors"
          >
            Learn
          </NavLink>
          <NavLink
            to="/coding"
            className="px-3.5 py-1 text-[13px] font-medium text-[#8E92A8] hover:text-white transition-colors"
          >
            Practice
          </NavLink>
          <NavLink
            to="/ai-tutor"
            className="px-3.5 py-1 text-[13px] font-medium text-[#8E92A8] hover:text-white transition-colors"
          >
            AI Tools
          </NavLink>
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 text-[13px] font-medium">
        <div className="hidden sm:flex items-center gap-1.5 text-white">
          <span className="text-sm">🔥</span>
          <span>7 day streak</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-white">
          <span className="text-[#60a5fa] text-xs">★</span>
          <span>12880 XP</span>
          <div className="w-4 h-4 rounded bg-[#7c3aed] flex items-center justify-center text-[9px] text-white font-bold ml-0.5">
            ⬡
          </div>
        </div>

        <button onClick={() => navigate('/profile')} aria-label="Open profile" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity ml-1">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#2a2b3d] border border-white/20">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white bg-[#4f46e5]">
                {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
              </div>
            )}
          </div>
          <span className="text-[13px] text-white max-w-24 truncate">{user?.name || 'Student'}</span>
          <ChevronDown size={13} className="text-[#8E92A8]" />
        </button>
      </div>
    </header>
  );
}
