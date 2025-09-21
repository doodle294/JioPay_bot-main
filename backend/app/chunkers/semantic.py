import re
import uuid

def chunk(text, min_len=200):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks, cur = [], ""
    for s in sentences:
        if len(cur) + len(s) > min_len:
            chunks.append({"id": str(uuid.uuid4()), "text": cur.strip()})
            cur = s
        else:
            cur += " " + s
    if cur.strip():
        chunks.append({"id": str(uuid.uuid4()), "text": cur.strip()})
    return chunks
