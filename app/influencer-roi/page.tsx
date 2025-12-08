'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Gift, 
  Share2,
  BookOpen,
  Search,
  MessageSquare
} from 'lucide-react';

export default function InfluencerAuditTool() {
  // --- STATE ---
  
  // 1. Campaign Inputs
  const [influencerFee, setInfluencerFee] = useState<number>(10000);
  const [seedingCost, setSeedingCost] = useState<number>(500); // Cost of free product sent + shipping
  const [followerCount, setFollowerCount] = useState<number>(50000);
  const [estReach, setEstReach] = useState<number>(10); // % of followers who actually see the post (Story vs Reel)

  // 2. Unit Economics
  const [sellingPrice, setSellingPrice] = useState<number>(1500);
  const [landedCost, setLandedCost] = useState<number>(600);
  const [discountCode, setDiscountCode] = useState<number>(15); // % Discount given to followers

  // 3. Outputs
  const [metrics, setMetrics] = useState({
    totalCampaignCost: 0,
    profitPerUnit: 0,
    breakEvenUnits: 0,
    targetUnits2x: 0,
    requiredConversion: 0, // % of viewers who must buy
    cpm: 0, // Cost per 1000 views
    status: 'neutral' as 'safe' | 'risky' | 'impossible'
  });

  // --- CALCULATION ENGINE ---
  useEffect(() => {
    // A. Costs
    const totalCost = influencerFee + seedingCost;
    
    // B. Unit Economics (Post-Discount)
    const discountedPrice = sellingPrice * (1 - discountCode / 100);
    const margin = discountedPrice - landedCost;

    // C. Reach Calculation
    const activeViewers = followerCount * (estReach / 100);

    // D. Break Even Analysis
    let beUnits = 0;
    let targetUnits = 0;
    let reqConv = 0;
    let status: 'safe' | 'risky' | 'impossible' = 'safe';

    if (margin > 0) {
      beUnits = Math.ceil(totalCost / margin);
      targetUnits = Math.ceil((totalCost * 2) / margin); // 2x ROAS goal
      
      // The "Reality Check": Break Even Units / Active Viewers
      if (activeViewers > 0) {
        reqConv = (beUnits / activeViewers) * 100;
      }
    } else {
      status = 'impossible'; // Losing money on every sale
    }

    // Status Logic based on Required Conversion Rate
    if (status !== 'impossible') {
      if (reqConv > 5) status = 'impossible'; // >5% CR is extremely rare on social
      else if (reqConv > 2) status = 'risky'; // 2-5% is hard
      else status = 'safe'; // <2% is achievable
    }

    // E. Ad Metrics (CPM)
    const cpm = activeViewers > 0 ? (totalCost / activeViewers) * 1000 : 0;

    setMetrics({
      totalCampaignCost: totalCost,
      profitPerUnit: margin,
      breakEvenUnits: beUnits,
      targetUnits2x: targetUnits,
      requiredConversion: reqConv,
      cpm,
      status
    });

  }, [influencerFee, seedingCost, followerCount, estReach, sellingPrice, landedCost, discountCode]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Share2 className="w-8 h-8 text-pink-500" />
              Influencer ROI Auditor
            </h1>
            <p className="text-slate-400 mt-2">
              Analyze campaign risk by calculating the "Reality Check" conversion rate.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
             <div className={`w-3 h-3 rounded-full ${metrics.status === 'safe' ? 'bg-emerald-500' : metrics.status === 'risky' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
             <span className="text-sm font-medium text-slate-300">
                Risk Level: {metrics.status.toUpperCase()}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Campaign Details */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-pink-400" /> Influencer Data
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Influencer Fee (₹)</label>
                     <input type="number" value={influencerFee} onChange={e => setInfluencerFee(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-pink-500 outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Seeding Cost (₹)</label>
                     <input type="number" value={seedingCost} onChange={e => setSeedingCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono focus:border-pink-500 outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Cost of product sent + shipping</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Followers</label>
                        <input type="number" value={followerCount} onChange={e => setFollowerCount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-pink-500 outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Est. Reach %</label>
                        <input type="number" value={estReach} onChange={e => setEstReach(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-pink-500 outline-none" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Economics */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Offer Economics
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Selling Price</label>
                     <input type="number" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Landed Cost</label>
                     <input type="number" value={landedCost} onChange={e => setLandedCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Discount Code (%)</label>
                     <input type="number" value={discountCode} onChange={e => setDiscountCode(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm outline-none" />
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT: INTELLIGENCE PANEL (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Risk Gauge */}
            <div className={`rounded-xl border p-8 flex flex-col md:flex-row gap-8 items-center justify-between ${
               metrics.status === 'safe' ? 'bg-emerald-950/30 border-emerald-900' : 
               metrics.status === 'risky' ? 'bg-yellow-950/30 border-yellow-900' : 
               'bg-red-950/30 border-red-900'
            }`}>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <Target className={`w-5 h-5 ${
                        metrics.status === 'safe' ? 'text-emerald-400' : 
                        metrics.status === 'risky' ? 'text-yellow-400' : 'text-red-400'
                     }`} />
                     <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Required Conversion Rate</span>
                  </div>
                  <div className="text-5xl font-extrabold text-white">
                     {metrics.requiredConversion.toFixed(2)}%
                  </div>
                  <p className="text-sm text-slate-400">
                     {metrics.requiredConversion.toFixed(1)}% of people who see the post must buy for you to break even.
                  </p>
               </div>

               <div className="bg-slate-950/50 p-4 rounded-lg border border-white/10 w-full md:w-64 text-sm leading-relaxed text-slate-300">
                  {metrics.status === 'safe' && <span className="text-emerald-400 font-bold">Good Deal.</span>}
                  {metrics.status === 'risky' && <span className="text-yellow-400 font-bold">High Risk.</span>}
                  {metrics.status === 'impossible' && <span className="text-red-400 font-bold">Impossible.</span>}
                  <br/>
                  {metrics.status === 'safe' ? ' This rate is achievable on Instagram/YouTube.' : 
                   metrics.status === 'risky' ? ' This conversion rate is higher than average (1-2%).' : 
                   ' Influencer campaigns rarely convert above 5%. Negotiate fee down.'}
               </div>
            </div>

            {/* 2. Break Even Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Break Even Target</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                     <span className="text-4xl font-bold text-white">{metrics.breakEvenUnits}</span>
                     <span className="text-sm text-slate-400">units</span>
                  </div>
                  <p className="text-xs text-slate-500">
                     You must sell {metrics.breakEvenUnits} units just to cover the <b>{fmt(metrics.totalCampaignCost)}</b> campaign cost.
                  </p>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Ad Efficiency (CPM)</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                     <span className="text-4xl font-bold text-white">{fmt(metrics.cpm)}</span>
                     <span className="text-sm text-slate-400">/ 1k views</span>
                  </div>
                  <p className="text-xs text-slate-500">
                     Compare this to Facebook Ads. (Avg FB CPM is ₹200-500). {metrics.cpm > 500 ? 'This is expensive.' : 'This is cheap visibility.'}
                  </p>
               </div>

            </div>

            {/* 3. Profit P&L */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Campaign Goals</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                     <div className="flex items-center gap-3">
                        <Gift className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Total Campaign Cost</span>
                     </div>
                     <span className="font-mono text-white">{fmt(metrics.totalCampaignCost)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">Profit Per Unit (After Disc.)</span>
                     </div>
                     <span className="font-mono text-white">{fmt(metrics.profitPerUnit)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-900/20 rounded border border-indigo-900/50">
                     <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-200">Units needed for 2x ROAS</span>
                     </div>
                     <span className="font-mono font-bold text-white">{metrics.targetUnits2x} Units</span>
                  </div>
               </div>
            </div>

          </div>

        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-pink-500" />
              Negotiation & Strategy Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-pink-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-pink-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The 3% Rule</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Influencer conversion rates are usually <b>1% to 3%</b>. 
                    <br/>
                    If this tool shows you need a <b>5%+</b> conversion rate to break even, do NOT sign the deal. You will lose money. Negotiate the fee down until the required rate is under 2%.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Followers vs. Reach</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    A person with 100k followers might only get 10k views on a Story (10% Reach).
                    <br/>
                    <b>Always ask for screenshots of their Story Views</b> before paying. Input that number into "Reach" for accurate math.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-indigo-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Seeding Cost Trap</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Don't forget the product cost! Sending a ₹2000 item + ₹100 shipping to 10 influencers costs ₹21,000 before you even pay them fees. Include this in the "Seeding Cost" field.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}