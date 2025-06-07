'use client';

import { useState } from 'react';
import { ExpenseForm } from '@/components/expense-form';
import { ExpenseList } from '@/components/expense-list';
import { ExpenseFilters } from '@/components/expense-filters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExpenseStore } from '@/store/expense-store';
import { PlusCircle, Filter, List } from 'lucide-react';

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState('add');
  const { expenses, getFilteredExpenses } = useExpenseStore();
  
  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#30437A]">Expense Tracker</h1>
        <p className="text-[#30437A]/70">
          Manage your expenses with ease and precision
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#4DC9A9]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Total Expenses</CardTitle>
            <PlusCircle className="h-4 w-4 text-[#4DC9A9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-[#30437A]/60">
              {filteredExpenses.length} expense(s)
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-[#30437A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">This Month</CardTitle>
            <Filter className="h-4 w-4 text-[#30437A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">
              ${expenses
                .filter(expense => {
                  const expenseDate = new Date(expense.date);
                  const now = new Date();
                  return expenseDate.getMonth() === now.getMonth() && 
                         expenseDate.getFullYear() === now.getFullYear();
                })
                .reduce((sum, expense) => sum + expense.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-[#30437A]/60">
              Current month total
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-[#4DC9A9]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#30437A]">Categories</CardTitle>
            <List className="h-4 w-4 text-[#4DC9A9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30437A]">
              {new Set(expenses.map(expense => expense.category)).size}
            </div>
            <p className="text-xs text-[#30437A]/60">
              Unique categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[#4DC9A9]/10">
          <TabsTrigger value="add" className="data-[state=active]:bg-[#4DC9A9] data-[state=active]:text-white">Add Expense</TabsTrigger>
          <TabsTrigger value="filter" className="data-[state=active]:bg-[#4DC9A9] data-[state=active]:text-white">Filter & Search</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-[#4DC9A9] data-[state=active]:text-white">Expense List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4">
          <Card className="border-[#4DC9A9]/20">
            <CardHeader>
              <CardTitle className="text-[#30437A]">Add New Expense</CardTitle>
              <CardDescription className="text-[#30437A]/60">
                Record a new expense with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="filter" className="space-y-4">
          <Card className="border-[#30437A]/20">
            <CardHeader>
              <CardTitle className="text-[#30437A]">Filter Expenses</CardTitle>
              <CardDescription className="text-[#30437A]/60">
                Use filters to find specific expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseFilters />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <ExpenseList />
        </TabsContent>
      </Tabs>
    </div>
  );
}