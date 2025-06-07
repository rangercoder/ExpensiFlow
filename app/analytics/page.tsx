'use client';

import { AnalyticsChart } from '@/components/analytics-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenseStore } from '@/store/expense-store';
import { BarChart3, TrendingUp, Calendar, IndianRupee} from 'lucide-react';

export default function AnalyticsPage() {
  const { expenses, fetchExpenses, getAnalyticsData } = useExpenseStore();
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    getAnalyticsData().then(setAnalyticsData);
  }, [expenses, getAnalyticsData]);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageMonthly = analyticsData.length > 0 ? 
    analyticsData.reduce((sum, month) => {
      const monthTotal = Object.keys(month)
        .filter(key => key !== 'month')
        .reduce((total, category) => total + (month[category] || 0), 0);
      return sum + monthTotal;
    }, 0) / analyticsData.length : 0;

  const topCategory = expenses.length > 0 ? 
    Object.entries(
      expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a)[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#30437A]">Expense Analytics</h1>
        <p className="text-[#30437A]/70">
          Visualize your spending patterns and trends
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#4DC9A9]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Total Spent</CardTitle>
            <IndianRupee className="h-4 w-4 text-[#4DC9A9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">₹{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-[#30437A]/60">
              All time total
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-[#30437A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#30437A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">₹{averageMonthly.toFixed(2)}</div>
            <p className="text-xs text-[#30437A]/60">
              Across {analyticsData.length} months
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-[#4DC9A9]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Top Category</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#4DC9A9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">
              {topCategory ? topCategory[0] : 'N/A'}
            </div>
            <p className="text-xs text-[#30437A]/60">
              {topCategory ? `₹${topCategory[1].toFixed(2)}` : 'No data'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-[#30437A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Time Period</CardTitle>
            <Calendar className="h-4 w-4 text-[#30437A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">{analyticsData.length}</div>
            <p className="text-xs text-[#30437A]/60">
              Months with data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="border-[#4DC9A9]/20">
        <CardHeader>
          <CardTitle className="text-[#30437A]">Monthly Spending by Category</CardTitle>
          <CardDescription className="text-[#30437A]/60">
            Stacked bar chart showing spending trends across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.length > 0 ? (
            <AnalyticsChart data={analyticsData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <BarChart3 className="h-12 w-12 text-[#30437A]/40" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-[#30437A]">No Data Available</h3>
                <p className="text-sm text-[#30437A]/60 max-w-md">
                  Start adding expenses to see analytics and spending trends. Your data will appear here as you track more expenses.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}