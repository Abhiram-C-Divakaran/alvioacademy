import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import useProgressStore from '../../stores/useProgressStore';
import { dbService } from '../../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { setUser, setError, error, isLoading, setLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (tab === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = tab === 'login' 
        ? { email: email.trim(), password }
        : { name: name.trim(), email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      setUser(data.user, data.token);

      // Initialize or load local progress
      let progress = await dbService.getProgress(String(data.user.id));
      if (!progress) {
        const now = new Date().toISOString();
        progress = {
          userId: String(data.user.id),
          topics: [
            { topicId: 'array', topicName: 'Arrays', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'linked-list', topicName: 'Linked Lists', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'stack', topicName: 'Stacks', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'queue', topicName: 'Queues', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'binary-tree', topicName: 'Binary Trees', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'avl-tree', topicName: 'AVL Trees', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'graph', topicName: 'Graphs', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
            { topicId: 'hash-table', topicName: 'Hash Tables', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
          ],
          totalTimeSpentMinutes: 0,
          overallScore: 0,
          streak: 1,
          badges: [],
          weakAreas: [],
          recommendedTopics: ['array', 'stack'],
        };
        // @ts-ignore
        await dbService.getStore('progress', 'readwrite').then(store => store.put(progress));
      }
      useProgressStore.getState().setProgress(progress);

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Slightly dark overlay so we can close by clicking outside */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[340px] px-8 py-12 bg-white/10 border border-white/20 backdrop-blur-[40px] shadow-2xl rounded-3xl z-10 flex flex-col items-center"
        >
          <div className="w-full space-y-8">
            
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-3xl font-normal text-white tracking-wide">
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <div className="w-12 h-[1px] bg-white/30" />
            </div>

            {/* Validation Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-2 rounded-lg text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-200"
              >
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Input Fields Form */}
            <form onSubmit={handleSubmit} className="space-y-5 w-full flex flex-col items-center">
              
              {tab === 'signup' && (
                <div className="w-full">
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name" 
                    className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-white/50 placeholder-white/50 text-sm font-light text-white transition-colors"
                  />
                </div>
              )}

              <div className="w-full">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-white/50 placeholder-white/50 text-sm font-light text-white transition-colors"
                />
              </div>

              <div className="w-full">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-white/50 placeholder-white/50 text-sm font-light text-white transition-colors"
                />
                
                {tab === 'login' && (
                  <div className="w-full text-left mt-2">
                    <button type="button" className="text-[10px] text-white/60 hover:text-white transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full pt-4 flex justify-center">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-[180px] py-3 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white text-sm font-normal tracking-wide transition-colors rounded-full shadow-lg"
                >
                  {isLoading ? 'Wait...' : (tab === 'login' ? 'Login' : 'Sign Up')}
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                className="text-[11px] text-white/70 hover:text-white transition-colors"
              >
                {tab === 'login' ? 'Create New Account' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
