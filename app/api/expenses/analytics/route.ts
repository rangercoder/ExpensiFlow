import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const expenses = await Expense.find({ userId }).lean();
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
