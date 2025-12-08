'use client';

import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { 
  Printer, 
  Download, 
  Settings, 
  Barcode as BarcodeIcon, 
  Copy, 
  CheckCircle2, 
  BookOpen,
  Info,
  Package,
  Layers
} from 'lucide-react';

export default function AdvancedBarcodeGenerator() {
  // --- STATE ---
  const [value, setValue] = useState('X001234567'); // The SKU/FNSKU
  const [title, setTitle] = useState('Wireless Headphones - Noise Cancelling - Black'); // FBA Title
  const [condition, setCondition] = useState('New'); // FBA Condition
  
  // Configuration
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(1.5);
  const [height, setHeight] = useState(60);
  const [fontSize, setFontSize] = useState(12);
  const [showText, setShowText] = useState(true);
  
  // Bulk Settings
  const [quantity, setQuantity] = useState(1); // Single vs Batch
  const [layoutMode, setLayoutMode] = useState<'single' | 'sheet'>('single');

  const barcodeRef = useRef<HTMLDivElement>(null);

  // --- ACTIONS ---
  
  // 1. Print Logic
  const handlePrint = () => {
    const printContent = document.getElementById('printable-area');
    if (printContent) {
      const win = window.open('', '', 'height=800,width=800');
      if (win) {
        win.document.write('<html><head><title>Print Labels</title>');
        // Inject styles for print
        win.document.write(`
          <style>
            body { font-family: sans-serif; margin: 0; padding: 20px; }
            .label-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .label-item { border: 1px dashed #ccc; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 140px; page-break-inside: avoid; }
            .label-title { font-size: 10px; margin-bottom: 5px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .label-condition { font-size: 9px; font-weight: bold; margin-top: 2px; }
            @media print {
              .label-item { border: none; } /* Remove borders for actual printing */
            }
          </style>
        `);
        win.document.write('</head><body>');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
    }
  };

  // 2. Download SVG
  const handleDownload = () => {
    const svg = barcodeRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${value}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarcodeIcon className="w-8 h-8 text-indigo-500" />
              FBA Label Command Center
            </h1>
            <p className="text-slate-400 mt-2">
              Generate compliance-ready inventory labels for Amazon FBA & Warehousing.
            </p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border border-slate-700 transition"
             >
                <Download className="w-4 h-4" /> Download SVG
             </button>
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-indigo-900/20"
             >
                <Printer className="w-4 h-4" /> Print Labels
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIGURATION (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Data Input */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-indigo-400" /> Label Data
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Barcode Value (SKU/FNSKU)</label>
                     <div className="relative">
                        <input 
                           type="text" 
                           value={value} 
                           onChange={e => setValue(e.target.value)} 
                           className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                        />
                        {value.startsWith('X0') && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />}
                     </div>
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Product Title (Optional)</label>
                     <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g. Wireless Mouse"
                     />
                     <p className="text-[10px] text-slate-500 mt-1">Required for Amazon FBA transparency.</p>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Condition</label>
                     <select 
                        value={condition} 
                        onChange={e => setCondition(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                     >
                        <option value="New">New</option>
                        <option value="Used - Like New">Used - Like New</option>
                        <option value="Used - Good">Used - Good</option>
                     </select>
                  </div>
               </div>
            </div>

            {/* 2. Visual Settings */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-indigo-400" /> Layout & Bulk
               </h3>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Format</label>
                        <select 
                           value={format} 
                           onChange={e => setFormat(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                        >
                           <option value="CODE128">CODE128 (Auto)</option>
                           <option value="UPC">UPC</option>
                           <option value="EAN13">EAN-13</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Height</label>
                        <input 
                           type="number" 
                           value={height} 
                           onChange={e => setHeight(Number(e.target.value))} 
                           className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                        />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Print Mode</label>
                     <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button 
                           onClick={() => { setLayoutMode('single'); setQuantity(1); }}
                           className={`flex-1 py-1.5 text-xs font-medium rounded ${layoutMode === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                           Single
                        </button>
                        <button 
                           onClick={() => { setLayoutMode('sheet'); setQuantity(30); }}
                           className={`flex-1 py-1.5 text-xs font-medium rounded ${layoutMode === 'sheet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                           Sheet (30-up)
                        </button>
                     </div>
                  </div>
                  
                  {layoutMode === 'sheet' && (
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quantity</label>
                        <input 
                           type="number" 
                           value={quantity} 
                           onChange={e => setQuantity(Number(e.target.value))} 
                           className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                        />
                     </div>
                  )}

               </div>
            </div>

          </div>

          {/* --- RIGHT: PREVIEW (8 Cols) --- */}
          <div className="lg:col-span-8">
            <div className="bg-slate-200 rounded-xl border-4 border-slate-800 p-8 min-h-[500px] flex justify-center overflow-auto shadow-inner">
               
               {/* This ID is what gets grabbed by the Print Function */}
               <div id="printable-area" className="w-full max-w-[700px]">
                  
                  {layoutMode === 'single' ? (
                     // SINGLE PREVIEW
                     <div className="flex justify-center items-center h-full">
                        <div ref={barcodeRef} className="bg-white p-6 rounded shadow-xl flex flex-col items-center text-center border border-slate-300">
                           {title && <div className="text-black text-xs font-sans mb-2 max-w-[250px] leading-tight">{title}</div>}
                           <Barcode 
                              value={value}
                              format={format as any}
                              width={width}
                              height={height}
                              fontSize={fontSize}
                              displayValue={showText}
                              margin={0}
                           />
                           {condition && <div className="text-black text-[10px] font-bold uppercase mt-1">{condition}</div>}
                        </div>
                     </div>
                  ) : (
                     // SHEET PREVIEW (Grid)
                     <div className="grid grid-cols-3 gap-2 bg-white p-2 shadow-2xl">
                        {Array.from({ length: quantity }).map((_, i) => (
                           <div key={i} className="border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center text-center h-[140px]">
                              {title && <div className="text-black text-[10px] font-sans mb-1 w-full overflow-hidden text-ellipsis whitespace-nowrap">{title}</div>}
                              <Barcode 
                                 value={value}
                                 format={format as any}
                                 width={1.2} // Slightly smaller for grids
                                 height={40}
                                 fontSize={11}
                                 displayValue={showText}
                                 margin={0}
                              />
                              {condition && <div className="text-black text-[9px] font-bold uppercase mt-1">{condition}</div>}
                           </div>
                        ))}
                     </div>
                  )}

               </div>
            </div>
            <div className="text-center mt-3 text-xs text-slate-500 flex items-center justify-center gap-2">
               <Info className="w-3 h-3" />
               Preview is approximate. Print layout auto-adjusts to remove borders on actual paper.
            </div>
          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Barcode Master Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-indigo-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">When to use FNSKU?</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    If you sell on Amazon FBA, use the <b>FNSKU</b> (Starts with X00). 
                    <br/><br/>
                    Do <b>not</b> use the UPC/EAN if Amazon provides an FNSKU, otherwise, your inventory might get "commingled" with other sellers' fake products.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">FBA Compliance</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Amazon strictly requires:
                    <br/>
                    1. A scannable Barcode with white space (Quiet Zone).
                    <br/>
                    2. The human-readable Item Name.
                    <br/>
                    3. The Condition (e.g., "New").
                    <br/>
                    <b>This tool adds all of these automatically.</b>
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Copy className="w-5 h-5 text-blue-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Printing Tips</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Use <b>30-up Label Sheets</b> (Avery 5160). 
                    <br/>
                    When printing, ensure your printer scaling is set to <b>100%</b> or "Actual Size." Do not select "Fit to Page" or the barcode bars might get distorted and become unscannable.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}