import re

def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)  # collapse whitespace
    text = re.sub(r"http\S+", "", text)  # remove URLs
    return text.strip()
