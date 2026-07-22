import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, Search, Circle, ChevronRight, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import { codingProblems } from '../../data/codingProblems';
import type { CodingProblem } from '../../data/codingProblems';
import CodingWorkspace from './CodingWorkspace';

export default function CodingPage() {
  const [searchParams] = useSearchParams();
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('topic') || '');
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const token = useAuthStore(s => s.token);
  
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
      setSearchQuery(topic);
    }
  }, [searchParams]);

  const fetchProgress = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const completed = new Set<string>();
        data.courses?.forEach((c: any) => {
          if (c.course_name.startsWith('Completed ')) {
            completed.add(c.course_name.replace('Completed ', ''));
          }
        });
        setCompletedProblems(completed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token, selectedProblem]); // Refetch when selectedProblem goes from not-null to null (user returns from workspace)

  const filteredProblems = codingProblems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.topic && p.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-amber-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-[var(--color-text-muted)]';
    }
  };

  return (
    <div className="w-full h-full relative">
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
              onBack={() => setSelectedProblem(null)} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 p-6 md:p-10 overflow-y-auto bg-[var(--color-bg-primary)]"
          >
            <div className="max-w-[1200px] mx-auto space-y-8">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-md bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] shadow-sm">
                      <Terminal size={20} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">Coding Playground</h1>
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm font-medium mt-2 max-w-xl">
                    Practice your algorithms and data structures with real-world coding problems. Write, run, and test your solutions directly in the browser.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Problem List */}
              <div className="bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
                    <tr>
                      <th className="px-6 py-4 font-medium w-12 text-center">#</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium w-32">Difficulty</th>
                      <th className="px-6 py-4 font-medium w-24 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((problem, index) => (
                      <tr 
                        key={problem.id} 
                        className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-bg-hover)] transition-colors group cursor-pointer"
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <td className="px-6 py-4 text-center text-[var(--color-text-muted)] font-mono text-xs">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] group-hover:text-blue-400 transition-colors flex items-center gap-2">
                          {problem.title}
                          {completedProblems.has(problem.title) && <CheckCircle2 size={16} className="text-[#89d185]" />}
                        </td>
                        <td className={`px-6 py-4 font-semibold text-xs tracking-wide ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                          >
                            Solve <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProblems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                          No problems found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
