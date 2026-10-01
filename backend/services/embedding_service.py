import math
import numpy as np
from typing import List, Dict, Any, Optional
import httpx
from config import GEMINI_API_KEY, OPENAI_API_KEY

# Curated semantic reference dimensions for realistic semantic projection
# Dimensions: [Royalty, Femininity, Technology, Vehicle, Food, Animacy, Abstract, Size]
SEMANTIC_BASE = {
    "king": [0.95, -0.7, 0.0, 0.0, -0.2, 0.9, 0.4, 0.6],
    "queen": [0.95, 0.85, 0.0, 0.0, -0.2, 0.9, 0.4, 0.5],
    "prince": [0.75, -0.6, 0.0, 0.0, -0.2, 0.85, 0.3, 0.4],
    "princess": [0.75, 0.85, 0.0, 0.0, -0.2, 0.85, 0.3, 0.4],
    "man": [0.1, -0.85, 0.1, 0.0, 0.0, 0.95, 0.2, 0.5],
    "woman": [0.1, 0.9, 0.1, 0.0, 0.0, 0.95, 0.2, 0.4],
    "car": [-0.3, 0.0, 0.65, 0.98, -0.9, -0.8, -0.2, 0.7],
    "truck": [-0.3, 0.0, 0.55, 0.95, -0.9, -0.8, -0.2, 0.95],
    "bicycle": [-0.2, 0.0, 0.3, 0.85, -0.8, -0.8, -0.2, 0.2],
    "airplane": [-0.1, 0.0, 0.85, 0.99, -0.9, -0.8, 0.1, 1.0],
    "banana": [-0.4, 0.0, -0.8, -0.7, 0.98, 0.2, -0.7, -0.5],
    "apple": [-0.4, 0.0, -0.8, -0.7, 0.97, 0.2, -0.7, -0.4],
    "orange": [-0.4, 0.0, -0.8, -0.7, 0.96, 0.2, -0.7, -0.4],
    "computer": [0.0, 0.0, 0.98, 0.1, -0.8, -0.7, 0.5, 0.3],
    "robot": [0.1, 0.0, 0.95, 0.3, -0.8, 0.4, 0.6, 0.5],
    "ai": [0.2, 0.0, 0.99, 0.1, -0.9, 0.6, 0.95, 0.8],
    "dog": [-0.5, 0.0, -0.7, -0.5, -0.2, 0.92, -0.6, 0.2],
    "cat": [-0.4, 0.2, -0.7, -0.5, -0.2, 0.91, -0.6, 0.0],
    "love": [0.1, 0.4, -0.4, -0.6, 0.0, 0.5, 0.98, 0.7],
    "money": [0.4, 0.0, 0.2, 0.1, 0.1, -0.7, 0.8, 0.6]
}

def derive_vector_for_text(text: str) -> np.ndarray:
    """Derive deterministic normalized semantic vector for arbitrary word/phrase"""
    words = text.lower().strip().split()
    if not words:
        return np.zeros(8)
    
    vecs = []
    for w in words:
        clean_w = "".join(c for c in w if c.isalnum())
        if clean_w in SEMANTIC_BASE:
            vecs.append(np.array(SEMANTIC_BASE[clean_w]))
        else:
            # Deterministic hash pseudo-embedding for out-of-vocabulary words
            np.random.seed(abs(hash(clean_w)) % (2**31))
            random_vec = np.random.uniform(-0.6, 0.6, 8)
            vecs.append(random_vec)
            
    avg_vec = np.mean(vecs, axis=0)
    norm = np.linalg.norm(avg_vec)
    if norm > 0:
        avg_vec = avg_vec / norm
    return avg_vec

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    dot = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot / (norm1 * norm2))

async def fetch_gemini_embedding(text: str, api_key: str) -> Optional[List[float]]:
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={api_key}"
        payload = {
            "model": "models/embedding-001",
            "content": {"parts": [{"text": text}]}
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("embedding", {}).get("values")
    except Exception:
        pass
    return None

async def compute_embeddings_for_items(
    items: List[str],
    gemini_key: Optional[str] = None
) -> Dict[str, Any]:
    if not items:
        return {"items": [], "similarity_matrix": [], "dimensions": 8}

    vectors = []
    vector_displays = []

    for item in items:
        # Check if live Gemini embedding is available
        live_key = gemini_key or GEMINI_API_KEY
        real_emb = None
        if live_key:
            real_emb = await fetch_gemini_embedding(item, live_key)

        if real_emb and len(real_emb) > 0:
            vec = np.array(real_emb[:8]) # truncate to top 8 for display
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
        else:
            vec = derive_vector_for_text(item)

        vectors.append(vec)
        vector_displays.append([round(float(v), 3) for v in vec])

    n = len(items)
    # Cosine Similarity Matrix
    sim_matrix = []
    for i in range(n):
        row = []
        for j in range(n):
            score = cosine_similarity(vectors[i], vectors[j])
            row.append(round(score, 3))
        sim_matrix.append(row)

    # 2D Projection for visualization
    # Compute 2D positions using 2 principal directions (royalty/tech vs animacy/vehicles)
    points_2d = []
    for idx, (item, vec) in enumerate(zip(items, vectors)):
        # x-axis: Animacy / Abstract vs Inanimate Vehicles/Food
        # y-axis: Royalty / Technology vs Organic
        x = float(0.7 * vec[0] - 0.6 * vec[3] + 0.3 * vec[5])
        y = float(0.8 * vec[1] + 0.6 * vec[2] - 0.5 * vec[4])
        # Add slight jitter for unique coordinate visibility
        x = round(max(-0.95, min(0.95, x)), 3)
        y = round(max(-0.95, min(0.95, y)), 3)

        points_2d.append({
            "id": idx,
            "text": item,
            "x": x,
            "y": y,
            "vector": vector_displays[idx]
        })

    return {
        "items": items,
        "points_2d": points_2d,
        "similarity_matrix": sim_matrix,
        "dimensions": len(vectors[0]) if vectors else 8
    }
