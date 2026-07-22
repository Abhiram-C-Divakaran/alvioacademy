import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-bg-primary)] text-white font-sans relative">
      <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto relative z-0">
          <Outlet />
        </main>
      </div>

      {/* AI Tutor Floating Action Button */}
      <button 
        onClick={() => navigate('/ai-tutor')}
        className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.6)] hover:scale-105 transition-all z-50 group border border-white/10"
        title="Ask AI Tutor"
      >
        <BrainCircuit size={26} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
}
