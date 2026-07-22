import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import Logo from '../../components/ui/Logo';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser, setError, error, isLoading, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

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
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=2000&auto=format&fit=crop)' }}
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

          {/* Google SSO Button */}
          <button 
            type="button" 
            className="w-full py-3 px-4 bg-[#231743] hover:bg-[#2d1e57] border border-white/5 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm text-gray-200 shadow-sm transition-all"
          >
            {tab === 'signup' ? 'Create account with Google' : 'Sign in with Google'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-white/5"></div>
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="w-full px-4 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Create your password' : 'Enter your password'} 
                  className="w-full pl-4 pr-12 py-3.5 bg-[#231743] border border-white/5 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 text-sm font-semibold transition-all text-white"
                />
                <button
                  type="button"
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
