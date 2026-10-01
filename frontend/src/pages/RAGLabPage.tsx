import React, { useState } from 'react';
import {
  Database,
  Upload,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { apiService } from '../services/api';
import { RAGQueryResponse, RAGChunk } from '../types';
import { useLearningProgress } from '../context/LearningProgressContext';

export const RAGLabPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState<number>(150);
  const [overlap, setOverlap] = useState<number>(30);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [docMeta, setDocMeta] = useState<{
    doc_id: string;
    filename: string;
    total_words: number;
    chunk_count: number;
    chunks: RAGChunk[];
  } | null>(null);

  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState<number>(3);
  const [querying, setQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [ragResult, setRagResult] = useState<RAGQueryResponse | null>(null);

  const { recordExperiment } = useLearningProgress();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const data = await apiService.uploadRAGDocument(file, chunkSize, overlap);
      setDocMeta(data);
      recordExperiment('rag');
      // Set a sample prompt if none
      setQuery('What are the key points discussed in this document?');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!docMeta || !query.trim() || querying) return;
    setQuerying(true);
    setQueryError(null);
    try {
      const data = await apiService.queryRAG(docMeta.doc_id, query.trim(), topK);
      setRagResult(data);
      recordExperiment('rag');
    } catch (err: any) {
      setQueryError(err.message || 'RAG query failed.');
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-sky-950/40 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <Database className="w-4 h-4" />
            <span>Practical Enterprise Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Retrieval-Augmented Generation (RAG) Lab
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload custom documents (PDF, TXT, DOCX), inspect chunking & vector indexing, and query
            the knowledge base with complete pipeline visibility and citations.
          </p>
        </div>

        {/* Visual Pipeline Banner */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-slate-300 border border-[#232f48]">
            DOCUMENT
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-slate-300 border border-[#232f48]">
            CHUNKING
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-purple-400 border border-purple-500/30">
            EMBEDDINGS
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-sky-400 border border-sky-500/30">
            VECTOR SEARCH
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-[#141d2f] text-emerald-400 border border-emerald-500/30">
            GROUNDED ANSWER
          </span>
        </div>
      </div>

      {/* Step 1: Document Ingestion Card */}
      <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>Upload & Ingest Document</span>
          </h2>
          <span className="text-xs text-slate-400">Supported: PDF, TXT, DOCX</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* File Picker */}
          <div className="md:col-span-2 border-2 border-dashed border-[#232f48] hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition cursor-pointer relative bg-[#0e1422]">
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-10 h-10 text-emerald-400 mb-3" />
            <div className="text-sm font-semibold text-white">
              {file ? file.name : 'Click or drag document to upload'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 10MB'}
            </div>
          </div>

          {/* Chunking Sliders */}
          <div className="space-y-4 p-4 rounded-xl bg-[#141b2c] border border-[#232f48]">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Chunking Strategy
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Chunk Size (Words)</span>
                <span className="text-emerald-400 font-bold">{chunkSize}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Overlap (Words)</span>
                <span className="text-sky-400 font-bold">{overlap}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={overlap}
                onChange={(e) => setOverlap(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50"
            >
              {uploading ? 'Processing & Indexing...' : 'Index Document Chunks'}
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Ingestion Success Meta */}
        {docMeta && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">Successfully Indexed {docMeta.filename}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300 font-mono">
              <span>{docMeta.total_words} words</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{docMeta.chunk_count} Chunks</span>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Query & Inspect Pipeline */}
      {docMeta && (
        <div className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Ask Questions with Retrieval Grounding</span>
            </h2>

            {/* Top-K Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Top-K Chunks:</span>
              <select
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="bg-[#161f33] border border-[#232f48] text-white rounded-lg px-2.5 py-1 text-xs outline-none"
              >
                <option value={2}>Top 2</option>
                <option value={3}>Top 3</option>
                <option value={5}>Top 5</option>
              </select>
            </div>
          </div>

          {/* Query Form */}
          <form onSubmit={handleQuery} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about the document..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={querying || !query.trim()}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{querying ? 'Searching...' : 'Run RAG'}</span>
            </button>
          </form>

          {queryError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {queryError}
            </div>
          )}

          {/* RAG Results Display */}
          {ragResult && (
            <div className="space-y-6 pt-4 border-t border-[#1e293d]">
              {/* Pipeline Step Trace */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                {ragResult.pipeline_steps.map((st) => (
                  <div key={st.step} className="p-2.5 rounded-xl bg-[#141d2f] border border-[#232f48]">
                    <div className="text-[10px] text-slate-500 font-mono">Step {st.step}</div>
                    <div className="font-bold text-white text-xs mt-0.5">{st.title}</div>
                  </div>
                ))}
              </div>

              {/* Two Column: Answer & Retrieved Chunks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Final Grounded Answer */}
                <div className="p-6 rounded-2xl bg-[#141d2f] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Grounded LLM Answer</span>
                  </div>
                  <div className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
                    {ragResult.answer}
                  </div>
                </div>

                {/* Retrieved Context Chunks */}
                <div className="p-6 rounded-2xl bg-[#141d2f] border border-[#232f48] space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>Retrieved Knowledge Chunks</span>
                    <span className="text-sky-400 font-mono">{ragResult.retrieved_chunks.length} Top Matches</span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {ragResult.retrieved_chunks.map((chk) => (
                      <div
                        key={chk.chunk_id}
                        className="p-3.5 rounded-xl bg-[#0e1422] border border-[#1e293d] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-sky-400 font-bold">[{chk.chunk_id}]</span>
                          <span className="text-emerald-400 font-semibold">
                            Relevance: {chk.relevance_percent}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{chk.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
