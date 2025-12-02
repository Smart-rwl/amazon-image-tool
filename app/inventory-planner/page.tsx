'use client';

import React, { useState, useEffect } from 'react';

export default function InventoryPlanner() {
  // Inputs
  const [currentStock, setCurrentStock] = useState<number | ''>('');
  const [dailySales, setDailySales] = useState<number | ''>('');
  const [leadTime, setLeadTime] = useState<number | ''>(''); // Days to receive goods
  const [targetDays, setTargetDays] = useState<number>(30); // How many days of stock you want to keep

  // Outputs
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [stockoutDate, setStockoutDate] = useState<string>('-');
  const [reorderDate, setReorderDate] = useState<string>('-');
  const [unitsToOrder, setUnitsToOrder] = useState<number>(0);
  const [status, setStatus] = useState<string>('Enter Data');

  useEffect(() => {
    const stock = Number(currentStock) || 0;
    const sales = Number(dailySales) || 0;
    const lead = Number(leadTime) || 0;

    if (sales > 0 && stock >= 0) {
      // 1. Days Remaining
      const daysLeft = stock / sales;
      setDaysRemaining(daysLeft);

      // 2. Stockout Date
      const today = new Date();
      const outDate = new Date();
      outDate.setDate(today.getDate() + daysLeft);
      setStockoutDate(outDate.toDateString());

      // 3. Reorder Point (Date)
      // You need to order when you have enough stock left ONLY to cover the lead time
      // Buffer = Lead Time * Daily Sales
      const bufferUnits = lead * sales;
      
      // If current stock is ALREADY lower than buffer, you are late!
      let statusMsg = '';
      if (stock <= bufferUnits) {
        statusMsg = 'URGENT: Order Now!';
      } else {
        // Days until you hit the buffer
        const daysUntilReorder = (stock - bufferUnits) / sales;
        const reorderDt = new Date();
        reorderDt.setDate(today.getDate() + daysUntilReorder);
        setReorderDate(reorderDt.toDateString());
        statusMsg = 'Stock Healthy';
      }
      setStatus(statusMsg);

      // 4. Quantity to Order
      // Goal: Cover Lead Time + Target Days
      // Formula: (Daily Sales * (Lead Time + Target Days)) - Current Stock
      // But usually, you just order (Daily Sales * Target Days) if you order right on time.
      // Let's simplify: How much to buy to last 'Target Days' from today?
      const suggestedOrder = (sales * targetDays) - (statusMsg.includes('URGENT') ? 0 : 0); 
      // Actually, simple logic: I want to have stock for X days.
      const needed = Math.ceil(sales * targetDays);
      setUnitsToOrder(needed);

    } else {
      setDaysRemaining(0);
      setStockoutDate('-');
      setReorderDate('-');
      setStatus('Enter Sales Data');
    }
  }, [currentStock, dailySales, leadTime, targetDays]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Inventory & Restock Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Calculate when you will run out of stock and how much to reorder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock (Units)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 500"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Daily Sales (Units/Day)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 10"
                value={dailySales}
                onChange={(e) => setDailySales(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lead Time (Days)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Supplier time"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                  />
                  <div className="text-xs text-gray-400 mt-1">Days to arrive</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cover Goal (Days)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={targetDays}
                    onChange={(e) => setTargetDays(Number(e.target.value))}
                  />
                  <div className="text-xs text-gray-400 mt-1">Stock to buy</div>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
            
            {/* Status Badge */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">Stock Analysis</h2>
                <p className="text-xs text-slate-400">Based on sales velocity</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                status.includes('URGENT') ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'
              }`}>
                {status}
              </span>
            </div>

            <div className="space-y-4 my-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-300 text-sm">Days Until Empty:</span>
                <span className="text-2xl font-mono font-bold">{Math.floor(daysRemaining)} Days</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-300 text-sm">Estimated Stockout:</span>
                <span className="font-medium text-orange-300">{stockoutDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Latest Reorder Date:</span>
                <span className={`font-bold ${status.includes('URGENT') ? 'text-red-400' : 'text-blue-400'}`}>
                   {status.includes('URGENT') ? 'TODAY' : reorderDate}
                </span>
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-xs uppercase text-slate-400 mb-1">Recommended Order Qty</p>
              <p className="text-3xl font-extrabold text-white">{unitsToOrder} Units</p>
              <p className="text-xs text-slate-400 mt-1">To cover next {targetDays} days</p>
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