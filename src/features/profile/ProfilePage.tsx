import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  GraduationCap, 
  Globe, 
  Link as LinkIcon, 
  Award, 
  BookOpen, 
  Flame,
  CheckCircle2,
  User,
  Activity,
  Edit2,
  Zap,
  TrendingUp,
  Cpu,
  Trophy,
  Star
} from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

// Function to resolve rank levels and progress to next rank
function getRankDetails(xp: number) {
  const ranks = [
    { name: 'Bronze V', minXp: 0, maxXp: 100 },
    { name: 'Bronze IV', minXp: 100, maxXp: 250 },
    { name: 'Bronze I', minXp: 250, maxXp: 500 },
    { name: 'Silver V', minXp: 500, maxXp: 800 },
    { name: 'Silver I', minXp: 800, maxXp: 1200 },
    { name: 'Gold V', minXp: 1200, maxXp: 1800 },
    { name: 'Gold I', minXp: 1800, maxXp: 2500 },
    { name: 'Platinum V', minXp: 2500, maxXp: 3500 },
    { name: 'Platinum I', minXp: 3500, maxXp: 4800 },
    { name: 'Diamond V', minXp: 4800, maxXp: 6200 },
    { name: 'Diamond I', minXp: 6200, maxXp: 7800 },
    { name: 'Crown', minXp: 7800, maxXp: 9500 },
    { name: 'Ace', minXp: 9500, maxXp: 12000 },
    { name: 'Conqueror', minXp: 12000, maxXp: 9999999 }
  ];

  const currentRankIndex = ranks.findIndex(r => xp >= r.minXp && xp < r.maxXp);
  const currentRank = ranks[currentRankIndex !== -1 ? currentRankIndex : ranks.length - 1];
  const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;

  let progress = 100;
  if (nextRank) {
    const range = currentRank.maxXp - currentRank.minXp;
    const currentProgress = xp - currentRank.minXp;
    progress = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  }

  const rankColors: Record<string, string> = {
    'Bronze': 'from-amber-700 to-amber-500 text-amber-300 border-amber-500/20',
    'Silver': 'from-slate-400 to-slate-200 text-slate-300 border-slate-300/20',
    'Gold': 'from-yellow-600 to-yellow-400 text-yellow-300 border-yellow-500/20',
    'Platinum': 'from-teal-500 to-emerald-400 text-teal-300 border-teal-500/20',
    'Diamond': 'from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/20',
    'Crown': 'from-purple-600 to-indigo-500 text-purple-300 border-purple-500/20',
    'Ace': 'from-rose-600 to-pink-500 text-rose-300 border-rose-500/20',
    'Conqueror': 'from-red-600 via-orange-500 to-yellow-400 text-red-100 border-red-500/40 animate-pulse'
  };

  const baseName = currentRank.name.split(' ')[0];
  const colorClass = rankColors[baseName] || 'from-blue-600 to-indigo-600 text-blue-300';

  return {
    current: currentRank.name,
    next: nextRank ? nextRank.name : 'Max Level',
    remainingXp: nextRank ? nextRank.minXp - xp : 0,
    progress,
    colorClass
  };
}

export default function ProfilePage() {
  const { user, token } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'activity' | 'favourites'>('overview');
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    location: '',
    university: '',
    github: '',
    linkedin: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
    fetchFavourites();
  }, [token]);

  const fetchFavourites = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile/favourites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavourites(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setEditForm({
          location: data.user.location || '',
          university: data.user.university || '',
          github: data.user.github || '',
          linkedin: data.user.linkedin || '',
          avatar_url: data.user.avatar_url || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchProfile();
        useAuthStore.setState({ user: { ...user, ...editForm } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { user: profileUser, activity, courses, solvedProblems } = profileData || { user: {}, activity: [], courses: [], solvedProblems: [] };
  
  // Stats calculations
  const totalPoints = profileUser?.xp || activity?.reduce((sum: number, a: any) => sum + (a.points || 0), 0) || 0;
  const activeDays = new Set(activity?.map((a: any) => new Date(a.created_at).toDateString())).size;
  
  const rank = getRankDetails(totalPoints);

  // Default Avatar logic
  const defaultAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${profileUser?.name}`;
  const avatarSrc = profileUser?.avatar_url || defaultAvatar;

  // Mastered topics checklist mock based on achievements
  const masteredTopics = [
    { name: 'Arrays & Dynamic Tables', completed: true, level: 'Advanced' },
    { name: 'Linked Lists & Pointers', completed: true, level: 'Intermediate' },
    { name: 'Stacks & Queue Pipelines', completed: totalPoints > 300, level: 'Intermediate' },
    { name: 'Tree Traversals & AVL Balance', completed: totalPoints > 800, level: 'Advanced' },
    { name: 'Graph Paths (Dijkstra/BFS)', completed: totalPoints > 1500, level: 'Advanced' },
    { name: 'Dynamic Programming & Memo', completed: totalPoints > 2500, level: 'Expert' },
    { name: 'Greedy Encoding & Compression', completed: totalPoints > 3500, level: 'Expert' }
  ];

  return (
    <div className="w-full min-h-full bg-[var(--color-bg-primary)] p-4 md:p-8 lg:p-12 text-white font-sans overflow-y-auto selection:bg-blue-500/30">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 pb-20">
        
        {/* LEFT COLUMN - USER CARD & STATS */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-[var(--color-surface-glass)] rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${rank.colorClass} opacity-20 blur-xl z-0`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Avatar Shield */}
              <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                <div className={`w-28 h-28 rounded-3xl overflow-hidden bg-[var(--color-bg-tertiary)] border-3 border-transparent bg-gradient-to-br ${rank.colorClass} p-1 shadow-2xl`}>
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover rounded-[22px] bg-[var(--color-bg-secondary)]" />
                </div>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg border-2 border-[var(--color-bg-primary)] cursor-pointer">
                    <Edit2 size={12} />
                  </div>
                )}
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute top-0 right-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all flex items-center gap-1.5"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}

              <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-1 tracking-tight">{profileUser?.name}</h1>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-4">{profileUser?.email}</p>

              {/* Glowing Rank Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${rank.colorClass} text-xs font-extrabold shadow-lg`}>
                <Trophy size={14} />
                {rank.current}
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div className="space-y-3 pt-6 border-t border-white/5 text-left w-full mt-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Avatar URL</label>
                    <input type="text" value={editForm.avatar_url} onChange={e => setEditForm({...editForm, avatar_url: e.target.value})} placeholder="https://..." className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Location</label>
                      <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} placeholder="Location" className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">University</label>
                      <input type="text" value={editForm.university} onChange={e => setEditForm({...editForm, university: e.target.value})} placeholder="University" className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Website / GitHub</label>
                    <input type="text" value={editForm.github} onChange={e => setEditForm({...editForm, github: e.target.value})} placeholder="URL or Username" className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">LinkedIn</label>
                    <input type="text" value={editForm.linkedin} onChange={e => setEditForm({...editForm, linkedin: e.target.value})} placeholder="URL or Username" className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button onClick={handleSaveProfile} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">Save</button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[#4a4a4a] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors border border-[var(--color-border-subtle)]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 pt-6 border-t border-white/5 text-[13px] font-medium text-[var(--color-text-muted)] w-full mt-6 text-left">
                  {profileUser?.location && (
                    <div className="flex items-center gap-3 hover:text-white transition-colors">
                      <MapPin size={16} className="text-blue-400 shrink-0" />
                      <span className="truncate">{profileUser.location}</span>
                    </div>
                  )}
                  {profileUser?.university && (
                    <div className="flex items-center gap-3 hover:text-white transition-colors">
                      <GraduationCap size={16} className="text-indigo-400 shrink-0" />
                      <span className="truncate">{profileUser.university}</span>
                    </div>
                  )}
                  {profileUser?.github && (
                    <div className="flex items-center gap-3 hover:text-white transition-colors">
                      <Globe size={16} className="text-teal-400 shrink-0" />
                      <span className="truncate text-blue-400 hover:underline cursor-pointer">{profileUser.github}</span>
                    </div>
                  )}
                  {profileUser?.linkedin && (
                    <div className="flex items-center gap-3 hover:text-white transition-colors">
                      <LinkIcon size={16} className="text-pink-400 shrink-0" />
                      <span className="truncate text-blue-400 hover:underline cursor-pointer">{profileUser.linkedin}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Level Progress Tracker */}
          <div className="bg-[var(--color-surface-glass)] rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Level Progress</span>
              <span className="text-xs font-bold text-blue-400">{rank.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${rank.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${rank.colorClass} rounded-full`}
              />
            </div>
            {rank.remainingXp > 0 ? (
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                Gather <span className="text-white font-bold">{rank.remainingXp.toLocaleString()} XP</span> to reach <span className="text-indigo-300 font-bold">{rank.next}</span>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-yellow-400 animate-pulse">
                Ultimate level achieved! 🏆
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-[var(--color-surface-glass)] rounded-3xl p-6 shadow-2xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Learning Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-center relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-center gap-1.5 text-blue-400 mb-1">
                  <Zap size={16} />
                  <span className="text-2xl font-extrabold tracking-tight text-white">{totalPoints.toLocaleString()}</span>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Total XP</div>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-center relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                  <Flame size={16} className="animate-pulse" />
                  <span className="text-2xl font-extrabold tracking-tight text-white">{activeDays}</span>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Active Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - TABS & CONTENT CARDS */}
        <div className="space-y-6">
          {/* Custom Tabs Navigation */}
          <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <TrendingUp size={14} /> },
              { id: 'skills', label: 'DSA Mastery Checklist', icon: <Cpu size={14} /> },
              { id: 'activity', label: 'Activity Logs', icon: <Activity size={14} /> },
              { id: 'favourites', label: 'Favourites', icon: <Star size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Courses Status */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                      <BookOpen size={20} className="text-blue-400" /> Active Progress
                    </h2>
                    
                    {courses && courses.length > 0 ? (
                      <div className="space-y-4">
                        {courses.map((course: any, i: number) => (
                          <div key={i} className="bg-[var(--color-surface-glass)] rounded-2xl p-5 border border-white/5 hover:border-blue-500/30 transition-all hover:scale-[1.01] shadow-xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-blue-400 transition-colors text-sm">{course.course_name}</h3>
                              <span className="text-xs font-extrabold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20">{course.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[var(--color-surface-glass)] rounded-3xl p-10 border border-white/5 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/[0.02] rounded-2xl flex items-center justify-center text-[var(--color-text-muted)] mb-4 border border-white/5">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">No active courses</h3>
                        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-4">You haven't enrolled in any courses yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Leaderboard Card */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                      <Trophy size={20} className="text-yellow-400 animate-pulse" /> Live Leaderboard
                    </h2>
                    
                    <div className="bg-[var(--color-surface-glass)] rounded-2xl p-5 border border-white/5 shadow-xl space-y-3">
                      {leaderboard && leaderboard.length > 0 ? (
                        leaderboard.map((u, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                                i === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 
                                i === 1 ? 'bg-slate-300 text-black' : 
                                i === 2 ? 'bg-amber-600 text-white' : 'bg-white/5 text-gray-400'
                              }`}>
                                {i + 1}
                              </span>
                              <span className="font-bold text-sm text-gray-200">{u.name}</span>
                            </div>
                            <span className="text-xs font-extrabold text-blue-400">{u.xp?.toLocaleString()} XP</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-xs text-[var(--color-text-muted)] py-6">
                          No players registered.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Recently Solved Problems */}
                <div className="space-y-4 mt-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <CheckCircle2 size={20} className="text-green-400" /> Recently Solved
                  </h2>
                  <div className="bg-[var(--color-surface-glass)] rounded-3xl p-6 border border-white/5 shadow-2xl">
                    {solvedProblems && solvedProblems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {solvedProblems.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-green-500/30 transition-all group">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-sm text-gray-200 group-hover:text-green-400 transition-colors">{p.title}</span>
                              <span className="text-[10px] text-[var(--color-text-muted)]">
                                {new Date(p.solved_at).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {p.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-white/[0.02] rounded-2xl flex items-center justify-center text-[var(--color-text-muted)] mb-4 border border-white/5 mx-auto">
                          <CheckCircle2 size={20} />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">No problems solved yet</h3>
                        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">Start practicing data structures and algorithms to build up your profile.</p>
                      </div>
                    )}
                  </div>
                </div>
                </>
              )}

              {/* TAB 2: SKILLS CHECKLIST */}
              {activeTab === 'skills' && (
                <div className="bg-[var(--color-surface-glass)] rounded-3xl p-6 border border-white/5 shadow-2xl space-y-4">
                  <h3 className="text-base font-bold text-white mb-4">Mastered Topics Check</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {masteredTopics.map((topic, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          topic.completed 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                            : 'bg-white/[0.01] border-white/5 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            topic.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-gray-600'
                          }`}>
                            {topic.completed && <CheckCircle2 size={12} />}
                          </div>
                          <span className="text-sm font-semibold">{topic.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          topic.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'
                        }`}>
                          {topic.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITY FEED */}
              {activeTab === 'activity' && (
                <div className="bg-[var(--color-surface-glass)] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                  {activity && activity.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {activity.map((item: any, i: number) => {
                        const date = new Date(item.created_at);
                        const daysAgo = Math.floor((Date.now() - date.getTime()) / 86400000);
                        const timeString = daysAgo === 0 ? 'Today' : `${daysAgo} days ago`;
                        
                        return (
                          <div key={i} className="flex justify-between items-center px-6 py-4.5 hover:bg-white/[0.01] transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                 <CheckCircle2 size={18} />
                              </div>
                              <div>
                                <div className="text-[14px] font-bold text-white mb-0.5">{item.activity_type}</div>
                                <div className="text-[12px] text-[var(--color-text-muted)] font-medium">{timeString}</div>
                              </div>
                            </div>
                            <div className="text-[13px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-xl border border-emerald-400/20">
                              +{item.points} XP
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm font-medium text-[var(--color-text-muted)]">
                      No activity recorded yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FAVOURITES */}
              {activeTab === 'favourites' && (
                <div className="bg-[var(--color-surface-glass)] rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Star size={18} className="text-yellow-400" /> Starred Problems
                  </h3>
                  {favourites && favourites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favourites.map((fav: any, i: number) => (
                        <div key={i} className="flex flex-col justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/30 transition-all group cursor-pointer" onClick={() => window.location.href='/practice'}>
                           <div className="flex justify-between items-start">
                             <span className="font-bold text-gray-200 group-hover:text-yellow-400 transition-colors">{fav.problem_id.split('-').map((w:string)=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')}</span>
                             <Star size={14} className="text-yellow-400 fill-yellow-400" />
                           </div>
                           <div className="text-xs text-gray-500 mt-2 font-medium">Starred on {new Date(fav.created_at).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm font-medium text-[var(--color-text-muted)]">
                      No starred problems yet.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
