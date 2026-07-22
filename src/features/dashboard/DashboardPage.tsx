import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  BookOpen, 
  Clock, 
  Flame,
  Award,
  Box,
  BrainCircuit,
  Cpu,
  Target,
  Sparkles
} from 'lucide-react';
import RankBadge from '../../components/ui/RankBadge';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import useAuthStore from '../../stores/useAuthStore';
import useProgressStore from '../../stores/useProgressStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  
  const { stats: localStats } = useProgressStore();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="w-full min-h-full bg-[#080216] p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-300 tracking-wider uppercase font-semibold">Loading Dashboard Data</span>
        </div>
      </div>
    );
  }

  const stats = {
    topicsCompleted: localStats?.coursesCompleted || 0,
    totalTopics: localStats?.totalCourses || 8,
    timeSpentMins: localStats?.totalTimeSpent || 0,
    dayStreak: localStats?.currentStreak || 1,
    onlineUsers: 1,
    daysActive: 1
  };
  const activity: any[] = [];

  const userXp = localStats?.totalXp || 0;
  const userLevel = localStats?.levelName || 'Bronze V';
  const achievementsCount = [0, 500, 2000, 5000, 10000].filter(req => userXp >= req).length;

  // Calculate actual completion rates
  const totalCompletionPercent = Math.min(100, Math.round((stats.topicsCompleted / stats.totalTopics) * 100)) || 0;
  const dsPercent = Math.min(100, Math.round((stats.topicsCompleted / 4) * 100)) || 0;
  const algoPercent = Math.min(100, Math.round((stats.topicsCompleted / 8) * 100)) || 0;

  // Map real XP values to the line/area chart over the last week
  const activityData = [
    { name: 'Sun', value: localStats?.weeklyActivity?.[0]?.minutes || 0 },
    { name: 'Mon', value: localStats?.weeklyActivity?.[1]?.minutes || 0 },
    { name: 'Tue', value: localStats?.weeklyActivity?.[2]?.minutes || 0 },
    { name: 'Wed', value: localStats?.weeklyActivity?.[3]?.minutes || 0 },
    { name: 'Thu', value: localStats?.weeklyActivity?.[4]?.minutes || 0 },
    { name: 'Fri', value: localStats?.weeklyActivity?.[5]?.minutes || 0 },
    { name: 'Sat', value: localStats?.weeklyActivity?.[6]?.minutes || 0 },
  ];

  return (
    <div className="w-full h-full bg-transparent p-6 md:p-8 lg:p-10 text-gray-100 font-sans">
      <div className="max-w-[1450px] mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Academy Dashboard</h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              Welcome back, <span className="text-indigo-400 font-bold">{user?.name || 'Student'}</span>. Keep building your algorithmic reflexes.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* User Rank Indicator */}
             <div className="flex items-center gap-2 bg-[#1B113B] border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
               <RankBadge level={userLevel} size={28} />
               <div className="text-left">
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Rank</div>
                 <div className="text-xs font-black text-white">{userLevel}</div>
               </div>
             </div>
             
             {/* Online Users */}
             <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-white/5 bg-white/[0.02] text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                {stats.onlineUsers || 1} online
             </div>
          </div>
        </div>

        {/* Row 1 Grid: Overview, Today's activity, Output, Calories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Overview Circle Gauge */}
          <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mastery Overview</span>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">Realtime</span>
            </div>
            
            <div className="flex items-center justify-between">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="url(#purpleGrad)" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * totalCompletionPercent) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                  <defs>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">+{totalCompletionPercent}%</span>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest">Total</span>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2 text-right">
                <div>
                  <div className="text-xs font-bold text-gray-300 flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Data Structures
                  </div>
                  <div className="text-xs font-black text-white">{dsPercent}%</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-300 flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Algorithms
                  </div>
                  <div className="text-xs font-black text-white">{algoPercent}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Today's activity */}
          <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Today's activity</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">Live</span>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="w-16 h-20 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-2xl flex flex-col items-center justify-center text-white p-2 text-center shrink-0 shadow-lg shadow-indigo-500/25">
                <Flame size={20} className="mb-1 text-yellow-300 animate-pulse" />
                <span className="text-xs font-black">{userXp.toLocaleString()}</span>
                <span className="text-[8px] font-extrabold tracking-wider uppercase opacity-80">XP</span>
              </div>
              
              <div className="space-y-2 flex-1 min-w-0">
                {activity && activity.length > 0 ? (
                  activity.slice(0, 3).map((act: any, idx: number) => (
                    <div key={idx} className="text-[11px] font-extrabold text-white flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {act.activity_type}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 italic">No recent activity. Solve problems to earn XP!</div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Output Performance Gains */}
          <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Output Metrics</span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">Analysis</span>
            </div>
            
            <div className="space-y-3">
              {/* Metric 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Cpu size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Time Spent</div>
                    <div className="text-xs font-black text-white">{Math.floor(stats.timeSpentMins / 60)}h {stats.timeSpentMins % 60}m</div>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Award size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Milestones</div>
                    <div className="text-xs font-black text-white">{achievementsCount} Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Milestones Semi-Circle */}
          <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Target Streak</span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">Live</span>
            </div>
            
            <div className="relative w-full h-16 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-24 absolute top-0" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#818cf8" strokeWidth="8" fill="none" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (stats.dayStreak ? Math.min(10, stats.dayStreak) * 10 : 20)) / 100} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-lg font-black text-white">{stats.dayStreak || 0} Days</span>
                <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest">Active Streak</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2 Grid: Recommended, Weekly chart, Goal, AI Mentors */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column (Recommended & Goals) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Recommended Activity */}
            <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended modules</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">Daily</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Linked Lists 3D Representation', desc: 'Active node pointers and memory cells', points: '+50 XP', bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', path: '/learn/linked-list' },
                  { name: 'Stack & Queue Logic', desc: 'Visualize sequential mechanics', points: '+100 XP', bg: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', path: '/learn/stack' },
                  { name: 'Dynamic Programming & Knapsack', desc: 'Compute optimal combinations in 3D scene', points: '+200 XP', bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', path: '/learn/dynamic-programming' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate(item.path)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}>
                        <Box size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{item.name}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-400">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Goals */}
            <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Target size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Stack & Queue builder</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Learn linear sequential mechanics</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Flame size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">LCS Visualizer Stage</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Solve LCS and substring optimizations</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Weekly chart & AI Mentors) */}
          <div className="space-y-6">
            
            {/* Weekly Activity Line/Area Chart */}
            <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly XP Velocity</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">Mon - Sun</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#140D33', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}
                      formatter={(v) => [`${v} XP`, 'Gained']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                    <defs>
                      <linearGradient id="colorXp" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular AI Mentors */}
            <div className="bg-[#140D33] border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Coding Mentors</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'LLaMA 3.3', role: 'Groq Expert', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30', path: '/mock-interview' },
                  { name: 'Gemini 1.5', role: 'System Mentor', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30', path: '/ai-tutor' },
                  { name: 'Claude 3.5', role: 'Optimizer', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', path: '/coding' }
                ].map((mentor, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate(mentor.path)}
                    className={`p-3 rounded-2xl bg-gradient-to-br ${mentor.color} border text-center space-y-2 cursor-pointer hover:scale-[1.03] transition-all`}
                  >
                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white mx-auto shadow-inner">
                      <BrainCircuit size={14} />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-white truncate">{mentor.name}</div>
                      <div className="text-[8px] font-bold text-gray-300 mt-0.5 truncate">{mentor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
