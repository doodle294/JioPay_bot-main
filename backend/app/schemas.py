from pydantic import BaseModel
from typing import List, Dict, Any

class IngestRequest(BaseModel):
    urls: List[str]
    pipeline: str = "trafilatura"

class Chunk(BaseModel):
    id: str
    text: str
    url: str
    title: str
    metadata: Dict[str, Any]

class BuildIndexRequest(BaseModel):
    embed_model: str = "openai"
    chunker: str = "fixed"
    urls: List[str]
    pipeline: str = "trafilatura"  # <-- Add this line

class ChatRequest(BaseModel):
    query: str
    embed_model: str = "openai"
    top_k: int = 5

class ChatResponse(BaseModel):
    answer: str
    citations: List[Dict[str, str]]

class HealthResponse(BaseModel):
    status: str
