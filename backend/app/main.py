import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.schemas import IngestRequest, BuildIndexRequest, ChatRequest, ChatResponse, HealthResponse
from app.pipeline_runner import build_index as run_build_index
from app.indexer import FaissIndex
from app.retriever import retrieve
from app.generator import generate_answer

app = FastAPI()

# CORS setup
origins = [
    "https://jiopay-bot-main-1.onrender.com",  # frontend URL
    "http://localhost:5173"  # local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: serve static files if your frontend fetches any
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Global loaded index
loaded_index = None

@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "ok"}

@app.post("/ingest")
async def ingest(req: IngestRequest):
    return {"urls": req.urls, "pipeline": req.pipeline}

@app.post("/build_index")
async def build_index(req: BuildIndexRequest):
    import os
    from app.config import config
    index_path = os.path.join(config.FAISS_DIR, f"{req.embed_model}_{req.chunker}.index")
    meta_path = index_path + ".meta.json"
    if os.path.exists(index_path) and os.path.exists(meta_path):
        return {"message": "Index already exists, using cached index.", "path": index_path}
    path = run_build_index(req.urls, pipeline=req.pipeline, chunker=req.chunker, embed_model=req.embed_model)
    return {"message": "Index built", "path": path}

@app.post("/load_index")
async def load_index(embed_model: str = "openai", chunker: str = "fixed"):
    global loaded_index
    index_path = f"./faiss_index/{embed_model}_{chunker}.index"
    fi = FaissIndex(1536, index_path)
    fi.load()
    loaded_index = fi
    return {"message": f"Index loaded {embed_model}_{chunker}"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    global loaded_index
    if not loaded_index:
        return {"answer": "Index not loaded", "citations": []}
    retrieved = retrieve(req.query, loaded_index, req.embed_model, req.top_k)
    answer = generate_answer(req.query, retrieved)
    citations = [{"url": ch["url"], "snippet": ch["text"][:120]} for ch, _ in retrieved]
    return {"answer": answer, "citations": citations}


# --- Run server on Render's assigned PORT ---
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
