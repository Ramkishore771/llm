import React from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Flame,
  BookOpen,
  FlaskConical,
  FolderKanban,
  HelpCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useLearningProgress } from '../context/LearningProgressContext';
import { useAuth } from '../context/AuthContext';

export const ProgressAchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    completedTopics,
    quizScores,
    completedProjects,
    experimentCount,
    streakDays,
    achievements,
    getOverallProgress,
    resetProgress,
  } = useLearningProgress();

  const overall = getOverallProgress();

  const pieData = [
    { name: 'Completed Curriculum', value: overall, color: '#38bdf8' },
    { name: 'Remaining Curriculum', value: Math.max(0, 100 - overall), color: '#1e293b' },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-sky-950/40 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-semibold">
            <Trophy className="w-4 h-4" />
            <span>Learner Profile & Milestones</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Learning Progress & Dynamic Badges
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Monitor your comprehensive mastery across topics, hands-on lab experiments, graded
            evaluations, and unlock verified achievements as you advance.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Overall Score</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{overall}%</div>
          <div className="text-[11px] text-slate-500 mt-2">Combined mastery index</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Topics Done</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">
            {completedTopics.length} <span className="text-sm text-slate-500">/ 23</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Curriculum concepts</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Experiments</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{experimentCount}</div>
          <div className="text-[11px] text-slate-500 mt-2">Labs and simulations</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101624] border border-[#232f48]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{streakDays} Days</div>
          <div className="text-[11px] text-slate-500 mt-2">Active daily engagement</div>
        </div>
      </div>

      {/* Dynamic Achievements Badges Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Unlockable Badges & Credentials</span>
          </h2>
          <p className="text-xs text-slate-400">
            Achievements unlock dynamically as you interact with labs, topics, quizzes, and projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 via-[#101624] to-[#121a2c] border-amber-500/40 shadow-md'
                  : 'bg-[#0f1422] border-[#1e293d] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
                      ach.unlocked
                        ? 'bg-amber-400 text-slate-900 shadow-amber-500/25'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {ach.unlocked ? '🏆' : <Lock className="w-5 h-5" />}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      ach.unlocked
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {ach.unlocked ? 'UNLOCKED' : `${ach.progressPercent}% DONE`}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{ach.description}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ach.unlocked ? 'bg-amber-400' : 'bg-slate-600'
                  }`}
                  style={{ width: `${ach.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
