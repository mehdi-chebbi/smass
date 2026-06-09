import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';
async function proxy(req: NextRequest, method: string) {
  const { searchParams } = new URL(req.url);
  const url = `${BACKEND}/api/publications${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const headers: Record<string,string> = {};
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  if (!['GET','HEAD'].includes(method)) headers['Content-Type'] = 'application/json';
  const body = ['GET','HEAD'].includes(method) ? undefined : await req.text();
  const res = await fetch(url, { method, headers, body });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
export async function GET(req: NextRequest) { return proxy(req, 'GET'); }
export async function POST(req: NextRequest) { return proxy(req, 'POST'); }
