import { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { curriculumData, type CurriculumTopic } from '../data/curriculumData';
import PlanetNode from './PlanetNode';
import { SunShaderMaterial } from './SunShader';
import { createCoronaTexture } from './planetTextures';

interface CurriculumUniverseProps {
  selectedTopic: CurriculumTopic | null;
  onTopicSelect: (topic: CurriculumTopic) => void;
}

export interface CurriculumUniverseHandle {
  resetView: () => void;
}

interface AlgorithmNode {
  name: string;
  category: string;
  complexity: string;
  angle: number;
  color: string;
}

const ALGORITHM_NODES: AlgorithmNode[] = [
  { name: 'Binary Search', category: 'Searching', complexity: 'O(log n)', angle: 0.4, color: '#FFBA51' },
  { name: 'BFS', category: 'Graph Traversal', complexity: 'O(V + E)', angle: 1.5, color: '#A965FF' },
  { name: 'DFS', category: 'Tree/Graph Traversal', complexity: 'O(V + E)', angle: 2.6, color: '#A965FF' },
  { name: 'Merge Sort', category: 'Sorting', complexity: 'O(n log n)', angle: 3.7, color: '#FFBA51' },
  { name: 'Quick Sort', category: 'Sorting', complexity: 'O(n log n)', angle: 4.8, color: '#58A8FF' },
  { name: 'Dijkstra', category: 'Shortest Path', complexity: 'O((V + E) log V)', angle: 5.8, color: '#FFBA51' },
];

// Algorithms Asteroid Belt sitting between Queues (4.15) and Hash Tables (5.90)
function AlgorithmBelt() {
  const navigate = useNavigate();
  const groupRef = useRef<THREE.Group>(null);
  const darkMeshRef = useRef<THREE.InstancedMesh>(null);
  const warmMeshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredBelt, setHoveredBelt] = useState(false);
  const [hoveredAlgo, setHoveredAlgo] = useState<AlgorithmNode | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { darkData, warmData } = useMemo(() => {
    const dark = [];
    const warm = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4.65 + Math.random() * 0.60;
      const y = (Math.random() - 0.5) * 0.22;

      const scale = 0.026 + Math.random() * 0.038;
      const isWarm = Math.random() < 0.18;

      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03,
      };

      const item = { angle, radius, y, scale, rotSpeed };

      if (isWarm) {
        warm.push(item);
      } else {
        dark.push(item);
      }
    }
    return { darkData: dark, warmData: warm };
  }, []);

  // Continuous revolution of the asteroid belt around the Sun
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.045 * delta;
    }

    const updateMesh = (mesh: THREE.InstancedMesh | null, list: any[]) => {
      if (!mesh) return;
      list.forEach((ast, i) => {
        const x = Math.cos(ast.angle) * ast.radius;
        const z = Math.sin(ast.angle) * ast.radius;

        dummy.position.set(x, ast.y, z);
        dummy.rotation.x += ast.rotSpeed.x;
        dummy.rotation.y += ast.rotSpeed.y;
        dummy.scale.set(ast.scale, ast.scale, ast.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(darkMeshRef.current, darkData);
    updateMesh(warmMeshRef.current, warmData);
  });

  const handleNavigateToAlgorithms = (e: any) => {
    e.stopPropagation();
    navigate('/learn/algorithms');
  };

  return (
    <group ref={groupRef}>
      {/* Invisible Clickable Hit Target across the entire asteroid belt */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        onClick={handleNavigateToAlgorithms}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredBelt(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredBelt(false);
          document.body.style.cursor = 'default';
        }}
      >
        <ringGeometry args={[4.55, 5.35, 128]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 1. Dark Charcoal Asteroids */}
      <instancedMesh ref={darkMeshRef} args={[undefined, undefined, darkData.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#181216"
          roughness={0.9}
          metalness={0.05}
        />
      </instancedMesh>

      {/* 2. Warm Reflected Light Asteroids */}
      <instancedMesh ref={warmMeshRef} args={[undefined, undefined, warmData.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#422216"
          roughness={0.75}
          metalness={0.1}
          emissive="#241516"
          emissiveIntensity={hoveredBelt ? 0.65 : 0.25}
        />
      </instancedMesh>

      {/* 3. Highlighted Algorithm Asteroid Nodes */}
      {ALGORITHM_NODES.map((algo) => {
        const radius = 4.95;
        const x = Math.cos(algo.angle) * radius;
        const z = Math.sin(algo.angle) * radius;

        return (
          <group
            key={algo.name}
            position={[x, 0, z]}
            onClick={handleNavigateToAlgorithms}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAlgo(algo);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredAlgo(null);
              document.body.style.cursor = 'default';
            }}
          >
            <mesh>
              <dodecahedronGeometry args={[0.085, 0]} />
              <meshStandardMaterial
                color={algo.color}
                emissive={algo.color}
                emissiveIntensity={hoveredAlgo?.name === algo.name ? 2.8 : 1.6}
                roughness={0.35}
              />
            </mesh>

            {hoveredAlgo?.name === algo.name && (
              <Html position={[0, 0.26, 0]} center distanceFactor={14} zIndexRange={[120, 0]}>
                <div className="bg-[rgba(8,11,29,0.95)] border border-white/20 rounded-lg px-3 py-1.5 shadow-2xl backdrop-blur-xl pointer-events-none whitespace-nowrap text-left">
                  <div className="text-[12px] font-bold text-white leading-tight">{algo.name}</div>
                  <div className="text-[10px] text-[#a965ff] font-medium mt-0.5">
                    {algo.category} • <span className="text-[#36c978]">{algo.complexity}</span>
                  </div>
                  <div className="text-[9px] text-[#ffba51] font-semibold mt-1 flex items-center gap-1">
                    Click to Open Algorithms Hub ➔
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Belt Title Overlay Label */}
      <Html position={[0, -0.15, 4.95]} center distanceFactor={14} zIndexRange={[90, 0]}>
        <div
          className={`cursor-pointer transition-all duration-200 pointer-events-auto select-none text-center whitespace-nowrap px-3 py-1 rounded-full border ${
            hoveredBelt
              ? 'bg-[rgba(139,66,255,0.3)] border-[#a965ff] shadow-[0_0_16px_rgba(169,101,255,0.6)] scale-105'
              : 'bg-[rgba(8,11,29,0.7)] border-white/10'
          }`}
          onClick={handleNavigateToAlgorithms}
          style={{ textShadow: '0 2px 8px #000, 0 0 12px rgba(0,0,0,.9)' }}
        >
          <div className="text-[#f1f5f9] text-[11.5px] font-bold tracking-widest uppercase flex items-center gap-1.5 justify-center">
            <span>⚡ ALGORITHMS BELT</span>
            <span className="text-[#a965ff] text-[10px]">➔</span>
          </div>
          <div className="text-[#94a3b8] text-[8.5px] font-medium tracking-wide">
            Search · Sort · Traverse · Optimize
          </div>
        </div>
      </Html>
    </group>
  );
}

// Large Incandescent Central Sun (Radius 1.40)
function CentralSun() {
  const meshRef = useRef<THREE.Mesh>(null);

  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorCore: { value: new THREE.Color('#FFF8D0') },
        colorBright: { value: new THREE.Color('#FFE27A') },
        colorOrange: { value: new THREE.Color('#FFAA35') },
        colorDeepOrange: { value: new THREE.Color('#F27818') },
      },
      vertexShader: SunShaderMaterial.vertexShader,
      fragmentShader: SunShaderMaterial.fragmentShader,
    });
  }, []);

  const coronaTexture = useMemo(() => {
    return createCoronaTexture();
  }, []);

  useFrame(({ clock }, delta) => {
    sunMaterial.uniforms.time.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Expansive Radiant Corona Sprite */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial
          map={coronaTexture}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Large Central Solar Sphere (Radius 1.40) */}
      <mesh ref={meshRef} material={sunMaterial}>
        <sphereGeometry args={[1.40, 96, 96]} />
      </mesh>

      {/* 3. Primary Solar Illumination Point Light */}
      <pointLight
        position={[0, 0, 0]}
        color="#FFB347"
        intensity={40}
        distance={28}
        decay={1.8}
      />
    </group>
  );
}

// Concentric Orbit Lines for every planet and belt
function OrbitRings() {
  const orbits = useMemo(() => {
    return curriculumData.map((topic, i) => ({
      radius: topic.orbitRadius,
      color: topic.color,
      opacity: i < 4 ? 0.14 : 0.08,
    }));
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {orbits.map((orb, idx) => {
        const curve = new THREE.EllipseCurve(
          0, 0,
          orb.radius, orb.radius,
          0, 2 * Math.PI,
          false,
          0
        );
        const points = curve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));

        return (
          <Line
            key={idx}
            points={points}
            color={orb.color}
            lineWidth={1.0}
            transparent
            opacity={orb.opacity}
          />
        );
      })}

      {/* Asteroid Belt Orbit Track */}
      {(() => {
        const curve = new THREE.EllipseCurve(
          0, 0,
          4.95, 4.95,
          0, 2 * Math.PI,
          false,
          0
        );
        const points = curve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));
        return (
          <Line
            points={points}
            color="#a965ff"
            lineWidth={1.3}
            transparent
            opacity={0.20}
          />
        );
      })()}
    </group>
  );
}

function ResponsiveLearningCamera({ home }: { home: { current: THREE.Vector3 } }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const scale = Math.min(2.4, Math.max(1, 1.5 / (size.width / Math.max(1, size.height))));
    home.current.set(0, 8.2 * scale, 13.5 * scale);
    camera.position.copy(home.current);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, home]);
  return null;
}

const CurriculumUniverse = forwardRef<CurriculumUniverseHandle, CurriculumUniverseProps>(
  ({ selectedTopic, onTopicSelect }, ref) => {
    const controlsRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const homePosition = useRef(new THREE.Vector3(0, 8.2, 13.5));

    useImperativeHandle(ref, () => ({
      resetView: () => {
        if (cameraRef.current) {
          cameraRef.current.position.copy(homePosition.current);
        }
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      },
    }));

    return (
      <div className="w-full h-full relative">
        {/* Atmospheric Nebula Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 45%, rgba(139, 66, 255, 0.12), transparent 45%),
              radial-gradient(ellipse at 75% 35%, rgba(112, 40, 170, 0.14), transparent 40%),
              radial-gradient(ellipse at 25% 65%, rgba(32, 72, 150, 0.10), transparent 45%),
              #050817
            `,
          }}
        />

        <Canvas
          camera={{ position: [0, 8.2, 13.5], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          onCreated={({ gl, camera }) => {
            cameraRef.current = camera;
            gl.toneMappingExposure = 1.15;
          }}
        >
          <ResponsiveLearningCamera home={homePosition} />
          {/* Ambient & Fill Lighting */}
          <ambientLight intensity={0.7} />

          <hemisphereLight
            color="#8097D4"
            groundColor="#100B1B"
            intensity={0.75}
          />

          <directionalLight
            position={[2, 8, 8]}
            intensity={1.1}
            color="#dce6ff"
          />

          {/* Deep Space Background Stars */}
          <Stars radius={90} depth={35} count={400} factor={1.2} saturation={0} fade speed={0.15} />

          {/* Central Solar System */}
          <group position={[0, 0, 0]}>
            <CentralSun />
            <OrbitRings />
            <AlgorithmBelt />

            {/* Continuously Revolving Data Structure Planets */}
            {curriculumData.map((topic) => (
              <PlanetNode
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic?.id === topic.id}
                onClick={onTopicSelect}
              />
            ))}
          </group>

          {/* Bloom for glowing celestial bodies */}
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.65}
              luminanceSmoothing={0.25}
            />
          </EffectComposer>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            enableDamping
            dampingFactor={0.055}
            minDistance={8}
            maxDistance={40}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.45}
          />
        </Canvas>
      </div>
    );
  }
);

export default CurriculumUniverse;
