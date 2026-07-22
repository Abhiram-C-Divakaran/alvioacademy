// ============================================================
// Quiz Page — Complete Quiz System with Question Bank
// ============================================================
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Code2, BookOpen, Settings } from 'lucide-react';
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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const { saveTopicQuizScore, addXp, addTimeSpent } = useProgressStore();

  // Filter available questions based on selection
  const availableQuestions = useMemo(() => {
    return questionBank.filter(q => {
      const topicMatch = selectedTopic === 'All' || q.topic === selectedTopic;
      const difficultyMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return topicMatch && difficultyMatch;
    });
  }, [selectedTopic, selectedDifficulty]);

  const handleStartQuiz = () => {
    if (availableQuestions.length === 0) return;
    
    // Shuffle and pick up to 10 questions for the session
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOptionId(null);
    setShowExplanation(false);
    setPhase('active');
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId) return; // Prevent multiple selections
    
    setSelectedOptionId(optionId);
    setShowExplanation(true);
    addTimeSpent(1); // Approximate 1 minute per question

    const question = activeQuestions[currentIdx];
    const isCorrect = optionId === question.correctId;
    
    if (isCorrect) {
      setScore((s) => s + 1);
      addXp(xpRewardMap[question.difficulty]);
    }

    const topicId = topicIdMap[question.topic];
    if (topicId) {
      // Save 100 if correct, 0 if wrong, to update the topic's quiz score running average
      saveTopicQuizScore(topicId, isCorrect ? 100 : 0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= activeQuestions.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setPhase('setup');
  };

  if (phase === 'setup') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Settings className="text-[var(--color-accent-primary)]" size={28} />
          <h1 className="text-3xl font-bold">Quiz Setup</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Topic Selection */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold mb-4">Select Topic</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Arrays', 'Stacks', 'Binary Trees', 'AVL Trees', 'Graphs'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic as Topic | 'All')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedTopic === topic
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </Card>

          {/* Difficulty Selection */}
          <Card padding="lg" className="shadow-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">Select Difficulty</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as Difficulty | 'All')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    selectedDifficulty === diff
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card padding="lg" className="flex flex-col items-center justify-center text-center shadow-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)]">
          <p className="text-[var(--color-text-secondary)] font-medium mb-6">
            Found <strong className="text-white">{availableQuestions.length}</strong> questions matching your criteria.
            <br />
            The quiz will consist of up to 10 randomly selected questions from this pool.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleStartQuiz}
            disabled={availableQuestions.length === 0}
            className="font-semibold shadow-sm"
          >
            Start Quiz <ArrowRight size={18} />
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === 'results') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <Card padding="xl" className="flex flex-col items-center shadow-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)]">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-gradient-to-tr from-blue-500 to-indigo-500"
            >
              <Trophy size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-[var(--color-text-primary)]">Quiz Complete!</h2>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">{percentage}%</p>
            <p className="text-[var(--color-text-secondary)] font-medium mb-8">
              You scored {score} out of {activeQuestions.length} correctly.
            </p>
            <Button variant="primary" onClick={handleRestart} className="w-full justify-center font-semibold shadow-sm">
              <RotateCcw size={16} /> New Quiz
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Active Phase
  const question = activeQuestions[currentIdx];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header / Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="accent">{question.topic}</Badge>
          <Badge variant={question.difficulty === 'hard' ? 'error' : question.difficulty === 'medium' ? 'warning' : 'success'}>
            {question.difficulty.toUpperCase()}
          </Badge>
          {question.type === 'coding' ? (
            <Badge variant="default" icon={<Code2 size={12} />}>Coding</Badge>
          ) : (
            <Badge variant="default" icon={<BookOpen size={12} />}>Theory</Badge>
          )}
        </div>
        <span className="text-sm font-bold text-[var(--color-text-muted)]">
          {currentIdx + 1} / {activeQuestions.length}
        </span>
      </div>
      
      <div className="w-full h-1.5 rounded-full mb-8 bg-[var(--color-bg-tertiary)] overflow-hidden border border-[var(--color-border-subtle)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          animate={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 leading-snug tracking-tight text-[var(--color-text-primary)]">{question.question}</h2>

          {question.codeSnippet && (
            <div className="mb-6 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] shadow-inner">
              <pre className="p-4 bg-[#0d0d12] text-sm text-[#cccccc] font-mono overflow-x-auto">
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((opt) => {
              let borderColor = 'var(--color-border-subtle)';
              let bg = 'var(--color-surface-glass)';
              let isSelectedCorrect = false;

              if (selectedOptionId) {
                if (opt.id === question.correctId) {
                  borderColor = 'rgba(16, 185, 129, 0.4)';
                  bg = 'rgba(16, 185, 129, 0.1)';
                  isSelectedCorrect = selectedOptionId === opt.id;
                } else if (opt.id === selectedOptionId && opt.id !== question.correctId) {
                  borderColor = 'rgba(239, 68, 68, 0.4)';
                  bg = 'rgba(239, 68, 68, 0.1)';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center gap-4 hover:bg-[var(--color-bg-hover)]"
                  style={{
                    background: bg,
                    border: `1px solid ${borderColor}`,
                    cursor: selectedOptionId ? 'default' : 'pointer',
                  }}
                  disabled={selectedOptionId !== null}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border border-white/10 shadow-sm"
                    style={{
                      background: selectedOptionId && opt.id === question.correctId
                        ? 'var(--color-success)'
                        : selectedOptionId && opt.id === selectedOptionId
                        ? 'var(--color-error)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: selectedOptionId && (opt.id === question.correctId || opt.id === selectedOptionId) 
                        ? 'white' 
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {selectedOptionId && opt.id === question.correctId ? (
                      <CheckCircle2 size={18} />
                    ) : selectedOptionId && opt.id === selectedOptionId ? (
                      <XCircle size={18} />
                    ) : (
                      opt.id.toUpperCase()
                    )}
                  </span>
                  <span className={`text-[15px] font-semibold leading-relaxed ${selectedOptionId && (opt.id === question.correctId || opt.id === selectedOptionId) ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card padding="lg" className="mb-8 border-[var(--color-border-subtle)] bg-blue-500/5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <h3 className="text-base font-bold text-blue-400">
                      Explanation
                    </h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] font-medium">
                    {question.explanation}
                  </p>
                </Card>

                <div className="flex justify-end">
                  <Button variant="primary" size="lg" onClick={handleNext} className="font-semibold shadow-sm">
                    {currentIdx + 1 >= activeQuestions.length ? 'View Results' : 'Next Question'}
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
