'use client';

import React, { useState, useEffect } from 'react';

type Component = {
  id: number;
  name: string;
  cost: number | '';
  qty: number | '';
};

export default function BundleCalculator() {
  // Bundle Details
  const [bundlePrice, setBundlePrice] = useState<number | ''>('');
  const [referralFee, setReferralFee] = useState<number | ''>(''); // %
  const [fbaFee, setFbaFee] = useState<number | ''>(''); // Fixed fee for the WHOLE bundle
  const [bundlePackaging, setBundlePackaging] = useState<number | ''>(''); // Box to hold them together

  // Components List
  const [components, setComponents] = useState<Component[]>([
    { id: 1, name: 'Item A', cost: '', qty: 1 }
  ]);

  // Outputs
  const [totalCost, setTotalCost] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);

  // Add/Remove Components
  const addComponent = () => {
    setComponents([...components, { id: Date.now(), name: `Item ${components.length + 1}`, cost: '', qty: 1 }]);
  };

  const removeComponent = (id: number) => {
    if (components.length > 1) {
      setComponents(components.filter(c => c.id !== id));
    }
  };

  const updateComponent = (id: number, field: keyof Component, value: any) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  useEffect(() => {
    const price = Number(bundlePrice) || 0;
    const refPct = Number(referralFee) || 0;
    const fba = Number(fbaFee) || 0;
    const pack = Number(bundlePackaging) || 0;

    // 1. Calculate Total Component Cost
    let componentsCost = 0;
    components.forEach(c => {
      const cCost = Number(c.cost) || 0;
      const cQty = Number(c.qty) || 0;
      componentsCost += (cCost * cQty);
    });

    // 2. Calculate Fees
    const referralAmount = price * (refPct / 100);
    
    // 3. Total Costs
    const totalExpenses = componentsCost + referralAmount + fba + pack;

    // 4. Profit
    const profit = price - totalExpenses;
    const profitMargin = price > 0 ? (profit / price) * 100 : 0;

    setTotalCost(totalExpenses);
    setNetProfit(profit);
    setMargin(profitMargin);

  }, [bundlePrice, referralFee, fbaFee, bundlePackaging, components]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Bundle Profit Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Combine multiple items into one SKU and check profitability.
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
              <p><strong>1. Add Components:</strong> List every item going into the bundle (e.g., 1 Shampoo, 1 Conditioner).</p>
              <p><strong>2. Enter Bundle Price:</strong> The final price you will sell the whole set for.</p>
              <p><strong>3. Enter Fees:</strong> Remember, FBA fees are based on the <strong>total size/weight</strong> of the bundle, not individual items.</p>
              <p><strong>Why Bundle?</strong> You save on FBA fees because you only pay for 1 shipment/pick-and-pack instead of 2!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: COMPONENTS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Bundle Contents</h3>
              <button onClick={addComponent} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200">+ Add Item</button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {components.map((comp, index) => (
                <div key={comp.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="w-8 text-center font-bold text-gray-400 text-xs">{index + 1}</div>
                  <input 
                    type="text" 
                    placeholder="Item Name" 
                    className="flex-1 p-2 text-sm border rounded" 
                    value={comp.name} 
                    onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Cost ₹" 
                    className="w-20 p-2 text-sm border rounded" 
                    value={comp.cost} 
                    onChange={(e) => updateComponent(comp.id, 'cost', Number(e.target.value))}
                  />
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-16 p-2 text-sm border rounded" 
                    value={comp.qty} 
                    onChange={(e) => updateComponent(comp.id, 'qty', Number(e.target.value))}
                  />
                  {components.length > 1 && (
                    <button onClick={() => removeComponent(comp.id)} className="text-red-400 hover:text-red-600 font-bold px-2">×</button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-right text-xs font-bold text-gray-600">
              Total Component Cost: ₹{components.reduce((acc, curr) => acc + (Number(curr.cost||0) * Number(curr.qty||0)), 0).toFixed(2)}
            </div>
          </div>

          {/* RIGHT: ECONOMICS */}
          <div className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
              <h3 className="font-bold text-blue-800 text-sm">Bundle Selling Details</h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Total Bundle Price (₹)</label>
                <input type="number" className="w-full p-2 border rounded" value={bundlePrice} onChange={e => setBundlePrice(Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Referral Fee (%)</label>
                  <input type="number" className="w-full p-2 border rounded" value={referralFee} onChange={e => setReferralFee(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">FBA/Ship Fee (Total)</label>
                  <input type="number" className="w-full p-2 border rounded" value={fbaFee} onChange={e => setFbaFee(Number(e.target.value))} placeholder="For whole box" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Bundle Packaging Cost (₹)</label>
                <input type="number" className="w-full p-2 border rounded" value={bundlePackaging} onChange={e => setBundlePackaging(Number(e.target.value))} placeholder="Box + Tape" />
              </div>
            </div>

            {/* RESULTS */}
            <div className="flex flex-col space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Net Bundle Profit</p>
                <div className={`text-4xl font-extrabold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{netProfit.toFixed(2)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Total Cost</p>
                  <p className="font-bold text-lg">₹{totalCost.toFixed(2)}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Margin</p>
                  <p className={`font-bold text-lg ${margin >= 15 ? 'text-green-600' : 'text-yellow-600'}`}>{margin.toFixed(1)}%</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}