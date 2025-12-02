'use client';

import React, { useState, useEffect } from 'react';

export default function ProfitCalculator() {
  // Input States
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [platformFees, setPlatformFees] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [adsCost, setAdsCost] = useState<number | ''>('');
  const [gstRate, setGstRate] = useState<number>(18); // Default 18% GST

  // Output States
  const [netProfit, setNetProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);

  // Calculation Logic
  useEffect(() => {
    const sp = Number(sellingPrice) || 0;
    const cp = Number(productCost) || 0;
    const fees = Number(platformFees) || 0;
    const ship = Number(shippingCost) || 0;
    const ads = Number(adsCost) || 0;

    // GST Calculation (GST is usually included in SP, so we remove it to find actual revenue)
    // Formula: Price / (1 + GST%)
    const priceExcludingGST = sp / (1 + gstRate / 100);
    const gstAmount = sp - priceExcludingGST;

    // Total Deductions
    const totalCosts = cp + fees + ship + ads + gstAmount;

    // Profit
    const profit = sp - totalCosts;
    const profitMargin = sp > 0 ? (profit / sp) * 100 : 0;
    const returnOnInvestment = cp > 0 ? (profit / cp) * 100 : 0;

    setNetProfit(profit);
    setMargin(profitMargin);
    setRoi(returnOnInvestment);
  }, [sellingPrice, productCost, platformFees, shippingCost, adsCost, gstRate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* INPUT SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Expense Details</h2>
            <p className="text-xs text-gray-500">Enter your product details below</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price (SP)</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
              <input
                type="number"
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Cost (Buy Price)</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
              <input
                type="number"
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={productCost}
                onChange={(e) => setProductCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Fees</label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Referral + Closing"
                value={platformFees}
                onChange={(e) => setPlatformFees(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Avg Shipping"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ads / Marketing</label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Per unit cost"
                value={adsCost}
                onChange={(e) => setAdsCost(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST %</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>
          </div>
        </div>

        {/* OUTPUT SECTION */}
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center space-y-6">
          <div className="border-b border-slate-600 pb-4">
            <h2 className="text-xl font-bold">Profit Analysis</h2>
            <p className="text-xs text-slate-400">Real-time breakdown</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
              <span className="text-sm font-medium text-slate-300">Net Profit</span>
              <span className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{netProfit.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-700 rounded-lg text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Margin</p>
                <p className={`text-xl font-bold ${margin >= 20 ? 'text-green-400' : margin > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {margin.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">ROI</p>
                <p className="text-xl font-bold text-blue-400">
                  {roi.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 text-xs text-slate-500 text-center">
            *Calculations assume GST is included in Selling Price.
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium text-sm">Created by SmartRwl</p>
      </div>
    </div>
  );
}