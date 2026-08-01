import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Billboard, Line, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Activity, Clock, ShieldAlert, Award, ChevronRight, HelpCircle, ArrowLeft, X } from 'lucide-react';

// Sub-component to animate a particle along a specific growth curve up to the selected inputSize
function CurveParticle({ 
  equation, 
  color, 
  inputSize, 
  speedMultiplier = 1 
}: { 
  equation: (n: number) => number; 
  color: string; 
  inputSize: number; 
  speedMultiplier?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const maxValidN = useMemo(() => {
    for (let i = 0; i <= 100; i += 0.5) {
      if (equation(i) > 10100) {
        return i;
      }
    }
    return 100;
  }, [equation]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const cycle = 3; 
    const progress = (state.clock.getElapsedTime() * speedMultiplier) % cycle;
    const normalizedProgress = progress / cycle; // 0 to 1
    
    const activeDomain = Math.min(inputSize, maxValidN);
    const currentN = normalizedProgress * activeDomain;
    
    const xVal = (currentN / 100) * 10 - 5;
    const rawOps = equation(currentN);
    const yVal = (rawOps / 10000) * 10 - 5;
    
    meshRef.current.position.set(xVal, yVal, 0);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.1} />
    </mesh>
  );
}

// 3D Scene drawing the complexity curves
function ComplexityScene({ 
  selectedCurve, 
  inputSize, 
  activeTab 
}: { 
  selectedCurve: string | null; 
  inputSize: number; 
  activeTab: 'time' | 'space';
}) {
  const curves = useMemo(() => [
    {
      id: 'O(1)',
      equation: () => 300,
      color: '#10b981',
    },
    {
      id: 'O(log N)',
      equation: (n: number) => Math.log2(n + 1) * 1500,
      color: '#06b6d4',
    },
    {
      id: 'O(N)',
      equation: (n: number) => n * 100,
      color: '#3b82f6',
    },
    {
      id: 'O(N log N)',
      equation: (n: number) => n * Math.log2(n + 1) * 15,
      color: '#eab308',
    },
    {
      id: 'O(N²)',
      equation: (n: number) => n * n,
      color: '#f97316',
    },
    {
      id: 'O(2^N)',
      equation: (n: number) => Math.pow(2, n),
      color: '#ef4444',
    }
  ], []);

  return (
    <>
      <gridHelper args={[10, 10, '#334155', '#1e293b']} position={[0, -5, 0]} />
      <gridHelper args={[10, 10, '#334155', '#1e293b']} position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]} />
      
      <Line points={[[-5.5, -5, 0], [5.5, -5, 0]]} color="#64748b" lineWidth={2.5} />
      <Billboard position={[5.8, -5, 0]}>
        <Text fontSize={0.3} color="#94a3b8">N (Max 100)</Text>
      </Billboard>

      <Line points={[[-5, -5.5, 0], [-5, 5.5, 0]]} color="#64748b" lineWidth={2.5} />
      <Billboard position={[-5, 5.8, 0]}>
        <Text fontSize={0.3} color="#94a3b8">
          {activeTab === 'time' ? 'Operations (Max 10k)' : 'Memory Units (Max 10k)'}
        </Text>
      </Billboard>

      {curves.map((c) => {
        const points: [number, number, number][] = [];
        const steps = 60;
        
        for (let i = 0; i <= steps; i++) {
          const currentN = (i / steps) * inputSize;
          const xVis = (currentN / 100) * 10 - 5;
          const rawOps = c.equation(currentN);
          const yVis = (rawOps / 10000) * 10 - 5;
          
          if (yVis <= 5.1) {
            points.push([xVis, yVis, 0]);
          }
        }

        const isHighlighted = !selectedCurve || selectedCurve === c.id;
        const opacity = isHighlighted ? 1 : 0.12;
        const strokeWidth = isHighlighted ? 4.5 : 1.2;

        return (
          <group key={c.id}>
            {points.length > 1 && (
              <Line 
                points={points} 
                color={c.color} 
                lineWidth={strokeWidth} 
                opacity={opacity}
                transparent
              />
            )}

            {isHighlighted && (
              <CurveParticle 
                equation={c.equation} 
                color={c.color} 
                inputSize={inputSize}
                speedMultiplier={c.id === 'O(2^N)' ? 0.35 : c.id === 'O(N²)' ? 0.6 : 1}
              />
            )}

            {points.length > 0 && isHighlighted && (
              <Billboard position={[points[points.length - 1][0] + 0.6, points[points.length - 1][1], 0]}>
                <Text fontSize={0.28} color={c.color} outlineColor="#0f172a" outlineWidth={0.01}>
                  {c.id}
                </Text>
              </Billboard>
            )}
          </group>
        );
      })}
    </>
  );
}

const ALGO_DETAILS = {
  'bubble-sort': {
    name: 'Bubble Sort',
    timeComp: 'O(N²)',
    spaceComp: 'O(1)',
    explanation: 'Comparisons are performed between every adjacent pair. Since it contains a nested loop scanning the elements, it runs in quadratic time.',
    timeFormula: 'N × (N - 1) / 2 comparisons = O(N²)',
    spaceFormula: 'O(1) auxiliary space (only a temp variable is allocated for swaps).'
  },
  'selection-sort': {
    name: 'Selection Sort',
    timeComp: 'O(N²)',
    spaceComp: 'O(1)',
    explanation: 'Scans the entire unsorted partition to locate the minimum element, performing this iteratively. Requires quadratic comparisons.',
    timeFormula: 'Inner loop scans decrease linearily: N + (N-1) + ... + 1 = O(N²)',
    spaceFormula: 'O(1) auxiliary space (in-place swaps, no extra array memory).'
  },
  'insertion-sort': {
    name: 'Insertion Sort',
    timeComp: 'O(N²)',
    spaceComp: 'O(1)',
    explanation: 'Iterates and inserts elements into their sorted positions, shifting larger items. In the worst case (reverse sorted), it compares every element with all preceding elements.',
    timeFormula: 'Worst Case: O(N²) when reverse sorted. Best Case: O(N) when already sorted.',
    spaceFormula: 'O(1) auxiliary space (performed directly in-place).'
  },
  'merge-sort': {
    name: 'Merge Sort',
    timeComp: 'O(N log N)',
    spaceComp: 'O(N)',
    explanation: 'Recursively divides the array in half (log N levels), then merges them back together by comparing elements at each level (O(N) operations per level).',
    timeFormula: 'log N recursion depth × O(N) merge work = O(N log N)',
    spaceFormula: 'Requires copying elements into temporary arrays of combined size N during merge operations = O(N) space.'
  },
  'quick-sort': {
    name: 'Quick Sort',
    timeComp: 'O(N log N)',
    spaceComp: 'O(log N)',
    explanation: 'Partitions array around pivot elements. In average cases, partitions split near center, yielding a recursion tree of height log N.',
    timeFormula: 'Average: O(N log N). Worst Case: O(N²) if pivot selection constantly picks extreme values.',
    spaceFormula: 'Requires O(log N) stack frames on the recursion stack for partition calls.'
  },
  'linear-search': {
    name: 'Linear Search',
    timeComp: 'O(N)',
    spaceComp: 'O(1)',
    explanation: 'Scans the array indices sequentially from left to right. In the worst case, the target element is at the very end or not present.',
    timeFormula: 'N maximum comparisons = O(N)',
    spaceFormula: 'O(1) auxiliary space (constant variables for loop pointer).'
  },
  'binary-search': {
    name: 'Binary Search',
    timeComp: 'O(log N)',
    spaceComp: 'O(1)',
    explanation: 'Since the array is sorted, it compares the target to the midpoint. With each failure, it discards exactly half of the remaining interval.',
    timeFormula: 'Input size halves: N → N/2 → N/4 → ... → 1 = O(log N)',
    spaceFormula: 'O(1) auxiliary space when implemented iteratively with low/high boundaries.'
  }
};

export default function Complexity3DPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightParam = searchParams.get('highlight');

  const [activeTab, setActiveTab] = useState<'time' | 'space'>('time');
  const [selectedAlgo, setSelectedAlgo] = useState<keyof typeof ALGO_DETAILS | 'custom'>('custom');
  const [inputSize, setInputSize] = useState<number>(60);
  
  // Set and track manual highlights (e.g. from learning detail pages)
  const [manualHighlight, setManualHighlight] = useState<string | null>(highlightParam);

  // If a manual URL highlight changes, sync local state
  useEffect(() => {
    if (highlightParam) {
      setManualHighlight(highlightParam);
      setSelectedAlgo('custom'); // Clear algorithm pre-select
      
      // Auto switch active tab based on query params
      const modeParam = searchParams.get('mode');
      if (modeParam === 'space') {
        setActiveTab('space');
      } else {
        setActiveTab('time');
      }
    }
  }, [highlightParam, searchParams]);

  // Determine highlighted curve based on chosen algorithm or manual highlight
  const highlightedCurve = useMemo(() => {
    if (selectedAlgo !== 'custom') {
      const algo = ALGO_DETAILS[selectedAlgo];
      return activeTab === 'time' ? algo.timeComp : algo.spaceComp;
    }
    return manualHighlight;
  }, [selectedAlgo, activeTab, manualHighlight]);

  const handleClearHighlight = () => {
    setManualHighlight(null);
    setSearchParams({}); // Clear query parameter
  };

  return (
    <div className="w-full h-full bg-[#0b0f19] text-white relative overflow-hidden flex flex-col">
      
      {/* 3D Canvas Background in FULL SCREEN MODE */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas camera={{ position: [3, 4, 11], fov: 45 }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          <OrbitControls makeDefault minDistance={5} maxDistance={16} maxPolarAngle={Math.PI / 2 + 0.1} />
          
          <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={80} scale={15} size={2} speed={0.4} opacity={0.25} color="#818cf8" />

          <ComplexityScene 
            selectedCurve={highlightedCurve} 
            inputSize={inputSize} 
            activeTab={activeTab} 
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.8} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={1.15} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Floating Floating Controls Header (similar to VisualizerControls) */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-none">
        
        {/* Title Block */}
        <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-4 shadow-xl flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-[var(--color-text-muted)] hover:text-white"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="text-blue-400" size={20} />
              3D Complexity Analyzer
            </h2>
            <p className="text-[var(--color-text-secondary)] text-xs">
              Interactive View Mode
            </p>
          </div>
        </div>

        {/* Tab & Curve Selectors (Center Header) */}
        <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-4 shadow-xl flex flex-col md:flex-row gap-4 items-center self-center md:self-auto">
          {/* Time/Space tabs */}
          <div className="flex p-1 bg-slate-900/60 border border-slate-800 rounded-lg w-fit">
            <button
              onClick={() => { setActiveTab('time'); setSelectedAlgo('custom'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'time' ? 'bg-blue-600 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              <Clock size={12} /> Time
            </button>
            <button
              onClick={() => { setActiveTab('space'); setSelectedAlgo('custom'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'space' ? 'bg-indigo-600 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              <ShieldAlert size={12} /> Space
            </button>
          </div>

          {/* Algorithm selector */}
          <div className="flex flex-col gap-1 w-44">
            <select
              value={selectedAlgo}
              onChange={(e) => { setSelectedAlgo(e.target.value as any); setManualHighlight(null); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="custom">Show All Curves</option>
              <optgroup label="Sorting">
                <option value="bubble-sort">Bubble Sort</option>
                <option value="selection-sort">Selection Sort</option>
                <option value="insertion-sort">Insertion Sort</option>
                <option value="merge-sort">Merge Sort</option>
                <option value="quick-sort">Quick Sort</option>
              </optgroup>
              <optgroup label="Searching">
                <option value="linear-search">Linear Search</option>
                <option value="binary-search">Binary Search</option>
              </optgroup>
            </select>
          </div>

          {/* Input size slider */}
          <div className="flex flex-col gap-1 w-36">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[var(--color-text-muted)]">
              <span>Input Size (N)</span>
              <span className="text-blue-400 font-mono font-bold">{inputSize}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1 bg-slate-700 rounded-lg appearance-none"
            />
          </div>
        </div>

      </div>

      {/* Floating Left Overlay Panel (Calculation Cheat Sheet) */}
      <div className="absolute left-6 bottom-6 z-10 w-[320px] pointer-events-none hidden md:block">
        <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-5 shadow-2xl space-y-4 max-h-[400px] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-white/10 pb-2">
            Calculation Guide
          </h3>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <ChevronRight className="text-blue-400 shrink-0 mt-0.5" size={14} />
              <div>
                <h4 className="text-xs font-bold text-white">Loops (Sequential)</h4>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-normal">
                  Scanning elements sequentially runs in <strong className="font-mono text-white">O(N)</strong> linear time.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ChevronRight className="text-blue-400 shrink-0 mt-0.5" size={14} />
              <div>
                <h4 className="text-xs font-bold text-white">Nested Loops</h4>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-normal">
                  Scanning pairs via nested loops runs in <strong className="font-mono text-white">O(N²)</strong> quadratic time.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ChevronRight className="text-blue-400 shrink-0 mt-0.5" size={14} />
              <div>
                <h4 className="text-xs font-bold text-white">Halving Spaces</h4>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-normal">
                  Dividing search ranges iteratively runs in <strong className="font-mono text-white">O(log N)</strong> logarithmic time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Right Overlay Panel (Mathematical Breakdown) */}
      <div className="absolute right-6 bottom-6 z-10 w-[360px] pointer-events-none">
        {selectedAlgo !== 'custom' ? (
          <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-white">
                {ALGO_DETAILS[selectedAlgo].name}
              </h3>
              <div className="flex gap-1.5">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 rounded">
                  {ALGO_DETAILS[selectedAlgo].timeComp}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 rounded">
                  {ALGO_DETAILS[selectedAlgo].spaceComp}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              {ALGO_DETAILS[selectedAlgo].explanation}
            </p>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 space-y-2.5 font-mono text-[10px]">
              <div>
                <span className="text-blue-400 block font-semibold mb-0.5">■ Time Complexity:</span>
                <span className="text-white">{ALGO_DETAILS[selectedAlgo].timeFormula}</span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-indigo-400 block font-semibold mb-0.5">■ Space Complexity:</span>
                <span className="text-white">{ALGO_DETAILS[selectedAlgo].spaceFormula}</span>
              </div>
            </div>
          </div>
        ) : highlightedCurve ? (
          /* Show focused curve detail from URL highlight */
          <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-5 shadow-2xl flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                FOCUSED COMPLEXITY CURVE
              </h3>
              <div className="text-2xl font-black text-white font-mono">{highlightedCurve}</div>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
                Selected from {searchParams.get('ds') || 'theory page'}. Slide the input size slider to observe coordinate growth rates along the glowing curve.
              </p>
            </div>
            <button 
              onClick={handleClearHighlight}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Show all curves"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto bg-black/45 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-5 shadow-2xl text-center py-8 space-y-2">
            <div className="w-9 h-9 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award size={18} />
            </div>
            <h3 className="text-xs font-bold text-white">Compare Algorithms</h3>
            <p className="text-[10px] text-[var(--color-text-muted)] max-w-[200px] mx-auto">
              Select an algorithm from the top dropdown to see its mathematical breakdowns.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
