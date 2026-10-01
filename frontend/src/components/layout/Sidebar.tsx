import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Binary,
  BookText,
  Network,
  Cpu,
  MessageSquare,
  Database,
  Eye,
  Workflow,
  Sparkles,
  FolderKanban,
  HelpCircle,
  Trophy,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useLearningProgress } from '../../context/LearningProgressContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { getOverallProgress, completedTopics } = useLearningProgress();
  const overall = getOverallProgress();

  const sections: NavSection[] = [
    {
      title: 'CORE PLATFORM',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/learn', label: 'Learning Hub', icon: GraduationCap, badge: `${completedTopics.length}/23` },
      ],
    },
    {
      title: 'FOUNDATION LABS',
      items: [
        { to: '/tokenization', label: 'Tokenization Lab', icon: Binary },
        { to: '/vocabulary', label: 'Vocabulary Lab', icon: BookText },
        { to: '/embeddings', label: 'Embedding Lab', icon: Network },
      ],
    },
    {
      title: 'AI PLAYGROUND & CHAT',
      items: [
        { to: '/playground', label: 'AI Playground', icon: Cpu },
        { to: '/chat', label: 'AI Chat', icon: MessageSquare },
        { to: '/rag', label: 'RAG Lab', icon: Database },
      ],
    },
    {
      title: 'VISUALIZERS & PROMPTS',
      items: [
        { to: '/visualizer', label: 'Mini LLM Visualizer', icon: Workflow },
        { to: '/attention', label: 'Attention Visualizer', icon: Eye },
        { to: '/prompt-lab', label: 'Prompt Lab', icon: Sparkles },
      ],
    },
    {
      title: 'PRACTICAL LABS & METRICS',
      items: [
        { to: '/projects', label: 'Project Lab', icon: FolderKanban },
        { to: '/quizzes', label: 'Quizzes', icon: HelpCircle },
        { to: '/progress', label: 'Progress & Badges', icon: Trophy },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#0d121c] border-r border-[#1f293d] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition group ${
                        isActive
                          ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition ${
                              isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isActive
                                ? 'bg-sky-500/30 text-sky-300'
                                : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight
                            className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition ${
                              isActive ? 'opacity-100 text-sky-400' : 'text-slate-600'
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer: Progress overview */}
        <div className="p-4 border-t border-[#1f293d] bg-[#090d14]/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Curriculum Progress</span>
            <span className="text-sky-400 font-bold">{overall}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${overall}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>{completedTopics.length} of 23 Topics</span>
            <NavLink to="/progress" className="text-sky-400 hover:underline">
              View stats →
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
