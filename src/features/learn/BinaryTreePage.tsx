import React from 'react';
import DataStructurePageLayout from './components/DataStructurePageLayout';

export default function BinaryTreePage() {
  return (
    <DataStructurePageLayout
      type="binary-tree"
      title="Binary Tree"
      visualizerDsName="Binary Tree"
      description="A hierarchical data structure where each node has at most two children (left and right). Used for efficient searching and sorting."
      difficulty="Intermediate"
      timeComplexities={{"access":"O(log n)*","search":"O(log n)*","insert":"O(log n)*","delete":"O(log n)*"}}
      content={
      <>
        <section>
          <h2>What is a Binary Tree?</h2>
          <p>A tree whose elements have at most 2 children is called a binary tree. We typically name them the left and right child.</p>
          
          <div className="not-prose bg-[var(--color-bg-tertiary)] rounded-2xl p-8 flex flex-col items-center shadow-inner my-10 overflow-x-auto w-full border border-[var(--color-border-subtle)]">
             <div className="flex flex-col items-center relative mt-4 w-[400px]">
                
                {/* Root */}
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-primary)] border-2 border-indigo-500/80 shadow-lg flex items-center justify-center text-xl font-bold text-white z-10 relative">
                   1
                   <span className="absolute -left-12 top-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">Root</span>
                </div>

                {/* Edges Lvl 1 */}
                <svg className="absolute top-8 left-0 w-full h-24" style={{ zIndex: 0 }}>
                   <line x1="200" y1="0" x2="100" y2="80" stroke="var(--color-border-strong)" strokeWidth="2" />
                   <line x1="200" y1="0" x2="300" y2="80" stroke="var(--color-border-strong)" strokeWidth="2" />
                </svg>

                <div className="flex justify-between w-[200px] mt-8 z-10">
                   {/* Left Child */}
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-primary)] border-2 border-emerald-500/80 shadow-lg flex items-center justify-center text-xl font-bold text-white relative">
                      2
                      <span className="absolute -left-16 top-4 text-xs font-bold text-emerald-400 uppercase tracking-wider">L-Child</span>
                   </div>
                   {/* Right Child */}
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-primary)] border-2 border-rose-500/80 shadow-lg flex items-center justify-center text-xl font-bold text-white relative">
                      3
                      <span className="absolute -right-16 top-4 text-xs font-bold text-rose-400 uppercase tracking-wider">R-Child</span>
                   </div>
                </div>

                {/* Edges Lvl 2 */}
                <svg className="absolute top-28 left-0 w-full h-24" style={{ zIndex: 0 }}>
                   <line x1="100" y1="0" x2="50" y2="80" stroke="var(--color-border-strong)" strokeWidth="2" />
                   <line x1="100" y1="0" x2="150" y2="80" stroke="var(--color-border-strong)" strokeWidth="2" />
                </svg>

                <div className="flex justify-start w-[300px] mt-8 z-10 pl-6 gap-[36px]">
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-primary)] border-2 border-gray-500/80 shadow-lg flex items-center justify-center text-xl font-bold text-white relative">
                      4
                      <span className="absolute -bottom-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Leaf</span>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-[var(--color-bg-primary)] border-2 border-gray-500/80 shadow-lg flex items-center justify-center text-xl font-bold text-white relative">
                      5
                      <span className="absolute -bottom-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Leaf</span>
                   </div>
                </div>

             </div>
          </div>
        </section>

        <section>
          <h2>Binary Search Tree (BST)</h2>
          <p>A special type of binary tree where the left child is always less than the root, and the right child is always greater.</p>
        </section>
      </>
    }
    />
  );
}