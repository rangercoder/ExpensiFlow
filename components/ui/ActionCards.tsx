'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { PlusCircle, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ActionCards() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[#4DC9A9]/20 hover:border-[#4DC9A9]/40" onClick={() => router.push('/expenses')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <PlusCircle className="w-8 h-8 text-[#4DC9A9]" />
              <div>
                <CardTitle className="text-[#30437A]">Track Expenses</CardTitle>
                <CardDescription className="text-[#30437A]/60">
                  Add and manage your daily expenses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#30437A]/60 mb-4">
              Easily record your expenses with detailed categorization and smart filtering options.
            </p>
            <Button asChild className="w-full bg-[#4DC9A9] hover:bg-[#4DC9A9]/90 text-white">
              <Link href="/expenses">
                Start Tracking
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[#30437A]/20 hover:border-[#30437A]/40" onClick={() => router.push('/analytics')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-[#30437A]" />
              <div>
                <CardTitle className="text-[#30437A]">View Analytics</CardTitle>
                <CardDescription className="text-[#30437A]/60">
                  Analyze your spending patterns
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#30437A]/60 mb-4">
              Get insights into your spending habits with interactive charts and detailed breakdowns.
            </p>
            <Button asChild variant="outline" className="w-full border-[#30437A] text-[#30437A] hover:bg-[#30437A] hover:text-white">
              <Link href="/analytics">
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}
