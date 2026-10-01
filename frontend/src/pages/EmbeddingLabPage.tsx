import React, { useState, useEffect } from 'react';
import {
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Plus,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { apiService } from '../services/api';
import { EmbeddingResponse, EmbeddingPoint } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';

const PRESET_GROUPS = {
  classic: ['king', 'queen', 'man', 'woman', 'car', 'banana', 'apple', 'robot'],
  tech_vs_nature: ['computer', 'software', 'algorithm', 'tree', 'flower', 'forest'],
  vehicles: ['car', 'truck', 'bicycle', 'airplane', 'dog', 'cat'],
};

export const EmbeddingLabPage: React.FC = () => {
  const [items, setItems] = useState<string[]>(PRESET_GROUPS.classic);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmbeddingResponse | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<EmbeddingPoint | null>(null);
  const { recordExperiment } = useLearningProgress();

  const handleCompute = async (itemsToCompute = items) => {
    if (itemsToCompute.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.computeEmbeddings(itemsToCompute);
      setResult(data);
      if (data.points_2d.length > 0) {
        setSelectedPoint(data.points_2d[0]);
      }
      recordExperiment('embeddings');
    } catch (err: any) {
      setError(err.message || 'Embeddings computation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCompute();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && !items.includes(newItem.trim().toLowerCase())) {
      const updated = [...items, newItem.trim().toLowerCase()];
      setItems(updated);
      setNewItem('');
      handleCompute(updated);
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const updated = items.filter((i) => i !== itemToRemove);
    setItems(updated);
    if (updated.length > 0) {
      handleCompute(updated);
    } else {
      setResult(null);
    }
  };

  const handleLoadPreset = (group: string[]) => {
    setItems(group);
    handleCompute(group);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 text-xs font-semibold">
            <Network className="w-4 h-4" />
            <span>Interactive Vector Space Lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Vector Embeddings & Semantic Geometry Lab
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Discover how discrete words are mapped into continuous geometric vector spaces, where
            semantic distance is measured by Cosine Similarity.
          </p>
        </div>
      </div>

      {/* Inputs Strip & Preset Selector */}
      <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-sm font-bold text-white">Words & Concepts to Compare</label>

          {/* Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => handleLoadPreset(PRESET_GROUPS.classic)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-purple-300 transition"
            >
              King/Queen/Car/Banana
            </button>
            <button
              onClick={() => handleLoadPreset(PRESET_GROUPS.tech_vs_nature)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-sky-300 transition"
            >
              Tech vs Nature
            </button>
            <button
              onClick={() => handleLoadPreset(PRESET_GROUPS.vehicles)}
              className="px-2.5 py-1 rounded-lg bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-emerald-300 transition"
            >
              Vehicles vs Pets
            </button>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#0e1422] border border-[#1e293d]">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveItem(item)}
                className="hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {/* Add custom word input */}
          <form onSubmit={handleAddItem} className="inline-flex items-center">
            <input
              type="text"
              placeholder="+ add word"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 px-2 py-1 w-24 focus:w-36 transition-all"
            />
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => handleCompute()}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-500/20 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Projecting Vectors...' : 'Compute Embeddings & Similarity'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Visualizations Grid */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: 2D Semantic Vector Map */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-400" />
                  <span>2D Semantic Vector Space</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Principal component projection showing semantic clustering
                </p>
              </div>
            </div>

            {/* Custom 2D Vector Canvas Coordinate Plane */}
            <div className="relative w-full h-80 rounded-xl bg-[#090d16] border border-[#1e293d] overflow-hidden p-4">
              {/* Axes lines */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800" />
              <div className="absolute left-1/2 top-0 h-full w-[1px] bg-slate-800" />

              {/* Axis labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-mono">
                +Royalty / Animacy
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-mono">
                -Organic / Flora
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">
                +Technology
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">
                -Inanimate
              </div>

              {/* Render Points */}
              {result.points_2d.map((pt) => {
                // Map coordinates from [-1, 1] to percentage [10%, 90%]
                const leftPercent = ((pt.x + 1) / 2) * 80 + 10;
                const topPercent = ((1 - pt.y) / 2) * 80 + 10;
                const isSelected = selectedPoint?.id === pt.id;

                return (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPoint(pt)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition transform hover:scale-125 z-10"
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono shadow-lg flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300 ring-offset-2 ring-offset-black'
                          : 'bg-slate-800/90 hover:bg-purple-500/80 text-purple-200 border border-purple-500/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{pt.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected point inspection */}
            {selectedPoint && (
              <div className="p-3.5 rounded-xl bg-[#141d2f] border border-[#232f48] text-xs">
                <span className="font-bold text-white uppercase font-mono">
                  {selectedPoint.text}
                </span>
                <span className="text-slate-400 ml-2">
                  (x: {selectedPoint.x}, y: {selectedPoint.y})
                </span>
                <div className="text-[11px] text-purple-300 font-mono truncate mt-1">
                  Vector: [{selectedPoint.vector.join(', ')}]
                </div>
              </div>
            )}
          </div>

          {/* Right: Pairwise Cosine Similarity Heatmap Matrix */}
          <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white">Cosine Similarity Matrix</h3>
              <p className="text-xs text-slate-400">
                Values range from 0.0 (unrelated) to 1.0 (identical direction)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-1.5 text-slate-500 text-left">Tokens</th>
                    {result.items.map((item, idx) => (
                      <th key={idx} className="p-1.5 text-purple-300 truncate max-w-[60px]">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.similarity_matrix.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-1.5 text-purple-300 font-semibold text-left">
                        {result.items[rIdx]}
                      </td>
                      {row.map((score, cIdx) => {
                        // Color interpolation based on score
                        const isSelf = rIdx === cIdx;
                        let bg = 'bg-slate-900/60 text-slate-500';
                        if (score >= 0.85) bg = 'bg-purple-500/80 text-white font-bold';
                        else if (score >= 0.6) bg = 'bg-purple-500/40 text-purple-200';
                        else if (score >= 0.3) bg = 'bg-sky-500/20 text-sky-300';
                        else if (score < 0) bg = 'bg-rose-500/20 text-rose-300';

                        return (
                          <td
                            key={cIdx}
                            className={`p-1.5 rounded text-[11px] border border-black/20 ${bg}`}
                            title={`${result.items[rIdx]} & ${result.items[cIdx]}: ${score}`}
                          >
                            {score.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Arithmetic Formula callout */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-purple-300">Vector Semantic Arithmetic</div>
              <div className="font-mono text-[11px] text-white">
                vec("King") - vec("Man") + vec("Woman") ≈ vec("Queen")
              </div>
              <div className="text-slate-400 text-[11px]">
                Dense embeddings encode relational vectors like gender and royalty as spatial
                offsets.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
