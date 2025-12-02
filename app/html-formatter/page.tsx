'use client';

import React, { useState } from 'react';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input) return;

    let formatted = input;

    // 1. Handle Bold: Replaces *text* with <b>text</b>
    // Example: *Great Quality* becomes <b>Great Quality</b>
    formatted = formatted.replace(/\*(.*?)\*/g, '<b>$1</b>');

    // 2. Handle Bullet Points: Lines starting with "- " become <li>...</li>
    // We also wrap them in <ul> if strictly needed, but many sellers just use simple formatting.
    // Let's stick to simple line breaks + bullet characters for safety, 
    // OR converting "- " to a bullet symbol nicely.
    // For Amazon HTML, usually <br> is key.
    
    // 3. Handle Line Breaks: Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');

    setOutput(formatted);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* HEADER */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Amazon HTML Description Formatter
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Type normally. We convert it to Amazon-compliant HTML tags.
          </p>
          <div className="mt-4 text-xs bg-blue-50 text-blue-700 p-2 rounded inline-block">
            <strong>Tip:</strong> Wrap text in *asterisks* to make it <b>bold</b>.
          </div>
        </div>

        {/* EDITOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* INPUT */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Type your description here:
            </label>
            <textarea
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm leading-relaxed"
              placeholder="Product Features:&#10;- High Quality Material&#10;- *Waterproof* Design&#10;- Easy to use"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* OUTPUT */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              HTML Result (Copy this to Amazon):
            </label>
            <textarea
              readOnly
              className="w-full h-80 p-4 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 resize-none focus:outline-none"
              value={output}
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <button
            onClick={handleFormat}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Convert to HTML
          </button>

          <button
            onClick={handleCopy}
            disabled={!output}
            className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors shadow-sm border ${
              copied
                ? 'bg-green-600 text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        Created by SmartRwl
      </div>
    </div>
  );
}