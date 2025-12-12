// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowUpRight, Package, ShoppingCart, TrendingUp, AlertTriangle, Download, Calendar } from 'lucide-react';
import { DateRangePicker } from '../components/ui/DateRangePicker'; // NEW: We'll create this component
import { RevenueChart } from '../components/charts/RevenueChart'; // NEW: We'll create this component

// --- Types ---
type DashboardData = {
  totalUnits: number;
  totalRevenue: number;
  productCount: number;
  lowStockCount: number;
  lowStockItems: any[]; // NEW: To hold the list of low stock items
  aov: number; // NEW: Average Order Value
  recentSales: any[];
  topProducts: any[];
};

// NEW: Add a date range parameter to the data fetching function
async function getDashboardData(dateRange: { from: Date; to: Date }): Promise<DashboardData> {
  const { from, to } = dateRange;

  // 1. Fetch Aggregated Sales Data
  const salesGroup = await prisma.sale.groupBy({
    by: ['productId'],
    _sum: { units: true, revenue: true },
    where: { date: { gte: from, lte: to } },
  });

  // 2. Fetch specific counts and lists
  const [productCount, lowStockItems, recentSales, allProducts] = await Promise.all([
    prisma.product.count(),
    prisma.inventory.findMany({ 
        where: { onHand: { gt: 0, lt: 20 } },
        include: { product: { select: { name: true, sku: true } } } // NEW: Include product details
    }),
    prisma.sale.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      where: { date: { gte: from, lte: to } }, // NEW: Filter by date range
      include: { product: true },
    }),
    prisma.product.findMany({ select: { id: true, name: true, sku: true } })
  ]);

  const totalUnits = salesGroup.reduce((acc, s) => acc + (s._sum.units ?? 0), 0);
  const totalRevenue = salesGroup.reduce((acc, s) => acc + Number(s._sum.revenue ?? 0), 0);
  
  // NEW: Calculate Average Order Value
  const totalSalesCount = await prisma.sale.count({ where: { date: { gte: from, lte: to } } });
  const aov = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

  const topProducts = salesGroup.map(group => {
    const product = allProducts.find(p => p.id === group.productId);
    return {
      name: product?.name || 'Unknown Product',
      sku: product?.sku || 'N/A',
      revenue: Number(group._sum.revenue ?? 0),
      units: group._sum.units ?? 0,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  return { 
    totalUnits, 
    totalRevenue, 
    productCount, 
    lowStockCount: lowStockItems.length, 
    lowStockItems, // NEW: Pass the list
    aov, // NEW: Pass the calculated AOV
    recentSales, 
    topProducts 
  };
}

export default async function DashboardPage() {
  // NEW: Set a default date range for the initial load
  const defaultDateRange = {
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  };
  const data = await getDashboardData(defaultDateRange);

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
              Overview for the selected period.
            </p>
          </div>
          <div className="flex gap-3">
             {/* NEW: Date Range Picker Component */}
             <DateRangePicker />
             <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-all"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Open Image Tools
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"> {/* Changed to 5 columns */}
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
          {/* NEW: Average Order Value KPI */}
          <StatCard
            title="Avg. Order Value"
            value={data.aov.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            icon={<TrendingUp className="h-4 w-4 text-indigo-400" />}
            color="indigo"
          />
          <StatCard
            title="Low Stock Alerts"
            value={data.lowStockCount.toString()}
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            color="amber"
            highlight={data.lowStockCount > 0}
          />
        </div>

        {/* NEW: Revenue Trend Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="font-bold text-lg mb-4 text-white">Revenue Trend</h3>
          <RevenueChart />
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          
          {/* Top Selling Products (4 Columns) */}
          <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Top Performing Products</h3>
              {/* NEW: Export Button */}
              <ExportButton data={data.topProducts} filename="top-products.csv" />
            </div>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
              <ExportButton data={data.recentSales} filename="recent-sales.csv" />
            </div>
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

        {/* NEW: Detailed Low Stock Alert Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Low Stock Alerts
            </h3>
            {data.lowStockItems.length === 0 ? (
                 <div className="text-slate-500 text-sm">All stock levels are healthy.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase border-b border-slate-800">
                            <tr>
                                <th className="pb-3">Product Name</th>
                                <th className="pb-3">SKU</th>
                                <th className="pb-3">Current Stock</th>
                                <th className="pb-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.lowStockItems.map((item) => (
                                <tr key={item.id} className="border-b border-slate-800/50">
                                    <td className="py-3 font-medium text-slate-200">{item.product.name}</td>
                                    <td className="py-3 text-slate-500">{item.product.sku}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.onHand < 10 ? 'bg-red-900/30 text-red-400' : 'bg-amber-900/30 text-amber-400'}`}>
                                            {item.onHand} units
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <Link href={`/inventory?sku=${item.product.sku}`} className="text-indigo-400 hover:text-indigo-300">
                                            Update Stock
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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

// --- NEW: Subcomponent: Export Button ---
function ExportButton({ data, filename }: { data: any[], filename: string }) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Simple CSV creation logic
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => Object.values(row).join(','));
    const csvContent = `${headers}\n${csvRows.join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
    >
      <Download className="h-3 w-3" />
      Export CSV
    </button>
  );
}