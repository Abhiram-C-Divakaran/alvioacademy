import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTransition, a } from '@react-spring/three';
import { RoundedBox, Text, Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import GraphAlgorithms3D from '../workspace/GraphAlgorithms3D';
import BinaryTree3D from './BinaryTree3D';

// ─── Universal data-state parser ────────────────────────────────────────────
function parseElements(state: any): any[] {
  if (!state) return [];
  if (Array.isArray(state.elements)) return state.elements;
  if (typeof state.elements === 'string') return state.elements.split('');
  if (Array.isArray(state.stack)) return state.stack;
  if (Array.isArray(state.queue)) return state.queue;
  if (Array.isArray(state.array)) return state.array;
  if (Array.isArray(state.heap)) return state.heap;
  // For hashmap problems, LLM might incorrectly put map entries as elements
  // We prefer the raw input array; if entries is all we have, show keys
  if (Array.isArray(state.entries)) return state.entries.map((e: any) => `${e.key}:${e.value}`);
  if (typeof state.string === 'string') return state.string.split('');
  for (const v of Object.values(state)) {
    if (Array.isArray(v) && (v as any[]).every((x) => typeof x !== 'object')) return v as any[];
  }
  for (const v of Object.values(state)) {
    if (Array.isArray(v)) return v as any[];
  }
  return [];
}

function parseActiveIndices(state: any): number[] {
  if (!state) return [];
  if (Array.isArray(state.activeIndices)) return state.activeIndices;
  if (typeof state.activeIndex === 'number') return [state.activeIndex];
  return [];
}

function parsePointers(state: any): Record<string, number> {
  if (!state?.pointers || typeof state.pointers !== 'object') return {};
  return state.pointers;
}

function parseMapEntries(state: any): { key: string; value: string }[] {
  if (!state) return [];
  if (Array.isArray(state.mapEntries)) return state.mapEntries;
  if (Array.isArray(state.hashmap)) return state.hashmap;
  return [];
}

// ─── Single Cube ─────────────────────────────────────────────────────────────
// Matches the reference: dark teal body, bright teal rim, opaque, solid.
function GlowCube({ value, index, isActive, totalCount, life }: {
  value: any;
  index: number;
  isActive: boolean;
  totalCount: number;
  life?: any;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const SPACING = 2.6;
  const offset = ((totalCount - 1) * SPACING) / 2;
  const targetX = index * SPACING - offset;
  
  const [target, setTarget] = useState(targetX);
  const anim = useRef({ startX: targetX, progress: 1 });

  if (targetX !== target) {
    anim.current = { startX: groupRef.current?.position.x || targetX, progress: 0 };
    setTarget(targetX);
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    let yOffset = 0;
    
    // Handle Enter/Leave (Fly away and Scale)
    if (life) {
      const l = life.get();
      groupRef.current.scale.setScalar(l);
      yOffset += (1 - l) * 5; // Fly up when dying, drop down when spawning
    }

    // Handle Swapping Arc
    if (anim.current.progress < 1) {
      anim.current.progress += delta * 2.5; // Animation speed
      if (anim.current.progress > 1) anim.current.progress = 1;
      
      const p = anim.current.progress;
      const smoothP = p * p * (3 - 2 * p); // smoothstep
      
      groupRef.current.position.x = THREE.MathUtils.lerp(anim.current.startX, targetX, smoothP);
      
      const arcHeight = Math.abs(targetX - anim.current.startX) * 0.4;
      yOffset += Math.sin(p * Math.PI) * Math.min(arcHeight, 3); // Parabolic jump
    } else {
      groupRef.current.position.x = targetX;
    }
    
    groupRef.current.position.y = yOffset;
  });

  // Update colors to match SaaS palette: Purple base, Blue active
  const bodyColor  = isActive ? '#1e3a8a' : '#2e1065';
  const edgeColor  = isActive ? '#3B82F6' : '#8B5CF6';
  const emissive   = isActive ? '#60A5FA' : '#A78BFA';
  const emissiveInt= isActive ? 1.5 : 0.6;

  return (
    <a.group ref={groupRef as any}>
      {/* Outer slightly-larger shell for the rim glow effect */}
      <RoundedBox args={[2.02, 2.02, 2.02]} radius={0.22} smoothness={6}>
        <meshStandardMaterial
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={isActive ? 1.6 : 0.9}
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </RoundedBox>

      {/* Main body cube */}
      <RoundedBox args={[1.92, 1.92, 1.92]} radius={0.22} smoothness={6}>
        <meshStandardMaterial
          color={bodyColor}
          emissive={emissive}
          emissiveIntensity={emissiveInt}
          roughness={0.15}
          metalness={0.2}
          transmission={0.4}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Front face number */}
      <Text
        position={[0, 0, 0.98]}
        fontSize={0.72}
        color="#ffffff"
        fontWeight="bold"
        outlineWidth={0.02}
        outlineColor="rgba(0,0,0,0.4)"
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>

      {/* Index label */}
      <Text
        position={[0, -1.35, 0]}
        fontSize={0.28}
        color={isActive ? '#93c5fd' : '#5eead4'}
        anchorX="center"
      >
        [{index}]
      </Text>
    </a.group>
  );
}

// ─── Pointer arrow ────────────────────────────────────────────────────────────
function PointerArrow({
  name,
  index,
  row = 0,
  totalCount,
}: {
  name: string;
  index: number;
  row?: number;
  totalCount: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const SPACING = 2.6;
  const safeCount = Math.max(1, totalCount);
  const offset = ((safeCount - 1) * SPACING) / 2;
  
  // Failsafe for invalid indices (null/undefined/NaN) to prevent WebGL corruption
  const safeIndex = typeof index === 'number' && !isNaN(index) ? index : 0;
  const targetX = safeIndex * SPACING - offset;
  const [initialX] = useState(targetX);
  
  const pointerColor = name.toLowerCase().includes('fast') ? '#F59E0B' // Gold
                     : name.toLowerCase().includes('slow') ? '#22C55E' // Green
                     : '#3B82F6'; // Blue

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.1);
  });

  return (
    <group ref={ref} position={[initialX, -1.9 - row * 0.6, 0]}>
      <mesh rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.18, 0.45, 8]} />
        <meshStandardMaterial color={pointerColor} emissive={pointerColor} emissiveIntensity={1.5} />
      </mesh>
      <Text position={[0, 0.55, 0]} fontSize={0.27} color="#fb7185" fontWeight="bold" anchorX="center">
        {name}
      </Text>
    </group>
  );
}

// ─── Environment ─────────────────────────────────────────────────────────────
function Environment() {
  return (
    <>
      {/* Space backdrop matching the reference */}
      <color attach="background" args={['#071a26']} />
      <Stars radius={80} depth={60} count={2500} factor={3} fade speed={0.4} />

      {/* Lighting: key top-right, fill bottom-left, teal accent */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-6, 4, 6]} color="#2dd4bf" intensity={3} distance={20} />
      <pointLight position={[6, -4, -6]} color="#0ea5e9" intensity={1.5} distance={20} />
      
      <OrbitControls
        makeDefault
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* Subtle bloom — only the bright emissive edges glow, body does not */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.4}
          intensity={0.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Default Scene (Arrays, HashMaps) ─────────────────────────────────────────
function DefaultScene({ state, dataStructureType }: { state: any; dataStructureType: string }) {
  const elements = parseElements(state);
  const activeIndices = parseActiveIndices(state);
  const pointers = parsePointers(state);
  const mapEntries = parseMapEntries(state);
  const isHashmap = dataStructureType === 'hashmap';
  const seenCount = new Map<any, number>();
  
  const mappedElements = elements.map((item, i) => {
    let id = item?.id !== undefined ? item.id : null;
    const val = item?.val !== undefined ? item.val : item;
    
    // If the LLM just returns an array of numbers without IDs, create stable keys 
    // based on the value to enable physical block swapping animations!
    if (id === null) {
      const count = seenCount.get(val) || 0;
      seenCount.set(val, count + 1);
      id = `${val}-${count}`;
    }
    
    return { item, index: i, id, val };
  });

  const transitions = useTransition(mappedElements, {
    keys: (mappedItem) => mappedItem.id,
    from: { life: 0 },
    enter: { life: 1 },
    update: { life: 1 },
    leave: { life: 0 },
    config: { mass: 1, tension: 200, friction: 20 }
  });

  return (
    <>

      {/* Primary array row */}
      {!isHashmap && transitions((styles, { item, index, id, val }) => {
        return (
          <GlowCube
            key={id} // Stable ID enables physical sliding animations!
            value={val}
            index={index}
            isActive={activeIndices.includes(index) || activeIndices.includes(id)}
            totalCount={elements.length}
            life={styles.life}
          />
        );
      })}

      {/* Pointer arrows */}
      {Object.entries(pointers).map(([name, idx], row) => {
        // Prevent rendering arrows for undefined/null/NaN pointers
        if (idx === null || idx === undefined || isNaN(Number(idx))) return null;
        
        return (
          <PointerArrow
            key={name}
            name={name}
            index={Number(idx)}
            row={row}
            totalCount={elements.length}
          />
        );
      })}

      {/* HashMap entries row — shown as smaller amber cubes below the main array */}
      {(mapEntries.length > 0 || isHashmap) && (
        <group position={[0, isHashmap ? 0 : -4.2, 0]}>
          <Text position={[-((mapEntries.length * 2.1) / 2) - 0.5, 0, 0]} fontSize={0.28} color="#94a3b8" anchorX="right">
            HashMap:
          </Text>
          {mapEntries.map((entry: any, i: number) => {
            const total = mapEntries.length;
            const offsetX = ((total - 1) * 2.1) / 2;
            const label = `${entry.key}→${entry.value}`;
            return (
              <group key={entry.key} position={[i * 2.1 - offsetX, 0, 0]}>
                <RoundedBox args={[1.8, 0.9, 0.3]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial
                    color="#000000"
                    emissive="#000000"
                    roughness={0.1}
                    metalness={0.8}
                    transmission={0.9}
                    thickness={1}
                    clearcoat={1}
                  />
                </RoundedBox>
                <Text position={[0, 0, 0.2]} fontSize={0.26} color="#ffffff" fontWeight="bold" anchorX="center">
                  {label}
                </Text>
              </group>
            );
          })}
        </group>
      )}

      {elements.length > 0 && (
        <Text
          position={[0, mapEntries.length > 0 ? -2.9 : -2.9, 0]}
          fontSize={0.35}
          color="#5eead4"
          anchorX="center"
          fontStyle="italic"
        >
          {`Size: ${elements.length}`}
        </Text>
      )}

    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
interface AIVisualizerEngineProps {
  dataStructureType: string;
  currentDataState: any;
  cameraPosition?: [number, number, number];
}

export default function AIVisualizerEngine({
  dataStructureType,
  currentDataState,
  cameraPosition,
}: AIVisualizerEngineProps) {
  const isGraph = dataStructureType === 'graph';
  const isTree = dataStructureType === 'binary-tree';

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 11], fov: 48 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <Environment />
        
        {isGraph ? (
          <GraphAlgorithms3D 
            algoType={dataStructureType} 
            activeNodes={currentDataState?.activeNodes || []}
            visitedNodes={currentDataState?.visitedNodes || []}
            activeEdges={currentDataState?.activeEdges || []}
            queue={currentDataState?.queue}
          />
        ) : isTree ? (
          <BinaryTree3D 
            dsState={currentDataState} 
            activeIndex={currentDataState?.activeIndices || []} 
          />
        ) : (
          <DefaultScene state={currentDataState} dataStructureType={dataStructureType} />
        )}
      </Canvas>
    </div>
  );
}
