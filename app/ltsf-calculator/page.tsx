'use client';

import React, { useState } from 'react';
import { SparklesIcon, CalendarIcon, ArchiveBoxIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';

// Standard FBA Storage Fee Rates (Approximate, as of late 2024/early 2025 - Metric: Per Cubic Foot)
// Note: Amazon adjusts these based on category and time of year.
const FBA_STORAGE_FEES = {
  LONG_TERM_181_365: 6.90, // Rupees per cubic foot per month (Placeholder based on rough USD conversion/example)
  LONG_TERM_365_PLUS: 23.00, // Rupees per cubic foot per month (Placeholder)
};

interface InventoryItem {
  sku: string;
  volume_cbm: number; // Volume in Cubic Meters (CBM)
  age_days: number;
}

export default function LTSFCalculator() {
  const [itemsInput, setItemsInput] = useState(`
SKU-X001, 0.005, 190
SKU-Y002, 0.008, 300
SKU-Z003, 0.012, 400
  `.trim());
  const [results, setResults] = useState<{ item: InventoryItem; fee_type: string; fee_amount: number }[]>([]);
  const [totalLTSF, setTotalLTSF] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  // Conversion factor: 1 CBM is approximately 35.3147 cubic feet (CF)
  const CBM_TO_CF = 35.3147;

  const calculateLTSF = () => {
    const lines = itemsInput.split('\n').filter(line => line.trim() !== '');
    const newResults: { item: InventoryItem; fee_type: string; fee_amount: number }[] = [];
    let runningTotal = 0;

    for (const line of lines) {
      const [sku, volumeStr, ageStr] = line.split(',').map(s => s.trim());
      const volume_cbm = parseFloat(volumeStr);
      const age_days = parseInt(ageStr, 10);

      if (sku && !isNaN(volume_cbm) && !isNaN(age_days)) {
        const volume_cf = volume_cbm * CBM_TO_CF; // Volume in Cubic Feet
        let fee_amount = 0;
        let fee_type = 'No LTSF';

        if (age_days > 365) {
          fee_amount = volume_cf * FBA_STORAGE_FEES.LONG_TERM_365_PLUS;
          fee_type = `Over 365 Days (${FBA_STORAGE_FEES.LONG_TERM_365_PLUS.toFixed(2)}/CF)`;
        } else if (age_days > 180) {
          fee_amount = volume_cf * FBA_STORAGE_FEES.LONG_TERM_181_365;
          fee_type = `181-365 Days (${FBA_STORAGE_FEES.LONG_TERM_181_365.toFixed(2)}/CF)`;
        }
        
        runningTotal += fee_amount;

        newResults.push({
          item: { sku, volume_cbm, age_days },
          fee_type,
          fee_amount,
        });
      }
    }

    setResults(newResults);
    setTotalLTSF(runningTotal);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-5xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
            <ArchiveBoxIcon className="w-8 h-8 text-indigo-600" />
            FBA Long-Term Storage Fee (LTSF) Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Estimate the potential fees for slow-moving inventory in Amazon&apos;s fulfillment centers.
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
              <p><strong>1. Get Data:</strong> Export your **FBA Inventory Age** report from Amazon Seller Central.</p>
              <p><strong>2. Format Input:</strong> Paste your data into the box below using the format: **`SKU, Volume (CBM), Age (Days)`** with each item on a new line.</p>
              <p><strong>3. Calculate:</strong> Click the button to see the estimated LTSF for each item based on current Amazon fee tiers (181-365 days and 365+ days).</p>
              <p><strong>4. Act:</strong> Use the results to decide which items to **remove**, **liquidate**, or **run a discount** promotion for before the next fee charge date.</p>
              <p className='text-xs italic mt-2'>*Note: Fee rates used are simplified placeholders. Always confirm the latest rates on Seller Central for final calculations.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* INPUT AREA */}
          <div className="lg:col-span-2 space-y-4">
            <label className="block text-sm font-bold text-gray-700">Inventory Data (Format: SKU, CBM, Days Old)</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm h-64 resize-none"
              value={itemsInput}
              onChange={(e) => setItemsInput(e.target.value)}
              placeholder="Example:&#10;ITEM-A, 0.003, 190&#10;ITEM-B, 0.015, 380"
            />
            <button
              onClick={calculateLTSF}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Analyze Potential LTSF
            </button>
          </div>

          {/* SUMMARY / FEES */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-indigo-200">
              <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-6 h-6" />
                LTSF Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-lg font-medium text-gray-800">Total Items Analyzed:</span>
                  <span className="text-xl font-extrabold text-indigo-600">{results.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">TOTAL ESTIMATED LTSF:</span>
                  <span className="text-2xl font-extrabold text-red-600">₹{totalLTSF.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <h3 className='font-bold flex items-center gap-1'>
                <CalendarIcon className="w-4 h-4" />
                Fee Tiers (Monthly Rate per Cubic Foot):
              </h3>
              <ul className='list-disc list-inside ml-4 mt-1 space-y-1'>
                <li>**181-365 Days:** ₹{FBA_STORAGE_FEES.LONG_TERM_181_365.toFixed(2)}</li>
                <li>**365+ Days:** ₹{FBA_STORAGE_FEES.LONG_TERM_365_PLUS.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* RESULTS TABLE */}
        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Item Breakdown</h2>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age (Days)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (CF)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Tier</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Monthly Fee (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((r, index) => (
                    <tr key={index} className={r.fee_amount > 0 ? 'bg-red-50/50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.item.age_days}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(r.item.volume_cbm * CBM_TO_CF).toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.fee_amount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {r.fee_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                        {r.fee_amount > 0 ? `₹${r.fee_amount.toFixed(2)}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}