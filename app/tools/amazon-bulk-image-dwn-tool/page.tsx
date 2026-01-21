'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Upload,
  Download,
  FileText,
  AlertTriangle,
  Folder,
  CheckCircle,
  Trash2
} from 'lucide-react';

type HistoryItem = {
  id: string;
  asinCount: number;
  imageCount: number;
  time: number;
};

export default function AmazonImageTool() {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* ---------------- HISTORY LOAD ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem('amazon-image-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* ---------------- CSV UPLOAD ---------------- */
  const handleCSV = async (file: File) => {
    const text = await file.text();
    setRawData(text.replace(/,/g, '\t'));
  };

  /* ---------------- PARSE (UX ONLY) ---------------- */
  const parsed = useMemo(() => {
    const lines = rawData.trim().split('\n').filter(Boolean);

    let asinCount = 0;
    let imageCount = 0;
    let invalid = 0;

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (!parts[0] || parts.length < 2) {
        invalid++;
        return;
      }
      asinCount++;
      imageCount += parts.slice(1).filter(u => u.startsWith('http')).length;
    });

    return { asinCount, imageCount, invalid };
  }, [rawData]);

  const isBlocked =
    parsed.asinCount === 0 || parsed.imageCount === 0 || loading;

  /* ---------------- DOWNLOAD ---------------- */
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

  const insertExample = () => {
    setRawData(
`B0TEST001 https://image1.jpg https://image2.jpg
B0TEST002 https://image1.jpg https://image2.jpg https://image3.jpg`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Amazon Bulk Image Downloader</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Download Amazon product images in bulk.  
            ASIN-wise renaming. Clean ZIP output. Zero manual work.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">

          {/* INPUT HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h3 className="font-semibold">Input product data</h3>
                <p className="text-sm text-gray-500">
                  Paste ASIN-wise image links or upload Amazon export CSV
                </p>
              </div>
            </div>
            <button
              onClick={insertExample}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Show example
            </button>
          </div>

          {/* CSV */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) handleCSV(e.dataTransfer.files[0]);
            }}
            className={`border border-dashed rounded-xl p-4 flex justify-between items-center cursor-pointer ${
              dragOver ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-400'
            }`}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload or drag CSV
            </span>
            <span className="text-xs text-gray-400">.csv</span>
            <input type="file" accept=".csv" hidden onChange={e => e.target.files && handleCSV(e.target.files[0])} />
          </div>

          {/* TEXTAREA */}
          <textarea
            rows={10}
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            className="w-full rounded-xl border p-5 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="B0XXXXXXX https://image1.jpg https://image2.jpg"
          />

          {/* SMART SUMMARY */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <Summary label="ASINs" value={parsed.asinCount} />
            <Summary label="Images" value={parsed.imageCount} />
            <Summary label="Issues" value={parsed.invalid} warn />
          </div>

          {parsed.invalid > 0 && (
            <div className="flex gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              Some rows look invalid. Review input for best results.
            </div>
          )}

          {/* STRUCTURE */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="flex items-center gap-2 font-medium mb-2">
              <Folder className="w-4 h-4" /> ZIP preview
            </div>
            <pre className="text-xs text-gray-600">
{`ASIN/
 ├─ ASIN.MAIN.jpg
 ├─ ASIN.PT01.jpg
 ├─ ASIN.PT02.jpg`}
            </pre>
          </div>

          {/* PROGRESS */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* CTA */}
          <button
            disabled={isBlocked}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {success ? 'ZIP Downloaded' : loading ? 'Processing…' : 'Download Images'}
          </button>

          {/* TRUST */}
          <div className="text-xs text-gray-400 text-center space-x-3">
            <span>✔ No login required</span>
            <span>✔ No data stored</span>
            <span>✔ Secure processing</span>
          </div>
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
function Summary({ label, value, warn }: any) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
