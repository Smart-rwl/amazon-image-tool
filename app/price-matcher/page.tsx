'use client';

import React, { useState, useEffect } from 'react';

export default function PriceMatcher() {
  // Inputs
  const [myCost, setMyCost] = useState<number | ''>(''); // Landed Cost
  const [shipping, setShipping] = useState<number | ''>(''); // FBA/FBM Cost
  const [feePercent, setFeePercent] = useState<number | ''>(''); // Referral Fee %
  const [competitorPrice, setCompetitorPrice] = useState<number | ''>('');
  
  // Outputs
  const [profitIfMatched, setProfitIfMatched] = useState<number>(0);
  const [marginIfMatched, setMarginIfMatched] = useState<number>(0);
  const [breakEvenPrice, setBreakEvenPrice] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const cost = Number(myCost) || 0;
    const ship = Number(shipping) || 0;
    const feePct = Number(feePercent) || 0;
    const compPrice = Number(competitorPrice) || 0;

    if (cost > 0) {
      // 1. Calculate Break Even (Walk Away Price)
      // Price = Cost + Ship + (Price * Fee%)
      // Price - (Price * Fee%) = Cost + Ship
      // Price * (1 - Fee%) = Cost + Ship
      // Price = (Cost + Ship) / (1 - Fee%)
      
      const bePrice = (cost + ship) / (1 - (feePct / 100));
      setBreakEvenPrice(bePrice);

      // 2. Calculate Profit if matched
      if (compPrice > 0) {
        const fees = compPrice * (feePct / 100);
        const net = compPrice - cost - ship - fees;
        const margin = (net / compPrice) * 100;
        
        setProfitIfMatched(net);
        setMarginIfMatched(margin);

        if (net > 0) setStatus('SAFE TO MATCH');
        else if (net === 0) setStatus('BREAK EVEN');
        else setStatus('DO NOT MATCH');
      } else {
        setProfitIfMatched(0);
        setMarginIfMatched(0);
        setStatus('');
      }
    }
  }, [myCost, shipping, feePercent, competitorPrice]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Competitor Price Matcher
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Can you afford to beat your competitor's price? Find out instantly.
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
              <p><strong>1. Enter Costs:</strong> Input your Product Cost, Shipping, and Amazon Fees.</p>
              <p><strong>2. Enter Competitor Price:</strong> Input the low price your competitor is selling at.</p>
              <p><strong>3. The Decision:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>If <strong>Green (SAFE)</strong>: You can match them and still make money.</li>
                  <li>If <strong>Red (DO NOT MATCH)</strong>: You will lose money. Let them run out of stock instead of engaging in a price war.</li>
                </ul>
              </p>
              <p><strong>4. Walk Away Price:</strong> This is your absolute lowest limit (0 profit). Never price below this.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm uppercase">Your Economics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500">Product Cost</label>
                  <input type="number" className="w-full p-2 border rounded" value={myCost} onChange={e => setMyCost(Number(e.target.value))} placeholder="e.g. 200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Shipping Cost</label>
                  <input type="number" className="w-full p-2 border rounded" value={shipping} onChange={e => setShipping(Number(e.target.value))} placeholder="e.g. 70" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Referral Fee %</label>
                <input type="number" className="w-full p-2 border rounded" value={feePercent} onChange={e => setFeePercent(Number(e.target.value))} placeholder="e.g. 15" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3">
              <h3 className="font-bold text-red-800 text-sm uppercase">The Threat</h3>
              <label className="text-xs font-bold text-red-600">Competitor's Selling Price</label>
              <input 
                type="number" 
                className="w-full p-3 border border-red-200 rounded focus:ring-2 focus:ring-red-500 text-lg font-bold text-red-900" 
                value={competitorPrice} 
                onChange={e => setCompetitorPrice(Number(e.target.value))} 
                placeholder="e.g. 499" 
              />
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col justify-center space-y-6">
            
            {/* Status Card */}
            <div className={`p-8 rounded-xl text-center shadow-lg border-2 ${
              status === 'SAFE TO MATCH' ? 'bg-green-100 border-green-300 text-green-800' :
              status === 'DO NOT MATCH' ? 'bg-red-100 border-red-300 text-red-800' :
              'bg-gray-100 border-gray-300 text-gray-600'
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Verdict</p>
              <h2 className="text-3xl font-extrabold">{status || 'Enter Data'}</h2>
              
              {status && (
                <div className="mt-4 pt-4 border-t border-black/10">
                  <p className="text-sm">If you match <strong>₹{competitorPrice}</strong>:</p>
                  <p className="text-2xl font-bold mt-1">
                    {profitIfMatched >= 0 ? '+' : '-'}₹{Math.abs(profitIfMatched).toFixed(2)} Profit
                  </p>
                  <p className="text-xs mt-1">({marginIfMatched.toFixed(1)}% Margin)</p>
                </div>
              )}
            </div>

            {/* Break Even Card */}
            <div className="bg-slate-800 text-white p-4 rounded-lg flex justify-between items-center px-6">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Your "Walk Away" Price</p>
                <p className="text-[10px] text-slate-500">Zero Profit Point</p>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{Math.ceil(breakEvenPrice)}
              </div>
            </div>

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}