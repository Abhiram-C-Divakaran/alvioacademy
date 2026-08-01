const fs = require('fs');

const code = `import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw, Trophy, Skull } from 'lucide-react';
import useProgressStore from '../../stores/useProgressStore';
import { questionBank } from '../../data/quizQuestions';
import type { Question, Topic, Difficulty } from '../../data/quizQuestions';

const topicIdMap: Record<string, string> = {
  'Arrays': 'array',
  'Stacks': 'stack',
  'Binary Trees': 'binary-tree',
  'AVL Trees': 'avl-tree',
  'Graphs': 'graph',
};

const xpRewardMap: Record<Difficulty, number> = {
  'easy': 20,
  'medium': 50,
  'hard': 100,
};

type QuizPhase = 'setup' | 'active' | 'results';

// Squid Game Theme Constants
const COLORS = {
  bg: '#C3B5E3',
  pink: '#E5005A',
  dark: '#202020',
  white: '#FFFFFF',
};

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>('setup');
  
  // Setup State
  const [searchParams] = useSearchParams();
  const initialTopic = (searchParams.get('topic') as Topic) || 'All';
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'All'>(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  useEffect(() => {
    const topicFromUrl = searchParams.get('topic');
    if (topicFromUrl) {
      setSelectedTopic(topicFromUrl as Topic);
    }
  }, [searchParams]);
  
  // Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  const { saveTopicQuizScore, addXp, addTimeSpent } = useProgressStore();

  const availableQuestions = useMemo(() => {
    return questionBank.filter(q => {
      const topicMatch = selectedTopic === 'All' || q.topic === selectedTopic;
      const difficultyMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return topicMatch && difficultyMatch;
    });
  }, [selectedTopic, selectedDifficulty]);

  const handleStartQuiz = () => {
    if (availableQuestions.length === 0) return;
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setAnswers({});
    setPhase('active');
  };

  const handleSelectOption = (optionId: string) => {
    if (answers[currentIdx]) return; 
    setAnswers(prev => ({ ...prev, [currentIdx]: optionId }));
    addTimeSpent(1);

    const question = activeQuestions[currentIdx];
    const isCorrect = optionId === question.correctId;
    
    if (isCorrect) {
      setScore((s) => s + 1);
      addXp(xpRewardMap[question.difficulty]);
    }

    const topicId = topicIdMap[question.topic];
    if (topicId) {
      saveTopicQuizScore(topicId, isCorrect ? 100 : 0);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= activeQuestions.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setPhase('setup');
  };

  // Background Pattern Element
  const BackgroundShapes = () => (
    <div className="fixed inset-0 pointer-events-none opacity-[0.15] z-0 overflow-hidden flex flex-wrap gap-8 justify-around items-center p-8">
      {[...Array(40)].map((_, i) => {
        const shape = i % 3 === 0 ? '○' : i % 3 === 1 ? '△' : '□';
        return (
          <div key={i} className="text-white text-6xl md:text-9xl font-black select-none opacity-50">
            {shape}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-full w-full relative overflow-hidden" style={{ backgroundColor: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>
      <BackgroundShapes />

      {phase === 'setup' && (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl w-full mx-auto text-center"
          >
            <div className="mb-12 space-y-4">
              <div className="flex justify-center gap-6 mb-4 text-white font-black text-5xl">
                <span>○</span>
                <span>△</span>
                <span>□</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-widest text-[#202020] uppercase drop-shadow-md">
                QUIZ GAME
              </h1>
              <p className="text-[#202020] text-xl font-bold uppercase tracking-wider mt-4">
                Test your algorithmic reflexes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Topic Selection */}
              <div className="bg-[#202020] border-4 border-[#202020] rounded-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#E5005A]" />
                <h2 className="text-2xl font-black mb-6 text-white uppercase tracking-widest text-left">
                  1. Choose Topic
                </h2>
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {['All', 'Arrays', 'Stacks', 'Binary Trees', 'AVL Trees', 'Graphs', 'Linked Lists', 'Queues', 'Hash Tables', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Divide and Conquer'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic as Topic | 'All')}
                      className={\`px-4 py-2 text-sm font-black uppercase tracking-wider border-2 transition-all \${
                        selectedTopic === topic
                          ? 'bg-[#E5005A] border-[#E5005A] text-white'
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-[#E5005A] hover:text-[#E5005A]'
                      }\`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="bg-[#202020] border-4 border-[#202020] rounded-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#E5005A]" />
                <h2 className="text-2xl font-black mb-6 text-white uppercase tracking-widest text-left">
                  2. Select Difficulty
                </h2>
                <div className="flex flex-col gap-3">
                  {['All', 'easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff as Difficulty | 'All')}
                      className={\`w-full py-4 text-lg font-black uppercase tracking-widest border-2 transition-all \${
                        selectedDifficulty === diff
                          ? 'bg-[#E5005A] border-[#E5005A] text-white'
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-[#E5005A] hover:text-[#E5005A]'
                      }\`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleStartQuiz}
              disabled={availableQuestions.length === 0}
              className="px-16 py-6 font-black text-3xl text-white uppercase tracking-widest bg-[#E5005A] disabled:opacity-50 hover:bg-white hover:text-[#E5005A] border-4 border-[#E5005A] transition-all shadow-[0_10px_30px_rgba(229,0,90,0.4)]"
            >
              ENTER GAME ({availableQuestions.length} Qs)
            </button>
          </motion.div>
        </div>
      )}

      {phase === 'results' && (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl w-full"
          >
            <div className={\`p-12 border-8 rounded-3xl shadow-2xl \${score / activeQuestions.length >= 0.7 ? 'bg-white border-emerald-500' : 'bg-[#202020] border-[#E5005A]'}\`}>
              {score / activeQuestions.length >= 0.7 ? (
                <Trophy size={80} className="mx-auto mb-6 text-emerald-500" />
              ) : (
                <Skull size={80} className="mx-auto mb-6 text-[#E5005A]" />
              )}
              
              <h2 className={\`text-7xl font-black mb-4 tracking-widest uppercase \${score / activeQuestions.length >= 0.7 ? 'text-emerald-500' : 'text-[#E5005A]'}\`}>
                {score / activeQuestions.length >= 0.7 ? 'SURVIVED' : 'ELIMINATED'}
              </h2>
              
              <div className="text-4xl font-black mb-8">
                <span className={score / activeQuestions.length >= 0.7 ? 'text-gray-800' : 'text-white'}>
                  SCORE: {score} / {activeQuestions.length}
                </span>
              </div>
              
              <button 
                onClick={handleRestart} 
                className={\`px-10 py-4 font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 mx-auto \${score / activeQuestions.length >= 0.7 ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#E5005A] text-white hover:bg-pink-600'}\`}
              >
                <RefreshCw size={24} /> PLAY AGAIN
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {phase === 'active' && activeQuestions.length > 0 && (() => {
        const question = activeQuestions[currentIdx];
        const selectedOptionId = answers[currentIdx] || null;
        const showExplanation = !!selectedOptionId;
        const shapes = ['○', '△', '□', '×'];

        return (
          <div className="relative min-h-[80vh] flex flex-col p-6 z-10 max-w-4xl mx-auto pt-10 pb-32">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#202020] text-white text-xs font-black uppercase tracking-widest rounded-full">{question.topic}</span>
                <span className="px-3 py-1 bg-[#E5005A] text-white text-xs font-black uppercase tracking-widest rounded-full">{question.difficulty}</span>
              </div>
              <span className="text-xl font-black text-[#202020]">
                {currentIdx + 1} / {activeQuestions.length}
              </span>
            </div>
            
            {/* Pink Progress Bar */}
            <div className="w-full h-3 bg-white/40 rounded-full mb-10 overflow-hidden shadow-inner border-2 border-white/50">
              <motion.div
                className="h-full bg-[#E5005A]"
                animate={{ width: \`\${((currentIdx + 1) / activeQuestions.length) * 100}%\` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Layout with Next/Back side buttons */}
            <div className="flex items-stretch gap-4 md:gap-6 w-full">
              
              {/* Back Button */}
              <button 
                onClick={handlePrev} 
                disabled={currentIdx === 0}
                className="hidden md:flex w-16 h-16 rounded-full bg-[#202020] hover:bg-[#E5005A] text-white items-center justify-center disabled:opacity-30 disabled:hover:bg-[#202020] transition-colors shrink-0 shadow-lg mt-20"
              >
                <ArrowLeft size={28} strokeWidth={3} />
              </button>

              {/* Main Content Area */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-[#202020]"
                  >
                    <h2 className="text-2xl md:text-3xl font-black mb-6 text-[#202020] leading-snug">
                      {question.question}
                    </h2>

                    {question.codeSnippet && (
                      <div className="mb-6 rounded-lg border-2 border-[#202020] bg-gray-50 overflow-hidden">
                        <pre className="p-4 text-sm text-[#202020] font-mono overflow-x-auto">
                          <code>{question.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      {question.options.map((option, idx) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.id === question.correctId;
                        const showStatus = showExplanation;
                        
                        let optionStyle = 'bg-gray-100 border-2 border-gray-200 text-[#202020] hover:border-[#E5005A] hover:bg-pink-50';
                        if (showStatus) {
                          if (isCorrect) optionStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900';
                          else if (isSelected && !isCorrect) optionStyle = 'bg-red-100 border-2 border-red-500 text-red-900';
                          else optionStyle = 'bg-gray-100 border-2 border-gray-200 opacity-50';
                        }

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleSelectOption(option.id)}
                            disabled={showExplanation}
                            className={\`w-full flex items-center p-4 rounded-xl transition-all font-bold text-left \${optionStyle}\`}
                          >
                            <span className="w-10 h-10 shrink-0 bg-[#202020] text-white flex items-center justify-center rounded-lg font-black text-xl mr-4 shadow-sm">
                              {shapes[idx % 4]}
                            </span>
                            <span className="text-lg">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gray-100 border-l-8 border-[#E5005A] p-6 rounded-r-xl"
                      >
                        <h4 className="font-black text-lg text-[#202020] uppercase tracking-widest mb-2">Explanation</h4>
                        <p className="text-gray-700 font-medium leading-relaxed">{question.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                className={\`hidden md:flex w-16 h-16 rounded-full items-center justify-center transition-colors shrink-0 shadow-lg mt-20 \${
                  showExplanation 
                    ? 'bg-[#E5005A] hover:bg-pink-600 text-white animate-pulse' 
                    : 'bg-[#202020] hover:bg-[#E5005A] text-white'
                }\`}
              >
                <ArrowRight size={28} strokeWidth={3} />
              </button>

            </div>

            {/* Mobile Nav */}
            <div className="flex md:hidden justify-between mt-6">
              <button 
                onClick={handlePrev} 
                disabled={currentIdx === 0}
                className="w-14 h-14 rounded-full bg-[#202020] text-white flex items-center justify-center disabled:opacity-30"
              >
                <ArrowLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="w-14 h-14 rounded-full bg-[#E5005A] text-white flex items-center justify-center"
              >
                <ArrowRight size={24} />
              </button>
            </div>

          </div>
        );
      })()}
    </div>
  );
}
`;

fs.writeFileSync('src/features/quiz/QuizPage.tsx', code);
console.log("Successfully rewrote QuizPage.tsx");
