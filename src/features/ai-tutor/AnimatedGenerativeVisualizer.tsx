import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Sparkles, ContactShadows } from '@react-three/drei';
import Asteroids from '../visualizer/Asteroids';
import Array3D from '../visualizer/Array3D';
import Graph3D from '../visualizer/Graph3D';
import BinaryTree3D from '../visualizer/BinaryTree3D';
import LinkedList3D from '../visualizer/LinkedList3D';
import type { DataStructure, DSANode, DSAEdge } from '../../types/dataStructures';

interface AnimatedStep {
  values?: any[];
  nodes?: string[];
  edges?: [string, string][];
  highlight?: (number | string)[];
  description: string;
}

interface AnimatedData {
  type: string;
  steps: AnimatedStep[];
}

interface AnimatedGenerativeVisualizerProps {
  data: string;
}

export function AnimatedGenerativeVisualizer({ data }: AnimatedGenerativeVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const parsedData = useMemo<AnimatedData | null>(() => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.type || !parsed.steps || !Array.isArray(parsed.steps)) return null;
      return parsed as AnimatedData;
    } catch (e) {
      console.error("Failed to parse animated 3D data", e);
      return null;
    }
  }, [data]);

  const structure = useMemo<DataStructure | null>(() => {
    if (!parsedData || parsedData.steps.length === 0) return null;
    
    const type = parsedData.type;
    const stepIndex = Math.min(currentStep, parsedData.steps.length - 1);
    const step = parsedData.steps[stepIndex];
    const highlightSet = new Set(step.highlight || []);

    if (type === 'graph') {
      const nodesList = step.nodes || [];
      const nodes: DSANode[] = nodesList.map((n: string, i: number, arr: any[]) => {
        const angle = (i / Math.max(1, arr.length)) * Math.PI * 2;
        const radius = 2;
        return {
          id: String(n),
          value: String(n),
          position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 },
          state: { highlighted: highlightSet.has(i) || highlightSet.has(n), active: false }
        };
      });

      const edges: DSAEdge[] = (step.edges || []).map((e: [string, string], i: number) => ({
        id: `e${i}`,
        from: String(e[0]),
        to: String(e[1]),
        directed: false,
        state: { highlighted: false, active: false }
      }));

      return { type: 'graph', nodes, edges, directed: false, weighted: false };
    }

    if (type === 'array') {
      const values = step.values || [];
      const elements: DSANode[] = values.map((v: any, i: number) => ({
        id: String(i),
        value: v,
        position: { x: i - (values.length - 1) / 2, y: 0, z: 0 },
        state: { highlighted: highlightSet.has(i), active: false }
      }));
      return { type: 'array', elements, capacity: Math.max(5, values.length) };
    }

    if (type === 'linked-list') {
      const values = step.values || [];
      const nodes = values.map((v: any, i: number) => ({
        id: String(i),
        value: v,
        position: { x: (i - (values.length - 1) / 2) * 1.5, y: 0, z: 0 },
        state: { highlighted: highlightSet.has(i), active: false },
        next: i < values.length - 1 ? String(i + 1) : null
      }));
      return { type: 'linked-list', head: nodes.length > 0 ? '0' : null, nodes };
    }

    if (type === 'binary-tree') {
      const values = step.values || [];
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
          state: { highlighted: highlightSet.has(index), active: false },
          left: buildTree(2 * index + 1, level + 1, xOffset - xSpacing),
          right: buildTree(2 * index + 2, level + 1, xOffset + xSpacing)
        });
        
        return id;
      };
      
      buildTree(0, 0, 0);
      return { type: 'binary-tree', root: '0', nodes };
    }

    return null;
  }, [parsedData, currentStep]);

  if (!parsedData || !structure) {
    return (
      <div className="my-4 rounded-xl overflow-hidden bg-red-900/20 border border-red-500/30 p-4 text-xs text-red-400">
        Could not generate 3D animation. Invalid data format.
      </div>
    );
  }

  const stepCount = parsedData.steps.length;
  const currentStepData = parsedData.steps[Math.min(currentStep, stepCount - 1)];

  const render3DComponent = () => {
    if (!parsedData || !structure) return null;
    const type = parsedData.type;
    const step = parsedData.steps[Math.min(currentStep, parsedData.steps.length - 1)];
    const activeIndex = step.highlight || [];
    
    // Convert array values for linear data structures
    const linearData = step.values ? step.values.map(v => v === null ? null : (isNaN(Number(v)) ? v : Number(v))) : [];

    switch (type) {
      case 'array':
        return <Array3D data={linearData} activeIndex={activeIndex as number[]} variant="Static Array" />;
      case 'linked-list':
        return <LinkedList3D data={linearData} activeIndex={activeIndex as number[]} variant="Singly Linked" />;
      case 'binary-tree':
        return <BinaryTree3D activeIndex={activeIndex as number[]} variant="Standard BST" dsState={structure as any} />;
      case 'graph':
        return <Graph3D activeIndex={activeIndex as any} variant="Directed" dsState={structure as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden bg-black/40 border border-[var(--color-border-subtle)] shadow-lg relative flex flex-col w-full">
      <div className="absolute top-2 left-3 z-10 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md shadow-sm w-max">
          🎬 AI Animated 3D Simulation
        </div>
      </div>
      
      {/* 3D Scene */}
      <div className="h-[350px] w-full pointer-events-auto relative z-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <Canvas camera={{ position: [0, 4, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          <Environment preset="city" />
          
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Asteroids count={100} />
          <Sparkles count={50} scale={12} size={2} speed={0.4} opacity={0.2} color="#818cf8" />

          {render3DComponent()}

          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.5} 
            scale={20} 
            blur={2} 
            far={4} 
            color="#000000"
          />

          <OrbitControls 
            makeDefault
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Canvas>
      </div>

      {/* Controls & Description */}
      <div className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-gray-300">
            Step {currentStep + 1} of {stepCount}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(stepCount - 1, prev + 1))}
              disabled={currentStep === stepCount - 1}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-200 leading-relaxed font-medium min-h-[40px]">
          {currentStepData.description}
        </p>
      </div>
    </div>
  );
}
