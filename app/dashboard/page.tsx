// app/dashboard/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getDashboardData() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [salesGroup, productCount, lowStock] = await Promise.all([
    prisma.sale.groupBy({
      by: ['productId'],
      _sum: { units: true, revenue: true },
      where: { date: { gte: since } },
    }),
    prisma.product.count(),
    prisma.inventory.count({
      where: {
        onHand: { gt: 0, lt: 20 }, // simple "low stock" rule
      },
    }),
  ]);

  const totalUnits = salesGroup.reduce<number>(
  (acc, s) => acc + (s._sum?.units ?? 0),
  0
);

const totalRevenue = salesGroup.reduce<number>(
  (acc, s) => acc + Number(s._sum?.revenue ?? 0),
  0
);


  return { totalUnits, totalRevenue, productCount, lowStock };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="pt-24 pb-10 px-4 md:px-8 bg-slate-950 text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Seller Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">
              Last 30 days performance · Inventory overview.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium shadow-lg shadow-indigo-900/30 hover:bg-indigo-500"
          >
            Open tools
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Revenue (30d)"
            value={
              data.totalRevenue
                ? data.totalRevenue.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  })
                : '₹0'
            }
          />
          <StatCard label="Units sold (30d)" value={data.totalUnits.toString()} />
          <StatCard label="Active SKUs" value={data.productCount.toString()} />
          <StatCard
            label="Low stock SKUs"
            value={data.lowStock.toString()}
            highlight={data.lowStock > 0}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold ${
          highlight ? 'text-amber-300' : 'text-slate-50'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
