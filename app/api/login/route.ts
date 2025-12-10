import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();

  // --- DEBUGGING LOGS (Delete these later!) ---
  console.log("------------------------------------------------");
  console.log("1. Password from User:", password);
  console.log("2. Password in Vercel Env:", process.env.ADMIN_PASSWORD);
  console.log("3. Do they match?", password === process.env.ADMIN_PASSWORD);
  console.log("------------------------------------------------");
  // ---------------------------------------------

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  return res;
}