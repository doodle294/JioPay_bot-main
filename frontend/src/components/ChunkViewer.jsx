import React, { useState } from 'react';
import { Search, FileText, ChevronDown, ChevronUp, Copy, Eye, Hash, Clock } from 'lucide-react';

export default function ChunkViewer({ chunks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  
  if (!chunks || chunks.length === 0) return null;

  // Filter chunks based on search term
  const filteredChunks = chunks.filter(chunk => 
    chunk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort chunks
  const sortedChunks = [...filteredChunks].sort((a, b) => {
    if (sortBy === 'length') return b.length - a.length;
    if (sortBy === 'alphabetical') return a.localeCompare(b);
    return 0; // relevance (original order)
  });

  return (
    <div className="mb-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800">Retrieved Chunks</h2>
            <p className="text-sm text-gray-500">
              Found {chunks.length} relevant text {chunks.length === 1 ? 'chunk' : 'chunks'}
            </p>
          </div>
        </div>
        
        {/* Chunk Count Badge */}
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
          {filteredChunks.length} shown
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search within chunks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="length">Sort by Length</option>
            <option value="alphabetical">Sort A-Z</option>
          </select>
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
            {filteredChunks.length === 0 ? (
              <span className="text-yellow-700">No chunks found matching "{searchTerm}"</span>
            ) : (
              <span className="text-yellow-700">
                Showing {filteredChunks.length} of {chunks.length} chunks matching "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chunks Grid */}
      <div className="grid gap-4">
        {sortedChunks.map((chunk, i) => (
          <ChunkCard 
            key={i} 
            chunk={chunk} 
            index={i} 
            searchTerm={searchTerm}
            originalIndex={chunks.indexOf(chunk)}
          />
        ))}
      </div>

      {/* No Results State */}
      {filteredChunks.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No matching chunks found</h3>
          <p className="text-sm">Try adjusting your search term or clearing the filter.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

function ChunkCard({ chunk, index, searchTerm, originalIndex }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Highlight search terms
  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chunk);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const previewText = expanded ? chunk : chunk.substring(0, 200) + (chunk.length > 200 ? '...' : '');
  const wordCount = chunk.split(' ').length;
  const charCount = chunk.length;

  return (
    <div className={`group relative border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
      expanded ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'
    }`}>
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            expanded ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
          }`}>
            <FileText size={16} className={expanded ? 'text-blue-600' : 'text-gray-600'} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Hash size={14} className="text-gray-400" />
              Chunk {originalIndex + 1}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                ~{Math.ceil(wordCount / 200)} min read
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
            title="Copy to clipboard"
          >
            <Copy size={14} />
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              expanded 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
          expanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
        }`}>
          {highlightText(previewText, searchTerm)}
        </div>

        {/* Expand/Collapse Button */}
        {chunk.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors group"
          >
            <Eye size={14} />
            <span>{expanded ? 'Show Less' : 'Show More'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}

        {/* Copied Notification */}
        {copied && (
          <div className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200 animate-fade-in">
            ✅ Copied to clipboard!
          </div>
        )}
      </div>

      {/* Relevance Score Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          #{originalIndex + 1}
        </div>
      </div>
    </div>
  );
}