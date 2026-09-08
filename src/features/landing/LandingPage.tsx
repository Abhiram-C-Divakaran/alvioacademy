import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Lightbulb,
  Play,
  Sparkles,
  Users,
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import AuthModal from '../auth/AuthModal';
import landingHeroImage from './landingHeroImage';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050812] font-sans text-white selection:bg-violet-500/30">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050812]/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
            aria-label="Alvio home"
          >
            <Logo className="h-8 w-8" />
            <div className="text-left">
              <div className="text-[17px] font-extrabold tracking-tight text-white">Alvio</div>
              <div className="text-[9px] font-semibold tracking-[0.18em] text-white/35">LEARN · BUILD · GROW</div>
            </div>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-xs font-semibold text-white/55 transition-colors hover:text-white">Features</a>
            <a href="#process" className="text-xs font-semibold text-white/55 transition-colors hover:text-white">How it works</a>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-bold text-white transition-all hover:border-violet-400/25 hover:bg-white/[0.07]"
            >
              Sign in
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition-transform hover:-translate-y-0.5"
            >
              Start learning
            </button>
          </nav>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold md:hidden"
          >
            Get started
          </button>
        </div>
      </header>

      <main>
        <section className="relative isolate min-h-[780px] overflow-hidden pt-16 sm:min-h-[840px] lg:min-h-[760px]">
          <div className="absolute inset-0 bg-[#050812]" />

          <div
            className="absolute inset-y-0 right-0 hidden w-[66%] bg-cover bg-center bg-no-repeat lg:block"
            style={{
              backgroundImage: `url(${landingHeroImage})`,
              backgroundPosition: '62% center',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.2) 10%, black 35%, black 100%)',
              maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.2) 10%, black 35%, black 100%)',
            }}
          />

          <div
            className="absolute inset-x-0 top-16 h-[390px] bg-cover bg-center bg-no-repeat opacity-65 lg:hidden"
            style={{ backgroundImage: `url(${landingHeroImage})`, backgroundPosition: '66% center' }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050812_0%,#050812_34%,rgba(5,8,18,.82)_48%,rgba(5,8,18,.16)_76%,rgba(5,8,18,.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,.03)_0%,rgba(5,8,18,.03)_66%,#050812_100%)]" />
          <div className="absolute left-[8%] top-[18%] h-[360px] w-[360px] rounded-full bg-violet-600/[0.07] blur-[120px]" />

          <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] grid-cols-1 items-center px-5 pb-16 pt-[420px] sm:px-8 sm:pt-[430px] lg:min-h-[700px] lg:grid-cols-12 lg:px-10 lg:pb-12 lg:pt-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-2xl lg:col-span-7"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/10 bg-violet-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-violet-200">
                <Sparkles size={12} />
                Interactive computer science learning
              </div>

              <h1 className="max-w-[760px] text-[48px] font-extrabold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[72px]">
                Better problem solvers
                <span className="block bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">build better futures.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#aab4c5] sm:text-base">
                Learn data structures and algorithms through interactive visualizations, guided coding practice, AI tutoring, and realistic technical interview training.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 text-sm font-bold text-white shadow-[0_16px_42px_rgba(99,102,241,0.26)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(99,102,241,0.34)]"
                >
                  Start learning free
                  <ArrowRight size={16} />
                </button>

                <Link
                  to="/auth"
                  state={{ from: { pathname: '/3d-visualizer' } }}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-bold text-white transition-all hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <Play size={15} fill="currentColor" />
                  Explore visualizers
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-2.5">
                {[
                  { icon: <Code2 size={14} />, text: 'Real coding practice' },
                  { icon: <Database size={14} />, text: '3D DSA visualizers' },
                  { icon: <BrainCircuit size={14} />, text: 'AI-guided learning' },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.065] bg-black/20 px-3 py-2 text-[11px] font-semibold text-white/65 backdrop-blur-md"
                  >
                    <span className="text-violet-300">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="relative border-t border-white/[0.055] bg-[#070b14] py-24">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">Built for deliberate practice</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">Understand it. Visualize it. Code it.</h2>
              <p className="mt-4 text-sm leading-6 text-[#8894a8]">
                Alvio connects explanation, visualization, practice, and feedback in one learning environment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Cpu size={21} />}
                title="Interactive Visuals"
                desc="See nodes, pointers, trees, graphs, and algorithm state change as the concept runs."
              />
              <FeatureCard
                icon={<BrainCircuit size={21} />}
                title="AI Tutor"
                desc="Ask questions in context and get explanations that match the topic you are studying."
              />
              <FeatureCard
                icon={<Users size={21} />}
                title="Mock Interviews"
                desc="Practice technical communication and problem solving in realistic interview sessions."
              />
              <FeatureCard
                icon={<Award size={21} />}
                title="Progress That Matters"
                desc="Track mastery, streaks, XP, quiz performance, and the skills that need more practice."
              />
            </div>
          </div>
        </section>

        <section id="process" className="relative border-t border-white/[0.055] bg-[#050812] py-24">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">A clear learning loop</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">From confusion to intuition.</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#8894a8]">
                Move from understanding a concept to seeing it work, writing the code yourself, and testing what you learned.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-violet-200"
              >
                Start your learning path <ArrowRight size={15} />
              </button>
            </div>

            <div className="space-y-3 lg:col-span-7">
              <StepRow num="01" title="Learn the idea" desc="Use concise lessons and AI guidance to understand the core concept before memorizing implementation details." />
              <StepRow num="02" title="See the state change" desc="Open interactive visualizers to watch memory, pointers, nodes, and algorithm decisions evolve step by step." />
              <StepRow num="03" title="Solve it yourself" desc="Move into coding practice and quizzes, then use your results to decide what to revisit next." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,rgba(17,25,41,.9),rgba(9,15,27,.92))] p-6 transition-all hover:-translate-y-0.5 hover:border-violet-300/15">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.08] text-violet-300">
        {icon}
      </div>
      <h3 className="mt-5 text-sm font-bold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-[#7f8ba0]">{desc}</p>
    </div>
  );
}

function StepRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-white/[0.065] bg-white/[0.025] p-5 transition-colors hover:bg-white/[0.04]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-400/[0.07] text-[11px] font-extrabold text-cyan-300">
        {num}
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="mt-1.5 text-xs leading-6 text-[#7f8ba0]">{desc}</p>
      </div>
    </div>
  );
}
