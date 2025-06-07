import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const user = await User.findById(params.id).lean();
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 