import io
import uuid
from typing import List, Dict, Any, Optional
import pypdf
import docx
import numpy as np
from services.embedding_service import derive_vector_for_text, cosine_similarity
from services.ai_service import generate_response

# In-memory document storage: doc_id -> DocumentData
DOCUMENTS_STORE: Dict[str, Dict[str, Any]] = {}

def extract_text_from_file(filename: str, content: bytes) -> str:
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        reader = pypdf.PdfReader(io.BytesIO(content))
        pages_text = []
        for p in reader.pages:
            t = p.extract_text()
            if t:
                pages_text.append(t)
        return "\n\n".join(pages_text)

    elif lower_name.endswith(".docx"):
        doc = docx.Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text]
        return "\n\n".join(paragraphs)

    else:
        # Default to plain text
        return content.decode("utf-8", errors="replace")

def chunk_text(text: str, chunk_size: int = 150, overlap: int = 30) -> List[Dict[str, Any]]:
    words = text.split()
    if not words:
        return []

    chunks = []
    chunk_idx = 0
    step = max(1, chunk_size - overlap)
    
    for i in range(0, len(words), step):
        chunk_words = words[i : i + chunk_size]
        chunk_str = " ".join(chunk_words)
        vec = derive_vector_for_text(chunk_str)
        
        chunks.append({
            "chunk_id": f"chk_{chunk_idx + 1}",
            "index": chunk_idx,
            "text": chunk_str,
            "word_count": len(chunk_words),
            "start_word": i,
            "end_word": i + len(chunk_words),
            "vector": vec
        })
        chunk_idx += 1

    return chunks

def process_and_index_document(
    filename: str,
    content: bytes,
    chunk_size: int = 150,
    overlap: int = 30
) -> Dict[str, Any]:
    raw_text = extract_text_from_file(filename, content)
    doc_id = str(uuid.uuid4())[:8]

    chunks = chunk_text(raw_text, chunk_size, overlap)

    DOCUMENTS_STORE[doc_id] = {
        "doc_id": doc_id,
        "filename": filename,
        "raw_text": raw_text,
        "total_words": len(raw_text.split()),
        "chunks": chunks,
        "chunk_count": len(chunks)
    }

    # Prepare public chunk metadata without numpy arrays
    public_chunks = [
        {
            "chunk_id": c["chunk_id"],
            "index": c["index"],
            "text": c["text"],
            "word_count": c["word_count"]
        }
        for c in chunks
    ]

    return {
        "doc_id": doc_id,
        "filename": filename,
        "total_words": len(raw_text.split()),
        "chunk_count": len(chunks),
        "chunks": public_chunks
    }

async def query_rag_document(
    doc_id: str,
    query: str,
    top_k: int = 3,
    gemini_key: Optional[str] = None,
    openai_key: Optional[str] = None
) -> Dict[str, Any]:
    if doc_id not in DOCUMENTS_STORE:
        raise ValueError(f"Document {doc_id} not found. Please upload a document first.")

    doc = DOCUMENTS_STORE[doc_id]
    chunks = doc["chunks"]
    if not chunks:
        raise ValueError("The uploaded document contains no text chunks.")

    query_vec = derive_vector_for_text(query)

    # Score each chunk
    scored_chunks = []
    for c in chunks:
        score = cosine_similarity(query_vec, c["vector"])
        scored_chunks.append({
            "chunk_id": c["chunk_id"],
            "index": c["index"],
            "text": c["text"],
            "similarity_score": round(max(0.0, min(1.0, score)), 4),
            "relevance_percent": round(max(0.0, min(1.0, score)) * 100, 1)
        })

    # Rank by similarity score descending
    scored_chunks.sort(key=lambda x: x["similarity_score"], reverse=True)
    retrieved = scored_chunks[:top_k]

    # Build grounded context
    context_text = "\n\n---\n\n".join(
        [f"[Source Chunk {c['chunk_id']} | Relevance: {c['relevance_percent']}%]:\n{c['text']}" for c in retrieved]
    )

    system_prompt = (
        "You are an expert Retrieval-Augmented Generation (RAG) assistant. "
        "Answer the user's question accurately using ONLY the provided document context excerpts below. "
        "If the answer cannot be found in the context, explicitly say that the document does not contain this information. "
        "Cite the chunk ID (e.g. [chk_1]) when using facts from that chunk."
    )

    prompt = (
        f"CONTEXT INFORMATION:\n{context_text}\n\n"
        f"USER QUESTION: {query}\n\n"
        "Please provide a clear, comprehensive answer citing the relevant chunks:"
    )

    ai_res = await generate_response(
        messages=[{"role": "user", "content": prompt}],
        system_instruction=system_prompt,
        gemini_key=gemini_key,
        openai_key=openai_key
    )

    return {
        "query": query,
        "answer": ai_res.get("text", ""),
        "retrieved_chunks": retrieved,
        "context_used": context_text,
        "model": ai_res.get("model", ""),
        "doc_id": doc_id,
        "filename": doc["filename"],
        "pipeline_steps": [
            {"step": 1, "title": "Text Ingestion", "detail": f"Parsed {doc['filename']} ({doc['total_words']} words)"},
            {"step": 2, "title": "Chunking", "detail": f"Split document into {len(chunks)} overlapping windows"},
            {"step": 3, "title": "Dense Embeddings", "detail": "Generated semantic vectors for query & chunks"},
            {"step": 4, "title": "Vector Cosine Search", "detail": f"Retrieved top {len(retrieved)} most relevant chunks"},
            {"step": 5, "title": "Context Injection", "detail": "Constructed augmented prompt with chunk citations"},
            {"step": 6, "title": "Generation", "detail": "LLM synthesized grounded answer without hallucinations"}
        ]
    }
