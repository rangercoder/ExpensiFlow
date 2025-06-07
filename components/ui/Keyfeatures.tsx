'use client';

import { PlusCircle, TrendingUp, BarChart3 } from 'lucide-react';

export function KeyFeatures() {
  return (
   <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8 text-[#30437A]">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-[#4DC9A9]/10">
                <PlusCircle className="w-6 h-6 text-[#4DC9A9]" />
              </div>
            </div>
            <h3 className="font-medium text-[#30437A]">Easy Expense Entry</h3>
            <p className="text-sm text-[#30437A]/60">
              Quick and intuitive expense recording with smart categorization
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-[#30437A]/10">
                <TrendingUp className="w-6 h-6 text-[#30437A]" />
              </div>
            </div>
            <h3 className="font-medium text-[#30437A]">Smart Analytics</h3>
            <p className="text-sm text-[#30437A]/60">
              Visualize spending patterns with interactive charts and insights
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-[#4DC9A9]/10">
                <BarChart3 className="w-6 h-6 text-[#4DC9A9]" />
              </div>
            </div>
            <h3 className="font-medium text-[#30437A]">Advanced Filtering</h3>
            <p className="text-sm text-[#30437A]/60">
              Filter expenses by date, category, payment mode, and more
            </p>
          </div>
        </div>
      </div>
  );
}
