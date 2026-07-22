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
