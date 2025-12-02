'use client';

import React, { useState } from 'react';

export default function VolumetricCalculator() {
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [actualWeight, setActualWeight] = useState<number | ''>('');
  const [divisor, setDivisor] = useState<number>(5000); // Standard divisor

  // Helper to calculate
  const volWeight = (Number(length) * Number(width) * Number(height)) / divisor;
  const deadWeight = Number(actualWeight) || 0;
  
  // The courier charges the HIGHER of the two
  const chargeableWeight = Math.max(volWeight, deadWeight);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Volumetric Weight Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Find out if couriers will charge you for Weight or Volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Package Dimensions (cm)</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">Length</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Width</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Height</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>

            <h3 className="font-bold text-gray-700 pt-2">Actual Weight (kg)</h3>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 0.5"
              value={actualWeight}
              onChange={(e) => setActualWeight(Number(e.target.value))}
            />

            <div className="pt-2">
              <label className="text-xs text-gray-500 block mb-1">Courier Divisor</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={divisor}
                onChange={(e) => setDivisor(Number(e.target.value))}
              >
                <option value={5000}>5000 (Standard - Amazon/Flipkart/BlueDart)</option>
                <option value={4000}>4000 (FedEx International/Some Surface)</option>
                <option value={4500}>4500 (Other Couriers)</option>
              </select>
            </div>
          </div>

          {/* RESULTS */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-center space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-sm text-gray-600">Volumetric Weight:</span>
              <span className="font-mono font-bold text-lg text-gray-700">
                {volWeight.toFixed(3)} kg
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-sm text-gray-600">Actual Weight:</span>
              <span className="font-mono font-bold text-lg text-gray-700">
                {deadWeight.toFixed(3)} kg
              </span>
            </div>

            <div className="bg-blue-600 text-white p-4 rounded-lg text-center shadow-md">
              <p className="text-xs uppercase opacity-75 mb-1">Final Chargeable Weight</p>
              <p className="text-3xl font-extrabold">
                {chargeableWeight.toFixed(3)} kg
              </p>
              <p className="text-xs mt-2 opacity-90">
                Courier will charge based on {volWeight > deadWeight ? 'Volume' : 'Actual Weight'}.
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