import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const body = await req.arrayBuffer();
  const contentType = req.headers.get('content-type') || '';
  const headers: Record<string,string> = { 'Content-Type': contentType };
  if (auth) headers['Authorization'] = auth;
  const res = await fetch(`${BACKEND}/api/upload`, { method: 'POST', headers, body });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
