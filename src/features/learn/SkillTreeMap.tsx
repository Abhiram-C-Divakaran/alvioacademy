import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Sparkles, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

interface SkillNode {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  path: string;
  desc: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const skillNodes: SkillNode[] = [
  { id: 'arrays', name: 'Arrays & Vectors', pos: [-6, 2, 0], color: '#60A5FA', path: '/learn', desc: 'Contiguous memory mapping, indexes and offset arithmetic.', difficulty: 'Easy' },
  { id: 'linked-lists', name: 'Linked Lists', pos: [-3, 0, 1], color: '#A78BFA', path: '/learn', desc: 'Dynamic node structures, single/double pointer links.', difficulty: 'Easy' },
  { id: 'stacks-queues', name: 'Stacks & Queues', pos: [0, 1, -1], color: '#F472B6', path: '/learn', desc: 'LIFO & FIFO operational models, rings and buffers.', difficulty: 'Easy' },
  { id: 'binary-search', name: 'Binary Search', pos: [3, -1, 2], color: '#34D399', path: '/learn/algorithms', desc: 'Divide and conquer logarithmic bounds searching.', difficulty: 'Medium' },
  { id: 'sorting', name: 'Sorting Algos', pos: [6, 2, -2], color: '#FBBF24', path: '/learn/algorithms', desc: 'Bubble, selection, insertion, merge and quick mechanics.', difficulty: 'Medium' },
  { id: 'trees', name: 'Trees & BSTs', pos: [0, -3, 3], color: '#F87171', path: '/learn', desc: 'Binary search trees, traversal recursions and AVL balance.', difficulty: 'Medium' },
  { id: 'graphs', name: 'Graphs & Networks', pos: [5, -4, 0], color: '#EC4899', path: '/learn/algorithms', desc: 'BFS, DFS traversals and Dijkstra shortest path bounds.', difficulty: 'Hard' }
];

function PlanetNode({ node, onHover, onClick }: { node: SkillNode; onHover: (n: SkillNode | null) => void; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Rotate planet
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={node.pos}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(node);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[hovered ? 0.75 : 0.6, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Visual ring for aesthetic */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 64]} />
        <meshBasicMaterial color={node.color} side={THREE.DoubleSide} opacity={hovered ? 0.6 : 0.2} transparent />
      </mesh>

      <Text
        position={[0, 1.1, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_eeAmM.woff"
      >
        {node.name}
      </Text>
    </group>
  );
}

// Render connection lines between syllabus planetary paths
function ConnectionLines() {
  const points = skillNodes.map(n => new THREE.Vector3(...n.pos));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#4F46E5" opacity={0.3} transparent linewidth={1.5} />
    </line>
  );
}

export default function SkillTreeMap() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070214] text-white relative">
      
      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 9], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />
          
          <ConnectionLines />

          {skillNodes.map(node => (
            <PlanetNode
              key={node.id}
              node={node}
              onHover={setSelectedNode}
              onClick={() => navigate(node.path)}
            />
          ))}

          <OrbitControls 
            enableZoom={true} 
            maxDistance={15} 
            minDistance={4} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.15}
          />
        </Canvas>
      </div>

      {/* Floating UI HUD elements */}
      <div className="relative z-10 flex-shrink-0 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              Syllabus Constellation <Sparkles className="text-indigo-400" size={16} />
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Interactive 3D Curriculum Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <Info size={12} /> Drag to orbit, scroll to zoom. Click node to enter.
        </div>
      </div>

      {/* Dynamic Detail Tooltip Card */}
      <div className="absolute bottom-8 left-8 z-10 max-w-sm pointer-events-none">
        {selectedNode ? (
          <Card strong gradientBorder className="p-5 space-y-3.5 bg-black/60 shadow-2xl transition-all scale-100 duration-200">
            <div className="flex justify-between items-center">
              <span 
                className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{ borderColor: selectedNode.color, color: selectedNode.color }}
              >
                {selectedNode.difficulty}
              </span>
              <span className="text-[9px] font-mono text-gray-500">ID: {selectedNode.id}</span>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">{selectedNode.name}</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed mt-1">{selectedNode.desc}</p>
            </div>
            <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 pt-1.5 border-t border-white/5">
              <Sparkles size={10} /> Click planet to open module
            </div>
          </Card>
        ) : (
          <Card strong className="p-5 bg-black/30 border border-white/5 opacity-40">
            <p className="text-xs font-semibold text-gray-400 italic">Hover over an orbital node planet to inspect curriculum parameters...</p>
          </Card>
        )}
      </div>

    </div>
  );
}
