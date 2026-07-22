import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Send, BrainCircuit, User, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are a highly experienced, friendly, and patient Data Structures & Algorithms (DSA) tutor.\nYour goal is to help students easily understand complex CS concepts by breaking them down into simple, digestible pieces. Use relatable real-world analogies, step-by-step explanations, and avoid overly academic jargon unless you also explain it simply.\nMake sure your answers can be easily understood by beginners and students. Use Markdown formatting for readability, keep explanations clear and well-structured, and always encourage the student to ask questions!`;

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "👋 Hi! I'm your AI DSA tutor. I can explain concepts, debug Python code, answer questions, and help you prepare for interviews. What would you like to learn about?",
    timestamp: new Date(),
  },
];

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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
