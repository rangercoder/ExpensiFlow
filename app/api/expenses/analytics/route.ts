import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function GET() {
  await dbConnect();
  const expenses = await Expense.find().lean();
  const monthly: Record<string, Record<string, number>> = {};

  expenses.forEach((e: any) => {
    const month = e.date.slice(0,7);
    if (!monthly[month]) monthly[month] = {};
    if (!monthly[month][e.category]) monthly[month][e.category] = 0;
    monthly[month][e.category] += e.amount;
  });

  const result = Object.entries(monthly)
    .map(([month, categories]) => ({ month, ...categories }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return NextResponse.json(result);
}
