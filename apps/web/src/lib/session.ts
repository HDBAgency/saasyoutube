import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'fallback_secret_change_me';
const COOKIE = 'vs_session';

export interface SessionPayload {
  email: string;
  plan: 'free' | 'premium' | 'pending';
}

export function setSessionCookie(payload: SessionPayload) {
  cookies().set(COOKIE, jwt.sign(payload, SECRET, { expiresIn: '30d' }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export function getSession(): SessionPayload | null {
  try {
    const token = cookies().get(COOKIE)?.value;
    if (!token) return null;
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}
