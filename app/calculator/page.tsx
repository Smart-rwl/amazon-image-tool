'use client';

import React, { useState, useEffect } from 'react';

export default function ProfitCalculator() {
  // --- EXISTING INPUTS (Profit Calc) ---
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [platformFees, setPlatformFees] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [adsCost, setAdsCost] = useState<number | ''>('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstMode, setGstMode] = useState<'inclusive' | 'exclusive'>('inclusive');
  
  // --- NEW INPUTS (RTO Calc) ---
  const [returnShipping, setReturnShipping] = useState<number | ''>('');
  const [packaging, setPackaging] = useState<number | ''>('');
  const [returnRate, setReturnRate] = useState<number>(15); // Avg market return rate
  const [damageRate, setDamageRate] = useState<number>(0);  // % of returns that are damaged

  // --- OUTPUTS ---
  const [netProfit, setNetProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  
  // RTO Outputs
  const [lossPerReturn, setLossPerReturn] = useState<number>(0);
  const [weightedProfit, setWeightedProfit] = useState<number>(0);

  useEffect(() => {
    // 1. Basic Conversions
    const sp = Number(sellingPrice) || 0;
    const cp = Number(productCost) || 0;
    const fees = Number(platformFees) || 0;
    const fwdShip = Number(shippingCost) || 0;
    const ads = Number(adsCost) || 0;
    const revShip = Number(returnShipping) || (fwdShip * 1.5); // Default estimation
    const pack = Number(packaging) || 0;

    // 2. GST Logic (Base Revenue)
    let baseRevenue = 0;
    let taxAmt = 0;
    let customerPays = 0;

    if (gstMode === 'inclusive') {
      baseRevenue = sp / (1 + gstRate / 100);
      taxAmt = sp - baseRevenue;
      customerPays = sp;
    } else {
      baseRevenue = sp;
      taxAmt = sp * (gstRate / 100);
      customerPays = sp + taxAmt;
    }

    setGstAmount(taxAmt);

    // 3. SUCCESSFUL ORDER Logic
    const totalSaleCost = cp + fees + fwdShip + ads + pack; 
    const profitOnSale = baseRevenue - totalSaleCost;
    
    setNetProfit(profitOnSale);
    setMargin(customerPays > 0 ? (profitOnSale / customerPays) * 100 : 0);
    setRoi(cp > 0 ? (profitOnSale / cp) * 100 : 0);

    // 4. RETURN / RTO ORDER Logic
    // Loss = Fwd Ship + Rev Ship + Packing + Damage Cost + Ads (Ads are spent regardless)
    // Note: Platform fees are usually refunded by Amazon/Flipkart on return (except closing fee), 
    // but let's assume they are 0 for simple RTO calculation.
    const damagedValue = cp * (damageRate / 100);
    const lossOnReturn = fwdShip + revShip + pack + ads + damagedValue;
    setLossPerReturn(lossOnReturn);

    // 5. WEIGHTED PROFIT (The "Real" Business Profit)
    // If you sell 100 items: 
    // - (100 - ReturnRate) are Sales.
    // - (ReturnRate) are Losses.
    const successfulOrders = 100 - returnRate;
    const failedOrders = returnRate;

    const totalGain = (successfulOrders * profitOnSale) - (failedOrders * lossOnReturn);
    const avgProfitPerUnit = totalGain / 100;
    
    setWeightedProfit(avgProfitPerUnit);

  }, [sellingPrice, productCost, platformFees, shippingCost, adsCost, gstRate, gstMode, returnShipping, packaging, returnRate, damageRate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === LEFT COLUMN: INPUTS (Span 7) === */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Sale Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 text-xs">STEP 1</span>
              Sale Details
            </h2>
            
            {/* GST Toggle */}
            <div className="mb-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setGstMode('inclusive')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${gstMode === 'inclusive' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>Inclusive (Price includes Tax)</button>
                <button onClick={() => setGstMode('exclusive')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${gstMode === 'exclusive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Exclusive (Tax added on top)</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Cost</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Platform Fees</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded" value={platformFees} onChange={(e) => setPlatformFees(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shipping (Fwd)</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">GST Rate (%)</label>
                <select className="w-full p-2 border border-gray-300 rounded bg-white" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Return Risks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-red-100 text-red-600 p-1 rounded mr-2 text-xs">STEP 2</span>
              Return Risks
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Return Shipping</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded" placeholder="Usually 1.5x Fwd" value={returnShipping} onChange={(e) => setReturnShipping(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Packaging Cost</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded" value={packaging} onChange={(e) => setPackaging(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
               <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Return Rate (%)</label>
                <div className="flex items-center space-x-2">
                  <input type="range" min="0" max="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                  <span className="text-sm font-bold w-8">{returnRate}%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ads Cost per Unit</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded" value={adsCost} onChange={(e) => setAdsCost(Number(e.target.value))} />
              </div>
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: RESULTS (Span 5) === */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Successful Sale */}
          <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Successful Sale</h3>
              <span className="bg-green-500 text-xs px-2 py-1 rounded">Best Case</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-600 pb-4 mb-4">
               <span className="text-slate-400 text-sm">Net Profit</span>
               <span className={`text-3xl font-bold ${netProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>₹{netProfit.toFixed(1)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-700 p-2 rounded">
                <div className="text-xs text-slate-400">Margin</div>
                <div className="font-bold text-yellow-400">{margin.toFixed(1)}%</div>
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <div className="text-xs text-slate-400">ROI</div>
                <div className="font-bold text-blue-400">{roi.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Card 2: Return Loss */}
          <div className="bg-white border-2 border-red-50 p-5 rounded-xl">
             <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-gray-800">Return / RTO</h3>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">Worst Case</span>
            </div>
            <div className="flex justify-between items-baseline">
               <span className="text-gray-500 text-sm">Net Loss</span>
               <span className="text-2xl font-bold text-red-600">-₹{lossPerReturn.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Includes Shipping (Both ways), Packing & Ads.</p>
          </div>

          {/* Card 3: REALITY */}
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg transform scale-105 border-4 border-white">
            <h3 className="text-sm font-bold uppercase opacity-80 mb-1">True Business Profit</h3>
            <p className="text-xs opacity-75 mb-3">Weighted average considering {returnRate}% returns</p>
            
            <div className="flex items-baseline space-x-2">
               <span className="text-4xl font-extrabold">₹{weightedProfit.toFixed(1)}</span>
               <span className="text-sm">/ unit</span>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-400/50 text-sm flex justify-between">
               <span>GST to Pay:</span>
               <span className="font-bold">₹{gstAmount.toFixed(1)}</span>
            </div>
          </div>

        </div>

      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">Created by SmartRwl</div>
    </div>
  );
}