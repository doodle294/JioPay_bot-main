import React from 'react';
import { EMBED_MODELS, CHUNKERS, PIPELINES } from '../api_endpoints';

export default function ModelSelector({ embedModel, setEmbedModel, chunker, setChunker, pipeline, setPipeline }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <SelectBox label="Embedding Model" value={embedModel} setValue={setEmbedModel} options={EMBED_MODELS} />
      <SelectBox label="Chunker" value={chunker} setValue={setChunker} options={CHUNKERS} />
      <SelectBox label="Pipeline" value={pipeline} setValue={setPipeline} options={PIPELINES} />
    </div>
  );
}

function SelectBox({ label, value, setValue, options }) {
  return (
    <div className="flex flex-col flex-1 min-w-[180px]">
      <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-gray-800 font-medium"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="text-gray-700">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
