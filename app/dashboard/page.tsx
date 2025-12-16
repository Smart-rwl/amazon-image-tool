'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  // Standard Icons
  TrendingUp, Activity, Star, Clock, ArrowRight, Calculator, 
  DollarSign, Package, Globe, Target, Newspaper, TrendingDown, 
  ExternalLink,
  // Premium Icons
  ShoppingCart, AlertTriangle, Download, ArrowUpRight, Crown, LayoutDashboard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- TYPES ---
type DashboardMode = 'standard' | 'premium';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<DashboardMode>('standard');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Smart Seller...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${mode === 'premium' ? 'bg-slate-950 text-slate-50' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className={`sticky top-0 z-10 border-b backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between ${mode === 'premium' ? 'border-slate-800 bg-slate-900/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg tracking-tight">
             {mode === 'premium' ? 'Seller Center Pro' : 'Dashboard'}
          </h1>
          {mode === 'premium' && <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/50 uppercase tracking-wider">Premium</span>}
        </div>

        {/* --- THE MAGIC BUTTON --- */}
        <button
          onClick={() => setMode(mode === 'standard' ? 'premium' : 'standard')}
          className={`relative group overflow-hidden px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg ${
            mode === 'standard' 
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-indigo-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {mode === 'standard' ? (
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
              Only for Premium Sellers
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Switch to Standard View
            </span>
          )}
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <main>
        {mode === 'standard' ? (
          <StandardDashboard user={user} />
        ) : (
          <PremiumDashboard user={user} />
        )}
      </main>

    </div>
  );
}

// ==========================================
// 1. STANDARD DASHBOARD (Your Previous View)
// ==========================================
function StandardDashboard({ user }: { user: any }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
          <p className="text-gray-500">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <div className="flex gap-3">
           <Link href="/calculator" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2">
            <Calculator className="w-4 h-4" /> New Calculation
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StandardStatCard icon={<Activity className="text-blue-600" />} label="Calculations" value="24" sub="+12% this month" color="bg-blue-50" />
        <StandardStatCard icon={<TrendingUp className="text-emerald-600" />} label="Saved Profits" value="7" sub="Latest: $420 margin" color="bg-emerald-50" />
        
        {/* Goal Widget */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Target className="w-5 h-5" /></div>
              <span className="text-sm font-medium text-gray-500">Monthly Goal</span>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">65%</span>
          </div>
          <div>
             <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        <StandardStatCard icon={<Star className="text-amber-500" />} label="Status" value="Free Plan" sub="Upgrade to Pro" color="bg-amber-50" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
           {/* Market Pulse Widget */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h2 className="font-bold text-gray-900 text-sm uppercase flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /> Market Pulse</h2></div>
            <div className="grid grid-cols-3 divide-x divide-gray-100">
               <MarketItem label="USD to INR" value="₹83.45" trend="up" />
               <MarketItem label="EUR to USD" value="$1.08" trend="down" />
               <MarketItem label="Freight / kg" value="$4.50" trend="flat" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-fit">
           <h2 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2"><Newspaper className="w-4 h-4" /> Updates</h2>
           <div className="space-y-4">
             <NewsItem cat="Fees" title="FBA Fees Update 2025" date="2d ago" />
             <NewsItem cat="Policy" title="Pesticide Compliance" date="1w ago" />
           </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. PREMIUM DASHBOARD (The New Requested Code)
// ==========================================
function PremiumDashboard({ user }: { user: any }) {
  // Mock Data mimicking the "Prisma" structure for Client Side Rendering
  const data = {
    totalRevenue: 1245000,
    totalUnits: 450,
    productCount: 12,
    aov: 2766,
    lowStockCount: 2,
    lowStockItems: [
       { id: 1, product: { name: 'Wireless Earbuds Pro', sku: 'WE-001' }, onHand: 4 },
       { id: 2, product: { name: 'Yoga Mat (Blue)', sku: 'YM-BLU' }, onHand: 8 },
    ],
    recentSales: [
       { id: 1, product: { name: 'Wireless Earbuds Pro' }, date: new Date().toISOString(), revenue: 2500 },
       { id: 2, product: { name: 'Smart Watch Gen 2' }, date: new Date(Date.now() - 86400000).toISOString(), revenue: 5000 },
       { id: 3, product: { name: 'USB-C Cable 2m' }, date: new Date(Date.now() - 172800000).toISOString(), revenue: 450 },
    ],
    topProducts: [
      { name: 'Wireless Earbuds Pro', sku: 'WE-001', revenue: 450000, units: 150 },
      { name: 'Smart Watch Gen 2', sku: 'SW-002', revenue: 320000, units: 80 },
      { name: 'Yoga Mat (Blue)', sku: 'YM-BLU', revenue: 150000, units: 120 },
      { name: 'Laptop Stand', sku: 'LS-ALU', revenue: 95000, units: 45 },
    ]
  };

  return (
    <div className="pt-8 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Seller Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time analytics for the selected period.
            </p>
          </div>
          <div className="flex gap-3">
             <div className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Last 30 Days
             </div>
             <Link href="/tools" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-all text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" /> Open Image Tools
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <PremiumStatCard title="Total Revenue" value={data.totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} color="emerald" />
          <PremiumStatCard title="Units Sold" value={data.totalUnits.toString()} icon={<ShoppingCart className="h-4 w-4 text-blue-400" />} color="blue" />
          <PremiumStatCard title="Active SKUs" value={data.productCount.toString()} icon={<Package className="h-4 w-4 text-purple-400" />} color="purple" />
          <PremiumStatCard title="Avg. Order Value" value={data.aov.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} icon={<TrendingUp className="h-4 w-4 text-indigo-400" />} color="indigo" />
          <PremiumStatCard title="Low Stock Alerts" value={data.lowStockCount.toString()} icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} color="amber" highlight={data.lowStockCount > 0} />
        </div>

        {/* Revenue Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="font-bold text-lg mb-4 text-white">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ color: '#818cf8' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          
          {/* Top Products */}
          <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Top Performing Products</h3>
              <ExportButton />
            </div>
            <div className="space-y-4">
               {data.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">#{i + 1}</div>
                        <div>
                          <p className="font-medium text-slate-200">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.sku}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-emerald-400">{product.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-slate-500">{product.units} units</p>
                    </div>
                  </div>
               ))}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
            </div>
            <div className="space-y-4">
               {data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-200 text-sm truncate max-w-[150px]">{sale.product?.name}</span>
                        <span className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-indigo-300">+{sale.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. HELPER COMPONENTS
// ==========================================

function StandardStatCard({ icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
      <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
    </div>
  );
}

function MarketItem({ label, value, trend }: any) {
  return (
    <div className="p-4 text-center hover:bg-gray-50 transition-colors">
      <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900 flex justify-center items-center gap-1">
        {value} 
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-green-500" />}
      </p>
    </div>
  );
}

function NewsItem({ cat, title, date }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div>
        <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-2">{cat}</span>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{title}</span>
      </div>
      <span className="text-[10px] text-gray-400">{date}</span>
    </div>
  );
}

function PremiumStatCard({ title, value, icon, color, highlight }: any) {
  return (
    <div className={`rounded-xl border bg-slate-900/70 p-6 shadow-sm transition-all hover:bg-slate-900 ${highlight ? 'border-amber-500/50 bg-amber-900/10' : 'border-slate-800'}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function ExportButton() {
  return (
    <button className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors">
      <Download className="h-3 w-3" /> Export CSV
    </button>
  );
}

const mockChartData = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 }, { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 }, { name: 'Fri', value: 1890 }, { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];