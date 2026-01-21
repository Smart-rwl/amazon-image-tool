'use client';

import { useState } from 'react';

export default function AmazonImageTool() {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 📂 CSV Upload Support
  const handleCSV = async (file: File) => {
    const text = await file.text();
    setRawData(text.replace(/,/g, '\t')); // CSV → TSV
  };

  const handleDownload = async () => {
    setLoading(true);
    setProgress(10);

    const res = await fetch('/api/amazon-bulk-image-dwn-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawData }),
    });

    setProgress(70);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'amazon-images.zip';
    a.click();

    URL.revokeObjectURL(url);
    setProgress(100);

    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">
        Amazon Bulk Image Downloader
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Paste ASIN + image URLs or upload CSV. Images will be renamed and zipped.
      </p>

      {/* CSV Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={e => e.target.files && handleCSV(e.target.files[0])}
        className="mb-4 text-sm"
      />

      {/* Textarea */}
      <textarea
        rows={10}
        value={rawData}
        onChange={e => setRawData(e.target.value)}
        placeholder="ASIN<TAB>ImageURL1<TAB>ImageURL2..."
        className="w-full border rounded-lg p-3 text-sm mb-4"
      />

      {/* Progress Bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Action Button */}
      <button
        disabled={!rawData || loading}
        onClick={handleDownload}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Download Images'}
      </button>

      {/* Free Tier Notice */}
      <p className="text-xs text-gray-400 mt-4">
        Free version supports up to 100 images per download.
      </p>
    </div>
  );
}
