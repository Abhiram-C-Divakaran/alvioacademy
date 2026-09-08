import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
const sortingSteps = [[5, 2, 4, 1, 3], [2, 5, 4, 1, 3], [2, 4, 5, 1, 3], [2, 4, 1, 5, 3], [2, 4, 1, 3, 5], [2, 1, 4, 3, 5], [2, 1, 3, 4, 5], [1, 2, 3, 4, 5]];
export function SortingPreview() {
  const [step, setStep] = useState(0);
  const complete = step === sortingSteps.length - 1;
  return <div className="lp-sorting-demo">
    <span className="lp-label">BUBBLE SORT · ADJACENT SWAPS</span>
    <div className="lp-sort-bars" aria-label={`Array: ${sortingSteps[step].join(', ')}`}>{sortingSteps[step].map((n, i) => <i key={i} style={{ height: n * 10 }}>
      <span>{n}</span>
    </i>)}</div>
    <button className="lp-inline-control" onClick={() => setStep(complete ? 0 : step + 1)}>{complete ? <>
      <RotateCcw size={12} />Try again</> : <>Next sorting step<ArrowRight size={12} />
    </>}</button>
    <span className="lp-sort-status" aria-live="polite">{complete ? 'Sorted' : `Swap ${step} of 7`}</span>
  </div>;
}
export function GraphPreview() {
  const nodes = [[35, 42], [105, 15], [105, 72], [185, 42], [260, 16], [260, 72]];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 5]];
  return <div className="lp-graph-preview">
    <div>
      <span className="lp-label">GRAPH TRAVERSAL</span>
      <strong>Breadth-first search</strong>
      <small>Explore neighbors before going deeper.</small>
    </div>
    <svg viewBox="0 0 300 95" role="img" aria-label="Graph with six connected nodes. Breadth-first search has visited nodes A, B, and C.">{edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#60578e" />)}{nodes.map(([x, y], i) => <g key={i}>
      <circle cx={x} cy={y} r="12" fill={i < 3 ? '#1b625f' : '#262143'} stroke={i < 3 ? '#4bd8c7' : '#8b77bc'} />
      <text x={x} y={y + 3} fontSize="9" fill="#eff5ff" textAnchor="middle">{String.fromCharCode(65 + i)}</text>
    </g>)}</svg>
  </div>;
}
