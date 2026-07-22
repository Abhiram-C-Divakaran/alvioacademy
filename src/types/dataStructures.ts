// ============================================================
// Data Structures & Algorithms Platform — Type Definitions
// ============================================================

// ---- Primitive Data Structure Types ----

/** Supported data structure kinds */
export type DataStructureType =
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'binary-tree'
  | 'avl-tree'
  | 'graph'
  | 'hash-table'
  | 'heap';

/** Supported operations on any data structure */
export type OperationType =
  | 'insert'
  | 'delete'
  | 'search'
  | 'traverse'
  | 'rotate'
  | 'balance'
  | 'hash';

/** Traversal strategies */
export type TraversalType =
  | 'bfs'
  | 'dfs'
  | 'inorder'
  | 'preorder'
  | 'postorder';

// ---- 3D Position / Visual Helpers ----

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface NodeState {
  /** Whether this node is currently highlighted (traversal / search) */
  highlighted: boolean;
  /** Whether this node is in an "active" animation state */
  active: boolean;
  /** Visual color override */
  color?: string;
}

// ---- Node & Edge (used across structures) ----

export interface DSANode {
  id: string;
  value: number | string;
  position: Position3D;
  state: NodeState;
}

export interface DSAEdge {
  id: string;
  from: string;   // Node id
  to: string;     // Node id
  directed: boolean;
  weight?: number;
  state: NodeState;
}

// ---- Specific Structures ----

export interface ArrayStructure {
  type: 'array';
  elements: DSANode[];
  capacity: number;
}

export interface LinkedListNode extends DSANode {
  next: string | null; // id of next node
}

export interface LinkedListStructure {
  type: 'linked-list';
  head: string | null;
  nodes: LinkedListNode[];
}

export interface StackStructure {
  type: 'stack';
  elements: DSANode[];
  maxSize: number;
}

export interface QueueStructure {
  type: 'queue';
  elements: DSANode[];
  maxSize: number;
}

export interface TreeNode extends DSANode {
  left: string | null;
  right: string | null;
  height?: number;       // for AVL
  balanceFactor?: number; // for AVL
}

export interface BinaryTreeStructure {
  type: 'binary-tree' | 'avl-tree';
  root: string | null;
  nodes: TreeNode[];
}

export interface GraphStructure {
  type: 'graph';
  nodes: DSANode[];
  edges: DSAEdge[];
  directed: boolean;
  weighted: boolean;
}

export interface HashBucket {
  index: number;
  entries: DSANode[];
}

export interface HashTableStructure {
  type: 'hash-table';
  buckets: HashBucket[];
  size: number;
  hashFunction: string; // description of the hash function
}

export interface HeapStructure {
  type: 'heap';
  root: string | null;
  nodes: TreeNode[];
  heapType: 'min' | 'max';
}

/** Union of all structure types */
export type DataStructure =
  | ArrayStructure
  | LinkedListStructure
  | StackStructure
  | QueueStructure
  | BinaryTreeStructure
  | GraphStructure
  | HashTableStructure
  | HeapStructure;

// ---- Animation Engine ----

export type AnimationStatus = 'idle' | 'playing' | 'paused' | 'complete';

export interface AnimationStep {
  id: string;
  description: string;
  /** Nodes affected in this step */
  affectedNodes: string[];
  /** Edges affected in this step */
  affectedEdges: string[];
  /** The structure state after this step */
  structureSnapshot: DataStructure;
  /** Duration in ms */
  duration: number;
}

export interface AnimationTimeline {
  steps: AnimationStep[];
  currentStep: number;
  status: AnimationStatus;
  speed: number; // 0.5x, 1x, 2x
}

// ---- Visualization Store ----

export interface VisualizationState {
  activeStructureType: DataStructureType;
  structure: DataStructure | null;
  timeline: AnimationTimeline;
  inputValue: string;
}
