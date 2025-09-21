import uuid

def chunk(text):
    paras = text.split("\n\n")
    return [{"id": str(uuid.uuid4()), "text": p.strip()} for p in paras if p.strip()]
