'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EXPENSE_CATEGORIES } from '@/store/expense-store';

interface AnalyticsChartProps {
  data: any[];
}

const COLORS = {
  'Food & Dining': '#4DC9A9',
  'Transportation': '#30437A',
  'Shopping': '#6B8DD6',
  'Entertainment': '#8ED1FC',
  'Bills & Utilities': '#37B7C3',
  'Healthcare': '#4DC9A9',
  'Education': '#30437A',
  'Travel': '#6B8DD6',
  'Groceries': '#8ED1FC',
  'Personal Care': '#37B7C3',
  'Home & Garden': '#4DC9A9',
  'Investment': '#30437A',
  'Insurance': '#6B8DD6',
  'Taxes': '#8ED1FC',
  'Charity': '#37B7C3',
  'Other': '#9CA3AF',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white border border-[#4DC9A9]/20 rounded-lg shadow-lg p-4 space-y-2">
        <p className="font-medium text-[#30437A]">{`Month: ${label}`}</p>
        <p className="text-sm text-[#30437A]/70">{`Total: $${total.toFixed(2)}`}</p>
        <div className="space-y-1">
          {payload
            .filter((entry: any) => entry.value > 0)
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[#30437A]">{entry.dataKey}</span>
                </div>
                <span className="font-medium text-[#30437A]">${entry.value.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#30437A]/60">
        No data available for chart
      </div>
    );
  }

  // Get all unique categories from the data
  const categories = Array.from(
    new Set(
      data.flatMap(item => 
        Object.keys(item).filter(key => key !== 'month' && item[key] > 0)
      )
    )
  );

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4DC9A9" className="opacity-20" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            stroke="#30437A"
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1);
              return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }}
          />
          <YAxis 
            className="text-xs"
            stroke="#30437A"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', color: '#30437A' }}
            iconType="rect"
          />
          {categories.map((category) => (
            <Bar
              key={category}
              dataKey={category}
              stackId="1"
              fill={COLORS[category as keyof typeof COLORS] || '#9CA3AF'}
              radius={category === categories[categories.length - 1] ? [2, 2, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}