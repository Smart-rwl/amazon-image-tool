// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowUpRight, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

// --- Types ---
type DashboardData = {
  totalUnits: number;
  totalRevenue: number;
  productCount: number;
  lowStockCount: number;
  recentSales: any[];
  topProducts: any[];
};

async function getDashboardData(): Promise<DashboardData> {
  const since = new Date();
  since.setDate(since.getDate() - 30); // Last 30 Days

  // 1. Fetch Aggregated Sales Data (Grouped by Product)
  const salesGroup = await prisma.sale.groupBy({
    by: ['productId'],
    _sum: { units: true, revenue: true },
    where: { date: { gte: since } },
  });

  // 2. Fetch specific counts and lists
  const [productCount, lowStockCount, recentSales, allProducts] = await Promise.all([
    prisma.product.count(),
    prisma.inventory.count({ where: { onHand: { gt: 0, lt: 20 } } }),
    
    // Fetch Last 5 Sales for the "Recent Activity" table
    prisma.sale.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { product: true }, // Include product details to show names
    }),

    // Fetch all products to map names to the grouped data
    prisma.product.findMany({ select: { id: true, name: true, sku: true } })
  ]);

  // 3. Calculate Totals (With the FIX for the math error)
  const totalUnits = salesGroup.reduce((acc, s) => acc + (s._sum.units ?? 0), 0);
  
  // FIX: Wrap in Number() to prevent "0450012500" text glitch
  const totalRevenue = salesGroup.reduce((acc, s) => acc + Number(s._sum.revenue ?? 0), 0);

  // 4. Calculate Top Products
  // Map product names to the sales data and sort by Revenue
  const topProducts = salesGroup.map(group => {
    const product = allProducts.find(p => p.id === group.productId);
    return {
      name: product?.name || 'Unknown Product',
      sku: product?.sku || 'N/A',
      revenue: Number(group._sum.revenue ?? 0),
      units: group._sum.units ?? 0,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 4); // Take top 4

  return { totalUnits, totalRevenue, productCount, lowStockCount, recentSales, topProducts };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="pt-24 pb-10 px-4 md:px-8 bg-slate-950 text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Seller Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Overview for the last 30 days.
            </p>
          </div>
          <div className="flex gap-3">
             <Link
              href="/tools" // Assuming this is where your "Bulk Image Tool" lives
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-all"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Open Image Tools
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={data.totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
            color="emerald"
          />
          <StatCard
            title="Units Sold"
            value={data.totalUnits.toString()}
            icon={<ShoppingCart className="h-4 w-4 text-blue-400" />}
            color="blue"
          />
          <StatCard
            title="Active SKUs"
            value={data.productCount.toString()}
            icon={<Package className="h-4 w-4 text-purple-400" />}
            color="purple"
          />
          <StatCard
            title="Low Stock Alerts"
            value={data.lowStockCount.toString()}
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            color="amber"
            highlight={data.lowStockCount > 0}
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          
          {/* Top Selling Products (4 Columns) */}
          <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Top Performing Products</h3>
            <div className="space-y-4">
              {data.topProducts.length === 0 ? (
                 <div className="text-slate-500 text-sm">No sales data yet.</div>
              ) : (
                data.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                          #{i + 1}
                       </div>
                       <div>
                          <p className="font-medium text-slate-200">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.sku}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-emerald-400">
                          {product.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                       </p>
                       <p className="text-xs text-slate-500">{product.units} units sold</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Sales Feed (3 Columns) */}
          <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Recent Transactions</h3>
            <div className="space-y-4">
              {data.recentSales.length === 0 ? (
                  <div className="text-slate-500 text-sm">No recent transactions.</div>
              ) : (
                data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex flex-col">
                       <span className="font-medium text-slate-200 text-sm truncate max-w-[150px]">
                          {sale.product?.name || 'Unknown Item'}
                       </span>
                       <span className="text-xs text-slate-500">
                          {new Date(sale.date).toLocaleDateString()} · {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </div>
                    <div className="font-mono text-sm font-bold text-indigo-300">
                       +{sale.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Subcomponent: Stat Card ---
function StatCard({ title, value, icon, color, highlight }: any) {
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