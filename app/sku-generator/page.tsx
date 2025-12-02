'use client';

import React, { useState } from 'react';

export default function SkuGenerator() {
  // Inputs
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [separator, setSeparator] = useState('-');
  
  // Bulk Mode
  const [generatedSku, setGeneratedSku] = useState('');
  const [skuHistory, setSkuHistory] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  const generate = () => {
    // Basic Validation
    if (!brand || !category) {
      alert("Please enter at least Brand and Category.");
      return;
    }

    // Clean inputs: Uppercase, remove spaces
    const clean = (text: string) => text.trim().toUpperCase().replace(/\s+/g, '');
    
    const parts = [
      clean(brand).substring(0, 4), // Take first 4 letters of Brand
      clean(category),
      clean(color),
      clean(size)
    ].filter(p => p.length > 0); // Remove empty parts

    const result = parts.join(separator);
    setGeneratedSku(result);
    
    // Add to history
    setSkuHistory([result, ...skuHistory]);
  };

  const clear = () => {
    setBrand('');
    setCategory('');
    setColor('');
    setSize('');
    setGeneratedSku('');
  };

  const copySku = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Smart SKU Generator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create standardized Stock Keeping Units (SKUs) for your inventory.
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
              <p><strong>1. Enter Details:</strong> Fill in the Brand, Category (e.g., Shirt), Color, and Size.</p>
              <p><strong>2. Auto-Formatting:</strong> The tool automatically converts text to UPPERCASE and removes spaces.</p>
              <p><strong>3. Brand Shortening:</strong> It intelligently takes only the first 4 letters of your Brand to save space (e.g., "NIKE" -> "NIKE").</p>
              <p><strong>4. Generate:</strong> Click the button to create your unique code.</p>
              <p><strong>Why use this?</strong> Consistent SKUs (like <code>NIKE-SHIRT-RED-L</code>) help warehouse staff find products faster than random names.</p>
            </div>
          )}
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Brand Code</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="e.g. Adidas"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Type</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="e.g. Polo"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Color</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="e.g. Red"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Size / Variant</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="e.g. XL"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Separator Style</label>
              <div className="flex space-x-4">
                <label className="flex items-center text-sm cursor-pointer">
                  <input type="radio" name="sep" className="mr-2" checked={separator === '-'} onChange={() => setSeparator('-')} />
                  Dash ( A-B-C )
                </label>
                <label className="flex items-center text-sm cursor-pointer">
                  <input type="radio" name="sep" className="mr-2" checked={separator === '_'} onChange={() => setSeparator('_')} />
                  Underscore ( A_B_C )
                </label>
                <label className="flex items-center text-sm cursor-pointer">
                  <input type="radio" name="sep" className="mr-2" checked={separator === ''} onChange={() => setSeparator('')} />
                  None ( ABC )
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={generate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform active:scale-95"
              >
                Generate SKU
              </button>
              <button 
                onClick={clear}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col space-y-6">
            
            {/* Main Result */}
            <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl text-center flex flex-col items-center justify-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Your SKU</p>
              {generatedSku ? (
                <div 
                  className="text-3xl md:text-4xl font-mono font-extrabold text-green-400 break-all cursor-pointer hover:text-green-300 transition-colors"
                  onClick={() => copySku(generatedSku)}
                  title="Click to Copy"
                >
                  {generatedSku}
                </div>
              ) : (
                <div className="text-slate-600 italic">...</div>
              )}
              {generatedSku && <p className="text-[10px] text-slate-500 mt-2">Click SKU to Copy</p>}
            </div>

            {/* History */}
            {skuHistory.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Recent SKUs</h4>
                <ul className="space-y-1">
                  {skuHistory.map((sku, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-100 shadow-sm">
                      <span className="font-mono text-gray-700">{sku}</span>
                      <button 
                        onClick={() => copySku(sku)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}