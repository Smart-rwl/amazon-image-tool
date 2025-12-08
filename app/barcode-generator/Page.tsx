'use client';

import React, { useState } from 'react';
import Barcode from 'react-barcode';

export default function BarcodeGenerator() {
  const [text, setText] = useState('X001234567');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // Print Function
  const handlePrint = () => {
    const printContent = document.getElementById('barcode-area');
    if (printContent) {
      const win = window.open('', '', 'height=500,width=500');
      if (win) {
        win.document.write('<html><head><title>Print Barcode</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;">');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Barcode & FNSKU Generator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Generate standard barcodes for your Amazon FBA inventory or Warehouse.
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
              <p><strong>1. Enter Data:</strong> Paste your Amazon FNSKU (starts with X0...) or your Product SKU.</p>
              <div>
                <strong>2. Select Format:</strong> 
                <ul className="list-disc list-inside ml-2">
                  <li><strong>CODE128:</strong> (Standard) Best for alphanumeric SKUs and Amazon FNSKU.</li>
                  <li><strong>UPC/EAN:</strong> Use only if you are printing official retail barcodes (Numbers only).</li>
                </ul>
              </div>
              <p><strong>3. Customize:</strong> Adjust width/height to fit your sticker paper.</p>
              <p><strong>4. Print:</strong> Click Print to open a clean window for printing on sticky labels.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CONTROLS */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Barcode Content (SKU/ASIN)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Format</label>
              <select 
                className="w-full p-2 border rounded bg-white"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="CODE128">CODE128 (Amazon Standard)</option>
                <option value="UPC">UPC (Retail)</option>
                <option value="EAN13">EAN-13 (International)</option>
                <option value="CODE39">CODE39 (Old Standard)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Bar Width</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={1} max={4}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Height</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={10} max={200}
                />
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Show Text Below Barcode</span>
            </label>

            <button
              onClick={handlePrint}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print Label
            </button>

          </div>

          {/* PREVIEW */}
          <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Live Preview</p>
            
            <div id="barcode-area" className="bg-white p-4">
              <Barcode 
                value={text}
                format={format as any} 
                width={width}
                height={height}
                displayValue={showText}
                font="monospace"
                fontSize={16}
                margin={10}
              />
            </div>

            {text.startsWith('X0') && (
               <div className="mt-6 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                 ✅ Valid FNSKU Format Detected
               </div>
            )}
          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}