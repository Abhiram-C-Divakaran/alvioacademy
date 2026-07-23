import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDownAZ, Search, Share2 } from 'lucide-react';
import { ALGO_META } from '../workspace/AlgorithmsWorkspace';
import type { AlgoType } from '../workspace/AlgorithmsWorkspace';

export default function AlgorithmsHubPage() {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const algos = (Object.keys(ALGO_META) as AlgoType[]).map((key) => ({
    id: key,
    ...ALGO_META[key],
  }));

  return (
    <div className="w-full min-h-full bg-[var(--color-bg-primary)] p-4 md:p-8 lg:p-12 text-white overflow-y-auto">
      <div className="max-w-[1200px] mx-auto space-y-12 pb-20">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Algorithms
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            Explore the core algorithms used in computer science. Master sorting, searching, and advanced techniques through interactive step-by-step visualizers.
          </p>
        </header>

        <section className="mt-12 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Algorithm Paradigms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] p-6 rounded-2xl hover:border-blue-500/50 transition-colors shadow-lg group flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-2 text-white">Dynamic Programming (DP)</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">Solves complex optimization tasks by storing the results of overlapping subproblems. It uses Arrays or Matrices as look-up tables.</p>
              <a href="/learn/algorithms/lcs" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                View DP 3D Animation →
              </a>
            </div>
            
            <div className="bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] p-6 rounded-2xl hover:border-amber-500/50 transition-colors shadow-lg group flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-2 text-white">Greedy Approach</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">Makes the locally optimal choice at each step. It is commonly used alongside Heaps and Graphs.</p>
              <a href="/learn/algorithms/activity-selection" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(217,119,6,0.4)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]">
                View Greedy 3D Animation →
              </a>
            </div>
            
            <div className="bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] p-6 rounded-2xl hover:border-emerald-500/50 transition-colors shadow-lg group flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-2 text-white">Two-Pointer & Sliding Window</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">Optimizes operations on linear structures like Arrays or Strings by using moving index markers. This avoids redundant loops.</p>
              <a href="/learn/algorithms/two-pointer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(52,211,153,0.6)]">
                View Two-Pointer 3D Animation →
              </a>
            </div>
          </div>
        </section>
        
        <h2 className="text-2xl font-bold mb-6 text-white">All Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {algos.map((algo, i) => {
            const isSorting = algo.type === 'sorting';
            const isSearching = algo.type === 'searching';
            const Icon = isSorting ? ArrowDownAZ : isSearching ? Search : Share2;
            const themeColor = isSorting 
              ? 'text-blue-400 bg-blue-500/10 group-hover:bg-blue-500' 
              : isSearching 
                ? 'text-indigo-400 bg-indigo-500/10 group-hover:bg-indigo-500'
                : 'text-amber-400 bg-amber-500/10 group-hover:bg-amber-500';
            const hoverBorder = isSorting 
              ? 'group-hover:border-blue-500/50' 
              : isSearching 
                ? 'group-hover:border-indigo-500/50'
                : 'group-hover:border-amber-500/50';

            return (
              <motion.div 
                key={algo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/learn/algorithms/${algo.id}`} className="block group">
                  <div className={`bg-[var(--color-surface-glass)] p-6 rounded-2xl border border-[var(--color-border-subtle)] ${hoverBorder} transition-all h-full hover:-translate-y-1 shadow-sm flex flex-col`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:text-white transition-colors ${themeColor}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{algo.name}</h3>
                    <p className="text-[var(--color-text-secondary)] text-sm mb-6 line-clamp-2 flex-1">
                      {algo.description}
                    </p>
                    <div className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border w-fit ${getDifficultyColor(algo.difficulty || 'Beginner')}`}>
                      {algo.difficulty || 'Beginner'}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
