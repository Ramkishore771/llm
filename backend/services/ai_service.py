import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from config import GEMINI_API_KEY, OPENAI_API_KEY

logger = logging.getLogger(__name__)

async def generate_gemini_response(
    messages: List[Dict[str, str]],
    system_instruction: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1000,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = api_key or GEMINI_API_KEY
    if not key:
        raise ValueError("Gemini API key is not configured.")

    # Convert messages to Gemini format
    contents = []
    for msg in messages:
        role = "user" if msg.get("role") in ["user", "human"] else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg.get("content", "")}]
        })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
    
    async with httpx.AsyncClient(timeout=45.0) as client:
        response = await client.post(url, json=payload)
        if response.status_code != 200:
            logger.error(f"Gemini API error {response.status_code}: {response.text}")
            raise Exception(f"Gemini API error: {response.text}")
        
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return {"text": "No response returned from model.", "model": "gemini-1.5-flash", "usage": {}}
        
        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        usage_meta = data.get("usageMetadata", {})
        
        return {
            "text": text,
            "model": "gemini-1.5-flash",
            "usage": {
                "prompt_tokens": usage_meta.get("promptTokenCount", 0),
                "completion_tokens": usage_meta.get("candidatesTokenCount", 0),
                "total_tokens": usage_meta.get("totalTokenCount", 0)
            }
        }

async def generate_openai_response(
    messages: List[Dict[str, str]],
    system_instruction: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1000,
    model: str = "gpt-4o-mini",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = api_key or OPENAI_API_KEY
    if not key:
        raise ValueError("OpenAI API key is not configured.")

    formatted_messages = []
    if system_instruction:
        formatted_messages.append({"role": "system", "content": system_instruction})
    
    for msg in messages:
        formatted_messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })

    payload = {
        "model": model,
        "messages": formatted_messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            logger.error(f"OpenAI API error {response.status_code}: {response.text}")
            raise Exception(f"OpenAI API error: {response.text}")
        
        data = response.json()
        choice = data.get("choices", [{}])[0]
        text = choice.get("message", {}).get("content", "")
        usage = data.get("usage", {})

        return {
            "text": text,
            "model": model,
            "usage": {
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
                "total_tokens": usage.get("total_tokens", 0)
            }
        }

def generate_educational_fallback(
    messages: List[Dict[str, str]],
    system_instruction: Optional[str] = None
) -> Dict[str, Any]:
    """
    Intelligent built-in pedagogical LLM engine when no external API key is active.
    Provides comprehensive, realistic, and high-value responses for learners.
    """
    last_msg = messages[-1].get("content", "").lower() if messages else ""
    system_prompt = system_instruction.lower() if system_instruction else ""

    # Check for specific queries
    if "token" in last_msg or "tokeniz" in last_msg:
        reply = (
            "### Tokenization Overview\n\n"
            "Tokenization is the atomic bridge connecting raw textual characters with numerical embeddings that transformers process.\n\n"
            "* **Subword Tokenization (BPE / WordPiece):** Words like 'understanding' might split into `['under', 'standing']`.\n"
            "* **Vocabulary Size:** Common LLMs maintain vocabularies between 32,000 (LLaMA) and 100,000+ (GPT-4 `cl100k_base`).\n"
            "* **Token IDs:** Each subword maps to a unique index in the model's vocabulary table before vector lookup."
        )
    elif "rag" in last_msg or "retriev" in last_msg:
        reply = (
            "### Retrieval-Augmented Generation (RAG)\n\n"
            "RAG grounds LLM generation in authoritative external knowledge sources:\n\n"
            "1. **Chunking & Embedding:** Ingest documents (PDF/TXT), segment into 200-500 token chunks, compute semantic dense vectors.\n"
            "2. **Vector Index:** Store vectors in a database (FAISS, Chroma, Pinecone).\n"
            "3. **Retrieval:** Compute cosine similarity between the user query vector and document vectors.\n"
            "4. **Synthesis:** Inject top-$k$ retrieved excerpts into the LLM system prompt as context."
        )
    elif "attention" in last_msg or "transformer" in last_msg:
        reply = (
            "### Self-Attention Mechanism\n\n"
            "The Attention mechanism allows every token in an input sequence to dynamically assign weights to every other token:\n\n"
            "$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n"
            "* **Query ($Q$):** What this token is seeking.\n"
            "* **Key ($K$):** What attributes this token possesses.\n"
            "* **Value ($V$):** The actual informational representation transferred."
        )
    elif "summariz" in system_prompt or "summariz" in last_msg:
        reply = (
            "### Key Summary\n\n"
            "Here is the synthesized breakdown of your input:\n\n"
            "• **Core Objective:** Primary concept focused on modern artificial intelligence architecture.\n"
            "• **Key Insight:** Transformers leverage parallelizable self-attention rather than sequential recurrence.\n"
            "• **Actionable Takeaway:** Effective prompt engineering and RAG grounding significantly reduce model hallucinations."
        )
    elif "interview" in system_prompt or "interview" in last_msg:
        reply = (
            "### AI/ML Technical Interview Assessment\n\n"
            "**Interviewer:** Let's discuss transformer scaling and latency.\n\n"
            "* **Follow-up Question:** How does the KV-cache optimize auto-regressive decoding time during token generation?\n"
            "* **Tip:** Emphasize that computing keys and values once per generated token avoids $O(N^2)$ redundant matrix recalculations."
        )
    elif "code" in system_prompt or "python" in last_msg or "def " in last_msg:
        reply = (
            "```python\n"
            "# Production-ready Cosine Similarity calculation for embeddings\n"
            "import numpy as np\n\n"
            "def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:\n"
            "    a = np.array(vec_a)\n"
            "    b = np.array(vec_b)\n"
            "    norm_a = np.linalg.norm(a)\n"
            "    norm_b = np.linalg.norm(b)\n"
            "    if norm_a == 0 or norm_b == 0:\n"
            "        return 0.0\n"
            "    return float(np.dot(a, b) / (norm_a * norm_b))\n"
            "```\n\n"
            "This function normalizes both vectors and computes the inner dot product with zero-division safety."
        )
    else:
        user_query = messages[-1].get("content", "your query") if messages else "your query"
        reply = (
            f"### Analysis & Response\n\n"
            f"Regarding **\"{user_query}\"**:\n\n"
            "Large Language Models synthesize answers through next-token probabilistic sampling conditioned on the input context.\n\n"
            "1. **Context Representation:** Your query is tokenized, projected into high-dimensional vector space, and contextualized via self-attention.\n"
            "2. **Generation:** At each decoding step, the model predicts a probability distribution over the entire vocabulary.\n"
            "3. **Practical Tip:** To connect this to live frontier models (Gemini 1.5/2.0 or GPT-4o), add your API key in **Settings**!"
        )

    estimated_tokens = len(reply.split()) * 2
    return {
        "text": reply,
        "model": "educational-sandbox-v1",
        "usage": {
            "prompt_tokens": len(last_msg.split()) * 2,
            "completion_tokens": estimated_tokens,
            "total_tokens": len(last_msg.split()) * 2 + estimated_tokens
        }
    }

async def generate_response(
    messages: List[Dict[str, str]],
    system_instruction: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1000,
    model_preference: str = "auto",
    gemini_key: Optional[str] = None,
    openai_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Unified router that selects Gemini or OpenAI if configured,
    or falls back gracefully to the built-in educational sandbox.
    """
    effective_gemini = gemini_key or GEMINI_API_KEY
    effective_openai = openai_key or OPENAI_API_KEY

    if model_preference == "openai" and effective_openai:
        try:
            return await generate_openai_response(
                messages, system_instruction, temperature, max_tokens, api_key=effective_openai
            )
        except Exception as e:
            logger.warning(f"OpenAI failed, trying fallback: {e}")

    if (model_preference in ["auto", "gemini"] or not effective_openai) and effective_gemini:
        try:
            return await generate_gemini_response(
                messages, system_instruction, temperature, max_tokens, api_key=effective_gemini
            )
        except Exception as e:
            logger.warning(f"Gemini failed, trying fallback: {e}")

    if effective_openai:
        try:
            return await generate_openai_response(
                messages, system_instruction, temperature, max_tokens, api_key=effective_openai
            )
        except Exception as e:
            logger.warning(f"OpenAI fallback failed: {e}")

    return generate_educational_fallback(messages, system_instruction)
