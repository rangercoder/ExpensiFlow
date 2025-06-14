import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const data = await req.json();
    if (typeof data.userId !== 'number') {
      return NextResponse.json({ error: 'userId (number) is required' }, { status: 400 });
    }
    const expense = await Expense.create(data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error saving expense:', error);
    const details = typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error);
    return NextResponse.json({ error: 'Failed to save expense', details }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query: any = {};

  const userId = searchParams.get('userId');
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({ error: 'userId (number) is required' }, { status: 400 });
  }
  query.userId = Number(userId);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (from || to) {
    query.date = {} as any;
    if (from) query.date.$gte = from;
    if (to) query.date.$lte = to;
  }

  const categories = searchParams.get('category');
  if (categories) {
    query.category = { $in: categories.split(',') };
  }

  const paymentModes = searchParams.get('paymentMode');
  if (paymentModes) {
    query.paymentMode = { $in: paymentModes.split(',') };
  }

  const expenses = await Expense.find(query).sort({ date: -1 }).lean();
  return NextResponse.json(expenses);
}
