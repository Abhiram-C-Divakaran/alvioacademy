import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface GraphAlgorithms3DProps {
  algoType?: string;
  activeNodes?: string[];
  visitedNodes?: string[];
  activeEdges?: string[][]; // pair of [from, to]
}

export default function GraphAlgorithms3D({
  algoType,
  activeNodes = [],
  visitedNodes = [],
  activeEdges = []
}: GraphAlgorithms3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  const isTree = algoType?.includes('traversal');

  const nodes = isTree ? [
    { id: 'A', val: 'A', x: 0, y: 2.5, z: 0 },
    { id: 'B', val: 'B', x: -2, y: 0.5, z: 0 },
    { id: 'C', val: 'C', x: 2, y: 0.5, z: 0 },
    { id: 'D', val: 'D', x: -3, y: -1.5, z: 0 },
    { id: 'E', val: 'E', x: -1, y: -1.5, z: 0 },
    { id: 'F', val: 'F', x: 1, y: -1.5, z: 0 },
    { id: 'G', val: 'G', x: 3, y: -1.5, z: 0 },
  ] : [
    { id: 'A', val: 'A', x: 0, y: 2, z: 0 },
    { id: 'B', val: 'B', x: -2.2, y: 0.5, z: 1 },
    { id: 'C', val: 'C', x: 2.2, y: 0.5, z: -1 },
    { id: 'D', val: 'D', x: -1.8, y: -1.5, z: -1 },
    { id: 'E', val: 'E', x: 1.8, y: -1.5, z: 1 },
    { id: 'F', val: 'F', x: 0, y: -3, z: 0 },
  ];

  const edges = isTree ? [
    { from: 'A', to: 'B', weight: '' },
    { from: 'A', to: 'C', weight: '' },
    { from: 'B', to: 'D', weight: '' },
    { from: 'B', to: 'E', weight: '' },
    { from: 'C', to: 'F', weight: '' },
    { from: 'C', to: 'G', weight: '' },
  ] : [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 4 },
    { from: 'E', to: 'F', weight: 3 },
  ];

  return (
    <group ref={groupRef}>
      {/* Draw Edges */}
      {edges.map((e, idx) => {
        const n1 = nodes.find(n => n.id === e.from)!;
        const n2 = nodes.find(n => n.id === e.to)!;
        const p1 = new THREE.Vector3(n1.x, n1.y, n1.z);
        const p2 = new THREE.Vector3(n2.x, n2.y, n2.z);
        const distance = p1.distanceTo(p2);
        const center = p1.clone().add(p2).divideScalar(2);
        const direction = p2.clone().sub(p1).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        // Check if this edge is active
        const isActive = activeEdges.some(ae => 
          (ae[0] === e.from && ae[1] === e.to) || (ae[0] === e.to && ae[1] === e.from)
        );

        const edgeColor = isActive ? '#fb923c' : '#475569';
        const edgeWidth = isActive ? 0.05 : 0.02;

        return (
          <group key={`edge-${idx}`}>
            <mesh position={[center.x, center.y, center.z]} quaternion={quaternion}>
              <cylinderGeometry args={[edgeWidth, edgeWidth, distance, 8]} />
              <meshStandardMaterial 
                color={edgeColor} 
                emissive={edgeColor} 
                emissiveIntensity={isActive ? 1.5 : 0} 
                transparent 
                opacity={isActive ? 0.95 : 0.4} 
              />
            </mesh>
            {e.weight && (
              <Billboard position={[center.x, center.y + 0.25, center.z]}>
                <Text fontSize={0.22} color="#94a3b8" outlineColor="#000" outlineWidth={0.01}>
                  {e.weight}
                </Text>
              </Billboard>
            )}
          </group>
        );
      })}

      {/* Draw Nodes */}
      {nodes.map((n) => {
        const isActive = activeNodes.includes(n.id);
        const isVisited = visitedNodes.includes(n.id);

        let nodeColor = '#334155'; // default/unvisited
        if (isActive) nodeColor = '#fb923c'; // orange
        else if (isVisited) nodeColor = '#10b981'; // green

        return (
          <group key={n.id} position={[n.x, n.y, n.z]}>
            <Sphere args={[0.38, 32, 32]}>
              <meshStandardMaterial 
                color={nodeColor} 
                emissive={nodeColor} 
                emissiveIntensity={isActive ? 1.2 : isVisited ? 0.3 : 0} 
                roughness={0.2}
              />
            </Sphere>
            <Billboard position={[0, 0.65, 0]}>
              <Text fontSize={0.28} color="white" fontWeight="bold">
                {n.id}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
