import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Shuffle, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ListFilter,
  ChevronDown, 
  ChevronUp, 
  LayoutGrid, 
  Code2, 
  Database, 
  Terminal, 
  Flame, 
  Play, 
  Lock, 
  Unlock,
  Sparkles,
  Layers,
  HelpCircle,
  Crown,
  Medal,
  Shield
} from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import CodingWorkspace from './CodingWorkspace';
import type { CodingProblem } from './CodeExecutionEngine';

const TOPIC_TAGS = [
  { name: 'Array', count: 2197, value: 'Array' },
  { name: 'String', count: 880, value: 'String' },
  { name: 'Hash Table', count: 825, value: 'Hash Table' },
  { name: 'Math', count: 684, value: 'Math' },
  { name: 'Dynamic Programming', count: 666, value: 'Dynamic Programming' },
  { name: 'Sorting', count: 527, value: 'Sorting' },
  { name: 'Greedy', count: 470, value: 'Greedy' },
  { name: 'Depth-First Search', count: 344, value: 'Depth-First Search' }
];

const CATEGORIES = [
  { name: 'All Topics', icon: LayoutGrid, color: 'text-white' },
  { name: 'Algorithms', icon: Code2, color: 'text-[#feb825]' },
  { name: 'Database', icon: Database, color: 'text-[#3b82f6]' },
  { name: 'Shell', icon: Terminal, color: 'text-[#22c55e]' },
  { name: 'Concurrency', icon: Flame, color: 'text-[#a855f7]' },
  { name: 'JavaScript', icon: Code2, color: 'text-[#eab308]' },
  { name: 'pandas', icon: Layers, color: 'text-[#ec4899]' }
];

const TypewriterHeading = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
      <Terminal className="text-blue-400" size={26} />
      <span>{displayed}</span><span className="animate-pulse -ml-1 text-blue-400 font-mono">_</span>
    </h1>
  );
};

export default function CodingPage() {
  const [searchParams] = useSearchParams();
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('topic') || '');
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Todo' | 'Solved'>('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const token = useAuthStore(s => s.token);

  useEffect(() => {
    const fetchProblemsList = async () => {
      try {
        const res = await fetch('/api/problems');
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemsList();

    const topic = searchParams.get('topic');
    if (topic) {
      setSelectedTopic(topic);
    }
  }, [searchParams]);

  const fetchFullProblem = async (id: string) => {
    try {
      const res = await fetch(`/api/problems/${id}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedProblem(full);
      }
    } catch(e) {}
  };

  const fetchProgress = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const completed = new Set<string>();
        data.solvedProblems?.forEach((p: any) => {
          completed.add(p.id);
        });
        setCompletedProblems(completed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token, selectedProblem]);

  // Filter problems based on category, topic, and search query
  let filteredProblems = problems.filter(p => {
    // 1. Category Filter
    if (selectedCategory !== 'All Topics' && selectedCategory !== 'Algorithms') {
      // In this playground, non-Algorithms categories are simulated empty or subset
      return false;
    }
    
    // 2. Topic Filter
    if (selectedTopic) {
      const pTopic = p.topic ? p.topic.toLowerCase() : '';
      const sTopic = selectedTopic.toLowerCase();
      // Match general names
      if (sTopic === 'depth-first-search' || sTopic === 'depth-first search') {
        if (!pTopic.includes('dfs') && !pTopic.includes('depth') && !pTopic.includes('graph') && !pTopic.includes('tree')) return false;
      } else if (!pTopic.includes(sTopic)) {
        return false;
      }
    }

    // 3. Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTopic = p.topic && p.topic.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic) return false;
    }

    // 4. Difficulty Filter
    if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;

    // 5. Status Filter
    if (statusFilter === 'Solved' && !completedProblems.has(p.id)) return false;
    if (statusFilter === 'Todo' && completedProblems.has(p.id)) return false;

    return true;
  });

  // Apply sorting
  if (sortOrder) {
    filteredProblems = [...filteredProblems].sort((a, b) => {
      const valA = a.title;
      const valB = b.title;
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-[#2cbb5d]';
      case 'Medium': return 'text-[#feb825]';
      case 'Hard': return 'text-[#ef4747]';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    return diff === 'Medium' ? 'Med.' : diff;
  };

  // Get real-time acceptance rate from database statistics
  const getAcceptanceRate = (p: any) => {
    const submissions = p.submissions || 0;
    const accepted = p.accepted || 0;
    if (submissions === 0) {
      return '0.0%';
    }
    const percent = (accepted / submissions) * 100;
    return percent.toFixed(1) + '%';
  };

  // Progress Calculation
  const totalProblemsCount = problems.length || 4005; // Default display matches screenshot style if empty
  const solvedCount = completedProblems.size;
  const progressPercent = totalProblemsCount > 0 ? (solvedCount / totalProblemsCount) * 100 : 0;

  const handleShuffle = () => {
    if (problems.length > 0) {
      const randomIdx = Math.floor(Math.random() * problems.length);
      fetchFullProblem(problems[randomIdx].id);
    }
  };

  return (
    <div className="w-full h-full relative bg-transparent text-gray-200">
      <AnimatePresence mode="wait">
        {selectedProblem ? (
          <motion.div 
            key="workspace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0"
          >
            <CodingWorkspace 
              problem={selectedProblem} 
              problemNumber={problems.findIndex(p => p.id === selectedProblem.id) + 1 || 1}
              isSolved={completedProblems.has(selectedProblem.id)}
              onBack={() => {
                setSelectedProblem(null);
                setSearchQuery('');
              }}
              onNext={() => {
                const idx = problems.findIndex(p => p.id === selectedProblem.id);
                if (idx >= 0 && idx < problems.length - 1) fetchFullProblem(problems[idx + 1].id);
              }}
              onPrev={() => {
                const idx = problems.findIndex(p => p.id === selectedProblem.id);
                if (idx > 0) fetchFullProblem(problems[idx - 1].id);
              }}
              onShuffle={handleShuffle}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 p-6 md:p-10 overflow-y-auto relative"
          >
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none z-0" />
            <div className="absolute -top-[200px] -right-[100px] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-[20%] -left-[100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
              
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                <div className="flex flex-col gap-2">
                  <TypewriterHeading text="Coding Playground" />
                  <p className="text-gray-400 text-sm max-w-xl">
                    Master key algorithm techniques and data structures. Solve challenges and track your progress in real-time.
                  </p>
                </div>
                
                {/* Mini Stat Cards & Badge */}
                <div className="flex gap-4 items-center">
                  {/* Badge Section */}
                  {(() => {
                    const count = completedProblems.size;
                    let BadgeIcon = Shield;
                    let badgeName = "Novice";
                    let badgeColor = "border-white/10 bg-white/5 text-gray-400";
                    let glow = "hover:border-white/30";
                    
                    if (count >= 500) {
                      BadgeIcon = Crown;
                      badgeName = "Conqueror";
                      badgeColor = "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
                      glow = "shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]";
                    } else if (count >= 100) {
                      BadgeIcon = Medal;
                      badgeName = "Copper";
                      badgeColor = "border-[#b87333]/50 bg-[#b87333]/10 text-[#b87333]";
                      glow = "shadow-[0_0_15px_rgba(184,115,51,0.3)] hover:shadow-[0_0_25px_rgba(184,115,51,0.5)]";
                    }

                    return (
                      <div className={`backdrop-blur-md border rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] transition-all ${badgeColor} ${glow}`}>
                        <BadgeIcon size={28} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white">{badgeName}</span>
                      </div>
                    );
                  })()}

                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] hover:border-blue-500/30 hover:bg-white/5 transition-all">
                    <span className="text-blue-400 text-2xl font-bold">{completedProblems.size}</span>
                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Solved</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] hover:border-purple-500/30 hover:bg-white/5 transition-all">
                    <span className="text-purple-400 text-2xl font-bold">{problems.length}</span>
                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Total</span>
                  </div>
                </div>
              </div>

              {/* SEARCH & CONTROLS BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                
                {/* Search, Sort, Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/30 backdrop-blur-md border border-white/10 text-gray-200 rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-500 outline-none focus:bg-black/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-200"
                    />
                  </div>
                    <button
                      onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : (s === 'desc' ? null : 'asc'))}
                      className={`p-2.5 rounded-lg border flex items-center justify-center transition-all ${sortOrder ? 'bg-white/10 backdrop-blur-md border-white/30 text-gray-200' : 'bg-black/30 backdrop-blur-md border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                      title="Sort alphabetically"
                    >
                      <ArrowUpDown size={15} />
                    </button>
                    
                    {/* Filter Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`p-2.5 rounded-lg border flex items-center justify-center transition-all ${
                          (difficultyFilter !== 'All' || statusFilter !== 'All' || showFilterDropdown) 
                            ? 'bg-white/10 backdrop-blur-md border-white/30 text-gray-200' 
                            : 'bg-black/30 backdrop-blur-md border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                        title="Filter problems"
                      >
                        <ListFilter size={15} />
                      </button>

                      <AnimatePresence>
                        {showFilterDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full mt-2 left-0 md:left-auto md:right-0 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-4"
                          >
                            <div>
                              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Difficulty</div>
                              <div className="flex gap-2 flex-wrap">
                                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                                  <button
                                    key={d}
                                    onClick={() => setDifficultyFilter(d as any)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                      difficultyFilter === d
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                        : 'bg-transparent border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Status</div>
                              <div className="flex gap-2 flex-wrap">
                                {['All', 'Todo', 'Solved'].map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setStatusFilter(s as any)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                      statusFilter === s
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                        : 'bg-transparent border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                </div>

                {/* Progress Circle & Shuffle */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  
                  {/* Solved Progress Circle */}
                  <div className="flex items-center gap-3">
                    {/* SVG Radial Circle */}
                    <div className="relative w-7 h-7 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle 
                          cx="14" 
                          cy="14" 
                          r="12" 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="2.5" 
                          fill="transparent" 
                        />
                        <circle 
                          cx="14" 
                          cy="14" 
                          r="12" 
                          stroke="#2cbb5d" 
                          strokeWidth="2.5" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 12}
                          strokeDashoffset={2 * Math.PI * 12 * (1 - (solvedCount / (problems.length || 1)))}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      {solvedCount}/{totalProblemsCount} Solved
                    </span>
                  </div>

                  {/* Shuffle Button */}
                  <button
                    onClick={handleShuffle}
                    className="p-2.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-all active:scale-95 cursor-pointer"
                    title="Random question"
                  >
                    <Shuffle size={16} />
                  </button>

                </div>

              </div>

              {/* PROBLEMS LIST */}
              <div className="space-y-2 pt-2">
                {loading ? (
                  <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span>Loading problems...</span>
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="py-20 text-center text-gray-500 bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl">
                    <HelpCircle className="mx-auto text-gray-600 mb-2 animate-pulse" size={32} />
                    <span>No questions found matching your criteria.</span>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Header line */}
                    <div className="grid grid-cols-[30px_1fr_100px_90px] px-4 py-2.5 text-xs text-gray-500 font-medium tracking-wider select-none border-b border-white/10">
                      <div></div>
                      <div>Title</div>
                      <div className="text-right">Acceptance</div>
                      <div className="text-right">Difficulty</div>
                    </div>
                    
                    {/* Rows */}
                    <div className="space-y-1.5 mt-2">
                      {filteredProblems.map((problem, index) => {
                        const globalIndex = problems.findIndex(p => p.id === problem.id) + 1;
                        const isSolved = completedProblems.has(problem.id);
                        return (
                          <div
                            key={problem.id}
                            onClick={() => fetchFullProblem(problem.id)}
                            className="grid grid-cols-[30px_1fr_100px_90px] items-center px-4 py-3 bg-black/40 backdrop-blur-md border border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent hover:border-l-blue-500 hover:border-white/20 rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transform hover:-translate-y-[1px]"
                          >
                            {/* Status */}
                            <div className="flex items-center justify-start">
                              {isSolved ? (
                                <CheckCircle2 size={16} className="text-[#2cbb5d]" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-gray-700/60 inline-block group-hover:border-gray-500/80 transition-colors"></span>
                              )}
                            </div>

                            {/* Title */}
                            <div className="font-semibold text-[14px] text-gray-200 group-hover:text-blue-400 transition-colors truncate pr-4">
                              {globalIndex}. {problem.title}
                            </div>

                            {/* Acceptance Rate */}
                            <div className="text-right text-gray-400 text-sm font-mono font-medium">
                              {getAcceptanceRate(problem)}
                            </div>

                            {/* Difficulty */}
                            <div className={`text-right text-xs font-semibold tracking-wide ${getDifficultyColor(problem.difficulty)}`}>
                              {getDifficultyLabel(problem.difficulty)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
