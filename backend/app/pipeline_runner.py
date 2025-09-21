import os, json
from app.ingestion import selenium_scraper
from app.ingestion import requests_bs4, trafilatura_scraper
from app.ingestion.selenium_scraper import fetch_page as selenium_fetch_page
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from app.cleaning import clean_text
from app.chunkers import fixed, semantic, structural, recursive
from app.embeddings import embed
from app.indexer import FaissIndex
from app.config import config

CHUNKERS = {"fixed": fixed.chunk, "semantic": semantic.chunk,
            "structural": structural.chunk, "recursive": recursive.chunk}
SCRAPERS = {
    "requests": requests_bs4.fetch_page,
    "trafilatura": trafilatura_scraper.fetch_page,
    "selenium": selenium_scraper.fetch_page
}

def build_index(urls, pipeline="trafilatura", chunker="fixed", embed_model="openai"):
    scraper = SCRAPERS[pipeline]
    chunk_func = CHUNKERS[chunker]

    docs = [scraper(u) for u in urls]
    for d in docs:
        d["text"] = clean_text(d["text"])

    chunks, metadata = [], []
    for d in docs:
        for ch in chunk_func(d["text"]):
            chunks.append(ch["text"])
            metadata.append({"url": d["url"], "title": d["title"], "chunk_id": ch["id"], "text": ch["text"]})

    if not chunks:
        raise ValueError("No text chunks found for embedding. The page may be empty or not properly scraped.")

    embeddings = embed(chunks, model=embed_model)
    if not embeddings:
        raise ValueError("No embeddings generated. Check your chunker and embed model.")
    dim = len(embeddings[0])
    index_path = os.path.join(config.FAISS_DIR, f"{embed_model}_{chunker}.index")

    faiss_index = FaissIndex(dim, index_path)
    faiss_index.add(embeddings, metadata)
    faiss_index.save()
    return index_path

    