'use client';

import React, { useState, useEffect } from 'react';

export default function PriceFinder() {
  // Inputs
  const [productCost, setProductCost] = useState<number | ''>(''); // Cost + Shipping + Packing
  const [targetProfit, setTargetProfit] = useState<number | ''>('');
  const [platformFeePercent, setPlatformFeePercent] = useState<number | ''>(''); // e.g. 15%
  const [gstRate, setGstRate] = useState<number>(18);
  
  // Output
  const [suggestedPrice, setSuggestedPrice] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<any>(null);

  useEffect(() => {
    const cost = Number(productCost) || 0;
    const profit = Number(targetProfit) || 0;
    const feePct = Number(platformFeePercent) || 0;

    if (cost > 0 && profit > 0) {
      // THE MATH (Reverse Calculation)
      // SellingPrice (P)
      // BasePrice = P / (1 + GST%)
      // Fee = P * Fee%
      // Profit = BasePrice - Cost - Fee
      
      // Rearranging to solve for P:
      // Profit + Cost = P * [ (1 / (1 + GST)) - Fee% ]
      
      const gstDecimal = gstRate / 100;
      const feeDecimal = feePct / 100;

      const denominator = (1 / (1 + gstDecimal)) - feeDecimal;

      if (denominator <= 0) {
        // This happens if Fees + Taxes are so high that profit is mathematically impossible
        setSuggestedPrice(0);
        setBreakdown(null);
        return;
      }

      const calculatedPrice = (profit + cost) / denominator;
      setSuggestedPrice(calculatedPrice);

      // Verify the Breakdown for display
      const feeAmount = calculatedPrice * feeDecimal;
      const basePrice = calculatedPrice / (1 + gstDecimal);
      const gstAmount = calculatedPrice - basePrice;

      setBreakdown({
        cost,
        profit,
        gst: gstAmount,
        fees: feeAmount,
        finalPrice: calculatedPrice
      });
    } else {
      setSuggestedPrice(0);
      setBreakdown(null);
    }
  }, [productCost, targetProfit, platformFeePercent, gstRate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Smart Price Finder
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell us your desired profit, we calculate the Selling Price for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-5 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-gray-700">1. Your Costs & Goals</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Product Cost (₹)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Purchase + Ship + Pack"
                value={productCost}
                onChange={(e) => setProductCost(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Net Profit (₹)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-green-50 border-green-200"
                placeholder="How much you want to keep"
                value={targetProfit}
                onChange={(e) => setTargetProfit(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Marketplace Fee (%)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Avg 15-20%"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">GST Rate (%)</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col justify-center space-y-6">
            
            {suggestedPrice > 0 ? (
              <>
                <div className="bg-slate-800 text-white p-8 rounded-xl shadow-xl text-center transform scale-105 transition-transform">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Recommended Selling Price</p>
                  <p className="text-5xl font-extrabold text-green-400">
                    ₹{Math.ceil(suggestedPrice)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    (Round up to ₹{Math.ceil(suggestedPrice / 10) * 10 - 1} for psychology)
                  </p>
                </div>

                {breakdown && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm space-y-2 text-gray-600">
                    <p className="font-bold border-b pb-2 mb-2 text-gray-800">Where the money goes:</p>
                    <div className="flex justify-between">
                      <span>Product Cost:</span>
                      <span>₹{breakdown.cost.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                      <span>Amazon/Flipkart Fees:</span>
                      <span className="text-red-500">- ₹{breakdown.fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Amount:</span>
                      <span className="text-red-500">- ₹{breakdown.gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-green-600 text-base">
                      <span>Your Profit:</span>
                      <span>₹{breakdown.profit.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-xl p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>Enter your costs and goal profit to see the magic number.</p>
              </div>
            )}

          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Created by SmartRwl
      </div>
    </div>
  );
}