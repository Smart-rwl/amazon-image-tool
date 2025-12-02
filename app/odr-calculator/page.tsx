'use client';

import React, { useState, useEffect } from 'react';

export default function OdrCalculator() {
  // Inputs
  const [totalOrders, setTotalOrders] = useState<number | ''>('');
  const [defects, setDefects] = useState<number | ''>(''); // Neg Feedback + Claims
  
  // Outputs
  const [currentOdr, setCurrentOdr] = useState<number>(0);
  const [status, setStatus] = useState<string>('Enter Data');
  const [ordersNeeded, setOrdersNeeded] = useState<number>(0);
  const [statusColor, setStatusColor] = useState<string>('bg-gray-100');

  useEffect(() => {
    const orders = Number(totalOrders) || 0;
    const badOrders = Number(defects) || 0;

    if (orders > 0) {
      // 1. Calculate Current ODR
      const odrVal = (badOrders / orders) * 100;
      setCurrentOdr(odrVal);

      // 2. Determine Status
      if (odrVal < 1) {
        setStatus('✅ SAFE ZONE');
        setStatusColor('bg-green-100 text-green-800 border-green-200');
        setOrdersNeeded(0);
      } else {
        setStatus('⚠️ AT RISK / CRITICAL');
        setStatusColor('bg-red-100 text-red-800 border-red-200');

        // 3. Calculate Orders Needed to reach Safe Zone (0.99%)
        // Target Equation: (Defects / (CurrentOrders + X)) * 100 = 0.99
        // Defects / 0.0099 = CurrentOrders + X
        // X = (Defects / 0.0099) - CurrentOrders
        
        // We target 0.99% to be safe (just under 1%)
        const targetDecimal = 0.0099;
        const requiredTotal = badOrders / targetDecimal;
        const needed = Math.ceil(requiredTotal - orders);
        
        setOrdersNeeded(needed > 0 ? needed : 0);
      }
    } else {
      setCurrentOdr(0);
      setStatus('Enter Data');
      setStatusColor('bg-gray-100 text-gray-500');
      setOrdersNeeded(0);
    }
  }, [totalOrders, defects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Account Health Simulator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check your Order Defect Rate (ODR) and calculate recovery targets.
          </p>
        </div>

        {/* INPUTS */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Total Orders</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                placeholder="e.g. 150"
                value={totalOrders}
                onChange={(e) => setTotalOrders(Number(e.target.value))}
              />
              <p className="text-xs text-gray-400 mt-1">Orders in last 60 days</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Defects</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg border-red-100 bg-red-50"
                placeholder="e.g. 2"
                value={defects}
                onChange={(e) => setDefects(Number(e.target.value))}
              />
              <p className="text-xs text-gray-400 mt-1">Neg Feedback + A-to-Z Claims</p>
            </div>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={`p-6 rounded-xl border-2 text-center space-y-4 transition-colors ${statusColor}`}>
          
          <div>
            <p className="text-xs uppercase font-bold tracking-widest opacity-70">Current ODR</p>
            <p className="text-5xl font-extrabold mt-2">{currentOdr.toFixed(2)}%</p>
            <p className="text-sm font-bold mt-2">{status}</p>
          </div>

          <div className="border-t border-black/10 pt-4 mt-4">
             <div className="flex justify-between items-center text-sm">
                <span>Amazon Limit:</span>
                <span className="font-bold">1.00%</span>
             </div>
          </div>
        </div>

        {/* RECOVERY PLAN */}
        {ordersNeeded > 0 && (
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-lg font-bold flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Recovery Plan
            </h3>
            <div className="mt-4 text-center">
              <p className="text-blue-200 text-sm">To get back to safe zone (&lt;1%), you need:</p>
              <p className="text-4xl font-extrabold mt-2 mb-1">{ordersNeeded}</p>
              <p className="text-lg font-medium">More Defect-Free Orders</p>
            </div>
            <p className="text-xs text-center text-blue-300 mt-4 opacity-75">
              Tip: Lower your price or run a Lightning Deal to get these orders fast.
            </p>
          </div>
        )}

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}