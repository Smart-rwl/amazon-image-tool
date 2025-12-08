'use client';

import React, { useState, useEffect } from 'react';

// Conversion factor from cm^3 to ft^3
const CM3_TO_FT3 = 28316.8; 

export default function StorageFeePlanner() {
  // Inputs
  const [lengthCm, setLengthCm] = useState<number | ''>(20);
  const [widthCm, setWidthCm] = useState<number | ''>(10);
  const [heightCm, setHeightCm] = useState<number | ''>(5);
  const [unitsInStock, setUnitsInStock] = useState<number | ''>(500);
  const [monthlyRate, setMonthlyRate] = useState<number | ''>(0.75); // Example: $0.75 per cubic foot
  const [ltsfRate, setLtsfRate] = useState<number | ''>(150); // Example: ₹150/Cubic Foot for aged inventory

  // Outputs
  const [unitVolumeFt3, setUnitVolumeFt3] = useState<number>(0);
  const [totalVolumeFt3, setTotalVolumeFt3] = useState<number>(0);
  const [monthlyFee, setMonthlyFee] = useState<number>(0);
  const [potentialLtsf, setPotentialLtsf] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const L = Number(lengthCm) || 0;
    const W = Number(widthCm) || 0;
    const H = Number(heightCm) || 0;
    const units = Number(unitsInStock) || 0;
    const rate = Number(monthlyRate) || 0;
    const ltsfR = Number(ltsfRate) || 0;

    if (L > 0 && W > 0 && H > 0) {
      // 1. Calculate Unit Volume in Cubic Feet (ft^3)
      const volumeCm3 = L * W * H;
      const volumeFt3 = volumeCm3 / CM3_TO_FT3;
      setUnitVolumeFt3(volumeFt3);

      // 2. Calculate Total Volume
      const totalV = volumeFt3 * units;
      setTotalVolumeFt3(totalV);

      // 3. Calculate Monthly Fee
      const monthlyF = totalV * rate;
      setMonthlyFee(monthlyF);

      // 4. Calculate Potential LTSF (using the same total volume)
      const potentialL = totalV * ltsfR;
      setPotentialLtsf(potentialL);
    } else {
      setUnitVolumeFt3(0);
      setTotalVolumeFt3(0);
      setMonthlyFee(0);
      setPotentialLtsf(0);
    }
  }, [lengthCm, widthCm, heightCm, unitsInStock, monthlyRate, ltsfRate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            FBA Storage Fee Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Estimate Monthly and Long-Term Storage Costs for your FBA Inventory.
          </p>
        </div>

        {/* --- HOW TO USE SECTION --- */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex justify-between items-center p-4 text-blue-800 font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            <span>📖 How to Use This Tool</span>
            <svg className={`w-5 h-5 transition-transform ${showGuide ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          {showGuide && (
            <div className="p-4 border-t border-blue-200 text-sm text-blue-900 space-y-2 bg-blue-50/50">
              <p><strong>1. Enter Dimensions:</strong> Input your product's actual dimensions in **centimeters (cm)**.</p>
              <p><strong>2. Enter Rates:</strong> Look up Amazon/Flipkart's current storage fee rates for your region and enter them. (Monthly rates are usually low, LTSF rates are very high).</p>
              <p><strong>3. Monitor the LTSF:</strong> The **Potential LTSF** shows you how much you would owe if your inventory sits for too long (e.g., beyond 6 or 12 months) and triggers the penalty fee.</p>
              <p>⭐ **Tip:** The key to FBA success is minimizing your inventory age!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700 border-b pb-2">Inventory Details</h3>
            
            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <input type="number" placeholder="Length (cm)" className="p-2 border rounded" value={lengthCm} onChange={e => setLengthCm(Number(e.target.value))} />
              <input type="number" placeholder="Width (cm)" className="p-2 border rounded" value={widthCm} onChange={e => setWidthCm(Number(e.target.value))} />
              <input type="number" placeholder="Height (cm)" className="p-2 border rounded" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Units Currently in Stock</label>
              <input type="number" className="w-full p-2 border rounded" value={unitsInStock} onChange={e => setUnitsInStock(Number(e.target.value))} placeholder="e.g. 500 units" />
            </div>
            
            <h3 className="font-bold text-gray-700 border-b pb-2 pt-4">Rate Inputs (Check Seller Central)</h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Monthly Storage Rate (₹ per Cubic Foot)</label>
              <input type="number" className="w-full p-2 border rounded" value={monthlyRate} onChange={e => setMonthlyRate(Number(e.target.value))} placeholder="e.g. 0.75 (USD) or local rate" />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-500 mb-1">LTSF Rate (₹ per Cubic Foot) - Penalty Fee</label>
              <input type="number" className="w-full p-2 border rounded border-red-300" value={ltsfRate} onChange={e => setLtsfRate(Number(e.target.value))} placeholder="e.g. 150 (INR for aged)" />
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col justify-start space-y-6 pt-4">
            
            {/* Volume Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
               <h4 className="font-bold text-gray-800 border-b pb-2">Volume Breakdown</h4>
               <div className="flex justify-between items-center text-gray-600">
                 <span>Unit Volume</span>
                 <span className="font-bold text-lg">{unitVolumeFt3.toFixed(4)} ft³</span>
               </div>
               <div className="flex justify-between items-center text-gray-600">
                 <span>Total Inventory Volume</span>
                 <span className="font-bold text-lg text-blue-600">{totalVolumeFt3.toFixed(2)} ft³</span>
               </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg space-y-4">
              <h4 className="font-bold text-yellow-400 border-b border-white/20 pb-2">Estimated Fees</h4>
               
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-sm text-slate-400">Estimated Monthly Fee</p>
                   <p className="text-xs text-slate-500 italic">Paid every month</p>
                 </div>
                 <span className="text-2xl font-bold">₹{monthlyFee.toFixed(2)}</span>
               </div>
               
               <div className="flex justify-between items-center pt-2 border-t border-white/10">
                 <div>
                   <p className="text-sm text-red-400">Potential LTSF Exposure</p>
                   <p className="text-xs text-slate-500 italic">If inventory ages beyond threshold</p>
                 </div>
                 <span className="text-2xl font-extrabold text-red-500">₹{potentialLtsf.toFixed(2)}</span>
               </div>
            </div>

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}