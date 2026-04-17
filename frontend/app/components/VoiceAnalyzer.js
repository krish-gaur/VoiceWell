import React, { useState } from 'react';

export default function VoiceAnalyzer() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [habits, setHabits] = useState({ coffee: 0, water: 1.5 });

  const handleAnalysis = async (blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', blob, 'voice.wav');
    formData.append('coffee', habits.coffee);
    formData.append('water', habits.water);

    const res = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">VoiceWell AI</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <label className="block">
          Coffee (cups/day)
          <input type="number" value={habits.coffee} 
            onChange={e => setHabits({...habits, coffee: e.target.value})}
            className="w-full border p-2 rounded" />
        </label>
        <label className="block">
          Water (liters/day)
          <input type="number" step="0.5" value={habits.water} 
            onChange={e => setHabits({...habits, water: e.target.value})}
            className="w-full border p-2 rounded" />
        </label>
      </div>

      <button 
        className={`w-full py-4 rounded-full text-white font-bold transition ${recording ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        onClick={() => setRecording(!recording)}
      >
        {recording ? 'Stop & Analyze' : 'Start Voice Recording'}
      </button>

      {loading && <p className="mt-4 animate-pulse">Analyzing clinical patterns...</p>}

      {result && (
        <div className="mt-8 p-4 border-t border-blue-100">
          <h2 className="text-xl font-bold text-gray-800">Results</h2>
          <div className="flex justify-around my-4">
            <div className="text-center">
              <span className="block text-2xl font-bold">{result.metrics.jitter}%</span>
              <span className="text-sm text-gray-500">Jitter (Stability)</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">{result.metrics.shimmer}%</span>
              <span className="text-sm text-gray-500">Shimmer (Amplitude)</span>
            </div>
          </div>
          <p className="bg-blue-50 p-4 rounded-lg italic text-blue-900 leading-relaxed">
            {result.insight}
          </p>
          <a href={`http://localhost:5000${result.report_url}`} 
             className="mt-4 block text-center text-blue-600 underline">
            Download Detailed PDF Report
          </a>
        </div>
      )}
    </div>
  );
}