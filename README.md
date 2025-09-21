# JioPay Bot

A full-stack RAG (Retrieval-Augmented Generation) chatbot for JioPay documentation and support, featuring a FastAPI backend with local/remote embedding support and a modern React + Vite frontend.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Backend](#backend)
  - [Setup](#backend-setup)
  - [API Endpoints](#api-endpoints)
  - [Indexing Pipeline](#indexing-pipeline)
  - [Embeddings](#embeddings)
  - [Chunking Strategies](#chunking-strategies)
  - [Retrieval & Generation](#retrieval--generation)
- [Frontend](#frontend)
  - [Setup](#frontend-setup)
  - [Key Components](#key-components)
- [Configuration](#configuration)
- [Extending](#extending)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **RAG Chatbot**: Answers user queries using context from indexed documentation.
- **Multiple Embedding Models**: Supports OpenAI, BGE (HuggingFace), and local E5 embeddings.
- **Flexible Chunking**: Fixed, semantic, structural, and recursive chunkers.
- **Web Scraping**: Ingests content via Requests+BeautifulSoup, Trafilatura, or Selenium.
- **FAISS Vector Search**: Fast, scalable similarity search.
- **Modern React Frontend**: Vite-powered, Tailwind CSS, and component-based UI.

---

## Architecture Overview

```
User ──> React Frontend ──> FastAPI Backend ──> Indexing/Retrieval/LLM ──> Response
```

- **Frontend**: React app for chat, model selection, and viewing citations.
- **Backend**: FastAPI app for ingestion, indexing, retrieval, and answer generation.
- **Storage**: FAISS indexes and metadata stored on disk.

---

## Backend

### Backend Setup

1. **Install Python dependencies:**
	```sh
	cd backend
	pip install -r requirements.txt
	pip install torch transformers  # For local E5 embeddings
	```

2. **Set environment variables:**
	- Create a `.env` file in `backend/` with:
	  ```
	  DATA_DIR=./data
      FAISS_DIR=./faiss_index

      # API Keys (keep secret!)
      OPENAI_API_KEY=
      GEMINI_API_KEY=
      HF_API_KEY=

      # Default Pipeline/Model Configs
      DEFAULT_PIPELINE=trafilatura
      DEFAULT_CHUNKER=fixed
      DEFAULT_EMBED_MODEL=openai

      # Optional: Logging or Debug Flags
      DEBUG=true
	  ```

3. **Run the backend server:**
	```sh
	python3 -m uvicorn app.main:app --reload --port 8000
	```

### API Endpoints

- `POST /ingest`: Accepts URLs and pipeline type for ingestion.
- `POST /build_index`: Builds or loads a FAISS index for given URLs, chunker, and embedding model.
- `POST /load_index`: Loads an existing FAISS index into memory.
- `POST /chat`: Answers a user query using the loaded index and selected embedding model.
- `GET /health`: Health check endpoint.

### Indexing Pipeline

1. **Ingestion**: Scrapes web pages using Requests+BS4, Trafilatura, or Selenium.
2. **Cleaning**: Cleans and normalizes text.
3. **Chunking**: Splits text into chunks using one of four strategies:
	- `fixed`: Token-based, overlapping chunks.
	- `semantic`: Sentence-based, minimum length.
	- `structural`: Paragraph-based.
	- `recursive`: Hierarchical splitting by length.
4. **Embedding**: Converts chunks to vectors using OpenAI, BGE, or local E5.
5. **Indexing**: Stores vectors and metadata in a FAISS index.

### Embeddings

- **OpenAI**: Uses `text-embedding-3-small` via API.
- **BGE**: Uses HuggingFace Inference API.
- **E5**: Uses a local model via `transformers` and `torch` (no API calls).

### Chunking Strategies

- See `backend/app/chunkers/` for implementations.
- Each chunker returns a list of dicts: `{id, text}`.

### Retrieval & Generation

- **Retrieval**: Embeds the query, searches FAISS for top-k similar chunks.
- **Generation**: Uses OpenAI GPT-4o-mini to generate an answer, citing retrieved chunks.

---

## Frontend

### Frontend Setup

1. **Install dependencies:**
	```sh
	cd frontend
	npm install
	```

2. **Run the frontend:**
	```sh
	npm run dev
	```

3. **Access the app:**  
	Open [http://localhost:5173](http://localhost:5173) (or as shown in terminal).

### Key Components

- `App.jsx`: Main app shell.
- `ChatBox.jsx`: Chat UI and message handling.
- `ModelSelector.jsx`: Lets user pick embedding/model/chunker.
- `ChunkViewer.jsx`: Shows retrieved chunks.
- `Citations.jsx`: Displays sources for answers.
- `api_endpoints.js`: API endpoint definitions.

---

## Configuration

- **Backend**: Set API keys and paths in `.env` or `app/config.py`.
- **Frontend**: Update API URLs in `src/api_endpoints.js` if needed.

---

## Extending

- **Add new chunkers**: Implement in `backend/app/chunkers/` and register in `pipeline_runner.py`.
- **Add new embedding models**: Extend `embed` in `embeddings.py`.
- **Add new scrapers**: Implement in `backend/app/ingestion/` and register.

---

## Troubleshooting

- **E5 Embeddings**: Requires `torch` and `transformers` installed. GPU is optional but recommended.
- **Index Not Loaded**: Call `/load_index` before `/chat`, or ensure the frontend does so.
- **CORS Issues**: Adjust `allow_origins` in `main.py`.
- **Selenium Scraper**: Needs Chrome/Chromedriver installed.

---

## License

MIT License. See `LICENSE` file for details.

---

**Contributions welcome!**  
For questions or issues, please open an issue or pull request.
