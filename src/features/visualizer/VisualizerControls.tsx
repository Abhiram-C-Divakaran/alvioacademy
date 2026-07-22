import { Play, Pause, SkipForward, SkipBack, RefreshCcw, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface VisualizerControlsProps {
  title: string;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  dsList: string[];
  activeDs: string;
  onDsSelect: (ds: string) => void;
  showUI?: boolean;
  onToggleUI?: () => void;
}

export default function VisualizerControls({
  title,
  isPlaying,
  currentStep,
  totalSteps,
  onPlayToggle,
  onNext,
  onPrev,
  onReset,
  dsList,
  activeDs,
  onDsSelect,
  showUI = true,
  onToggleUI
}: VisualizerControlsProps) {
  const [isDsTabsMinimized, setIsDsTabsMinimized] = useState(false);
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start pointer-events-none">
      
      {/* Title */}
      {showUI && (
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-4 shadow-xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-1">
            {title}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Interactive 3D Guided Tour
          </p>
        </div>
      )}
        
      {/* Data Structure Tabs (Center) */}
      {showUI && (
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          {!isDsTabsMinimized ? (
            <div className="flex gap-2 bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-2 shadow-xl flex-wrap justify-center max-w-[600px]">
              {dsList.map(ds => (
                <button
                  key={ds}
                  onClick={() => onDsSelect(ds)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeDs === ds 
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-glass-hover)] hover:text-white'
                  }`}
                >
                  {ds}
                </button>
              ))}
              <button 
                onClick={() => setIsDsTabsMinimized(true)}
                className="px-2 text-[var(--color-text-muted)] hover:text-white"
                title="Minimize Tabs"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          ) : (
            <div className="flex bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-1 shadow-xl">
               <button 
                onClick={() => setIsDsTabsMinimized(false)}
                className="px-4 py-1 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white text-sm font-medium"
              >
                <ChevronDown size={16} /> Show {activeDs}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="pointer-events-auto flex items-center gap-3 bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-3 shadow-xl">
        <button 
          onClick={onPrev}
          disabled={currentStep === 0}
          className="p-2 rounded-lg bg-[var(--color-surface-glass)] hover:bg-[var(--color-surface-glass-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-white disabled:opacity-50"
        >
          <SkipBack size={18} />
        </button>
        
        <button 
          onClick={onPlayToggle}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium flex items-center gap-2"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Pause' : 'Auto-Play'}
        </button>
        
        <button 
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="p-2 rounded-lg bg-[var(--color-surface-glass)] hover:bg-[var(--color-surface-glass-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-white disabled:opacity-50"
        >
          <SkipForward size={18} />
        </button>

        <div className="w-px h-6 bg-[var(--color-border-subtle)] mx-1" />

        <button 
          onClick={onReset}
          className="p-2 rounded-lg bg-[var(--color-surface-glass)] hover:bg-[var(--color-surface-glass-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-white"
          title="Reset"
        >
          <RefreshCcw size={18} />
        </button>
        <div className="w-px h-6 bg-[var(--color-border-subtle)] mx-1" />
        <button 
          onClick={onToggleUI}
          className="p-2 rounded-lg bg-[var(--color-surface-glass)] hover:bg-[var(--color-surface-glass-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-white"
          title={showUI ? "Hide UI" : "Show UI"}
        >
          {showUI ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
