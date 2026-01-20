'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Calculator, Package, Activity, Bell, Heart, Search
} from 'lucide-react';
import { TOOLS } from '../config/tools.config';

/* ---------------- TYPES ---------------- */
type DashboardMode = 'standard';

/* ---------------- PAGE ---------------- */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* Favorites */
  const [favorites, setFavorites] = useState<string[]>([]);

  /* Tool Search */
  const [query, setQuery] = useState('');

  /* Usage Tracking */
  const [usageCount, setUsageCount] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push('/login');
      setUser(data.user);
      setLoading(false);
    };
    init();

    /* Load favorites */
    const favs = localStorage.getItem('userFavorites');
    if (favs) setFavorites(JSON.parse(favs));

    /* Load usage */
    const usage = localStorage.getItem('toolUsageCount');
    setUsageCount(usage ? Number(usage) : 0);
  }, [router]);

  const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter(f => f !== slug)
      : [...favorites, slug];
    setFavorites(updated);
    localStorage.setItem('userFavorites', JSON.stringify(updated));
  };

  /* Search logic (fast, client-only) */
  const filteredTools = useMemo(() => {
    return TOOLS.filter(t =>
      t.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Smart Seller…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* TOP BAR */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Dashboard</h1>
            <p className="text-[10px] text-gray-500">Seller Tool Control Center</p>
          </div>
        </div>
        <Bell className="w-5 h-5 text-gray-500" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* GREETING */}
        <div>
          <h2 className="text-2xl font-bold">
            Welcome, {user?.email?.split('@')[0]}
          </h2>
          <p className="text-sm text-gray-500">
            Find the right tool and execute faster.
          </p>
        </div>

        {/* TOOL SEARCH (NEW) */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools (profit, gst, inventory...)"
            className="flex-1 text-sm outline-none"
          />
        </div>

        {/* QUICK TOOL LAUNCHER */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Quick Tool Launcher</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(query ? filteredTools : TOOLS.slice(0, 6)).map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                onClick={() => {
                  const count = Number(localStorage.getItem('toolUsageCount') || 0) + 1;
                  localStorage.setItem('toolUsageCount', String(count));
                  setUsageCount(count);
                }}
                className="p-3 rounded-lg border hover:border-blue-500 hover:shadow transition"
              >
                <p className="text-sm font-medium">{tool.label}</p>
                <p className="text-xs text-gray-400">Open tool →</p>
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
              <SimpleStat icon={<Calculator />} label="Calculations" value={usageCount} />
              <SimpleStat icon={<Package />} label="Saved Items" value="0" />
              <SimpleStat icon={<Activity />} label="Tool Uses" value={usageCount} />
            </div>

            {/* RECOMMENDED TOOL */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-bold text-sm text-blue-900">
                Recommended Next Step
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                Most sellers optimize pricing before scaling ads.
              </p>
              <Link
                href="/tools/calculator"
                className="font-bold text-blue-600 hover:underline"
              >
                Open Profit Calculator →
              </Link>
            </div>

            {/* MONETIZATION PLACEHOLDER (SAFE) */}
            <div className="bg-gray-900 text-white rounded-xl p-5">
              <p className="text-sm font-bold mb-1">
                Pro Tools Coming Soon
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Advanced analytics, exports, and saved history.
              </p>
              <button className="text-xs font-bold bg-white text-gray-900 px-3 py-2 rounded">
                Join Waitlist
              </button>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* FAVORITES */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-3">
                Favorite Tools
              </h3>
              {favorites.length ? favorites.map(slug => (
                <div
                  key={slug}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <Link href={`/tools/${slug}`} className="text-sm">
                    {slug.replace(/-/g, ' ')}
                  </Link>
                  <button onClick={() => toggleFavorite(slug)}>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>
              )) : (
                <p className="text-xs text-gray-400">No favorites yet</p>
              )}
            </div>

            {/* TOOL CATEGORIES */}
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

          </div>
        </div>

      </main>
    </div>
  );
}

/* ---------------- SUB COMPONENT ---------------- */
function SimpleStat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border flex items-center gap-3 shadow-sm">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
