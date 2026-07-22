import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Lightbulb, Users, ArrowRight, Star, ShieldCheck, Cpu, Database, Play, HelpCircle, Sparkles } from 'lucide-react';
import Logo from '../../components/ui/Logo';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#070214] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6E2EBA]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-[#3B1C7F]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Navbar Section */}
      <section className="relative z-50 border-b border-white/5 bg-[#0A051A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo className="w-9 h-9" />
            <span className="font-light tracking-[0.2em] text-white">ALVIO.</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-widest text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/3d-visualizer" className="hover:text-white transition-colors">3D Sandbox</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/auth" state={{ from: { pathname: '/dashboard' } }}>
              <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 text-xs font-bold uppercase tracking-wider">
                Sign In
              </button>
            </Link>
            <Link to="/auth" state={{ from: { pathname: '/dashboard' } }}>
              <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> All-in-one Academy for everyone
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Interactive DSA <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">for Smart Engineers.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-md leading-relaxed font-medium">
              With our secure online visualizers and turn-based AI tutor sessions, you can easily master complex data structures anytime, anywhere, with confidence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" state={{ from: { pathname: '/dashboard' } }}>
              <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-[1.03]">
                Get Started Now
              </button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#070214]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="" />
              <img className="w-10 h-10 rounded-full border-2 border-[#070214]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="" />
              <img className="w-10 h-10 rounded-full border-2 border-[#070214]" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" alt="" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-white">4.9</span>
                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">15k+ active learners</p>
            </div>
          </div>
        </div>

        {/* Right Hero Visuals (Finanex-style mockups) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Main Visualizer Preview Panel */}
          <div className="relative w-full max-w-lg bg-[#140D33]/60 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
            
            {/* Mock Node List Widget */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Database size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Linked List Structure</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Contiguous node pointers</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">ACTIVE</span>
            </div>

            {/* Mock Graph BFS Tracker */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-white">Shortest Path (Dijkstra)</h4>
                <span className="text-[10px] font-mono text-indigo-400">O(V log V + E)</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
            </div>

            {/* Mock Activity Sparkline */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Performance Gain</span>
                <h3 className="text-lg font-black text-white mt-0.5">-45.2% Complexity</h3>
              </div>
              <div className="text-purple-400 opacity-60 text-xl font-bold">📈</div>
            </div>

          </div>

          {/* Floating Neon Shapes */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl opacity-10 rotate-12 blur-sm pointer-events-none" />
          <div className="absolute -bottom-6 -left-10 w-32 h-32 bg-indigo-500 rounded-full opacity-10 blur-xl pointer-events-none" />
        </div>

      </section>

      {/* Core Features Grid Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-[#090317]/50">
        <div className="max-w-7xl mx-auto px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-lg mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Core features</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Remembered Your Need</h2>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              We provide tools and personalized AI assistance designed to make your visual algorithms learning journey intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Cpu size={22} />} 
              title="Interactive Visuals" 
              desc="View nodes, pointers, and memory blocks update in real-time 3D models."
            />
            <FeatureCard 
              icon={<Award size={22} />} 
              title="Expert AI Tutor" 
              desc="Get line-by-line coding suggestions and dynamic reviews."
            />
            <FeatureCard 
              icon={<Users size={22} />} 
              title="Mock Interviews" 
              desc="Practice senior engineer chats using integrated video/audio feeds."
            />
            <FeatureCard 
              icon={<Lightbulb size={22} />} 
              title="Syllabus Progress" 
              desc="Follow standard curriculum lines matching top university targets."
            />
          </div>

        </div>
      </section>

      {/* Simple Process Section */}
      <section id="process" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Simple process</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">It's easy to get started right away.</h2>
            </div>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              No long configurations or setups. Our tools load instantly on any modern browser environment.
            </p>
            <Link to="/auth" state={{ from: { pathname: '/dashboard' } }}>
              <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-all">
                Get In Touch
              </button>
            </Link>
          </div>

          {/* Right Steps Grid */}
          <div className="lg:col-span-7 space-y-6">
            <StepRow num="01" title="Create an Account" desc="Sign up in seconds. No complex paperwork or credit cards needed to start exploring basic structures." />
            <StepRow num="02" title="Select Your Module" desc="Pick stack arrays, circular queues, AVL trees, or graphs inside our interactive visualizer hub." />
            <StepRow num="03" title="Start Practicing" desc="Follow along step-by-step with 3D visuals and complete tasks to earn XP and level up." />
          </div>

        </div>
      </section>

      {/* Flexible Pricing Section */}
      <section id="pricing" className="py-24 border-t border-white/5 bg-[#090317]/50">
        <div className="max-w-7xl mx-auto px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-lg mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Alvio Pricing Plan</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Flexible Pricing Plans</h2>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              Unlock advanced features like full technical mock interview rooms and direct AI suggestions.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${activePlan === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly billing</span>
            <button 
              onClick={() => setActivePlan(activePlan === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-white/10 border border-white/10 relative p-0.5 transition-colors focus:outline-none"
            >
              <div className={`w-5 h-5 rounded-full bg-indigo-500 transition-all ${activePlan === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold ${activePlan === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Annual billing (25% OFF)</span>
          </div>

          {/* Pricing Card List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              name="Starter Plan" 
              price={activePlan === 'monthly' ? '$0' : '$0'}
              period={activePlan === 'monthly' ? 'Month' : 'Year'}
              desc="Explore basic data structures and simple sorted array visualizers."
              features={['Free Account Access', 'Basic 3D sandbox', 'Daily challenges', 'Static algorithm view']}
            />
            <PricingCard 
              name="Growth Plan" 
              price={activePlan === 'monthly' ? '$29' : '$259'}
              period={activePlan === 'monthly' ? 'Month' : 'Year'}
              desc="Get advanced coding hint aids and interactive LLaMA tutor reviews."
              features={['Free Account Access', 'All 3D Sandboxes', 'AI Code optimizer reviews', 'Complexity analysis graphs']}
              active
            />
            <PricingCard 
              name="Premium Plan" 
              price={activePlan === 'monthly' ? '$59' : '$539'}
              period={activePlan === 'monthly' ? 'Month' : 'Year'}
              desc="Unlock complete Senior Engineer Turn-Based Video Mock Interviews."
              features={['All Growth Plan items', 'Turn-Based Webcams', 'Voice-to-text transcripts', 'Priority leaderboards']}
            />
          </div>

        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#140D33]/60 border border-white/10 rounded-3xl p-8 hover:border-indigo-500/40 hover:bg-[#140D33]/85 transition-all text-left space-y-5">
      <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="font-black text-white text-base">{title}</h4>
        <p className="text-xs text-gray-400 font-semibold leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepRow({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-[#140D33]/40 border border-white/5 flex gap-5 hover:border-white/10 transition-colors text-left">
      <div className="text-lg font-black text-indigo-400 shrink-0 mt-0.5">{num}</div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-400 font-semibold leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PricingCard({ name, price, period, desc, features, active = false }: { name: string, price: string, period: string, desc: string, features: string[], active?: boolean }) {
  return (
    <div className={`bg-[#140D33]/60 border rounded-[32px] p-8 space-y-8 text-left transition-all relative overflow-hidden ${active ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10'}`}>
      
      {active && (
        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
          MOST POPULAR
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{name}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">{price}</span>
            <span className="text-xs font-bold text-gray-400">/ {period}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-semibold leading-relaxed">{desc}</p>
      </div>

      <Link to="/auth" className="block">
        <button className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
          Subscribe Now
        </button>
      </Link>

      <div className="space-y-3.5 pt-4 border-t border-white/5">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Features Included:</span>
        <ul className="space-y-2.5">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
