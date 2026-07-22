import { motion, AnimatePresence } from 'framer-motion';

export interface TutorialStep {
  index: number | null | string | (number | string)[]; // index or id of the active element(s)
  title: string;
  text: string;
}

interface TutorialOverlayProps {
  currentStep: number;
  totalSteps: number;
  tutorialSteps: TutorialStep[];
}

export default function TutorialOverlay({ currentStep, totalSteps, tutorialSteps }: TutorialOverlayProps) {
  const currentTutorial = tutorialSteps[currentStep];

  if (!currentTutorial) return null;

  return (
    <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none px-6">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto max-w-2xl w-full bg-black/60 backdrop-blur-xl border border-[var(--color-border-subtle)] rounded-2xl p-6 shadow-[0_0_40px_rgba(99,102,241,0.15)] text-center relative overflow-hidden"
        >
          {/* Subtle gradient line at the top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <h3 className="text-xl font-bold text-white mb-2">{currentTutorial.title}</h3>
          <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
            {currentTutorial.text}
          </p>
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-blue-500' : 'w-2 bg-gray-600'}`} 
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
