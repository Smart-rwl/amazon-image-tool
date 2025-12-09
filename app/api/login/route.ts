import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  // simple httpOnly cookie
  res.cookies.set('admin_auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  return res;
}
