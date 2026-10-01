import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Send,
  Zap,
  Trash2,
  BookTemplate,
} from 'lucide-react';
import { apiService } from '../services/api';
import { useLearningProgress } from '../context/LearningProgressContext';

interface PromptTemplate {
  name: string;
  category: string;
  system: string;
  prompt: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    name: 'Summarization',
    category: 'Summary',
    system: 'You are an elite research summarizer. Extract the core findings, methodology, and actionable takeaways in structured bullet points.',
    prompt: 'Summarize the core architectural innovations of the Transformer (Vaswani et al., 2017) and explain why self-attention enables GPU scaling.',
  },
  {
    name: 'Explanation',
    category: 'Pedagogy',
    system: 'You are a patient computer science professor. Explain complex technical concepts with intuitive, relatable analogies.',
    prompt: 'Explain how FlashAttention avoids the memory bandwidth bottleneck during high-context LLM inference.',
  },
  {
    name: 'Interview Prep',
    category: 'Career',
    system: 'You are a Principal AI Engineer conducting a rigorous technical bar raiser interview. Challenge the candidate and evaluate their system design.',
    prompt: 'How would you architect a production RAG pipeline serving 500,000 internal enterprise PDF documents with sub-second retrieval latency?',
  },
  {
    name: 'Code Generation',
    category: 'Coding',
    system: 'You are an expert Python engineer specializing in PyTorch and HuggingFace Transformers. Output clean, documented, production-ready code.',
    prompt: 'Write a clean PyTorch implementation of Scaled Dot-Product Multi-Head Attention with zero-division safety and causal masking.',
  },
  {
    name: 'Text Rewriting',
    category: 'Writing',
    system: 'You are an executive editor for Nature and IEEE. Rewrite colloquial text into rigorous academic prose.',
    prompt: 'Rewrite this: "Our new model runs way faster because we cut down the big matrix math and made the weights smaller."',
  },
  {
    name: 'Question Answering',
    category: 'Q&A',
    system: 'You are an authoritative AI encyclopedia. Answer factually with precise terminology and citations.',
    prompt: 'What is the mathematical difference between Pre-LayerNorm and Post-LayerNorm in modern transformer architectures like LLaMA?',
  },
];

export const AIPlaygroundPage: React.FC = () => {
  const [systemInstruction, setSystemInstruction] = useState(
    'You are an expert AI research assistant. Provide clear, accurate, and educational answers.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Explain the role of the Temperature parameter in LLM text generation and how it affects the Softmax probability distribution.'
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(800);
  const [model, setModel] = useState<string>('auto');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { recordExperiment } = useLearningProgress();

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.generatePlayground(
        [{ role: 'user', content: userPrompt }],
        systemInstruction,
        temperature,
        maxTokens,
        model
      );
      setResponse(data.text);
      setUsageInfo(data.usage);
      recordExperiment('playground');
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (tpl: PromptTemplate) => {
    setSystemInstruction(tpl.system);
    setUserPrompt(tpl.prompt);
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setUserPrompt('');
    setResponse('');
    setUsageInfo(null);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Interactive Experimentation Lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Prompt & Generation Playground
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Experiment with system prompts, sampling parameters (temperature, max tokens), prompt
            templates, and observe how output distributions adapt.
          </p>
        </div>

        {/* Pipeline banner */}
        <div className="mt-5 flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-[#141b2c] border border-sky-500/30 text-sky-300">
            PROMPT + SYSTEM
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-[#141b2c] border border-purple-500/30 text-purple-300">
            LLM PARAMETERS (T={temperature})
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-[#141b2c] border border-emerald-500/30 text-emerald-300">
            AUTOREGRESSIVE RESPONSE
          </span>
        </div>
      </div>

      {/* Main Grid: Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config & Prompts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Templates Quick Bar */}
          <div className="p-4 rounded-2xl bg-[#101624] border border-[#232f48] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <BookTemplate className="w-4 h-4 text-sky-400" />
              <span>Prompt Templates:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-slate-300 hover:text-white transition"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* System Instruction */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-2 shadow-sm">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>System Instruction (Persona & Guardrails)</span>
            </label>
            <textarea
              rows={3}
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          {/* User Message Input */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-3 shadow-sm">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              User Prompt
            </label>
            <textarea
              rows={5}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none font-mono leading-relaxed"
            />

            {/* Hyperparameters Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1e293d]">
              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Temperature</span>
                  <span className="font-mono text-sky-400 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>0 (Deterministic)</span>
                  <span>1.5 (Creative)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Max Tokens</span>
                  <span className="font-mono text-purple-400 font-bold">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>100</span>
                  <span>2000</span>
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <div className="text-xs text-slate-400 mb-1">Inference Backend</div>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#141b2c] border border-[#232f48] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-sky-500 font-mono"
                >
                  <option value="auto">Auto Router (Configured Provider)</option>
                  <option value="gemini">Google Gemini 1.5 Flash</option>
                  <option value="openai">OpenAI GPT-4o-mini</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !userPrompt.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Synthesizing...' : 'Generate Response'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Response (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293d] mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-white">AI Model Response</span>
                </div>
                {response && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleGenerate}
                      title="Regenerate"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      title="Copy"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Response Body */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Running autoregressive decoding...</span>
                </div>
              ) : error ? (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              ) : response ? (
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {response}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-xs text-center">
                  <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
                  <span>Configure prompts and click "Generate Response" to experiment.</span>
                </div>
              )}
            </div>

            {/* Usage Metadata Strip */}
            {usageInfo && (
              <div className="pt-4 border-t border-[#1e293d] mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Prompt: {usageInfo.prompt_tokens || 0} tokens</span>
                <span>Output: {usageInfo.completion_tokens || 0} tokens</span>
                <span className="text-sky-400 font-bold">Total: {usageInfo.total_tokens || 0}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
