import math
import numpy as np
from typing import List, Dict, Any

def compute_sentence_attention(sentence: str) -> Dict[str, Any]:
    if not sentence.strip():
        sentence = "The cat sat on the mat because it was tired"

    # Tokenize words while preserving punctuation
    raw_tokens = sentence.strip().split()
    tokens = [t.strip(".,!?;:\"'") for t in raw_tokens if t.strip()]
    if not tokens:
        tokens = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was", "tired"]

    n = len(tokens)
    lower_tokens = [t.lower() for t in tokens]

    # Compute realistic attention matrices for 3 distinct attention heads
    # Head 1: Positional & Local Context (attends to adjacent words)
    # Head 2: Syntactic & Semantic Dependency (verbs -> subjects/objects)
    # Head 3: Long-Range Coreference (pronouns -> antecedents, e.g. "it" -> "cat")

    head_1 = np.zeros((n, n)) # Local
    head_2 = np.zeros((n, n)) # Syntactic
    head_3 = np.zeros((n, n)) # Coreference

    for i in range(n):
        for j in range(n):
            dist = abs(i - j)
            # Local bias
            head_1[i, j] = math.exp(-0.7 * dist)

            # Syntactic heuristics
            t_i, t_j = lower_tokens[i], lower_tokens[j]
            score_2 = math.exp(-1.2 * dist)
            if (t_i in ["sat", "jumped", "slept", "ran"] and t_j in ["cat", "dog", "mat", "floor"]):
                score_2 += 2.5
            if (t_i in ["mat", "chair", "bed"] and t_j in ["on", "the", "sat"]):
                score_2 += 1.8
            head_2[i, j] = score_2

            # Coreference heuristics
            score_3 = 0.1
            if t_i in ["it", "he", "she", "they"]:
                if t_j in ["cat", "dog", "animal", "man", "woman", "robot"]:
                    score_3 += 3.8
                elif t_j in ["tired", "hungry", "happy", "fast"]:
                    score_3 += 2.2
            elif t_i in ["tired", "hungry", "exhausted"]:
                if t_j in ["cat", "dog", "it", "was"]:
                    score_3 += 2.9
            else:
                score_3 = math.exp(-0.9 * dist)
            head_3[i, j] = score_3

    # Softmax normalization across each row
    def softmax_rows(mat):
        res = np.zeros_like(mat)
        for i in range(len(mat)):
            exp_row = np.exp(mat[i] - np.max(mat[i]))
            res[i] = exp_row / np.sum(exp_row)
        return np.round(res, 3)

    h1_norm = softmax_rows(head_1)
    h2_norm = softmax_rows(head_2)
    h3_norm = softmax_rows(head_3)

    # Combined average attention
    avg_attention = np.round((h1_norm + h2_norm + h3_norm) / 3.0, 3)

    # Convert to JSON serializable structures
    matrix_list = avg_attention.tolist()
    
    # Detailed connections for each token
    token_connections = []
    for i, tok in enumerate(tokens):
        row = matrix_list[i]
        ranked_targets = []
        for j, weight in enumerate(row):
            if i != j and weight > 0.05:
                ranked_targets.append({
                    "target_index": j,
                    "target_token": tokens[j],
                    "weight": round(float(weight), 3)
                })
        ranked_targets.sort(key=lambda x: x["weight"], reverse=True)
        
        token_connections.append({
            "source_index": i,
            "source_token": tok,
            "self_attention": round(float(matrix_list[i][i]), 3),
            "top_connections": ranked_targets[:4]
        })

    return {
        "sentence": sentence,
        "tokens": tokens,
        "token_count": n,
        "attention_matrix": matrix_list,
        "heads": {
            "head_1_local": h1_norm.tolist(),
            "head_2_syntactic": h2_norm.tolist(),
            "head_3_coreference": h3_norm.tolist()
        },
        "token_connections": token_connections,
        "explanation": (
            "In Transformers, Self-Attention allows each token to aggregate contextual information from other tokens. "
            "Notice how 'it' assigns high attention probability to 'cat' (the entity it refers to) and 'tired' (its state)."
        )
    }
