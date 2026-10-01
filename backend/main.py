import logging
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import CORS_ORIGINS
from services.ai_service import generate_response
from services.tokenizer_service import tokenize_text, analyze_vocabulary
from services.embedding_service import compute_embeddings_for_items
from services.rag_service import process_and_index_document, query_rag_document
from services.attention_service import compute_sentence_attention

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("llm_portal")

app = FastAPI(
    title="LLM Learning & Experimentation Portal API",
    description="Backend API powering interactive LLM experiments, RAG, tokenization, embeddings, and chat.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    system_instruction: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    model: Optional[str] = "auto"
    gemini_key: Optional[str] = None
    openai_key: Optional[str] = None

class TokenizeRequest(BaseModel):
    text: str
    encoding: Optional[str] = "cl100k_base"

class VocabularyRequest(BaseModel):
    text: str
    encoding: Optional[str] = "cl100k_base"

class EmbeddingRequest(BaseModel):
    items: List[str]
    gemini_key: Optional[str] = None

class RagQueryRequest(BaseModel):
    doc_id: str
    query: str
    top_k: Optional[int] = 3
    gemini_key: Optional[str] = None
    openai_key: Optional[str] = None

class AttentionRequest(BaseModel):
    sentence: str

class ProjectRunRequest(BaseModel):
    project_id: str
    inputs: Dict[str, Any]
    gemini_key: Optional[str] = None
    openai_key: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LLM Learning Portal API",
        "version": "1.0.0"
    }

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        dict_messages = [{"role": m.role, "content": m.content} for m in req.messages]
        result = await generate_response(
            messages=dict_messages,
            system_instruction=req.system_instruction,
            temperature=req.temperature or 0.7,
            max_tokens=req.max_tokens or 1000,
            model_preference=req.model or "auto",
            gemini_key=req.gemini_key,
            openai_key=req.openai_key
        )
        return result
    except Exception as e:
        logger.error(f"Error in /api/chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/playground/generate")
async def playground_generate(req: ChatRequest):
    try:
        dict_messages = [{"role": m.role, "content": m.content} for m in req.messages]
        result = await generate_response(
            messages=dict_messages,
            system_instruction=req.system_instruction,
            temperature=req.temperature or 0.7,
            max_tokens=req.max_tokens or 1000,
            model_preference=req.model or "auto",
            gemini_key=req.gemini_key,
            openai_key=req.openai_key
        )
        return result
    except Exception as e:
        logger.error(f"Error in /api/playground/generate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tokenize")
def tokenize_endpoint(req: TokenizeRequest):
    try:
        return tokenize_text(req.text, req.encoding or "cl100k_base")
    except Exception as e:
        logger.error(f"Error in /api/tokenize: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/vocabulary")
def vocabulary_endpoint(req: VocabularyRequest):
    try:
        return analyze_vocabulary(req.text, req.encoding or "cl100k_base")
    except Exception as e:
        logger.error(f"Error in /api/vocabulary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/embeddings")
async def embeddings_endpoint(req: EmbeddingRequest):
    try:
        return await compute_embeddings_for_items(req.items, req.gemini_key)
    except Exception as e:
        logger.error(f"Error in /api/embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag/upload")
async def rag_upload_endpoint(
    file: UploadFile = File(...),
    chunk_size: int = Form(150),
    overlap: int = Form(30)
):
    try:
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File exceeds 10MB limit.")
        
        result = process_and_index_document(
            filename=file.filename or "uploaded_document",
            content=content,
            chunk_size=chunk_size,
            overlap=overlap
        )
        return result
    except Exception as e:
        logger.error(f"Error in /api/rag/upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag/query")
async def rag_query_endpoint(req: RagQueryRequest):
    try:
        result = await query_rag_document(
            doc_id=req.doc_id,
            query=req.query,
            top_k=req.top_k or 3,
            gemini_key=req.gemini_key,
            openai_key=req.openai_key
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in /api/rag/query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/attention")
def attention_endpoint(req: AttentionRequest):
    try:
        return compute_sentence_attention(req.sentence)
    except Exception as e:
        logger.error(f"Error in /api/attention: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/run")
async def project_run_endpoint(req: ProjectRunRequest):
    try:
        project_id = req.project_id
        inputs = req.inputs
        
        # Guided project runner handlers
        if project_id == "proj_summarizer":
            text = inputs.get("text", "")
            format_type = inputs.get("format", "bullet_points")
            prompt = f"Please summarize this text using {format_type}:\n\n{text}"
            res = await generate_response(
                messages=[{"role": "user", "content": prompt}],
                system_instruction="You are an expert AI Summarizer. Extract core findings, key stats, and actionable insights concisely.",
                gemini_key=req.gemini_key,
                openai_key=req.openai_key
            )
            return {"status": "success", "output": res.get("text", "")}

        elif project_id == "proj_resume":
            resume_text = inputs.get("resume", "")
            target_job = inputs.get("job_title", "Software Engineer")
            prompt = (
                f"Analyze this resume for a {target_job} position.\n"
                f"Resume content:\n{resume_text}\n\n"
                "Provide:\n"
                "1. Overall Match Score (/100)\n"
                "2. Key Strengths\n"
                "3. Missing Critical Keywords / Technologies\n"
                "4. 3 Actionable Bullet Points to Improve"
            )
            res = await generate_response(
                messages=[{"role": "user", "content": prompt}],
                system_instruction="You are an elite Tech Recruiter and ATS Resume Evaluator.",
                gemini_key=req.gemini_key,
                openai_key=req.openai_key
            )
            return {"status": "success", "output": res.get("text", "")}

        elif project_id == "proj_study":
            topic = inputs.get("topic", "")
            level = inputs.get("level", "Undergraduate")
            prompt = f"Create a comprehensive study guide, flashcard set, and 3 practice problems for {topic} at {level} level."
            res = await generate_response(
                messages=[{"role": "user", "content": prompt}],
                system_instruction="You are an inspiring academic tutor and pedagogical AI expert.",
                gemini_key=req.gemini_key,
                openai_key=req.openai_key
            )
            return {"status": "success", "output": res.get("text", "")}

        elif project_id == "proj_interview":
            role = inputs.get("role", "AI/ML Engineer")
            topic = inputs.get("topic", "Transformer Architecture & Optimization")
            prompt = f"Conduct a technical mock interview question for a {role} candidate regarding {topic}. Ask one challenging question with expected evaluation criteria."
            res = await generate_response(
                messages=[{"role": "user", "content": prompt}],
                system_instruction="You are a Principal AI Engineer conducting a rigorous technical bar raiser interview.",
                gemini_key=req.gemini_key,
                openai_key=req.openai_key
            )
            return {"status": "success", "output": res.get("text", "")}

        else:
            prompt = str(inputs)
            res = await generate_response(
                messages=[{"role": "user", "content": prompt}],
                gemini_key=req.gemini_key,
                openai_key=req.openai_key
            )
            return {"status": "success", "output": res.get("text", "")}

    except Exception as e:
        logger.error(f"Error in /api/projects/run: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
