import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { LEARNING_TOPICS } from '../data/learningRoadmap';
import { useLearningProgress } from '../context/LearningProgressContext';

export const LearningHubPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const { completedTopics, isTopicCompleted } = useLearningProgress();
  const navigate = useNavigate();

  const categories = ['All', 'Beginner', 'Core LLM Concepts', 'Advanced'];

  const filteredTopics = LEARNING_TOPICS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.number.toString().includes(searchFilter);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Structured Curriculum</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            LLM Learning Hub & Roadmap
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Master the foundations, mechanics, mathematics, and production implementation of Large
            Language Models across 23 comprehensive, interactive modules.
          </p>
        </div>

        {/* Progress summary pill */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#141d2f] border border-[#232f48] text-slate-300">
            Completed:{' '}
            <span className="text-sky-400 font-bold">
              {completedTopics.length} / {LEARNING_TOPICS.length} Topics
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#141d2f] border border-[#232f48] text-slate-300">
            Completion Rate:{' '}
            <span className="text-emerald-400 font-bold">
              {Math.round((completedTopics.length / LEARNING_TOPICS.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-[#101624] text-slate-400 hover:text-white border border-[#232f48]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter topics..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#101624] border border-[#232f48] focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const completed = isTopicCompleted(topic.id);
          return (
            <div
              key={topic.id}
              onClick={() => navigate(`/learn/${topic.id}`)}
              className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                completed
                  ? 'bg-[#10192a]/80 border-sky-500/40 hover:border-sky-400'
                  : 'bg-[#101624] border-[#232f48] hover:border-slate-600 hover:bg-[#131b2e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    Topic #{topic.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {topic.readingTimeMinutes}m
                    </span>
                    {completed && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1e293d] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {topic.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition">
                  <span>Explore Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
