'use client';

import React, { useState } from 'react';

export default function KeywordMixer() {
  // Inputs
  const [colA, setColA] = useState('');
  const [colB, setColB] = useState('');
  const [colC, setColC] = useState('');
  
  // Settings
  const [matchType, setMatchType] = useState('broad'); // broad, phrase, exact
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const generateMix = () => {
    // Split by new lines and remove empty lines
    const listA = colA.split('\n').map(s => s.trim()).filter(s => s);
    const listB = colB.split('\n').map(s => s.trim()).filter(s => s);
    const listC = colC.split('\n').map(s => s.trim()).filter(s => s);

    let results: string[] = [];

    // Logic: If a list is empty, treat it as having one empty string so loops still run
    const safeA = listA.length ? listA : [''];
    const safeB = listB.length ? listB : [''];
    const safeC = listC.length ? listC : [''];

    safeA.forEach(a => {
      safeB.forEach(b => {
        safeC.forEach(c => {
          // Combine parts with spaces
          let phrase = `${a} ${b} ${c}`.trim().replace(/\s+/g, ' ');
          
          if (phrase) {
            // Apply PPC Match Types
            if (matchType === 'phrase') phrase = `"${phrase}"`;
            if (matchType === 'exact') phrase = `[${phrase}]`;
            if (matchType === 'modified') phrase = `+${a} +${b} +${c}`.trim().replace(/\s+/g, ' ');
            
            results.push(phrase);
          }
        });
      });
    });

    setOutput(results.join('\n'));
    setCount(results.length);
  };

  const clearAll = () => {
    setColA('');
    setColB('');
    setColC('');
    setOutput('');
    setCount(0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert(`Copied ${count} keywords!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-6xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            PPC Keyword Mixer
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Combine lists of words into Broad, Phrase, or Exact match keywords for Amazon Ads.
          </p>
        </div>

        {/* --- HOW TO USE SECTION (Collapsible) --- */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex justify-between items-center p-4 text-blue-800 font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            <span>📖 How to Use This Tool</span>
            <svg className={`w-5 h-5 transition-transform ${showGuide ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          {showGuide && (
            <div className="p-4 border-t border-blue-200 text-sm text-blue-900 space-y-2 bg-blue-50/50">
              <p><strong>1. Enter Keywords:</strong> Fill columns with variations.
                 <br/><span className="text-xs text-gray-500">Ex: Col A (Red, Blue), Col B (Shoes, Sneakers), Col C (For Men, For Running).</span>
              </p>
              <p><strong>2. Choose Match Type:</strong> 
                 <ul className="list-disc list-inside ml-2 text-xs">
                   <li><strong>Broad:</strong> Just the words (Red Shoes)</li>
                   <li><strong>Phrase:</strong> Quotes ("Red Shoes") - Ads show if customer types phrase.</li>
                   <li><strong>Exact:</strong> Brackets ([Red Shoes]) - Ads show ONLY for exact match.</li>
                 </ul>
              </p>
              <p><strong>3. Generate:</strong> Click to create every possible combination instantly.</p>
              <p><strong>4. Copy:</strong> Paste directly into your Amazon PPC Campaign Manager.</p>
            </div>
          )}
        </div>

        {/* MAIN INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Column A */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Column A (Prefix)</label>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g.&#10;Nike&#10;Adidas&#10;Puma"
              value={colA}
              onChange={(e) => setColA(e.target.value)}
            />
          </div>

          {/* Column B */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Column B (Keyword)</label>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g.&#10;Shoes&#10;Sneakers&#10;Running Shoes"
              value={colB}
              onChange={(e) => setColB(e.target.value)}
            />
          </div>

          {/* Column C */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Column C (Suffix)</label>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g.&#10;Men&#10;Women&#10;Black"
              value={colC}
              onChange={(e) => setColC(e.target.value)}
            />
          </div>

          {/* CONTROLS COLUMN */}
          <div className="flex flex-col space-y-4 justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Match Type</label>
              <select 
                className="w-full p-2 border rounded bg-white shadow-sm"
                value={matchType}
                onChange={(e) => setMatchType(e.target.value)}
              >
                <option value="broad">Broad Match</option>
                <option value="phrase">"Phrase Match"</option>
                <option value="exact">[Exact Match]</option>
              </select>
            </div>

            <button 
              onClick={generateMix}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
            >
              Merge & Mix ⚡
            </button>

            <button 
              onClick={clearAll}
              className="w-full py-2 bg-white border border-gray-300 text-gray-600 font-bold rounded hover:bg-gray-100"
            >
              Clear
            </button>
          </div>

        </div>

        {/* OUTPUT AREA */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Results ({count})</h3>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className={`text-xs font-bold px-3 py-1 rounded ${!output ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'}`}
            >
              Copy to Clipboard
            </button>
          </div>
          <textarea
            readOnly
            className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-slate-50 font-mono text-sm text-gray-700 focus:outline-none"
            placeholder="Generated keywords will appear here..."
            value={output}
          />
        </div>

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}