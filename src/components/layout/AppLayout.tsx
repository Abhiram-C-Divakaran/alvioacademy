import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[var(--color-bg-primary)] font-sans text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-56 h-[520px] w-[520px] rounded-full bg-indigo-500/[0.09] blur-[150px]" />
        <div className="absolute -right-44 top-[8%] h-[560px] w-[560px] rounded-full bg-cyan-500/[0.055] blur-[170px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.10]" />
      </div>

      <TopBar onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="relative flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
      </div>

      <button
        onClick={() => navigate('/ai-tutor')}
        className="group absolute bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(18,25,42,0.92)] text-violet-200 shadow-[0_16px_45px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-[rgba(24,32,54,0.96)] hover:text-white"
        title="Ask Alvio AI"
        aria-label="Ask Alvio AI"
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-400/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
        <BrainCircuit size={21} className="relative" />
      </button>
    </div>
  );
}
