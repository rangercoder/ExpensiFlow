import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
  paymentMode: string;
  createdAt: string;
}

export interface ExpenseFilters {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  categories: string[];
  paymentModes: string[];
  searchQuery: string;
}

interface ExpenseState {
  expenses: Expense[];
  filters: ExpenseFilters;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  getFilteredExpenses: () => Expense[];
  getAnalyticsData: () => any[];
}

const defaultFilters: ExpenseFilters = {
  dateRange: { from: null, to: null },
  categories: [],
  paymentModes: [],
  searchQuery: '',
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      filters: defaultFilters,
      
      addExpense: (expense) => set((state) => ({
        expenses: [
          ...state.expenses,
          {
            ...expense,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      
      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === id ? { ...e, ...expense } : e
        ),
      })),
      
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      })),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      getFilteredExpenses: () => {
        const { expenses, filters } = get();
        return expenses.filter((expense) => {
          // Date range filter
          if (filters.dateRange.from || filters.dateRange.to) {
            const expenseDate = new Date(expense.date);
            if (filters.dateRange.from && expenseDate < filters.dateRange.from) return false;
            if (filters.dateRange.to && expenseDate > filters.dateRange.to) return false;
          }
          
          // Category filter
          if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
            return false;
          }
          
          // Payment mode filter
          if (filters.paymentModes.length > 0 && !filters.paymentModes.includes(expense.paymentMode)) {
            return false;
          }
          
          // Search query filter
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return (
              expense.notes.toLowerCase().includes(query) ||
              expense.category.toLowerCase().includes(query) ||
              expense.paymentMode.toLowerCase().includes(query)
            );
          }
          
          return true;
        });
      },
      
      getAnalyticsData: () => {
        const { expenses } = get();
        const monthlyData: { [key: string]: { [category: string]: number } } = {};
        
        expenses.forEach((expense) => {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {};
          }
          
          if (!monthlyData[monthKey][expense.category]) {
            monthlyData[monthKey][expense.category] = 0;
          }
          
          monthlyData[monthKey][expense.category] += expense.amount;
        });
        
        return Object.entries(monthlyData)
          .map(([month, categories]) => ({
            month,
            ...categories,
          }))
          .sort((a, b) => a.month.localeCompare(b.month));
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Personal Care',
  'Home & Garden',
  'Investment',
  'Insurance',
  'Taxes',
  'Charity',
  'Other',
];

export const PAYMENT_MODES = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Digital Wallet',
  'UPI',
  'Check',
  'Other',
];