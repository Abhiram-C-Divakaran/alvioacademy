// ============================================================
// Visualization2D — Renders the active DataStructure in 2D
// using SVG. Uses node.position (x, y) as a proportional layout
// hint, converted into SVG coordinates, so 2D and 3D stay in sync.
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import type { DataStructure, DSANode } from '../../types/dataStructures';

const WIDTH = 800;
const HEIGHT = 460;
const SCALE = 60; // world units -> px

const toSvg = (x: number, y: number) => ({
  cx: WIDTH / 2 + x * SCALE,
  cy: HEIGHT / 2 - y * SCALE,
});

// A simple hash function to generate a 4-digit "memory address" from a string ID for UI display
const hashId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 9000) + 1000; // 1000-9999
};

// ---- Graph & Tree Node (Green Circles) ----
function CircleNode2D({ node }: { node: DSANode }) {
  const { cx, cy } = toSvg(node.position.x, node.position.y);
  
  // Style matches the Graph diagram (light green fill, dark green border)
  const isHighlight = node.state.highlighted;
  const fill = isHighlight ? '#fef3c7' : '#dcfce7'; // amber-100 or green-100
  const stroke = isHighlight ? '#f59e0b' : '#22c55e'; // amber-500 or green-500
  const textFill = isHighlight ? '#92400e' : '#14532d'; // amber-800 or green-900

  return (
    <motion.g
      layout
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <circle cx={cx} cy={cy} r={24} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill={textFill}>
        {String(node.value)}
      </text>
    </motion.g>
  );
}

// ---- Array Node (Green Squares with Indices) ----
function ArrayNode2D({ node, index }: { node: DSANode; index: number }) {
  const { cx, cy } = toSvg(node.position.x, node.position.y);
  
  const isHighlight = node.state.highlighted;
  const fill = isHighlight ? '#fef3c7' : '#dcfce7';
  const stroke = isHighlight ? '#f59e0b' : '#22c55e';
  const textFill = isHighlight ? '#92400e' : '#14532d';
  
  const size = 52;
  const rx = 6;

  return (
    <motion.g
      layout
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <rect x={cx - size/2} y={cy - size/2} width={size} height={size} rx={rx} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={textFill}>
        {String(node.value)}
      </text>
      {/* Index label below */}
      <text x={cx} y={cy + size/2 + 20} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-text-muted)">
        {index}
      </text>
    </motion.g>
  );
}

// ---- Stack Node (Vertical Blocks) ----
function StackNode2D({ node }: { node: DSANode }) {
  const { cx, cy } = toSvg(node.position.x, node.position.y);
  
  const isHighlight = node.state.highlighted;
  const fill = isHighlight ? '#fef3c7' : 'var(--color-bg-primary)';
  const stroke = isHighlight ? '#f59e0b' : 'var(--color-border-default)';
  const textFill = isHighlight ? '#92400e' : 'var(--color-text-primary)';
  
  const width = 80;
  const height = 50;

  return (
    <motion.g
      layout
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <rect x={cx - width/2} y={cy - height/2} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={20} fontWeight={700} fill={textFill}>
        {String(node.value)}
      </text>
    </motion.g>
  );
}

// ---- Queue Node (Horizontal Blocks) ----
function QueueNode2D({ node }: { node: DSANode }) {
  const { cx, cy } = toSvg(node.position.x, node.position.y);
  
  const isHighlight = node.state.highlighted;
  const fill = isHighlight ? '#fef3c7' : 'var(--color-bg-primary)';
  const stroke = isHighlight ? '#f59e0b' : 'var(--color-border-default)';
  const textFill = isHighlight ? '#92400e' : 'var(--color-text-primary)';
  
  const size = 56;
  const rx = 4;

  return (
    <motion.g
      layout
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <rect x={cx - size/2} y={cy - size/2} width={size} height={size} rx={rx} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={20} fontWeight={700} fill={textFill}>
        {String(node.value)}
      </text>
    </motion.g>
  );
}

// ---- Linked List Node (Split Blocks with perfect rounded corners using clipPath) ----
function LinkedListNode2D({ node, nextNodeId }: { node: DSANode; nextNodeId: string | null }) {
  const { cx, cy } = toSvg(node.position.x, node.position.y);
  const myAddr = hashId(node.id);
  const nextAddr = nextNodeId ? hashId(nextNodeId) : 'NULL';

  const width = 74;
  const height = 36;
  const rx = 6;
  const strokeColor = node.state.highlighted ? '#f59e0b' : '#6366f1';
  const rightBg = node.state.highlighted ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.1)';
  const leftBg = 'var(--color-bg-primary)';

  const clipId = `clip-${node.id}`;

  return (
    <motion.g
      layout
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Clip path for perfect rounded corners */}
      <defs>
        <clipPath id={clipId}>
          <rect x={cx - width/2} y={cy - height/2} width={width} height={height} rx={rx} />
        </clipPath>
      </defs>

      {/* Node Address Label (below node) */}
      <text x={cx} y={cy + height / 2 + 16} textAnchor="middle" fontSize={10} fill="var(--color-text-muted)" fontWeight="600" className="font-mono">
        {myAddr}
      </text>
      
      {/* Node Container Body */}
      {/* Left Data Section Background */}
      <rect 
        x={cx - width/2} 
        y={cy - height/2} 
        width={width} 
        height={height} 
        fill={leftBg} 
        clipPath={`url(#${clipId})`} 
      />
      {/* Right Pointer Section Background */}
      <rect 
        x={cx} 
        y={cy - height/2} 
        width={width/2} 
        height={height} 
        fill={rightBg} 
        clipPath={`url(#${clipId})`} 
      />
      
      {/* Border Outline */}
      <rect x={cx - width/2} y={cy - height/2} width={width} height={height} rx={rx} fill="none" stroke={strokeColor} strokeWidth={2} />
      
      {/* Divider */}
      <line x1={cx} y1={cy - height/2} x2={cx} y2={cy + height/2} stroke={strokeColor} strokeWidth={2} />
      
      {/* Left Value Text */}
      <text x={cx - width/4} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-text-primary)">
        {String(node.value)}
      </text>
      
      {/* Right Next Pointer Text */}
      <text x={cx + width/4} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={nextNodeId ? "var(--color-text-primary)" : "var(--color-text-muted)"} className="font-mono">
        {nextAddr}
      </text>
    </motion.g>
  );
}

// ---- Edges ----
function Edge2D({ from, to, color = 'var(--color-border-strong)', dashed = false }: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  dashed?: boolean;
}) {
  const a = toSvg(from.x, from.y);
  const b = toSvg(to.x, to.y);
  return (
    <line
      x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
      stroke={color}
      strokeWidth={2}
      strokeDasharray={dashed ? '4 4' : undefined}
      opacity={1}
    />
  );
}

function ArrowEdge2D({ from, to, color = '#6366f1', offsetX1 = 0, offsetX2 = 0, offsetY1 = 0, offsetY2 = 0 }: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  offsetX1?: number;
  offsetX2?: number;
  offsetY1?: number;
  offsetY2?: number;
}) {
  const a = toSvg(from.x, from.y);
  const b = toSvg(to.x, to.y);
  return (
    <line
      x1={a.cx + offsetX1} y1={a.cy + offsetY1} 
      x2={b.cx + offsetX2} y2={b.cy + offsetY2}
      stroke={color}
      strokeWidth={2}
      opacity={0.9}
      markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
    />
  );
}

export default function Visualization2D({ structure }: { structure: DataStructure | null }) {
  if (!structure) return null;

  const byId = new Map<string, DSANode>();
  const collect = (nodes: DSANode[]) => nodes.forEach((n) => byId.set(n.id, n));

  switch (structure.type) {
    case 'array':
    case 'stack':
    case 'queue':
      collect(structure.elements);
      break;
    case 'linked-list':
      collect(structure.nodes);
      break;
    case 'binary-tree':
    case 'avl-tree':
      collect(structure.nodes);
      break;
    case 'graph':
      collect(structure.nodes);
      break;
    case 'hash-table':
      structure.buckets.forEach((b) => collect(b.entries));
      break;
  }

  // Generate marker defs for different colors
  const markers = ['6366f1', '22c55e', 'var(--color-border-strong)'].map(c => (
    <marker key={c} id={`arrowhead-${c.replace('#', '')}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill={c.startsWith('var') ? 'currentColor' : `#${c}`} />
    </marker>
  ));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full max-w-4xl">
        <defs>
          {markers}
        </defs>
        <AnimatePresence>
          {(() => {
            switch (structure.type) {
              case 'array':
                return structure.elements.map((n, i) => <ArrayNode2D key={n.id} node={n} index={i} />);

              case 'stack': {
                // Stack layout: vertical
                const nCount = structure.elements.length;
                return (
                  <>
                    {structure.elements.map((n, i) => {
                      // Override position for stack vertical layout
                      const yOffset = ((nCount - 1) / 2) - (nCount - 1 - i); // Top is at higher Y
                      const pos = { x: 0, y: yOffset * 1.0, z: 0 };
                      const topNode = i === nCount - 1;
                      
                      const svgPos = toSvg(pos.x, pos.y);
                      
                      return (
                        <g key={n.id}>
                          <StackNode2D node={{ ...n, position: pos }} />
                          {/* "Top" pointer arrow */}
                          {topNode && (
                            <g>
                              <text x={svgPos.cx - 90} y={svgPos.cy + 5} textAnchor="middle" fontSize={14} fontWeight="600" fill="var(--color-text-secondary)">
                                Top
                              </text>
                              <line 
                                x1={svgPos.cx - 70} y1={svgPos.cy} 
                                x2={svgPos.cx - 45} y2={svgPos.cy} 
                                stroke="var(--color-text-muted)" strokeWidth={1.5} markerEnd="url(#arrowhead-var(--color-border-strong))" 
                              />
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              }

              case 'queue': {
                return (
                  <>
                    {structure.elements.map((n, i) => {
                      const svgPos = toSvg(n.position.x, n.position.y);
                      const isFront = i === 0;
                      const isBack = i === structure.elements.length - 1;
                      
                      return (
                        <g key={n.id}>
                          <QueueNode2D node={n} />
                          {isFront && (
                            <g>
                              <text x={svgPos.cx} y={svgPos.cy - 50} textAnchor="middle" fontSize={14} fontWeight="600" fill="var(--color-text-secondary)">
                                Front
                              </text>
                              <line 
                                x1={svgPos.cx} y1={svgPos.cy - 45} 
                                x2={svgPos.cx} y2={svgPos.cy - 33} 
                                stroke="var(--color-text-muted)" strokeWidth={1.5} markerEnd="url(#arrowhead-var(--color-border-strong))" 
                              />
                            </g>
                          )}
                          {isBack && (
                            <g>
                              <text x={svgPos.cx} y={svgPos.cy + 60} textAnchor="middle" fontSize={14} fontWeight="600" fill="var(--color-text-secondary)">
                                Rear
                              </text>
                              <line 
                                x1={svgPos.cx} y1={svgPos.cy + 45} 
                                x2={svgPos.cx} y2={svgPos.cy + 33} 
                                stroke="var(--color-text-muted)" strokeWidth={1.5} markerEnd="url(#arrowhead-var(--color-border-strong))" 
                              />
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              }

              case 'linked-list':
                return (
                  <>
                    {structure.nodes.length > 0 && (
                      <g>
                        <text x={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cx - 65} y={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cy - 30} textAnchor="middle" fontSize={12} fill="var(--color-text-muted)" fontWeight="600">
                          Head
                        </text>
                        <line 
                          x1={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cx - 65} 
                          y1={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cy - 22} 
                          x2={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cx - 39} 
                          y2={toSvg(structure.nodes[0].position.x, structure.nodes[0].position.y).cy} 
                          stroke="var(--color-text-muted)" strokeWidth={1.5} markerEnd="url(#arrowhead-var(--color-border-strong))" 
                        />
                      </g>
                    )}
                    {structure.nodes.map((n) =>
                      n.next && byId.has(n.next) ? (
                        <ArrowEdge2D key={`${n.id}-e`} from={n.position} to={byId.get(n.next)!.position} offsetX1={37} offsetX2={-39} />
                      ) : null
                    )}
                    {structure.nodes.map((n) => (
                      <LinkedListNode2D key={n.id} node={n} nextNodeId={n.next} />
                    ))}
                  </>
                );

              case 'binary-tree':
              case 'avl-tree':
              case 'heap':
              case 'graph':
                return (
                  <>
                    {structure.type === 'graph' 
                      ? structure.edges.map((e) =>
                          byId.has(e.from) && byId.has(e.to) ? (
                            <Edge2D key={e.id} from={byId.get(e.from)!.position} to={byId.get(e.to)!.position} color="var(--color-border-strong)" />
                          ) : null
                        )
                      : structure.nodes.flatMap((n) => [
                          n.left && byId.has(n.left) ? (
                            <Edge2D key={`${n.id}-l`} from={n.position} to={byId.get(n.left)!.position} />
                          ) : null,
                          n.right && byId.has(n.right) ? (
                            <Edge2D key={`${n.id}-r`} from={n.position} to={byId.get(n.right)!.position} />
                          ) : null,
                        ])
                    }
                    {structure.nodes.map((n) => <CircleNode2D key={n.id} node={n} />)}
                  </>
                );

              case 'hash-table': {
                const gap = 1.7;
                const start = -((structure.buckets.length - 1) * gap) / 2;
                return structure.buckets.map((bucket, bi) => {
                  const bx = start + bi * gap;
                  const { cx, cy } = toSvg(bx, 2.2);
                  return (
                    <g key={bucket.index}>
                      <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="#a0a0b8">{`[${bucket.index}]`}</text>
                      {bucket.entries.map((entry, ei) => (
                        <StackNode2D
                          key={entry.id}
                          node={{ ...entry, position: { x: bx, y: 1.2 - ei * 0.95, z: 0 } }}
                        />
                      ))}
                    </g>
                  );
                });
              }
            }
          })()}
        </AnimatePresence>
      </svg>
    </div>
  );
}
