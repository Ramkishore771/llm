import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Cpu,
  Database,
  Binary,
  GraduationCap,
  FolderKanban,
  CheckCircle2,
  Workflow,
  Zap,
  Code2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  openAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ openAuthModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      openAuthModal();
    }
  };

  const handleExplorePlayground = () => {
    navigate('/playground');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 overflow-hidden relative selection:bg-sky-500 selection:text-white">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-24 left-10 w-72 h-72 bg-sky-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-64 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131b2d] border border-sky-500/30 text-sky-300 text-xs font-semibold mb-8 shadow-lg shadow-sky-500/10 hover:border-sky-500/50 transition">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Next-Generation LLM Learning & Experimentation Portal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Learn LLMs.{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Experiment with AI.
          </span>{' '}
          Build the Future.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          An interactive platform to understand Large Language Models through concepts, experiments,
          AI tools, and real-world projects. From subword tokenization and vector embeddings to RAG
          and autonomous agents.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleStartLearning}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-sky-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleExplorePlayground}
            className="flex items-center gap-2 px-7 py-4 rounded-xl bg-[#131b2e] hover:bg-[#1a253e] border border-[#232f48] text-slate-200 hover:text-white font-semibold text-base transition shadow-md"
          >
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>Explore AI Playground</span>
          </button>
        </div>

        {/* Floating Interactive Visual Showcase Card */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#162035] to-[#0d1422] p-1 border border-[#273552] shadow-2xl overflow-hidden">
            {/* Visual Header bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232f48] bg-[#0c121e]/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400">interactive-llm-pipeline.py</span>
              </div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>Live Interactive Sandbox</span>
              </div>
            </div>

            {/* Interactive Preview Flow */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Step 1: Tokenizer */}
              <div className="p-4 rounded-xl bg-[#111827]/80 border border-sky-500/20 hover:border-sky-500/40 transition group">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase mb-2">
                  <Binary className="w-4 h-4" />
                  <span>1. Tokenization</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div className="text-slate-500">// Text to Subwords</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Art</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">ificial</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">intel</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">IDs: [9470, 16895, 11478]</div>
                </div>
              </div>

              {/* Step 2: Embeddings */}
              <div className="p-4 rounded-xl bg-[#111827]/80 border border-purple-500/20 hover:border-purple-500/40 transition group">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase mb-2">
                  <Workflow className="w-4 h-4" />
                  <span>2. Embeddings</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div className="text-slate-500">// Vector Projections</div>
                  <div className="text-[11px] text-purple-300 font-mono">v = [0.95, -0.7, 0.4]</div>
                  <div className="text-[10px] text-slate-400 mt-1">King - Man + Woman ≈ Queen (cos=0.94)</div>
                </div>
              </div>

              {/* Step 3: Self-Attention */}
              <div className="p-4 rounded-xl bg-[#111827]/80 border border-indigo-500/20 hover:border-indigo-500/40 transition group">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-2">
                  <Brain className="w-4 h-4" />
                  <span>3. Attention</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div className="text-slate-500">// Softmax(QK^T / √d)</div>
                  <div className="text-[11px] text-indigo-300">"it" ➔ "cat" (0.84)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Multi-head contextual representation</div>
                </div>
              </div>

              {/* Step 4: RAG & Generation */}
              <div className="p-4 rounded-xl bg-[#111827]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition group">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                  <Database className="w-4 h-4" />
                  <span>4. RAG Retrieval</span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div className="text-slate-500">// Knowledge Grounding</div>
                  <div className="text-[11px] text-emerald-300">Vector Search Top-K</div>
                  <div className="text-[10px] text-slate-400 mt-1">Zero Hallucination with Citations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1f293d]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">
            Everything You Need to Master LLMs
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            From Zero to Building Autonomous AI Systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-[#101624] border border-[#232f48] hover:border-sky-500/50 transition relative group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">23 Structured Concepts</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Beginner foundations through advanced transformer mechanics, training loss, fine-tuning,
              and production architecture with step-by-step visualizations and code.
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Beginner to Advanced progression</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Interactive mini-quizzes & progress tracking</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-[#101624] border border-[#232f48] hover:border-purple-500/50 transition relative group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Experiment Labs</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Hands-on playgrounds for real tokenization with tiktoken, vocabulary Zipf analysis,
              2D semantic embeddings, self-attention matrices, and RAG document ingestion.
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Real Python FastAPI tokenizer & vector math</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Upload PDF/TXT/DOCX for live RAG</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-[#101624] border border-[#232f48] hover:border-emerald-500/50 transition relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">6 Real-World AI Projects</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Build production-grade portfolios: Document Q&A, AI Summarizer, ATS Resume Analyzer,
              Study Assistant, and Technical Mock Interview Simulator with live runners.
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Guided step-by-step instructions & code templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dynamic badges & achievement celebrations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1f293d] text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-3 text-slate-400 font-semibold">
          <Brain className="w-4 h-4 text-sky-400" />
          <span>NeuralForge LLM Learning & Experimentation Portal</span>
        </div>
        <p>Built for college students and AI researchers. Production-quality architecture with FastAPI & React.</p>
      </footer>
    </div>
  );
};
