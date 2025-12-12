'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// This is placeholder data. In a real app, you would fetch this data based on the selected date range.
const data = [
  { name: 'Day 1', revenue: 4000 },
  { name: 'Day 5', revenue: 3000 },
  { name: 'Day 10', revenue: 5000 },
  { name: 'Day 15', revenue: 2780 },
  { name: 'Day 20', revenue: 6890 },
  { name: 'Day 25', revenue: 5390 },
  { name: 'Day 30', revenue: 7490 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
          labelStyle={{ color: '#cbd5e1' }}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}