'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calculator, Truck, Package, Info, 
  TrendingUp, Search, HelpCircle, Clock, BookOpen, Lightbulb
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from 'recharts';

// --- DATA: AMAZON INDIA FEE STRUCTURE ---
const CATEGORY_RULES: Record<string, any> = {
  'mobile': { name: 'Mobile Phones', type: 'flat', rate: 5.0 },
  'apparel_mens_tshirt': { 
    name: 'Apparel - Men\'s T-shirts', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 5.0 }, { limit: 1000, rate: 17.0 }, { limit: Infinity, rate: 23.0 } ]
  },
  'apparel_womens': { 
    name: 'Apparel - Women\'s Innerwear', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 12.0 }, { limit: Infinity, rate: 18.0 } ]
  },
  'apparel_other': { 
    name: 'Apparel - Shirts/Dresses', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 4.5 }, { limit: 1000, rate: 15.0 }, { limit: Infinity, rate: 19.0 } ]
  },
  'books': { 
    name: 'Books', 
    type: 'tiered', 
    ranges: [ { limit: 250, rate: 3.0 }, { limit: 500, rate: 4.5 }, { limit: 1000, rate: 9.0 }, { limit: Infinity, rate: 13.5 } ]
  },
  'home_decor': { 
    name: 'Home Décor & Furnishing', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 6.0 }, { limit: 1000, rate: 12.5 }, { limit: Infinity, rate: 13.5 } ]
  },
  'kitchen': { 
    name: 'Kitchen Containers', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 5.0 }, { limit: Infinity, rate: 12.0 } ]
  },
  'beauty': { 
    name: 'Beauty - Makeup', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 6.0 }, { limit: Infinity, rate: 9.0 } ]
  },
  'electronics_acc': { 
    name: 'Electronic Accessories', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 17.0 }, { limit: 1000, rate: 15.5 }, { limit: Infinity, rate: 20.0 } ]
  },
  'toys': { 
    name: 'Toys & Games', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 8.5 }, { limit: 1000, rate: 10.5 }, { limit: Infinity, rate: 12.5 } ]
  },
  'luggage': { 
    name: 'Luggage & Backpacks', 
    type: 'tiered', 
    ranges: [ { limit: 300, rate: 0 }, { limit: 500, rate: 6.5 }, { limit: 1000, rate: 6.5 }, { limit: Infinity, rate: 5.5 } ]
  },
  'other': { name: 'Other / Standard', type: 'flat', rate: 15.0 }
};

export default function AmazonFeeCalculatorPage() {
  // --- STATE ---
  const [sellingPrice, setSellingPrice] = useState<number>(599);
  const [productCost, setProductCost] = useState<number>(250);
  const [selectedCat, setSelectedCat] = useState<string>('apparel_mens_tshirt');
  const [weight, setWeight] = useState<number>(0.4); // kg
  const [fulfillment, setFulfillment] = useState<'fba' | 'easyship' | 'self'>('fba');
  const [shippingMode, setShippingMode] = useState<'local' | 'regional' | 'national'>('national');
  const [activeTab, setActiveTab] = useState<'when' | 'how' | 'why'>('when');

  // --- OUTPUTS ---
  const [referralRate, setReferralRate] = useState(0);
  const [referralFee, setReferralFee] = useState(0);
  const [closingFee, setClosingFee] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [fbaFee, setFbaFee] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [margin, setMargin] = useState(0);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    // 1. Referral Fee
    const rule = CATEGORY_RULES[selectedCat] || CATEGORY_RULES['other'];
    let rate = 0;

    if (rule.type === 'flat') {
      rate = rule.rate;
    } else {
      const slab = rule.ranges.find((r: any) => sellingPrice <= r.limit);
      rate = slab ? slab.rate : rule.ranges[rule.ranges.length - 1].rate;
    }
    
    const refFee = Math.max(0, sellingPrice * (rate / 100));
    setReferralRate(rate);

    // 2. Closing Fee
    let close = 0;
    if (fulfillment === 'fba') {
       if (sellingPrice <= 250) close = 25;
       else if (sellingPrice <= 500) close = 20;
       else if (sellingPrice <= 1000) close = 25;
       else close = 50;
    } else {
       if (sellingPrice <= 250) close = 5;
       else if (sellingPrice <= 500) close = 10;
       else if (sellingPrice <= 1000) close = 25;
       else close = 50;
    }

    // 3. Shipping Fee
    let baseShip = 0;
    let extraShipRate = 0;

    if (fulfillment === 'fba') {
        if (shippingMode === 'local') baseShip = 29;
        else if (shippingMode === 'regional') baseShip = 41;
        else baseShip = 59;
        extraShipRate = 24;
    } else if (fulfillment === 'easyship') {
        if (shippingMode === 'local') baseShip = 44;
        else if (shippingMode === 'regional') baseShip = 53;
        else baseShip = 74;
        extraShipRate = 30;
    } else {
        baseShip = 50; 
        extraShipRate = 30;
    }

    const extraWeight = Math.max(0, Math.ceil((weight - 0.5) / 0.5));
    const shipTotal = baseShip + (extraWeight * extraShipRate);

    // 4. Pick & Pack
    const pickPack = fulfillment === 'fba' ? 20 : 0;

    // 5. Totals
    const feesBeforeTax = refFee + close + shipTotal + pickPack;
    const gst = feesBeforeTax * 0.18;
    const totalDeduction = feesBeforeTax + gst;
    
    const profit = sellingPrice - productCost - totalDeduction;
    const marginCalc = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

    setReferralFee(refFee);
    setClosingFee(close);
    setShippingFee(shipTotal);
    setFbaFee(pickPack);
    setTotalFees(totalDeduction);
    setNetProfit(profit);
    setMargin(marginCalc);

  }, [sellingPrice, productCost, selectedCat, weight, fulfillment, shippingMode]);

  const chartData = [
    { name: 'Product Cost', value: productCost, color: '#94a3b8' }, 
    { name: 'Referral Fee', value: referralFee, color: '#f59e0b' },
    { name: 'Closing/FBA', value: closingFee + fbaFee, color: '#6366f1' },
    { name: 'Shipping', value: shippingFee, color: '#3b82f6' },
    { name: 'GST', value: totalFees * 0.18, color: '#ef4444' },
    { name: 'Net Profit', value: Math.max(0, netProfit), color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-orange-600" /> Amazon Profit Calculator
            </h1>
            <p className="text-slate-500 text-sm">Real-time breakdown of all fees and taxes.</p>
          </div>
        </div>

        {/* CALCULATOR SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Search className="w-3 h-3" /> Category
                </label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                >
                  {Object.entries(CATEGORY_RULES).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
                <div className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded inline-block">
                  Referral Rate: {referralRate}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-6 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Product Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-6 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                      value={productCost}
                      onChange={(e) => setProductCost(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg space-y-4 border border-slate-100">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Fulfillment</label>
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                      {['fba', 'easyship', 'self'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setFulfillment(m as any)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded capitalize transition-all ${fulfillment === m ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {m === 'easyship' ? 'Easy Ship' : m.toUpperCase()}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Weight (kg)</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Shipping Distance</label>
                    <select 
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                      value={shippingMode}
                      onChange={(e) => setShippingMode(e.target.value as any)}
                    >
                      <option value="local">Local (City)</option>
                      <option value="regional">Regional (Zone)</option>
                      <option value="national">National (Metro)</option>
                    </select>
                 </div>
              </div>

            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="Referral Fee" value={referralFee} color="text-slate-700" />
              <KpiCard label="Logistics" value={shippingFee + closingFee + fbaFee} color="text-blue-600" />
              <KpiCard label="Taxes (18%)" value={totalFees * 0.18} color="text-slate-500" />
              <div className={`p-4 rounded-xl border shadow-sm ${netProfit > 0 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-500 text-white border-red-400'}`}>
                <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Net Profit / Unit</p>
                <div className="text-2xl font-bold">₹{netProfit.toFixed(0)}</div>
                <div className="text-xs font-medium opacity-90 mt-1">{margin.toFixed(1)}% Margin</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" /> Fee Breakdown
                </h3>
                <div className="divide-y divide-slate-100 text-sm">
                  <FeeRow label="Referral Fee" val={referralFee} sub={`${referralRate}% of Selling Price`} />
                  <FeeRow label="Closing Fee" val={closingFee} sub="Fixed Platform Fee" />
                  <FeeRow label="Weight Handling" val={shippingFee} sub={`${weight}kg (${shippingMode})`} />
                  {fulfillment === 'fba' && <FeeRow label="FBA Pick & Pack" val={fbaFee} sub="Warehouse Handling" />}
                  <FeeRow label="GST (18%)" val={totalFees * 0.18} sub="Tax on Fees" />
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-500">Total Deduction</span>
                  <span className="font-bold text-red-600 text-lg">- ₹{totalFees.toFixed(1)}</span>
                </div>
              </div>

              <div className="relative h-64 md:h-auto min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val: number) => `₹${val.toFixed(1)}`} />
                    <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -mt-6">
                   <div className="text-[10px] text-slate-400 uppercase font-bold">You Keep</div>
                   <div className={`text-xl font-bold ${netProfit > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                     ₹{netProfit.toFixed(0)}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- EDUCATION SECTION: WHEN, HOW, WHY --- */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-8">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900">Understanding Amazon Fees</h2>
          </div>
          
          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
              <button 
                onClick={() => setActiveTab('when')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'when' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Clock className="w-4 h-4" /> When do I pay?
              </button>
              <button 
                onClick={() => setActiveTab('how')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'how' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Calculator className="w-4 h-4" /> How is it calculated?
              </button>
              <button 
                onClick={() => setActiveTab('why')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'why' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Lightbulb className="w-4 h-4" /> Why does it matter?
              </button>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {activeTab === 'when' && (
                <>
                  <InfoCard 
                    title="Referral Fee" 
                    desc="Charged immediately when an item is sold. It is deducted from your payout before the money hits your bank." 
                  />
                  <InfoCard 
                    title="Closing Fee" 
                    desc="Charged on every successful order regardless of the item's price or category. It covers payment gateway costs." 
                  />
                  <InfoCard 
                    title="Shipping / Weight Fee" 
                    desc="Charged when Amazon ships the order (Easy Ship or FBA). If you self-ship, you pay the courier directly." 
                  />
                  <InfoCard 
                    title="FBA Storage Fee" 
                    desc="Charged monthly based on the volume (cubic feet) your products occupy in Amazon's warehouse." 
                  />
                </>
              )}

              {activeTab === 'how' && (
                <>
                  <InfoCard 
                    title="Referral Fee Logic" 
                    desc="It is a percentage of the Total Selling Price (Product Price + Shipping Charge). For example, 15% on a ₹1000 item = ₹150." 
                  />
                  <InfoCard 
                    title="Weight Calculation" 
                    desc="Amazon compares Actual Weight vs. Volumetric Weight (L x B x H / 5000). They charge you based on whichever is higher." 
                  />
                  <InfoCard 
                    title="Closing Fee Slabs" 
                    desc="It works in fixed slabs. Example: ₹5 for items below ₹250, ₹10 for ₹250-500, and up to ₹50 for items above ₹1000." 
                  />
                  <InfoCard 
                    title="GST Impact" 
                    desc="Don't forget GST! Amazon charges 18% tax on all their service fees. This calculator includes that in the total deduction." 
                  />
                </>
              )}

              {activeTab === 'why' && (
                <>
                  <InfoCard 
                    title="Profit Margin Protection" 
                    desc="A small error in weight estimation can double your shipping fee. Knowing exact fees ensures you don't sell at a loss." 
                  />
                  <InfoCard 
                    title="FBA vs Self Ship Decision" 
                    desc="FBA fees are higher, but you get Prime badging. Use this tool to see if the extra cost is worth the potential sales boost." 
                  />
                  <InfoCard 
                    title="Pricing Strategy" 
                    desc="Understanding 'Price Bands' helps. Selling at ₹501 might cost you ₹20 extra in Closing Fees compared to selling at ₹499." 
                  />
                  <InfoCard 
                    title="Hidden Costs" 
                    desc="Many sellers ignore Closing Fees or GST on fees. Over a year, these small costs add up to lakhs in lost profit." 
                  />
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function KpiCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</p>
      <div className={`text-xl font-bold ${color}`}>₹{value.toFixed(1)}</div>
    </div>
  );
}

function FeeRow({ label, val, sub }: { label: string, val: number, sub: string }) {
  return (
    <div className="flex justify-between items-center py-2.5">
      <div>
        <div className="text-slate-700 font-medium">{label}</div>
        <div className="text-[10px] text-slate-400">{sub}</div>
      </div>
      <div className="font-mono font-medium text-slate-900">₹{val.toFixed(1)}</div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="mt-1 min-w-[20px]">
        <BookOpen className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}