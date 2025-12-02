'use client';

import React, { useState, useEffect } from 'react';

export default function ProfitCalculator() {
  // Input States
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [platformFees, setPlatformFees] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [adsCost, setAdsCost] = useState<number | ''>('');
  const [gstRate, setGstRate] = useState<number>(18); // Default 18%
  const [gstMode, setGstMode] = useState<'inclusive' | 'exclusive'>('inclusive'); // NEW: Toggle Mode

  // Output States
  const [netProfit, setNetProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  
  // Breakdown Outputs (New)
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [finalCustomerPrice, setFinalCustomerPrice] = useState<number>(0);

  // Calculation Logic
  useEffect(() => {
    const spInput = Number(sellingPrice) || 0;
    const cp = Number(productCost) || 0;
    const fees = Number(platformFees) || 0;
    const ship = Number(shippingCost) || 0;
    const ads = Number(adsCost) || 0;

    let baseRevenue = 0; // The money you keep before expenses (SP without Tax)
    let taxAmt = 0;
    let customerPays = 0;

    if (gstMode === 'inclusive') {
      // Scenario: You list item for ₹118. This includes ₹18 tax.
      // Base Revenue = 100
      baseRevenue = spInput / (1 + gstRate / 100);
      taxAmt = spInput - baseRevenue;
      customerPays = spInput;
    } else {
      // Scenario: You list item for ₹100 + 18% Tax.
      // Base Revenue = 100
      // Customer Pays = 118
      baseRevenue = spInput;
      taxAmt = spInput * (gstRate / 100);
      customerPays = spInput + taxAmt;
    }

    // Total Expenses (Product + Fees + Shipping + Ads)
    // Note: GST is not an "expense" here because we already stripped it out of the Revenue above.
    const totalExpenses = cp + fees + ship + ads;

    // Profit = Base Revenue - Expenses
    const profit = baseRevenue - totalExpenses;
    
    // Margin = (Profit / CustomerPrice) * 100 (Standard E-commerce definition)
    // Some calc on Base Revenue, but usually margins are calc on final listing price.
    const profitMargin = customerPays > 0 ? (profit / customerPays) * 100 : 0;
    
    // ROI = (Profit / ProductCost) * 100
    const returnOnInvestment = cp > 0 ? (profit / cp) * 100 : 0;

    setNetProfit(profit);
    setMargin(profitMargin);
    setRoi(returnOnInvestment);
    setGstAmount(taxAmt);
    setFinalCustomerPrice(customerPays);

  }, [sellingPrice, productCost, platformFees, shippingCost, adsCost, gstRate, gstMode]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUT SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-5">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">Profit & Loss Calculator</h2>
            <p className="text-xs text-gray-500">Enter your costs and selling price.</p>
          </div>

          {/* GST Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Mode</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setGstMode('inclusive')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  gstMode === 'inclusive' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                Inclusive (Tax inside Price)
              </button>
              <button
                onClick={() => setGstMode('exclusive')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  gstMode === 'exclusive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                Exclusive (Tax on top)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {gstMode === 'inclusive' ? 'Selling Price (Total)' : 'Base Price (Excl. Tax)'}
              </label>
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
              <label className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Platform Fees</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Amazon Fees"
                value={platformFees}
                onChange={(e) => setPlatformFees(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Shipping</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Delivery"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ads / Mktg</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ads cost"
                value={adsCost}
                onChange={(e) => setAdsCost(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* OUTPUT SECTION */}
        <div className="flex flex-col space-y-4">
          
          {/* Main Profit Card */}
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-slate-600 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">Net Profit</h2>
                <p className="text-xs text-slate-400">Total Earnings per unit</p>
              </div>
              <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{netProfit.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700 rounded-lg text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Profit Margin</p>
                <p className={`text-2xl font-bold ${margin >= 20 ? 'text-green-400' : margin > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {margin.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ROI</p>
                <p className="text-2xl font-bold text-blue-400">
                  {roi.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Breakdown</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Final Customer Price:</span>
                <span className="font-semibold text-gray-900">₹{finalCustomerPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>GST to Govt ({gstRate}%):</span>
                <span>- ₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Real Revenue (Pre-Tax):</span>
                <span className="font-bold text-gray-900">₹{(finalCustomerPrice - gstAmount).toFixed(2)}</span>
              </div>
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