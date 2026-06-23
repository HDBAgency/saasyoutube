import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saasyoutube/db';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Email et mot de passe requis (6 caractères min).' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, plan: 'pending' },
  });

  setSessionCookie({ email, plan: 'pending' });
  return NextResponse.json({ ok: true });
}
