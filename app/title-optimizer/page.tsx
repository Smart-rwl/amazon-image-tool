'use client';

import React, { useState } from 'react';

export default function TitleOptimizer() {
  const [title, setTitle] = useState('');
  const [showGuide, setShowGuide] = useState(false); // State for the How-To toggle
  
  // Amazon limit recommendations
  const MAX_DESKTOP = 200;
  const MAX_MOBILE = 80;

  const handleTitleCase = () => {
    // Basic Title Case: Capitalize first letter of every word
    const formatted = title.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    setTitle(formatted);
  };

  const handleUpperCase = () => {
    setTitle(title.toUpperCase());
  };

  const handleClear = () => {
    setTitle('');
  };

  const charCount = title.length;
  const wordCount = title.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  // Progress bar calculation
  const progressPercent = Math.min((charCount / MAX_DESKTOP) * 100, 100);
  let progressColor = 'bg-green-500';
  if (charCount > MAX_MOBILE && charCount <= MAX_DESKTOP) progressColor = 'bg-blue-500';
  if (charCount > MAX_DESKTOP) progressColor = 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Amazon Title Optimizer
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Format your title and check mobile visibility limits.
          </p>
        </div>

        {/* --- NEW: HOW TO USE SECTION --- */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex justify-between items-center p-4 text-blue-800 font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            <span>📖 How to Use & Amazon Guidelines</span>
            <svg className={`w-5 h-5 transition-transform ${showGuide ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          {showGuide && (
            <div className="p-4 border-t border-blue-200 text-sm text-blue-900 space-y-3 bg-blue-50/50">
              <p><strong>1. Enter your Draft:</strong> Paste your raw title in the box below.</p>
              <p><strong>2. Check Mobile Limit:</strong> Ensure your main keywords (Brand, Product Name, Size) are in the first <span className="bg-yellow-200 px-1 rounded">80 characters</span>. This is all mobile users see.</p>
              <p><strong>3. Format Correctly:</strong> Click <strong>"Convert to Title Case"</strong>. Amazon requires the first letter of every word to be capitalized.</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-blue-700 mt-2">
                <li>❌ Do not use ALL CAPS.</li>
                <li>❌ Do not use promotional phrases like "Best Seller" or "Free Shipping".</li>
                <li>❌ Do not use special characters like ~ ! ? $</li>
                <li>✅ Use numerals (e.g., "3" instead of "Three").</li>
              </ul>
            </div>
          )}
        </div>
        {/* --- END HOW TO USE SECTION --- */}

        {/* INPUT AREA */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Product Title
          </label>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg text-gray-800"
            placeholder="e.g. nike mens running shoes red size 10..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTitleCase}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded hover:bg-blue-200 transition-colors"
          >
            Convert to Title Case
          </button>
          <button
            onClick={handleUpperCase}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 transition-colors"
          >
            UPPER CASE
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors ml-auto"
          >
            Clear
          </button>
        </div>

        {/* ANALYSIS BAR */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-extrabold text-slate-700">{charCount}</span>
              <span className="text-sm text-slate-400 ml-1">chars</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-slate-600">{wordCount}</span>
              <span className="text-sm text-slate-400 ml-1">words</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${progressColor}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
            {/* Markers for Mobile and Desktop limits */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-20" style={{ left: `${(MAX_MOBILE / MAX_DESKTOP) * 100}%` }}></div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{ left: '100%' }}></div>
          </div>

          {/* LIMIT LEGEND */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            
            {/* Mobile Status */}
            <div className={`p-3 rounded border ${charCount <= MAX_MOBILE ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className="font-bold text-gray-700">Mobile View (First 80 chars)</p>
              {charCount <= MAX_MOBILE ? (
                <p className="text-green-600 text-xs">✅ Perfect! Your full title shows on mobile.</p>
              ) : (
                <p className="text-yellow-700 text-xs">⚠️ Your title gets cut off. Ensure main keywords are at the start.</p>
              )}
            </div>

            {/* Desktop Status */}
            <div className={`p-3 rounded border ${charCount <= MAX_DESKTOP ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-bold text-gray-700">Desktop Limit (200 chars)</p>
              {charCount <= MAX_DESKTOP ? (
                <p className="text-green-600 text-xs">✅ Good. Within Amazon limits.</p>
              ) : (
                <p className="text-red-700 text-xs">❌ Too Long! Amazon may suppress this listing.</p>
              )}
            </div>
          </div>

        </div>

        {/* MOBILE PREVIEW */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Mobile Search Preview</p>
          <div className="flex items-start p-3 border border-gray-200 rounded-lg shadow-sm max-w-sm">
             <div className="h-20 w-20 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
             <div>
               <p className="text-sm text-gray-900 leading-snug line-clamp-3 overflow-hidden" style={{ maxHeight: '3.6em' }}>
                 {title || "Your Product Title Will Appear Here..."}
               </p>
               <p className="text-xs text-gray-500 mt-1">₹999 <span className="text-orange-400">★★★★☆</span></p>
             </div>
          </div>
        </div>

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}