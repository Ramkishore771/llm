import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Code2,
  Layers,
  Columns,
} from 'lucide-react';
import { apiService } from '../services/api';
import { useLearningProgress } from '../context/LearningProgressContext';

interface PromptPreset {
  title: string;
  technique: string;
  basic: string;
  improved: string;
}

const PRESETS: PromptPreset[] = [
  {
    title: 'Math & Logic Reasoning',
    technique: 'Chain-of-Thought (CoT)',
    basic: 'A cafeteria had 23 apples. They used 20 to make lunch and bought 6 more. How many apples do they have?',
    improved:
      'A cafeteria had 23 apples. They used 20 to make lunch and bought 6 more. How many apples do they have?\n\nThink step-by-step before answering. State intermediate calculations clearly, then provide the final answer as "Final Count: X".',
  },
  {
    title: 'Data Extraction & Schema',
    technique: 'Few-Shot + Structured Output',
    basic: 'Extract the patient name and diagnosis from: Dr. Smith examined Sarah Connor and diagnosed acute bronchitis.',
    improved:
      'You are a medical data parser. Extract the entities and respond strictly with valid JSON conforming to this schema:\n{"patient_name": string, "diagnosis": string, "physician": string}\n\nExample 1:\nInput: Dr. Adams saw John Doe and treated hypertension.\nOutput: {"patient_name": "John Doe", "diagnosis": "hypertension", "physician": "Dr. Adams"}\n\nInput: Dr. Smith examined Sarah Connor and diagnosed acute bronchitis.\nOutput:',
  },
  {
    title: 'Code Refactoring',
    technique: 'Role + Constraints + Context',
    basic: 'Make this python function faster:\ndef is_prime(n):\n  for i in range(2, n):\n    if n % i == 0: return False\n  return True',
    improved:
      'You are a Principal Python Performance Engineer. Refactor the prime checking function below.\n\nConstraints:\n1. Complexity must be O(sqrt(N))\n2. Include type annotations and Google-style docstring\n3. Handle edge cases (N <= 1, N == 2)\n4. Provide a brief 2-line explanation of the algorithmic improvement\n\nCode:\ndef is_prime(n):\n  for i in range(2, n):\n    if n % i == 0: return False\n  return True',
  },
];

export const PromptLabPage: React.FC = () => {
  const [basicPrompt, setBasicPrompt] = useState(PRESETS[0].basic);
  const [improvedPrompt, setImprovedPrompt] = useState(PRESETS[0].improved);
  const [activePresetTitle, setActivePresetTitle] = useState(PRESETS[0].title);

  const [running, setRunning] = useState(false);
  const [basicResponse, setBasicResponse] = useState<string>('');
  const [improvedResponse, setImprovedResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { recordExperiment } = useLearningProgress();

  const handleApplyPreset = (preset: PromptPreset) => {
    setActivePresetTitle(preset.title);
    setBasicPrompt(preset.basic);
    setImprovedPrompt(preset.improved);
    setBasicResponse('');
    setImprovedResponse('');
  };

  const handleRunComparison = async () => {
    setRunning(true);
    setError(null);
    try {
      // Execute both prompts in parallel
      const [resBasic, resImproved] = await Promise.all([
        apiService.generatePlayground([{ role: 'user', content: basicPrompt }], undefined, 0.7, 500),
        apiService.generatePlayground(
          [{ role: 'user', content: improvedPrompt }],
          undefined,
          0.7,
          500
        ),
      ]);

      setBasicResponse(resBasic.text);
      setImprovedResponse(resImproved.text);
      recordExperiment('prompt-comparison');
    } catch (err: any) {
      setError(err.message || 'Prompt comparison run failed.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-sky-950/40 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Experimentation Lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Prompt Engineering & Side-by-Side Lab
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Compare Basic vs Structured Prompts in real-time. Discover how Chain-of-Thought, few-shot
            exemplars, roles, and constraints eliminate ambiguity and boost reasoning.
          </p>
        </div>
      </div>

      {/* Techniques Reference Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#101624] border border-[#232f48]">
          <div className="font-bold text-sky-400">Zero-Shot vs Few-Shot</div>
          <p className="text-slate-400 text-[11px] mt-1">
            Provide 2-3 exemplars to guide output formatting and tone.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101624] border border-[#232f48]">
          <div className="font-bold text-purple-400">Chain-of-Thought (CoT)</div>
          <p className="text-slate-400 text-[11px] mt-1">
            "Think step by step" unlocks intermediate reasoning tokens.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101624] border border-[#232f48]">
          <div className="font-bold text-emerald-400">Role & Persona Framing</div>
          <p className="text-slate-400 text-[11px] mt-1">
            Set authoritative identity (e.g. Principal Engineer).
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101624] border border-[#232f48]">
          <div className="font-bold text-amber-400">Strict Constraints</div>
          <p className="text-slate-400 text-[11px] mt-1">
            Enforce JSON schemas, length caps, and negative rules.
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Comparison Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.title}
            onClick={() => handleApplyPreset(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activePresetTitle === p.title
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#101624] text-slate-400 hover:text-white border-[#232f48]'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Side-by-Side Prompt Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Basic Prompt */}
        <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                1. Basic / Vague Prompt
              </span>
              <span className="text-[11px] text-slate-500">Unconstrained</span>
            </div>
            <textarea
              rows={6}
              value={basicPrompt}
              onChange={(e) => setBasicPrompt(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-rose-400/50 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Right: Improved Prompt */}
        <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                2. Improved / Structured Prompt
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Role + CoT + Constraints</span>
            </div>
            <textarea
              rows={6}
              value={improvedPrompt}
              onChange={(e) => setImprovedPrompt(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-emerald-400/50 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Run Button in Center */}
      <div className="flex justify-center">
        <button
          onClick={handleRunComparison}
          disabled={running}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-sky-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{running ? 'Executing Dual Prompts...' : 'Compare Side-by-Side'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Side-by-Side Response Displays */}
      {(basicResponse || improvedResponse) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Basic Response */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293d]">
              <span className="text-xs font-bold text-rose-400 uppercase">
                Basic Output (Prone to Assumptions)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {basicResponse.split(' ').length} words
              </span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {basicResponse}
            </div>
          </div>

          {/* Right: Improved Response */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293d]">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Improved Output (Grounded & Structured)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {improvedResponse.split(' ').length} words
              </span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {improvedResponse}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
