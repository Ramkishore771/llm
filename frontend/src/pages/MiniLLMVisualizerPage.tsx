import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Binary,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  shortDesc: string;
  mathFormula?: string;
  explanation: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Text Input',
    shortDesc: 'Raw character stream entered by human user',
    explanation:
      'The process begins with arbitrary natural language text. Neural networks cannot directly perform arithmetic operations on characters or strings; they require a discrete symbolic conversion.',
  },
  {
    id: 2,
    title: 'Tokenization (BPE)',
    shortDesc: 'Splitting text into morphological subwords',
    explanation:
      'Byte Pair Encoding (BPE) segments the raw string into recognized subword units. High-frequency words remain unified, while rare or compound words split into morphological roots.',
  },
  {
    id: 3,
    title: 'Token IDs Lookup',
    shortDesc: 'Discrete vocabulary index mapping',
    explanation:
      'Each subword token is converted into a unique integer identifier referencing the pre-trained vocabulary table (e.g. 0 to 100,276 in GPT-4 cl100k_base).',
  },
  {
    id: 4,
    title: 'Dense Embeddings',
    shortDesc: 'Continuous high-dimensional vector projection',
    mathFormula: 'x_i = W_e[token\\_id_i] \\in \\mathbb{R}^{d_{model}}',
    explanation:
      'The integer token ID serves as an index to look up a row in the embedding matrix, projecting the discrete symbol into a continuous vector space where semantic proximity represents conceptual similarity.',
  },
  {
    id: 5,
    title: 'Position Information (RoPE)',
    shortDesc: 'Injecting sequence order into vectors',
    mathFormula: 'q_m = R_{\\Theta, m}^d W_q x_m',
    explanation:
      'Because self-attention is permutation-invariant, positional coordinates are combined with token vectors (via Rotary Position Embeddings) so the network recognizes sequence syntax.',
  },
  {
    id: 6,
    title: 'Multi-Head Attention',
    shortDesc: 'Dynamic contextual weight aggregation',
    mathFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    explanation:
      'Tokens project Query, Key, and Value vectors. Scaled dot-product calculates dynamic attention weights allowing tokens to contextualize their meaning with other tokens.',
  },
  {
    id: 7,
    title: 'Transformer Block',
    shortDesc: 'LayerNorm, Residual Skips, and MLP Feed-Forward',
    mathFormula: 'x_{out} = \\text{MLP}(\\text{LN}(x + \\text{Attn}(x)))',
    explanation:
      'The contextualized vectors pass through residual connections, Layer Normalization, and dense Multi-Layer Perceptrons (MLP / SwiGLU) across dozens of stacked layers.',
  },
  {
    id: 8,
    title: 'Next Token Prediction',
    shortDesc: 'Softmax probability distribution over vocabulary',
    mathFormula: 'P(w_{t+1}) = \\text{softmax}(W_{vocab} \\cdot h_L)',
    explanation:
      'The final hidden state is projected through the language modeling head to calculate logits for every token in the vocabulary. Softmax sampling selects the next token.',
  },
];

export const MiniLLMVisualizerPage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState('Large Language Models learn world knowledge');

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStage((prev) => (prev < 8 ? prev + 1 : 1));
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStage = STAGES[currentStage - 1];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <Workflow className="w-4 h-4" />
            <span>Interactive Pedagogical Visualizer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mini LLM Architecture Visualizer
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Step through the complete end-to-end lifecycle of an autoregressive transformer: from
            raw characters to probabilistic next-token generation.
          </p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 rounded-2xl bg-[#101624] border border-[#232f48] shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STAGES.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setCurrentStage(st.id);
                setIsPlaying(false);
              }}
              className={`p-2.5 rounded-xl text-left transition ${
                currentStage === st.id
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                  : currentStage > st.id
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'bg-[#141d2f] text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[10px] opacity-75 font-mono">Stage 0{st.id}</div>
              <div className="text-xs truncate font-semibold">{st.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Animation' : 'Auto Play Stages'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentStage(1);
              setIsPlaying(false);
            }}
            className="p-2 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStage((prev) => Math.max(1, prev - 1))}
            disabled={currentStage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-slate-300 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentStage((prev) => Math.min(8, prev + 1))}
            disabled={currentStage === 8}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs text-slate-300 disabled:opacity-40 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Interactive Visual Panel */}
      <div className="p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-6 shadow-sm min-h-[360px] flex flex-col justify-between">
        <div>
          {/* Stage Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1e293d] mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                Stage {activeStage.id} of 8
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{activeStage.title}</h2>
              <p className="text-xs text-slate-400">{activeStage.shortDesc}</p>
            </div>
            {activeStage.mathFormula && (
              <div className="hidden sm:block px-4 py-2 rounded-xl bg-[#0a0e17] border border-purple-500/30 text-purple-300 font-mono text-xs">
                {activeStage.mathFormula}
              </div>
            )}
          </div>

          {/* Interactive Dynamic Stage Visualizer Body */}
          <div className="p-6 rounded-2xl bg-[#090d16] border border-[#1e293d] flex items-center justify-center min-h-[180px]">
            {currentStage === 1 && (
              <div className="space-y-3 text-center max-w-md w-full">
                <div className="text-xs text-slate-400">Raw Input String:</div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-[#141b2c] border border-sky-500/50 rounded-xl px-4 py-3 text-sm text-center text-white font-mono outline-none"
                />
              </div>
            )}

            {currentStage === 2 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {inputText.split(' ').map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-sm animate-pulse"
                  >
                    "{word}"
                  </span>
                ))}
              </div>
            )}

            {currentStage === 3 && (
              <div className="flex flex-wrap gap-2 justify-center font-mono">
                {inputText.split(' ').map((word, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#141b2c] border border-purple-500/40 text-center">
                    <div className="text-[10px] text-slate-400 truncate max-w-[80px]">{word}</div>
                    <div className="text-sm font-bold text-purple-300 mt-1">
                      {Math.abs(hashString(word)) % 90000 + 1000}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-2 text-center font-mono text-xs">
                <div className="text-emerald-400">Lookup in Weight Matrix W_e [100277, 4096]:</div>
                <div className="p-3 rounded-xl bg-[#141b2c] border border-[#232f48] text-slate-300 max-w-lg mx-auto truncate">
                  [0.082, -0.419, 0.912, 0.003, ..., 0.384] (d=4096 continuous vector)
                </div>
              </div>
            )}

            {currentStage === 5 && (
              <div className="space-y-2 text-center text-xs">
                <div className="text-amber-400 font-mono font-bold">
                  Rotary Position Embedding (RoPE) Angle Modulation
                </div>
                <div className="flex justify-center gap-3 font-mono text-[11px] text-slate-300">
                  <span className="p-2 rounded bg-[#141b2c]">pos=0 (θ_0=0.0 rad)</span>
                  <span className="p-2 rounded bg-[#141b2c]">pos=1 (θ_1=0.78 rad)</span>
                  <span className="p-2 rounded bg-[#141b2c]">pos=2 (θ_2=1.57 rad)</span>
                </div>
              </div>
            )}

            {currentStage === 6 && (
              <div className="space-y-2 text-center font-mono text-xs">
                <div className="text-sky-400 font-bold">Query × Key^T Attention Routing</div>
                <div className="flex items-center justify-center gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300">Q [B, H, S, D]</span>
                  <span>×</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">K^T [B, H, D, S]</span>
                  <span>=</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
                    Attention Weights A [B, H, S, S]
                  </span>
                </div>
              </div>
            )}

            {currentStage === 7 && (
              <div className="space-y-2 text-center text-xs">
                <div className="text-indigo-400 font-bold">Stacked Transformer Block x32</div>
                <div className="text-slate-300 font-mono text-[11px]">
                  Residual Skip Connection: x = x + MultiHeadAttn(LN(x))
                </div>
                <div className="text-slate-300 font-mono text-[11px]">
                  Feed-Forward SwiGLU: x = x + MLP(LN(x))
                </div>
              </div>
            )}

            {currentStage === 8 && (
              <div className="space-y-3 w-full max-w-md text-xs font-mono">
                <div className="text-center text-emerald-400 font-bold mb-2">
                  Top Next-Token Probabilities (Softmax):
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>"efficiently"</span>
                    <span className="text-emerald-400 font-bold">54.2%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '54.2%' }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>"faster"</span>
                    <span className="text-sky-400 font-bold">28.1%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '28.1%' }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>"continuously"</span>
                    <span className="text-purple-400 font-bold">12.5%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Explanation at bottom of card */}
        <div className="pt-4 border-t border-[#1e293d] text-xs text-slate-300 leading-relaxed">
          <strong>Deep Dive:</strong> {activeStage.explanation}
        </div>
      </div>
    </div>
  );
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
