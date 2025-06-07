'use client';

import { useState } from 'react';
import { useExpenseStore } from '@/store/expense-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Calendar, DollarSign, Trash2, Search, SortAsc, SortDesc, Package } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

export function ExpenseList({ expenses: propExpenses }: { expenses?: any[] }) {
  const { getFilteredExpenses, deleteExpense } = useExpenseStore();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const expenses = propExpenses ?? getFilteredExpenses();

  // Additional local filtering for search
  const filteredExpenses = expenses.filter(expense =>
    (expense.notes ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expense.category ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expense.paymentMode ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    await useExpenseStore.getState().fetchExpenses();
    toast.success('Expense deleted successfully');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Rental': 'bg-[#4DC9A9]/10 text-[#4DC9A9] border-[#4DC9A9]/20',
      'Transportation': 'bg-[#30437A]/10 text-[#30437A] border-[#30437A]/20',
      'Travel': 'bg-[#6B8DD6]/10 text-[#6B8DD6] border-[#6B8DD6]/20',
      'Entertainment': 'bg-[#8ED1FC]/10 text-[#8ED1FC] border-[#8ED1FC]/20',
      'Bills & Utilities': 'bg-[#37B7C3]/10 text-[#37B7C3] border-[#37B7C3]/20',
      'Healthcare': 'bg-[#4DC9A9]/10 text-[#4DC9A9] border-[#4DC9A9]/20',
      'Education': 'bg-[#30437A]/10 text-[#30437A] border-[#30437A]/20',
      'Others': 'bg-[#6B8DD6]/10 text-[#6B8DD6] border-[#6B8DD6]/20',
      'Groceries': 'bg-[#8ED1FC]/10 text-[#8ED1FC] border-[#8ED1FC]/20',
      'Personal Care': 'bg-[#37B7C3]/10 text-[#37B7C3] border-[#37B7C3]/20',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="border-[#4DC9A9]/20">
        <CardHeader>
          <CardTitle className="text-[#30437A]">Expense List</CardTitle>
          <CardDescription className="text-[#30437A]/60">
            View and manage your expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#30437A]/60" />
              <Input
                placeholder="Search expenses..."
                className="pl-10 border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger className="w-32 border-[#4DC9A9]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="border-[#4DC9A9]/30 text-[#30437A] hover:bg-[#4DC9A9]/10"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="text-sm text-[#30437A]/60">
            Showing {sortedExpenses.length} expense{sortedExpenses.length !== 1 ? 's' : ''} 
            {filteredExpenses.length !== expenses.length && ` (filtered from ${expenses.length})`}
            • Total: ₹{sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Expense Items */}
      {sortedExpenses.length === 0 ? (
        <Card className="border-[#4DC9A9]/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-[#30437A]/40 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-[#30437A]">No expenses found</h3>
            <p className="text-sm text-[#30437A]/60 max-w-md">
              {expenses.length === 0 
                ? "Start adding expenses to see them here. Your expense tracking journey begins now!"
                : "Try adjusting your filters or search terms to find the expenses you're looking for."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedExpenses.map((expense) => (
            <Card key={expense.id || expense._id} className="hover:shadow-md transition-shadow border-[#4DC9A9]/20 hover:border-[#4DC9A9]/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#4DC9A9]" />
                        <span className="text-2xl font-bold text-[#30437A]">₹{expense.amount.toFixed(2)}</span>
                      </div>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                      <Badge variant="outline" className="border-[#30437A]/20 text-[#30437A]">
                        {expense.paymentMode}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#30437A]/60">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(expense.date), 'PPP')}</span>
                    </div>
                    
                    {expense.notes && (
                      <p className="text-sm bg-[#4DC9A9]/5 rounded-md p-3 text-[#30437A]">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#30437A]">Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#30437A]/60">
                          Are you sure you want to delete this expense? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#30437A]/20 text-[#30437A]">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(expense.id || expense._id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}