from typing import List, Dict, Any
import tiktoken
from collections import Counter

def get_encoding(encoding_name: str = "cl100k_base"):
    try:
        return tiktoken.get_encoding(encoding_name)
    except Exception:
        return tiktoken.get_encoding("cl100k_base")

def tokenize_text(text: str, encoding_name: str = "cl100k_base") -> Dict[str, Any]:
    if not text:
        return {
            "tokens": [],
            "token_ids": [],
            "token_count": 0,
            "character_count": 0,
            "char_per_token": 0,
            "encoding": encoding_name,
            "vocabulary_mapping": []
        }

    enc = get_encoding(encoding_name)
    token_ids = enc.encode(text)
    
    tokens = []
    vocab_mapping = []
    
    for idx, tid in enumerate(token_ids):
        try:
            token_bytes = enc.decode_single_token_bytes(tid)
            token_str = token_bytes.decode("utf-8", errors="replace")
        except Exception:
            token_str = enc.decode([tid])

        tokens.append(token_str)
        vocab_mapping.append({
            "index": idx,
            "token": token_str,
            "token_id": tid,
            "byte_length": len(token_str.encode("utf-8")),
            "is_whitespace_prefix": token_str.startswith(" "),
        })

    char_count = len(text)
    token_count = len(token_ids)
    char_per_token = round(char_count / token_count, 2) if token_count > 0 else 0

    return {
        "text": text,
        "tokens": tokens,
        "token_ids": token_ids,
        "token_count": token_count,
        "character_count": char_count,
        "char_per_token": char_per_token,
        "encoding": encoding_name,
        "vocabulary_mapping": vocab_mapping
    }

def analyze_vocabulary(text: str, encoding_name: str = "cl100k_base") -> Dict[str, Any]:
    if not text.strip():
        return {
            "total_tokens": 0,
            "unique_tokens": 0,
            "type_token_ratio": 0.0,
            "frequency_distribution": [],
            "most_frequent": [],
            "vocabulary_size": 0
        }

    enc = get_encoding(encoding_name)
    token_ids = enc.encode(text)
    total_tokens = len(token_ids)

    # Count frequencies of token IDs
    counter = Counter(token_ids)
    unique_tokens = len(counter)
    type_token_ratio = round(unique_tokens / total_tokens, 4) if total_tokens > 0 else 0

    freq_list = []
    for tid, count in counter.most_common(20):
        try:
            token_bytes = enc.decode_single_token_bytes(tid)
            token_str = token_bytes.decode("utf-8", errors="replace")
        except Exception:
            token_str = enc.decode([tid])

        percentage = round((count / total_tokens) * 100, 2)
        freq_list.append({
            "token_id": tid,
            "token": token_str,
            "count": count,
            "percentage": percentage
        })

    return {
        "total_tokens": total_tokens,
        "unique_tokens": unique_tokens,
        "type_token_ratio": type_token_ratio,
        "vocabulary_size": enc.n_vocab if hasattr(enc, "n_vocab") else 100277,
        "most_frequent": freq_list,
        "frequency_distribution": [
            {"rank": i + 1, "token": item["token"], "count": item["count"]}
            for i, item in enumerate(freq_list[:12])
        ]
    }
