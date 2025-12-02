'use client';

import React, { useState, useEffect } from 'react';

export default function PpcCalculator() {
  // Inputs
  const [adSpend, setAdSpend] = useState<number | ''>('');
  const [adSales, setAdSales] = useState<number | ''>('');
  const [profitMargin, setProfitMargin] = useState<number | ''>(''); // Your product margin %

  // Outputs
  const [acos, setAcos] = useState<number>(0);
  const [roas, setRoas] = useState<number>(0);
  const [breakEvenMsg, setBreakEvenMsg] = useState<string>('Enter Data');
  const [statusColor, setStatusColor] = useState<string>('text-gray-500');

  useEffect(() => {
    const spend = Number(adSpend) || 0;
    const sales = Number(adSales) || 0;
    const margin = Number(profitMargin) || 0;

    if (spend > 0 && sales > 0) {
      // 1. ACOS (Advertising Cost of Sales)
      // Formula: (Spend / Sales) * 100
      const acosVal = (spend / sales) * 100;
      setAcos(acosVal);

      // 2. ROAS (Return on Ad Spend)
      // Formula: Sales / Spend
      const roasVal = sales / spend;
      setRoas(roasVal);

      // 3. Break-Even Analysis
      // If your ACOS is LOWER than your Profit Margin, you are making money.
      // If your ACOS is HIGHER than your Profit Margin, you are losing money.
      if (margin > 0) {
        if (acosVal < margin) {
          setBreakEvenMsg(`✅ Profitable! (Net Margin: ${(margin - acosVal).toFixed(2)}%)`);
          setStatusColor('text-green-600');
        } else if (acosVal === margin) {
          setBreakEvenMsg('⚖️ Break-Even (No Profit, No Loss)');
          setStatusColor('text-yellow-600');
        } else {
          setBreakEvenMsg(`❌ Loss Making (Loss: ${(acosVal - margin).toFixed(2)}%)`);
          setStatusColor('text-red-600');
        }
      } else {
        setBreakEvenMsg('Enter Profit Margin to see Profit/Loss');
        setStatusColor('text-blue-600');
      }
    } else {
      setAcos(0);
      setRoas(0);
      setBreakEvenMsg('Enter Spend & Sales');
      setStatusColor('text-gray-500');
    }
  }, [adSpend, adSales, profitMargin]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            PPC & ACOS Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the health of your Amazon/Flipkart Ads instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Spend (₹)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 500"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Sales / Revenue (₹)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 2000"
                value={adSales}
                onChange={(e) => setAdSales(Number(e.target.value))}
              />
            </div>

            <div className="pt-4 border-t border-dashed">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Profit Margin (%)
                <span className="text-xs text-gray-400 font-normal ml-2">(Optional, for Break-even)</span>
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
                placeholder="e.g. 30"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
              />
            </div>
          </div>

          {/* RESULTS */}
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center space-y-6">
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">ACOS</p>
                <p className="text-2xl font-bold text-yellow-400">{acos.toFixed(2)}%</p>
                <p className="text-[10px] text-slate-500">Lower is better</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-xs text-slate-400 uppercase">ROAS</p>
                <p className="text-2xl font-bold text-green-400">{roas.toFixed(2)}x</p>
                <p className="text-[10px] text-slate-500">Higher is better</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-xs uppercase text-gray-400 font-bold mb-1">Profitability Status</p>
              <p className={`text-lg font-bold ${statusColor}`}>
                {breakEvenMsg}
              </p>
            </div>

          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Created by SmartRwl
      </div>
    </div>
  );
}