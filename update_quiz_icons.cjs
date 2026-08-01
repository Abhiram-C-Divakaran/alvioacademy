const fs = require('fs');

const code = `import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw, Trophy, Skull, Circle, Triangle, Square, X } from 'lucide-react';
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

const TypewriterHeading = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-5xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 uppercase drop-shadow-md">
      {displayed}
      <span className="animate-pulse">_</span>
    </h1>
  );
};

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>('setup');
  
  // Reset phase when clicking the nav link again
  const location = useLocation();
  useEffect(() => {
    setPhase('setup');
  }, [location.key]);
  
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
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5).slice(0, 10).map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
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
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden flex flex-wrap gap-12 justify-around items-center p-8 mix-blend-screen">
      {[...Array(40)].map((_, i) => {
        const shape = i % 3 === 0 ? <Circle size={64} strokeWidth={3} /> : i % 3 === 1 ? <Triangle size={64} strokeWidth={3} /> : <Square size={64} strokeWidth={3} />;
        return (
          <div key={i} className="text-white opacity-50 flex items-center justify-center">
            {shape}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-full w-full relative overflow-hidden bg-transparent font-sans">
      <BackgroundShapes />

      {phase === 'setup' && (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl w-full mx-auto text-center"
          >
            <div className="mb-12 space-y-4">
              <div className="flex justify-center items-center gap-6 mb-6 text-indigo-400">
                <Circle size={48} strokeWidth={3} />
                <Triangle size={48} strokeWidth={3} />
                <Square size={48} strokeWidth={3} />
              </div>
              <TypewriterHeading text="QUIZ GAME" />
              <p className="text-gray-300 text-lg font-bold uppercase tracking-wider mt-4">
                Test your algorithmic reflexes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Topic Selection */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-50" />
                <h2 className="text-xl font-black mb-6 text-white uppercase tracking-widest text-left">
                  1. Choose Topic
                </h2>
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {['All', 'Arrays', 'Stacks', 'Binary Trees', 'AVL Trees', 'Graphs', 'Linked Lists', 'Queues', 'Hash Tables', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Divide and Conquer'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic as Topic | 'All')}
                      className={\`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all rounded-full \${
                        selectedTopic === topic
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-indigo-500 hover:text-indigo-400'
                      }\`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-50" />
                <h2 className="text-xl font-black mb-6 text-white uppercase tracking-widest text-left">
                  2. Select Difficulty
                </h2>
                <div className="flex flex-col gap-3">
                  {['All', 'easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff as Difficulty | 'All')}
                      className={\`w-full py-4 text-sm font-bold uppercase tracking-widest border transition-all rounded-full \${
                        selectedDifficulty === diff
                          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500 hover:text-purple-400'
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
              className="px-14 py-5 font-black text-xl text-white uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full disabled:opacity-50 hover:scale-[1.03] border border-white/10 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
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
            <div className={\`p-12 border rounded-[3rem] shadow-2xl backdrop-blur-md \${score / activeQuestions.length >= 0.7 ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}\`}>
              {score / activeQuestions.length >= 0.7 ? (
                <Trophy size={80} className="mx-auto mb-6 text-emerald-400" />
              ) : (
                <Skull size={80} className="mx-auto mb-6 text-red-400" />
              )}
              
              <h2 className={\`text-5xl md:text-6xl font-black mb-4 tracking-widest uppercase \${score / activeQuestions.length >= 0.7 ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]'}\`}>
                {score / activeQuestions.length >= 0.7 ? 'SURVIVED' : 'ELIMINATED'}
              </h2>
              
              <div className="text-3xl font-black mb-8">
                <span className="text-white">
                  SCORE: {score} / {activeQuestions.length}
                </span>
              </div>
              
              <button 
                onClick={handleRestart} 
                className={\`px-10 py-4 font-black text-sm rounded-full uppercase tracking-widest transition-all flex items-center justify-center gap-3 mx-auto shadow-lg \${score / activeQuestions.length >= 0.7 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}\`}
              >
                <RefreshCw size={20} /> PLAY AGAIN
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {phase === 'active' && activeQuestions.length > 0 && (() => {
        const question = activeQuestions[currentIdx];
        const selectedOptionId = answers[currentIdx] || null;
        const showExplanation = !!selectedOptionId;
        const shapes = [
          <Circle size={20} strokeWidth={3} />, 
          <Triangle size={20} strokeWidth={3} />, 
          <Square size={20} strokeWidth={3} />, 
          <X size={20} strokeWidth={3} />
        ];

        return (
          <div className="relative min-h-[80vh] flex flex-col p-6 z-10 max-w-4xl mx-auto pt-10 pb-32">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{question.topic}</span>
                <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full">{question.difficulty}</span>
              </div>
              <span className="text-sm font-black text-gray-400">
                {currentIdx + 1} / {activeQuestions.length}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden shadow-inner border border-white/10">
              <motion.div
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
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
                className="hidden md:flex w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white items-center justify-center disabled:opacity-20 disabled:hover:bg-white/5 transition-colors shrink-0 mt-20"
              >
                <ArrowLeft size={24} strokeWidth={2.5} />
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
                    className="bg-[#140D33]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10"
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-white leading-relaxed">
                      {question.question}
                    </h2>

                    {question.codeSnippet && (
                      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden">
                        <pre className="p-5 text-xs text-gray-300 font-mono overflow-x-auto">
                          <code>{question.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      {question.options.map((option, idx) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.id === question.correctId;
                        const showStatus = showExplanation;
                        
                        let optionStyle = 'bg-white/5 border border-white/10 text-gray-300 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white';
                        if (showStatus) {
                          if (isCorrect) optionStyle = 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300';
                          else if (isSelected && !isCorrect) optionStyle = 'bg-red-500/20 border border-red-500/50 text-red-300';
                          else optionStyle = 'bg-white/5 border border-white/10 opacity-30 text-gray-500';
                        }

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleSelectOption(option.id)}
                            disabled={showExplanation}
                            className={\`w-full flex items-center p-4 rounded-full transition-all font-semibold text-left \${optionStyle}\`}
                          >
                            <span className="w-10 h-10 shrink-0 bg-black/40 text-gray-400 flex items-center justify-center rounded-full border border-white/5 shadow-inner mr-4">
                              {shapes[idx % 4]}
                            </span>
                            <span className="text-sm">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-indigo-900/20 border-l-4 border-indigo-500 p-5 rounded-2xl mt-6"
                      >
                        <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-widest mb-2">Explanation</h4>
                        <p className="text-sm text-gray-300 font-medium leading-relaxed">{question.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                className={\`hidden md:flex w-14 h-14 rounded-full items-center justify-center transition-colors shrink-0 mt-20 \${
                  showExplanation 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white'
                }\`}
              >
                <ArrowRight size={24} strokeWidth={2.5} />
              </button>

            </div>

            {/* Mobile Nav */}
            <div className="flex md:hidden justify-between mt-6">
              <button 
                onClick={handlePrev} 
                disabled={currentIdx === 0}
                className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center disabled:opacity-20"
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center"
              >
                <ArrowRight size={20} />
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
console.log("Successfully rewrote QuizPage.tsx to use SVG icons and typewriter animations");
