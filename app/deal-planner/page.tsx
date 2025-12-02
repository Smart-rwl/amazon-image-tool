'use client';

import React, { useState, useEffect } from 'react';

export default function DealPlanner() {
  // Inputs
  const [regularPrice, setRegularPrice] = useState<number | ''>('');
  const [totalCost, setTotalCost] = useState<number | ''>(''); // Product + Ship + Fees + GST
  
  // The table data
  const [dataRows, setDataRows] = useState<any[]>([]);

  useEffect(() => {
    const price = Number(regularPrice) || 0;
    const cost = Number(totalCost) || 0;

    if (price > 0) {
      const rows = [];
      // Generate rows for 5% to 75% discount
      for (let discount = 5; discount <= 75; discount += 5) {
        const dealPrice = price - (price * (discount / 100));
        
        // Note: Amazon Referral fees usually drop slightly if price drops, 
        // but for safety planning, we assume Fixed Cost stays same or user input "Variable Cost"
        // To be safe: Profit = DealPrice - Cost
        const profit = dealPrice - cost;
        const margin = (profit / dealPrice) * 100;

        rows.push({
          discount,
          dealPrice,
          profit,
          margin,
          isProfitable: profit > 0
        });
      }
      setDataRows(rows);
    } else {
      setDataRows([]);
    }
  }, [regularPrice, totalCost]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Discount & Deal Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Visualize your profit at every discount level. Don't run a loss by accident.
          </p>
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Regular Selling Price (₹)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 1000"
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Break-Even Cost (₹)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Product + Fees + Ship + GST"
              value={totalCost}
              onChange={(e) => setTotalCost(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">Total cost to get product to customer.</p>
          </div>
        </div>

        {/* THE TABLE */}
        {dataRows.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Discount</th>
                  <th scope="col" className="px-6 py-3">New Price</th>
                  <th scope="col" className="px-6 py-3">Net Profit</th>
                  <th scope="col" className="px-6 py-3">Margin</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row) => (
                  <tr key={row.discount} className={`border-b hover:bg-gray-50 ${row.isProfitable ? 'bg-white' : 'bg-red-50'}`}>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {row.discount}% OFF
                    </td>
                    <td className="px-6 py-4">
                      ₹{row.dealPrice.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 font-bold ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{row.profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {row.margin.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      {row.isProfitable ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Safe</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">LOSS</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            Enter your price and costs above to generate the deal matrix.
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-xs text-yellow-800">
          <strong>Tip:</strong> Amazon Lightning Deals usually require a minimum 20% discount. Check the 20% row to ensure you are still profitable!
        </div>

      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Created by SmartRwl
      </div>
    </div>
  );
}