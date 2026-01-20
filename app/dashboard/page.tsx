'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calculator,
  Package,
  Activity,
  Bell,
  Heart,
  Search,
} from 'lucide-react';
import { TOOLS } from '../config/tools.config';

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

  /* ✅ C. Loading feedback for tool click */
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push('/login');
      setUser(data.user);
      setLoading(false);
    };
    init();

    const favs = localStorage.getItem('userFavorites');
    if (favs) setFavorites(JSON.parse(favs));

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

  /* ✅ A. Client-side search */
  const filteredTools = useMemo(() => {
    const q = query.toLowerCase();
    return TOOLS.filter(t =>
      t.label.toLowerCase().includes(q)
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
            <p className="text-[10px] text-gray-500">
              Seller Tool Control Center
            </p>
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

        {/* SEARCH */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tools (profit, image, inventory...)"
              className="flex-1 text-sm outline-none"
            />
          </div>

          {/* ✅ A. Search feedback */}
          {query && (
            <p className="mt-2 text-xs text-gray-500">
              Showing <strong>{filteredTools.length}</strong> result
              {filteredTools.length !== 1 && 's'} for “{query}”
            </p>
          )}
        </div>

        {/* QUICK TOOL LAUNCHER */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">
            Quick Tool Launcher
          </h3>

          {/* ✅ B. Empty state */}
          {query && filteredTools.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-6">
              <p className="font-medium mb-1">
                More tools coming soon for sellers.
              </p>
              <p>
                We’re actively expanding this toolbox.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(query ? filteredTools : TOOLS.slice(0, 6)).map(tool => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={() => {
                    setLoadingSlug(tool.slug);
                    const count =
                      Number(localStorage.getItem('toolUsageCount') || 0) + 1;
                    localStorage.setItem('toolUsageCount', String(count));
                    setUsageCount(count);
                  }}
                  className="p-3 rounded-lg border hover:border-blue-500 hover:shadow transition flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {tool.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {loadingSlug === tool.slug ? 'Opening…' : 'Open tool →'}
                    </p>
                  </div>

                  {/* ✅ C. Loading spinner */}
                  {loadingSlug === tool.slug && (
                    <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              <SimpleStat
                icon={<Calculator />}
                label="Calculations"
                value={usageCount}
              />
              <SimpleStat
                icon={<Package />}
                label="Saved Items"
                value="0"
              />
              <SimpleStat
                icon={<Activity />}
                label="Tool Uses"
                value={usageCount}
              />
            </div>

            {/* RECOMMENDED */}
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
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* FAVORITES */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-3">
                Favorite Tools
              </h3>
              {favorites.length ? (
                favorites.map(slug => (
                  <div
                    key={slug}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <Link
                      href={`/tools/${slug}`}
                      className="text-sm"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                    <button onClick={() => toggleFavorite(slug)}>
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">
                  No favorites yet
                </p>
              )}
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
