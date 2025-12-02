'use client';

import React, { useState } from 'react';

export default function BulletBuilder() {
  // State for 5 bullet points
  const [bullets, setBullets] = useState(['', '', '', '', '']);
  const [selectedIcon, setSelectedIcon] = useState('✅');
  
  // Amazon Limit (Soft limit 200, Hard limit 500)
  const CHAR_LIMIT = 500;

  const handleUpdate = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setBullets(newBullets);
  };

  const addPrefix = () => {
    const newBullets = bullets.map(b => {
      // Avoid double adding
      if (b.startsWith(selectedIcon)) return b;
      return `${selectedIcon} ${b}`;
    });
    setBullets(newBullets);
  };

  const autoHeader = () => {
    // Looks for the first colon (:) and capitalizes everything before it
    // Example: "Battery life: long lasting" -> "BATTERY LIFE: long lasting"
    const newBullets = bullets.map(b => {
      if (b.includes(':')) {
        const parts = b.split(':');
        // Capitalize the first part and rejoin
        return parts[0].toUpperCase() + ':' + parts.slice(1).join(':');
      }
      return b;
    });
    setBullets(newBullets);
  };

  const handleCopyAll = () => {
    // Amazon bulk uploads usually need bullets in separate columns, 
    // but for Seller Central "Add a Product", you copy one by one.
    // Let's copy as a clean list for now.
    const text = bullets.filter(b => b.trim()).join('\n');
    navigator.clipboard.writeText(text);
    alert('All bullets copied to clipboard!');
  };

  const clearAll = () => {
    if(confirm("Clear all bullets?")) {
      setBullets(['', '', '', '', '']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Smart Bullet Point Builder
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Write high-converting Amazon bullet points with emojis and headers.
          </p>
        </div>

        {/* TOOLBAR */}
        <div className="bg-blue-50 p-4 rounded-lg flex flex-wrap gap-4 justify-between items-center border border-blue-100">
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-700">1. Pick Icon:</span>
            <select 
              value={selectedIcon} 
              onChange={(e) => setSelectedIcon(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            >
              <option value="✅">✅ Check</option>
              <option value="➤">➤ Arrow</option>
              <option value="⭐">⭐ Star</option>
              <option value="💎">💎 Diamond</option>
              <option value="🔥">🔥 Fire</option>
              <option value="✔">✔ Thin Check</option>
            </select>
            <button 
              onClick={addPrefix}
              className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
            >
              Add to All
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-700">2. Formatting:</span>
            <button 
              onClick={autoHeader}
              className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded hover:bg-purple-700"
              title="Capitalizes text before the colon (:)"
            >
              Auto-Capitalize Headers
            </button>
          </div>

          <button 
            onClick={clearAll}
            className="px-3 py-2 text-red-600 hover:bg-red-50 text-xs font-bold rounded"
          >
            Clear All
          </button>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          {bullets.map((text, index) => {
            const len = text.length;
            const isOver = len > CHAR_LIMIT;
            
            return (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Bullet {index + 1}</label>
                  <span className={`text-xs font-bold ${isOver ? 'text-red-600' : 'text-gray-400'}`}>
                    {len} / {CHAR_LIMIT}
                  </span>
                </div>
                <textarea
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none text-sm transition-colors ${
                    isOver 
                      ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  rows={2}
                  placeholder={`Feature ${index + 1}: Description...`}
                  value={text}
                  onChange={(e) => handleUpdate(index, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={handleCopyAll}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-transform transform active:scale-95"
          >
            Copy All to Clipboard
          </button>
        </div>

        {/* TIPS */}
        <div className="bg-yellow-50 p-4 rounded text-xs text-yellow-800 border border-yellow-200">
          <strong>Pro Tip:</strong> Use the "Auto-Capitalize Headers" button. Write like this: 
          <br/>
          <em>"Easy to clean: wipe with a cloth."</em> 
          <br/>
          Click the button and it becomes: 
          <br/>
          <em>"EASY TO CLEAN: wipe with a cloth."</em>
        </div>

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}