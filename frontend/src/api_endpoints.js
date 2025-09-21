export const API_BASE = "https://jiopay-bot-main.onrender.com";

// Endpoints
export const ENDPOINTS = {
    health: `${API_BASE}/health`,
    ingest: `${API_BASE}/ingest`,
    buildIndex: `${API_BASE}/build_index`,
    loadIndex: `${API_BASE}/load_index`,
    chat: `${API_BASE}/chat`
};

// Pipeline options for ingestion
export const PIPELINES = [
    { value: "trafilatura", label: "Trafilatura (HTML)" },
    { value: "requests", label: "Requests + BeautifulSoup" },
    { value: "selenium", label: "Selenium (JavaScript)" }
];

// Embedding model options
export const EMBED_MODELS = [
    { value: "openai", label: "OpenAI" },
    { value: "e5", label: "E5 (Sentence Transformers)" },
    { value: "bge", label: "BGE (Sentence Transformers)" }
];

// Chunker options
export const CHUNKERS = [
    { value: "fixed", label: "Fixed" },
    { value: "semantic", label: "Semantic" },
    { value: "structural", label: "Structural" },
    { value: "recursive", label: "Recursive" }
];

// Example usage in your frontend code:
// import { ENDPOINTS, PIPELINES, EMBED_MODELS, CHUNKERS } from './api_endpoints.js';
// fetch(ENDPOINTS.ingest, { ... })
// Show PIPELINES, EMBED_MODELS, CHUNKERS in dropdowns/selects