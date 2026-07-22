import { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { codeSnippets } from '../workspace/codeSnippets';
import Editor from '@monaco-editor/react';

interface CodeModalProps {
  open: boolean;
  onClose: () => void;
  activeDs: string;
}

const formatLanguage = (lang: string) => {
  if (lang === 'cplusplus') return 'C++';
  return lang.charAt(0).toUpperCase() + lang.slice(1);
};

export default function CodeImplementationsModal({ open, onClose, activeDs }: CodeModalProps) {
  // map activeDs (e.g. 'Linked List') to codeSnippets key (e.g. 'linked-list')
  const mapDsToKey = (ds: string) => {
    const mapping: Record<string, string> = {
      'Bubble Sort': 'bubble-sort',
      'Selection Sort': 'selection-sort',
      'Insertion Sort': 'insertion-sort',
      'Merge Sort': 'merge-sort',
      'Quick Sort': 'quick-sort',
      'Linear Search': 'linear-search',
      'Binary Search': 'binary-search',
      'Array': 'array',
      'Linked List': 'linked-list',
      'Stack': 'stack',
      'Queue': 'queue',
      'Binary Tree': 'binary-tree',
      'Graph': 'graph',
      'Hash Table': 'hash-table',
    };
    return mapping[ds] || 'array';
  };

  const key = mapDsToKey(activeDs);
  const snippets = codeSnippets[key as keyof typeof codeSnippets] || {};
  
  const langs = Object.keys(snippets);
  const [activeLang, setActiveLang] = useState<string>(langs[0] || '');

  // Reset active lang when the data structure changes
  useEffect(() => {
    if (langs.length > 0 && !langs.includes(activeLang)) {
      setActiveLang(langs[0]);
    }
  }, [activeDs, langs, activeLang]);

  const getMonacoLang = (lang: string) => {
    if (lang === 'cplusplus') return 'cpp';
    if (lang === 'c') return 'c';
    if (lang === 'python') return 'python';
    if (lang === 'java') return 'java';
    if (lang === 'javascript') return 'javascript';
    if (lang === 'typescript') return 'typescript';
    return lang;
  };

  return (
    <Modal open={open} onClose={onClose} title={`${activeDs} Implementations`} maxWidth="max-w-4xl">
      <div className="flex flex-col h-[600px]">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-border-subtle)] pb-2 overflow-x-auto custom-scrollbar">
          {langs.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
                activeLang === lang 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {formatLanguage(lang)}
            </button>
          ))}
        </div>

        {/* Code Editor (Read Only) */}
        <div className="flex-1 rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[#1e1e1e]">
          {activeLang && snippets[activeLang] ? (
            <Editor
              height="100%"
              defaultLanguage={getMonacoLang(activeLang)}
              language={getMonacoLang(activeLang)}
              value={snippets[activeLang]}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                fontFamily: 'var(--font-mono)'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No implementations available for {activeDs}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
