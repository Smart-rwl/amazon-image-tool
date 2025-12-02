'use client';

import React, { useState, useEffect } from 'react';

export default function LqsChecker() {
  // Checklist States
  const [hasTitleLen, setHasTitleLen] = useState(false);
  const [hasImages, setHasImages] = useState(false);
  const [hasWhiteBg, setHasWhiteBg] = useState(false);
  const [hasBullets, setHasBullets] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const [hasBackend, setHasBackend] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [isPrime, setIsPrime] = useState(false);
  const [priceCompetitive, setPriceCompetitive] = useState(false);

  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState('F');
  const [color, setColor] = useState('text-red-600');

  useEffect(() => {
    // Weighted Scoring Logic
    let calculated = 0;
    
    if (hasTitleLen) calculated += 15; // Title is critical
    if (hasImages) calculated += 15;   // Images are critical
    if (hasWhiteBg) calculated += 5;
    if (hasBullets) calculated += 15;  // Bullets critical
    if (hasDescription) calculated += 10;
    if (hasBackend) calculated += 10;
    if (hasVideo) calculated += 10;
    if (hasReviews) calculated += 10;
    if (isPrime) calculated += 5;
    if (priceCompetitive) calculated += 5;

    setScore(calculated);

    // Determine Grade
    if (calculated >= 90) {
      setGrade('A+');
      setColor('text-green-600');
    } else if (calculated >= 80) {
      setGrade('A');
      setColor('text-green-500');
    } else if (calculated >= 70) {
      setGrade('B');
      setColor('text-blue-500');
    } else if (calculated >= 50) {
      setGrade('C');
      setColor('text-yellow-500');
    } else {
      setGrade('D');
      setColor('text-red-600');
    }

  }, [hasTitleLen, hasImages, hasWhiteBg, hasBullets, hasDescription, hasBackend, hasVideo, hasReviews, isPrime, priceCompetitive]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-5xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Listing Quality Auditor
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check off what your listing has to see your Quality Score (LQS).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: CHECKLIST (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Listing Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item 1 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasTitleLen ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasTitleLen} onChange={(e) => setHasTitleLen(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Title &gt; 150 Characters</span>
                  <span className="block text-xs text-gray-500">Long tail keywords used?</span>
                </div>
              </label>

              {/* Item 2 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasImages ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasImages} onChange={(e) => setHasImages(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">7+ Images Uploaded</span>
                  <span className="block text-xs text-gray-500">Use all available slots?</span>
                </div>
              </label>

              {/* Item 3 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasBullets ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasBullets} onChange={(e) => setHasBullets(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">5 Bullet Points</span>
                  <span className="block text-xs text-gray-500">Full feature explanation?</span>
                </div>
              </label>

              {/* Item 4 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasDescription ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasDescription} onChange={(e) => setHasDescription(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">A+ Content / Description</span>
                  <span className="block text-xs text-gray-500">Images in description?</span>
                </div>
              </label>

              {/* Item 5 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasVideo ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasVideo} onChange={(e) => setHasVideo(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Product Video</span>
                  <span className="block text-xs text-gray-500">Video uploaded?</span>
                </div>
              </label>

              {/* Item 6 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasBackend ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasBackend} onChange={(e) => setHasBackend(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Backend Search Terms</span>
                  <span className="block text-xs text-gray-500">Hidden keywords filled?</span>
                </div>
              </label>

              {/* Item 7 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasReviews ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasReviews} onChange={(e) => setHasReviews(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Rating &gt; 4.0 Stars</span>
                  <span className="block text-xs text-gray-500">Social proof?</span>
                </div>
              </label>

              {/* Item 8 */}
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${hasWhiteBg ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                <input type="checkbox" className="w-5 h-5 text-blue-600" checked={hasWhiteBg} onChange={(e) => setHasWhiteBg(e.target.checked)} />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">Main Image White BG</span>
                  <span className="block text-xs text-gray-500">Amazon compliance?</span>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT: SCORECARD */}
          <div className="flex flex-col space-y-6">
            
            <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl text-center flex flex-col items-center justify-center h-full">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Listing Score</h3>
              
              <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className={`${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} strokeDasharray={552} strokeDashoffset={552 - (552 * score) / 100} />
                </svg>
                <span className="absolute text-5xl font-extrabold">{score}</span>
              </div>

              <div className={`mt-6 text-6xl font-black ${color}`}>
                {grade}
              </div>
              <p className="text-slate-400 text-xs mt-2">Target Grade: A</p>
            </div>

            {/* Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <h4 className="font-bold text-yellow-800 text-sm mb-2">⚡ Quick Improvements:</h4>
              <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                {!hasVideo && <li>Add a product video to boost conversion by 20%.</li>}
                {!hasImages && <li>Upload at least 7 images (Lifestyle + Infographics).</li>}
                {!hasTitleLen && <li>Expand title to include more keywords (150+ chars).</li>}
                {!hasBackend && <li>Don't forget backend search terms (249 bytes)!</li>}
                {score === 100 && <li>🎉 Perfect Listing! Now focus on PPC & Ads.</li>}
              </ul>
            </div>

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}