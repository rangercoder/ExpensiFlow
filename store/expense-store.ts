import { create } from "zustand";
import { useUserStore } from "./user-store";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
  paymentMode: string;
  createdAt: string;
  userId: number;
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
  fetchExpenses: () => Promise<void>;
  addExpense: (
    expense: Omit<Expense, "id" | "createdAt" | "userId">
  ) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  getFilteredExpenses: () => Expense[];
  getAnalyticsData: () => Promise<any[]>;
}

const defaultFilters: ExpenseFilters = {
  dateRange: { from: null, to: null },
  categories: [],
  paymentModes: [],
  searchQuery: "",
};

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  filters: defaultFilters,

  fetchExpenses: async () => {
    const user = useUserStore.getState().currentUser;
    if (!user) return set({ expenses: [] });
    const res = await fetch(`/api/expenses?userId=${user.userId}`);
    const data = await res.json();
    set({ expenses: data });
  },

  addExpense: async (expense) => {
    const user = useUserStore.getState().currentUser;
    if (!user) return;
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...expense, userId: user.userId }),
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to add expense:", error);
      alert("Failed to add expense: " + (error.error || "Unknown error"));
      return;
    }
    const newExpense = await res.json();
    set((state) => ({ expenses: [...state.expenses, newExpense] }));
  },

  updateExpense: async (id, expense) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    const updated = await res.json();
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
    }));
  },

  deleteExpense: async (id) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  getFilteredExpenses: () => {
    const { expenses, filters } = get();
    return expenses.filter((expense) => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const expenseDate = new Date(expense.date);
        if (filters.dateRange.from && expenseDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && expenseDate > filters.dateRange.to)
          return false;
      }

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(expense.category)
      ) {
        return false;
      }

      // Payment mode filter
      if (
        filters.paymentModes.length > 0 &&
        !filters.paymentModes.includes(expense.paymentMode)
      ) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          (expense.notes ?? '').toLowerCase().includes(query) ||
          (expense.category ?? '').toLowerCase().includes(query) ||
          (expense.paymentMode ?? '').toLowerCase().includes(query)
        );
      }

      return true;
    });
  },

  getAnalyticsData: async () => {
    const user = useUserStore.getState().currentUser;
    if (!user) return [];
    const res = await fetch(`/api/expenses/analytics?userId=${user.userId}`);
    const data = await res.json();
    return data;
  },
}));

export const EXPENSE_CATEGORIES = [
  "Rental",
  "Groceries",
  "Travel",
  "Entertainment",
  "Bills & Utilities",
  "Investment",
  "Healthcare",
  "Education",
  "Other",
];

export const PAYMENT_MODES = [
  "UPI",
  "Cash",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Other",
];
