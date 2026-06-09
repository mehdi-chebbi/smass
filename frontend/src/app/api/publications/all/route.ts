import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = `${BACKEND}/api/publications/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const headers: Record<string,string> = {};
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  const res = await fetch(url, { headers });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
