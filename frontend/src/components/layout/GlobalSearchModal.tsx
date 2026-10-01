import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FlaskConical, FolderKanban, HelpCircle, ArrowRight } from 'lucide-react';
import { LEARNING_TOPICS } from '../../data/learningRoadmap';
import { AI_PROJECTS } from '../../data/projects';
import { ALL_QUIZZES } from '../../data/quizzes';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  type: 'topic' | 'lab' | 'project' | 'quiz';
  category: string;
  path: string;
  description: string;
}

const STATIC_LABS: SearchItem[] = [
  { id: 'lab-token', title: 'Tokenization Lab', type: 'lab', category: 'Labs', path: '/tokenization', description: 'Analyze text-to-token breakdown, token IDs, and subword encodings.' },
  { id: 'lab-vocab', title: 'Vocabulary Lab', type: 'lab', category: 'Labs', path: '/vocabulary', description: 'Explore token frequency distributions, unique token ratios, and vocabulary size.' },
  { id: 'lab-embed', title: 'Embedding Lab', type: 'lab', category: 'Labs', path: '/embeddings', description: 'Visualize 2D semantic word vectors and compute cosine similarity.' },
  { id: 'lab-play', title: 'AI Playground', type: 'lab', category: 'Labs', path: '/playground', description: 'Tweak temperature, top_p, system prompts, and test prompt templates.' },
  { id: 'lab-chat', title: 'AI Chat Assistant', type: 'lab', category: 'Labs', path: '/chat', description: 'Full conversational AI with persistent multi-session history.' },
  { id: 'lab-rag', title: 'RAG Lab', type: 'lab', category: 'Labs', path: '/rag', description: 'Upload PDF/TXT documents, inspect chunking, and query knowledge vectors.' },
  { id: 'lab-vis', title: 'Mini LLM Visualizer', type: 'lab', category: 'Labs', path: '/visualizer', description: 'Step-by-step animated pipeline from text to next-token prediction.' },
  { id: 'lab-attn', title: 'Attention Visualizer', type: 'lab', category: 'Labs', path: '/attention', description: 'Interactive multi-head self-attention matrix and token connection arcs.' },
  { id: 'lab-prompt', title: 'Prompt Engineering Lab', type: 'lab', category: 'Labs', path: '/prompt-lab', description: 'Side-by-side comparison of Basic vs Improved prompts with live execution.' },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable index
  const allItems: SearchItem[] = [
    ...LEARNING_TOPICS.map((t) => ({
      id: t.id,
      title: `${t.number}. ${t.title}`,
      type: 'topic' as const,
      category: `Learning Hub (${t.category})`,
      path: `/learn/${t.id}`,
      description: t.summary,
    })),
    ...STATIC_LABS,
    ...AI_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      type: 'project' as const,
      category: `Project Lab (${p.difficulty})`,
      path: `/projects/${p.id}`,
      description: p.description,
    })),
    ...ALL_QUIZZES.slice(0, 8).map((q) => ({
      id: q.id,
      title: `Quiz: ${q.topicTitle}`,
      type: 'quiz' as const,
      category: 'Quizzes',
      path: '/quizzes',
      description: q.question,
    })),
  ];

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : allItems.slice(0, 8);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#101622] border border-[#232f48] rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#232f48] gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, labs, projects, quizzes... (e.g. 'token', 'attention', 'rag')"
            className="w-full bg-transparent border-none outline-none text-white text-base placeholder-slate-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No matching topics, experiments, or projects found for "{query}".
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`p-2 rounded-lg ${
                        item.type === 'topic'
                          ? 'bg-blue-500/20 text-blue-400'
                          : item.type === 'lab'
                          ? 'bg-purple-500/20 text-purple-400'
                          : item.type === 'project'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.type === 'topic' && <BookOpen className="w-4 h-4" />}
                      {item.type === 'lab' && <FlaskConical className="w-4 h-4" />}
                      {item.type === 'project' && <FolderKanban className="w-4 h-4" />}
                      {item.type === 'quiz' && <HelpCircle className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-sm text-white truncate flex items-center gap-2">
                        {item.title}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition ${
                      isSelected ? 'text-sky-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-t border-[#232f48] text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
