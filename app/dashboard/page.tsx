'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Crown, Calculator, Package, TrendingUp, 
  ShoppingCart, AlertTriangle, Download, ArrowUpRight, 
  HelpCircle, MessageSquare, Sparkles, Globe, 
  ArrowRight, Activity, Zap, ExternalLink, X,
  LogOut, Star, User as UserIcon, Settings, Bell, ChevronDown, Heart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TOOLS } from '../config/tools.config';

type DashboardMode = 'standard' | 'premium';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<DashboardMode>('standard');
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true); 
  const [showNewToolAlert, setShowNewToolAlert] = useState(true);
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

    const loadFavorites = () => {
      const saved = localStorage.getItem('userFavorites');
      if (saved) setFavorites(JSON.parse(saved));
    };

    loadFavorites();
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => window.removeEventListener('favoritesUpdated', loadFavorites);
  }, [router]);

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter(f => f !== slug)
      : [...favorites, slug];
    setFavorites(updated);
    localStorage.setItem('userFavorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Dashboard</h1>
            <p className="text-[10px] text-gray-500">Tool Control Center</p>
          </div>
        </div>
        <Bell className="w-5 h-5 text-gray-500" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* GREETING */}
        <div>
          <h2 className="text-2xl font-bold">{getGreeting()}, {user?.email?.split('@')[0]}</h2>
          <p className="text-sm text-gray-500">Choose a tool and get work done faster.</p>
        </div>

        {/* QUICK TOOL LAUNCHER (NEW) */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">Quick Tool Launcher</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TOOLS.slice(0, 6).map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="p-3 rounded-lg border hover:border-blue-500 hover:shadow transition"
              >
                <p className="text-sm font-medium">{tool.label}</p>
                <p className="text-xs text-gray-400 mt-1">Open tool →</p>
              </Link>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              <SimpleStat icon={<Calculator />} label="Calculations" value="0" />
              <SimpleStat icon={<Package />} label="Saved Items" value="0" />
              <SimpleStat icon={<Activity />} label="Usage" value="0" />
            </div>

            {/* RECOMMENDED TOOL (NEW) */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-bold text-sm text-blue-900">Recommended Next Tool</h3>
              <p className="text-xs text-blue-700 mb-3">
                Most sellers start with profit and pricing calculations.
              </p>
              <Link href="/tools/calculator" className="font-bold text-blue-600 hover:underline">
                Open Profit Calculator →
              </Link>
            </div>

            {/* EMPTY ACTIVITY */}
            <div className="bg-white rounded-xl border p-6 text-center">
              <Activity className="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">No activity yet</p>
              <Link href="/tools" className="text-blue-600 text-sm font-bold">
                Explore Tools →
              </Link>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* FAVORITES */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-3">
                Favorite Tools
              </h3>
              {favorites.length ? favorites.map(slug => (
                <div key={slug} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <Link href={`/tools/${slug}`} className="text-sm">{slug}</Link>
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </div>
              )) : (
                <p className="text-xs text-gray-400">No favorites yet</p>
              )}
            </div>

            {/* TOOL CATEGORIES (NEW) */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-3">
                Tool Categories
              </h3>
              <div className="space-y-2 text-sm">
                <Link href="/tools?cat=amazon">Amazon Seller Tools →</Link>
                <Link href="/tools?cat=pricing">Pricing & Margin →</Link>
                <Link href="/tools?cat=listing">Listing & SEO →</Link>
                <Link href="/tools?cat=utilities">Utilities →</Link>
              </div>
            </div>

            {/* SUPPORT */}
            <div className="bg-gray-900 text-white rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2">Need Help?</h3>
              <p className="text-xs text-gray-400 mb-3">
                Tools are built using seller feedback.
              </p>
              <Link href="/feedback" className="bg-white text-gray-900 px-3 py-2 rounded text-xs font-bold">
                Send Feedback
              </Link>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

/* SUB COMPONENTS */

function SimpleStat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
