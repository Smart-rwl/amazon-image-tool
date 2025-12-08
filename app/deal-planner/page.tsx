'use client';

import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Tag, 
  BookOpen,
  Zap,
  BarChart3
} from 'lucide-react';

type SimulationRow = {
  discountPct: number;
  dealPrice: number;
  refFee: number;
  netProfit: number;
  margin: number;
  roi: number;
  dealType: string;
};

export default function PromotionSimulator() {
  // --- STATE ---
  const [sellingPrice, setSellingPrice] = useState<number>(2000);
  
  // Costs
  const [landedCost, setLandedCost] = useState<number>(600); // COGS + Shipping + FBA Fixed
  const [referralFeePct, setReferralFeePct] = useState<number>(15); // Amazon Fee %
  const [gstRate, setGstRate] = useState<number>(18); // GST on Fees/Price

  const [simulations, setSimulations] = useState<SimulationRow[]>([]);

  // --- ENGINE ---
  useEffect(() => {
    const rows: SimulationRow[] = [];

    // Simulate discounts from 5% to 90%
    for (let d = 0; d <= 80; d += 5) {
      // 1. New Price
      const newPrice = sellingPrice * (1 - d / 100);
      
      // 2. Variable Fees (Depend on New Price)
      const refFee = newPrice * (referralFeePct / 100);
      
      // 3. Tax (GST on Price is standard in India, usually inclusive)
      // Assuming Price is Inclusive: Base = Price / 1.18
      const basePrice = newPrice / (1 + gstRate / 100);
      const taxAmount = newPrice - basePrice;

      // 4. Profit
      // Net = BasePrice - LandedCost - RefFee(Base) -> Simplified:
      // Profit = (NewPrice - Tax) - LandedCost - RefFee
      // Note: Referral fee is usually calculated on the Gross Price including tax
      
      const profit = newPrice - taxAmount - landedCost - refFee;
      
      // 5. Metrics
      const margin = newPrice > 0 ? (profit / newPrice) * 100 : 0;
      const roi = landedCost > 0 ? (profit / landedCost) * 100 : 0;

      // 6. Deal Type Identification
      let type = 'Standard Price';
      if (d >= 5 && d < 15) type = 'Coupon / Voucher';
      if (d >= 15 && d < 20) type = 'Prime Exclusive';
      if (d >= 20 && d < 40) type = 'Lightning Deal (LD)';
      if (d >= 40 && d < 60) type = '7-Day Deal (BD)';
      if (d >= 60) type = 'Liquidation / Clearance';
      if (d === 0) type = 'Organic Sales';

      rows.push({
        discountPct: d,
        dealPrice: newPrice,
        refFee,
        netProfit: profit,
        margin,
        roi,
        dealType: type
      });
    }
    setSimulations(rows);
  }, [sellingPrice, landedCost, referralFeePct, gstRate]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              Promotion Profitability Simulator
            </h1>
            <p className="text-slate-400 mt-2">
              Forecast net margins across Lightning Deals, Coupons, and Clearance events.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
             <BarChart3 className="w-4 h-4 text-slate-400" />
             <span className="text-sm font-medium text-slate-300">Live P&L Calculation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* --- LEFT: CONFIG (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
               <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Economics Config
               </h3>
               
               <div className="space-y-5">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Regular Selling Price</label>
                     <input type="number" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-bold text-lg focus:border-emerald-500 outline-none" />
                  </div>

                  <div className="h-px bg-slate-800 my-2"></div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fixed Costs (Landed)</label>
                     <input type="number" value={landedCost} onChange={e => setLandedCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Product Cost + Shipping + FBA Fixed Fee</p>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Variable Referral Fee (%)</label>
                     <input type="number" value={referralFeePct} onChange={e => setReferralFeePct(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none" />
                     <p className="text-[10px] text-slate-500 mt-1">Amazon category fee (e.g. 15% for Home)</p>
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">GST Rate (%)</label>
                     <select value={gstRate} onChange={e => setGstRate(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none">
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18% (Standard)</option>
                        <option value={28}>28%</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-900/50 p-5 rounded-xl">
               <h4 className="text-indigo-300 font-bold text-sm mb-2">Did you know?</h4>
               <p className="text-xs text-indigo-200/70 leading-relaxed">
                  When you lower your price, you pay <b>less Referral Fee</b>. This simulator calculates that saving automatically, so your actual profit might be higher than you think!
               </p>
            </div>
          </div>

          {/* --- RIGHT: SIMULATION TABLE (8 Cols) --- */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                     <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                        <tr>
                           <th className="px-4 py-3">Deal Type</th>
                           <th className="px-4 py-3">Discount</th>
                           <th className="px-4 py-3">Price</th>
                           <th className="px-4 py-3">Profit</th>
                           <th className="px-4 py-3">ROI</th>
                           <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                        {simulations.map((row) => (
                           <tr key={row.discountPct} className={`hover:bg-slate-800/50 transition ${row.dealType === 'Organic Sales' ? 'bg-slate-800/30' : ''}`}>
                              <td className="px-4 py-3">
                                 <div className="flex items-center gap-2">
                                    {row.discountPct >= 20 && row.discountPct < 60 && <Zap className="w-3 h-3 text-yellow-500" />}
                                    {row.discountPct >= 60 && <Tag className="w-3 h-3 text-red-400" />}
                                    <span className="text-xs font-medium text-slate-300">{row.dealType}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 font-mono">
                                 {row.discountPct}%
                              </td>
                              <td className="px-4 py-3 font-mono text-white">
                                 {fmt(row.dealPrice)}
                              </td>
                              <td className={`px-4 py-3 font-bold ${row.netProfit > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                 {fmt(row.netProfit)}
                              </td>
                              <td className="px-4 py-3 font-mono">
                                 {row.roi.toFixed(0)}%
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {row.netProfit > 0 ? (
                                    row.roi > 30 ? (
                                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                          <CheckCircle2 className="w-3 h-3" /> GREAT
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                          OK
                                       </span>
                                    )
                                 ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                                       <AlertTriangle className="w-3 h-3" /> LOSS
                                    </span>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>

        {/* --- GUIDE SECTION --- */}
        <div className="border-t border-slate-800 pt-10">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Deal Strategy Guide
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-yellow-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Lightning Deals (LD)</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Amazon usually requires a minimum <b>20% discount</b> off the lowest price in the last 30 days.
                    <br/><br/>
                    <b>When to use:</b> Use LDs to spike sales velocity and improve organic ranking for a keyword. Accept lower margins (or even break-even) for the visibility boost.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Tag className="w-5 h-5 text-red-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">Liquidation Strategy</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Look at the <b>60%+ rows</b>. If you have "Dead Stock" (items not selling), it is cheaper to sell them at a small loss here than to pay Amazon "Long Term Storage Fees" every month.
                 </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                 <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-white mb-2">The Profit Cliff</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Watch the <b>ROI column</b> carefully. Once ROI drops below 30%, you are at risk. One return or damaged unit could wipe out the profit from 5 successful sales.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}