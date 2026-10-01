import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  FolderKanban,
  Trophy,
  ArrowRight,
  FlaskConical,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { LEARNING_TOPICS } from '../data/learningRoadmap';
import { AI_PROJECTS } from '../data/projects';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    completedTopics,
    quizScores,
    completedProjects,
    experimentCount,
    streakDays,
    getOverallProgress,
    achievements,
  } = useLearningProgress();
  const navigate = useNavigate();

  const overall = getOverallProgress();

  // Find next recommended topic
  const nextTopic =
    LEARNING_TOPICS.find((t) => !completedTopics.includes(t.id)) || LEARNING_TOPICS[0];

  // Calculate average quiz score
  const quizScoresList = Object.values(quizScores);
  const avgQuizScore =
    quizScoresList.length > 0
      ? Math.round(
          quizScoresList.reduce((acc, curr) => acc + curr.percentage, 0) /
            quizScoresList.length
        )
      : 85; // Default healthy baseline for demonstration

  // Category breakdown for chart
  const categories = [
    {
      name: 'Beginner',
      completed: LEARNING_TOPICS.filter(
        (t) => t.category === 'Beginner' && completedTopics.includes(t.id)
      ).length,
      total: LEARNING_TOPICS.filter((t) => t.category === 'Beginner').length,
      color: '#38bdf8',
    },
    {
      name: 'Core Concepts',
      completed: LEARNING_TOPICS.filter(
        (t) => t.category === 'Core LLM Concepts' && completedTopics.includes(t.id)
      ).length,
      total: LEARNING_TOPICS.filter((t) => t.category === 'Core LLM Concepts').length,
      color: '#818cf8',
    },
    {
      name: 'Advanced',
      completed: LEARNING_TOPICS.filter(
        (t) => t.category === 'Advanced' && completedTopics.includes(t.id)
      ).length,
      total: LEARNING_TOPICS.filter((t) => t.category === 'Advanced').length,
      color: '#c084fc',
    },
  ];

  const pieData = [
    { name: 'Completed Topics', value: completedTopics.length, color: '#38bdf8' },
    {
      name: 'Remaining Topics',
      value: Math.max(0, 23 - completedTopics.length),
      color: '#1e293b',
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-[#101624] border border-sky-500/20 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-semibold text-xs border border-sky-500/30">
                Student Learning Portal
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{streakDays} Day Learning Streak</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.displayName || 'AI Explorer'}!
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              You are making steady progress mastering Large Language Models. Dive into your next topic
              or experiment hands-on in the lab.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/learn/${nextTopic.id}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/playground')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#162035] hover:bg-[#1e2a44] border border-[#273552] text-slate-200 text-sm font-semibold transition"
            >
              <FlaskConical className="w-4 h-4 text-sky-400" />
              <span>AI Playground</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Learning Progress */}
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm relative overflow-hidden group hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">{overall}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Curriculum mastery</div>
        </div>

        {/* Card 2: Topics Completed */}
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Topics Completed</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">
            {completedTopics.length} <span className="text-base text-slate-500 font-normal">/ 23</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(completedTopics.length / 23) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {23 - completedTopics.length} remaining
          </div>
        </div>

        {/* Card 3: Quiz Score */}
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Avg Quiz Score</span>
            <HelpCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mb-2">{avgQuizScore}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${avgQuizScore}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {Object.keys(quizScores).length} quizzes taken
          </div>
        </div>

        {/* Card 4: AI Experiments */}
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>AI Experiments</span>
            <FlaskConical className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">{experimentCount}</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, experimentCount * 15)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Tokens, vectors & RAG runs</div>
        </div>

        {/* Card 5: Projects */}
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Projects Built</span>
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mb-2">
            {completedProjects.length} <span className="text-base text-slate-500 font-normal">/ 6</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${(completedProjects.length / 6) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Practical portfolio items</div>
        </div>
      </div>

      {/* Two Column Layout: Charts & Recommended Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Progress & Visual Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module Completion Bar Chart */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Curriculum Roadmap Completion</h3>
                <p className="text-xs text-slate-400">Completed topics vs total available per module</p>
              </div>
              <Link to="/learn" className="text-xs text-sky-400 hover:underline font-medium">
                View Roadmap →
              </Link>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} barCategoryGap="20%">
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101622',
                      borderColor: '#232f48',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="completed" name="Completed" radius={[6, 6, 0, 0]}>
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Experiments Launcher */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm">
            <h3 className="text-base font-bold text-white mb-4">Interactive Experiments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/tokenization"
                className="p-4 rounded-xl bg-[#161f33] hover:bg-[#1d2943] border border-[#232f48] transition group"
              >
                <div className="text-sky-400 font-bold text-sm mb-1 group-hover:text-sky-300">
                  Tokenization Lab
                </div>
                <div className="text-xs text-slate-400">
                  Inspect BPE tokens and byte mappings in real time.
                </div>
              </Link>

              <Link
                to="/embeddings"
                className="p-4 rounded-xl bg-[#161f33] hover:bg-[#1d2943] border border-[#232f48] transition group"
              >
                <div className="text-purple-400 font-bold text-sm mb-1 group-hover:text-purple-300">
                  Embedding Lab
                </div>
                <div className="text-xs text-slate-400">
                  2D semantic vector spaces and cosine similarity.
                </div>
              </Link>

              <Link
                to="/rag"
                className="p-4 rounded-xl bg-[#161f33] hover:bg-[#1d2943] border border-[#232f48] transition group"
              >
                <div className="text-emerald-400 font-bold text-sm mb-1 group-hover:text-emerald-300">
                  RAG Lab
                </div>
                <div className="text-xs text-slate-400">
                  Upload PDF documents and perform grounded search.
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recommended Topic & Achievements */}
        <div className="space-y-6">
          {/* Recommended Next Topic Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121a2d] to-[#0c121e] border border-sky-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Next Step</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              Topic {nextTopic.number}: {nextTopic.title}
            </h4>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-300 mb-3">
              {nextTopic.category} • {nextTopic.readingTimeMinutes} min read
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">{nextTopic.summary}</p>

            <button
              onClick={() => navigate(`/learn/${nextTopic.id}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Dive In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Achievements Summary */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Earned Badges</span>
              </h3>
              <Link to="/progress" className="text-xs text-sky-400 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    ach.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-[#141b2a] border-[#1e293d] opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      ach.unlocked
                        ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    🏆
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-sm font-semibold text-white truncate">{ach.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{ach.description}</div>
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {ach.progressPercent}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
