import React, { useState, useEffect } from 'react';
import {
  Eye,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { apiService } from '../services/api';
import { AttentionResponse } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';

export const AttentionVisualizerPage: React.FC = () => {
  const [sentence, setSentence] = useState('The cat sat on the mat because it was tired');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(7); // "it" default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attentionData, setAttentionData] = useState<AttentionResponse | null>(null);
  const [activeHead, setActiveHead] = useState<'average' | 'head_1_local' | 'head_2_syntactic' | 'head_3_coreference'>('average');

  const { recordExperiment } = useLearningProgress();

  const handleCompute = async (targetSentence = sentence) => {
    if (!targetSentence.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.computeAttention(targetSentence);
      setAttentionData(data);
      // Ensure selected index is in range
      if (selectedWordIndex >= data.tokens.length) {
        setSelectedWordIndex(0);
      }
      recordExperiment('attention');
    } catch (err: any) {
      setError(err.message || 'Attention computation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCompute();
  }, []);

  const currentMatrix =
    attentionData &&
    (activeHead === 'average'
      ? attentionData.attention_matrix
      : attentionData.heads[activeHead]);

  const selectedWord = attentionData?.tokens[selectedWordIndex] || '';
  const weightsForSelected = currentMatrix ? currentMatrix[selectedWordIndex] || [] : [];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <Eye className="w-4 h-4" />
            <span>Interactive Mechanism Explorer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Self-Attention Mechanism Visualizer
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            See how tokens in an input sequence dynamically focus on other words to resolve pronouns,
            syntactic roles, and long-range dependencies.
          </p>
        </div>
      </div>

      {/* Input Sentence & Controls */}
      <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Sentence to Analyze
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            className="flex-1 bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-sans"
          />
          <button
            onClick={() => handleCompute()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Computing...' : 'Calculate Attention'}</span>
          </button>
        </div>

        {/* Preset quick sentences */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          <span>Preset Examples:</span>
          <button
            onClick={() => {
              const s = 'The cat sat on the mat because it was tired';
              setSentence(s);
              setSelectedWordIndex(7);
              handleCompute(s);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] text-sky-300 border border-[#232f48] transition text-[11px]"
          >
            The cat sat on the mat because it was tired
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Attention Exploration Area */}
      {attentionData && (
        <div className="space-y-6">
          {/* Word Selector & Interactive Highlight Strip */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Click a Word to Inspect its Attention</h3>
                <p className="text-xs text-slate-400">
                  Select any word below. Colored glow and opacity reveal which words it attends to most
                  heavily.
                </p>
              </div>

              {/* Attention Head Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161f33] border border-[#232f48] text-xs">
                <button
                  onClick={() => setActiveHead('average')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeHead === 'average'
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Heads (Avg)
                </button>
                <button
                  onClick={() => setActiveHead('head_3_coreference')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeHead === 'head_3_coreference'
                      ? 'bg-purple-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Coreference Head
                </button>
                <button
                  onClick={() => setActiveHead('head_2_syntactic')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeHead === 'head_2_syntactic'
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Syntactic Head
                </button>
              </div>
            </div>

            {/* Clickable Words Array with Attention Glow */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-[#1e293d] flex flex-wrap gap-2.5 items-center justify-center min-h-[100px]">
              {attentionData.tokens.map((token, idx) => {
                const isSelected = idx === selectedWordIndex;
                const weight = weightsForSelected[idx] || 0.0;

                // Color calculation based on attention weight
                let bgStyle = 'bg-slate-800/40 text-slate-400 border-slate-800';
                if (isSelected) {
                  bgStyle = 'bg-sky-500 text-white font-bold ring-2 ring-sky-300 ring-offset-2 ring-offset-black scale-110';
                } else if (weight >= 0.25) {
                  bgStyle = 'bg-sky-500/40 text-sky-200 border-sky-400 font-semibold shadow-lg shadow-sky-500/20';
                } else if (weight >= 0.1) {
                  bgStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedWordIndex(idx)}
                    className={`px-3 py-2 rounded-xl text-sm font-mono border transition transform cursor-pointer flex flex-col items-center gap-0.5 ${bgStyle}`}
                  >
                    <span>{token}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      {(weight * 100).toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Beginner-friendly explanation of the selected word */}
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-sky-400">Attention Insight for "{selectedWord}": </span>
              {selectedWord.toLowerCase() === 'it' && (
                <span>
                  Notice how the pronoun <strong>"it"</strong> places its highest attention weights on{' '}
                  <strong>"cat"</strong> (the entity it references) and <strong>"tired"</strong> (its
                  state). This is how transformers solve coreference resolution!
                </span>
              )}
              {selectedWord.toLowerCase() === 'sat' && (
                <span>
                  The verb <strong>"sat"</strong> directs its attention to the subject{' '}
                  <strong>"cat"</strong> and prepositional object <strong>"mat"</strong>.
                </span>
              )}
              {selectedWord.toLowerCase() !== 'it' && selectedWord.toLowerCase() !== 'sat' && (
                <span>
                  The word <strong>"{selectedWord}"</strong> computes attention probabilities across all
                  other sequence tokens based on the scaled dot product $QK^T / \sqrt{'{d_k}'}$.
                </span>
              )}
            </div>
          </div>

          {/* Full Attention Heatmap Matrix */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white">Full Attention Matrix ($N \times N$)</h3>
              <p className="text-xs text-slate-400">
                Rows represent the attending tokens ($Query$). Columns represent the attended tokens ($Key$).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-1.5 text-left text-slate-500">Query \ Key</th>
                    {attentionData.tokens.map((t, idx) => (
                      <th key={idx} className="p-1.5 text-slate-300 truncate max-w-[55px]">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentMatrix &&
                    currentMatrix.map((row, rIdx) => {
                      const isRowSelected = rIdx === selectedWordIndex;
                      return (
                        <tr
                          key={rIdx}
                          onClick={() => setSelectedWordIndex(rIdx)}
                          className={`cursor-pointer transition ${
                            isRowSelected ? 'bg-sky-500/15' : 'hover:bg-[#141b2c]'
                          }`}
                        >
                          <td className="p-1.5 text-left font-bold text-sky-300">
                            {attentionData.tokens[rIdx]}
                          </td>
                          {row.map((weight, cIdx) => {
                            let cellBg = 'bg-[#090d16] text-slate-500';
                            if (weight >= 0.3) cellBg = 'bg-sky-500 text-white font-bold';
                            else if (weight >= 0.15) cellBg = 'bg-sky-500/50 text-sky-100';
                            else if (weight >= 0.08) cellBg = 'bg-purple-500/30 text-purple-200';

                            return (
                              <td
                                key={cIdx}
                                className={`p-1.5 rounded text-[11px] border border-black/30 ${cellBg}`}
                                title={`${attentionData.tokens[rIdx]} attends to ${attentionData.tokens[cIdx]}: ${(
                                  weight * 100
                                ).toFixed(1)}%`}
                              >
                                {(weight * 100).toFixed(0)}%
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
