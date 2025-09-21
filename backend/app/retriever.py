from app.indexer import FaissIndex
from app.embeddings import embed

def retrieve(query, faiss_index: FaissIndex, embed_model: str, k=10):
    q_emb = embed([query], model=embed_model)[0]
    results = faiss_index.search(q_emb, k * 3)  # fetch a bit more to allow filtering

    unique = []
    seen_chunks = set()

    for meta, score in results:
        chunk_id = meta.get("chunk_id")
        if chunk_id not in seen_chunks:
            seen_chunks.add(chunk_id)
            unique.append((meta, score))
        if len(unique) >= k:
            break

    return unique
