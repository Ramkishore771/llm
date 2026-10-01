import {
  TokenizeResponse,
  VocabularyResponse,
  EmbeddingResponse,
  RAGQueryResponse,
  AttentionResponse,
} from '../types';

const API_BASE = '/api';

export function getCustomApiKeys() {
  const gemini = localStorage.getItem('llm_gemini_key') || undefined;
  const openai = localStorage.getItem('llm_openai_key') || undefined;
  return { geminiKey: gemini, openaiKey: openai };
}

export const apiService = {
  async health(): Promise<{ status: string; service: string; version: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async tokenize(text: string, encoding = 'cl100k_base'): Promise<TokenizeResponse> {
    const res = await fetch(`${API_BASE}/tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, encoding }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Tokenization failed' }));
      throw new Error(err.detail || 'Tokenization failed');
    }
    return res.json();
  },

  async analyzeVocabulary(text: string, encoding = 'cl100k_base'): Promise<VocabularyResponse> {
    const res = await fetch(`${API_BASE}/vocabulary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, encoding }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Vocabulary analysis failed' }));
      throw new Error(err.detail || 'Vocabulary analysis failed');
    }
    return res.json();
  },

  async computeEmbeddings(items: string[]): Promise<EmbeddingResponse> {
    const { geminiKey } = getCustomApiKeys();
    const res = await fetch(`${API_BASE}/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, gemini_key: geminiKey }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Embeddings computation failed' }));
      throw new Error(err.detail || 'Embeddings computation failed');
    }
    return res.json();
  },

  async chat(
    messages: { role: string; content: string }[],
    systemInstruction?: string,
    temperature = 0.7,
    maxTokens = 1000,
    model = 'auto'
  ): Promise<{ text: string; model: string; usage: any }> {
    const { geminiKey, openaiKey } = getCustomApiKeys();
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        system_instruction: systemInstruction,
        temperature,
        max_tokens: maxTokens,
        model,
        gemini_key: geminiKey,
        openai_key: openaiKey,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Chat completion failed' }));
      throw new Error(err.detail || 'Chat completion failed');
    }
    return res.json();
  },

  async generatePlayground(
    messages: { role: string; content: string }[],
    systemInstruction?: string,
    temperature = 0.7,
    maxTokens = 1000,
    model = 'auto'
  ): Promise<{ text: string; model: string; usage: any }> {
    const { geminiKey, openaiKey } = getCustomApiKeys();
    const res = await fetch(`${API_BASE}/playground/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        system_instruction: systemInstruction,
        temperature,
        max_tokens: maxTokens,
        model,
        gemini_key: geminiKey,
        openai_key: openaiKey,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Playground generation failed' }));
      throw new Error(err.detail || 'Playground generation failed');
    }
    return res.json();
  },

  async uploadRAGDocument(file: File, chunkSize = 150, overlap = 30): Promise<{
    doc_id: string;
    filename: string;
    total_words: number;
    chunk_count: number;
    chunks: any[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chunk_size', chunkSize.toString());
    formData.append('overlap', overlap.toString());

    const res = await fetch(`${API_BASE}/rag/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Document upload failed' }));
      throw new Error(err.detail || 'Document upload failed');
    }
    return res.json();
  },

  async queryRAG(docId: string, query: string, topK = 3): Promise<RAGQueryResponse> {
    const { geminiKey, openaiKey } = getCustomApiKeys();
    const res = await fetch(`${API_BASE}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_id: docId,
        query,
        top_k: topK,
        gemini_key: geminiKey,
        openai_key: openaiKey,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'RAG query failed' }));
      throw new Error(err.detail || 'RAG query failed');
    }
    return res.json();
  },

  async computeAttention(sentence: string): Promise<AttentionResponse> {
    const res = await fetch(`${API_BASE}/attention`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Attention computation failed' }));
      throw new Error(err.detail || 'Attention computation failed');
    }
    return res.json();
  },

  async runProject(projectId: string, inputs: Record<string, any>): Promise<{ status: string; output: string }> {
    const { geminiKey, openaiKey } = getCustomApiKeys();
    const res = await fetch(`${API_BASE}/projects/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectId,
        inputs,
        gemini_key: geminiKey,
        openai_key: openaiKey,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Project execution failed' }));
      throw new Error(err.detail || 'Project execution failed');
    }
    return res.json();
  },
};
