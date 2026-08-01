const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Play, Trophy, ShieldAlert, Cpu, Code2, Zap, ArrowLeft, RefreshCw, User, Users, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function PvPShowdown() {
  const navigate = useNavigate();
  
  // Game states
  const [gameState, setGameState] = useState<'lobby' | 'hosting' | 'joining' | 'playing' | 'ended'>('lobby');
  const [role, setRole] = useState<'host' | 'guest' | null>(null);
  const [userCode, setUserCode] = useState('// Solve the challenge here:\\nfunction reverseList(head) {\\n  let prev = null;\\n  let curr = head;\\n  // Write your code here...\\n}');
  const [opponentCode, setOpponentCode] = useState('');
  
  const [userProgress, setUserProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  
  const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);
  
  // Sabotage options
  const [cooldown, setCooldown] = useState(0);
  const [isSabotaged, setIsSabotaged] = useState(false);

  // Broadcast Channel Ref
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Initialize cross-tab communication
    const channel = new BroadcastChannel('pvp_arena');
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const msg = event.data;
      
      switch (msg.type) {
        case 'JOIN_REQUEST':
          if (gameState === 'hosting') {
            channel.postMessage({ type: 'MATCH_START' });
            setGameState('playing');
            resetMatch();
          }
          break;
        case 'MATCH_START':
          if (gameState === 'joining') {
            setGameState('playing');
            resetMatch();
          }
          break;
        case 'CODE_UPDATE':
          if (msg.sender !== role) {
            setOpponentCode(msg.code);
          }
          break;
        case 'PROGRESS_UPDATE':
          if (msg.sender !== role) {
            setOpponentProgress(msg.progress);
          }
          break;
        case 'SABOTAGE':
          if (msg.target === role) {
            triggerSabotageEffect();
          }
          break;
        case 'VICTORY':
          if (msg.sender !== role) {
            setGameState('ended');
            setWinner('opponent');
          }
          break;
        case 'LEAVE':
          if (gameState === 'playing' || gameState === 'hosting' || gameState === 'joining') {
            alert("Opponent disconnected.");
            setGameState('lobby');
            setRole(null);
          }
          break;
      }
    };

    return () => {
      channel.postMessage({ type: 'LEAVE', sender: role });
      channel.close();
    };
  }, [gameState, role]);

  const resetMatch = () => {
    setUserCode('// Solve the challenge here:\\nfunction reverseList(head) {\\n  let prev = null;\\n  let curr = head;\\n  // Write your code here...\\n}');
    setOpponentCode('// Waiting for opponent to type...');
    setUserProgress(0);
    setOpponentProgress(0);
    setWinner(null);
    setCooldown(0);
    setIsSabotaged(false);
  };

  const handleHost = () => {
    setRole('host');
    setGameState('hosting');
  };

  const handleJoin = () => {
    setRole('guest');
    setGameState('joining');
    // Signal hosts that we are looking for a match
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'JOIN_REQUEST' });
    }
  };

  const handleCodeChange = (val: string | undefined) => {
    if (isSabotaged) return; // Prevent typing if sabotaged
    const newCode = val || '';
    setUserCode(newCode);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'CODE_UPDATE', sender: role, code: newCode });
    }
  };

  const handleUserCompile = () => {
    if (gameState !== 'playing' || isSabotaged) return;
    
    // Simulate user progress milestone
    const nextProgress = Math.min(100, userProgress + 25);
    setUserProgress(nextProgress);
    
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'PROGRESS_UPDATE', sender: role, progress: nextProgress });
    }

    if (nextProgress >= 100) {
      setGameState('ended');
      setWinner('me');
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'VICTORY', sender: role });
      }
    }
  };

  const deploySabotage = () => {
    if (gameState !== 'playing' || cooldown > 0 || isSabotaged) return;
    setCooldown(15); // 15s cooldown
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'SABOTAGE', target: role === 'host' ? 'guest' : 'host' });
    }
  };

  const triggerSabotageEffect = () => {
    setIsSabotaged(true);
    setTimeout(() => {
      setIsSabotaged(false);
    }, 3000); // 3 seconds freeze
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
            onClick={() => {
               if (channelRef.current) channelRef.current.postMessage({ type: 'LEAVE', sender: role });
               navigate('/dashboard');
            }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2.5">
              PvP Showdown Arena <Swords size={18} className="text-red-400 animate-pulse" />
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-Time 1v1 Multiplayer</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <button
              onClick={deploySabotage}
              disabled={cooldown > 0 || isSabotaged}
              className={\`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border \${
                cooldown > 0 || isSabotaged
                  ? 'bg-white/5 border-transparent text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              }\`}
            >
              <Zap size={13} /> {cooldown > 0 ? \`Sabotage CD (\${cooldown}s)\` : 'Deploy Freeze (Sabotage)'}
            </button>
          </div>
        )}
      </div>

      {/* Main Split Area */}
      <div className="flex-1 flex overflow-hidden">
        {gameState === 'lobby' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />
            
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-red-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-[0_0_50px_rgba(239,68,68,0.3)] relative z-10">
              <Swords size={48} />
            </div>
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Real-Time 1v1 Coding Duel</h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                Open this app in two separate windows side-by-side. One player will <strong className="text-white">Host</strong> and the other will <strong className="text-white">Join</strong>. Race to complete the algorithmic challenge, and use sabotages to freeze your opponent's keyboard!
              </p>
            </div>
            <div className="flex gap-6 mt-4 relative z-10">
              <button 
                onClick={handleHost}
                className="px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center gap-3 hover:scale-105"
              >
                <Cpu size={18} /> Host Match
              </button>
              <button 
                onClick={handleJoin}
                className="px-10 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-sm uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-3"
              >
                <Users size={18} /> Join Match
              </button>
            </div>
          </div>
        ) : gameState === 'hosting' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
            <h2 className="text-2xl font-black text-white">Waiting for opponent...</h2>
            <p className="text-gray-400 max-w-sm">
              Open another window and click <strong>Join Match</strong> to connect automatically via Local Broadcast!
            </p>
            <button 
              onClick={() => { setGameState('lobby'); setRole(null); }}
              className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        ) : gameState === 'joining' ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
            <h2 className="text-2xl font-black text-white">Connecting to host...</h2>
            <button 
              onClick={() => { setGameState('lobby'); setRole(null); }}
              className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        ) : gameState === 'ended' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6 relative">
            <div className={\`w-24 h-24 rounded-3xl flex items-center justify-center border shadow-2xl relative z-10 \${
              winner === 'me' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)]' 
                : 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
            }\`}>
              <Trophy size={48} />
            </div>
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl font-black text-white">
                {winner === 'me' ? '🏆 VICTORY!' : '💀 DEFEAT!'}
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                {winner === 'me' 
                  ? 'Your algorithmic skills prevailed! You compiled a working solution faster than your opponent.' 
                  : 'Your opponent beat you to the finish line. Sharpen your skills and try again!'}
              </p>
            </div>
            <div className="flex gap-4 mt-6 relative z-10">
              <button 
                onClick={() => {
                  setGameState('lobby'); 
                  setRole(null);
                  if (channelRef.current) channelRef.current.postMessage({ type: 'LEAVE' });
                }}
                className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Column: Local User Editor */}
            <div className={\`flex-1 flex flex-col h-full border-r border-white/5 relative min-w-0 transition-all duration-300 \${isSabotaged ? 'bg-red-950/40' : ''}\`}>
              {/* Sabotage Overlay overlay */}
              <AnimatePresence>
                {isSabotaged && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 pointer-events-none border-[10px] border-red-600/50 bg-red-600/10 flex flex-col items-center justify-center backdrop-blur-[2px]"
                  >
                    <AlertTriangle size={64} className="text-red-500 animate-bounce mb-4" />
                    <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest bg-black/50 px-6 py-2 rounded-xl">KEYBOARD FROZEN!</h2>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-shrink-0 px-5 py-3.5 bg-black/30 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={15} className="text-emerald-400" />
                  <span className="text-xs font-black text-white">You (Player {role === 'host' ? '1' : '2'})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400">Progress: {Math.round(userProgress)}%</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: \`\${userProgress}%\` }} />
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={userCode}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    readOnly: isSabotaged,
                  }}
                />
              </div>
              
              {/* Floating Trigger compile button */}
              <div className="absolute bottom-5 right-5 z-10">
                <button
                  onClick={handleUserCompile}
                  disabled={isSabotaged}
                  className={\`px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 \${isSabotaged ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-emerald-600 hover:bg-emerald-500'}\`}
                >
                  <Play size={12} fill="currentColor" /> Run & Pass Test Case
                </button>
              </div>
            </div>

            {/* Right Column: Opponent Viewer */}
            <div className="flex-1 flex flex-col h-full bg-[#0A051A]/60 min-w-0">
              <div className="flex-shrink-0 px-5 py-3.5 bg-black/40 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-red-400" />
                  <span className="text-xs font-black text-white">Opponent (Player {role === 'host' ? '2' : '1'})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400">Progress: {Math.round(opponentProgress)}%</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: \`\${opponentProgress}%\` }} />
                  </div>
                </div>
              </div>

              {/* Status Header */}
              <div className="p-3 bg-red-500/5 border-b border-white/5 flex items-center gap-3 text-red-300 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldAlert size={14} className="shrink-0" />
                <span>Live View - Read Only</span>
              </div>

              {/* Readonly AI Editor showing progress */}
              <div className="flex-1 opacity-70">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={opponentCode}
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
`;

fs.writeFileSync('src/features/workspace/PvPShowdown.tsx', code);
console.log("Successfully rewrote PvPShowdown.tsx");
