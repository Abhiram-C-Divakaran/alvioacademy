import { ArrowRight, BookOpen, Code2, Box, BrainCircuit, UserRound, ChartNoAxesCombined } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
export const signup = '/auth?mode=signup&next=%2Fdashboard';
export const features = [
  { title: 'Structured learning', text: 'Follow guided DSA pathways, from your first array to advanced algorithms.', action: 'Learn more', to: '/learn', Icon: BookOpen },
  { title: 'Practice coding', text: 'Solve curated problems. Run your code, test solutions, and improve.', action: 'Start practicing', to: '/coding', Icon: Code2 },
  { title: '3D visualizations', text: 'See the connections. Make abstract data structures feel intuitive.', action: 'Explore visualizers', to: '/3d-visualizer', Icon: Box },
  { title: 'AI Tutor', text: 'Work through the why, with explanations that meet you where you are.', action: 'Try AI Tutor', to: '/ai-tutor', Icon: BrainCircuit },
  { title: 'Mock interviews', text: 'Practice your approach, communication, and technical thinking.', action: 'Start interview prep', to: '/mock-interview', Icon: UserRound },
  { title: 'Progress tracking', text: 'Understand your strengths, build consistency, and find your next step.', action: 'View dashboard', to: '/dashboard', Icon: ChartNoAxesCombined },
];
export function Action({ to, children, secondary = false }: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return <Link className={`lp-button ${secondary ? 'secondary' : 'primary'}`} to={to}>{children}<ArrowRight size={16} />
  </Link>;
}
export function SectionHeading({ eyebrow, title, text }: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return <div className="lp-section-heading">
    <div>
      <span className="lp-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>{text && <p>{text}</p>}</div>;
}
export function WindowFrame({ title, children, className = '' }: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`lp-window ${className}`}>
    <div className="lp-window-bar">
      <span className="lp-window-dots">
        <i />
        <i />
        <i />
      </span>
      <span>{title}</span>
      <small>Product preview</small>
    </div>{children}</div>;
}
