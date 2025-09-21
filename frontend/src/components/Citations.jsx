import React, { useState } from 'react';

export default function Citations({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-4 text-gray-800 text-lg flex items-center gap-2">📚 Citations</h2>
      <div className="space-y-4">
        {citations.map((c, i) => (
          <CitationCard key={i} citation={c} index={i} />
        ))}
      </div>
    </div>
  );
}

function CitationCard({ citation, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative">
      {/* Title */}
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold hover:underline text-sm sm:text-base"
      >
        {index + 1}. {citation.title || citation.url}
      </a>

      {/* Snippet */}
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{citation.snippet}</p>

      {/* Expand/Collapse Button */}
      {citation.chunk_text && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
        >
          {expanded ? 'Hide full text ▲' : 'Show full text ▼'}
        </button>
      )}

      {/* Full Text */}
      {expanded && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm whitespace-pre-line transition-all duration-200">
          {citation.chunk_text}
        </div>
      )}
    </div>
  );
}
