import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function GET() {
  await dbConnect();
  const users = await User.find().lean();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  if (!data.name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  // Find the max userId and increment
  const lastUser = await User.findOne().sort({ userId: -1 }).lean();
  const nextUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;
  const user = await User.create({ name: data.name, userId: nextUserId });
  return NextResponse.json(user, { status: 201 });
} 