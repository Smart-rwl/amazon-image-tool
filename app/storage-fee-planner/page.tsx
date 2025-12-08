'use client';

import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Calendar, 
  AlertTriangle, 
  DollarSign, 
  Box, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Snowflake
} from 'lucide-react';

const CM3_TO_FT3 = 28316.8; 

export default function WarehouseCostAnalyzer() {
  // --- STATE ---
  
  // 1. Product Data
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(5);
  const [units, setUnits] = useState<number>(500);

  // 2. Fee Config
  const [baseRate, setBaseRate] = useState<number>(45); // e.g. ₹45/ft3 (Standard)
  const [peakRate, setPeakRate] = useState<number>(150); // e.g. ₹150/ft3 (Oct-Dec)
  const [ltsfRate, setLtsfRate] = useState<number>(600); // e.g. ₹600/ft3 (Aged)

  // 3. Output
  const [metrics, setMetrics] = useState({
    unitVolFt: 0,
    totalVolFt: 0,
    monthlyStandard: 0,
    monthlyPeak: 0,
    potentialLTSF: 0,
    annualCost: 0,
    status: 'efficient' as 'efficient' | 'heavy'
  });

  // --- ENGINE ---
  useEffect(() => {
    // A. Volume Calculation
    const volCm = length * width * height;
    const volFt = volCm / CM3_TO_FT3;
    const totalFt = volFt * units;

    // B. Cost Projections
    const costStd = totalFt * baseRate;
    const costPeak = totalFt * peakRate;
    const costLtsf = totalFt * ltsfRate; // Penalty if aged

    // C. Annual Cost (Assuming 9 months std, 3 months peak)
    const annual = (costStd * 9) + (costPeak * 3);

    let status: 'efficient' | 'heavy' = 'efficient';
    if (volFt > 0.1) status = 'heavy'; // Large item warning

    setMetrics({
      unitVolFt: volFt,
      totalVolFt: totalFt,
      monthlyStandard: costStd,
      monthlyPeak: costPeak,
      potentialLTSF: costLtsf,
      annualCost: annual,
      status
    });

  }, [length, width, height, units, baseRate, peakRate, ltsfRate]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Archive className="w-8 h-8 text-indigo-500" />
              Warehouse Cost Analyzer
            </h1>
            <p className="text-slate-400 mt-2">
              Predict storage fees, peak season surges, and long-term penalties.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-400">
             <Box className="w-4 h-4 text-emerald-500" />
             <span>Total Volume: {metrics.totalVolFt.toFixed(2)} ft³</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Dimensions */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Box className="w-4 h-4 text-blue-400" /> Product Specs
               </h3>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">L (cm)</label>
                        <input type="number" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-center focus:border-blue-500 outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">W (cm)</label>
                        <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-center focus:border-blue-500 outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">H (cm)</label>
                        <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-center focus:border-blue-500 outline-none" />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Total Units Stocked</label>
                     <input type="number" value={units} onChange={e => setUnits(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
               </div>
            </div>

            {/* 2. Rate Card */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Fee Rates (per ft³)
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Standard Month (Jan-Sep)</label>
                     <input type="number" value={baseRate} onChange={e => setBaseRate(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Peak Season (Oct-Dec)</label>
                     <input type="number" value={peakRate} onChange={e => setPeakRate(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-red-400 uppercase mb-1 block">LTSF Penalty (365+ Days)</label>
                     <input type="number" value={ltsfRate} onChange={e => setLtsfRate(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-red-500 outline-none" />
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT: PROJECTIONS (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Monthly Liability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar className="w-24 h-24 text-white" /></div>
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Standard Monthly Fee</h3>
                  <div className="text-4xl font-extrabold text-white mb-1">{fmt(metrics.monthlyStandard)}</div>
                  <p className="text-[10px] text-slate-400">Total volume x Base Rate</p>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Snowflake className="w-24 h-24 text-blue-300" /></div>
                  <h3 className="text-xs font-bold uppercase text-blue-300 mb-2">Peak Season Fee</h3>
                  <div className="text-4xl font-extrabold text-blue-200 mb-1">{fmt(metrics.monthlyPeak)}</div>
                  <p className="text-[10px] text-slate-400">Triples during Q4 (Oct-Dec)</p>
               </div>

            </div>

            {/* 2. LTSF Warning */}
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
               <div className="p-4 bg-red-900/20 rounded-full">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-red-400 mb-2">Long-Term Storage Danger</h3>
                  <p className="text-sm text-red-200/70 leading-relaxed mb-4">
                     If this inventory sits unsold for 365 days, Amazon will charge you a massive penalty fee.
                  </p>
                  <div className="text-5xl font-mono font-black text-red-500">{fmt(metrics.potentialLTSF)}</div>
                  <p className="text-xs text-red-400/50 mt-1">Projected monthly penalty</p>
               </div>
            </div>

            {/* 3. Annual Projection */}
            <div className="bg-indigo-900/10 border border-indigo-900/50 rounded-xl p-6">
               <h3 className="text-xs font-bold uppercase text-indigo-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Annual Liability Forecast
               </h3>
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="space-y-1">
                     <span className="text-xs text-slate-400 block">Total Holding Cost (1 Year)</span>
                     <span className="text-3xl font-bold text-white">{fmt(metrics.annualCost)}</span>
                  </div>
                  <div className="h-8 w-px bg-indigo-900 hidden md:block"></div>
                  <div className="flex-1 text-xs text-indigo-200/70 leading-relaxed">
                     This projection assumes you sell nothing and hold stock for 12 months. It includes 9 months of Standard fees and 3 months of Peak fees.
                  </div>
               </div>
            </div>

          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Storage Strategy Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Box className="w-5 h-5 text-blue-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">CBM vs. Cubic Foot</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Factories use CBM. Amazon uses Cubic Feet. The conversion factor is <b>28,316</b> (1 CBM approx 35.3 ft³). This tool does that math for you.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The LTSF Trap</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Long Term fees are <b>10x-20x higher</b> than normal fees. Never keep stock older than 365 days. Liquidate or donate it before the deadline.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Snowflake className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Q4 Peak Season</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    In October, November, and December, Amazon triples the storage fee. Do not overstock for Q4 unless your sales velocity justifies it.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}