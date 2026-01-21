'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Upload,
  Download,
  FileText,
  AlertTriangle,
  Folder,
  CheckCircle,
  Trash2,
} from 'lucide-react';

/* ---------- TYPES ---------- */
type HistoryItem = {
  id: string;
  asinCount: number;
  imageCount: number;
  time: number;
};

type AsinPreviewItem = {
  asin: string;
  images: number;
};

export default function AmazonImageTool() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* ---------- LOAD HISTORY ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('amazon-image-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* ---------- CSV UPLOAD ---------- */
  const handleCSV = async (file: File) => {
    const text = await file.text();
    setRawData(text.replace(/,/g, '\t'));
  };

  /* ---------- PARSE ---------- */
  const parsed = useMemo(() => {
    const lines = rawData.trim().split('\n').filter(Boolean);

    let asinCount = 0;
    let imageCount = 0;
    let invalid = 0;
    const asinMap: Record<string, number> = {};

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const asin = parts[0];
      const images = parts.slice(1).filter(u => u.startsWith('http'));

      if (!asin || images.length === 0) invalid++;

      asinCount++;
      asinMap[asin] = images.length;
      imageCount += images.length;
    });

    const asinPreview: AsinPreviewItem[] = Object.entries(asinMap).map(
      ([asin, images]) => ({ asin, images })
    );

    return { asinCount, imageCount, invalid, asinPreview };
  }, [rawData]);

  const isBlocked =
    loading || parsed.asinCount === 0 || parsed.imageCount === 0;

  /* ---------- DOWNLOAD ---------- */
  const handleDownload = async () => {
    setLoading(true);
    setProgress(20);

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

    const entry: HistoryItem = {
      id: crypto.randomUUID(),
      asinCount: parsed.asinCount,
      imageCount: parsed.imageCount,
      time: Date.now(),
    };

    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('amazon-image-history', JSON.stringify(updated));

    setSuccess(true);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setSuccess(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Amazon Bulk Image Downloader</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Bulk download Amazon product images with correct ASIN-wise renaming
            and clean ZIP output.
          </p>
        </div>

        {/* WHAT / WHY / HOW */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 text-sm">

          <div>
            <h3 className="font-semibold mb-1">What does this tool do?</h3>
            <p className="text-gray-600">
              This tool downloads Amazon product images in bulk and automatically
              renames them ASIN-wise (MAIN, PT01, PT02…), then packages everything
              into a single ZIP file.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Why should sellers use this?</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Save hours of manual image downloading</li>
              <li>Avoid incorrect file naming mistakes</li>
              <li>Perfect for catalog uploads, relaunches, and audits</li>
              <li>No extensions, scripts, or technical setup required</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">How to use this tool</h3>
            <ol className="list-decimal pl-5 text-gray-600 space-y-1">
              <li>Prepare ASIN-wise image URLs (CSV or pasted text)</li>
              <li>Upload the CSV or paste data in the box</li>
              <li>Review ASIN and image count preview</li>
              <li>Click “Download Images” to get the ZIP</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Example CSV format</h3>
            <div className="bg-gray-50 rounded-lg p-3 overflow-auto">
              <pre className="text-xs text-gray-700">
{`ASIN	Image Link 1	Image Link 2	Image Link 3	Image Link 4	Image Link 5	Image Link 6	Image Link 7
B0G5LXB7H3	https://image1.jpg	https://image2.jpg	https://image3.jpg
B0G58NL8BJ	https://image1.jpg	https://image2.jpg`}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tip: CSV commas are automatically converted to tabs on upload.
            </p>
          </div>

        </div>

        {/* MAIN TOOL CARD (UNCHANGED LOGIC) */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

          {/* CSV UPLOAD */}
          <div
            onClick={() => fileInputRef.current?.click()}
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
            className={`border border-dashed rounded-xl p-4 cursor-pointer transition ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50'
                : 'hover:border-indigo-400'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Upload className="w-4 h-4" />
                Upload or drag CSV file
              </span>
              <span className="text-xs text-gray-400">.csv</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={e => {
                if (e.target.files?.[0]) {
                  handleCSV(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
          </div>

          {/* TEXTAREA */}
          <textarea
            rows={10}
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            placeholder="B0XXXXXXX https://image1.jpg https://image2.jpg"
            className="w-full rounded-xl border p-5 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* CTA */}
          <button
            disabled={isBlocked}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {success
              ? 'ZIP Downloaded'
              : loading
              ? 'Processing Images…'
              : 'Download Images'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          Free version supports up to 100 images per download.
        </p>
      </div>
    </div>
  );
}

/* ---------- SMALL ---------- */
function Summary({
  label,
  value,
  warn,
}: {
  label: string;
  value: number;
  warn?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
