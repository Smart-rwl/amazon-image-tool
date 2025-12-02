'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrGenerator() {
  const [text, setText] = useState('https://www.yourbrand.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQr = () => {
    // 1. Find the canvas element inside our Ref
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      // 2. Convert to Image URL
      const image = canvas.toDataURL("image/png");
      
      // 3. Create Fake Link & Click it
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            QR Code Generator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create codes for Warranty Cards, Product Manuals, or WhatsApp Support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CONTROLS */}
          <div className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Destination URL / Text</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                rows={3}
                placeholder="https://wa.me/91999999999"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Enter a website link, WhatsApp link, or plain text.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Foreground Color</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-xs text-gray-500">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Background Color</label>
                 <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-xs text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Size (px)</label>
              <input
                type="range"
                min="128"
                max="1000"
                step="10"
                className="w-full"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
              <div className="text-right text-xs text-gray-500">{size}px</div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div 
              className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-sm"
              ref={qrRef}
            >
              <QRCodeCanvas
                value={text}
                size={size > 300 ? 300 : size} // Preview max 300px, but real download uses 'size'
                fgColor={fgColor}
                bgColor={bgColor}
                level={"H"} // High error correction
                includeMargin={true}
              />
            </div>
            
            <button
              onClick={downloadQr}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Download PNG
            </button>
            <p className="text-xs text-gray-400">
              High resolution suitable for printing.
            </p>
          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Created by SmartRwl
      </div>
    </div>
  );
}