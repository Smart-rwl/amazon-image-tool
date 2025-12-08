'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  DollarSign, 
  BarChart3,
  BookOpen,
  Target
} from 'lucide-react';

export default function SalesVelocitySimulator() {
  // --- STATE ---
  
  // 1. Current State
  const [currentPrice, setCurrentPrice] = useState<number>(1000);
  const [unitCost, setUnitCost] = useState<number>(600);
  const [currentVolume, setCurrentVolume] = useState<number>(100); // Monthly units

  // 2. Strategy
  const [targetPrice, setTargetPrice] = useState<number>(900); // Proposed price drop

  // 3. Outputs
  const [metrics, setMetrics] = useState({
    currentMargin: 0,
    newMargin: 0,
    profitGap: 0,
    requiredVolume: 0,
    volumeIncreasePct: 0,
    status: 'safe' as 'safe' | 'risky' | 'impossible'
  });

  // --- ENGINE ---
  useEffect(() => {
    // A. Current Economics
    const currMargin = currentPrice - unitCost;
    const totalCurrProfit = currMargin * currentVolume;

    // B. New Economics
    const newMargin = targetPrice - unitCost;
    
    // C. Break Even Volume Logic
    // Total Profit must match or exceed current total profit
    // NewMargin * NewVolume = TotalCurrProfit
    
    let reqVol = 0;
    let increasePct = 0;
    let status: 'safe' | 'risky' | 'impossible' = 'safe';

    if (newMargin <= 0) {
      status = 'impossible'; // Losing money per unit
    } else {
      reqVol = Math.ceil(totalCurrProfit / newMargin);
      increasePct = ((reqVol - currentVolume) / currentVolume) * 100;

      // Risk Analysis
      if (increasePct > 100) status = 'impossible'; // Doubling sales is very hard
      else if (increasePct > 30) status = 'risky'; // 30% jump is significant
      else status = 'safe'; // <30% lift is achievable with price drop
    }

    setMetrics({
      currentMargin: currMargin,
      newMargin: newMargin,
      profitGap: currMargin - newMargin,
      requiredVolume: reqVol,
      volumeIncreasePct: increasePct,
      status
    });

  }, [currentPrice, unitCost, currentVolume, targetPrice]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Scale className="w-8 h-8 text-indigo-500" />
              Sales Velocity Simulator
            </h1>
            <p className="text-slate-400 mt-2">
              Calculate the sales volume increase needed to justify a price drop.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
             <Target className="w-4 h-4 text-blue-500" />
             <span className="text-sm font-medium text-slate-300">
                Strategy Risk: <span className={metrics.status === 'safe' ? 'text-emerald-400' : 'text-red-400 uppercase'}>{metrics.status}</span>
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Baseline */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-blue-400" /> Current Baseline
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Current Price</label>
                     <input type="number" value={currentPrice} onChange={e => setCurrentPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Unit Cost (Landed)</label>
                     <input type="number" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Monthly Sales (Units)</label>
                     <input type="number" value={currentVolume} onChange={e => setCurrentVolume(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
               </div>
            </div>

            {/* 2. Strategy */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <TrendingDown className="w-4 h-4 text-emerald-400" /> Proposed Price Drop
               </h3>
               
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Target Price</label>
                  <input type="number" value={targetPrice} onChange={e => setTargetPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-emerald-500/50 rounded p-3 text-emerald-400 font-bold text-lg focus:border-emerald-500 outline-none" />
                  <p className="text-[10px] text-slate-500 mt-2">
                     Drop of {currentPrice - targetPrice > 0 ? fmt(currentPrice - targetPrice) : '0'} per unit.
                  </p>
               </div>
            </div>

          </div>

          {/* --- RIGHT: INTELLIGENCE PANEL (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Main KPI Dashboard */}
            <div className={`rounded-xl border p-8 shadow-2xl relative overflow-hidden ${
               metrics.status === 'impossible' ? 'bg-red-950/30 border-red-900' : 'bg-slate-900 border-slate-800'
            }`}>
               <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                  <div className="space-y-2">
                     <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Required Volume Target</span>
                     <div className="text-6xl font-extrabold text-white">
                        {metrics.requiredVolume} <span className="text-2xl font-medium text-slate-400">units</span>
                     </div>
                     <p className="text-sm text-slate-400">
                        To maintain current total profit.
                     </p>
                  </div>

                  {/* Growth Meter */}
                  <div className="bg-slate-950/50 p-6 rounded-xl border border-white/10 text-center min-w-[200px]">
                     <p className="text-xs text-slate-400 uppercase font-bold mb-2">Sales Lift Needed</p>
                     <div className={`text-3xl font-bold ${metrics.volumeIncreasePct > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        +{metrics.volumeIncreasePct.toFixed(0)}%
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Profit Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                     <DollarSign className="w-4 h-4" /> Margin Compression
                  </h3>
                  <div className="flex items-center gap-4">
                     <div>
                        <p className="text-xs text-slate-400">Old Margin</p>
                        <p className="text-xl font-mono text-white">{fmt(metrics.currentMargin)}</p>
                     </div>
                     <TrendingDown className="w-5 h-5 text-red-500" />
                     <div>
                        <p className="text-xs text-slate-400">New Margin</p>
                        <p className="text-xl font-mono text-white">{fmt(metrics.newMargin)}</p>
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 bg-slate-950 p-2 rounded">
                     You lose <b>{fmt(metrics.profitGap)}</b> profit on every single unit sold.
                  </p>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                     <BarChart3 className="w-4 h-4" /> Feasibility Check
                  </h3>
                  {metrics.status === 'impossible' ? (
                     <div className="text-red-400 text-sm">
                        <p className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Critical Warning</p>
                        <p className="mt-2 opacity-80">You are selling at a loss or need an impossible sales increase. Abort strategy.</p>
                     </div>
                  ) : metrics.status === 'risky' ? (
                     <div className="text-yellow-400 text-sm">
                        <p className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> High Risk</p>
                        <p className="mt-2 opacity-80">Requiring a {metrics.volumeIncreasePct.toFixed(0)}% sales boost is aggressive. Do you have ads budget to support this?</p>
                     </div>
                  ) : (
                     <div className="text-emerald-400 text-sm">
                        <p className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Strategy Viable</p>
                        <p className="mt-2 opacity-80">A {metrics.volumeIncreasePct.toFixed(0)}% sales lift is realistic for this price drop. Go for it.</p>
                     </div>
                  )}
               </div>

            </div>

          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Price Elasticity Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The Volume Trap</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Most sellers think "lower price = more money". 
                    <br/>
                    <b>Reality:</b> A 10% price cut often requires a 50% increase in sales volume just to make the <i>same</i> total profit. Use this tool to see the truth.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">When to Drop Price?</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    1. To clear dead stock (Liquidation).
                    <br/>
                    2. To boost BSR (Best Seller Rank) temporarily.
                    <br/>
                    3. To steal the Buy Box from a competitor.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Impossible Scenarios</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    If the tool says you need <b>+300% sales</b>, stop. 
                    Unless you are spending heavily on ads (which costs even more money), organic sales rarely triple just because of a small discount.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}