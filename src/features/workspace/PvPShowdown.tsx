import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Play, Trophy, ShieldAlert, Cpu, Code2, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function PvPShowdown() {
  const navigate = useNavigate();
  
  // Game states
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'ended'>('lobby');
  const [userCode, setUserCode] = useState('// Solve the challenge here:\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  // Write your code here...\n}');
  const [aiProgress, setAiProgress] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState('Idle');
  const [winner, setWinner] = useState<'user' | 'ai' | null>(null);
  
  // Sabotage options
  const [cooldown, setCooldown] = useState(0);
  const [aiSpeedMultiplier, setAiSpeedMultiplier] = useState(1);

  // AI simulated typing codes
  const aiCodeDrafts = [
    "function reverseList(head) {",
    "  let prev = null;",
    "  let curr = head;",
    "  while (curr !== null) {",
    "    let nextTemp = curr.next;",
    "    curr.next = prev;",
    "    prev = curr;",
    "    curr = nextTemp;",
    "  }",
    "  return prev;",
    "}"
  ];
  const [aiCode, setAiCode] = useState('');

  // Start the duel
  const startDuel = () => {
    setGameState('playing');
    setAiProgress(0);
    setUserProgress(0);
    setAiStatus('Analyzing structure...');
    setWinner(null);
    setAiCode('');
    setAiSpeedMultiplier(1);
  };

  // AI progress simulator loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let progressTimer = setInterval(() => {
      setAiProgress(prev => {
        const increment = (Math.random() * 4 + 1) * aiSpeedMultiplier;
        const next = Math.min(100, prev + increment);
        
        // Dynamic status updates based on progress
        if (next < 25) setAiStatus('Writing initial definitions...');
        else if (next < 55) setAiStatus('Flipping node pointers...');
        else if (next < 85) setAiStatus('Compiling AST targets...');
        else if (next < 100) setAiStatus('Running validation test cases...');
        else {
          setGameState('ended');
          setWinner('ai');
          setAiStatus('Completed task successfully!');
          clearInterval(progressTimer);
        }
        return next;
      });
    }, 1000);

    // AI typing code simulation
    let lineIndex = 0;
    let codeTimer = setInterval(() => {
      if (lineIndex < aiCodeDrafts.length) {
        setAiCode(prev => prev + (prev ? '\n' : '') + aiCodeDrafts[lineIndex]);
        lineIndex++;
      } else {
        clearInterval(codeTimer);
      }
    }, 4000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(codeTimer);
    };
  }, [gameState, aiSpeedMultiplier]);

  // Handle User compile trigger
  const handleUserCompile = () => {
    if (gameState !== 'playing') return;
    
    // Simulate user progress milestone
    setUserProgress(prev => {
      const next = Math.min(100, prev + 25);
      if (next >= 100) {
        setGameState('ended');
        setWinner('user');
        setAiStatus('Defeated by candidate!');
      }
      return next;
    });
  };

  // Trigger sabotage to slow down the AI
  const triggerSabotage = () => {
    if (gameState !== 'playing' || cooldown > 0) return;
    setAiSpeedMultiplier(0.3); // Slow down AI by 70%
    setCooldown(15); // 15s cooldown
    setAiStatus('⚠️ CPU Throttled by opponent!');
    
    // Reset multiplier after 5 seconds
    setTimeout(() => {
      setAiSpeedMultiplier(1);
    }, 5000);
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070214] text-white">
      
      {/* Title Header Panel */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-white/5 bg-[#140D33]/40 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2.5">
              PvP Showdown Arena <Swords size={18} className="text-red-400 animate-pulse" />
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time competitive DSA Racing</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <button
              onClick={triggerSabotage}
              disabled={cooldown > 0}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                cooldown > 0 
                  ? 'bg-white/5 border-transparent text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              }`}
            >
              <Zap size={13} /> {cooldown > 0 ? `Sabotage CD (${cooldown}s)` : 'Deploy CPU Overload (Sabotage)'}
            </button>
          </div>
        )}
      </div>

      {/* Main Split Area */}
      <div className="flex-1 flex overflow-hidden">
        {gameState === 'lobby' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <Swords size={40} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Enter the Coding Arena</h2>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Compete split-screen against a simulated LLaMA coding agent. Complete milestones to trigger CPU throttling and sabotage their progress!
              </p>
            </div>
            <button 
              onClick={startDuel}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Start Duel Match
            </button>
          </div>
        ) : gameState === 'ended' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-lg ${
              winner === 'user' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' 
                : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
            }`}>
              <Trophy size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">
                {winner === 'user' ? '🏆 Victory! Challenge Defeated' : '💀 Defeat! LLaMA won the Race'}
              </h2>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                {winner === 'user' 
                  ? 'Excellent coding speed! Your optimized linked list rotation beats the automated candidate logic.' 
                  : 'The AI completed test validations before you. Refactor your code helper modules and try again.'}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={startDuel}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                Rematch
              </button>
              <button 
                onClick={() => setGameState('lobby')}
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                Lobby
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Column: User Editor */}
            <div className="flex-1 flex flex-col h-full border-r border-white/5 relative min-w-0">
              <div className="flex-shrink-0 px-5 py-3.5 bg-black/30 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code2 size={15} className="text-indigo-400" />
                  <span className="text-xs font-black text-white">Your Workspace (Candidate)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400">Progress: {Math.round(userProgress)}%</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${userProgress}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={userCode}
                  onChange={(val) => setUserCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                />
              </div>
              
              {/* Floating Trigger compile button */}
              <div className="absolute bottom-5 right-5 z-10">
                <button
                  onClick={handleUserCompile}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2"
                >
                  <Play size={12} fill="currentColor" /> Run & Pass Test Case
                </button>
              </div>
            </div>

            {/* Right Column: AI Opponent Console */}
            <div className="flex-1 flex flex-col h-full bg-[#0A051A]/60 min-w-0">
              <div className="flex-shrink-0 px-5 py-3.5 bg-black/40 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Cpu size={15} className="text-red-400" />
                  <span className="text-xs font-black text-white">AI Candidate (Opponent)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400">Progress: {Math.round(aiProgress)}%</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${aiProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Status Header */}
              <div className="p-4 bg-red-500/5 border-b border-white/5 flex items-center gap-3 text-red-300 text-xs font-semibold">
                <ShieldAlert size={14} className="shrink-0" />
                <span>Status: {aiStatus}</span>
              </div>

              {/* Readonly AI Editor showing progress */}
              <div className="flex-1 opacity-60">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={aiCode}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
