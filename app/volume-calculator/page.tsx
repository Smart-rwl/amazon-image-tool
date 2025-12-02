'use client';

import React, { useState, useEffect } from 'react';

export default function VolumeCalculator() {
  // Inputs
  const [currentPrice, setCurrentPrice] = useState<number | ''>('');
  const [unitCost, setUnitCost] = useState<number | ''>(''); // Landed Cost
  const [currentVolume, setCurrentVolume] = useState<number | ''>(''); // Monthly Sales
  const [newPrice, setNewPrice] = useState<number | ''>('');

  // Outputs
  const [currentProfit, setCurrentProfit] = useState<number>(0);
  const [newUnitProfit, setNewUnitProfit] = useState<number>(0);
  const [neededVolume, setNeededVolume] = useState<number>(0);
  const [percentIncrease, setPercentIncrease] = useState<number>(0);
  const [isImpossible, setIsImpossible] = useState(false);

  useEffect(() => {
    const price = Number(currentPrice) || 0;
    const cost = Number(unitCost) || 0;
    const vol = Number(currentVolume) || 0;
    const targetPrice = Number(newPrice) || 0;

    if (price > 0 && cost > 0 && vol > 0 && targetPrice > 0) {
      
      // 1. Current Situation
      const currMargin = price - cost;
      const totalCurrProfit = currMargin * vol;
      setCurrentProfit(totalCurrProfit);

      // 2. New Situation
      const newMargin = targetPrice - cost;
      setNewUnitProfit(newMargin);

      if (newMargin <= 0) {
        setIsImpossible(true);
        setNeededVolume(0);
        setPercentIncrease(0);
      } else {
        setIsImpossible(false);
        // Math: To make SAME Total Profit
        // NewMargin * NewVolume = TotalCurrProfit
        // NewVolume = TotalCurrProfit / NewMargin
        
        const reqVolume = totalCurrProfit / newMargin;
        setNeededVolume(Math.ceil(reqVolume));

        // % Increase calculation
        const increase = ((reqVolume - vol) / vol) * 100;
        setPercentIncrease(increase);
      }

    } else {
      setCurrentProfit(0);
      setNeededVolume(0);
      setIsImpossible(false);
    }
  }, [currentPrice, unitCost, currentVolume, newPrice]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Price Drop Strategy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            If you lower your price, how many MORE units do you need to sell to keep the same profit?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm border-b pb-2">Current Status</h3>
              <div>
                <label className="text-xs font-bold text-gray-500">Current Selling Price (₹)</label>
                <input type="number" className="w-full p-2 border rounded" value={currentPrice} onChange={e => setCurrentPrice(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Product Cost (₹)</label>
                <input type="number" className="w-full p-2 border rounded" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Monthly Sales (Units)</label>
                <input type="number" className="w-full p-2 border rounded" value={currentVolume} onChange={e => setCurrentVolume(Number(e.target.value))} />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 text-sm mb-3">Proposed Change</h3>
              <label className="text-xs font-bold text-blue-600">New Lower Price (₹)</label>
              <input type="number" className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500" value={newPrice} onChange={e => setNewPrice(Number(e.target.value))} placeholder="e.g. 900" />
            </div>
          </div>

          {/* RESULTS */}
          <div className="flex flex-col justify-center space-y-6">
            
            {isImpossible ? (
              <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center border border-red-200">
                <h3 className="text-xl font-bold mb-2">❌ LOSS MAKING</h3>
                <p>Your new price is lower than your cost!</p>
                <p className="text-sm mt-2">You will lose money on every sale.</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Required Sales Volume</p>
                  <div className="text-5xl font-extrabold text-yellow-400">
                    {neededVolume > 0 ? neededVolume.toLocaleString() : '0'}
                  </div>
                  <p className="text-sm text-slate-300 mt-1">units / month</p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-1">Sales Growth Needed</p>
                    <p className={`text-2xl font-bold ${percentIncrease > 50 ? 'text-red-400' : 'text-green-400'}`}>
                      +{percentIncrease.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600 shadow-sm">
                  <p className="mb-2"><strong>The Reality Check:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>You currently make <b>₹{currentProfit.toLocaleString()}</b> profit.</li>
                    <li>At the new price, you make only <b>₹{newUnitProfit.toFixed(1)}</b> per unit.</li>
                    <li>To maintain your total profit, you MUST sell <b>{neededVolume} units</b> (an extra {neededVolume - (Number(currentVolume)||0)} units).</li>
                  </ul>
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