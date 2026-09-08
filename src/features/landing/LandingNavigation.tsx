import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, Search, X, BookOpen } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { features, signup } from './landingShared';
export type InfoTopic = 'Privacy' | 'Terms' | 'Cookies' | 'Contact' | 'Search' | null;
export function LandingBrand() {
  return <Link className="lp-brand" to="/" aria-label="Alvio Academy home">
    <Logo variant="academy" className="lp-logo" />
    <span>Alvio <small>Academy</small>
    </span>
  </Link>;
}
const nav = [['Learn', '#learn'], ['Practice', '#practice'], ['AI Tools', '#ai-tools'], ['Visualizers', '#visualizers'], ['Community', '#community']];
export function LandingNavbar({ onSearch }: {
  onSearch: () => void;
}) {
  const [open, setOpen] = useState(false); const toggle = useRef<HTMLButtonElement>(null); useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [open]); return <header className="lp-nav">
    <div className="lp-container lp-nav-inner">
      <LandingBrand />
      <nav className="lp-desktop-nav" aria-label="Main navigation">{nav.map(([label, to]) => <a key={label} href={to}>{label}</a>)}</nav>
      <div className="lp-nav-actions">
        <button className="lp-icon-button" onClick={onSearch} aria-label="Search Alvio">
          <Search size={18} />
        </button>
        <Link className="lp-signin" to="/auth?mode=login&next=%2Fdashboard">Sign in</Link>
        <Link className="lp-button primary" to={signup}>Get started<ArrowRight size={14} />
        </Link>
        <button ref={toggle} className="lp-icon-button lp-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="landing-mobile-menu" onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>{open && <nav className="lp-mobile-nav" id="landing-mobile-menu" aria-label="Mobile navigation">{nav.map(([label, to]) => <a key={label} href={to} onClick={() => setOpen(false)}>{label}<ArrowRight size={15} />
    </a>)}<Link to="/auth?mode=login&next=%2Fdashboard">Sign in</Link>
    </nav>}</header>;
}
const info = {
  Privacy: { title: 'Your data, at a glance', text: 'Alvio uses account details for sign-in. Learning progress and session information are stored in your browser, and the application stores account and coding activity on its server. Questions sent to AI features are processed by the configured AI service. A full privacy policy has not been published yet.' },
  Terms: { title: 'Terms information', text: 'Alvio is a learning and practice platform. Formal terms of use have not been published yet. Learning materials and AI explanations should be checked against your own reasoning; completing a course does not guarantee an interview or employment outcome.' },
  Cookies: { title: 'Browser storage', text: 'Alvio uses browser local storage and IndexedDB to remember your session and learning progress. Clearing site data in your browser removes those local records and may sign you out. It does not delete server-side account records.' },
  Contact: { title: 'Contact & support', text: 'A public support email has not been published yet. For product guidance, explore the frequently asked questions below or open the AI Tutor for help with a learning concept.' },
};
export function LandingDialog({ topic, onClose }: {
  topic: InfoTopic;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null); const [query, setQuery] = useState(''); useEffect(() => {
    if (topic) {
      dialog.current?.showModal();
      setQuery('');
    }
    else
      dialog.current?.close();
  }, [topic]); const matches = features.filter(f => `${f.title} ${f.text}`.toLowerCase().includes(query.toLowerCase())); return <dialog ref={dialog} className="lp-dialog" onCancel={onClose} onClick={e => {
    if (e.target === dialog.current)
      onClose();
  }} aria-labelledby="landing-dialog-title">
    <div>
      <button className="lp-icon-button lp-dialog-close" onClick={onClose} aria-label="Close dialog">
        <X />
      </button>
      <h2 id="landing-dialog-title">{topic === 'Search' ? 'Find your next step' : topic ? info[topic].title : ''}</h2>{topic === 'Search' ? <>
        <label className="lp-search-input">
          <Search size={19} />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Topics, practice, AI, visualizers…" aria-label="Search learning tools" />
        </label>
        <div className="lp-search-links">{matches.map(f => <Link key={f.title} to={f.to} onClick={onClose}>
          <f.Icon size={19} />
          <span>{f.title}<small>{f.text}</small>
          </span>
          <ArrowRight size={15} />
        </Link>)}{!matches.length && <p>No matching tools. Try “coding”, “learning”, or “AI”.</p>}</div>
      </> : topic && <>
        <p>{info[topic].text}</p>{topic === 'Contact' && <a className="lp-button secondary" href="#faq" onClick={onClose}>
          <BookOpen size={16} />Read the FAQ</a>}</>}</div>
  </dialog>;
}
export function Footer({ onInfo }: {
  onInfo: (topic: InfoTopic) => void;
}) {
  const columns = [{ title: 'Learn', links: [['Data structures', '/learn/data-structures'], ['Algorithms', '/learn/algorithms'], ['Visualizers', '/3d-visualizer'], ['Video learning', '/video-learning']] }, { title: 'Practice', links: [['Coding problems', '/coding'], ['Quizzes', '/quiz'], ['PvP coding', '/workspace/pvp'], ['Mock interviews', '/mock-interview']] }, { title: 'Explore', links: [['AI Tutor', '/ai-tutor'], ['AI Visualizer', '/learn/ai-visualizer'], ['Community', '#community'], ['About', '#about']] }]; return <footer className="lp-footer">
    <div className="lp-container">
      <div className="lp-footer-grid">
        <div>
          <LandingBrand />
          <p>Learn. Solve. Build. Grow.</p>
          <span>A little more understanding.<br />A world of possibility.</span>
        </div>{columns.map(c => <div key={c.title}>
          <h3>{c.title}</h3>{c.links.map(([label, to]) => to.startsWith('#') ? <a key={label} href={to}>{label}</a> : <Link key={label} to={to}>{label}</Link>)}</div>)}<div>
          <h3>Support</h3>
          <button onClick={() => onInfo('Contact')}>Contact</button>
          <a href="#faq">Help & FAQ</a>
          <Link to="/dashboard">Your dashboard</Link>
        </div>
      </div>
      <div className="lp-footer-bottom">
        <span>© {new Date().getFullYear()} Alvio Academy</span>
        <div>{(['Privacy', 'Terms', 'Cookies'] as const).map(t => <button key={t} onClick={() => onInfo(t)}>{t}</button>)}</div>
        <span>Made with <span className="purple">♥</span> for a brighter future.</span>
      </div>
    </div>
  </footer>;
}
