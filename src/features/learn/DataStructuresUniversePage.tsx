import '../../configure3DText';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';
import LearningSidebar from './components/LearningSidebar';
import CurriculumUniverse, { type CurriculumUniverseHandle } from './components/CurriculumUniverse';
import TopicDetailsPanel from './components/TopicDetailsPanel';
import { curriculumData, type CurriculumTopic } from './data/curriculumData';
import { RotateCw, X } from 'lucide-react';

export default function DataStructuresUniversePage() {
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic>(curriculumData.find(t => t.id === 'linked-lists') || curriculumData[0]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [menuOpen, setMenuOpen] = useState(false);
  const universeRef = useRef<CurriculumUniverseHandle>(null);
  return <div className="h-dvh flex flex-col overflow-hidden bg-[#050817] text-white">
    <TopNavbar onToggleMenu={() => setMenuOpen(open => !open)} />
    <div className="flex flex-1 min-h-0">
      <div className="hidden lg:block shrink-0"><LearningSidebar /></div>
      {menuOpen && <div className="fixed inset-0 z-[60] lg:hidden">
        <button aria-label="Close learning menu" className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
        <div className="relative h-full w-[240px] max-w-[85vw]" onClick={event => { if ((event.target as HTMLElement).closest('a')) setMenuOpen(false); }}>
          <LearningSidebar />
          <button aria-label="Close learning menu" className="absolute right-2 top-2 p-2 bg-slate-900 rounded" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>
      </div>}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div><h1 className="text-2xl font-bold">Data Structures Universe</h1><p className="text-sm text-slate-400 mt-1">Master concepts. Visualize deeply. Code confidently.</p></div>
          <div className="flex gap-2" aria-label="Learning view">
            {(['map', 'list'] as const).map(mode => <button key={mode} aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} className={`rounded-lg px-4 py-2 capitalize ${viewMode === mode ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>{mode}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_330px] gap-5 items-start">
          <section className="min-w-0">
            {viewMode === 'map' ? <>
              <div className="h-[50dvh] min-h-[320px] xl:h-[65dvh] rounded-2xl overflow-hidden border border-white/10">
                <CurriculumUniverse ref={universeRef} selectedTopic={selectedTopic} onTopicSelect={setSelectedTopic} />
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mt-3 text-xs text-slate-400">
                <p>Drag to orbit · Scroll to zoom · Select a planet to explore</p>
                <button onClick={() => universeRef.current?.resetView()} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white/5 hover:text-white"><RotateCw size={14} />Reset View</button>
              </div>
            </> : <div className="grid sm:grid-cols-2 gap-3">
              {curriculumData.map(topic => <article key={topic.id} className={`rounded-xl border p-4 ${selectedTopic.id === topic.id ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/5'}`}>
                <button onClick={() => setSelectedTopic(topic)} className="text-left w-full" aria-label={`View ${topic.name} details`}><h2 className="font-semibold text-lg">{topic.name}</h2><p className="text-sm text-slate-400 mt-2">{topic.description}</p></button>
                <Link to={topic.path} className="inline-block mt-4 text-sm text-violet-300 hover:text-white">Open lesson →</Link>
              </article>)}
            </div>}
          </section>
          <aside className="min-w-0"><TopicDetailsPanel topic={selectedTopic} /></aside>
        </div>
      </main>
    </div>
  </div>;
}
