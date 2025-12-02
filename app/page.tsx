'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Amazon Standard Image Variants
const IMAGE_VARIANTS = [
  { code: 'MAIN', label: 'Main Image (MAIN)' },
  { code: 'PT01', label: 'Part 1 (PT01)' },
  { code: 'PT02', label: 'Part 2 (PT02)' },
  { code: 'PT03', label: 'Part 3 (PT03)' },
  { code: 'PT04', label: 'Part 4 (PT04)' },
  { code: 'PT05', label: 'Part 5 (PT05)' },
  { code: 'PT06', label: 'Part 6 (PT06)' },
  { code: 'PT07', label: 'Part 7 (PT07)' },
  { code: 'PT08', label: 'Part 8 (PT08)' },
  { code: 'SWATCH', label: 'Swatch (SWATCH)' },
];

export default function BulkImageGenerator() {
  const [asins, setAsins] = useState<string>('');
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [suffix, setSuffix] = useState<string>('PT05'); // Default
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMasterFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    // 1. Validation
    if (!masterFile) {
      alert('Please upload a Master Image first.');
      return;
    }
    if (!asins.trim()) {
      alert('Please paste a list of ASINs.');
      return;
    }

    setIsLoading(true);
    setStatus('Initializing...');

    try {
      const zip = new JSZip();

      // 2. Parse ASIN List
      const asinList = asins
        .split(/[\n,]+/) // Split by newlines or commas
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (asinList.length === 0) {
        alert('No valid ASINs found.');
        setIsLoading(false);
        return;
      }

      setStatus(`Processing ${asinList.length} files...`);

      // 3. Add files to Zip
      // We read the uploaded file once and duplicate it inside the zip structure
      asinList.forEach((asin) => {
        // Clean the ASIN (remove spaces)
        const cleanAsin = asin.replace(/\s/g, '');
        
        // Get extension from uploaded file (usually .jpg)
        const fileExtension = masterFile.name.split('.').pop();
        
        // Construct filename: ASIN.VARIANT.jpg
        const filename = `${cleanAsin}.${suffix}.${fileExtension}`;
        
        zip.file(filename, masterFile);
      });

      // 4. Generate Zip
      setStatus('Zipping files...');
      const content = await zip.generateAsync({ type: 'blob' });

      // 5. Download
      const date = new Date().toISOString().slice(0, 10);
      saveAs(content, `amazon-bulk-${suffix}-${date}.zip`);

      setStatus('Success! Check your downloads.');
    } catch (error) {
      console.error(error);
      setStatus('Error occurred. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Amazon Bulk Image Replicator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Upload one image, apply it to hundreds of ASINs, and download a ready-to-upload ZIP.
          </p>
        </div>

        <div className="space-y-6 mt-8">
          
          {/* 1. File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Upload Master Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${masterFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {masterFile ? (
                    <>
                      <svg className="w-8 h-8 mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <p className="text-sm text-green-600 font-semibold">{masterFile.name}</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">JPG or PNG (Amazon prefers JPG)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          </div>

          {/* 2. Dropdown Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Select Image Variant Slot
            </label>
            <select
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            >
              {IMAGE_VARIANTS.map((variant) => (
                <option key={variant.code} value={variant.code}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. ASIN Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Paste ASINs (One per line)
            </label>
            <textarea
              className="w-full h-48 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900"
              placeholder="B001234567&#10;B009876543&#10;B005551234"
              value={asins}
              onChange={(e) => setAsins(e.target.value)}
            />
          </div>

          {/* 4. Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Download ZIP File'}
          </button>

          {/* Status Message */}
          {status && (
            <div className={`mt-2 text-center text-sm font-medium ${
              status.includes('Success') ? 'text-green-600' : 'text-blue-600 animate-pulse'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}