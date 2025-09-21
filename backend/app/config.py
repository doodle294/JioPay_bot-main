import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.DATA_DIR = os.getenv("DATA_DIR", "./data")
        self.FAISS_DIR = os.getenv("FAISS_DIR", "./faiss_index")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        self.DEFAULT_PIPELINE = os.getenv("DEFAULT_PIPELINE", "trafilatura")
        self.DEFAULT_CHUNKER = os.getenv("DEFAULT_CHUNKER", "fixed")
        self.DEFAULT_EMBED_MODEL = os.getenv("DEFAULT_EMBED_MODEL", "openai")

config = Config()
