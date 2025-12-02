'use client';

import React, { useState, useEffect } from 'react';

export default function InfluencerCalculator() {
  // Inputs
  const [influencerFee, setInfluencerFee] = useState<number | ''>(''); // Fixed cost
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>(''); // Landed + Ship + Fees
  const [discountPercent, setDiscountPercent] = useState<number | ''>(''); // Coupon code given to influencer
  
  // Outputs
  const [profitPerUnit, setProfitPerUnit] = useState<number>(0);
  const [breakEvenUnits, setBreakEvenUnits] = useState<number>(0);
  const [targetUnits, setTargetUnits] = useState<number>(0); // For 2x ROI
  const [impossible, setImpossible] = useState(false);

  useEffect(() => {
    const fee = Number(influencerFee) || 0;
    const sp = Number(sellingPrice) || 0;
    const cp = Number(productCost) || 0;
    const disc = Number(discountPercent) || 0;

    if (sp > 0 && cp > 0) {
      // 1. Calculate New Selling Price with Coupon
      const discountedSP = sp - (sp * (disc / 100));
      
      // 2. Calculate Profit Per Unit on Promo Sales
      const margin = discountedSP - cp;
      setProfitPerUnit(margin);

      if (margin <= 0) {
        setImpossible(true);
        setBreakEvenUnits(0);
        setTargetUnits(0);
      } else {
        setImpossible(false);
        
        // 3. Break Even Point
        // Total Fee / Profit per Unit
        const be = Math.ceil(fee / margin);
        setBreakEvenUnits(be);

        // 4. Target for 2x ROI (Double your money)
        // (Fee * 2) / Profit per Unit
        // Or: To make Fee back + Fee Profit
        const target = Math.ceil((fee * 2) / margin);
        setTargetUnits(target);
      }
    } else {
      setProfitPerUnit(0);
      setBreakEvenUnits(0);
      setTargetUnits(0);
      setImpossible(false);
    }
  }, [influencerFee, sellingPrice, productCost, discountPercent]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Influencer Campaign Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Calculate how many sales an influencer needs to generate to be worth the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-bold text-purple-800 text-sm mb-3">1. Campaign Cost</h3>
              <label className="block text-xs font-bold text-purple-600 mb-1">Influencer / Fixed Fee (₹)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-purple-200 rounded focus:ring-2 focus:ring-purple-500" 
                placeholder="e.g. 5000"
                value={influencerFee}
                onChange={e => setInfluencerFee(Number(e.target.value))}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm">2. Product Economics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500">Selling Price</label>
                  <input type="number" className="w-full p-2 border rounded" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Total Cost (Product+Ship)</label>
                  <input type="number" className="w-full p-2 border rounded" value={productCost} onChange={e => setProductCost(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Discount Code (%)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="e.g. 10" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
                <p className="text-[10px] text-gray-400 mt-1">If you give them a code like "INFLUENCER10"</p>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col justify-center space-y-6">
            
            {impossible ? (
              <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center border border-red-200">
                <h3 className="text-xl font-bold mb-2">❌ LOSS MAKING</h3>
                <p>The discount is too high.</p>
                <p className="text-sm mt-2">You lose ₹{Math.abs(profitPerUnit).toFixed(2)} on every single unit sold!</p>
              </div>
            ) : (
              <>
                {/* Break Even Card */}
                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Break-Even Sales Needed</p>
                  <div className="text-5xl font-extrabold text-yellow-400">
                    {breakEvenUnits} <span className="text-lg text-white">units</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    To recover the ₹{influencerFee} fee (0 Profit)
                  </p>
                </div>

                {/* Profitable Card */}
                <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-center">
                  <p className="text-xs text-green-200 uppercase tracking-widest mb-2">Target for 2x ROI</p>
                  <div className="text-4xl font-extrabold">
                    {targetUnits} <span className="text-lg">units</span>
                  </div>
                  <p className="text-xs text-green-100 mt-2">
                    Sell this many to double your investment.
                  </p>
                </div>

                <div className="text-center text-xs text-gray-500">
                  <p>Profit per unit after discount: <strong>₹{profitPerUnit.toFixed(2)}</strong></p>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}