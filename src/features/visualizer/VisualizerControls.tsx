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
  hidePlaybackControls?: boolean;
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
  onToggleUI,
  hidePlaybackControls = false
}: VisualizerControlsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="flex-shrink-0 relative z-50 p-4 border-b border-white/10 bg-[#0B1120]/60 backdrop-blur-xl flex justify-between items-center shadow-lg">
      
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
        
      {/* Algorithm Selector Dropdown (Center) */}
      {showUI && (
        <div className="pointer-events-auto flex flex-col items-center gap-1 relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-6 py-2.5 bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-colors shadow-xl"
          >
            {activeDs} {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isDropdownOpen && (
            <>
              {/* Backdrop for closing dropdown */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              
              <div className="absolute top-full mt-2 w-[480px] left-1/2 -translate-x-1/2 bg-[#0B1120] border border-[var(--color-border-subtle)] rounded-xl p-3 shadow-2xl z-50 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {dsList.map(ds => (
                  <button
                    key={ds}
                    onClick={() => {
                      onDsSelect(ds);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left truncate ${
                      activeDs === ds 
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {ds}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center gap-3">
        {!hidePlaybackControls && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-[var(--color-border-subtle)] rounded-xl p-2 shadow-xl">
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
        )}
      </div>
    </div>
  );
}
