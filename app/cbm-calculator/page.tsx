'use client';

import React, { useState, useEffect } from 'react';

export default function CbmCalculator() {
  // Inputs
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [cartonCount, setCartonCount] = useState<number | ''>('');
  const [cartonWeight, setCartonWeight] = useState<number | ''>(''); // kg per carton
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

  // Outputs
  const [totalCbm, setTotalCbm] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [totalVolumetric, setTotalVolumetric] = useState<number>(0);

  useEffect(() => {
    const len = Number(length) || 0;
    const wid = Number(width) || 0;
    const hgt = Number(height) || 0;
    const qty = Number(cartonCount) || 0;
    const wgt = Number(cartonWeight) || 0;

    if (len > 0 && wid > 0 && hgt > 0 && qty > 0) {
      
      // 1. Convert everything to Meters
      let l_m = 0, w_m = 0, h_m = 0;
      
      if (unit === 'cm') {
        l_m = len / 100;
        w_m = wid / 100;
        h_m = hgt / 100;
      } else {
        // Inch to Meter (1 inch = 0.0254 m)
        l_m = len * 0.0254;
        w_m = wid * 0.0254;
        h_m = hgt * 0.0254;
      }

      // 2. Calculate CBM per carton & Total
      const cbmPerCarton = l_m * w_m * h_m;
      const totalVol = cbmPerCarton * qty;
      
      // 3. Volumetric Weight (Air Freight Standard: Divisor 6000 or 5000)
      // Standard Air Formula: (L*W*H in cm) / 6000 * Qty
      // Or CBM * 167
      const volWeightAir = totalVol * 167; // approx kg per cbm standard

      setTotalCbm(totalVol);
      setTotalWeight(wgt * qty);
      setTotalVolumetric(volWeightAir);

    } else {
      setTotalCbm(0);
      setTotalWeight(0);
      setTotalVolumetric(0);
    }
  }, [length, width, height, cartonCount, cartonWeight, unit]);

  // Container Capacities (approx safe load)
  const CONT_20 = 28; // 28 CBM
  const CONT_40 = 58; // 58 CBM
  const CONT_40HQ = 68; // 68 CBM

  const getContainerPercent = (max: number) => {
    return Math.min((totalCbm / max) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            CBM & Container Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Calculate cubic volume for shipping and check container fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INPUTS */}
          <div className="space-y-6">
            
            <div className="flex justify-end">
               <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold">
                 <button onClick={() => setUnit('cm')} className={`px-3 py-1 rounded ${unit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>CM</button>
                 <button onClick={() => setUnit('inch')} className={`px-3 py-1 rounded ${unit === 'inch' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Inches</button>
               </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 text-sm mb-3">Single Carton Details</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input type="number" placeholder={`L (${unit})`} className="p-2 rounded border" value={length} onChange={e => setLength(Number(e.target.value))} />
                <input type="number" placeholder={`W (${unit})`} className="p-2 rounded border" value={width} onChange={e => setWidth(Number(e.target.value))} />
                <input type="number" placeholder={`H (${unit})`} className="p-2 rounded border" value={height} onChange={e => setHeight(Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="text-xs font-bold text-gray-500">Total Cartons</label>
                   <input type="number" className="w-full p-2 rounded border" value={cartonCount} onChange={e => setCartonCount(Number(e.target.value))} />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-500">Weight/Carton (kg)</label>
                   <input type="number" className="w-full p-2 rounded border" value={cartonWeight} onChange={e => setCartonWeight(Number(e.target.value))} />
                 </div>
              </div>
            </div>

          </div>

          {/* RESULTS */}
          <div className="flex flex-col space-y-6">
            
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg text-center">
              <p className="text-xs text-blue-200 uppercase tracking-widest mb-2">Total Shipment Volume</p>
              <div className="text-5xl font-extrabold flex items-baseline justify-center">
                 {totalCbm.toFixed(3)} <span className="text-lg ml-2">m³</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-blue-400/50 pt-4">
                <div>
                   <p className="text-xs text-blue-200">Gross Weight</p>
                   <p className="font-bold text-xl">{totalWeight} kg</p>
                </div>
                <div>
                   <p className="text-xs text-blue-200">Volumetric (Air)</p>
                   <p className="font-bold text-xl">{totalVolumetric.toFixed(1)} kg</p>
                </div>
              </div>
            </div>

            {/* CONTAINER VISUALIZATION */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
               <h4 className="font-bold text-gray-700 text-sm">Container Fit</h4>
               
               {/* 20ft */}
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span>20ft Container (28 cbm)</span>
                   <span className={totalCbm > CONT_20 ? 'text-red-500 font-bold' : 'text-gray-500'}>{getContainerPercent(CONT_20).toFixed(1)}% Full</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                   <div className={`h-2 rounded-full ${totalCbm > CONT_20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${getContainerPercent(CONT_20)}%` }}></div>
                 </div>
               </div>

               {/* 40ft */}
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span>40ft Container (58 cbm)</span>
                   <span className={totalCbm > CONT_40 ? 'text-red-500 font-bold' : 'text-gray-500'}>{getContainerPercent(CONT_40).toFixed(1)}% Full</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                   <div className={`h-2 rounded-full ${totalCbm > CONT_40 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${getContainerPercent(CONT_40)}%` }}></div>
                 </div>
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