import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Star,
  Share2,
  FileText,
  BookOpen,
  History,
  Terminal,
  Settings,
  HelpCircle,
  Code,
  Sparkles
} from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import type { CodingProblem } from '../../data/codingProblems';
import { executeJavaScript, executePython, executeCpp, executeC, extractFunctionName } from './CodeExecutionEngine';
import type { ExecutionResult } from './CodeExecutionEngine';

interface CodingWorkspaceProps {
  problem: CodingProblem;
  onBack: () => void;
}

export default function CodingWorkspace({ problem, onBack }: CodingWorkspaceProps) {
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'c'>('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const token = useAuthStore(s => s.token);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  // Tabs state
  const [leftTab, setLeftTab] = useState<'description' | 'solutions' | 'submissions'>('description');
  const [rightBottomTab, setRightBottomTab] = useState<'testcases' | 'results' | 'hints'>('testcases');
  const [aiHint, setAiHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  
  // Feedback states
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 800) + 200);

  const askAiTutorForHint = async () => {
    setLoadingHint(true);
    setAiHint('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert DSA coding tutor. Give the student a subtle, helpful hint (1-3 sentences) on how to solve the problem based on their draft code. DO NOT give away the final code or complete solution. Keep it brief.' 
            },
            { 
              role: 'user', 
              content: `Problem: ${problem.title}\nDescription: ${problem.description}\nDraft Code: ${code}\nLanguage: ${language}\nHelp me with a hint.` 
            }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiHint(data.text);
      } else {
        setAiHint("Failed to fetch hint from AI Tutor. Make sure your GROQ_API_KEY is set in .env.");
      }
    } catch (e) {
      setAiHint("Error fetching hint from AI Tutor.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'cpp' | 'c') => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang as keyof typeof problem.starterCode] || '');
    setResult(null);
  };

  const handleRun = async () => {
    setIsExecuting(true);
    setResult(null);
    setRightBottomTab('results');

    if (language === 'javascript') {
      await new Promise(r => setTimeout(r, 600));
    }

    const functionName = extractFunctionName(code);
    let execResult: ExecutionResult;

    if (language === 'javascript') {
      execResult = await executeJavaScript(code, problem.testCases, functionName);
    } else if (language === 'python') {
      execResult = await executePython(code, problem.testCases, functionName);
    } else if (language === 'c') {
      execResult = await executeC(code, problem);
    } else {
      execResult = await executeCpp(code, problem);
    }

    setResult(execResult);
    setIsExecuting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    setRightBottomTab('results');

    if (language === 'javascript') {
      await new Promise(r => setTimeout(r, 600));
    }

    const functionName = extractFunctionName(code);
    let execResult: ExecutionResult;

    if (language === 'javascript') {
      execResult = await executeJavaScript(code, problem.testCases, functionName);
    } else if (language === 'python') {
      execResult = await executePython(code, problem.testCases, functionName);
    } else if (language === 'c') {
      execResult = await executeC(code, problem);
    } else {
      execResult = await executeCpp(code, problem);
    }

    setResult(execResult);
    setIsSubmitting(false);

    if (execResult.status === 'Passed') {
      if (token) {
        try {
          const points = problem.difficulty === 'Easy' ? 50 : problem.difficulty === 'Medium' ? 100 : 200;
          await fetch('/api/activity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              activity_type: `Completed ${problem.title}`,
              points
            })
          });
        } catch (e) {
          console.error(e);
        }
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode[language as keyof typeof problem.starterCode] || '');
    setResult(null);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0a0a] text-gray-200 p-2 gap-2">
      <PanelGroup direction="horizontal" className="w-full h-full">

        {/* Left Pane: Tabs and Details */}
        <Panel defaultSize={45} minSize={30} className="flex flex-col bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Left Pane Tabs Header */}
        <div className="flex items-center justify-between px-4 border-b border-[#242428] bg-[#1E1E22]">
          <div className="flex items-center gap-1.5 h-12">
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white mr-2"
            >
              <ChevronLeft size={16} />
            </button>
            
            {[
              { id: 'description', label: 'Description', icon: <FileText size={14} /> },
              { id: 'solutions', label: 'Solutions', icon: <BookOpen size={14} /> },
              { id: 'submissions', label: 'Submissions', icon: <History size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-bold transition-all relative ${
                  leftTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
                {leftTab === tab.id && (
                  <motion.div 
                    layoutId="activeLeftTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setStarred(!starred)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${starred ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>
              <Star size={16} fill={starred ? 'currentColor' : 'none'} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Left Pane Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {leftTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                {/* Title */}
                <div>
                  <h1 className="text-xl font-extrabold text-white mb-2.5">
                    {problem.id}. {problem.title}
                  </h1>
                  
                  {/* Badges Bar */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                      {problem.topic || 'DSA'}
                    </span>
                  </div>
                </div>

                {/* Description Text */}
                <div className="prose prose-invert max-w-none text-sm text-gray-300 font-medium leading-relaxed space-y-4">
                  {problem.description.split('\\n\\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Example Cases */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Examples</h3>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-[#1E1E22] border border-[#242428] rounded-xl p-5 text-sm font-mono space-y-3 shadow-inner">
                      <div className="text-xs font-extrabold text-blue-400">Example {i + 1}</div>
                      <div className="flex items-start">
                         <span className="text-gray-500 w-16 shrink-0 font-bold text-xs mt-0.5">Input:</span> 
                         <span className="text-gray-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 font-medium">{ex.input}</span>
                      </div>
                      <div className="flex items-start">
                         <span className="text-gray-500 w-16 shrink-0 font-bold text-xs mt-0.5">Output:</span> 
                         <span className="text-gray-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 font-medium">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="flex pt-3 border-t border-white/5 mt-3">
                          <span className="text-gray-500 w-16 shrink-0 font-bold text-xs mt-0.5">Explain:</span>
                          <span className="text-gray-400 font-sans text-sm">{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Constraints</h3>
                  <ul className="flex flex-wrap gap-2">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-xs font-mono text-gray-300 bg-[#1E1E22] border border-[#242428] px-3 py-1 rounded-lg shadow-sm">
                         {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Actions (Thumbs Up/Down) */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setLiked(!liked);
                      setDisliked(false);
                      setLikesCount(prev => liked ? prev - 1 : prev + 1);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                      liked ? 'bg-blue-500/10 border border-blue-500 text-blue-400' : 'bg-white/5 hover:bg-white/10 border border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    {likesCount}
                  </button>
                  <button 
                    onClick={() => {
                      setDisliked(!disliked);
                      setLiked(false);
                      if (liked) setLikesCount(p => p - 1);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                      disliked ? 'bg-red-500/10 border border-red-500 text-red-400' : 'bg-white/5 hover:bg-white/10 border border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {leftTab === 'solutions' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-sm"
              >
                <div className="bg-[#1E1E22] border border-[#242428] p-5 rounded-2xl">
                  <h3 className="font-bold text-white mb-2">Optimal Approach - Editorial</h3>
                  <p className="text-gray-400 leading-relaxed">
                    The optimal solution utilizes hash maps to solve the lookup bottleneck, reducing time complexity to O(N).
                  </p>
                </div>
              </motion.div>
            )}

            {leftTab === 'submissions' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-sm text-center py-10"
              >
                <History size={36} className="text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-300">No Submissions Yet</h4>
                <p className="text-gray-500 text-xs">Your solved submissions will be recorded here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </Panel>

        {/* Horizontal Resize Handle */}
        <PanelResizeHandle className="w-2 mx-0.5 hover:bg-blue-500/20 transition-colors rounded-full cursor-col-resize relative group flex items-center justify-center">
          <div className="w-1 h-8 bg-white/10 group-hover:bg-blue-400 rounded-full transition-colors" />
        </PanelResizeHandle>

        {/* Right Pane: Split Code Editor & Interactive Console */}
        <Panel defaultSize={55} minSize={30}>
          <PanelGroup direction="vertical" className="w-full h-full">
            {/* Upper Part: Code Editor Workspace */}
            <Panel defaultSize={65} minSize={20} className="flex flex-col bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Editor Header */}
          <div className="h-12 border-b border-[#242428] flex items-center justify-between px-4 bg-[#1E1E22]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Code size={14} className="text-blue-400" />
                Code Workspace
              </span>
              
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-[#2C2C32] text-xs text-white font-bold border border-white/5 outline-none rounded-lg px-2.5 py-1 cursor-pointer focus:border-blue-500 transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="c">C (GCC)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={resetCode}
                className="flex items-center gap-1.5 text-xs text-gray-400 font-bold hover:text-white transition-colors bg-white/5 border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-lg"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden relative bg-[#1E1E1E]">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                roundedSelection: false,
                scrollbar: { useShadows: false, verticalScrollbarSize: 8 },
              }}
            />
          </div>
        </Panel>

        {/* Vertical Resize Handle */}
        <PanelResizeHandle className="h-2 my-0.5 hover:bg-blue-500/20 transition-colors rounded-full cursor-row-resize relative group flex items-center justify-center">
          <div className="h-1 w-8 bg-white/10 group-hover:bg-blue-400 rounded-full transition-colors" />
        </PanelResizeHandle>

        {/* Lower Part: Interactive Console (Testcase & Results) */}
        <Panel defaultSize={35} minSize={20} className="flex flex-col bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Console Header Tabs */}
          <div className="h-10 bg-[#1E1E22] flex items-center justify-between px-4 border-b border-[#242428]">
            <div className="flex items-center gap-2 h-full">
              {[
                { id: 'testcases', label: 'Testcase', icon: <Terminal size={12} /> },
                { id: 'results', label: 'Test Result', icon: <CheckCircle2 size={12} /> },
                { id: 'hints', label: 'AI Hint', icon: <Sparkles size={12} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRightBottomTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 h-full text-xs font-bold transition-all relative ${
                    rightBottomTab === tab.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {rightBottomTab === tab.id && (
                    <motion.div 
                      layoutId="activeRightBottomTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs">
            {rightBottomTab === 'testcases' && (
              <div className="space-y-4">
                {problem.testCases.slice(0, 2).map((tc, idx) => (
                  <div key={idx} className="bg-[#1E1E22] border border-[#242428] p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Case {idx + 1}</div>
                    <div className="text-gray-300 whitespace-pre-wrap">{tc.input}</div>
                  </div>
                ))}
              </div>
            )}

            {rightBottomTab === 'results' && (
              <div className="h-full">
                {!result && !isExecuting && (
                  <div className="text-gray-500 flex h-full items-center justify-center italic">
                    You must run your code first.
                  </div>
                )}
                
                {isExecuting && (
                  <div className="text-gray-300 flex items-center justify-center gap-2 h-full">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                    Evaluating test cases...
                  </div>
                )}
                
                {result && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {result.status === 'Passed' && <CheckCircle2 size={18} className="text-emerald-400" />}
                      {result.status === 'Failed' && <XCircle size={18} className="text-rose-500" />}
                      {result.status === 'Error' && <AlertCircle size={18} className="text-amber-500" />}
                      <span className={`font-bold ${
                        result.status === 'Passed' ? 'text-emerald-400' : 
                        result.status === 'Failed' ? 'text-rose-500' : 'text-amber-500'
                      }`}>
                        {result.status === 'Passed' ? 'Accepted' : result.status === 'Failed' ? 'Wrong Answer' : 'Runtime Error'}
                      </span>
                      <span className="text-gray-500 text-[10px] ml-2 font-bold uppercase tracking-wider">
                        ({result.passedCount}/{result.totalCount} cases passed in {result.executionTimeMs}ms)
                      </span>
                    </div>

                    {result.message && (
                      <div className="bg-rose-950/20 text-rose-300 p-3.5 rounded-xl text-xs font-semibold whitespace-pre-wrap border border-rose-500/20">
                        {result.message}
                      </div>
                    )}
                    {result.stdout && result.stdout.length > 0 && (
                      <div className="space-y-1.5 mt-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Output</span>
                        <div className="bg-[#1E1E22] text-gray-300 p-3.5 rounded-xl text-xs font-medium whitespace-pre-wrap border border-[#242428]">
                          {result.stdout.join('\n')}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {rightBottomTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">AI Coding Tutor Hint</div>
                  <button 
                    onClick={askAiTutorForHint}
                    disabled={loadingHint}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {loadingHint ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate Hint
                  </button>
                </div>
                
                {loadingHint && (
                  <div className="text-gray-400 italic">Consulting AI Tutor...</div>
                )}
                
                {aiHint && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 leading-relaxed font-sans"
                  >
                    {aiHint}
                  </motion.div>
                )}

                {!aiHint && !loadingHint && (
                  <div className="text-gray-500 italic text-center py-6">
                    Click "Generate Hint" to get step-by-step assistance from the AI Tutor.
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Action Bar merged into Console bottom */}
          <div className="h-14 bg-[#1E1E22] border-t border-white/5 flex items-center justify-end px-4 gap-3 shrink-0">
            <button
              onClick={handleRun}
              disabled={isExecuting || isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#2C2C32] hover:bg-[#3F3F46] border border-white/10 text-gray-200 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Play size={14} className="text-gray-400" />
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isExecuting || isSubmitting}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
              Submit
            </button>
          </div>
        </Panel>
        </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
