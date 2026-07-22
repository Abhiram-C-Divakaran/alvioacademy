// ============================================================
// Visualization Store — Zustand state for the 3D viz engine
// ============================================================
import { create } from 'zustand';
import type {
  DataStructureType,
  DataStructure,
  AnimationTimeline,
  AnimationStatus,
} from '../types/dataStructures';

interface VisualizationState {
  /** Currently selected data structure type */
  activeStructureType: DataStructureType;
  /** The live data structure object being visualized */
  structure: DataStructure | null;
  /** Animation timeline state */
  timeline: AnimationTimeline;
  /** Current user input value for operations */
  inputValue: string;
  /** Secondary input (e.g. index for array operations) */
  inputIndex: string;
}

interface VisualizationActions {
  setActiveStructure: (type: DataStructureType) => void;
  setStructure: (structure: DataStructure | null) => void;
  setInputValue: (value: string) => void;
  setInputIndex: (index: string) => void;
  setAnimationStatus: (status: AnimationStatus) => void;
  setCurrentStep: (step: number) => void;
  setSpeed: (speed: number) => void;
  resetTimeline: () => void;
}

const defaultTimeline: AnimationTimeline = {
  steps: [],
  currentStep: 0,
  status: 'idle',
  speed: 1,
};

/**
 * Central store for the 3D visualization engine.
 * Controls which data structure is active, animation playback,
 * and user input for operations.
 */
const useVisualizationStore = create<VisualizationState & VisualizationActions>((set) => ({
  // ---- State ----
  activeStructureType: 'array',
  structure: null,
  timeline: { ...defaultTimeline },
  inputValue: '',
  inputIndex: '',

  // ---- Actions ----
  setActiveStructure: (type) =>
    set({ activeStructureType: type, structure: null, timeline: { ...defaultTimeline } }),

  setStructure: (structure) =>
    set({ structure }),

  setInputValue: (value) =>
    set({ inputValue: value }),

  setInputIndex: (index) =>
    set({ inputIndex: index }),

  setAnimationStatus: (status) =>
    set((state) => ({
      timeline: { ...state.timeline, status },
    })),

  setCurrentStep: (step) =>
    set((state) => ({
      timeline: { ...state.timeline, currentStep: step },
    })),

  setSpeed: (speed) =>
    set((state) => ({
      timeline: { ...state.timeline, speed },
    })),

  resetTimeline: () =>
    set({ timeline: { ...defaultTimeline } }),
}));

export default useVisualizationStore;
