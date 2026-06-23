import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ plan: 'free', email: null });
  return NextResponse.json({ plan: session.plan, email: session.email });
}
