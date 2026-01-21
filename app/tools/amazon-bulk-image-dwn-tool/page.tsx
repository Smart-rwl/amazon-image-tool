'use client';

import { useState, useMemo } from 'react';
import {
  Upload,
  Download,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Folder
} from 'lucide-react';

export default function AmazonImageTool() {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  /* ---------- CSV Upload ---------- */
  const handleCSV = async (file: File) => {
    const text = await file.text();
    setRawData(text.replace(/,/g, '\t'));
  };

  /* ---------- LIVE PARSE (UX ONLY) ---------- */
  const parsed = useMemo(() => {
    const lines = rawData.trim().split('\n').filter(Boolean);

    let asinCount = 0;
    let imageCount = 0;
    let invalidLines = 0;

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (!parts[0] || parts.length < 2) {
        invalidLines++;
        return;
      }

      asinCount++;
      parts.slice(1).forEach(u => {
        if (u.startsWith('http')) imageCount++;
      });
    });

    return { asinCount, imageCount, invalidLines };
  }, [rawData]);

  /* ---------- DOWNLOAD ---------- */
  const handleDownload = async () => {
    setLoading(true);
    setProgress(15);

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
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Amazon Bulk Image Downloader</h1>
          <p className="text-gray-500 mt-2">
            Paste ASIN + image URLs or upload CSV. Images are renamed and zipped.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

          {/* STEP 1 */}
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold">Input Product Data</h3>
              <p className="text-sm text-gray-500">
                ASIN followed by image URLs (space or tab separated)
              </p>
            </div>
          </div>

          {/* DRAG & DROP CSV */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) {
                handleCSV(e.dataTransfer.files[0]);
              }
            }}
            className={`border border-dashed rounded-xl p-4 flex items-center justify-between cursor-pointer transition ${
              dragOver ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Upload or drag CSV file</span>
            </div>
            <span className="text-xs text-gray-400">.csv</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => e.target.files && handleCSV(e.target.files[0])}
            />
          </div>

          {/* TEXTAREA */}
          <textarea
            rows={10}
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            placeholder="B0XXXXXXX https://image1.jpg https://image2.jpg"
            className="w-full rounded-xl border p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* LIVE PREVIEW */}
          {rawData && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat label="ASINs" value={parsed.asinCount} />
              <Stat label="Images" value={parsed.imageCount} />
              <Stat label="Issues" value={parsed.invalidLines} warn />
            </div>
          )}

          {/* ERROR BOX */}
          {parsed.invalidLines > 0 && (
            <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              Some rows look invalid. Download will continue, but review input.
            </div>
          )}

          {/* STRUCTURE PREVIEW */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="flex items-center gap-2 font-medium mb-2">
              <Folder className="w-4 h-4" /> ZIP Structure Preview
            </div>
            <pre className="text-xs text-gray-600">
{`B0XXXXXXX/
 ├─ B0XXXXXXX.MAIN.jpg
 ├─ B0XXXXXXX.PT01.jpg
 ├─ B0XXXXXXX.PT02.jpg`}
            </pre>
          </div>

          {/* PROGRESS */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* ACTION */}
          <button
            disabled={!rawData || loading}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Processing Images…' : 'Download Images'}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400">
          Free version supports up to 100 images per download.
        </p>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENT ---------- */
function Stat({ label, value, warn }: any) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
