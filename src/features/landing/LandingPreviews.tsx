import { useId, useState } from 'react';
import { Check, Play, RotateCcw, Sparkles, Flame, Trophy, ArrowRight, Send, Code2 } from 'lucide-react';
import { WindowFrame } from './landingShared';
export function TreePreview({ interactive = false }: {
  interactive?: boolean;
}) {
  const [step, setStep] = useState(0);
  const nodeId = useId();
  const points = [[200, 28], [110, 85], [290, 85], [65, 146], [155, 146], [245, 146], [335, 146]];
  const values = [8, 3, 10, 1, 6, 9, 14];
  const order = [0, 1, 3, 4, 2, 5, 6];
  return <div className="lp-tree-preview">
    <svg viewBox="0 0 400 184" role="img" aria-label={`Binary search tree. Traversal step ${step + 1}: node ${values[order[step]]}.`}>
      <defs>
        <radialGradient id={nodeId}>
          <stop stopColor="#9478ff" />
          <stop offset="1" stopColor="#5432c3" />
        </radialGradient>
      </defs>
      {points.slice(1).map(([x, y], i) => <line key={i} x1={points[Math.floor(i / 2)][0]} y1={points[Math.floor(i / 2)][1]} x2={x} y2={y} stroke="#7061bc" strokeWidth="2" />)}
      {points.map(([x, y], i) => <g key={i}>
        <circle cx={x} cy={y} r="18" fill={order[step] === i ? '#148b86' : `url(#${nodeId})`} stroke={order[step] === i ? '#5ffce1' : '#b4a1ff'} strokeWidth="1.5" />
        <text x={x} y={y + 5} fill="white" textAnchor="middle" fontSize="13" fontFamily="Inter, sans-serif">{values[i]}</text>
      </g>)}
    </svg>{interactive ? <div className="lp-preview-controls">
      <button onClick={() => setStep((step + 1) % 7)}>
        <Play size={13} />Next traversal step</button>
      <span aria-live="polite">{step + 1} / 7</span>
      <button onClick={() => setStep(0)} aria-label="Reset traversal">
        <RotateCcw size={14} />
      </button>
    </div> : <div className="lp-preview-caption">
      <span className="lp-live-dot" />Binary search tree <span>O(log n) average search</span>
    </div>}</div>;
}
export function CodePreview({ compact = false }: {
  compact?: boolean;
}) {
  return <div className={`lp-code-preview ${compact ? 'compact' : ''}`}>
    <div className="lp-editor-tabs">
      <Code2 size={13} />
      <span>two-sum.js</span>
      <span>JavaScript</span>
    </div>
    <div className="lp-code-body">{!compact && <aside>
      <span className="lp-label">01 · ARRAYS</span>
      <h3>Two Sum</h3>
      <span className="lp-easy">Easy</span>
      <p>Find two numbers that add up to the target. Return their indices.</p>
      <code>nums = [2, 7, 11, 15]<br />target = 9</code>
    </aside>}<pre>
        <code>
          <span className="purple">function</span> <span className="cyan">twoSum</span>(nums, target) {'{'}{'\n'}{'  '}<span className="purple">const</span> seen = <span className="purple">new</span> Map();{'\n'}{'  '}<span className="purple">for</span> (<span className="purple">let</span> i = 0; i &lt; nums.length; i++) {'{'}{'\n'}{'    '}<span className="purple">const</span> match = target - nums[i];{'\n'}{'    '}<span className="purple">if</span> (seen.has(match)) {'{'}{'\n'}{'      '}<span className="purple">return</span> [seen.get(match), i];{'\n'}{'    }'}{'\n'}{'    '}seen.set(nums[i], i);{'\n'}{'  }'}{'\n'}{'}'}</code>
      </pre>
    </div>
    <div className="lp-test-result">
      <span>
        <Check size={13} />Example test: [0, 1]</span>
      <span>Run code <span className="lp-faux-submit">Submit</span>
      </span>
    </div>
  </div>;
}
export function TutorPreview() {
  return <div className="lp-tutor-preview">
    <div className="lp-chat-header">
      <span className="lp-ai-avatar">
        <Sparkles size={18} />
      </span>
      <div>Alvio AI<small>Your learning companion</small>
      </div>
    </div>
    <div className="lp-student-message">Why does binary search require sorted data?</div>
    <div className="lp-ai-message">
      <Sparkles size={16} />
      <div>
        <p>Sorted order tells us which half we can safely discard.</p>
        <div className="lp-search-array">{[2, 5, 8, 12, 17].map(n => <span className={n === 8 ? 'selected' : ''} key={n}>{n}</span>)}</div>
        <p>Looking for <b>12</b>? The middle value is <b>8</b>. Every value to its left is smaller, so we only search the right half.</p>
        <small>Without order, that shortcut could discard the answer.</small>
      </div>
    </div>
    <div className="lp-chat-placeholder">Ask a follow-up question…<Send size={15} />
    </div>
  </div>;
}
export function DashboardPreview() {
  const chartId = useId(); return <div className="lp-dashboard-preview">
    <div className="lp-preview-greeting">
      <span>Welcome back, Alex <span aria-hidden="true">👋</span>
      </span>
      <small>Illustrative learner profile</small>
    </div>
    <div className="lp-preview-metrics">
      <div>
        <small>Overall progress</small>
        <strong>38%</strong>
        <div className="lp-track">
          <i style={{ width: '38%' }} />
        </div>
      </div>
      <div>
        <Flame size={17} />
        <strong>7 days</strong>
        <small>Current streak</small>
      </div>
      <div>
        <Trophy size={17} />
        <strong>860 XP</strong>
        <small>Novice</small>
      </div>
    </div>
    <div className="lp-dashboard-bottom">
      <div>
        <small>Weekly learning activity</small>
        <svg viewBox="0 0 280 94" role="img" aria-label="Illustrative learning activity chart">
          <defs>
            <linearGradient id={chartId} x2="0" y2="1">
              <stop stopColor="#7957ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7957ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 70Q30 35 60 49T110 58T160 30T210 25T280 13V94H0Z" fill={`url(#${chartId})`} />
          <path d="M0 70Q30 35 60 49T110 58T160 30T210 25T280 13" fill="none" stroke="#9878ff" strokeWidth="2" />
        </svg>
        <span className="lp-mini-days">Mon　 Tue　 Wed　 Thu　 Fri　 Sat　 Sun</span>
      </div>
      <div>
        <small>Skill mastery</small>{[['Arrays', 76], ['Trees', 58], ['Graphs', 41]].map(([label, value]) => <div className="lp-mini-skill" key={label}>
          <span>{label}</span>
          <div className="lp-track">
            <i style={{ width: `${value}%` }} />
          </div>
        </div>)}<span className="lp-earned">
          <Check size={12} />First quiz completed</span>
      </div>
    </div>
  </div>;
}
export function QuizPreview() {
  return <div className="lp-quiz-preview">
    <span className="lp-label">KNOWLEDGE CHECK · ARRAYS</span>
    <h3>What is the time complexity of accessing an array element by index?</h3>{['O(1) — constant time', 'O(n) — linear time', 'O(log n) — logarithmic time'].map((s, i) => <div key={s} className={i === 0 ? 'correct' : ''}>
      <span>{String.fromCharCode(65 + i)}</span>{s}{i === 0 && <Check size={14} />}</div>)}<small>Example answer · Direct indexing takes constant time.</small>
  </div>;
}
export function InterviewPreview() {
  return <div className="lp-interview-preview">
    <span className="lp-label">TECHNICAL INTERVIEW · PRACTICE</span>
    <div className="lp-interviewer">
      <Sparkles size={28} />
    </div>
    <h3>Let's talk through your approach.</h3>
    <p>How would you detect a cycle in a linked list? Explain your reasoning before writing code.</p>
    <div className="lp-waveform">{[10, 23, 15, 32, 18, 38, 28, 16, 30, 20, 35, 14, 24, 10].map((h, i) => <i key={i} style={{ height: h }} />)}</div>
    <small>Sample interview prompt</small>
  </div>;
}
export function LessonPreview() {
  return <div className="lp-lesson-preview">
    <div>
      <BookIcon />
      <span>Understanding binary trees</span>
    </div>
    <TreePreview />
    <div className="lp-track">
      <i style={{ width: '62%' }} />
    </div>
    <small>Concept → example → knowledge check</small>
  </div>;
}
function BookIcon() {
  return <span className="lp-ai-avatar">
    <Play size={18} />
  </span>;
}
export function ProductShowcase() {
  const items = [{ title: 'Learning dashboard', text: 'Your next step, made clear.', to: '/dashboard', Preview: DashboardPreview }, { title: 'Coding workspace', text: 'Think. Implement. Test. Improve.', to: '/coding', Preview: () => <CodePreview compact /> }, { title: 'AI Tutor', text: 'A little guidance. A deeper understanding.', to: '/ai-tutor', Preview: TutorPreview }, { title: '3D visualizer', text: 'Get a new perspective on every connection.', to: '/3d-visualizer', Preview: TreePreview }, { title: 'Knowledge checks', text: 'Find out what really clicked.', to: '/quiz', Preview: QuizPreview }, { title: 'Mock interview', text: 'Build confidence before the real thing.', to: '/mock-interview', Preview: InterviewPreview }]; return <div className="lp-showcase-grid">{items.map(({ title, text, to, Preview }) => <article key={title}>
    <a href={to}>
      <h3>{title}<ArrowRight size={15} />
      </h3>
      <p>{text}</p>
    </a>
    <WindowFrame title={title}>
      <Preview />
    </WindowFrame>
  </article>)}</div>;
}
