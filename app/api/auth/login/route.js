import { NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body;

  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await comparePassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ email });
  const res = NextResponse.json({ ok: true, user: { email, role: 'admin' } });
  res.cookies.set('ain_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return res;
}
