'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3,
  BookOpen,
  PieChart
} from 'lucide-react';

export default function AdProfitabilityEngine() {
  // --- STATE ---
  
  // 1. Campaign Data
  const [adSpend, setAdSpend] = useState<number>(5000);
  const [adSales, setAdSales] = useState<number>(15000);
  const [totalSales, setTotalSales] = useState<number>(45000); // Organic + Ad Sales
  
  // 2. Unit Economics
  const [cpc, setCpc] = useState<number>(15); // Cost per Click
  const [sellingPrice, setSellingPrice] = useState<number>(1000);
  const [landedCost, setLandedCost] = useState<number>(400); // Product + Fees

  // 3. Outputs
  const [metrics, setMetrics] = useState({
    acos: 0,
    roas: 0,
    tacos: 0,
    breakEvenAcos: 0,
    maxSafeBid: 0,
    netAdProfit: 0,
    conversionRate: 0,
    status: 'healthy' as 'profitable' | 'break-even' | 'loss'
  });

  // --- ENGINE ---
  useEffect(() => {
    // A. Basic Ad Metrics
    const acos = adSales > 0 ? (adSpend / adSales) * 100 : 0;
    const roas = adSpend > 0 ? adSales / adSpend : 0;
    
    // B. Advanced TACoS (Total Ad Cost of Sales)
    // Spend / Total Revenue. Ideally < 15%
    const tacos = totalSales > 0 ? (adSpend / totalSales) * 100 : 0;

    // C. Profitability Limits
    const profitMargin = sellingPrice - landedCost;
    const marginPct = sellingPrice > 0 ? (profitMargin / sellingPrice) * 100 : 0;
    
    // Break Even ACOS = Profit Margin %
    // If you spend 30% on ads and have 30% margin, you make 0.
    const beAcos = marginPct;

    // D. Max Safe Bid
    // Bid = Price * ConversionRate * TargetACOS
    // But we need Conversion Rate first.
    // Clicks = Spend / CPC
    // Orders = Sales / Price
    // CR = Orders / Clicks
    const clicks = cpc > 0 ? adSpend / cpc : 0;
    const orders = sellingPrice > 0 ? adSales / sellingPrice : 0;
    const cr = clicks > 0 ? (orders / clicks) * 100 : 0;

    // Max Bid to Break Even = Price * CR% * Margin%
    // Simplified: Profit per unit * CR%
    const maxBid = profitMargin * (cr / 100);

    // E. Status
    let status: 'profitable' | 'break-even' | 'loss' = 'profitable';
    if (acos > beAcos) status = 'loss';
    else if (acos > beAcos - 5) status = 'break-even';

    // F. Net Ad Profit (Ad Sales - Spend - COGS of Ad Sales)
    const costOfAdGoods = orders * landedCost;
    const netProfit = adSales - adSpend - costOfAdGoods;

    setMetrics({
      acos,
      roas,
      tacos,
      breakEvenAcos: beAcos,
      maxSafeBid: maxBid,
      netAdProfit: netProfit,
      conversionRate: cr,
      status
    });

  }, [adSpend, adSales, totalSales, cpc, sellingPrice, landedCost]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              Ad Profitability Engine
            </h1>
            <p className="text-slate-400 mt-2">
              Advanced ACOS, TACoS, and Bid Optimization Calculator.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
             <div className={`w-3 h-3 rounded-full ${
                metrics.status === 'profitable' ? 'bg-emerald-500' : 
                metrics.status === 'break-even' ? 'bg-yellow-500' : 'bg-red-500'
             }`}></div>
             <span className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                Campaign Health: {metrics.status}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Ad Performance */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Campaign Data
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ad Spend (₹)</label>
                     <input type="number" value={adSpend} onChange={e => setAdSpend(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ad Sales (Revenue)</label>
                     <input type="number" value={adSales} onChange={e => setAdSales(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Total Sales (Ad + Organic)</label>
                     <input type="number" value={totalSales} onChange={e => setTotalSales(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Required for TACoS calculation.</p>
                  </div>
               </div>
            </div>

            {/* 2. Unit Metrics */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-emerald-400" /> Unit Economics
               </h3>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">CPC (Avg)</label>
                        <input type="number" value={cpc} onChange={e => setCpc(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Price</label>
                        <input type="number" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Landed Cost</label>
                     <input type="number" value={landedCost} onChange={e => setLandedCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Product Cost + Shipping + Amazon Fees</p>
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT: INTELLIGENCE PANEL (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* ACOS */}
               <div className={`rounded-xl border p-6 ${
                  metrics.status === 'loss' ? 'bg-red-950/20 border-red-900' : 'bg-slate-900 border-slate-800'
               }`}>
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-400 uppercase">ACOS</span>
                     <TrendingUp className={`w-4 h-4 ${metrics.status === 'loss' ? 'text-red-500' : 'text-emerald-500'}`} />
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{metrics.acos.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500">
                     Break-Even Limit: <span className="text-slate-300">{metrics.breakEvenAcos.toFixed(1)}%</span>
                  </p>
               </div>

               {/* ROAS */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-400 uppercase">ROAS</span>
                     <DollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{metrics.roas.toFixed(2)}x</div>
                  <p className="text-[10px] text-slate-500">
                     Return on Ad Spend
                  </p>
               </div>

               {/* TACoS */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-400 uppercase">TACoS</span>
                     <PieChart className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{metrics.tacos.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500">
                     Total Spend / Total Revenue. Target &lt; 15%
                  </p>
               </div>

            </div>

            {/* 2. Profitability Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="w-48 h-48 text-white" />
               </div>
               
               <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Net Ad Profit</h3>
                  
                  <div className="flex items-baseline gap-4 mb-4">
                     <span className={`text-5xl font-extrabold ${metrics.netAdProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {metrics.netAdProfit > 0 ? '+' : ''}{fmt(metrics.netAdProfit)}
                     </span>
                     <span className="text-slate-400 text-sm">from paid traffic</span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-lg p-4 border border-slate-800 flex gap-4 text-xs">
                     {metrics.netAdProfit > 0 ? (
                        <p className="text-emerald-400 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4" /> 
                           Your ads are generating real profit after product costs. Scale up!
                        </p>
                     ) : (
                        <p className="text-red-400 flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4" /> 
                           You are losing money on every ad sale. Lower bids or improve conversion.
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* 3. Bid Optimizer */}
            <div className="bg-indigo-900/10 border border-indigo-900/50 rounded-xl p-6">
               <h3 className="text-xs font-bold uppercase text-indigo-300 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Bid Optimization
               </h3>
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="space-y-1">
                     <span className="text-xs text-slate-400 block">Current Conversion Rate</span>
                     <span className="text-2xl font-bold text-white">{metrics.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-8 w-px bg-indigo-900 hidden md:block"></div>
                  <div className="space-y-1">
                     <span className="text-xs text-slate-400 block">Max Bid to Break-Even</span>
                     <span className="text-2xl font-bold text-yellow-400">₹{metrics.maxSafeBid.toFixed(2)}</span>
                  </div>
                  <div className="flex-1 text-xs text-indigo-200/70 leading-relaxed">
                     If you bid higher than <b>₹{metrics.maxSafeBid.toFixed(2)}</b>, your ACOS will likely exceed your profit margin, causing a loss. Keep bids below this for profitability.
                  </div>
               </div>
            </div>

          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-500" />
              PPC Master Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">ACOS vs. TACoS</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    <b>ACOS</b> checks ad efficiency. <b>TACoS</b> checks business health. 
                    <br/>
                    If ACOS is high but TACoS is low ( Below 10%), it means your organic sales are strong enough to support aggressive ads.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The Break-Even Rule</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Your Break-Even ACOS is simply your <b>Profit Margin %</b>. 
                    <br/>
                    If you have 30% margin, you can spend up to 30% of sales on ads without losing money.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-yellow-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Launch Strategy</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    During a product launch, ignore Profit. Aim for <b>Break-Even ACOS</b> to maximize sales velocity and rank. Profit comes later from organic rank.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}