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
  Layers,
  Move,           // NEW
  FileText,       // NEW
  AlertOctagon,   // NEW
  CalendarClock,  // NEW
  Factory         // NEW
} from 'lucide-react';

export default function AdvancedBarcodeGenerator() {
  // --- STATE: DATA ---
  const [value, setValue] = useState('X001234567'); 
  const [title, setTitle] = useState('Wireless Headphones - Noise Cancelling - Black'); 
  const [condition, setCondition] = useState('New'); 
  
  // NEW: Strategic Data
  const [expiryDate, setExpiryDate] = useState(''); // For bundles/consumables
  const [supplierCode, setSupplierCode] = useState(''); // e.g. FAC-01

  // --- STATE: CONFIG ---
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(1.5);
  const [height, setHeight] = useState(50);
  const [fontSize, setFontSize] = useState(11);
  const [showText, setShowText] = useState(true);
  
  // --- STATE: LAYOUT & PRINT ---
  const [quantity, setQuantity] = useState(30); 
  const [layoutMode, setLayoutMode] = useState<'single' | 'sheet'>('sheet');
  
  // NEW: Advanced Print Settings
  const [pageSize, setPageSize] = useState<'a4' | 'a5' | 'letter'>('a4');
  const [gridConfig, setGridConfig] = useState({ cols: 3, rows: 10 }); // Default 30-up
  const [marginTop, setMarginTop] = useState(10); // mm
  const [marginLeft, setMarginLeft] = useState(5);  // mm
  const [gapX, setGapX] = useState(5); // mm between labels

  const barcodeRef = useRef<HTMLDivElement>(null);

  // --- LOGIC: SAFETY CHECKS ---
  const isAsin = value.startsWith('B0'); // Warning logic

  // --- ACTIONS ---

  // 1. Next-Gen Print Logic
  const handlePrint = () => {
    const printContent = document.getElementById('printable-area');
    
    // Page Dimensions
    const sizeMap = {
        a4: '210mm 297mm',
        a5: '148mm 210mm',
        letter: '8.5in 11in'
    };

    if (printContent) {
      const win = window.open('', '', 'height=900,width=800');
      if (win) {
        win.document.write('<html><head><title>FBA Print Job</title>');
        win.document.write(`
          <style>
            @page { size: ${sizeMap[pageSize]}; margin: 0; }
            body { margin: 0; padding: 0; font-family: sans-serif; }
            
            .print-container {
                padding-top: ${marginTop}mm;
                padding-left: ${marginLeft}mm;
                width: 100%;
                box-sizing: border-box;
            }

            .label-grid { 
                display: grid; 
                grid-template-columns: repeat(${gridConfig.cols}, 1fr); 
                column-gap: ${gapX}mm;
                row-gap: 5mm;
            }

            .label-item { 
                border: 1px dashed #ccc; 
                padding: 5px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                text-align: center; 
                height: 140px; 
                page-break-inside: avoid; 
                position: relative;
            }

            .label-title { 
                font-size: 10px; 
                margin-bottom: 2px; 
                max-width: 95%; 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                line-height: 1.2;
            }

            .label-meta { font-size: 9px; font-weight: bold; margin-top: 2px; }
            .label-supplier { font-size: 8px; color: #666; margin-top: 2px; }
            .label-expiry { font-size: 10px; font-weight: bold; margin-top: 2px; }

            @media print {
              .label-item { border: none; } /* Clean print */
            }
          </style>
        `);
        win.document.write('</head><body>');
        win.document.write('<div class="print-container">');
        win.document.write(printContent.innerHTML);
        win.document.write('</div>');
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
              Next-Gen FBA Label Architect
            </h1>
            <p className="text-slate-400 mt-2">
              Strategic inventory tagging with Paper Sizing, Margin Control, and Compliance Checks.
            </p>
          </div>
          <div className="flex gap-3">
             <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border border-slate-700 transition">
                <Download className="w-4 h-4" /> SVG
             </button>
             <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-indigo-900/20">
                <Printer className="w-4 h-4" /> Print PDF
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIGURATION (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Smart Data Input */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-indigo-400" /> Smart Data
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">FNSKU / SKU</label>
                     <div className="relative">
                        <input type="text" value={value} onChange={e => setValue(e.target.value)} className={`w-full bg-slate-950 border rounded p-2 text-white font-mono focus:outline-none ${isAsin ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500'}`} />
                        {value.startsWith('X0') && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />}
                     </div>
                     {isAsin && (
                         <div className="flex items-center gap-2 mt-2 text-[10px] text-red-400 bg-red-900/20 p-2 rounded">
                             <AlertOctagon className="w-3 h-3" />
                             <span><b>Warning:</b> Using ASIN (B0...) risks inventory commingling. Use FNSKU (X0...) for safety.</span>
                         </div>
                     )}
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                     <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Condition</label>
                         <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                         </select>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Expiry (Opt)</label>
                         <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                      </div>
                  </div>

                  {/* Supplier Code - Strategic Feature */}
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><Factory className="w-3 h-3" /> Supplier Code</label>
                     <input type="text" value={supplierCode} onChange={e => setSupplierCode(e.target.value)} placeholder="e.g. FAC-A1" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Prints small code to track bad batches.</p>
                  </div>
               </div>
            </div>

            {/* 2. Paper & Layout Engineering */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Move className="w-4 h-4 text-emerald-400" /> Paper Engineering
               </h3>
               
               <div className="space-y-4">
                  {/* Paper Size */}
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Paper Size</label>
                     <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {['a4', 'a5', 'letter'].map((size) => (
                            <button key={size} onClick={() => setPageSize(size as any)} className={`flex-1 py-1.5 text-xs font-medium rounded uppercase ${pageSize === size ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
                                {size}
                            </button>
                        ))}
                     </div>
                  </div>

                  {/* Grid Presets */}
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Grid Layout</label>
                     <div className="flex gap-2">
                        <button onClick={() => { setGridConfig({ cols: 3, rows: 10 }); setQuantity(30); setLayoutMode('sheet'); }} className={`flex-1 py-2 text-xs font-medium rounded border ${gridConfig.cols === 3 ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-700 text-slate-400'}`}>
                            3 x 10 (30-up)
                        </button>
                        <button onClick={() => { setGridConfig({ cols: 4, rows: 5 }); setQuantity(20); setLayoutMode('sheet'); }} className={`flex-1 py-2 text-xs font-medium rounded border ${gridConfig.cols === 4 ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-700 text-slate-400'}`}>
                            4 x 5 (20-up)
                        </button>
                     </div>
                  </div>

                  {/* Precision Margins */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Top (mm)</label>
                          <input type="number" value={marginTop} onChange={e => setMarginTop(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-center text-sm" />
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Left (mm)</label>
                          <input type="number" value={marginLeft} onChange={e => setMarginLeft(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-center text-sm" />
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Gap X (mm)</label>
                          <input type="number" value={gapX} onChange={e => setGapX(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-center text-sm" />
                      </div>
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT: LIVE PREVIEW (8 Cols) --- */}
          <div className="lg:col-span-8">
            <div className="bg-slate-200 rounded-xl border-4 border-slate-800 p-8 min-h-[600px] flex justify-center overflow-auto shadow-inner relative">
               
               {/* Paper Simulation */}
               <div 
                  className="bg-white shadow-2xl relative transition-all duration-300"
                  style={{
                      width: pageSize === 'a4' ? '210mm' : pageSize === 'a5' ? '148mm' : '215.9mm', // Letter width approx
                      minHeight: pageSize === 'a4' ? '297mm' : pageSize === 'a5' ? '210mm' : '279.4mm',
                      paddingTop: `${marginTop}mm`,
                      paddingLeft: `${marginLeft}mm`,
                      boxSizing: 'border-box' // Crucial for padding to push content inside
                  }}
               >
                   {/* Margin Guides (Visual Only) */}
                   <div className="absolute top-0 left-0 w-full border-b border-blue-400/30 text-[8px] text-blue-400" style={{ height: `${marginTop}mm` }}>Margin Top</div>
                   <div className="absolute top-0 left-0 h-full border-r border-blue-400/30" style={{ width: `${marginLeft}mm` }}></div>

                   {/* Printable Area ID */}
                   <div id="printable-area">
                       {layoutMode === 'single' ? (
                           <div ref={barcodeRef} className="border border-dashed border-gray-400 p-4 flex flex-col items-center justify-center text-center h-[150px] w-[300px]">
                               {title && <div className="text-black text-xs font-sans mb-2 leading-tight">{title}</div>}
                               <Barcode value={value} format={format as any} width={width} height={height} fontSize={fontSize} displayValue={showText} margin={0} />
                               <div className="flex justify-between w-full px-4 mt-1">
                                   {condition && <span className="text-black text-[10px] font-bold uppercase">{condition}</span>}
                                   {expiryDate && <span className="text-black text-[10px] font-bold">EXP: {expiryDate}</span>}
                               </div>
                               {supplierCode && <div className="text-gray-500 text-[8px] mt-1">{supplierCode}</div>}
                           </div>
                       ) : (
                           // GRID LAYOUT
                           <div 
                              className="grid"
                              style={{
                                  gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                                  columnGap: `${gapX}mm`,
                                  rowGap: '5mm'
                              }}
                           >
                               {Array.from({ length: quantity }).map((_, i) => (
                                   <div key={i} className="border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center text-center h-[140px] relative overflow-hidden">
                                       {title && <div className="text-black text-[10px] font-sans mb-1 w-full overflow-hidden text-ellipsis whitespace-nowrap">{title}</div>}
                                       <Barcode value={value} format={format as any} width={1.2} height={40} fontSize={11} displayValue={showText} margin={0} />
                                       <div className="flex justify-between w-full px-1 mt-1">
                                           {condition && <span className="text-black text-[9px] font-bold uppercase">{condition}</span>}
                                           {expiryDate && <span className="text-black text-[9px] font-bold">{expiryDate}</span>}
                                       </div>
                                       {supplierCode && <div className="text-gray-400 text-[7px] mt-0.5">{supplierCode}</div>}
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               </div>

            </div>
            
            <div className="flex justify-center mt-4 gap-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-3 h-3" />
                    Preview: {pageSize.toUpperCase()} Paper
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Move className="w-3 h-3" />
                    Margins Active
                </div>
            </div>
          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              FBA Labelling Strategy
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-indigo-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The Commingling Trap</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    <b>Never use ASIN (B0...) on labels.</b> Amazon treats ASIN inventory as "identical" to other sellers. If a hijacker sends fakes, Amazon might ship their fake item to your customer. Always use FNSKU (X0...) to segregate your stock.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Factory className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Supplier Codes</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Use the "Supplier Code" field (e.g., FAC-01) if you use multiple factories. If a customer complains about quality, you can check the label to identify exactly which batch or factory failed.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Copy className="w-5 h-5 text-blue-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">A4 vs US Letter</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    US factories use 8.5x11". Chinese/EU factories use A4. Mismatching paper size causes labels to drift off-center. Use the <b>Paper Size</b> toggle to match your printer exactly.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}