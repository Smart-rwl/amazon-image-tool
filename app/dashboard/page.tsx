'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  // Icons
  LayoutDashboard, Crown, Calculator, Package, TrendingUp, 
  ShoppingCart, AlertTriangle, Download, ArrowUpRight, 
  HelpCircle, MessageSquare, Sparkles, Globe, 
  ArrowRight, Activity, Zap, ExternalLink, X,
  LogOut, Star, User as UserIcon, Settings, Bell, ChevronDown, Heart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TOOLS } from '../config/tools.config'; // Import tools config to map slugs to names

// --- TYPES & MOCK DATA ---
type DashboardMode = 'standard' | 'premium';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<DashboardMode>('standard');
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true); 
  const [showNewToolAlert, setShowNewToolAlert] = useState(true);

  // Favorites State (Synced with Navbar via LocalStorage)
  const [favorites, setFavorites] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Load Favorites on Mount & Listen for Updates
    const loadFavorites = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('userFavorites');
        if (saved) {
          try {
            setFavorites(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    loadFavorites();

    // Listen for the custom event dispatched by Navbar
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => window.removeEventListener('favoritesUpdated', loadFavorites);

  }, [router]);

  // Suggestion: Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleFavorite = (slug: string) => {
    const newFavs = favorites.includes(slug)
      ? favorites.filter(f => f !== slug)
      : [...favorites, slug];
    
    setFavorites(newFavs);
    localStorage.setItem('userFavorites', JSON.stringify(newFavs));
    // Notify Navbar to update its hearts
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">Loading Smart Seller...</div>;

  // --- DEMO DATA GENERATOR ---
  const premiumData = {
    revenue: showDemo ? 1245000 : 0,
    units: showDemo ? 450 : 0,
    skus: showDemo ? 12 : 0,
    aov: showDemo ? 2766 : 0,
    lowStock: showDemo ? 2 : 0,
    chartData: showDemo ? mockChartData : [],
    recentSales: showDemo ? mockRecentSales : [],
    topProducts: showDemo ? mockTopProducts : []
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${mode === 'premium' ? 'bg-slate-950 text-slate-50' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between ${mode === 'premium' ? 'border-slate-800 bg-slate-900/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${mode === 'premium' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-100 text-blue-600'}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">
               {mode === 'premium' ? 'Seller Center Pro' : 'Dashboard'}
            </h1>
            <p className={`text-[10px] font-medium ${mode === 'premium' ? 'text-slate-400' : 'text-gray-500'}`}>
              {mode === 'premium' ? 'Advanced Analytics' : 'Overview'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle Button */}
          <button
            onClick={() => setMode(mode === 'standard' ? 'premium' : 'standard')}
            className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              mode === 'standard' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent hover:shadow-lg'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {mode === 'standard' ? (
              <><Crown className="w-3 h-3 text-yellow-300 animate-pulse" /> Try Premium View</>
            ) : (
              <><Zap className="w-3 h-3" /> Back to Standard</>
            )}
          </button>

          {/* Suggestion: Notification Bell */}
          <button className={`p-2 rounded-full transition-colors relative ${mode === 'premium' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          {/* PROFILE REMOVED FROM HERE (Now in Navbar) */}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* 1. WELCOME & DEMO TOGGLE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${mode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
              {getGreeting()}, {user?.fullname?.split('@')[0]}
            </h2>
            <p className={`text-sm ${mode === 'premium' ? 'text-slate-400' : 'text-gray-500'}`}>
              Here is what's happening in your store today.
            </p>
          </div>

          {/* New Tool Alert Widget */}
          {showNewToolAlert && (
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border shadow-sm text-sm relative pr-8 animate-in fade-in slide-in-from-top-2 ${mode === 'premium' ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-200' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping absolute top-2 left-2"></span>
              <Sparkles className="w-4 h-4 ml-2" />
              <div>
                <span className="font-bold">New:</span> Bulk Image Editor is live!
              </div>
              <Link href="/tools/image-editor" className="font-bold underline ml-1 hover:opacity-80">Try it</Link>
              <button onClick={() => setShowNewToolAlert(false)} className="absolute right-2 top-2 hover:opacity-70"><X className="w-3 h-3" /></button>
            </div>
          )}
        </div>

        {/* 2. DEMO MODE BANNER */}
        {showDemo && (
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${mode === 'premium' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-full ${mode === 'premium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-100 text-yellow-600'}`}>
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div>
                 <h3 className={`font-bold text-sm ${mode === 'premium' ? 'text-slate-200' : 'text-gray-900'}`}>You are viewing Demo Data</h3>
                 <p className={`text-xs ${mode === 'premium' ? 'text-slate-500' : 'text-gray-500'}`}>Connect your sales data or add products to see your real metrics.</p>
               </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <button 
                 onClick={() => setShowDemo(false)} 
                 className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${mode === 'premium' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-300 hover:bg-gray-50'}`}
               >
                 Clear Demo Data
               </button>
               <Link 
                 href="/tools/calculator" 
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
               >
                 <Calculator className="w-3 h-3" /> Add First Product
               </Link>
            </div>
          </div>
        )}

        {/* 3. DASHBOARD CONTENT */}
        {mode === 'premium' ? (
           <PremiumView data={premiumData} />
        ) : (
           <StandardView favorites={favorites} toggleFavorite={toggleFavorite} />
        )}

      </main>

    </div>
  );
}

// ==========================================
// STANDARD VIEW COMPONENT
// ==========================================
function StandardView({ favorites, toggleFavorite }: { favorites: string[], toggleFavorite: (n:string)=>void }) {
  // Helper to get tool label from slug
  const getToolLabel = (slug: string) => {
    const tool = TOOLS.find(t => t.slug === slug);
    return tool ? tool.label : slug.replace(/-/g, ' '); // Fallback to formatted slug
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column (Main) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Simple Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SimpleStat icon={<Calculator className="text-blue-600" />} label="Calculations" value="0" bg="bg-blue-50" />
          <SimpleStat icon={<Package className="text-purple-600" />} label="Saved Items" value="0" bg="bg-purple-50" />
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group">
             <div className="p-2 bg-gray-100 rounded-full mb-2 group-hover:bg-blue-100"><ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-600" /></div>
             <span className="text-xs font-bold text-gray-600 group-hover:text-blue-700">Go to Tools</span>
          </div>
        </div>

        {/* Market Pulse Widget */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /> Market Pulse</h3>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Live</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
             <MarketStat label="USD to INR" value="₹83.45" trend="up" />
             <MarketStat label="EUR to USD" value="$1.08" trend="down" />
             <MarketStat label="Sea Freight" value="$180/cbm" trend="flat" />
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
           <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
             <Activity className="w-5 h-5 text-gray-400" />
           </div>
           <h3 className="text-gray-900 font-medium">No recent activity</h3>
           <p className="text-gray-500 text-sm mb-4">Start using tools to see your history here.</p>
           <Link href="/tools" className="text-blue-600 font-bold text-sm hover:underline">Explore Tools</Link>
        </div>

      </div>

      {/* Right Column (Sidebar) */}
      <div className="space-y-6">

        {/* Favorites Widget (Dynamic) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
           <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
             <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Favorite Tools
           </h3>
           <div className="space-y-2">
             {favorites.length > 0 ? favorites.map((slug) => (
               <div key={slug} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                  <Link href={`/tools/${slug}`} className="flex-1 text-sm font-medium text-gray-700 hover:text-blue-600">
                    {getToolLabel(slug)}
                  </Link>
                  <button onClick={() => toggleFavorite(slug)} className="text-gray-400 hover:text-red-500 p-1">
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  </button>
               </div>
             )) : (
               <div className="text-center py-4">
                 <p className="text-xs text-gray-400 italic mb-2">No favorites yet.</p>
                 <Link href="/tools" className="text-xs font-bold text-blue-600 border border-dashed border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 inline-block">
                   Browse Tools to Add
                 </Link>
               </div>
             )}
           </div>
        </div>
        
        {/* Help & Support Widget */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-lg">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Need Help?</h3>
          <p className="text-gray-400 text-xs mb-4 leading-relaxed">
            Found a bug or have a suggestion? We build tools based on seller feedback.
          </p>
          <div className="grid grid-cols-2 gap-2">
             <button className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
               <MessageSquare className="w-3 h-3" /> Chat
             </button>
             <Link href="/feedback" className="py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
               Feedback
             </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
           <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">Quick Access</h3>
           <div className="space-y-2">
             <QuickLink href="/tools/calculator" label="Profit Simulator" />
             <QuickLink href="/tools/ppc-calculator" label="PPC Manager" />
             <QuickLink href="/tools/inventory-planner" label="Inventory Planner" />
           </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// PREMIUM VIEW COMPONENT
// ==========================================
function PremiumView({ data }: { data: any }) {
  return (
    <div className="space-y-6">
       {/* Premium KPI Grid */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <PremiumCard title="Total Revenue" value={`₹${(data.revenue).toLocaleString()}`} icon={<TrendingUp className="text-emerald-400" />} color="emerald" />
          <PremiumCard title="Units Sold" value={data.units} icon={<ShoppingCart className="text-blue-400" />} color="blue" />
          <PremiumCard title="Active SKUs" value={data.skus} icon={<Package className="text-purple-400" />} color="purple" />
          <PremiumCard title="Avg. Order Value" value={`₹${data.aov}`} icon={<Activity className="text-indigo-400" />} color="indigo" />
          <PremiumCard title="Low Stock Alerts" value={data.lowStock} icon={<AlertTriangle className="text-amber-400" />} color="amber" highlight={data.lowStock > 0} />
       </div>

       {/* Chart Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Revenue Trend</h3>
            <div className="h-[250px] w-full">
              {data.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data available</div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Top Products</h3>
              <button className="p-1 hover:bg-slate-800 rounded"><Download className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              {data.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 text-xs flex items-center justify-center text-slate-400 font-bold">#{i+1}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.sku}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">₹{(p.revenue/1000).toFixed(1)}k</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
       </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SimpleStat({ icon, label, value, bg }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
       <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
       <div>
         <p className="text-xs text-gray-500 font-medium">{label}</p>
         <p className="text-lg font-bold text-gray-900">{value}</p>
       </div>
    </div>
  );
}

function MarketStat({ label, value, trend }: any) {
  return (
    <div className="p-4 text-center hover:bg-gray-50 transition-colors">
      <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1 font-bold text-gray-800">
        {value}
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
        {trend === 'down' && <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />}
      </div>
    </div>
  );
}

function QuickLink({ href, label }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group">
      {label}
      <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-blue-400" />
    </Link>
  );
}

function PremiumCard({ title, value, icon, color, highlight }: any) {
  return (
    <div className={`rounded-xl border bg-slate-900/40 p-5 backdrop-blur-sm ${highlight ? 'border-amber-500/30 bg-amber-900/10' : 'border-slate-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-1.5 rounded bg-${color}-500/10`}>{icon}</div>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

// --- MOCK DATA ---
const mockChartData = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 }, 
  { name: 'Wed', value: 5000 }, { name: 'Thu', value: 2780 }, 
  { name: 'Fri', value: 6890 }, { name: 'Sat', value: 8390 }, { name: 'Sun', value: 3490 },
];
const mockTopProducts = [
  { name: 'Wireless Earbuds', sku: 'WE-001', revenue: 45000 },
  { name: 'Yoga Mat Blue', sku: 'YM-BLU', revenue: 32000 },
  { name: 'Laptop Stand', sku: 'LS-PRO', revenue: 15000 },
];
const mockRecentSales: any[] = [];