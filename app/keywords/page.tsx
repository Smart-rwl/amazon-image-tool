'use client';

import React, { useState } from 'react';

export default function KeywordOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [byteCount, setByteCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Helper to count bytes (Amazon uses UTF-8 bytes, not just characters)
  const getByteCount = (str: string) => new Blob([str]).size;

  const handleProcess = () => {
    if (!input.trim()) return;

    // 1. Replace newlines/commas with spaces
    let clean = input.replace(/[\n,]/g, ' ');

    // 2. Remove special characters (keep only letters, numbers, spaces)
    // specific to Amazon: they ignore punctuation, so we remove it to save space
    clean = clean.replace(/[^\w\s]/gi, '');

    // 3. Lowercase & Split
    const words = clean.toLowerCase().split(/\s+/);

    // 4. Remove duplicates using a Set
    const uniqueWords = [...new Set(words)].filter((w) => w.length > 0);

    // 5. Join back together
    const finalString = uniqueWords.join(' ');

    setOutput(finalString);
    setByteCount(getByteCount(finalString));
    setCharCount(finalString.length);
    setWordCount(uniqueWords.length);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="text-center border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Amazon Backend Keyword Optimizer
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Removes duplicates, commas, and special characters. Checks the 249-byte limit.
          </p>
        </div>

        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your raw keywords here (commas, lists, etc.)
          </label>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-800 text-sm"
            placeholder="Running shoes, shoes for men, cheap running shoe, red shoes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleProcess}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
        >
          Clean & Optimize
        </button>

        {/* Output Section */}
        {output && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Optimized Result
              </label>
              
              {/* Metrics Badges */}
              <div className="flex space-x-2 text-xs font-semibold">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {wordCount} Words
                </span>
                <span className={`px-2 py-1 rounded ${
                  byteCount > 249 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {byteCount} / 249 Bytes
                </span>
              </div>
            </div>

            <textarea
              readOnly
              className={`w-full h-32 p-4 border rounded-lg focus:outline-none text-gray-800 text-sm ${
                byteCount > 249 ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
              }`}
              value={output}
            />

            {byteCount > 249 && (
              <p className="text-xs text-red-600 font-medium">
                ⚠️ Warning: You are over the Amazon 249-byte limit. Remove some words.
              </p>
            )}

            <button
              onClick={handleCopy}
              className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Result'}
            </button>
          </div>
        )}

      </div>

      {/* --- CREATOR FOOTER --- */}
      <div className="mt-8 flex flex-col items-center justify-center space-y-2">
        <p className="text-gray-500 font-medium">Created by SmartRwl</p>
        <div className="flex space-x-4">
          <a href="http://www.instagram.com/smartrwl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://github.com/Smart-rwl/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}