import React, { useState, useEffect } from 'react';
import { ENDPOINTS, EMBED_MODELS, CHUNKERS, PIPELINES } from './api_endpoints.js';
import ChatBox from './components/ChatBox';
import Citations from './components/Citations';
import ChunkViewer from './components/ChunkViewer';
import ModelSelector from './components/ModelSelector';
import { Loader2 } from 'lucide-react';

const HARDCODED_URLS = [
  "https://www.jiopay.com/",
  "https://www.jiopay.com/business",
  "https://www.jiopay.com/help",
  "https://www.jiopay.com/terms",
  "https://www.jiopay.com/privacy"
];

export default function App() {
  const [embedModel, setEmbedModel] = useState(EMBED_MODELS[0].value);
  const [chunker, setChunker] = useState(CHUNKERS[0].value);
  const [pipeline, setPipeline] = useState(PIPELINES[0].value);
  const [health, setHealth] = useState('unknown');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  // Always ingest & build index when model/chunker/pipeline changes
  useEffect(() => {
    async function runPipeline() {
      setRebuilding(true);
      try {
        await fetch(ENDPOINTS.ingest, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: HARDCODED_URLS, pipeline })
        });
        await fetch(ENDPOINTS.buildIndex, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embed_model: embedModel,
            chunker,
            urls: HARDCODED_URLS,
            pipeline
          })
        });

        await fetch(`${ENDPOINTS.loadIndex}?embed_model=${embedModel}&chunker=${chunker}`, {
          method: 'POST'
        });
      } catch (err) {
        console.error("Pipeline error:", err);
      }
      setRebuilding(false);
    }
    runPipeline();
  }, [embedModel, chunker, pipeline]);

  // Health check
  useEffect(() => {
    fetch(ENDPOINTS.health)
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(() => setHealth("error"));
  }, []);

  // Handle chat
  const handleChat = async (query) => {
    setLoading(true);
    setAnswer('');
    setCitations([]);
    setChunks([]);

    try {
      const res = await fetch(ENDPOINTS.chat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, embed_model: embedModel, top_k: 5 })
      });

      const data = await res.json();
      setAnswer(data.answer);
      setCitations(data.citations || []);

      // Deduplicate chunks by text (case-insensitive)
      const seen = new Set();
      const uniqueChunks = (data.citations || [])
        .map(c => c.chunk_text || c.snippet)
        .filter(chunk => {
          const lower = chunk.toLowerCase();
          if (seen.has(lower)) return false;
          seen.add(lower);
          return true;
        });

      setChunks(uniqueChunks);
    } catch (err) {
      console.error("Chat error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-700">⚡ JioPay RAG Chatbot</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${health === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}>
            {health === 'ok' ? 'Backend: Online' : 'Backend: Offline'}
          </span>
        </header>

        <ModelSelector
          embedModel={embedModel}
          setEmbedModel={setEmbedModel}
          chunker={chunker}
          setChunker={setChunker}
          pipeline={pipeline}
          setPipeline={setPipeline}
        />

        {rebuilding && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Rebuilding index with selected model & pipeline...</span>
          </div>
        )}

        <ChatBox onSend={handleChat} loading={loading} />

        {loading && (
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Generating answer...</span>
          </div>
        )}

        {/* Chat Answer */}
        {answer && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-blue-700 mb-2 text-lg">Answer</h2>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{answer}</p>
          </div>
        )}

        <Citations citations={citations} />

        {chunks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Retrieved Chunks ({chunks.length} unique)
            </h3>
            <ChunkViewer chunks={chunks} />
          </div>
        )}
      </div>
    </div>
  );
}
