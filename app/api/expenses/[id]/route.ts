import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const expense = await Expense.findById(params.id).lean();
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(expense);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const expense = await Expense.findByIdAndUpdate(params.id, data, { new: true });
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(expense);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Expense.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
