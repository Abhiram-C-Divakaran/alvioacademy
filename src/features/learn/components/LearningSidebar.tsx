import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Box,
  Code2,
  Activity,
  ArrowRight,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

export default function LearningSidebar() {
  return (
    <aside className="w-[240px] h-full flex flex-col bg-[#070814] border-r border-white/[0.06] overflow-y-auto select-none shrink-0 text-xs">
      <div className="p-3.5 flex-1 flex flex-col gap-5">
        {/* LEARNING Section */}
        <div>
          <h3 className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-[0.14em] mb-2 px-1">
            Learning
          </h3>
          <nav className="flex flex-col gap-1">
            {/* Learning Map (Active) */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-[rgba(109,53,248,0.32)] to-[rgba(79,70,229,0.12)] border border-[rgba(139,92,246,0.35)] shadow-[0_0_15px_rgba(109,53,248,0.15)] cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/30 flex items-center justify-center shrink-0 text-[#c4b5fd]">
                <Compass size={16} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white leading-tight">Learning Map</div>
                <div className="text-[10px] text-[#9ca3af] mt-0.5">Your path through DSA</div>
              </div>
            </div>

            {/* Lessons */}
            <NavLink
              to="/learn/data-structures"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-[#9ca3af] hover:text-white group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] flex items-center justify-center shrink-0 text-[#8E92A8] group-hover:text-white transition-colors">
                <BookOpen size={16} />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#e2e8f0] group-hover:text-white leading-tight">Lessons</div>
                <div className="text-[10px] text-[#6b7280] mt-0.5">Structured learning</div>
              </div>
            </NavLink>

            {/* Visual Lab */}
            <NavLink
              to="/3d-visualizer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-[#9ca3af] hover:text-white group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] flex items-center justify-center shrink-0 text-[#8E92A8] group-hover:text-white transition-colors">
                <Box size={16} />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#e2e8f0] group-hover:text-white leading-tight">Visual Lab</div>
                <div className="text-[10px] text-[#6b7280] mt-0.5">3D interactive labs</div>
              </div>
            </NavLink>

            {/* Practice */}
            <NavLink
              to="/coding"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-[#9ca3af] hover:text-white group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] flex items-center justify-center shrink-0 text-[#8E92A8] group-hover:text-white transition-colors">
                <Code2 size={16} />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#e2e8f0] group-hover:text-white leading-tight">Practice</div>
                <div className="text-[10px] text-[#6b7280] mt-0.5">Exercises & challenges</div>
              </div>
            </NavLink>

            {/* Complexity Lab */}
            <NavLink
              to="/learn/complexity"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-[#9ca3af] hover:text-white group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] flex items-center justify-center shrink-0 text-[#8E92A8] group-hover:text-white transition-colors">
                <Activity size={16} />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#e2e8f0] group-hover:text-white leading-tight">Complexity Lab</div>
                <div className="text-[10px] text-[#6b7280] mt-0.5">Analyze & compare</div>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* CATEGORIES Section */}
        <div>
          <h3 className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-[0.14em] mb-2 px-1">
            Categories
          </h3>
          <div className="flex flex-col gap-2.5 px-1">
            <div className="flex items-center justify-between text-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2fd573] flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-[13px] font-medium">Data Structures</span>
              </div>
              <span className="text-[11px] font-mono text-[#8E92A8]">6 / 12</span>
            </div>

            <div className="flex items-center justify-between text-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] ml-0.5" />
                <span className="text-[13px] font-medium ml-0.5">Algorithms</span>
              </div>
              <span className="text-[11px] font-mono text-[#8E92A8]">3 / 10</span>
            </div>
          </div>
        </div>

        {/* YOUR NEXT STEP Card */}
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-1.5 px-1 mb-2 text-[#8E92A8]">
            <Inbox size={13} className="text-[#8B5CF6]" />
            <span className="text-[11px] font-medium">Your Next Step</span>
          </div>

          <div className="bg-[#0b0d1e] border border-white/[0.08] rounded-xl p-3.5 shadow-lg">
            <h4 className="text-[13px] font-bold text-white mb-0.5">Linked Lists</h4>
            <p className="text-[11px] text-[#8E92A8] mb-3">Reverse a linked list</p>

            <NavLink to="/learn/linked-list" className="w-full py-2 rounded-lg bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
              Continue Lesson <ArrowRight size={13} />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom Level Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-[#070814]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#f59e0b]/20 border border-[#f59e0b]/50 flex items-center justify-center text-[10px]">
              🛡️
            </div>
            <span className="text-[12px] font-bold text-white">Level 8</span>
          </div>
          <span className="text-[10px] font-mono text-[#8E92A8]">420 / 800 XP</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] rounded-full w-[52%]" />
        </div>
      </div>
    </aside>
  );
}
