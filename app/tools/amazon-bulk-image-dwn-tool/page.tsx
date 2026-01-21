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

  /* ---------- LOAD HISTORY (Local first, Supabase later) ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('amazon-image-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* ---------- CSV UPLOAD ---------- */
  const handleCSV = async (file: File) => {
    const text = await file.text();
    setRawData(text.replace(/,/g, '\t'));
  };

  /* ---------- PARSE & PREVIEW ---------- */
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

      if (!asin || images.length === 0) {
        invalid++;
      }

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

    /* 🔜 SUPABASE (OPTIONAL – SAFE TO ADD LATER)
       await supabase.from('image_download_history').insert({
         asin_count: parsed.asinCount,
         image_count: parsed.imageCount,
       });
    */

    setSuccess(true);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setSuccess(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Amazon Bulk Image Downloader</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Built for sellers who manage large catalogs.
            Download, rename, and organize Amazon images in minutes.
          </p>
        </div>

        {/* MAIN CARD */}
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

          {/* SUMMARY */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <Summary label="ASINs" value={parsed.asinCount} />
            <Summary label="Images" value={parsed.imageCount} />
            <Summary label="Issues" value={parsed.invalid} warn />
          </div>

          {/* PER-ASIN PREVIEW */}
          {parsed.asinPreview.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Detected ASINs</p>
              <div className="max-h-40 overflow-auto space-y-1">
                {parsed.asinPreview.slice(0, 20).map(item => (
                  <div
                    key={item.asin}
                    className={`flex justify-between px-2 py-1 rounded ${
                      item.images === 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-white'
                    }`}
                  >
                    <span className="font-mono">{item.asin}</span>
                    <span>{item.images} images</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

        {/* HISTORY */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Download history</h3>
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('amazon-image-history');
                }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="flex justify-between text-sm border rounded-lg p-3">
                  <div>
                    <p className="font-medium">
                      {h.asinCount} ASINs · {h.imageCount} images
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.time).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                </div>
              ))}
            </div>
          </div>
        )}

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
