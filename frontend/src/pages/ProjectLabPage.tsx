import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  Code2,
  Layers,
  ArrowRight,
  Send,
} from 'lucide-react';
import { AI_PROJECTS } from '../data/projects';
import { ProjectDefinition } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';
import { apiService } from '../services/api';

export const ProjectLabPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(AI_PROJECTS[0].id);
  const { completedProjects, completeProject } = useLearningProgress();

  const activeProject =
    AI_PROJECTS.find((p) => p.id === selectedProjectId) || AI_PROJECTS[0];
  const isDone = completedProjects.includes(activeProject.id);

  // Runner state
  const [inputs, setInputs] = useState<Record<string, any>>(activeProject.defaultInputs);
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string>('');
  const [runError, setRunError] = useState<string | null>(null);

  const handleSelectProject = (proj: ProjectDefinition) => {
    setSelectedProjectId(proj.id);
    setInputs(proj.defaultInputs);
    setRunOutput('');
    setRunError(null);
  };

  const handleRunProject = async () => {
    setRunning(true);
    setRunError(null);
    try {
      const data = await apiService.runProject(activeProject.id, inputs);
      setRunOutput(data.output);
      completeProject(activeProject.id);
    } catch (err: any) {
      setRunError(err.message || 'Project execution failed.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-sky-950/40 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <FolderKanban className="w-4 h-4" />
            <span>Practical AI Engineering Portfolio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Project Lab & Sandboxes
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Construct 6 real-world, production-quality AI applications: from Document Q&A and ATS
            Resume Analyzers to multi-turn technical interview simulators.
          </p>
        </div>

        {/* Status pill */}
        <div className="mt-5 text-xs text-slate-400">
          Projects Completed:{' '}
          <span className="text-emerald-400 font-bold font-mono">
            {completedProjects.length} / {AI_PROJECTS.length} Built
          </span>
        </div>
      </div>

      {/* Projects Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_PROJECTS.map((proj) => {
          const completed = completedProjects.includes(proj.id);
          const isSelected = proj.id === activeProject.id;

          return (
            <div
              key={proj.id}
              onClick={() => handleSelectProject(proj)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-[#101624] border-[#232f48] hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      proj.difficulty === 'Beginner'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : proj.difficulty === 'Intermediate'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {proj.difficulty}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{proj.estimatedHours}</span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {proj.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e293d] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {completed ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    'Not completed'
                  )}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  Select Project →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Project Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Specs & Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  Project Brief
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{activeProject.title}</h2>
              </div>
              <button
                onClick={() => completeProject(activeProject.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#161f33] hover:bg-[#1e2b47] text-slate-300 border border-[#232f48]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isDone ? 'Project Completed' : 'Mark Complete'}</span>
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Problem Statement
                </div>
                <div className="p-3.5 rounded-xl bg-[#141b2c] border border-[#232f48] text-slate-300 leading-relaxed">
                  {activeProject.problemStatement}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Learning Objective
                </div>
                <div className="p-3.5 rounded-xl bg-[#141b2c] border border-[#232f48] text-slate-300 leading-relaxed">
                  {activeProject.objective}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Technologies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Steps Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Step-by-Step Implementation Guide</span>
            </h3>

            <div className="space-y-4">
              {activeProject.steps.map((st) => (
                <div key={st.stepNumber} className="p-4 rounded-xl bg-[#141b2c] border border-[#232f48] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                      {st.stepNumber}
                    </span>
                    <span>{st.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">{st.instruction}</p>
                  {st.codeSnippet && (
                    <div className="pl-7 pt-1">
                      <div className="rounded-lg bg-[#090d16] border border-[#1e293d] p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                        <pre>{st.codeSnippet}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Runner Sandbox (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293d]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Live Project Sandbox Runner</span>
                </div>
              </div>

              {/* Dynamic Input Fields according to Project */}
              <div className="space-y-3">
                {Object.keys(inputs).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {key.replace('_', ' ')}
                    </label>
                    <textarea
                      rows={3}
                      value={inputs[key]}
                      onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
                      className="w-full bg-[#141b2c] border border-[#232f48] focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none font-mono leading-relaxed"
                    />
                  </div>
                ))}

                <button
                  onClick={handleRunProject}
                  disabled={running}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{running ? 'Executing AI Task...' : 'Run Project Sandbox'}</span>
                </button>
              </div>

              {runError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {runError}
                </div>
              )}

              {/* Runner Output */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Execution Output
                </div>
                <div className="p-4 rounded-xl bg-[#090d16] border border-[#1e293d] min-h-[160px] text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {running ? (
                    <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span>Synthesizing output...</span>
                    </div>
                  ) : runOutput ? (
                    runOutput
                  ) : (
                    <span className="text-slate-600 italic">
                      Click "Run Project Sandbox" to execute this project with the backend model.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
