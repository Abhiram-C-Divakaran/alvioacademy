import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Tag,
  Lightbulb,
  X,
  ChevronRight,
  ChevronUp,
  List,
  Clock,
  Cpu,
  Copy,
  PenLine,
  User,
  Brain,
  Maximize2,
  Lock,
  AlignLeft,
  Bookmark,
  Expand,
  RotateCcw,
  CheckSquare,
  XSquare,
  Plus,
  Maximize,
  Beaker
} from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import type { CodingProblem } from '../../data/codingProblems';
import { executeJavaScript, executePython, executeCpp, executeC, executeJava, executeTypescript, executeCsharp, extractFunctionName } from './CodeExecutionEngine';
import type { ExecutionResult } from './CodeExecutionEngine';
import { formatInputAsArray, getLocalTestCasesFromProblem, parseEditableTestCases } from './EditableTestCases';

const generateStarterCode = (problem: CodingProblem, lang: string): string => {
  if (problem.starterCode && problem.starterCode[lang as keyof typeof problem.starterCode]) {
    return problem.starterCode[lang as keyof typeof problem.starterCode]!;
  }

  if (!problem.signature) return `// Implement your solution in ${lang}\n`;

  const { name, params, returns } = problem.signature;

  const mapType = (type: string, l: string) => {
    switch(l) {
      case 'java':
        if (type === 'integer') return 'int';
        if (type === 'integer[]') return 'int[]';
        if (type === 'integer[][]') return 'int[][]';
        if (type === 'boolean') return 'boolean';
        if (type === 'string') return 'String';
        if (type === 'string[]') return 'String[]';
        if (type === 'char[]') return 'char[]';
        return 'Object';
      case 'csharp':
        if (type === 'integer') return 'int';
        if (type === 'integer[]') return 'int[]';
        if (type === 'integer[][]') return 'int[][]';
        if (type === 'boolean') return 'bool';
        if (type === 'string') return 'string';
        if (type === 'string[]') return 'string[]';
        if (type === 'char[]') return 'char[]';
        return 'object';
      case 'cpp':
        if (type === 'integer') return 'int';
        if (type === 'integer[]') return 'vector<int>';
        if (type === 'integer[][]') return 'vector<vector<int>>';
        if (type === 'boolean') return 'bool';
        if (type === 'string') return 'string';
        if (type === 'string[]') return 'vector<string>';
        if (type === 'char[]') return 'vector<char>';
        return 'auto';
      case 'c':
        if (type === 'integer') return 'int';
        if (type === 'integer[]') return 'int*';
        if (type === 'integer[][]') return 'int**';
        if (type === 'boolean') return 'bool';
        if (type === 'string') return 'char*';
        if (type === 'string[]') return 'char**';
        if (type === 'char[]') return 'char*';
        return 'void*';
      case 'typescript':
        if (type === 'integer') return 'number';
        if (type === 'integer[]') return 'number[]';
        if (type === 'integer[][]') return 'number[][]';
        if (type === 'boolean') return 'boolean';
        if (type === 'string') return 'string';
        if (type === 'string[]') return 'string[]';
        if (type === 'char[]') return 'string[]';
        return 'any';
      default: return 'any';
    }
  };

  const tsParams = params.map(p => `${p.name}: ${mapType(p.type, 'typescript')}`).join(', ');
  const tsReturn = mapType(returns, 'typescript');

  const javaParams = params.map(p => `${mapType(p.type, 'java')} ${p.name}`).join(', ');
  const javaReturn = mapType(returns, 'java');

  const csParams = params.map(p => `${mapType(p.type, 'csharp')} ${p.name}`).join(', ');
  const csReturn = mapType(returns, 'csharp');

  const cppParams = params.map(p => `${mapType(p.type, 'cpp')}& ${p.name}`).join(', '); // pass vector by reference
  const cppReturn = mapType(returns, 'cpp');

  const cParams = params.map(p => {
    let t = mapType(p.type, 'c');
    return `${t} ${p.name}${p.type.includes('[]') ? ', int '+p.name+'Size' : ''}`;
  }).join(', ');
  const cReturn = mapType(returns, 'c');

  switch(lang) {
    case 'typescript':
      return `function ${name}(${tsParams}): ${tsReturn} {\n    \n}`;
    case 'java':
      return `class Solution {\n    public ${javaReturn} ${name}(${javaParams}) {\n        \n    }\n}`;
    case 'csharp':
      return `public class Solution {\n    public ${csReturn} ${name}(${csParams}) {\n        \n    }\n}`;
    case 'cpp':
      return `#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppReturn} ${name}(${cppParams}) {\n        \n    }\n};`;
    case 'c':
      return `#include <stdbool.h>\n#include <stdlib.h>\n\n${cReturn} ${name}(${cParams}) {\n    \n}`;
    case 'python':
    case 'python3':
      return `def ${name}(${params.map(p => p.name).join(', ')}):\n    pass`;
    case 'javascript':
    default:
      return `function ${name}(${params.map(p => p.name).join(', ')}) {\n    \n}`;
  }
};

interface CodingWorkspaceProps {
  problem: CodingProblem;
  problemNumber: number;
  isSolved: boolean;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
}

export default function CodingWorkspace({ problem, problemNumber, isSolved, onBack, onNext, onPrev, onShuffle }: CodingWorkspaceProps) {
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'python3' | 'cpp' | 'c' | 'java' | 'typescript' | 'csharp'>('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const [rightSplitPercent, setRightSplitPercent] = useState(60);

  const handleVerticalDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;
    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingVertical.current || !rightPanelRef.current) return;
      const rect = rightPanelRef.current.getBoundingClientRect();
      const pct = ((ev.clientY - rect.top) / rect.height) * 100;
      setRightSplitPercent(Math.max(20, Math.min(80, pct)));
    };
    const onMouseUp = () => {
      isDraggingVertical.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      editorContainerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackIssues, setFeedbackIssues] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const token = useAuthStore(s => s.token);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  // Tabs state
  const [leftTab, setLeftTab] = useState<'description' | 'submissions'>('description');
  const [rightBottomTab, setRightBottomTab] = useState<'testcases' | 'results'>('testcases');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [localTestCases, setLocalTestCases] = useState(() => getLocalTestCasesFromProblem(problem));
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // Interaction states
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    setAiAnalysis(null);

    // Fetch interaction data
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/problems/${problem.id}/interaction`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(data.liked);
          setDisliked(data.disliked);
          setStarred(data.starred);
          setLikesCount(data.totalLikes);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInteractions();

    const fetchLatestSubmission = async () => {
      if (!token) return;
      setLoadingSubmission(true);
      try {
        const res = await fetch(`/api/problems/${problem.id}/submissions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLatestSubmission(data.submission);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSubmission(false);
      }
    };
    fetchLatestSubmission();
  }, [problem.id, token]);

  useEffect(() => {
    setLocalTestCases(getLocalTestCasesFromProblem(problem));
    setSelectedCaseIdx(0);
  }, [problem?.id, problem?.testCases]);



  const runAiAnalysis = async (submittedCode: string, lang: string) => {
    setLoadingAnalysis(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert DSA tutor. Analyze the submitted code and return ONLY: 1) Time Complexity 2) Space Complexity 3) One concise improvement tip. Format with clear labels. Be precise.'
            },
            {
              role: 'user',
              content: `Problem: ${problem.title}\nLanguage: ${lang}\nCode:\n${submittedCode}\n\nProvide time complexity, space complexity, and one improvement tip.`
            }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.text?.trim() || null);
      }
    } catch (e) {
      console.error('Error fetching analysis:', e);
    } finally {
      setLoadingAnalysis(false);
    }
  };



  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'python3' | 'cpp' | 'c' | 'java' | 'typescript' | 'csharp') => {
    setLanguage(newLang);
    const key = newLang === 'python3' ? 'python' : newLang;
    setCode(generateStarterCode(problem, key));
    setResult(null);
  };

  const handleRun = async () => {
    setIsExecuting(true);
    setResult(null);
    setRightBottomTab('results');

    if (language === 'javascript') {
      await new Promise(r => setTimeout(r, 600));
    }

    const functionName = extractFunctionName(code, problem.signature?.name);
    let execResult: ExecutionResult;

    const parsedTestCases = parseEditableTestCases(localTestCases);

    if (language === 'javascript') {
      execResult = await executeJavaScript(code, parsedTestCases, functionName);
    } else if (language === 'python' || language === 'python3') {
      execResult = await executePython(code, parsedTestCases, functionName);
    } else if (language === 'java') {
      execResult = await executeJava(code, { ...problem, testCases: parsedTestCases });
    } else if (language === 'typescript') {
      execResult = await executeTypescript(code, parsedTestCases, functionName);
    } else if (language === 'csharp') {
      execResult = await executeCsharp(code, { ...problem, testCases: parsedTestCases });
    } else if (language === 'c') {
      execResult = await executeC(code, { ...problem, testCases: parsedTestCases });
    } else {
      execResult = await executeCpp(code, { ...problem, testCases: parsedTestCases });
    }

    setResult(execResult);
    if (execResult.status === 'Failed') {
      setSelectedCaseIdx(execResult.passedCount);
    } else {
      setSelectedCaseIdx(0);
    }
    setIsExecuting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    setRightBottomTab('results');

    if (language === 'javascript') {
      await new Promise(r => setTimeout(r, 600));
    }

    const functionName = extractFunctionName(code, problem.signature?.name);
    let execResult: ExecutionResult;

    const parsedTestCases = parseEditableTestCases(localTestCases);

    if (language === 'javascript') {
      execResult = await executeJavaScript(code, parsedTestCases, functionName);
    } else if (language === 'python' || language === 'python3') {
      execResult = await executePython(code, parsedTestCases, functionName);
    } else if (language === 'java') {
      execResult = await executeJava(code, { ...problem, testCases: parsedTestCases });
    } else if (language === 'typescript') {
      execResult = await executeTypescript(code, parsedTestCases, functionName);
    } else if (language === 'csharp') {
      execResult = await executeCsharp(code, { ...problem, testCases: parsedTestCases });
    } else if (language === 'c') {
      execResult = await executeC(code, { ...problem, testCases: parsedTestCases });
    } else {
      execResult = await executeCpp(code, { ...problem, testCases: parsedTestCases });
    }

    setResult(execResult);
    setIsSubmitting(false);

    if (execResult.status === 'Passed') {
      if (token) {
        try {
          await fetch(`/api/problems/${problem.id}/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              status: execResult.status,
              language: language,
              code: code,
              runtimeMs: execResult.executionTimeMs,
              memoryMb: (Math.random() * 20 + 10).toFixed(2),
              passed_testcases: execResult.passedCount,
              total_testcases: execResult.totalCount
            })
          });

          // Refresh submission data
          const resSub = await fetch(`/api/problems/${problem.id}/submissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resSub.ok) {
            const dataSub = await resSub.json();
            setLatestSubmission(dataSub.submission);
          }
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
    const key = language === 'python3' ? 'python' : language;
    setCode(generateStarterCode(problem, key));
    setResult(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-transparent text-gray-200 p-2 gap-2">
      <PanelGroup direction="horizontal" className="w-full h-full">

        {/* ── LEFT PANEL: Description / Submissions ── */}
        <Panel defaultSize={45} minSize={28} className="flex flex-col bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl">

          {/* Left Tab Bar */}
          <div className="flex items-center justify-between px-4 border-b border-white/5 bg-black/20 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-1.5 h-12">
              <div className="flex items-center mr-2 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={onBack}
                  className="px-2 py-1.5 hover:bg-white/10 transition-colors text-gray-300 font-medium text-xs flex items-center gap-1 border-r border-white/10"
                >
                  <List size={14} />
                  Problem List
                </button>
                <button
                  onClick={onPrev}
                  className="px-1.5 py-1.5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white border-r border-white/10"
                  title="Previous Problem"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={onNext}
                  className="px-1.5 py-1.5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="Next Problem"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {[
                { id: 'description', label: 'Description', icon: <FileText size={14} /> },
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
              <button
                onClick={async () => {
                  const newState = !starred;
                  setStarred(newState);
                  if (token) {
                    try {
                      await fetch(`/api/problems/${problem.id}/interaction`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ type: 'star', action: newState ? 'add' : 'remove' })
                      });
                    } catch (e) { console.error(e); }
                  }
                }}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${starred ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Star size={16} fill={starred ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                title="Provide Feedback"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>

          {/* Left Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence mode="wait">
              {leftTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h1 className="text-[24px] font-bold text-white mb-4">
                        {problemNumber}. {problem.title}
                      </h1>
                      {isSolved ? (
                        <div className="flex items-center gap-1.5 text-sm text-[#2cbb5d] font-semibold mt-1">
                          Solved <CheckCircle2 size={16} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-semibold mt-1">
                          Unsolved <XCircle size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${problem.difficulty === 'Easy' ? 'text-[#00b8a3] bg-[#00b8a3]/10' : problem.difficulty === 'Medium' ? 'text-[#ffc01e] bg-[#ffc01e]/10' : 'text-[#ef4743] bg-[#ef4743]/10'}`}>
                        {problem.difficulty}
                      </span>

                      <span className="text-[12px] text-gray-400 font-medium bg-white/5 px-2.5 py-0.5 rounded-full">
                        Acceptance Rate: {(() => {
                          const sub = problem.stats?.submissions || 0;
                          const acc = problem.stats?.accepted || 0;
                          return sub > 0 ? ((acc / sub) * 100).toFixed(1) + '%' : '0.0%';
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="text-[15px] text-[#bfc6ce] leading-relaxed space-y-4">
                    {problem.description.split('\n\n')
                      .filter((para: string) => !para.includes('**Follow-up:**'))
                      .map((para, i) => {
                        const parts = para.split(/`([^`]+)`/g);
                        return (
                          <p key={i}>
                            {parts.map((part, j) =>
                              j % 2 === 1 ? (
                                <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded text-[#eff2f6] font-mono text-[13.5px] mx-0.5">{part}</code>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            )}
                          </p>
                        );
                      })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Examples</h3>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-white/5 border border-[#242428] rounded-xl p-5 text-sm font-mono space-y-3 shadow-inner">
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

                  <div className="space-y-2 pt-4">
                    <div className="text-[15px] font-bold text-white">Constraints:</div>
                    <ul className="list-disc pl-5 space-y-2 text-[#bfc6ce]">
                      {problem.constraints.map((c, i) => {
                        const parts = c.split(/`([^`]+)`/g);
                        return (
                          <li key={i}>
                            {parts.length > 1 ? parts.map((part, j) =>
                              j % 2 === 1 ? (
                                <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded text-[#eff2f6] font-mono text-[13px] mx-0.5">{part}</code>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            ) : c}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {problem.description.split('\n\n').find((p: string) => p.includes('**Follow-up:**')) && (
                    <div className="pt-6 border-t border-white/5 mt-6">
                      <div className="text-[15px] text-[#bfc6ce] leading-relaxed">
                        <span className="font-bold text-white mr-2">Follow-up:</span>
                        {problem.description.split('\n\n')
                          .find((p: string) => p.includes('**Follow-up:**'))
                          ?.replace('**Follow-up:**', '')
                          .trim()
                          .split(/`([^`]+)`/g).map((part, j) =>
                            j % 2 === 1 ? (
                              <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded text-[#eff2f6] font-mono text-[13.5px] mx-0.5">{part}</code>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 mt-8 border-t border-white/10">
                    <button
                      onClick={() => setShowTopics(!showTopics)}
                      className="flex items-center justify-between w-full py-1 text-[#bfc6ce] hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[15px] font-medium">
                        <Tag size={16} /> Topics
                      </div>
                      <motion.div animate={{ rotate: showTopics ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight size={16} className="rotate-90" />
                      </motion.div>
                    </button>
                    {showTopics && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mt-4">
                        {(problem.topic ? problem.topic.split(',').map(s => s.trim()) : []).map((topic) => (
                          <span key={topic} className="px-3 py-1 text-[12px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Static Hints Section */}
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center justify-between w-full py-1 text-[#bfc6ce] hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[15px] font-medium">
                        <Lightbulb size={16} className="text-yellow-500" /> Hints
                      </div>
                      <motion.div animate={{ rotate: showHints ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight size={16} className="rotate-90" />
                      </motion.div>
                    </button>
                    {showHints && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 mt-4 space-y-2">
                        {(() => {
                          const topics = problem.topic ? problem.topic.toLowerCase() : '';
                          const hints = [];

                          if (topics.includes('array')) {
                            hints.push("Consider using two pointers or a sliding window if you need to track a subarray or pair of elements.");
                            hints.push("If the array is unsorted, think about whether sorting it first would simplify the problem.");
                            hints.push("Can you use a Hash Table to keep track of elements you've already seen to reduce time complexity?");
                          } else if (topics.includes('string')) {
                            hints.push("Strings are immutable in many languages. Consider converting it to a character array if you need frequent modifications.");
                            hints.push("Can you use a sliding window approach to track substrings?");
                            hints.push("Think about using a Hash Map to count character frequencies.");
                          } else if (topics.includes('dynamic programming')) {
                            hints.push("Identify the base cases first. What is the solution for the smallest possible input?");
                            hints.push("Try to define the state for your DP table. What does dp[i] represent in the context of the problem?");
                            hints.push("Is there a way to optimize space? Often you only need the last one or two states instead of the entire table.");
                          } else if (topics.includes('tree') || topics.includes('graph')) {
                            hints.push("Decide whether Depth-First Search (DFS) or Breadth-First Search (BFS) is more appropriate for traversing.");
                            hints.push("Don't forget to keep track of visited nodes to avoid infinite loops if there are cycles.");
                            hints.push("Can you solve this recursively? Think about what each node should return to its parent.");
                          } else {
                            hints.push("Start by writing out a few manual test cases on paper to look for a pattern.");
                            hints.push("What is the brute-force approach? Once you have that, look for redundant work you can eliminate.");
                            hints.push("Consider the time and space complexity tradeoffs. Can you use extra memory to save execution time?");
                          }

                          if (problem.difficulty === 'Hard') {
                            hints[2] = "This is a Hard problem. Don't be afraid to combine multiple advanced data structures (like a Trie + DFS, or Priority Queue + HashMap).";
                          } else if (problem.difficulty === 'Easy') {
                            hints[0] = "This is an Easy problem. A simple loop or basic data structure is likely all you need.";
                          }

                          return hints.map((hint, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-[#bfc6ce] leading-relaxed flex gap-3">
                              <span className="font-bold text-gray-500">{(idx + 1)}.</span>
                              <span>{hint}</span>
                            </div>
                          ));
                        })()}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <button
                      onClick={async () => {
                        const newLike = !liked;
                        setLiked(newLike);
                        if (newLike) setDisliked(false);
                        setLikesCount(prev => newLike ? prev + 1 : prev - 1);
                        if (token) {
                          try {
                            await fetch(`/api/problems/${problem.id}/interaction`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ type: 'like', action: newLike ? 'add' : 'remove' })
                            });
                          } catch (e) { console.error(e); }
                        }
                      }}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <ThumbsUp size={14} /> {likesCount}
                    </button>
                    <button
                      onClick={async () => {
                        const newDislike = !disliked;
                        setDisliked(newDislike);
                        if (newDislike) setLiked(false);
                        if (token) {
                          try {
                            await fetch(`/api/problems/${problem.id}/interaction`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ type: 'dislike', action: newDislike ? 'add' : 'remove' })
                            });
                          } catch (e) { console.error(e); }
                        }
                      }}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${disliked ? 'text-rose-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <ThumbsDown size={14} />
                    </button>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <HelpCircle size={14} /> Feedback
                    </button>
                    <div className="ml-auto flex items-center text-[12px] font-medium text-gray-500">
                      <span>
                        Accepted <strong className="text-gray-200">{(problem.stats?.accepted ?? 0).toLocaleString()}</strong>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-500 text-[11px] ml-[1px]">
                          {(() => {
                            const sub = problem.stats?.submissions ?? 0;
                            if (sub >= 1000000) return (sub / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
                            if (sub >= 1000) return (sub / 1000).toFixed(1).replace(/\\.0$/, '') + 'K';
                            return sub.toString();
                          })()}
                        </span>
                      </span>
                      <span className="mx-2.5 text-gray-700">|</span>
                      <span>
                        Acceptance Rate <strong className="text-gray-200">
                          {problem.stats?.submissions ? ((problem.stats.accepted / problem.stats.submissions) * 100).toFixed(1) : '0.0'}%
                        </strong>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {leftTab === 'submissions' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  {loadingSubmission ? (
                    <div className="text-gray-500 text-sm mt-4">Loading submission data...</div>
                  ) : !latestSubmission ? (
                    <div className="text-gray-500 text-sm mt-4">No successful submissions yet. Submit a solution to see it here!</div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className={`text-[22px] font-bold tracking-tight ${latestSubmission.status === 'Passed' ? 'text-[#2cbb5d]' : 'text-rose-400'}`}>
                            {latestSubmission.status === 'Passed' ? 'Accepted' : latestSubmission.status}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <User size={12} />
                            <span>submitted at {new Date(latestSubmission.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => runAiAnalysis(latestSubmission.code, latestSubmission.language)}
                            disabled={loadingAnalysis}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3a2e5d] text-[#a48ee6] font-semibold text-[13px] hover:bg-[#4b3c78] transition-colors disabled:opacity-50"
                          >
                            {loadingAnalysis ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Analysis
                          </button>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="flex flex-col gap-6 bg-white/5 rounded-xl border border-white/5 p-4">
                        <div className="flex gap-4">
                          <div className="flex-1 bg-white/5 rounded-lg p-4">
                            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-300 mb-2">
                              <Clock size={14} /> Runtime
                            </div>
                            <div className="text-[26px] font-bold text-white">
                              {latestSubmission.runtime_ms} <span className="text-[14px] font-normal text-gray-400">ms</span>
                            </div>
                            <div className="text-[12px] text-amber-400 mt-1 font-semibold">
                              Beats 100.00% 🔥
                            </div>
                          </div>
                          <div className="flex-1 bg-white/5 rounded-lg p-4">
                            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-300 mb-2">
                              <Cpu size={14} /> Memory
                            </div>
                            <div className="text-[26px] font-bold text-white">
                              {latestSubmission.memory_mb} <span className="text-[14px] font-normal text-gray-400">MB</span>
                            </div>
                            <div className="text-[12px] text-amber-400 mt-1 font-semibold">
                              Beats {(Math.random() * 40 + 40).toFixed(2)}% 🔥
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Code ({latestSubmission.language})</div>
                          <pre className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-[12px] text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap border border-white/5">
                            {latestSubmission.code}
                          </pre>
                        </div>

                        {aiAnalysis && (
                          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-[#a48ee6]/20">
                            <div className="text-[10px] font-bold text-[#a48ee6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Sparkles size={10} /> AI Analysis
                            </div>
                            <pre className="text-[12px] text-gray-300 font-sans whitespace-pre-wrap leading-relaxed">{aiAnalysis}</pre>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                          <span>Test cases passed: {latestSubmission.passed_testcases}/{latestSubmission.total_testcases}</span>
                          <span>Acceptance: {problem.stats?.submissions > 0 ? ((problem.stats.accepted / problem.stats.submissions) * 100).toFixed(1) : '0.0'}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Panel>

        {/* ── HORIZONTAL RESIZE HANDLE ── */}
        <PanelResizeHandle className="w-1.5 mx-0.5 hover:bg-blue-500/30 transition-colors rounded-full cursor-col-resize relative group flex items-center justify-center">
          <div className="w-1 h-8 bg-white/10 group-hover:bg-blue-400 rounded-full transition-colors" />
        </PanelResizeHandle>

        {/* ── RIGHT PANEL: Code editor (top) + Console (bottom) ── */}
        <Panel defaultSize={55} minSize={30}>
          <div ref={rightPanelRef} className="h-full flex flex-col gap-0.5">

            {/* ── TOP: Code Editor ── */}
            <div className="flex flex-col bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl min-h-0" style={{ flexBasis: `${rightSplitPercent}%`, flexShrink: 0 }}>
              <div ref={editorContainerRef} className="flex flex-col w-full h-full">

                {/* Editor Top Bar */}
                <div className="h-11 bg-white/5 flex items-center justify-between px-3 border-b border-[#363636] shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold w-1/3">
                    <span className="text-[#2cbb5d] text-[14px]">{'</>'}</span>
                    <span className="text-gray-200">Code</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 w-1/3">
                    <button
                      onClick={handleRun}
                      disabled={isExecuting || isSubmitting}
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-[#3F3F46] border border-white/10 text-gray-200 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Play size={12} className={isExecuting ? "text-gray-400 animate-pulse" : "text-gray-400"} /> Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isExecuting || isSubmitting}
                      className="px-5 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Code size={12} />} Submit
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 text-gray-400 w-1/3">
                    <button onClick={toggleFullScreen} className="hover:text-gray-200 transition-colors">
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Editor Toolbar */}
                <div className="h-9 bg-black/20 backdrop-blur-sm flex items-center justify-between px-3 border-b border-[#363636] shrink-0">
                  <div className="flex items-center gap-4">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as any)}
                      className="bg-transparent text-xs text-gray-300 font-medium outline-none cursor-pointer hover:text-white transition-colors border-none"
                    >
                      <option value="cpp" className="bg-white/5 text-gray-300">C++</option>
                      <option value="java" className="bg-white/5 text-gray-300">Java</option>
                      <option value="python3" className="bg-white/5 text-gray-300">Python 3</option>
                      <option value="python" className="bg-white/5 text-gray-300">Python</option>
                      <option value="c" className="bg-white/5 text-gray-300">C</option>
                      <option value="csharp" className="bg-white/5 text-gray-300">C#</option>
                      <option value="javascript" className="bg-white/5 text-gray-300">JavaScript</option>
                      <option value="typescript" className="bg-white/5 text-gray-300">TypeScript</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3.5 text-gray-400">
                    <button className="hover:text-white transition-colors" title="Bookmark"><Bookmark size={14} /></button>
                    <button onClick={resetCode} className="hover:text-white transition-colors" title="Reset"><RotateCcw size={14} /></button>
                    <button onClick={toggleFullScreen} className="hover:text-white transition-colors" title="Full Screen"><Expand size={14} /></button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden relative bg-black/20 backdrop-blur-sm">
                  <Editor
                    height="100%"
                    language={language}
                    theme="transparent-dark"
                    beforeMount={(monaco) => {
                      monaco.editor.defineTheme('transparent-dark', {
                        base: 'vs-dark',
                        inherit: true,
                        rules: [],
                        colors: {
                          'editor.background': '#00000000',
                        }
                      });
                    }}
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

                {/* Editor Footer */}
                <div className="h-8 bg-black/20 backdrop-blur-sm flex items-center justify-between px-4 text-[11px] text-gray-500 font-medium shrink-0">
                  <div></div>
                  <div>Ln 1, Col 1</div>
                </div>
              </div>
            </div>

            {/* ── VERTICAL DRAG DIVIDER ── */}
            <div
              onMouseDown={handleVerticalDividerMouseDown}
              className="h-1.5 shrink-0 cursor-row-resize bg-white/5 hover:bg-blue-500/40 rounded-full transition-colors flex items-center justify-center group mx-0.5"
            >
              <div className="w-8 h-0.5 bg-white/20 group-hover:bg-blue-400 rounded-full transition-colors" />
            </div>

            {/* ── BOTTOM: Console / Testcases / Results ── */}
            <div className="flex flex-col bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl min-h-0 flex-1">

              {/* Console Tab Bar */}
              <div className="h-10 bg-white/5 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-4 h-full">
                  {[
                    { id: 'results', label: 'Test Result', icon: <span className="font-bold text-emerald-500 font-mono text-[14px] leading-none">{'>_'}</span> },
                    { id: 'testcases', label: 'Testcase', icon: <CheckSquare size={14} className="text-emerald-600/70" /> }
                  ].map((tab, idx) => (
                    <div key={tab.id} className="flex items-center gap-4 h-full">
                      <button
                        onClick={() => setRightBottomTab(tab.id as any)}
                        className={`flex items-center gap-1.5 h-full text-[13px] font-medium transition-colors ${
                          rightBottomTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                      {idx === 0 && <div className="h-3.5 w-[1px] bg-white/10" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Maximize2
                    size={13}
                    className="hover:text-gray-300 cursor-pointer transition-colors"
                    onClick={() => setRightSplitPercent(prev => prev < 20 ? 60 : 5)}
                    title={rightSplitPercent < 20 ? "Restore" : "Maximize Console"}
                  />
                  <ChevronUp
                    size={16}
                    className={`hover:text-gray-300 cursor-pointer transition-colors transform ${rightSplitPercent > 85 ? 'rotate-0' : 'rotate-180'}`}
                    onClick={() => setRightSplitPercent(prev => prev > 85 ? 60 : 92)}
                    title={rightSplitPercent > 85 ? "Restore Console" : "Minimize Console"}
                  />
                </div>
              </div>

              {/* Console Content */}
              <div className="flex-1 p-5 overflow-y-auto font-mono text-xs min-h-0">

                {rightBottomTab === 'testcases' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {localTestCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCaseIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                            selectedCaseIdx === idx ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          if (localTestCases.length >= 8) return;
                          const lastCase = localTestCases[localTestCases.length - 1] || { input: problem.signature?.params.map(() => '') || [], expected: '' };
                          const lastInput = formatInputAsArray(lastCase.input);
                          setLocalTestCases([...localTestCases, { ...lastCase, input: [...lastInput] }]);
                          setSelectedCaseIdx(localTestCases.length);
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors ml-1"
                      >
                        <Plus size={15} strokeWidth={2.5} />
                      </button>
                    </div>

                    {localTestCases[selectedCaseIdx] && (
                      <div className="space-y-4 mt-2">
                        {problem.signature?.params.map((p, idx) => {
                          const currentCase = localTestCases[selectedCaseIdx];
                          const inputArr = formatInputAsArray(currentCase?.input);
                          const currentVal = inputArr[idx] ?? '';
                          return (
                            <div key={p.name} className="space-y-2">
                              <div className="text-gray-400 text-[12px] ml-1">{p.name} =</div>
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => {
                                  const newTestCases = [...localTestCases];
                                  const tcInputArr = [...formatInputAsArray(newTestCases[selectedCaseIdx]?.input)];
                                  tcInputArr[idx] = e.target.value;
                                  newTestCases[selectedCaseIdx] = {
                                    ...newTestCases[selectedCaseIdx],
                                    input: tcInputArr
                                  };
                                  setLocalTestCases(newTestCases);
                                }}
                                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl p-3.5 text-gray-200 text-[13px] font-mono outline-none transition-colors"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
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
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className={`text-[22px] font-semibold tracking-tight ${
                            result.status === 'Passed' ? 'text-emerald-500' :
                            result.status === 'Failed' ? 'text-rose-500' : 'text-amber-500'
                          }`}>
                            {result.status === 'Passed' ? 'Accepted' : result.status === 'Failed' ? 'Wrong Answer' : 'Runtime Error'}
                          </span>
                          <span className="text-gray-400 text-[13px] font-medium">
                            Runtime: {result.executionTimeMs} ms
                          </span>
                        </div>

                        {result.status !== 'Error' && (
                          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                            {problem.testCases.map((_, idx) => {
                              const isSelected = selectedCaseIdx === idx;
                              const isPassed = result.status === 'Passed' || idx < result.passedCount;
                              const isFailed = result.status === 'Failed' && idx >= result.passedCount;
                              const Icon = isPassed ? <CheckSquare size={15} className="text-emerald-500" /> : isFailed ? <XSquare size={15} className="text-rose-500" /> : <div className="w-[15px] h-[15px] rounded-sm bg-white/5 border border-white/10" />;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedCaseIdx(idx)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                                    isSelected ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-300'
                                  }`}
                                >
                                  {Icon} Case {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {result.status !== 'Error' && problem.testCases[selectedCaseIdx] && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="text-[12px] text-gray-400 font-medium ml-1">Input</div>
                              <div className="space-y-2">
                                {problem.signature?.params.map((p, idx) => {
                                  const rawTc = problem.testCases?.[selectedCaseIdx];
                                  const tcInputArr = formatInputAsArray(rawTc?.input);
                                  const val = tcInputArr[idx];
                                  return (
                                    <div key={p.name} className="bg-white/5 rounded-xl p-3.5 space-y-2">
                                      <div className="text-gray-400 text-[12px]">{p.name} =</div>
                                      <div className="text-gray-200 text-[13px] font-mono">{JSON.stringify(val ?? '')}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-[12px] text-gray-400 font-medium ml-1">Output</div>
                              <div className="bg-white/5 rounded-xl p-3.5 text-gray-200 text-[13px] font-mono">
                                {result.status === 'Passed' || selectedCaseIdx < result.passedCount
                                  ? JSON.stringify(problem.testCases[selectedCaseIdx].expected)
                                  : result.status === 'Failed' && selectedCaseIdx === result.passedCount && result.message?.includes('Output: ')
                                    ? result.message.split('Output: ')[1]?.split('\n')[0] || '...'
                                    : '...'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-[12px] text-gray-400 font-medium ml-1">Expected</div>
                              <div className="bg-white/5 rounded-xl p-3.5 text-gray-200 text-[13px] font-mono">
                                {JSON.stringify(problem.testCases[selectedCaseIdx].expected)}
                              </div>
                            </div>
                          </div>
                        )}

                        {result.status === 'Error' && result.message && (
                          <div className="bg-rose-950/20 text-rose-300 p-3.5 rounded-xl text-xs font-semibold whitespace-pre-wrap border border-rose-500/20 mt-4">
                            {result.message}
                          </div>
                        )}
                        {result.status === 'Error' && result.stdout && result.stdout.length > 0 && (
                          <div className="space-y-1.5 mt-4">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Stdout</span>
                            <div className="bg-white/5 text-gray-300 p-3.5 rounded-xl text-xs font-medium whitespace-pre-wrap border border-[#242428]">
                              {result.stdout.join('\n')}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

              </div>


            </div>

          </div>
        </Panel>

      </PanelGroup>
      {/* Modals */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black/40 backdrop-blur-md rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/10">
                <h3 className="text-white font-bold text-lg">Feedback</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">

                <div>
                  <div className="text-gray-400 text-sm font-medium mb-1">Problem:</div>
                  <div className="text-white text-base">{problem.title}</div>
                </div>

                <div>
                  <div className="text-gray-300 text-sm font-medium mb-3">
                    <span className="text-red-500 mr-1">*</span>Issues Encountered:
                  </div>
                  <div className="space-y-3">
                    {[
                      "Description or examples are unclear or incorrect",
                      "Difficulty is inaccurate",
                      "Testcases are missing or incorrect",
                      "Runtime is too strict",
                      "Edge cases are too frustrating to solve",
                      "Other"
                    ].map(issue => (
                      <label key={issue} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${feedbackIssues.includes(issue) ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
                          {feedbackIssues.includes(issue) && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className="text-gray-300 text-sm select-none">{issue}</span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={feedbackIssues.includes(issue)}
                          onChange={(e) => {
                            if (e.target.checked) setFeedbackIssues(prev => [...prev, issue]);
                            else setFeedbackIssues(prev => prev.filter(i => i !== issue));
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-gray-300 text-sm font-medium mb-3">Rate this problem:</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`transition-colors p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-400'}`}
                      >
                        <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-gray-300 text-sm font-medium mb-2">Additional Feedback:</div>
                  <textarea
                    value={additionalFeedback}
                    onChange={e => setAdditionalFeedback(e.target.value)}
                    className="w-full bg-white/10 border border-transparent rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none h-24 transition-colors"
                    placeholder="Tell us more about your experience..."
                  />
                </div>

              </div>

              <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/10">
                <div className="text-xs text-gray-400">
                  You may also <a href="https://github.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">submit via Github</a> to get feedback in real time.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-white/10 hover:bg-[#5A5A5A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setIsSubmittingFeedback(true);
                      try {
                        await fetch(`/api/problems/${problem.id}/feedback`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                          body: JSON.stringify({ issues: feedbackIssues, additionalFeedback, rating })
                        });
                        setShowFeedbackModal(false);
                        setFeedbackIssues([]);
                        setAdditionalFeedback("");
                        setRating(0);
                        alert("Thank you for your feedback!");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to submit feedback.");
                      } finally {
                        setIsSubmittingFeedback(false);
                      }
                    }}
                    disabled={isSubmittingFeedback || (feedbackIssues.length === 0 && !additionalFeedback && rating === 0)}
                    className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingFeedback && <Loader2 size={14} className="animate-spin" />}
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
