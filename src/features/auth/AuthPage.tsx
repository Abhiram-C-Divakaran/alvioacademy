import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import Logo from '../../components/ui/Logo';
import { restoreSessionProgress } from '../../services/sessionProgress';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>(() => new URLSearchParams(window.location.search).get('mode') === 'login' ? 'login' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser, setError, error, isLoading, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const requestedDestination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || new URLSearchParams(location.search).get('next');
  const from = requestedDestination?.startsWith('/') && !requestedDestination.startsWith('//') ? requestedDestination : '/dashboard';

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

      await restoreSessionProgress(String(data.user.id));
      setUser(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A051B] text-white font-sans overflow-hidden">
      
      {/* Left side: Computer monitor code glow setup */}
      <div 
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: 'url(/landing/coder-1400.webp)' }}
      >
        {/* Neon Purple/Blue overlay matching homepage theme */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A051B] via-[#6366f1]/20 to-transparent" />
        <div className="absolute inset-0 bg-[#0A051B]/60 mix-blend-multiply" />
      </div>

      {/* Right side: Dark Glassmorphic Card layout matching the Alvio Homepage */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#120B29] lg:rounded-l-[40px] shadow-2xl relative z-10 border-l border-white/5">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo Mascot */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 mb-4">
              <Logo className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {tab === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>
          </div>

          {/* Validation Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-4 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Input Fields Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label htmlFor="auth-name" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text"
                  id="auth-name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
              <input 
                type="email"
                id="auth-email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="w-full px-4 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label htmlFor="auth-password" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input 
                  id="auth-password"
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Create your password' : 'Enter your password'} 
                  className="w-full pl-4 pr-12 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (tab === 'signup' ? 'Create an account' : 'Sign in')}
            </button>
          </form>

          {/* Tab Switcher Footer */}
          <p className="text-center text-xs font-semibold text-gray-400">
            {tab === 'signup' ? 'Already have an account? ' : "Don't have an account yet? "}
            <button 
              onClick={() => {
                setTab(tab === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="text-indigo-400 hover:underline font-bold"
            >
              {tab === 'signup' ? 'Login' : 'Sign up'}
            </button>
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-5 pt-4 text-gray-500">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(s => (
              <a href="#" key={s} className="hover:text-white transition-colors">
                <span className="sr-only">{s}</span>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  {s === 'facebook' && <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>}
                  {s === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                  {s === 'instagram' && <path fillRule="evenodd" d="M12 2c2.717 0 3.039.01 4.108.058 1.07.049 1.802.219 2.443.468.663.258 1.225.603 1.787 1.165.562.562.907 1.124 1.165 1.787.249.641.419 1.372.468 2.443.049 1.07.058 1.39.058 4.108s-.01 3.039-.058 4.108c-.049 1.07-.219 1.802-.468 2.443-.258.663-.603 1.225-1.165 1.787-.562.562-1.124.907-1.787 1.165-.641.249-1.372.419-2.443.468-1.07.049-1.39.058-4.108.058s-3.039-.01-4.108-.058c-1.07-.049-1.802-.219-2.443-.468-.663-.258-1.225-.603-1.787-1.165-.562-.562-.907-1.124-1.165-1.787-.249-.641-.419-.372-.468-2.443C2.01 15.039 2 14.717 2 12s.01-3.039.058-4.108c.049-1.07.219-1.802.468-2.443.258-.663.603-1.225 1.165-1.787.562-.562 1.124-.907 1.787-1.165.641-.249 1.372-.419 2.443-.468C8.961 2.01 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" clipRule="evenodd"/>}
                  {s === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>}
                </svg>
              </a>
            ))}
          </div>

        </div>
      </div>
      
    </div>
  );
}
