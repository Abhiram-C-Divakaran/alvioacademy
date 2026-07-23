import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { 
  Rows3, 
  Link2, 
  Layers3, 
  ArrowRightLeft, 
  GitBranch, 
  Network, 
  Share2, 
  Hash,
  Sparkles
} from 'lucide-react';
import type { DataStructureType } from '../../types/dataStructures';
import { structureMeta } from '../workspace/dataStructureOps';

const dsItems: { type: DataStructureType; icon: React.ReactNode; path: string; difficulty: string }[] = [
  { type: 'array', icon: <Rows3 size={24} />, path: '/learn/array', difficulty: 'Beginner' },
  { type: 'linked-list', icon: <Link2 size={24} />, path: '/learn/linked-list', difficulty: 'Beginner' },
  { type: 'stack', icon: <Layers3 size={24} />, path: '/learn/stack', difficulty: 'Beginner' },
  { type: 'queue', icon: <ArrowRightLeft size={24} />, path: '/learn/queue', difficulty: 'Beginner' },
  { type: 'binary-tree', icon: <GitBranch size={24} />, path: '/learn/binary-tree', difficulty: 'Intermediate' },
  { type: 'avl-tree', icon: <Network size={24} />, path: '/learn/avl-tree', difficulty: 'Advanced' },
  { type: 'graph', icon: <Share2 size={24} />, path: '/learn/graph', difficulty: 'Advanced' },
  { type: 'hash-table', icon: <Hash size={24} />, path: '/learn/hash-table', difficulty: 'Intermediate' },
  { type: 'heap', icon: <GitBranch size={24} />, path: '/learn/heap', difficulty: 'Intermediate' },
];

export default function DataStructuresHubPage() {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="w-full min-h-full bg-[var(--color-bg-primary)] p-4 md:p-8 lg:p-12 text-white overflow-y-auto">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Data Structures
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            Explore the fundamental building blocks of computer science. Learn how data is organized, stored, and retrieved through interactive 3D visualizations.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="md:col-span-2 lg:col-span-3 xl:col-span-4"
          >

          </motion.div>

          {dsItems.map((item, i) => (
            <motion.div 
              key={item.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={item.path} className="block group">
                <div className="bg-[var(--color-surface-glass)] p-6 rounded-2xl border border-[var(--color-border-subtle)] hover:border-blue-500/50 transition-all h-full hover:-translate-y-1 shadow-sm">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{structureMeta[item.type].label}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-6 line-clamp-2">
                    {structureMeta[item.type].description}
                  </p>
                  <div className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
