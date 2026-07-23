import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Loader2, ArrowRight } from 'lucide-react';
import AlgorithmsWorkspace from '../workspace/AlgorithmsWorkspace';
import type { AlgoType } from '../workspace/AlgorithmsWorkspace';

// Smart Mapping Engine to map user queries to existing visualizers
const mapPromptToAlgo = (prompt: string): AlgoType => {
  const p = prompt.toLowerCase();
  if (p.includes('two sum') || p.includes('target sum') || p.includes('two pointer') || p.includes('sliding window')) return 'two-pointer';
  if (p.includes('bubble')) return 'bubble-sort';
  if (p.includes('merge sort')) return 'merge-sort';
  if (p.includes('quick sort')) return 'quick-sort';
  if (p.includes('insertion')) return 'insertion-sort';
  if (p.includes('selection')) return 'selection-sort';
  if (p.includes('linear search')) return 'linear-search';
  if (p.includes('binary search')) return 'binary-search';
  if (p.includes('bfs') || p.includes('breadth')) return 'bfs';
  if (p.includes('dfs') || p.includes('depth')) return 'dfs';
  if (p.includes('dijkstra') || p.includes('shortest path')) return 'dijkstra';
  if (p.includes('bellman')) return 'bellman-ford';
  if (p.includes('floyd') || p.includes('all pairs')) return 'floyd-warshall';
  if (p.includes('kruskal') || p.includes('minimum spanning') || p.includes('mst')) return 'kruskal';
  if (p.includes('prim')) return 'prim';
  if (p.includes('topological') || p.includes('course schedule') || p.includes('order')) return 'topological-sort';
  if (p.includes('knapsack') || p.includes('0/1')) return 'knapsack';
  if (p.includes('fibonacci') || p.includes('climbing stairs')) return 'fibonacci';
  if (p.includes('lcs') || p.includes('longest common subsequence')) return 'lcs';
  if (p.includes('activity') || p.includes('intervals')) return 'activity-selection';
  if (p.includes('huffman')) return 'huffman-coding';
  if (p.includes('hanoi') || p.includes('tower')) return 'hanoi';
  if (p.includes('inorder')) return 'inorder-traversal';
  if (p.includes('preorder')) return 'preorder-traversal';
  if (p.includes('postorder')) return 'postorder-traversal';
  
  // Fallbacks based on broad keywords
  if (p.includes('sort')) return 'quick-sort';
  if (p.includes('search')) return 'binary-search';
  if (p.includes('graph')) return 'bfs';
  if (p.includes('tree')) return 'inorder-traversal';
  
  // Ultimate fallback
  return 'bubble-sort'; 
};

export default function AIVisualizerPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAlgo, setActiveAlgo] = useState<AlgoType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setActiveAlgo(null);

    // Simulate AI Generation / Analysis Delay
    setTimeout(() => {
      const algo = mapPromptToAlgo(prompt);
      setActiveAlgo(algo);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-[var(--color-bg-primary)] relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {!activeAlgo ? (
          <motion.div 
            key="prompt-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
          >
            <div className="max-w-2xl w-full space-y-8 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-fuchsia-500/10 rounded-2xl mb-4 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                <Sparkles size={40} className="text-fuchsia-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">
                Ask AI to Visualize
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Type any programming problem like "Two Sum" or "Shortest Path" and let the AI generate the perfect 3D visualization to explain it.
              </p>

              <form onSubmit={handleSubmit} className="relative mt-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] rounded-2xl p-2 flex items-center shadow-xl focus-within:border-fuchsia-500/50 transition-colors">
                  <Search className="text-[var(--color-text-muted)] ml-4" size={24} />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., How does the Two Sum algorithm work?"
                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 text-lg placeholder:text-[var(--color-text-muted)]"
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                  </button>
                </div>
              </form>

              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-fuchsia-400 font-medium animate-pulse mt-4"
                >
                  AI is analyzing your problem and building the 3D scene...
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                {['Two Sum', 'Fibonacci Sequence', 'Dijkstra shortest path', 'Tower of Hanoi', 'Binary Search'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setPrompt(suggestion)}
                    className="px-4 py-2 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-sm hover:border-fuchsia-500/50 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="workspace-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative z-10 w-full h-full"
          >
            {/* A small overlay to show the prompt and a back button */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-4 bg-[var(--color-surface-glass)] backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-border-subtle)] shadow-lg">
              <button 
                onClick={() => setActiveAlgo(null)}
                className="text-[var(--color-text-secondary)] hover:text-white"
                title="Ask another question"
              >
                <Search size={20} />
              </button>
              <div className="text-white font-medium pr-2 border-l border-[var(--color-border-subtle)] pl-4">
                "{prompt}"
              </div>
              <div className="px-2 py-1 bg-fuchsia-500/20 text-fuchsia-400 text-xs font-bold rounded">
                AI Generated
              </div>
            </div>
            
            <AlgorithmsWorkspace initialAlgo={activeAlgo} viewMode="3d" filterType="all" immersive={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
