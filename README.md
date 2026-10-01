# 🚀 NeuralForge: LLM Learning & Experimentation Portal

A production-quality, fully interactive web application and experimentation lab engineered for college students and beginners learning Large Language Models (LLMs).

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Python FastAPI**.

---

## 🌟 Key Features & Architecture

### 1. 📚 LLM Learning Hub (23 Structured Modules)
* **Beginner Foundations (Topics 1-5):** What is AI, What is Machine Learning, Generative AI vs Discriminative AI, What is an LLM, How LLMs Work (Autoregressive loop).
* **Core LLM Concepts (Topics 6-15):** Text Tokenization, Vocabulary, Vector Embeddings, Positional Encoding (RoPE), Transformers, Attention Mechanism, Self-Attention, Training, Pre-training, Fine-tuning & Alignment (SFT, RLHF, DPO).
* **Advanced Architecture (Topics 16-23):** Prompt Engineering, RAG (Retrieval-Augmented Generation), Vector Databases (HNSW), Function Calling, Autonomous AI Agents (ReAct), Model Evaluation (GSM8K, MMLU), Safety & Guardrails, Production Systems (Streaming & Semantic Caching).
* **Each Topic Contains:** Simple explanation, real-world industry case study, architecture diagram flow, production code snippet (copyable), interactive lab link, key takeaways, and an instant-graded mini quiz.

### 2. 🔬 Interactive Experimentation Labs
* **Tokenization Lab:** Interactive subword splitting with OpenAI's `tiktoken` (`cl100k_base`, `p50k_base`, `r50k_base`), color-coded token chips, token IDs, and full vocabulary mapping table.
* **Vocabulary Lab:** Token frequency analysis, lexical diversity (Type-Token Ratio), Zipf's Law power-law distribution chart (Recharts), and top frequent subwords.
* **Embedding Lab:** Interactive 2D semantic vector plane showing semantic clustering (Royalty, Tech, Food), pairwise Cosine Similarity heatmap matrix, and vector arithmetic ($King - Man + Woman = Queen$).
* **AI Playground:** System instruction framing, user prompt, sampling temperature slider, max tokens, prompt templates (Summarization, Explanation, Interview prep, Code gen, Text rewriting, Q&A), and token usage statistics.
* **AI Chat Assistant:** Full conversational interface with persistent multi-session history, renaming/deleting chats, markdown and syntax-highlighted code rendering, copy message, and regeneration.
* **RAG Lab:** Complete pipeline transparency: Document Upload (PDF, TXT, DOCX), text extraction, sliding window chunking, embedding generation, vector cosine similarity search (Top-K), retrieved chunk attribution, and grounded answer synthesis without hallucinations.
* **Mini LLM Visualizer:** Step-by-step animated 8-stage pipeline:
  $$\text{Text} \to \text{Tokenization} \to \text{Token IDs} \to \text{Embeddings} \to \text{Position (RoPE)} \to \text{Self-Attention} \to \text{Transformer Block} \to \text{Next Token Prediction}$$
* **Attention Visualizer:** Interactive attention explorer using sentences like *"The cat sat on the mat because it was tired"*. Word selector, dynamic weight highlights, and multi-head breakdown (Local, Syntactic, Coreference).
* **Prompt Lab:** Side-by-side live execution comparing Basic vs Improved (Role + CoT + Constraints) prompts in parallel.

### 3. 🛠️ 6 Guided AI Projects (Project Lab)
1. **Custom AI Chatbot:** Persona framing, system instructions, and multi-turn state.
2. **Document Q&A with RAG:** Chunking policies, vector retrieval, and context injection.
3. **AI Multi-Format Summarizer:** Extraction density and structured outputs.
4. **Resume & Job Fit Analyzer:** ATS scoring rubric, skill gap detection, and bullet improvements.
5. **AI Study Assistant:** Curriculum decomposition and active recall flashcards.
6. **Technical Interview Simulator:** Technical bar-raiser mock interview with follow-up probing.

### 4. 🏆 Progress & Dynamic Achievements
* Dynamic unlockable badges: **LLM Beginner**, **Tokenization Explorer**, **Prompt Engineer**, **RAG Explorer**, **AI Builder**.
* Real-time curriculum progress bar, daily streak counter, and comprehensive quiz scoring.

---

## 💻 Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti
* **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic, Tiktoken, PyPDF, Python-docx, NumPy, HTTPX
* **Database & Auth:** Firebase Authentication & Firestore (with seamless offline/demo mode fallback)
* **AI Providers:** Secure Google Gemini API, OpenAI API, and intelligent built-in pedagogical simulation engine.

---

## 🚀 Running Locally

### 1. Backend Server (FastAPI)
```bash
cd backend
py -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API documentation available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Server (Vite React)
```bash
cd frontend
npm run dev
```
Open application in browser: `http://localhost:5173/`

### 3. Production Build
```bash
cd frontend
npm run build
```
Build bundle outputs to `frontend/dist/`.
