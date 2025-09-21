import uuid

def chunk(text, levels=[800, 400, 200]):
    chunks = []
    def split(txt, level=0):
        if level >= len(levels) or len(txt) <= levels[level]:
            chunks.append({"id": str(uuid.uuid4()), "text": txt})
            return
        mid = len(txt)//2
        split(txt[:mid], level+1)
        split(txt[mid:], level+1)
    split(text)
    return chunks
