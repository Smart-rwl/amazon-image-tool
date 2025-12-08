'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  BookOpen,
  Activity,
  CheckCircle2 // <--- Added this missing import
} from 'lucide-react';

export default function AccountHealthIntelligence() {
  // --- STATE ---
  
  // 1. Current Health
  const [totalOrders, setTotalOrders] = useState<number>(120);
  const [defects, setDefects] = useState<number>(2); // A-to-Z + Negative Feedback
  
  // 2. Velocity
  const [dailyVelocity, setDailyVelocity] = useState<number>(5); // Orders per day

  // 3. Outputs
  const [metrics, setMetrics] = useState({
    currentODR: 0,
    ordersNeeded: 0,
    daysToRecover: 0,
    status: 'safe' as 'safe' | 'warning' | 'critical' | 'suspended',
    riskScore: 0
  });

  // --- ENGINE ---
  useEffect(() => {
    // A. Current ODR
    const odr = totalOrders > 0 ? (defects / totalOrders) * 100 : 0;
    
    // B. Recovery Math (Target < 1%)
    // Formula: defects / (totalOrders + X) = 0.009 (Target 0.9%)
    // defects = 0.009 * (totalOrders + X)
    // defects / 0.009 = totalOrders + X
    // X = (defects / 0.009) - totalOrders
    
    const targetRate = 0.009; // 0.9% safety buffer
    let needed = 0;
    
    if (odr >= 1) {
      const requiredTotal = defects / targetRate;
      needed = Math.ceil(requiredTotal - totalOrders);
    }

    // C. Time to Recover
    const days = dailyVelocity > 0 ? Math.ceil(needed / dailyVelocity) : 0;

    // D. Risk Logic
    let status: 'safe' | 'warning' | 'critical' | 'suspended' = 'safe';
    let risk = 0; // 0-100 scale for UI gauge

    if (odr < 1) {
      status = 'safe';
      risk = (odr / 1) * 60; // 0% to 60% gauge fill
    } else if (odr < 1.5) {
      status = 'warning';
      risk = 75;
    } else {
      status = 'critical';
      risk = 95;
    }

    // "Impossible" check
    if (needed > 500 && dailyVelocity < 10) {
      status = 'suspended'; // Math alone won't save you
    }

    setMetrics({
      currentODR: odr,
      ordersNeeded: needed > 0 ? needed : 0,
      daysToRecover: days,
      status,
      riskScore: risk
    });

  }, [totalOrders, defects, dailyVelocity]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {metrics.status === 'safe' ? <ShieldCheck className="w-8 h-8 text-emerald-500" /> : <ShieldAlert className="w-8 h-8 text-red-500" />}
              Account Health Intelligence
            </h1>
            <p className="text-slate-400 mt-2">
              Order Defect Rate (ODR) Simulator & Recovery Planner.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
             <Activity className="w-4 h-4 text-blue-500" />
             <span className="text-sm font-medium text-slate-300">
                Risk Status: <span className={metrics.status === 'safe' ? 'text-emerald-400' : 'text-red-400 uppercase'}>{metrics.status}</span>
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Health Inputs */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-blue-400" /> 60-Day Data
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Total Orders (60 Days)</label>
                     <input type="number" value={totalOrders} onChange={e => setTotalOrders(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Defects (Neg + Claims)</label>
                     <input type="number" value={defects} onChange={e => setDefects(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-red-500 outline-none" />
                  </div>
                  
                  <div className="h-px bg-slate-800 my-2"></div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Avg Daily Sales (Now)</label>
                     <input type="number" value={dailyVelocity} onChange={e => setDailyVelocity(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-emerald-500 outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Used to calculate recovery time.</p>
                  </div>
               </div>
            </div>

            {/* 2. Amazon Limit */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" /> Policy Limit
               </h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Amazon suspends accounts with ODR above <b>1%</b>. 
                  <br/><br/>
                  The "Order Defect Rate" window is rolling 60 days. Defects drop off automatically after 60 days.
               </p>
            </div>

          </div>

          {/* --- RIGHT: INTELLIGENCE PANEL (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. ODR Dashboard */}
            <div className={`rounded-xl border p-8 shadow-2xl relative overflow-hidden ${
               metrics.status === 'safe' ? 'bg-emerald-950/30 border-emerald-900' : 'bg-red-950/30 border-red-900'
            }`}>
               <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                  <div className="space-y-2">
                     <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Current ODR</span>
                     <div className="text-6xl font-extrabold text-white">
                        {metrics.currentODR.toFixed(2)}%
                     </div>
                     <p className="text-sm text-slate-400">
                        Target: &lt; 1.00%
                     </p>
                  </div>

                  {/* Gauge Visual */}
                  <div className="flex-1 w-full md:max-w-xs">
                     <div className="h-4 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
                        <div 
                           className={`h-full transition-all duration-700 ${
                              metrics.status === 'safe' ? 'bg-emerald-500' : metrics.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                           }`} 
                           style={{ width: `${metrics.riskScore}%` }}
                        ></div>
                        {/* 1% Limit Marker */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: '60%' }} title="1% Threshold"></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase font-bold">
                        <span>Safe</span>
                        <span className="text-white">1% Limit</span>
                        <span>Suspension</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Recovery Plan */}
            {metrics.ordersNeeded > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Dilution Target
                     </h3>
                     <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{metrics.ordersNeeded}</span>
                        <span className="text-sm text-slate-400">orders</span>
                     </div>
                     <p className="text-xs text-slate-500">
                        You need {metrics.ordersNeeded} perfect orders to dilute your bad rate down to 0.9%.
                     </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Time to Safety
                     </h3>
                     {metrics.status === 'suspended' ? (
                        <div className="text-red-400 font-bold text-sm">
                           Math won't save you.
                        </div>
                     ) : (
                        <div className="flex items-baseline gap-2 mb-2">
                           <span className="text-4xl font-bold text-white">{metrics.daysToRecover}</span>
                           <span className="text-sm text-slate-400">days</span>
                        </div>
                     )}
                     <p className="text-xs text-slate-500">
                        Based on your velocity of {dailyVelocity} sales/day.
                     </p>
                  </div>

               </div>
            ) : (
               <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Your Account is Healthy</h3>
                  <p className="text-slate-400 mt-2">No dilution orders needed. Keep up the good work!</p>
               </div>
            )}

            {/* 3. Action Guide */}
            {metrics.status !== 'safe' && (
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Recommended Action</h3>
                  
                  {metrics.status === 'suspended' ? (
                     <div className="space-y-2 text-sm text-red-200">
                        <p>🔴 <b>Critical Situation:</b> You need too many orders ({metrics.ordersNeeded}) to recover naturally.</p>
                        <p>👉 <b>Do not wait.</b> Prepare a "Plan of Action" (POA) for Amazon. Explain the root cause and how you fixed it.</p>
                     </div>
                  ) : (
                     <div className="space-y-2 text-sm text-yellow-100">
                        <p>🟡 <b>Dilution Strategy:</b> Run a <b>Lightning Deal</b> or aggressive <b>Coupon</b> immediately.</p>
                        <p>👉 Use the "Discount Planner" tool to find a break-even price. Your goal is volume, not profit, until ODR is safe.</p>
                     </div>
                  )}
               </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}