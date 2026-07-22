import React, { useMemo } from 'react';
import Visualization3D from '../workspace/Visualization3D';
import type { DataStructure, DSANode, DSAEdge } from '../../types/dataStructures';

interface GenerativeVisualizerProps {
  data: string;
}

export function GenerativeVisualizer({ data }: GenerativeVisualizerProps) {
  const structure = useMemo<DataStructure | null>(() => {
    try {
      const parsed = JSON.parse(data);
      const type = parsed.type;

      if (type === 'graph') {
        const nodes: DSANode[] = (parsed.nodes || []).map((n: string, i: number, arr: any[]) => {
          const angle = (i / arr.length) * Math.PI * 2;
          const radius = 2;
          return {
            id: String(n),
            value: String(n),
            position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 },
            state: { highlighted: false, active: false }
          };
        });

        const edges: DSAEdge[] = (parsed.edges || []).map((e: [string, string], i: number) => ({
          id: `e${i}`,
          from: String(e[0]),
          to: String(e[1]),
          directed: false,
          state: { highlighted: false, active: false }
        }));

        return { type: 'graph', nodes, edges, directed: false, weighted: false };
      }

      if (type === 'array') {
        const values = parsed.values || [];
        const elements: DSANode[] = values.map((v: any, i: number) => ({
          id: String(i),
          value: v,
          position: { x: i - (values.length - 1) / 2, y: 0, z: 0 },
          state: { highlighted: false, active: false }
        }));
        return { type: 'array', elements, capacity: Math.max(5, values.length) };
      }

      if (type === 'linked-list') {
        const values = parsed.values || [];
        const nodes = values.map((v: any, i: number) => ({
          id: String(i),
          value: v,
          position: { x: (i - (values.length - 1) / 2) * 1.5, y: 0, z: 0 },
          state: { highlighted: false, active: false },
          next: i < values.length - 1 ? String(i + 1) : null
        }));
        return { type: 'linked-list', head: nodes.length > 0 ? '0' : null, nodes };
      }

      if (type === 'binary-tree') {
        const values = parsed.values || [];
        if (values.length === 0) return null;
        
        const nodes: any[] = [];
        const buildTree = (index: number, level: number, xOffset: number): string | null => {
          if (index >= values.length || values[index] === null) return null;
          
          const id = String(index);
          const xSpacing = 2 / (level + 1);
          
          nodes.push({
            id,
            value: values[index],
            position: { x: xOffset, y: 3 - level * 1.5, z: 0 },
            state: { highlighted: false, active: false },
            left: buildTree(2 * index + 1, level + 1, xOffset - xSpacing),
            right: buildTree(2 * index + 2, level + 1, xOffset + xSpacing)
          });
          
          return id;
        };
        
        buildTree(0, 0, 0);
        return { type: 'binary-tree', root: '0', nodes };
      }

      return null;
    } catch (e) {
      console.error("Failed to parse generative 3D data", e);
      return null;
    }
  }, [data]);

  if (!structure) {
    return (
      <div className="my-4 rounded-xl overflow-hidden bg-red-900/20 border border-red-500/30 p-4 text-xs text-red-400">
        Could not generate 3D visualization. Invalid data format.
      </div>
    );
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-black/40 border border-[var(--color-border-subtle)] shadow-lg relative h-[350px] w-full pointer-events-auto">
      <div className="absolute top-2 left-3 z-10 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md shadow-sm">
        ✨ AI Generated 3D Simulation
      </div>
      <Visualization3D structure={structure} />
    </div>
  );
}
