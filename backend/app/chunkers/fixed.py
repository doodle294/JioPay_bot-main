import tiktoken
import uuid

def chunk(text, chunk_size=512, overlap=64):
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    i = 0
    chunks = []
    while i < len(tokens):
        piece = tokens[i:i+chunk_size]
        chunk_text = enc.decode(piece)
        chunks.append({
            "id": str(uuid.uuid4()),
            "text": chunk_text,
        })
        i += chunk_size - overlap
    return chunks
