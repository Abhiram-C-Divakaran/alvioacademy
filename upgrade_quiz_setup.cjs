const fs = require('fs');
let code = fs.readFileSync('src/features/quiz/QuizPage.tsx', 'utf8');

// 1. Add missing lucide-react icons
code = code.replace(
  "import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Code2, BookOpen, Settings } from 'lucide-react';",
  "import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Code2, BookOpen, Settings, Gamepad2, Sparkles, BrainCircuit, Zap, Coffee } from 'lucide-react';"
);

// 2. Replace the setup phase block completely
const oldSetupBlock = `  if (phase === 'setup') {
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
                  className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all \${
                    selectedTopic === topic
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)]'
                  }\`}
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
                  className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize \${
                    selectedDifficulty === diff
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)]'
                  }\`}
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
  }`;

const newSetupBlock = `  if (phase === 'setup') {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6">
        {/* Background playful blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full mx-auto relative z-10"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-6 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Gamepad2 className="text-blue-400" size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Ready to Play?
            </h1>
            <p className="text-gray-300 text-lg flex items-center justify-center gap-3">
              <Coffee size={24} className="text-amber-400" />
              Take a deep breath, grab a drink, and let's test your knowledge!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Topic Selection */}
            <Card padding="xl" className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <BrainCircuit className="text-blue-400" size={24} />
                Choose Your Battleground
              </h2>
              <div className="flex flex-wrap gap-3">
                {['All', 'Arrays', 'Stacks', 'Binary Trees', 'AVL Trees', 'Graphs'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic as Topic | 'All')}
                    className={\`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 \${
                      selectedTopic === topic
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                    }\`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>

            {/* Difficulty Selection */}
            <Card padding="xl" className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Zap className="text-purple-400" size={24} />
                Select Intensity
              </h2>
              <div className="flex flex-wrap gap-3">
                {['All', 'easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff as Difficulty | 'All')}
                    className={\`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize \${
                      selectedDifficulty === diff
                        ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                    }\`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex flex-col items-center justify-center text-center mt-12 pb-10">
            <p className="text-gray-300 font-medium mb-10 text-lg">
              We found <strong className="text-white text-2xl mx-1.5">{availableQuestions.length}</strong> questions for you.
              <br />
              <span className="text-sm text-gray-500 mt-3 block font-bold uppercase tracking-wider">You'll get a fun mix of up to 10 questions. No pressure!</span>
            </p>
            
            <button 
              onClick={handleStartQuiz}
              disabled={availableQuestions.length === 0}
              className="group relative px-10 py-5 rounded-full font-extrabold text-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all transform hover:scale-[1.03]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-4">
                <Sparkles size={28} className="animate-pulse text-yellow-200" />
                Let's Go!
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }`;

if (code.includes("Quiz Setup")) {
  code = code.replace(oldSetupBlock, newSetupBlock);
  fs.writeFileSync('src/features/quiz/QuizPage.tsx', code);
  console.log("Successfully overhauled quiz setup!");
} else {
  console.log("Could not find setup block!");
}
