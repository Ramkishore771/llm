import React, { useState, useEffect } from 'react';
import {
  Binary,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { apiService } from '../services/api';
import { TokenizeResponse } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';

const PRESET_SENTENCES = [
  'Artificial intelligence is changing the world.',
  'Tokens are the fundamental building blocks of Large Language Models.',
  'ChatGPT uses Byte Pair Encoding (BPE) with cl100k_base tokenizer.',
  'Supercalifragilisticexpialidocious',
  '1 + 1 = 2; def calculate_fibonacci(n): return n if n <= 1 else calculate_fibonacci(n-1) + calculate_fibonacci(n-2)',
];

const TOKEN_COLORS = [
  'bg-sky-500/20 text-sky-300 border-sky-500/40',
  'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'bg-pink-500/20 text-pink-300 border-pink-500/40',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  'bg-teal-500/20 text-teal-300 border-teal-500/40',
];

export const TokenizationLabPage: React.FC = () => {
  const [inputText, setInputText] = useState('Artificial intelligence is changing the world.');
  const [encoding, setEncoding] = useState('cl100k_base');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TokenizeResponse | null>(null);
  const [copiedTokens, setCopiedTokens] = useState(false);
  const { recordExperiment } = useLearningProgress();

  const handleTokenize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.tokenize(inputText, encoding);
      setResult(data);
      recordExperiment('tokenization');
    } catch (err: any) {
      setError(err.message || 'Tokenization request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTokenize();
  }, [encoding]);

  const handleCopyTokenIds = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result.token_ids));
      setCopiedTokens(true);
      setTimeout(() => setCopiedTokens(false), 2000);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <Binary className="w-4 h-4" />
            <span>Interactive Foundation Lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tokenization & Byte Pair Encoding Lab
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Inspect how raw text strings are converted into discrete numerical token IDs using
            OpenAI's production <code className="text-sky-300 font-mono">tiktoken</code> engine.
          </p>
        </div>

        {/* Visual Pipeline Banner */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
            RAW TEXT
          </span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            SUBWORD TOKENS
          </span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            TOKEN IDs (INTEGERS)
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span>Input Sentence / Text</span>
          </label>

          {/* Model / Encoding Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Encoding:</span>
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
              className="bg-[#161f33] border border-[#232f48] text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-sky-500"
            >
              <option value="cl100k_base">cl100k_base (GPT-4 / ChatGPT)</option>
              <option value="p50k_base">p50k_base (GPT-3 / Codex)</option>
              <option value="r50k_base">r50k_base (Davinci)</option>
            </select>
          </div>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type any sentence, code, or prompt to inspect its subwords..."
          className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none transition font-mono leading-relaxed"
        />

        {/* Preset Sentences */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500">Presets:</span>
          {PRESET_SENTENCES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(preset)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-[11px] text-slate-300 transition truncate max-w-[200px]"
              title={preset}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setInputText('Artificial intelligence is changing the world.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleTokenize}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md shadow-sky-500/20 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Tokenizing...' : 'Tokenize Text'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Total Tokens</div>
              <div className="text-2xl font-bold text-sky-400 mt-1">{result.token_count}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Total Characters</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">{result.character_count}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Chars per Token</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{result.char_per_token}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Encoding Model</div>
              <div className="text-sm font-bold text-amber-400 mt-2 truncate font-mono">
                {result.encoding}
              </div>
            </div>
          </div>

          {/* Color-Coded Token Sequence Preview */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Visual Token Breakdown</span>
              </h3>
              <button
                onClick={handleCopyTokenIds}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] text-slate-300 text-xs font-semibold border border-[#232f48] transition"
              >
                {copiedTokens ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTokens ? 'Copied IDs!' : 'Copy Token IDs'}</span>
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1e293d] flex flex-wrap gap-2 text-sm font-mono leading-relaxed">
              {result.vocabulary_mapping.map((mapping, idx) => {
                const colorClass = TOKEN_COLORS[idx % TOKEN_COLORS.length];
                return (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono ${colorClass} transition hover:scale-105 cursor-default`}
                    title={`Token ID: ${mapping.token_id} | Bytes: ${mapping.byte_length}`}
                  >
                    <span>{mapping.token === ' ' ? '␣' : mapping.token}</span>
                    <span className="text-[10px] opacity-75 font-semibold">({mapping.token_id})</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400">
              Notice how spaces preceding words are attached to the token (e.g.{' '}
              <code className="text-sky-300">" changing"</code> instead of just{' '}
              <code className="text-sky-300">"changing"</code>).
            </p>
          </div>

          {/* Vocabulary Mapping Table */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-white">Detailed Vocabulary Mapping Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232f48] text-slate-400 uppercase font-mono">
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Subword Token</th>
                    <th className="py-2.5 px-3">Token ID (Integer)</th>
                    <th className="py-2.5 px-3">Byte Length</th>
                    <th className="py-2.5 px-3">Prefix Space</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293d] font-mono">
                  {result.vocabulary_mapping.map((m) => (
                    <tr key={m.index} className="hover:bg-[#141d2f] transition">
                      <td className="py-2.5 px-3 text-slate-500">#{m.index}</td>
                      <td className="py-2.5 px-3 text-sky-300 font-bold">
                        {m.token === ' ' ? '␣ [SPACE]' : m.token}
                      </td>
                      <td className="py-2.5 px-3 text-purple-400">{m.token_id}</td>
                      <td className="py-2.5 px-3 text-slate-400">{m.byte_length} bytes</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            m.is_whitespace_prefix
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {m.is_whitespace_prefix ? 'YES' : 'NO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
