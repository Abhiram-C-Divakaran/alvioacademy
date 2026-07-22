import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Send, BrainCircuit, User, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Visualization3D from '../workspace/Visualization3D';
import type { DataStructure } from '../../types/dataStructures';
import { VideoRecommendationSection } from './VideoRecommendation';

import arrVideo from '../../assets/i_want_the_video_to_explain_ab.mp4';
import llVideo from '../../assets/ll.mp4';
import queueVideo from '../../assets/PixVerse_V6_Image_Text_540P_make_a_game_like_v.mp4';
import btVideo from '../../assets/bt.mp4';
import hashVideo from '../../assets/hash.mp4';
import heapVideo from '../../assets/WhatsApp Video 2026-07-22 at 10.44.31 AM.mp4';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are a highly experienced, friendly, and patient Data Structures & Algorithms (DSA) tutor.\nYour goal is to help students easily understand complex CS concepts by breaking them down into simple, digestible pieces. Use relatable real-world analogies, step-by-step explanations, and avoid overly academic jargon unless you also explain it simply.\nMake sure your answers can be easily understood by beginners and students. Use Markdown formatting for readability, keep explanations clear and well-structured, and always encourage the student to ask questions!

CRITICAL: Whenever you explain a specific data structure (like Graph, Binary Tree, Array, Linked List), you MUST include an interactive 3D visualizer in your response. To do this, include a markdown code block with the language "ds-visualizer" and the name of the data structure inside it. Example:
\`\`\`ds-visualizer
graph
\`\`\`
Supported values are strictly: graph, binary-tree, array, linked-list. Do not include anything else inside the code block except the data structure name.

CRITICAL VIDEO RECOMMENDATIONS: At the very end of EVERY educational explanation, you MUST provide a search query for 3D and 2D videos so the system can automatically fetch related learning videos for the student. Do this by outputting a JSON block with the language "video-search". Example:
\`\`\`video-search
{"topic": "Dijkstra's Shortest Path Algorithm"}
\`\`\`
Ensure the topic is highly relevant to the student's question so they get the best video recommendations!`;

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "👋 Hi! I'm your AI DSA tutor. I can explain concepts, debug Python code, answer questions, and help you prepare for interviews. What would you like to learn about?",
    timestamp: new Date(),
  },
];

function MiniVideoPlayer({ type }: { type: string }) {
  const t = type.toLowerCase().trim();
  let videoSrc = '';
  
  if (t.includes('array')) videoSrc = arrVideo;
  else if (t.includes('linked')) videoSrc = llVideo;
  else if (t.includes('queue')) videoSrc = queueVideo;
  else if (t.includes('tree') || t.includes('bst')) videoSrc = btVideo;
  else if (t.includes('hash')) videoSrc = hashVideo;
  else if (t.includes('heap')) videoSrc = heapVideo;

  if (!videoSrc) return null;

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[var(--color-border-subtle)] shadow-lg bg-black">
      <video controls className="w-full aspect-video outline-none">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function MiniVisualizer({ type }: { type: string }) {
  let structure: DataStructure | null = null;
  const t = type.toLowerCase().trim();
  
  if (t.includes('graph')) {
    structure = {
      type: 'graph',
      nodes: [
        { id: 'A', value: 'A', position: { x: -2, y: 2, z: 0 }, state: { highlighted: false, active: false } },
        { id: 'B', value: 'B', position: { x: 2, y: 1, z: 0 }, state: { highlighted: false, active: false } },
        { id: 'C', value: 'C', position: { x: -1, y: -2, z: 0 }, state: { highlighted: false, active: false } },
        { id: 'D', value: 'D', position: { x: 1, y: -1, z: 0 }, state: { highlighted: false, active: false } },
      ],
      edges: [
        { id: 'e1', from: 'A', to: 'B', directed: false, state: { highlighted: false, active: false } },
        { id: 'e2', from: 'A', to: 'C', directed: false, state: { highlighted: false, active: false } },
        { id: 'e3', from: 'B', to: 'D', directed: false, state: { highlighted: false, active: false } },
        { id: 'e4', from: 'C', to: 'D', directed: false, state: { highlighted: false, active: false } },
      ],
      directed: false,
      weighted: false,
    };
  } else if (t.includes('tree') || t.includes('bst')) {
    structure = {
      type: 'binary-tree',
      root: '1',
      nodes: [
        { id: '1', value: 10, position: { x: 0, y: 3, z: 0 }, state: { highlighted: false, active: false }, left: '2', right: '3' },
        { id: '2', value: 5, position: { x: -2, y: 1, z: 0 }, state: { highlighted: false, active: false }, left: '4', right: '5' },
        { id: '3', value: 15, position: { x: 2, y: 1, z: 0 }, state: { highlighted: false, active: false }, left: null, right: '6' },
        { id: '4', value: 2, position: { x: -3, y: -1, z: 0 }, state: { highlighted: false, active: false }, left: null, right: null },
        { id: '5', value: 7, position: { x: -1, y: -1, z: 0 }, state: { highlighted: false, active: false }, left: null, right: null },
        { id: '6', value: 20, position: { x: 3, y: -1, z: 0 }, state: { highlighted: false, active: false }, left: null, right: null },
      ]
    };
  } else if (t.includes('array')) {
    structure = {
      type: 'array',
      capacity: 5,
      elements: [
        { id: '1', value: 42, position: { x: -2, y: 0, z: 0 }, state: { highlighted: false, active: false } },
        { id: '2', value: 7, position: { x: -1, y: 0, z: 0 }, state: { highlighted: false, active: false } },
        { id: '3', value: 19, position: { x: 0, y: 0, z: 0 }, state: { highlighted: false, active: false } },
        { id: '4', value: 99, position: { x: 1, y: 0, z: 0 }, state: { highlighted: false, active: false } },
        { id: '5', value: 3, position: { x: 2, y: 0, z: 0 }, state: { highlighted: false, active: false } },
      ]
    };
  } else if (t.includes('linked-list')) {
    structure = {
      type: 'linked-list',
      head: '1',
      nodes: [
        { id: '1', value: 10, position: { x: -2, y: 0, z: 0 }, state: { highlighted: false, active: false }, next: '2' },
        { id: '2', value: 20, position: { x: 0, y: 0, z: 0 }, state: { highlighted: false, active: false }, next: '3' },
        { id: '3', value: 30, position: { x: 2, y: 0, z: 0 }, state: { highlighted: false, active: false }, next: null },
      ]
    };
  }

  if (!structure) {
    return <div className="text-xs text-red-400 p-2 border border-red-500/20 rounded-md">Unsupported 3D Visualizer: {type}</div>;
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-black/40 border border-[var(--color-border-subtle)] shadow-lg relative h-[300px] w-full pointer-events-auto">
      <div className="absolute top-2 left-3 z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-1 rounded-md">{type} Visualizer</div>
      <Visualization3D structure={structure} />
    </div>
  );
}

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }

    const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.id !== '1').map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: currentInput }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const data = await response.json();
      const text = data.text;

      const aiMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: `**Error:** Failed to get response from AI API. Please check if your API key is valid. \n\nDetails: \`${error.message}\``,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full relative text-[var(--color-text-primary)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[var(--color-bg-primary)]">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm border border-[var(--color-border-subtle)]">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">AI Tutor</h2>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Powered by Groq (LLaMA 3)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Online
             </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border border-[var(--color-border-subtle)]' 
                    : 'bg-[var(--color-surface-glass-hover)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Sparkles size={14} className="text-white" />
                ) : (
                  <User size={14} className="text-[var(--color-text-secondary)]" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 rounded-xl px-5 py-4 text-sm leading-relaxed overflow-hidden shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)]' 
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-50'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[var(--color-bg-secondary)] prose-pre:border prose-pre:border-[var(--color-border-subtle)]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, className, children, ...props }: any) {
                          const rawType = String(children).replace(/\n$/, '');
                          let blockType = '';
                          let blockContent = rawType;

                          // 1. Try to get type from className (e.g. ```ds-visualizer)
                          const match = /language-([a-zA-Z0-9_-]+)/.exec(className || '');
                          if (match) {
                            blockType = match[1];
                          } 
                          // 2. Fallback if LLM put the type inside the code block instead of the language tag
                          else if (rawType.startsWith('ds-visualizer\n')) {
                            blockType = 'ds-visualizer';
                            blockContent = rawType.replace('ds-visualizer\n', '').trim();
                          } else if (rawType.startsWith('ds-video\n')) {
                            blockType = 'ds-video';
                            blockContent = rawType.replace('ds-video\n', '').trim();
                          } else if (rawType.startsWith('video-search\n')) {
                            blockType = 'video-search';
                            blockContent = rawType.replace('video-search\n', '').trim();
                          }

                          if (blockType === 'ds-visualizer') {
                            return <MiniVisualizer type={blockContent} />;
                          } else if (blockType === 'ds-video') {
                            return <MiniVideoPlayer type={blockContent} />;
                          } else if (blockType === 'video-search') {
                            let topic = blockContent;
                            try {
                              const parsed = JSON.parse(blockContent);
                              if (parsed.topic) topic = parsed.topic;
                            } catch (e) {
                              console.warn('Could not parse video-search JSON, using raw string as topic:', blockContent);
                            }
                            return <VideoRecommendationSection topic={topic} />;
                          }
                          return <code className={className} {...props}>{children}</code>;
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-4xl mx-auto"
            >
               <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-1 bg-gradient-to-br from-blue-500 to-indigo-600 border border-[var(--color-border-subtle)] shadow-sm">
                  <Sparkles size={14} className="text-white animate-pulse" />
               </div>
               <div className="flex-1 rounded-xl px-5 py-4 text-sm bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] flex items-center gap-1 w-24 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Python, Data Structures, Algorithms..."
              disabled={isTyping}
              className="flex-1 bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] rounded-md pl-4 pr-16 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-md bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-[var(--color-bg-hover)] disabled:text-[var(--color-text-muted)] transition-colors shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel — Context */}
      <div className="w-72 flex-shrink-0 p-6 border-l border-[var(--color-border-subtle)] hidden lg:block bg-[var(--color-bg-secondary)] overflow-y-auto">
        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-5 text-[var(--color-text-muted)]">
          Suggested Topics
        </h3>
        <div className="space-y-3">
          {[
            'Implement a Linked List in Python',
            'Explain BFS vs DFS in Graphs',
            'How to balance an AVL Tree?',
            'What is the time complexity of QuickSort?',
            'Write a Python script for Binary Search',
            'Explain Dynamic Programming with an example',
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                if (!isTyping) {
                  setInput(topic);
                }
              }}
              disabled={isTyping}
              className="w-full text-left text-sm px-4 py-3 rounded-md transition-all duration-200 bg-[var(--color-surface-glass)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-glass-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
