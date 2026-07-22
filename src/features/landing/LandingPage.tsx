import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Lightbulb, Users, ArrowRight, Star, ShieldCheck, Cpu, Database, Play, HelpCircle, Sparkles } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import AuthModal from '../auth/AuthModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-fuchsia-500/30">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Glow Backdrops - Neon Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-[#1e3a8a]/40 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[100%] bg-[#a21caf]/40 rounded-full blur-[200px] pointer-events-none mix-blend-screen" />

      {/* Navbar Section */}
      <section className="relative z-50 pt-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter flex items-center gap-3 cursor-pointer uppercase" onClick={() => navigate('/')}>
            <Logo className="w-8 h-8" />
            <span className="text-white">ALVIO</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Sign In / Sign Up
            </button>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              Welcome to Alvio Academy
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter text-white leading-[0.9] uppercase break-words">
              Master The <br/> Code <Sparkles className="inline-block text-white/50 -mt-8 ml-2 w-16 h-16" />
            </h1>

            <p className="text-sm md:text-base text-white/50 max-w-md leading-relaxed pt-6 font-light">
              Master Data Structures and Algorithms through interactive 3D visualizers, turn-based AI mock interviews, and real-time coding challenges. Prepare for top-tier tech roles with confidence.
            </p>
          </div>

          <div className="flex items-center gap-8 pt-8">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-10 py-4 bg-[#c026d3] hover:bg-[#a21caf] text-white font-bold text-sm transition-colors rounded-full shadow-[0_0_30px_rgba(192,38,211,0.5)]"
            >
              Start Learning
            </button>
          </div>
        </div>

        {/* Right Hero Visuals */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Main Visualizer Preview Panel */}
          <div className="relative w-full max-w-lg bg-[#2e0939]/80 border border-fuchsia-500/20 p-8 shadow-[0_0_80px_rgba(162,28,175,0.4)] backdrop-blur-xl space-y-6">
            
            {/* Mock Node List Widget */}
            <div className="p-4 bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c026d3]/20 border border-[#c026d3]/40 flex items-center justify-center text-[#c026d3]">
                  <Database size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Linked List Structure</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">Contiguous node pointers</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-[#c026d3] tracking-widest">ACTIVE</span>
            </div>

            {/* Mock Graph BFS Tracker */}
            <div className="p-4 bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Shortest Path (Dijkstra)</h4>
                <span className="text-[10px] font-mono text-[#c026d3]">O(V log V + E)</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                <div className="h-full w-[80%] bg-[#c026d3]" />
              </div>
            </div>

            {/* Mock Activity Sparkline */}
            <div className="p-4 bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Performance Gain</span>
                <h3 className="text-lg font-black text-white mt-0.5">-45.2% Complexity</h3>
              </div>
              <div className="text-[#c026d3] opacity-80 text-xl font-bold">📈</div>
            </div>

          </div>
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
