import React, { useState, useEffect } from 'react';
import {
  BookText,
  BarChart3,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  TrendingDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { apiService } from '../services/api';
import { VocabularyResponse } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';

const SAMPLE_DATASETS: Record<string, string> = {
  ai_article: `Artificial intelligence and machine learning are revolutionizing software engineering. Large language models process natural language text by predicting the next token in a sequence. Neural networks adjust billions of parameters during pre-training on massive datasets. The transformer architecture relies on self-attention mechanisms to understand contextual relationships between words. Models like GPT-4 and Gemini exhibit emergent reasoning capabilities across diverse cognitive tasks.`,
  shakespeare: `To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them. To die—to sleep, No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to: 'tis a consummation Devoutly to be wish'd.`,
  code_snippet: `import torch
import torch.nn as nn

class TransformerDecoder(nn.Module):
    def __init__(self, vocab_size=100277, d_model=4096, nhead=32):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.layers = nn.ModuleList([
            TransformerBlock(d_model, nhead) for _ in range(32)
        ])
        self.output_head = nn.Linear(d_model, vocab_size, bias=False)

    def forward(self, token_ids):
        x = self.embedding(token_ids)
        for layer in self.layers:
            x = layer(x)
        return self.output_head(x)`,
};

export const VocabularyLabPage: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_DATASETS.ai_article);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VocabularyResponse | null>(null);
  const { recordExperiment } = useLearningProgress();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.analyzeVocabulary(inputText, 'cl100k_base');
      setResult(data);
      recordExperiment('vocabulary');
    } catch (err: any) {
      setError(err.message || 'Vocabulary analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <BookText className="w-4 h-4" />
            <span>Interactive Foundation Lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Vocabulary & Zipf's Law Analysis Lab
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Examine how vocabulary size, token frequencies, and lexical distributions govern LLM
            understanding and generative probability output layers.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-sm font-bold text-white">Sample Text / Dataset Input</label>

          {/* Dataset Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Load Preset:</span>
            <button
              onClick={() => setInputText(SAMPLE_DATASETS.ai_article)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-sky-300 transition"
            >
              AI Article
            </button>
            <button
              onClick={() => setInputText(SAMPLE_DATASETS.shakespeare)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-purple-300 transition"
            >
              Shakespeare
            </button>
            <button
              onClick={() => setInputText(SAMPLE_DATASETS.code_snippet)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-emerald-300 transition"
            >
              Python Code
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type text to calculate token distribution..."
          className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none transition font-mono leading-relaxed"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md shadow-sky-500/20 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Analyzing...' : 'Analyze Vocabulary'}</span>
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
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Total Tokens</div>
              <div className="text-2xl font-bold text-sky-400 mt-1">{result.total_tokens}</div>
            </div>
            <div className="p-5 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Unique Tokens</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">{result.unique_tokens}</div>
            </div>
            <div className="p-5 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Lexical Diversity (TTR)</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {result.type_token_ratio}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[#101624] border border-[#232f48]">
              <div className="text-xs text-slate-400">Total Vocab Size (|V|)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                {result.vocabulary_size.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Zipf's Law Frequency Chart */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <span>Token Frequency Distribution (Zipf's Law)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Natural languages follow a power-law distribution where rank-1 tokens occur far
                  more frequently than subsequent ranks.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.frequency_distribution}>
                  <XAxis dataKey="token" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101622',
                      borderColor: '#232f48',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="count" name="Frequency" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Frequent Tokens Table & Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-white">Most Frequent Subwords</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#232f48] text-slate-400 uppercase font-mono">
                      <th className="py-2 px-3">Rank</th>
                      <th className="py-2 px-3">Token</th>
                      <th className="py-2 px-3">Count</th>
                      <th className="py-2 px-3">% of Text</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293d] font-mono">
                    {result.most_frequent.slice(0, 10).map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#141d2f]">
                        <td className="py-2 px-3 text-slate-500">#{idx + 1}</td>
                        <td className="py-2 px-3 text-sky-300 font-bold">"{item.token}"</td>
                        <td className="py-2 px-3 text-white">{item.count}</td>
                        <td className="py-2 px-3 text-slate-400">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Educational Concept Breakdown */}
            <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>How Vocabulary Powers LLMs</span>
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Fixed Vocabulary Table:</strong> Before training begins, tokenizers like
                  BPE construct a static vocabulary $V$. In GPT-4, $|V| = 100,277$.
                </p>
                <p>
                  <strong>2. Final Projection Layer:</strong> In every transformer forward pass, the
                  model projects its hidden state ($d=4096$) back to $|V|$ dimensions to produce logits
                  for all possible tokens.
                </p>
                <p>
                  <strong>3. Type-Token Ratio (TTR):</strong> Higher TTR indicates greater lexical
                  richness and complexity, while lower TTR reflects repetitive or highly specialized
                  language.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
