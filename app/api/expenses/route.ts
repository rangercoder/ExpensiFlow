import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const expense = await Expense.create(data);
  return NextResponse.json(expense, { status: 201 });
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query: any = {};

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
