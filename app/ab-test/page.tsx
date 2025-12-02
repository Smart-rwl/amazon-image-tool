'use client';

import React, { useState } from 'react';

export default function AbTestCalculator() {
  // Inputs
  const [visA, setVisA] = useState<number | ''>(''); // Visitors/Sessions
  const [convA, setConvA] = useState<number | ''>(''); // Conversions/Orders
  
  const [visB, setVisB] = useState<number | ''>('');
  const [convB, setConvB] = useState<number | ''>('');

  const [result, setResult] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);

  const calculate = () => {
    const n1 = Number(visA);
    const x1 = Number(convA);
    const n2 = Number(visB);
    const x2 = Number(convB);

    if (!n1 || !n2) return;

    // Conversion Rates
    const p1 = x1 / n1;
    const p2 = x2 / n2;

    // Standard Error Calculation (Z-Test for two proportions)
    // Pooled Probability
    const p = (x1 + x2) / (n1 + n2);
    const se = Math.sqrt(p * (1 - p) * ((1 / n1) + (1 / n2)));
    
    // Z-Score
    const z = Math.abs((p1 - p2) / se);

    // Confidence Level approximation from Z
    // Z=1.645 -> 90%, Z=1.96 -> 95%, Z=2.576 -> 99%
    let confidence = 0;
    if (z < 1.645) confidence = 80; // Low
    else if (z < 1.96) confidence = 90;
    else if (z < 2.576) confidence = 95;
    else confidence = 99;

    // Determine Winner
    let winner = 'Tie';
    if (p1 > p2) winner = 'A';
    if (p2 > p1) winner = 'B';

    // Lift (Percentage increase)
    const lift = p1 > 0 ? ((p2 - p1) / p1) * 100 : 0;

    setResult({
      rateA: p1 * 100,
      rateB: p2 * 100,
      confidence,
      winner,
      lift,
      isSignificant: confidence >= 90
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            A/B Split Test Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Compare two listings (A vs B) to see which one converts better.
          </p>
        </div>

        {/* --- HOW TO USE SECTION --- */}
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
              <p><strong>1. Collect Data:</strong> Run two versions of a listing (e.g., Change the Main Image for 1 week). Use "Business Reports" in Amazon Seller Central to find <strong>Sessions</strong> and <strong>Units Ordered</strong>.</p>
              <p><strong>2. Enter Version A:</strong> Your original listing data.</p>
              <p><strong>3. Enter Version B:</strong> The new version data.</p>
              <p><strong>4. Check Significance:</strong> The tool calculates if the difference is "Real" or just "Luck". Look for <strong>95% Confidence</strong> or higher.</p>
            </div>
          )}
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Version A */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-700 text-center uppercase tracking-widest border-b pb-2">Version A (Original)</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Visitors / Sessions</label>
              <input type="number" className="w-full p-2 border rounded" value={visA} onChange={e => setVisA(Number(e.target.value))} placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Orders / Conversions</label>
              <input type="number" className="w-full p-2 border rounded" value={convA} onChange={e => setConvA(Number(e.target.value))} placeholder="e.g. 25" />
            </div>
          </div>

          {/* Version B */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 space-y-4">
            <h3 className="font-bold text-blue-700 text-center uppercase tracking-widest border-b border-blue-200 pb-2">Version B (New)</h3>
            <div>
              <label className="block text-xs font-bold text-blue-500 mb-1">Visitors / Sessions</label>
              <input type="number" className="w-full p-2 border border-blue-200 rounded" value={visB} onChange={e => setVisB(Number(e.target.value))} placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-500 mb-1">Orders / Conversions</label>
              <input type="number" className="w-full p-2 border border-blue-200 rounded" value={convB} onChange={e => setConvB(Number(e.target.value))} placeholder="e.g. 35" />
            </div>
          </div>

        </div>

        <div className="flex justify-center">
          <button 
            onClick={calculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform active:scale-95"
          >
            Calculate Significance
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="animate-fade-in-up space-y-6">
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500 uppercase">Conversion Rate A</p>
                <p className="text-2xl font-bold text-gray-800">{result.rateA.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-500 uppercase">Conversion Rate B</p>
                <p className="text-2xl font-bold text-blue-800">{result.rateB.toFixed(2)}%</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl text-center text-white shadow-xl ${result.isSignificant ? 'bg-green-600' : 'bg-slate-700'}`}>
              <p className="text-sm opacity-80 uppercase tracking-widest mb-2">Test Result</p>
              
              {result.isSignificant ? (
                <>
                  <h2 className="text-4xl font-extrabold mb-2">
                    Winner: Version {result.winner}
                  </h2>
                  <p className="font-bold text-lg">
                    {result.lift > 0 ? '+' : ''}{result.lift.toFixed(1)}% Improvement
                  </p>
                  <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-bold">
                    {result.confidence >= 99 ? '99%' : '95%'} Confidence (Statistically Significant)
                  </div>
                  <p className="mt-4 text-sm opacity-90">
                    It is safe to switch to Version {result.winner} permanently.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-2">Not Significant Yet</h2>
                  <p className="text-sm opacity-80">
                    Confidence: {result.confidence > 0 ? `${result.confidence}%` : 'Low'}
                  </p>
                  <p className="mt-4 text-sm bg-white/10 p-3 rounded">
                    There isn't enough data to prove Version {result.winner} is actually better. It might be luck. Keep the test running.
                  </p>
                </>
              )}
            </div>

          </div>
        )}

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}